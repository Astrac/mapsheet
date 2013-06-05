'use strict';

angular.module('mapsheetApp')
  .directive('MsDataTable', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the MsDataTable directive');
      }
    };
  });
