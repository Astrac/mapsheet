'use strict';

angular.module('mapsheetApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, msProjectManager, msCellManager, msGoogleFeed) {
    console.log('ProjectCtrl');

    var docId = $routeParams.id;

    if (docId != '_empty') {
      var doc = msProjectManager.document(docId);
      $scope.doc = doc;
      msCellManager.open(doc);
    } else {
      $scope.doc = [];
    }

    $scope.reloadDocument = function() {
      msCellManager.reload();
    };

  });
