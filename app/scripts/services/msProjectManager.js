'use strict';

angular.module('mapsheetApp')
  .factory('msProjectManager', ['localStorageService', function (localStorageService) {
    var worksheets = JSON.parse(localStorageService.get('worksheets'));

    var updateWorksheets = function() {
      localStorageService.add('worksheets', JSON.stringify(worksheets));
    };

    if (worksheets === null) {
      worksheets = {};
      updateWorksheets();
    }

    var loadWorksheet = function(wks) {
      var urlId = new Hashes.SHA512().hex(wks.id);

      if (!worksheets[urlId]) {
        worksheets[urlId] = wks;
        updateWorksheets();
      }

      return urlId;
    };

    return {
      'loadWorksheet': loadWorksheet,
      'worksheets': worksheets,
      'worksheet': function (urlId) { return worksheets[urlId]; }
    };
  }]);
