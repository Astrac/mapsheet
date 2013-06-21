'use strict';

angular.module('mapsheetApp')
  .directive('msNavigationBar', ['msProjectManager', 'msGoogleAuth', '$location',
    function (msProjectManager, msGoogleAuth, $location) {
      return {
        templateUrl: 'views/navigation-bar.html',
        scope: {},
        restrict: 'A',
        replace: true,
        link: function postLink(scope) {
          scope.documents = msProjectManager.documents;
          scope.hasWorksheets = !_.isEmpty(scope.documents);

          scope.switchAccount = function() {
            msGoogleAuth.selectAccount(function() {
              scope.$apply(function() {
                $location.path('/');
              });
            });
          };
        }
      };
    }]);
