'use strict';

angular.module('mapsheetApp')
  .factory('msMap', function (msDocument) {
    var showRows = [];
    var isSelectionChanged = false;

    var mapConfig = function() {
      return msDocument.getDocument().config.map;
    };

    var geoPoint = function(row) {
      var floatCell = function(r, c) {
        var cell = r.cells[c];

        if (cell) {
          return parseFloat(cell.content);
        }

        return null;
      };

      var conf = mapConfig();

      var maybeLat = floatCell(row, conf.latCol);
      var maybeLng = floatCell(row, conf.lngCol);
      var maybeRad = floatCell(row, conf.radCol);

      if (maybeLat && maybeLng && maybeRad) {
        return {
          'row': row,
          lat: maybeLat,
          lng: maybeLng,
          rad: maybeRad,
          type: 'circle'
        };
      }

      if (maybeLat && maybeLng) {
        return {
          'row': row,
          lat: maybeLat,
          lng: maybeLng,
          type: 'marker'
        };
      }
    };

    return {
      geoPoints: function() {
        isSelectionChanged = false;
        return _.compact(_.map(showRows, function (r) {
          return geoPoint(r);
        }));
      },
      getStatus: function() {
        return {
          config: msDocument.getDocument().config,
          showingCount: showRows.length
        };
      },
      getShowRows: function() {
        return showRows;
      },
      setShowRows: function(rows) {
        isSelectionChanged = true;
        showRows = rows;
      },
      addShowRow: function(row) {
        isSelectionChanged = true;
        showRows.push(row);
      },
      isSelectionChanged: function() {
        return isSelectionChanged;
      },
      getMapConfig: mapConfig
    };
  });
