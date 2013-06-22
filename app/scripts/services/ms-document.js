'use strict';

angular.module('mapsheetApp')
  .factory('msDocument', function ($q, msGoogleApi, msTable) {
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
        showColumns: [],
        pageSize: 15,
        page: 1
      }
    };

    var buildTable = function(doc) {
      var deferred = $q.defer();

      if (doc.worksheet === null) {
        deferred.reject('No worksheet associated');
      } else {
        msGoogleApi
          .request(doc.worksheet.cellsFeed)
          .success(function(data) {
            doc.table = tableParser.parse(data)
            deferred.resolve(doc);
          });
      }

      return deferred.promise;
    }

    return {
      open: function (doc) {
        doc.config = _.extend(defaults, doc.config);
        return buildTable(doc);
      }
    };
  });
