'use strict';

angular.module('mapsheetApp')
  .factory('msDocument', function ($q, msGoogleApi, msTable) {
    // TODO: This should be a service on its own!
    var tableParser = new Mapsheet.TableParser();

    var defaults = {
      map: {
        latCol: null,
        lngCol: null,
        radCol: null
      },
      table: {
        rowHeader: false,
        hideColumns: [],
        pageSize: 15,
        page: 1
      }
    };

    var buildTable = function(doc) {
      var deferred = $q.defer();

      if (doc.worksheet === null) {
        deferred.reject('No worksheet associated');
      } else {
        msGoogleApi
          .request(doc.worksheet.cellsFeed)
          .success(function(data) {
            doc.table = tableParser.parse(data)
            deferred.resolve(doc);
          });
      }

      return deferred.promise;
    }

    var doc = {
      config: defaults
    };
    var table = [];
    var tableUpToDate = true;

    var getTable = function() {
      var deferred = $q.defer();

      if (tableUpToDate) {
        deferred.resolve(table);
      } else {
        msGoogleApi
          .request(doc.worksheet.cellsFeed)
          .success(function(data) {
            deferred.resolve(tableParser.parse(data));
          });
      }

      return deferred.promise;
    }

    var tableConfig = function() {
      return doc.config.table;
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
      open: function (d) {
        d.config = _.extend(defaults, d.config);
        doc = d;
        tableUpToDate = false;
      },
      table: {
        totalPages: totalPages,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,

        isUpToDate: function() {
          return tableUpToDate;
        },

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
    };
  });
