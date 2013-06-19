'use strict';

describe('Service: msGoogleAuth', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msGoogleAuth;
  beforeEach(inject(function (_msGoogleAuth_) {
    msGoogleAuth = _msGoogleAuth_;
  }));

  xit('should do something', function () {
    expect(!!msGoogleAuth).toBe(true);
  });

});
