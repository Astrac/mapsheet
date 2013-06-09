'use strict';

describe('Service: msCellManager', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msCellManager;
  beforeEach(inject(function (_msCellManager_) {
    msCellManager = _msCellManager_;
  }));

  it('should do something', function () {
    expect(!!msCellManager).toBe(true);
  });

});
