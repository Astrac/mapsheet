'use strict';

angular.module('mapsheetApp')
  .directive('msMapWidget', function () {
    return {
      templateUrl: 'views/map-widget.html',
      scope: {
        'msDocument': '=',
        'msGeoAdapter': '='
      },
      restrict: 'A',
      link: function(scope) {
        scope.lat = 0;
        scope.lon = 0;

        if (!scope.map) {
          scope.map = L.map('map').setView([51.505, -0.09], 13);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(scope.map);
        }

        scope.map.on('mousemove', function(evt) {
          scope.$apply(function() {
              scope.lat = evt.latlng.lat;
              scope.lon = evt.latlng.lng;
            });
        });

        scope.$watch('msGeoAdapter.showRows.length', function() {
          var points = scope.msGeoAdapter.geoPoints();
          _.each(points, function(point) {
              if (point.type === 'marker') {
                L.marker([point.lat, point.lng]).addTo(scope.map);
              }
              if (point.type === 'circle') {
                L.circle([point.lat, point.lng], point.rad).addTo(scope.map);
              }
            });
        });
      }
    };
  });
