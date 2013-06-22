'use strict';

angular.module('mapsheetApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, $location, msStorage, msGoogleApi, msDocument) {
    console.log('ProjectCtrl');

    var docId = $routeParams.id;
    var tableParser = new Mapsheet.TableParser();

    var reloadDocument = function() {
      return msStorage.getDocument(docId).then(function(doc) {
        if (!doc) {
          $location.path('/');
          return;
        }

        msDocument.open(doc).then(function(doc) {
          console.log(doc);
          $scope.doc = doc;
          $scope.geoAdapter = new Mapsheet.GeoAdapter(doc);
          $scope.tableAdapter = new Mapsheet.TableAdapter(doc);
          console.log($scope.tableAdapter);
        });
      });
    };

    reloadDocument();

    $scope.reloadDocument = reloadDocument;

  });
