'use strict';

angular.module('mapsheetApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, $location, msStorage, msGoogleApi, msDocument) {
    console.log('ProjectCtrl');

    var docId = $routeParams.id;

    var reloadDocument = function() {
      return msStorage.getDocument(docId).then(function(doc) {
        if (!doc) {
          $location.path('/');
          return;
        }

        msDocument.open(doc);
        $scope.doc = doc;
      });
    };

    reloadDocument();

    $scope.reloadDocument = reloadDocument;

  });
