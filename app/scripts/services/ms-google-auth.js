'use strict';

angular.module('mapsheetApp')
  .factory('msGoogleAuth', ['$rootScope', '$q', 'authService', 'localStorageService', 'googleClientId', 'googleScope',
    function ($rootScope, $q, authService, localStorageService, googleClientId, googleScope) {
      var config = {
        'client_id': googleClientId,
        'scope': googleScope
      };

      var token = localStorageService.get('gapi_token');

      var successCallback = function(deferred) {
        return function() {
          var gapiToken = gapi.auth.getToken();

          if (gapiToken !== null) {
            /* jshint -W106 */
            token = gapi.auth.getToken().access_token;
            localStorageService.add('gapi_token', token);
            deferred.resolve(token);

            $rootScope.$apply(function() {
              authService.loginConfirmed(function(config) {
                return _.extend(config, {'headers': {'Authorization': 'Bearer ' + token }});
              });
            });
          } else {
            deferred.reject('Cannot authenticate');
          }

          return deferred;
        };
      };

      // Public API here
      return {
        authorize: function() {
          var deferred = $q.defer();
          gapi.auth.authorize(config, successCallback(deferred));

          return deferred.promise;
        },

        selectAccount: function() {
          var cfg = _.extend(config, { approval_prompt: 'force' });
          var deferred = $q.defer();

          gapi.auth.authorize(cfg, successCallback(deferred));

          return deferred.promise;
        },

        getToken: function() {
          return token;
        }
      };
    }]);
