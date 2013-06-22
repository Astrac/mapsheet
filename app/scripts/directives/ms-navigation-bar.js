'use strict';

angular.module('mapsheetApp')
  .directive('msNavigationBar', ['msLocalStorage', 'msGoogleAuth', '$location',
    function (msLocalStorage, msGoogleAuth, $location) {
      return {
        templateUrl: 'views/navigation-bar.html',
        scope: {},
        restrict: 'A',
        replace: true,
        link: function postLink(scope) {
          var refresh = function() {
            msLocalStorage.getDocuments().then(function(documents) {
              scope.documents = documents;
              scope.hasWorksheets = !_.isEmpty(scope.documents);
            });
          };

          scope.switchAccount = function() {
            msGoogleAuth.selectAccount().then(function() {
              refresh();
              $location.path('/');
            });
          };

          refresh();
        }
      };
    }]);
