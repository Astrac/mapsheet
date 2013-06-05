'use strict';

angular.module('mapsheetApp')
  .directive('MsMapWidget', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the MsMapWidget directive');
      }
    };
  });
