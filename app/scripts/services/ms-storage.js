'use strict';

angular.module('mapsheetApp')
  .factory('msStorage', ['$q', 'localStorageService', 'msGoogleApi',
    function ($q, localStorageService, msGoogleApi) {

      var url = 'https://www.googleapis.com/oauth2/v2/userinfo?key=';
      var user = null;
      var documents = null;

      var updateUser = function () {
        var deferred = $q.defer();

        if (user !== null) {
          deferred.resolve(user);
        } else {
          msGoogleApi.request(url).success(function(data) {
            user = data;

            if (user !== null) {
              deferred.resolve(user);
            } else {
              deferred.reject('Cannot retrieve user data');
            }
          });
        }

        return deferred.promise;
      };

      var withDocuments = function(f) {
        return updateUser().
          then(function (user) {
            var prefix = user.id.toString();
            if (documents === null) {
              var storedDocs = localStorageService.get(prefix + '.documents');

              if (typeof(storedDocs) === 'string') {
                storedDocs = JSON.parse(storedDocs);
              } else if (storedDocs === null || typeof(storedDocs) !== 'object') {
                storedDocs = {};
              }

              documents = storedDocs;
            }

            if (f) {
              documents = f(documents);
            }

            localStorageService.add(prefix + '.documents', JSON.stringify(documents));
            return documents;
          });
      };

      return {
        init: function() {
          documents = null;
          user = null;
        },
        getDocuments: function() {
          return withDocuments();
        },
        addDocument: function(doc) {
          return withDocuments(function(documents) {
            documents[doc.id] = doc;

            return documents;
          }).then(function() {
            return doc.id;
          });
        },
        getDocument: function(docId) {
          return withDocuments().then(function(documents) {
            return documents[docId];
          });
        }
      };
    }]);
