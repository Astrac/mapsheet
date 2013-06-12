if (typeof(Mapsheet) === 'undefined') {
  Mapsheet = {};
}

Mapsheet.Spreadsheet = DropletJS.Class.create({
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

Mapsheet.Worksheet = DropletJS.Class.create({
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

Mapsheet.Table = DropletJS.Class.create({
  rows: [],
  headersRow: -1,
  headersCol: -1,

  construct: function(rows) {
    this.rows = rows;
  },

  row: function(id) {
    var row = _.filter(function (r) { return r.id == id; });

    if (row.length == 0) {
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

    if (colIndexes && colIndexes[0] != 0) {
      colIndexes = _.union(_.range(0, colIndexes[0]), colIndexes);
    }

    return _.map(colIndexes, function(c) { return String.fromCharCode(65 + parseInt(c)); });
  },

  rowHeader: function(idx) {
    var col = this.rows[this.headersCol];
    if (col) {
      return col;
    }

    return _.find(this.rows[idx].cells, function(c) { return c; }).row;
  }
});

Mapsheet.Row = DropletJS.Class.create({
  id: null,
  cells: [],

  construct: function(id, cells) {
    this.id = id;
    this.cells = cells;
  },

  cell: function(id) {
    var cell = _.filter(function (c) { return id == c.id; });

    if (cell.length == 0) {
      return null;
    }

    return cell[0];
  },

  setCell: function(cell) {
    this.cells[cell.col] = cell;
  }
});

Mapsheet.Cell = DropletJS.Class.create({
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

Mapsheet.Document = DropletJS.Class.create({
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

Mapsheet.Project = DropletJS.Class.create({
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
    var candidates = _.filter(this.documents, function(doc) { return doc.id == documentId; });
    if (candidates) {
      this.current = candidates[0];
    }
  }
});

Mapsheet.GeoBindings = DropletJS.Class.create({
  latCol: -1,
  lngCol: -1,
  radCol: -1,

  construct: function(latCol, lngCol, radCol) {
    this.latCol = latCol || -1;
    this.lngCol = lngCol || -1;
    this.radCol = radCol || -1;
  }
});

Mapsheet.TableAdapter = DropletJS.Class.create({
  table: null,
  hideCols: [],
  pageSize: 15,
  currentPage: 0,
  geoBindings: null,

  construct: function(table) {
    this.table = table;
    this.geoBindings = new Mapsheet.GeoBindings();
  },

  view: function() {
    if (this.table) {
      var firstRow = this.currentPage * this.pageSize;
      var lastRow = firstRow + this.pageSize;

      var rows = this.table.rows.slice(firstRow, lastRow);

      if (this.showCols.length > 0) {
        return _.map(rows, function(r) {
          return _.filter(r.cells, function (c) { return !_.contains(this.hideCols, c); });
        });
      }
    } else {
      var rows = [];
    }

    return new Mapsheet.Table(rows);
  }
});

Mapsheet.GeoRepresentation = DropletJS.Class.create({
  row: DropletJS.Class.NUMBER,
  type: DropletJS.Class.STRING
});

Mapsheet.Marker = DropletJS.Class.extend(Mapsheet.GeoRepresentation, {
  lat: -1,
  lon: -1,

  construct: function(row, lat, lon) {
    this.lat = lat;
    this.lon = lon;
    this.row = row;
    this.type = "marker";
  }
});

Mapsheet.Circle = DropletJS.Class.extend(Mapsheet.GeoRepresentation, {
  lat: -1,
  lon: -1,
  rad: -1,

  construct: function(row, lat, lon, rad) {
    this.lat = lat;
    this.lon = lon;
    this.rad = rad;
    this.row = row;
    this.type = "circle";
  }
})
