'use strict';

angular.module('mapsheetApp')
  .directive('msNavigationBar', ['msProjectManager', function (msProjectManager) {
    return {
      templateUrl: 'views/navigation-bar.html',
      scope: {},
      restrict: 'A',
      replace: true,
      link: function postLink(scope) {
        scope.documents = msProjectManager.documents;
        scope.hasWorksheets = !_.isEmpty(scope.documents);
      }
    };
  }]);
