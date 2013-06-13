'use strict';

angular.module('mapsheetApp', ['ngResource', 'ui.bootstrap', 'LocalStorageModule'])
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

  config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    var interceptor = ['$location', '$q', function($location, $q) {
      function success(response) {
        return response;
      }

      function error(response) {
        if(response.status === 401) {
          $location.path('/');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

      return function(promise) {
        return promise.then(success, error);
      };
    }];

    $httpProvider.responseInterceptors.push(interceptor);
  }]).

  run(['$rootScope', 'localStorageService', 'msGoogleFeed',
    function ($rootScope, localStorageService, msGoogleFeed) {
      $rootScope.$on('$routeChangeStart', function () {
        var storedToken = localStorageService.get('gapi_token');
        if (!msGoogleFeed.hasToken() && storedToken) {
          msGoogleFeed.setToken(storedToken);
        }
      });
    }]);
