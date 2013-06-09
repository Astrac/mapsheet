'use strict';

/* Controllers */

angular.module('mapsheetApp')
  .controller('MainCtrl', ['msGoogleFeed', '$scope', '$location', 'localStorageService',
    function(msGoogleFeed, $scope, $location, localStorageService) {
      console.log('MainCtrl');

      $scope.authorize = function() {
        var config = {
          'client_id': '99733533475-l9qb04qqsbn8hgq73flvvvi1pb4hp8bv.apps.googleusercontent.com',
          'scope': 'https://spreadsheets.google.com/feeds https://www.googleapis.com/auth/userinfo.email'
        };
        gapi.auth.authorize(config, function() {
          console.log('login complete');
          $scope.$apply(function() {
            var token = gapi.auth.getToken();
            msGoogleFeed.setToken(token.access_token);
            localStorageService.add('gapi_token', token.access_token);
            $location.path('/project/_empty');
          });
        });
      }
  }])
;
