'use strict';

angular.module('mapsheetApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, msProjectManager, msCellManager, msGoogleFeed) {
    console.log('ProjectCtrl');

    var wksId = $routeParams.id;

    if (wksId != '_empty') {
      var wks = msProjectManager.worksheet(wksId);
      $scope.wks = wks;
      msCellManager.open(wks);
    } else {
      $scope.wks = [];
    }

  });
