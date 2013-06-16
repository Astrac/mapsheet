(function(globals) {
  'use strict';

  if (typeof(globals.Mapsheet) === 'undefined') {
    globals.Mapsheet = {};
  }

  globals.Mapsheet.Spreadsheet = DropletJS.Class.create({
    id: '',
    title: '',
    author: '',
    updated: null,
    worksheetsFeed: '',
    openLink: '',

    construct: function(id, title, author, updated, worksheetsFeed, openLink) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.updated = updated;
      this.worksheetsFeed = worksheetsFeed;
      this.openLink = openLink;
    },

    getHashId: function() {
      return new Hashes.SHA256().hex(this.id);
    }
  });

  globals.Mapsheet.Worksheet = DropletJS.Class.create({
    id: '',
    title: '',
    cellsFeed: '',
    listFeed: '',

    construct: function(id, title, cellsFeed, listFeed) {
      this.id = id;
      this.title = title;
      this.cellsFeed = cellsFeed;
      this.listFeed = listFeed;
    },

    getHashId: function() {
      return new Hashes.SHA256().hex(this.id);
    }
  });

  globals.Mapsheet.Table = DropletJS.Class.create({
    rows: [],
    headersRow: -1,
    headersCol: -1,

    construct: function(rows) {
      this.rows = rows;
    },

    row: function(id) {
      var row = _.filter(this.rows, function (r) { return r.id === id; });

      if (row.length === 0) {
        return null;
      }

      return row[0];
    },

    colHeaders: function() {
      var row = this.rows[this.headersRow];
      if (row) {
        return row;
      }

      var colIndexes = _.sortBy(_.keys(_.reduce(this.rows, function(memo, row) {
        _.each(row.cells, function(c) {
          memo[c.col] = true;
        });

        return memo;
      }, {})), function(idx) { return idx; });

      if (colIndexes && colIndexes[0] !== 0) {
        colIndexes = _.union(_.range(0, colIndexes[0]), colIndexes);
      }

      return _.map(colIndexes, function(c) { return String.fromCharCode(65 + parseInt(c, 10)); });
    },

    rowHeader: function(idx) {
      var col = this.rows[this.headersCol];
      if (col) {
        return col;
      }

      return _.find(this.rows[idx].cells, function(c) { return c; }).row + 1;
    }
  });

  globals.Mapsheet.Row = DropletJS.Class.create({
    id: null,
    cells: [],

    construct: function(id, cells) {
      this.id = id;
      this.cells = cells;
    },

    cell: function(id) {
      var cell = _.filter(this.cells, function (c) { return id === c.id; });

      if (cell.length === 0) {
        return null;
      }

      return cell[0];
    },

    col: function(colId) {
      var cell = _.filter(this.cells, function (c) { return colId === c.col; });

      if (cell.length === 0) {
        return null;
      }

      return cell[0];
    },

    setCell: function(cell) {
      this.cells[cell.col] = cell;
    }
  });

  globals.Mapsheet.Cell = DropletJS.Class.create({
    id: '',
    name: '',
    row: -1,
    col: -1,
    content: '',

    construct: function(id, name, row, col, content) {
      this.id = id;
      this.name = name;
      this.row = row;
      this.col = col;
      this.content = content;
    }
  });

  globals.Mapsheet.Document = DropletJS.Class.create({
    id: null,
    spreadsheet: null,
    worksheet: null,
    table: null,

    construct: function(spreadsheet, worksheet, table) {
      this.spreadsheet = spreadsheet;
      this.worksheet = worksheet;
      this.id = this.worksheet.getHashId();
      if (table) {
        this.table = table;
      }
    }
  });

  globals.Mapsheet.Project = DropletJS.Class.create({
    documents: [],
    current: null,

    construct: function(documents, current) {
      this.documents = documents;
      if (current) {
        this.current = current;
      } else if (documents) {
        this.current = documents[0];
      }
    },

    setCurrent: function(documentId) {
      var candidates = _.filter(this.documents, function(doc) { return doc.id === documentId; });
      if (candidates) {
        this.current = candidates[0];
      }
    }
  });

  globals.Mapsheet.TableAdapter = DropletJS.Class.create({
    table: null,
    hideCols: [],
    pageSize: 15,
    currentPage: 1, // 1-based pagination

    construct: function(table) {
      this.table = table;
      this.geoBindings = new globals.Mapsheet.GeoBindings();
    },

    totalPages: function() {
      return this.table ? Math.ceil(this.table.rows.length / this.pageSize) : 0;
    },

    hasPrevPage: function() {
      return this.currentPage > 1;
    },

    hasNextPage: function() {
      return this.currentPage < this.totalPages();
    },

    nextPage: function() {
      if (this.hasNextPage()) {
        this.currentPage++;
      }
    },

    prevPage: function() {
      if (this.hasPrevPage()) {
        this.currentPage--;
      }
    },

    view: function() {
      var rows = [];

      if (this.table) {
        var firstRow = (this.currentPage - 1) * this.pageSize;
        var lastRow = firstRow + this.pageSize;
        rows = this.table.rows.slice(firstRow, lastRow);

        var hideCols = this.hideCols;

        rows = _.map(rows, function(r) {
          return _.filter(r.cells, function (c) { return !_.contains(hideCols, c.col); });
        });
      }

      return rows;
    }
  });

  globals.Mapsheet.GeoBindings = DropletJS.Class.create({
    latCol: -1,
    lngCol: -1,
    radCol: -1,

    construct: function(latCol, lngCol, radCol) {
      this.latCol = latCol || -1;
      this.lngCol = lngCol || -1;
      this.radCol = radCol || -1;
    }
  });

  globals.Mapsheet.GeoAdapter = DropletJS.Class.create({
    table: null,
    geoBindings: null,
    showRows: [2,3,4],

    construct: function(table, geoBindings) {
      this.table = table;
      this.geoBindings = geoBindings;
    },

    geoPoint: function(rowId) {
      if (this.table) {
        var row = this.table.row(rowId);
        var maybeLat = row.col(this.geoBindings.latCol);
        var maybeLng = row.col(this.geoBindings.lngCol);
        var maybeRad = row.col(this.geoBindings.radCol);

        if (maybeLat && maybeLng && maybeRad) {
          return new globals.Mapsheet.Circle(row, maybeLat.content, maybeLng.content, maybeRad.content);
        }

        if (maybeLat && maybeLng) {
          return new globals.Mapsheet.Marker(row, maybeLat.content, maybeLng.content);
        }
      }

      return null;
    },

    geoPoints: function() {
      var self = this;
      return _.compact(_.map(this.showRows, function (r) { return self.geoPoint(r); }));
    }
  });

  globals.Mapsheet.GeoRepresentation = DropletJS.Class.create({
    row: DropletJS.Class.NUMBER,
    type: DropletJS.Class.STRING
  });

  globals.Mapsheet.Marker = DropletJS.Class.extend(globals.Mapsheet.GeoRepresentation, {
    lat: -1,
    lng: -1,

    construct: function(row, lat, lng) {
      this.lat = lat;
      this.lng = lng;
      this.row = row;
      this.type = 'marker';
    }
  });

  globals.Mapsheet.Circle = DropletJS.Class.extend(globals.Mapsheet.GeoRepresentation, {
    lat: -1,
    lng: -1,
    rad: -1,

    construct: function(row, lat, lng, rad) {
      this.lat = lat;
      this.lng = lng;
      this.rad = rad;
      this.row = row;
      this.type = 'circle';
    }
  });
}(this));
