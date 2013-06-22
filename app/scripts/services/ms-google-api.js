'use strict';

angular.module('mapsheetApp')
  .factory('msGoogleApi', ['$http', 'msGoogleAuth', function ($http, msGoogleAuth) {
    var errorHandler = function(data, status) {
      console.log('error');
      console.log(data);
      console.log(status);
    };

    var request = function (feed, parameters) {
      if (!parameters) {
        parameters = {};
      }
      parameters.alt = 'json';

      return $http({
        method: 'GET',
        url: feed,
        params: parameters,
        headers: {
          Authorization: 'Bearer ' + msGoogleAuth.getToken()
        }
      }).error(errorHandler);
    };

    return {
      'request': request
    };
  }]);
