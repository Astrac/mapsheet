'use strict';

angular.module('mapsheetApp')
  .controller('MainCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $rootScope.hideNavbar = true;

    $scope.authorize = function() {
      var config = {
        'client_id': '99733533475-l9qb04qqsbn8hgq73flvvvi1pb4hp8bv.apps.googleusercontent.com',
        'scope': 'https://spreadsheets.google.com/feeds https://www.googleapis.com/auth/userinfo.email'
      };
      gapi.auth.authorize(config, function() {
        console.log('login complete');
        console.log(gapi.auth.getToken());
      });
    }
  }]);
