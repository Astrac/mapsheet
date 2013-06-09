'use strict';

angular.module('mapsheetApp')
  .factory('msProjectManager', ['localStorageService', function (localStorageService) {
    var worksheets = JSON.parse(localStorageService.get('worksheets'));
    if (worksheets === null) {
      worksheets = [];
      updateWorksheets();
    }

    var updateWorksheets = function() {
      localStorageService.add('worksheets', JSON.stringify(worksheets));
    };

    var loadWorksheet = function(wks) {
      if (_.indexOf(worksheets, wks) == -1) {
        worksheets.push(wks);
        updateWorksheets();
      }
    };

    return {
      'loadWorksheet': loadWorksheet,
      'worksheets': worksheets
    };
  }]);
