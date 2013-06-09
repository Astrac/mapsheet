'use strict';

angular.module('mapsheetApp')
  .directive('msDataTable', function () {
    return {
      template: '<div>data</div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
