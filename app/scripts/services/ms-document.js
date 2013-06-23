'use strict';

angular.module('mapsheetApp')
  .factory('msDocument', function ($q, msGoogleApi) {
    // TODO: This should be a service on its own!
    var tableParser = new Mapsheet.TableParser();

    var defaults = {
      map: {
        latCol: null,
        lngCol: null,
        radCol: null
      },
      table: {
        rowHeader: false,
        hideColumns: [],
        pageSize: 15,
        page: 1
      }
    };

    var doc = {
      config: defaults
    };
    var table = [];
    var tableUpToDate = true;

    return {
      open: function (d) {
        d.config = _.extend(defaults, d.config);
        doc = d;
        tableUpToDate = false;
      },
      getDocument: function() {
        return doc;
      },
      isTableUpToDate: function() {
        return tableUpToDate;
      },
      getTable: function() {
        var deferred = $q.defer();

        if (tableUpToDate) {
          deferred.resolve(table);
        } else {
          msGoogleApi
            .request(doc.worksheet.cellsFeed)
            .success(function(data) {
              deferred.resolve(tableParser.parse(data));
            });
        }

        return deferred.promise;
      }
    };
  });
