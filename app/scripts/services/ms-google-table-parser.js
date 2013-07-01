'use strict';

angular.module('mapsheetApp')
  .factory('msGoogleTableParser', function () {

    return {
      parse: function(data) {
        var numCols = _.max(data.feed.entry, function(e) {
          return e.gs$cell.col;
        }).gs$cell.col;

        var rows = _.filter(_.reduce(data.feed.entry, function(memo, cell) {
          var row = cell.gs$cell.row - 1;
          var col = cell.gs$cell.col - 1;

          if (!memo[row]) {
            var newCells = _.times(numCols, function(col) {
              return {
                id: null,
                name: '',
                'row': row,
                'col': col,
                content: ''
              };
            });

            memo[row] = { id: row, cells:  newCells };
          }

          memo[row].cells[col] = {
            id: cell.id.$t,
            name: cell.title.$t,
            'row': row,
            'col': col,
            content: cell.content.$t
          };

          return memo;
        }, []), function(r) { return r.cells.length > 0; });

        return rows;
      }
    };
  });
