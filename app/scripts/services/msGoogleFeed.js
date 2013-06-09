'use strict';

angular.module('mapsheetApp')
  .factory('msGoogleFeed', function ($http) {
    var gapiToken = null;

    var errorHandler = function(data, status) {
      console.log('error');
      console.log(data);
      console.log(status);
    };

    var request = function (feed, parameters) {
      if (!parameters) {
        parameters = {};
      }
      parameters['alt'] = 'json';

      return $http({
        method: 'GET',
        url: feed,
        params: parameters,
        headers: {
          Authorization: 'Bearer ' + gapiToken
        }
      }).error(errorHandler);
    };

    // Otherwise CORS will fail, find a better way of doing it!
    delete($http.defaults.headers.common['X-Requested-With']);

    return {
      'request': request,
      'hasToken': function() { return gapiToken != null; },
      'setToken': function(token) {
        gapiToken = token;
      }
    };
  });
