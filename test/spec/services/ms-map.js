'use strict';

describe('Service: msMap', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msMap;
  beforeEach(inject(function (_msMap_) {
    msMap = _msMap_;
  }));

  xit('should do something', function () {
    expect(!!msMap).toBe(true);
  });

});
