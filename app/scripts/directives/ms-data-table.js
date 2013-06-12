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
        scope.table = null;
        scope.tableAdapter = new Mapsheet.TableAdapter();

        scope.$watch('msDocument.table', function() {
          scope.table = scope.tableAdapter.view(scope.msDocument.table);
        });
      }
    };
  });
