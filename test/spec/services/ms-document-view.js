'use strict';

describe('Service: msDocumentView', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msDocumentView;
  beforeEach(inject(function (_msDocumentView_) {
    msDocumentView = _msDocumentView_;
  }));

  xit('should do something', function () {
    expect(!!msDocumentView).toBe(true);
  });

});
