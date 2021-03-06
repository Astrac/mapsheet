'use strict';

angular.module('mapsheetApp')
  .directive('msDataTable', function (msTable, msMap) {
    return {
      templateUrl: 'views/data-table.html',
      restrict: 'A',
      scope: {
      },
      link: function (scope) {
        scope.table = msTable;
        scope.map = msMap;

        scope.$watch(function() {
            return msTable.getStatus();
          }, function() {
            msTable.view().then(function(table) {
              scope.table = table;
              scope.columns = msTable.columns();
            });
            msTable.columns().then(function(columns) {
              scope.columns = columns;
            });
            scope.pagination = msTable.pagination;
          }, true);

        var mapConfig = msMap.getMapConfig;

        scope.toggleRow = function(row) {
          if (_.some(msMap.getShowRows(), function(r) { return r.id === row.id; })) {
            msMap.setShowRows(
              _.filter(msMap.getShowRows(), function(r) {
                return r.id !== row.id;
              }));
          } else {
            msMap.addShowRow(row);
          }
        };

        scope.showAll = function() {
          msTable.getTable().then(function(table) {
            msMap.setShowRows(table);
          });
        };

        scope.showNone = function() {
          msMap.setShowRows([]);
        };

        scope.isRowSelected = function(row) {
          return _.some(msMap.getShowRows(), function(r) { return r.id === row.id; });
        };

        scope.isLat = function(col) { return mapConfig().latCol === col.id; };
        scope.isLng = function(col) { return mapConfig().lngCol === col.id; };
        scope.isRad = function(col) { return mapConfig().radCol === col.id; };
      }
    };
  });
