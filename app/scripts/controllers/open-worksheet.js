'use strict';

angular.module('mapsheetApp')
  .controller('OpenWorksheetCtrl', function ($rootScope, $scope, $http) {
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

    var errorHandler = function(data, status) {
      console.log('error');
      console.log(data);
      console.log(status);
    };

    var spreadsheetsHandler = function(data) {
      $scope.docs = _.map(data.feed.entry, function(e) {
        var wsFeed = hrefSolver(e.link, worksheetFeedCat);

        var spreadsheet = {
          id: e.id.$t,
          title: e.title.$t,
          author: _.reduce(e.author, function(memo, a) { return memo + a.name.$t; }, ""),
          worksheetsFeed: wsFeed,
          openLink: hrefSolver(e.link, "alternate"),
          updated: new Date(e.updated.$t)
        };

        feedReq(wsFeed, function(data) {
          spreadsheet['worksheets'] = _.map(data.feed.entry, function(e) {
            return e.title.$t;
          });
        });

        return spreadsheet;
      });
    };

    var worksheetsHandler = function(data) {
      console.log(data);
    }

    var feedReq = function(feed, successHandler) {
      return $http({
        method: 'GET',
        url: feed,
        params: {alt: 'json'},
        headers: {
          Authorization: 'Bearer ' + $rootScope.gapiToken
        }
      }).success(successHandler).error(errorHandler);
    };

    $scope.showWorksheets = function(worksheetsFeed) {
      feedReq(worksheetsFeed, worksheetsHandler);
    }

    feedReq('https://spreadsheets.google.com/feeds/spreadsheets/private/full', spreadsheetsHandler);
  });
