'use strict';

describe('Service: msGoogleFeed', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msGoogleFeed;
  beforeEach(inject(function (_msGoogleFeed_) {
    msGoogleFeed = _msGoogleFeed_;
  }));

  it('should do something', function () {
    expect(!!msGoogleFeed).toBe(true);
  });

});
