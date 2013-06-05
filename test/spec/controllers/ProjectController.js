'use strict';

describe('Controller: ProjectControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('mapsheetApp'));

  var ProjectControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectControllerCtrl = $controller('ProjectControllerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
