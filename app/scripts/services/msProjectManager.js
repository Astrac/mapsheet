'use strict';

angular.module('mapsheetApp')
  .factory('msProjectManager', ['localStorageService', function (localStorageService) {
    var documents = JSON.parse(localStorageService.get('documents'));

    var updateWorksheets = function() {
      localStorageService.add('documents', JSON.stringify(documents));
    };

    if (documents === null) {
      documents = {};
      updateWorksheets();
    }

    return {
      load: function(doc) {
        if (!documents[doc.id]) {
          documents[doc.id] = doc;
          updateWorksheets();
        }

        return doc.id;
      },
      'documents': documents,
      'document': function (urlId) { return documents[urlId]; }
    };
  }]);
