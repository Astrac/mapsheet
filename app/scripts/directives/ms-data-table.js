'use strict';

angular.module('mapsheetApp')
  .directive('msDataTable', function (msTable) {
    return {
      templateUrl: 'views/data-table.html',
      restrict: 'A',
      scope: {
        msGeoAdapter: '='
      },
      link: function (scope) {
        scope.msTable = msTable;

        scope.$watch(function() {
            return msTable.getDocument().isTableUpToDate();
          }, function() {
            msTable.view().then(function(table) {
              scope.table = table;
              scope.columns = msTable.columns();
            });
            msTable.columns().then(function(columns) {
              scope.columns = columns;
            })
          });

        scope.chooseLat = function(col) {
          scope.msGeoAdapter.latCol = col.id;
        };

        scope.chooseLng = function(col) {
          scope.msGeoAdapter.lngCol = col.id;
        };

        scope.chooseRad = function(col) {
          scope.msGeoAdapter.radCol = col.id;
        };

        scope.toggleRow = function(row) {
          if (_.some(scope.msGeoAdapter.showRows, function(r) { return r.id === row.id; })) {
            scope.msGeoAdapter.showRows = _.filter(scope.msGeoAdapter.showRows, function(r) {
                return r.id !== row.id;
              });
          } else {
            scope.msGeoAdapter.showRows.push(row);
          }
        };

        scope.showAll = function() {
          scope.msGeoAdapter.showRows = scope.msTable.rows;
        };

        scope.showNone = function() {
          scope.msGeoAdapter.showRows = [];
        };

        scope.isRowSelected = function(row) {
          return _.some(scope.msGeoAdapter.showRows, function(r) { return r.id === row.id; });
        };

        // scope.isLat = function(col) { return scope.msGeoAdapter.latCol === col.id; };
        // scope.isLng = function(col) { return scope.msGeoAdapter.lngCol === col.id; };
        // scope.isRad = function(col) { return scope.msGeoAdapter.radCol === col.id; };

        // _.each(['msDocument.doc', 'msTable', 'tableAdapter.currentPage', 'tableAdapter.hideCols.length'], function(prop) {
        //     scope.$watch(prop, refreshTable);
        //   });
      }
    };
  });
