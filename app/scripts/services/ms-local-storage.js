'use strict';

angular.module('mapsheetApp')
  .factory('msLocalStorage', ['localStorageService', 'msGoogleApi', 'msGoogleAuth',
    function (localStorageService, msGoogleApi) {

      var url = 'https://www.googleapis.com/oauth2/v2/userinfo?key=';
      var user = null;

      return {
        updateUser: function () {
          msGoogleApi.request(url).success(function(data) {
            user = data;
          });
        }
      };
    }]);
