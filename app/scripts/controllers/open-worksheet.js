'use strict';

angular.module('mapsheetApp')
  .controller('OpenWorksheetCtrl', function ($scope, $location, msGoogleFeed, msProjectManager) {
    console.log('OpenWorksheetCtrl');

    var baseSchema = "http://schemas.google.com/spreadsheets/2006#";
    var worksheetFeedSchema = baseSchema + "worksheetsfeed";
    var cellsFeedSchema = baseSchema + "cellsfeed";
    var listFeedSchema = baseSchema + "listfeed";

    var hrefSolver = function(ls, rel, type) {
      var candidates = _.filter(ls, function(l) {
        return (l.rel == rel) && (!type || l.type == type);
      });

      if (candidates.length > 0) {
        return candidates[0].href;
      }

      return null;
    };

    var spreadsheetsHandler = function(data) {
      var docs = _.map(data.feed.entry, function(e) {
        var wsFeed = hrefSolver(e.link, worksheetFeedSchema);

        var spreadsheet = {
          id: e.id.$t,
          title: e.title.$t,
          author: _.reduce(e.author, function(memo, a) { return memo + a.name.$t; }, ""),
          worksheetsFeed: wsFeed,
          openLink: hrefSolver(e.link, 'alternate', 'text/html'),
          updated: new Date(e.updated.$t)
        };

        msGoogleFeed.request(wsFeed).success(function(data) {
          spreadsheet['worksheets'] = _.map(data.feed.entry, function(e) {
            return {
              title: e.title.$t,
              id: e.id.$t,
              openLink: spreadsheet.openLink,
              cellsFeed: hrefSolver(e.link, cellsFeedSchema),
              listFeed: hrefSolver(e.link, listFeedSchema)
            }
          });
        });

        return spreadsheet;
      });

      var columnsCout = 3;

      $scope.columns = [[], [], []];
      _.each(docs, function(doc, index) {
        $scope.columns[index % 3].push(doc);
      });
    };

    $scope.openWorksheet = function(wks) {
      var urlId = msProjectManager.loadWorksheet(wks);
      $location.path('/project/' + urlId);
    };

    msGoogleFeed.request('https://spreadsheets.google.com/feeds/spreadsheets/private/full').success(spreadsheetsHandler);
  });
