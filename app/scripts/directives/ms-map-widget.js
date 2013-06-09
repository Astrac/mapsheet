'use strict';

angular.module('mapsheetApp')
  .directive('msMapWidget', function () {
    return {
      template: '<div>map</div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
