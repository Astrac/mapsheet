'use strict';

angular.module('mapsheetApp')
  .directive('msDataTable', function () {
    return {
      templateUrl: 'views/data-table.html',
      restrict: 'A',
      scope: {
        msDocument: '=',
        msGeoAdapter: '='
      },
      link: function postLink(scope) {
        scope.tableAdapter = new Mapsheet.TableAdapter(scope.msDocument);

        scope.chooseLat = function(col) {
          console.log('chooseLat');
          console.log(col);
          scope.msGeoAdapter.latCol = col;
        };

        scope.chooseLng = function(col) {
          console.log('chooseLng');
          console.log(col);
          scope.msGeoAdapter.lngCol = col;
        };

        scope.showRow = function(row) {
          scope.msGeoAdapter.showRows.push(row);
        };

        scope.hideColumn = function(col) {
          console.log('hideCol');
          console.log(col);
          scope.tableAdapter.hideCols.push(col);
        };

        var refreshTable = function() {
          scope.table = scope.tableAdapter.view();
          scope.columns = scope.tableAdapter.columns();
        };

        _.each(['msDocument.table', 'tableAdapter.currentPage', 'tableAdapter.hideCols.length'], function(prop) {
            scope.$watch(prop, refreshTable);
          });
      }
    };
  });
