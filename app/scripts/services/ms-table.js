'use strict';

angular.module('mapsheetApp')
  .factory('msTable', function ($q, msGoogleApi) {
    // TODO: This should be a service on its own!
    var tableParser = new Mapsheet.TableParser();

    var cachedDoc = {};

    return {
      withTable: function(doc) {
        var deferred = $q.defer();

        if (doc.id === cachedDoc.id) {
          deferred.resolve(doc);
        } else {
          msGoogleApi
            .request(doc.worksheet.cellsFeed)
            .success(function(data) {
              doc.table = tableParser.parse(data);
              cachedDoc = doc;
              deferred.resolve(doc);
            });
        }

        return deferred.promise;
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

      colIndexes: function() {
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

      columns: function() {
        return this.withTable(function(table, self) {
          var row = table.row(self.headersRow);
          if (row) {
            return _.map(row.cells, function(c) {
                return new globals.Mapsheet.Column(c.col, c.content);
              });
          }

          return _.filter(_.map(self.colIndexes(), function(c) {
              return new globals.Mapsheet.Column(c, String.fromCharCode(65 + parseInt(c, 10)));
            }), function(c) { return !_.contains(self.hideCols, c.id); });
        });
      },

      rowHeader: function(idx) {
        return this.withTable(function(table) {
          if (table.row(idx)) {
            return table.row(idx).id + 1;
          }

          return null;
        });
      }
    };
  });
