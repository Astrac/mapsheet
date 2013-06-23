'use strict';

angular.module('mapsheetApp')
  .factory('msTable', function ($q, msDocument) {
    // TODO: This should be a service on its own!
    var tableParser = new Mapsheet.TableParser();
    var getTable = msDocument.getTable;

    var tableConfig = function() {
      return msDocument.getDocument().config.table;
    };

    var totalPages = function() {
      getTable().then(function(t) {
        return Math.ceil(t.length / tableConfig().pageSize);
      });
    };

    var hasPrevPage = function() {
      return tableConfig().page > 1;
    };

    var hasNextPage = function() {
      return tableConfig().page < totalPages();
    };

    var colIndexes = function(table) {
      var minCol = Number.MAX_VALUE;
      var maxCol = Number.MIN_VALUE;
      _.each(table, function(row) {
        _.each(row.cells, function(cell) {
          minCol = Math.min(cell.col, minCol);
          maxCol = Math.max(cell.col, maxCol);
        });
      });

      var idxs = _.range(minCol, maxCol + 1);

      return idxs;
    };

    return {
      totalPages: totalPages,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,

      getDocument: function () { return msDocument; },

      nextPage: function() {
        if (hasNextPage()) {
          tableConfig().page++;
        }
      },

      prevPage: function() {
        if (hasPrevPage()) {
          tableConfig().page--;
        }
      },

      columns: function() {
        return getTable().then(function(table) {
          return _.filter(
            _.map(colIndexes(table), function(c) {
              return {
                id: c,
                label: String.fromCharCode(65 + parseInt(c, 10))
              };
            }), function(c) {
              return !_.contains(tableConfig().hideColumns, c.id);
            });
        });
      },

      getTable: getTable,

      view: function() {
        return getTable().then(function(table) {
          var rows = [];
          var config = tableConfig();

          if (table) {
            var firstRow = (config.page - 1) * config.pageSize;
            var lastRow = firstRow + config.pageSize;
            rows = table.slice(firstRow, lastRow);

            rows = _.map(rows, function(r) {
              return {
                id: r.id,
                cells: _.filter(r.cells, function (c) { return !_.contains(config.hideColumns, c.col); })
              }
            });
          }

          return rows;
        });
      }
    }
  });
