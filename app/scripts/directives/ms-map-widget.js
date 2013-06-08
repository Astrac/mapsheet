'use strict';

angular.module('mapsheetApp')
  .directive('MsMapWidget', function () {
    return {
      template: '<div>{{text}}</div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
