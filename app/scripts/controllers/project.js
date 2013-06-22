'use strict';

angular.module('mapsheetApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, $location, msLocalStorage, msGoogleApi) {
    console.log('ProjectCtrl');

    var docId = $routeParams.id;
    var tableParser = new Mapsheet.TableParser();

    var reloadDocument = function() {
      msLocalStorage.getDocument(docId).then(function(doc) {
        if (!doc) {
          $location.path('/');
          return;
        }

        $scope.doc = doc;

        msGoogleApi
          .request(doc.worksheet.cellsFeed)
          .success(function(data) {
            doc.table = tableParser.parse(data);

            $scope.geoAdapter = new Mapsheet.GeoAdapter(doc);
            $scope.tableAdapter = new Mapsheet.TableAdapter(doc);
          });
      });
    };

    reloadDocument();

    $scope.reloadDocument = reloadDocument;

  });
