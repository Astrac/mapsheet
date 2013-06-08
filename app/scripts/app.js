'use strict';

angular.module('mapsheetApp', ['ngResource', 'ngCookies'])
  .config(function ($routeProvider, $locationProvider) {
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

    // $locationProvider.html5Mode(true);
  }).

  config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    var interceptor = ['$location', '$q', function($location, $q) {
        function success(response) {
            return response;
        };

        function error(response) {

            if(response.status === 401) {
                $location.path('/');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        };

        return function(promise) {
            return promise.then(success, error);
        };
    }];

    $httpProvider.responseInterceptors.push(interceptor);
  }]).

  run(['$rootScope', '$location', '$cookies', '$http', function ($rootScope, $location, $cookies, $http) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      if (!$rootScope.gapiToken && $cookies.gapiToken) {
        var token = $cookies.gapiToken;

        delete($http.defaults.headers.common['X-Requested-With']);
        $rootScope.gapiToken = token;
      }
    });
  }]);
