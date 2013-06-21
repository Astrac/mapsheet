'use strict';

angular.module('mapsheetApp')
  .factory('msGoogleAuth', ['$rootScope', 'authService', 'localStorageService',
    function ($rootScope, authService, localStorageService) {
      var config = {
        'client_id': '99733533475-l9qb04qqsbn8hgq73flvvvi1pb4hp8bv.apps.googleusercontent.com',
        'scope': 'https://spreadsheets.google.com/feeds https://www.googleapis.com/auth/userinfo.email'
      };

      var token = localStorageService.get('gapi_token');

      var successCallback = function() {
        var gapiToken = gapi.auth.getToken();

        if (gapiToken !== null) {
          /* jshint -W106 */
          token = gapi.auth.getToken().access_token;
          localStorageService.add('gapi_token', token);

          $rootScope.$apply(function() {
            authService.loginConfirmed(function(config) {
              return _.extend(config, {'headers': {'Authorization': 'Bearer ' + token }});
            });
          });
        }
      };

      // Public API here
      return {
        authorize: function() {
          gapi.auth.authorize(config, successCallback);
        },

        selectAccount: function() {
          var cfg = _.extend(config, { approval_prompt: 'force' });

          gapi.auth.authorize(cfg, successCallback);
        },

        getToken: function() {
          return token;
        }
      };
    }]);
