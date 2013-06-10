'use strict';

angular.module('mapsheetApp')
  .controller('OpenWorksheetCtrl', function ($scope, $location, msGoogleFeed, msProjectManager) {
    console.log('OpenWorksheetCtrl');

    // TODO: Register these as services
    var spreadsheetParser = new Mapsheet.SpreadsheetParser();
    var worksheetParser = new Mapsheet.WorksheetParser();

    var spreadsheetsHandler = function(data) {
      var docs = _.map(data.feed.entry, function(e) {
        var spreadsheet = spreadsheetParser.parse(e);

        return {
          'spreadsheet': spreadsheet,
          'documents': []
        }
      });

      var columnsCout = 3;

      $scope.columns = [[], [], []];
      _.each(docs, function(doc, index) {
        $scope.columns[index % 3].push(doc);
      });
    };

    $scope.showWorksheets = function(wrapper) {
      if (wrapper.documents.length == 0) {
        msGoogleFeed.request(wrapper.spreadsheet.worksheetsFeed).success(function(data) {
          var documents = _.map(data.feed.entry, function(e) {
            return new Mapsheet.Document(wrapper.spreadsheet, worksheetParser.parse(e));
          });

          wrapper.documents = documents;
        });
      }
    }

    $scope.openDocument = function(doc) {
      var urlId = msProjectManager.load(doc);
      $location.path('/project/' + urlId);
    };

    msGoogleFeed.request('https://spreadsheets.google.com/feeds/spreadsheets/private/full').success(spreadsheetsHandler);
  });
