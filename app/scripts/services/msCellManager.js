'use strict';

angular.module('mapsheetApp')
  .factory('msCellManager', function (msGoogleFeed, localStorageService) {

    var cellsHandler = function(manager, storageId) {
      return function (data) {
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
        manager.cells = cells;
      }
    };

    var cellManager = {
      spreadsheet: null,
      doc: null,
      worksheet: null,
      cells: [],
      open: function(doc) {
        this.doc = doc;
        this.worksheet = doc.worksheet;
        this.cells = JSON.parse(localStorageService.get(this.doc.id));

        if (!this.cells) {
          this.reload();
        }
      },
      reload: function(success) {
        msGoogleFeed
          .request(this.worksheet.cellsFeed)
          .success(cellsHandler(this, this.doc.id));

        if (success) {
          success(this);
        }
      }
    };

    return cellManager;
  });
