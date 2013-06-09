'use strict';

angular.module('mapsheetApp')
  .controller('OpenWorksheetCtrl', function ($scope, $location, msGoogleFeed, msProjectManager) {
    console.log('OpenWorksheetCtrl');

    var worksheetFeedCat = "http://schemas.google.com/spreadsheets/2006#worksheetsfeed";

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
        var wsFeed = hrefSolver(e.link, worksheetFeedCat);

        var spreadsheet = {
          id: e.id.$t,
          title: e.title.$t,
          author: _.reduce(e.author, function(memo, a) { return memo + a.name.$t; }, ""),
          worksheetsFeed: wsFeed,
          openLink: hrefSolver(e.link, "alternate"),
          updated: new Date(e.updated.$t)
        };

        msGoogleFeed.request(wsFeed).success(function(data) {
          spreadsheet['worksheets'] = _.map(data.feed.entry, function(e) {
            return {
              title: e.title.$t,
              id: e.id.$t,
              cellsFeed: hrefSolver(e.link, "cellsfeed"),
              listFeed: hrefSolver(e.link, "listfeed")
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

    var worksheetsHandler = function(data) {
      console.log(data);
    };

    $scope.showWorksheets = function(worksheetsFeed) {
      msGoogleFeed.request(worksheetsFeed).success(worksheetsHandler);
    };

    $scope.openWorksheet = function(wks) {
      msProjectManager.loadWorksheet(wks);
      $location.path('/project');
    };

    msGoogleFeed.request('https://spreadsheets.google.com/feeds/spreadsheets/private/full').success(spreadsheetsHandler);
  });
