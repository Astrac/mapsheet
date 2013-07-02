'use strict';

angular.module('mapsheetApp')
  .directive('msConfigForm', function (msDocument, msTable) {
    return {
      templateUrl: 'views/config-form.html',
      scope: {
      },
      restrict: 'A',
      link: function postLink(scope) {
        scope.$watch(function() {
          // TODO: This is suboptimal (i.e. it's triggered also for pagination)
          return msTable.getStatus();
        }, function() {
          scope.map = msDocument.doc.config.map;
          msTable.columns().then(function(cols) {
            scope.columns = cols;
          });
        }, true);
      }
    };
  });
