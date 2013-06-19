'use strict';

angular.module('mapsheetApp', ['ngResource', 'ui.bootstrap', 'LocalStorageModule', 'http-auth-interceptor'])
  .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .when('/project/:id', {
          templateUrl: 'views/project.html',
          controller: 'ProjectCtrl'
        })
        .when('/open-worksheet', {
          templateUrl: 'views/open.html',
          controller: 'OpenWorksheetCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]).

  run(['$rootScope', 'msGoogleAuth', 'authService',
    function ($rootScope, msGoogleAuth, authService) {
      $rootScope.$on('event:auth-loginRequired', function() {
        msGoogleAuth.authorize(function(token) {
          if (token) {
            $rootScope.$apply(function() {
              authService.loginConfirmed(function(config) {
                return _.extend(config, {'headers': {'Authorization': 'Bearer ' + msGoogleAuth.getToken() }});
              });
            });
          }
        })
      })
    }]);
