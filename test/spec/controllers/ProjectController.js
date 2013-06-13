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

  xit('Should have some tests...', function () {
  });
});
