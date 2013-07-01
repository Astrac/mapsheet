'use strict';

angular.module('mapsheetApp')
  .factory('msDocument', function ($q, msGoogleApi, msGoogleTableParser) {
    var defaults = {
      map: {
        latCol: null,
        lngCol: null,
        radCol: null
      },
      table: {
        rowHeader: false,
        columns: {},
        pageSize: 15
      }
    };

    var doc = {
      id: null,
      config: defaults,
      worksheet: null,
      spreadsheet: null
    };
    var tableDocId = null;
    var table = [];

    var extendConfig = function(config) {
      return {
        map: _.extend(defaults.map, config && config.map ? config.map : {}),
        table: _.extend(defaults.table, config && config.table ? config.table : {})
      };
    };

    return {
      'doc': doc,
      open: function (d) {
        doc.id = d.id;
        doc.config = extendConfig(d.config);
        doc.worksheet = d.worksheet;
        doc.spreadsheet = d.spreadsheet;
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
              table = msGoogleTableParser.parse(data);
              deferred.resolve(table);
            });
        } else {
          deferred.reject('No worksheet defined');
        }

        return deferred.promise;
      }
    };
  });
