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

        var refreshTable = function() {
          scope.table = scope.tableAdapter.view();
          scope.columns = scope.tableAdapter.colHeaders();
        };

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

        _.each(['msDocument.table', 'tableAdapter.currentPage'], function(prop) {
            scope.$watch(prop, refreshTable);
          });
      }
    };
  });
