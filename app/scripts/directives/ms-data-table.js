'use strict';

angular.module('mapsheetApp')
  .directive('msDataTable', function () {
    return {
      templateUrl: 'views/data-table.html',
      restrict: 'A',
      scope: {
        msDocument: '=',
        msGeoAdapter: '=',
        msTableAdapter: '='
      },
      link: function (scope) {
        scope.chooseLat = function(col) {
          scope.msGeoAdapter.latCol = col.id;
        };

        scope.chooseLng = function(col) {
          scope.msGeoAdapter.lngCol = col.id;
        };

        scope.chooseRad = function(col) {
          scope.msGeoAdapter.radCol = col.id;
        };

        scope.toggleRow = function(row) {
          if (_.some(scope.msGeoAdapter.showRows, function(r) { return r.id === row.id; })) {
            scope.msGeoAdapter.showRows = _.filter(scope.msGeoAdapter.showRows, function(r) {
                return r.id !== row.id;
              });
          } else {
            scope.msGeoAdapter.showRows.push(row);
          }
        };

        scope.showAll = function() {
          scope.msGeoAdapter.showRows = scope.msDocument.table.rows;
        };

        scope.showNone = function() {
          scope.msGeoAdapter.showRows = [];
        };

        scope.isRowSelected = function(row) {
          return _.some(scope.msGeoAdapter.showRows, function(r) { return r.id === row.id; });
        };

        scope.hideColumn = function(col) {
          if (scope.msTableAdapter){
            scope.msTableAdapter.hideCols.push(col);
          }
        };

        scope.isLat = function(col) { return scope.msGeoAdapter.latCol === col.id; };
        scope.isLng = function(col) { return scope.msGeoAdapter.lngCol === col.id; };
        scope.isRad = function(col) { return scope.msGeoAdapter.radCol === col.id; };

        var refreshTable = function() {
          if (scope.msTableAdapter) {
            scope.table = scope.msTableAdapter.view();
            scope.columns = scope.msTableAdapter.columns();
          }
        };

        _.each(['msDocument.table', 'tableAdapter.currentPage', 'tableAdapter.hideCols.length'], function(prop) {
            scope.$watch(prop, refreshTable);
          });
      }
    };
  });
