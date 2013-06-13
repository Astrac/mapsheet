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

  xit('Should have some tests...', function () {
  });
});
