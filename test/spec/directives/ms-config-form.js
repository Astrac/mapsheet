'use strict';

describe('Directive: msConfigForm', function () {
  beforeEach(module('mapsheetApp'));

  var element;

  xit('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<ms-config-form></ms-config-form>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the msConfigForm directive');
  }));
});
