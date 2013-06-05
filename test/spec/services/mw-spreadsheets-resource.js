'use strict';

describe('Service: mwSpreadsheetsResource', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var mwSpreadsheetsResource;
  beforeEach(inject(function (_mwSpreadsheetsResource_) {
    mwSpreadsheetsResource = _mwSpreadsheetsResource_;
  }));

  it('should do something', function () {
    expect(!!mwSpreadsheetsResource).toBe(true);
  });

});
