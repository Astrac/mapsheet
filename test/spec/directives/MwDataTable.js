'use strict';

describe('Directive: MwDataTable', function () {
  beforeEach(module('mapsheetApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<-mw-data-table></-mw-data-table>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the MwDataTable directive');
  }));
});
