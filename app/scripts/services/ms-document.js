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
        pageSize: 15
      }
    };

    var doc = {
      config: defaults
    };
    var tableDocId = null;
    var table = [];

    return {
      open: function (d) {
        d.config = _.extend(defaults, d.config);
        doc = d;
      },
      getDocument: function() {
        return doc;
      },
      getTable: function() {
        var deferred = $q.defer();

        if (tableDocId === doc.id) {
          deferred.resolve(table);
        } else if (doc.worksheet) {
          msGoogleApi
            .request(doc.worksheet.cellsFeed)
            .success(function(data) {
              tableDocId = doc.id;
              table = tableParser.parse(data);
              deferred.resolve(table);
            });
        } else {
          deferred.reject('No worksheet defined');
        }

        return deferred.promise;
      }
    };
  });
