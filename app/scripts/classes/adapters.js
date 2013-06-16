(function(globals) {
  'use strict';
  globals.Mapsheet.ColHeader = DropletJS.Class.create({
    col: -1,
    label: '',

    construct: function(column, label) {
      this.col = column;
      this.label = label;
    }
  });

  globals.Mapsheet.RowHeader = DropletJS.Class.create({
    row: -1,
    label: '',

    construct: function(row, label) {
      this.row = row;
      this.label = label;
    }
  });

  globals.Mapsheet.Adapter = DropletJS.Class.create({
    doc: DropletJS.Class.OBJECT,
    type: DropletJS.Class.STRING,

    withTable: function(f) {
      var self = this;
      if (this.doc.table) {
        return f(this.doc.table, self);
      }

      return null;
    }
  });

  globals.Mapsheet.TableAdapter = DropletJS.Class.extend(globals.Mapsheet.Adapter, {
    doc: null,
    hideCols: [],
    pageSize: 15,
    currentPage: 1, // 1-based pagination
    headerRow: null,
    headerCol: null,

    construct: function(doc) {
      this.doc = doc;
    },

    totalPages: function() {
      return this.withTable(function(table, self) {
        return table ? Math.ceil(table.rows.length / self.pageSize) : 0;
      });
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
      return this.withTable(function(table, self) {
        var rows = [];

        if (table) {
          var firstRow = (self.currentPage - 1) * self.pageSize;
          var lastRow = firstRow + self.pageSize;
          rows = table.rows.slice(firstRow, lastRow);

          var hideCols = self.hideCols;

          rows = _.map(rows, function(r) {
            return _.filter(r.cells, function (c) { return !_.contains(hideCols, c.col); });
          });
        }

        return rows;
      });
    },

    colHeaders: function() {
      return this.withTable(function(table, self) {
        var row = table.row(self.headersRow);
        if (row) {
          return row;
        }

        var colIndexes = _.sortBy(_.keys(_.reduce(table.rows, function(memo, row) {
          _.each(row.cells, function(c) {
            memo[c.col] = true;
          });

          return memo;
        }, {})), function(idx) { return idx; });

        if (colIndexes && colIndexes[0] !== 0) {
          colIndexes = _.union(_.range(0, colIndexes[0]), colIndexes);
        }

        return _.map(colIndexes, function(c) { return String.fromCharCode(65 + parseInt(c, 10)); });
      });
    },

    rowHeader: function(idx) {
      return this.withTable(function(table, self) {
        var col = table.col(self.headersCol);
        if (col) {
          return col;
        }

        return _.find(table.rows[idx].cells, function(c) { return c; }).row + 1;
      });
    }
  });

  globals.Mapsheet.GeoAdapter = DropletJS.Class.extend(globals.Mapsheet.Adapter, {
    doc: null,
    latCol: -1,
    lngCol: -1,
    radCol: -1,
    showRows: [],

    construct: function(doc) {
      this.doc = doc;
    },

    geoPoint: function(rowId) {
      return this.withTable(function(table, self) {
        var row = table.row(rowId);
        var maybeLat = row.col(self.latCol);
        var maybeLng = row.col(self.lngCol);
        var maybeRad = row.col(self.radCol);

        if (maybeLat && maybeLng && maybeRad) {
          return new globals.Mapsheet.Circle(row, maybeLat.content, maybeLng.content, maybeRad.content);
        }

        if (maybeLat && maybeLng) {
          return new globals.Mapsheet.Marker(row, maybeLat.content, maybeLng.content);
        }
      });
    },

    geoPoints: function() {
      return this.withTable(function() {
        return _.compact(_.map(self.showRows, function (r) { return self.geoPoint(r); }));
      });
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
