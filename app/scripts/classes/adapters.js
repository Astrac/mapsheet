(function(globals) {
  'use strict';

  if (typeof(globals.Mapsheet) === 'undefined') {
    globals.Mapsheet = {};
  }

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

  globals.Mapsheet.GeoAdapter = DropletJS.Class.extend(globals.Mapsheet.Adapter, {
    doc: null,
    latCol: -1,
    lngCol: -1,
    radCol: -1,
    showRows: [],

    construct: function(doc) {
      this.doc = doc;
    },

    geoPoint: function(row) {
      var floatCell = function(r, c) {
        var cell = r.col(c);

        if (cell) {
          return parseFloat(cell.content);
        }

        return null;
      };

      return this.withTable(function(table, self) {
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
