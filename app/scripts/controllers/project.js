'use strict';

angular.module('mapsheetApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, msProjectManager, msGoogleApi) {
    console.log('ProjectCtrl');

    var docId = $routeParams.id;
    var tableParser = new Mapsheet.TableParser();

    var reloadDocument = function() {
      var doc = msProjectManager.document(docId);
      $scope.doc = doc;

      msGoogleApi
        .request(doc.worksheet.cellsFeed)
        .success(function(data) {
          doc.table = tableParser.parse(data);
        });

      $scope.geoAdapter = new Mapsheet.GeoAdapter($scope.doc);
    };

    if (docId !== '_empty') {
      reloadDocument();
    } else {
      $scope.doc = {};
    }

    $scope.reloadDocument = reloadDocument;

  });
