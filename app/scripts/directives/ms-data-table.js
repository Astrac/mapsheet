'use strict';

angular.module('mapsheetApp')
  .directive('msDataTable', function () {
    return {
      templateUrl: 'views/data-table.html',
      restrict: 'A',
      scope: {
        msDocument: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.tableAdapter = new Mapsheet.TableAdapter(new Mapsheet.Table([]));

        scope.$watch('msDocument.table', function() {
          scope.tableAdapter = new Mapsheet.TableAdapter(scope.msDocument.table);
          scope.table = scope.tableAdapter.view();
        });

        scope.$watch('tableAdapter.currentPage', function() {
          scope.table = scope.tableAdapter.view();
        });
      }
    };
  });
