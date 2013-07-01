'use strict';

describe('Service: msGoogleTableParser', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msGoogleTableParser;
  beforeEach(inject(function (_msGoogleTableParser_) {
    msGoogleTableParser = _msGoogleTableParser_;
  }));

  xit('should do something', function () {
    expect(!!msGoogleTableParser).toBe(true);
  });

});
