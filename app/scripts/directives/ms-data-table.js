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

        scope.$watch('msDocument.table', function() {
          scope.table = scope.tableAdapter.view();
          scope.headers = scope.tableAdapter.colHeaders();
        });

        scope.$watch('tableAdapter.currentPage', function() {
          scope.table = scope.tableAdapter.view();
        });

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
        }
      }
    };
  });
