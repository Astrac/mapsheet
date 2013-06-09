'use strict';

angular.module('mapsheetApp')
  .factory('msCellManager', function (msGoogleFeed, localStorageService) {

    var cellManager = {
      cells: [],
      open: function(wks) {
        var self = this;
        var storageId = new Hashes.SHA512().hex(wks.id);

        var cellsHandler = function (data) {
          var cells = _.reduce(data.feed.entry, function(memo, cell) {
            var row = cell.gs$cell.row - 1;
            var col = cell.gs$cell.col - 1;

            if (!memo[row]) {
              memo[row] = [];
            }

            memo[row][col] = {
              id: cell.id.$t,
              name: cell.title.$t,
              content: cell.content.$t
            };

            return _.filter(memo, function(r) { return r; });
          }, []);

          localStorageService.add(storageId, JSON.stringify(cells));
          self.cells = cells;
        }

        self.cells = JSON.parse(localStorageService.get(storageId));
        if (!self.cells) {
          var cells = msGoogleFeed
            .request(wks.cellsFeed)
            .success(cellsHandler);
        }
      }
    };

    return cellManager;
  });
