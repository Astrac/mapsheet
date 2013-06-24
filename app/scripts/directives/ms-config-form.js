'use strict';

angular.module('mapsheetApp')
  .directive('msConfigForm', function (msDocument) {
    return {
      templateUrl: 'views/config-form.html',
      scope: {
      },
      restrict: 'A',
      link: function postLink(scope) {
        scope.$watch(function() {
          return msDocument.config;
        }, function() {
          scope.config = msDocument.config;
        }, true);
      }
    };
  });
