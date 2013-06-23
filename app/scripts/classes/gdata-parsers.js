(function(globals) {
  'use strict';

  if (typeof(globals.Mapsheet) === 'undefined') {
    globals.Mapsheet = {};
  }

  var baseSchema = 'http://schemas.google.com/spreadsheets/2006#';
  var worksheetFeedSchema = baseSchema + 'worksheetsfeed';
  var cellsFeedSchema = baseSchema + 'cellsfeed';
  var listFeedSchema = baseSchema + 'listfeed';

  var resolveHref = function(links, rel, type) {
    var candidates = _.filter(links, function(l) {
      return (l.rel === rel) && (!type || l.type === type);
    });

    if (candidates.length > 0) {
      return candidates[0].href;
    }

    return null;
  };

  globals.Mapsheet.GDataParser = DropletJS.Class.create({
    parse: DropletJS.Class.FUNCTION
  });

  globals.Mapsheet.SpreadsheetParser = DropletJS.Class.extend(globals.Mapsheet.GDataParser, {
    parse: function(data) {
      return new globals.Mapsheet.Spreadsheet(
        data.id.$t,
        data.title.$t,
        _.reduce(data.author, function(memo, a) { return memo + ', ' + a.name.$t; }, ''),
        new Date(data.updated.$t),
        resolveHref(data.link, worksheetFeedSchema),
        resolveHref(data.link, 'alternate', 'text/html')
      );
    }
  });

  globals.Mapsheet.WorksheetParser = DropletJS.Class.extend(globals.Mapsheet.GDataParser, {
    parse: function(data) {
      return new globals.Mapsheet.Worksheet(
        data.id.$t,
        data.title.$t,
        resolveHref(data.link, cellsFeedSchema),
        resolveHref(data.link, listFeedSchema)
      );
    }
  });

  globals.Mapsheet.TableParser = DropletJS.Class.extend(globals.Mapsheet.GDataParser, {
    parse: function(data) {
      var numCols = _.max(data.feed.entry, function(e) {
        return e.gs$cell.col;
      }).gs$cell.col;

      var rows = _.filter(_.reduce(data.feed.entry, function(memo, cell) {
        var row = cell.gs$cell.row - 1;
        var col = cell.gs$cell.col - 1;

        if (!memo[row]) {
          var newCells = _.times(numCols, function(col) {
            return {
              id: null,
              name: '',
              'row': row,
              'col': col,
              content: ''
            }
          });

          memo[row] = { id: row, cells:  newCells };
        }

        memo[row].cells[col] = {
          id: cell.id.$t,
          name: cell.title.$t,
          'row': row,
          'col': col,
          content: cell.content.$t
        }

        return memo;
      }, []), function(r) { return r.cells.length > 0; });

      return rows;
    }
  });
})(this);
