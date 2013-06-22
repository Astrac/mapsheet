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

  run(['$rootScope', 'msGoogleAuth', function ($rootScope, msGoogleAuth) {
    $rootScope.$on('event:auth-loginRequired', function() {
      msGoogleAuth.authorize();
    });
  }]).

  run(['$rootScope', 'msLocalStorage', function($rootScope, msLocalStorage) {
    $rootScope.$on('event:auth-loginConfirmed', function() {
      msLocalStorage.init();
    });
  }]).

  run(['$http', function($http) {
    // Otherwise CORS will fail, find a way of doing it in the msGoogleApi service!
    delete($http.defaults.headers.common['X-Requested-With']);
  }]);
