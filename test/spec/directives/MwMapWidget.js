'use strict';

describe('Directive: MwMapWidget', function () {
  beforeEach(module('mapsheetApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<-mw-map-widget></-mw-map-widget>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the MwMapWidget directive');
  }));
});
