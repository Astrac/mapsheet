'use strict';

angular.module('mapsheetApp')
  .controller('OpenWorksheetCtrl', function ($scope, $location, msGoogleApi, msStorage) {
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
        };
      });

      var columnsCount = 3;

      $scope.columns = [[], [], []];
      _.each(docs, function(doc, index) {
        $scope.columns[index % columnsCount].push(doc);
      });
    };

    $scope.showWorksheets = function(wrapper) {
      if (wrapper.documents.length === 0) {
        msGoogleApi.request(wrapper.spreadsheet.worksheetsFeed).success(function(data) {
          var documents = _.map(data.feed.entry, function(e) {
            return {
              spreadsheet: wrapper.spreadsheet,
              worksheet: worksheetParser.parse(e)
            };
          });

          wrapper.documents = documents;
        });
      }
    };

    $scope.openDocument = function(doc) {
      msStorage.addDocument(doc).then(function(urlId) {
        $location.path('/project/' + urlId);
      });
    };

    msGoogleApi.request('https://spreadsheets.google.com/feeds/spreadsheets/private/full').success(spreadsheetsHandler);
  });
