'use strict';

angular.module('mapsheetApp')
  .factory('msTable', function ($q, msDocument) {
    var tableConfig = function() {
      return msDocument.getDocument().config.table;
    };

    var pagination = {
      pages: 1,
      page: 1
    };

    var getTable = function() {
      return msDocument.getTable().then(function(t) {
        pagination.pages = Math.ceil(t.length / tableConfig().pageSize);

        return t;
      });
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
      pagination: pagination,

      getDocument: function () { return msDocument; },

      nextPage: function() {
        pagination.page++;
      },

      getStatus: function() {
        return  {
          config: msDocument.doc,
          pagination: pagination
        };
      },

      prevPage: function() {
        pagination.page--;
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
            var firstRow = (pagination.page - 1) * config.pageSize;
            var lastRow = firstRow + config.pageSize;
            rows = table.slice(firstRow, lastRow);

            rows = _.map(rows, function(r) {
              return {
                id: r.id,
                cells: _.filter(r.cells, function (c) { return !_.contains(config.hideColumns, c.col); })
              };
            });
          }

          return rows;
        });
      }
    };
  });
