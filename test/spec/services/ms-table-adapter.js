'use strict';

describe('Service: msTableAdapter', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msTableAdapter;
  beforeEach(inject(function (_msTableAdapter_) {
    msTableAdapter = _msTableAdapter_;
  }));

  xit('should do something', function () {
    expect(!!msTableAdapter).toBe(true);
  });

});
