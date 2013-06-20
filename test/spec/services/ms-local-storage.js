'use strict';

describe('Service: msLocalStorage', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msLocalStorage;
  beforeEach(inject(function (_msLocalStorage_) {
    msLocalStorage = _msLocalStorage_;
  }));

  xit('should do something', function () {
    expect(!!msLocalStorage).toBe(true);
  });

});
