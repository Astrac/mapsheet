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
})(this);
