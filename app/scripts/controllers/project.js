'use strict';

angular.module('mapsheetApp')
  .controller('ProjectCtrl', function ($scope, msProjectManager) {
    console.log('ProjectCtrl');

    $scope.worksheets = msProjectManager.worksheets;
    console.log(msProjectManager.worksheets);
  });
