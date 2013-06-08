'use strict';

/* Controllers */

angular.module('mapsheetApp')
  .controller('MainCtrl', ['$rootScope', '$scope', '$location', '$cookies',
    function($rootScope, $scope, $location, $cookies) {
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
            $rootScope.gapiToken = token.access_token;
            $cookies.gapiToken = token.access_token;
            $location.path('/project/_empty');
          });
        });
      }
  }])
;
