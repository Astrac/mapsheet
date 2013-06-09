'use strict';

describe('Directive: msNavigationBar', function () {
  beforeEach(module('mapsheetApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<ms-navigation-bar></ms-navigation-bar>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the msNavigationBar directive');
  }));
});
