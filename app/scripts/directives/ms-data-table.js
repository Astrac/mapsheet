'use strict';

angular.module('mapsheetApp')
  .directive('msDataTable', function () {
    return {
      templateUrl: 'views/data-table.html',
      restrict: 'A',
      scope: {
        msDocument: '=',
        msGeoAdapter: '='
      },
      link: function postLink(scope) {
        scope.tableAdapter = new Mapsheet.TableAdapter(scope.msDocument);

        scope.chooseLat = function(col) {
          scope.msGeoAdapter.latCol = col.id;
        };

        scope.chooseLng = function(col) {
          scope.msGeoAdapter.lngCol = col.id;
        };

        scope.chooseRad = function(col) {
          scope.msGeoAdapter.radCol = col.id;
        };

        scope.showRow = function(row) {
          scope.msGeoAdapter.showRows.push(row);
        };

        scope.hideColumn = function(col) {
          console.log('hideCol');
          console.log(col);
          scope.tableAdapter.hideCols.push(col);
        };

        scope.isLat = function(col) { return scope.msGeoAdapter.latCol === col.id; };
        scope.isLng = function(col) { return scope.msGeoAdapter.lngCol === col.id; };
        scope.isRad = function(col) { return scope.msGeoAdapter.radCol === col.id; };

        var refreshTable = function() {
          scope.table = scope.tableAdapter.view();
          scope.columns = scope.tableAdapter.columns();
        };

        _.each(['msDocument.table', 'tableAdapter.currentPage', 'tableAdapter.hideCols.length'], function(prop) {
            scope.$watch(prop, refreshTable);
          });
      }
    };
  });
