'use strict';

describe('Controller: OpenWorksheetCtrl', function () {

  // load the controller's module
  beforeEach(module('mapsheetApp'));

  var OpenWorksheetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OpenWorksheetCtrl = $controller('OpenWorksheetCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
