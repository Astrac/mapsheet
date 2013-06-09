'use strict';

angular.module('mapsheetApp')
  .directive('msDataTable', function (msCellManager) {
    return {
      templateUrl: 'views/data-table.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.cellManager = msCellManager;
        scope.$watch(msCellManager);
      }
    };
  });
