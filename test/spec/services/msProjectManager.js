'use strict';

describe('Service: msProjectManager', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msProjectManager;
  beforeEach(inject(function (_msProjectManager_) {
    msProjectManager = _msProjectManager_;
  }));

  it('should do something', function () {
    expect(!!msProjectManager).toBe(true);
  });

});
