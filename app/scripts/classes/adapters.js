(function(globals) {
  'use strict';

  globals.Mapsheet.Header = DropletJS.Class.create({
    id: -1,
    label: '',

    construct: function(id, label) {
      this.id = id;
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
            return new globals.Mapsheet.Row(r.id, _.filter(r.cells, function (c) { return !_.contains(hideCols, c.col); }));
          });
        }

        return rows;
      });
    },

    columns: function() {
      return this.withTable(function(table) {
        var minCol = Number.MAX_VALUE;
        var maxCol = Number.MIN_VALUE;
        _.each(table.rows, function(row) {
          _.each(row.cells, function(cell) {
            minCol = Math.min(cell.col, minCol);
            maxCol = Math.max(cell.col, maxCol);
          });
        });

        return _.range(minCol, maxCol + 1);
      });
    },

    colHeaders: function() {
      return this.withTable(function(table, self) {
        var row = table.row(self.headersRow);
        if (row) {
          return _.map(row.cells, function(c) {
              return new globals.Mapsheet.Header(c.col, c.content);
            });
        }

        return _.map(self.columns(), function(c) {
            return new globals.Mapsheet.Header(c, String.fromCharCode(65 + parseInt(c, 10)));
          });
      });
    },

    rowHeader: function(idx) {
      // TODO: Real implementation
      return idx;
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
      var floatCell = function(row, col) {
        var cell = row.col(col);

        if (cell) {
          return parseFloat(cell.content);
        }

        return null;
      };

      return this.withTable(function(table, self) {
        var row = table.row(rowId);
        var maybeLat = floatCell(row, self.latCol);
        var maybeLng = floatCell(row, self.lngCol);
        var maybeRad = floatCell(row, self.radCol);

        if (maybeLat && maybeLng && maybeRad) {
          return new globals.Mapsheet.Circle(row, maybeLat, maybeLng, maybeRad);
        }

        if (maybeLat && maybeLng) {
          return new globals.Mapsheet.Marker(row, maybeLat, maybeLng);
        }
      });
    },

    geoPoints: function() {
      return this.withTable(function(table, self) {
        return _.compact(_.map(self.showRows, function (r) {
          return self.geoPoint(r);
        }));
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
