'use strict';

describe('Service: msDocument', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msDocument;
  var msGoogleTableParser;
  var $rootScope;
  var msGoogleApi;
  var msGoogleApiDeferredMock;

  // Some data fixture
  var noConfigDoc = {
    id: 'some-id',
    worksheet: {
      id: 'some-worksheet-uri',
      cellsFeed: '/some-worksheet-uri'
    },
    spreadsheet: 'some-spreadsheet-uri',
  };

  beforeEach(module('mapsheetApp', function($provide) {
    $provide.value('msGoogleTableParser', {
      parse: jasmine.createSpy('parse').andReturn({fooTable: 'barTable'})
    });

    $provide.value('msGoogleApi', {
      // request: jasmine.createSpy('request').andCallFake(function() { return msGoogleApiDeferredMock.promise; })
      request: jasmine.createSpy('request').andCallFake(function() {
          return {
            success: function(f) {
              return msGoogleApiDeferredMock.promise.then(f);
            }
          };
        }
      )
    });
  }));

  // Initialize
  beforeEach(inject(function (_msDocument_, _msGoogleApi_, _msGoogleTableParser_, _$rootScope_, _$q_) {
    msDocument = _msDocument_;
    msGoogleTableParser = _msGoogleTableParser_;
    $rootScope = _$rootScope_;
    msGoogleApi = _msGoogleApi_;

    msGoogleApiDeferredMock = _$q_.defer();
  }));

  it('should correctly set status and defaults invoking open', function () {
    msDocument.open(noConfigDoc);
    expect(msDocument.getDocument()).toEqual(_.extend(noConfigDoc, {
      config: {
        map: {
          latCol: null,
          lngCol: null,
          radCol: null
        },
        table: {
          rowHeader: false,
          columns: {},
          pageSize: 15
        }
      }
    }));

    var someConfigDoc = _.extend(noConfigDoc, {
      config: {
        map: {
          latCol: 1
        },
        table: {
          pageSize: 3
        }
      }
    });

    msDocument.open(someConfigDoc);
    expect(msDocument.getDocument()).toEqual(_.extend(noConfigDoc, {
      config: {
        map: {
          latCol: 1,
          lngCol: null,
          radCol: null
        },
        table: {
          rowHeader: false,
          columns: {},
          pageSize: 3
        }
      }
    }));
  });

  it('should correctly open the table and cache it', function() {
    var table;

    waitsFor(function() {
      return table;
    });

    var resolve = function() {
      $rootScope.$apply(function() {
        msGoogleApiDeferredMock.resolve({ foo: 'bar' });
      });
    };

    runs(function() {
      expect(msGoogleApi.request).toHaveBeenCalled();
      expect(msGoogleTableParser.parse).toHaveBeenCalled();
      expect(table).toEqual({ fooTable: 'barTable' });

      msDocument.getTable().then(function(d) {
          expect(msGoogleApi.request.calls.length).toEqual(1);
          expect(msGoogleTableParser.parse.calls.length).toEqual(1);
          expect(d).toEqual({ fooTable: 'barTable' });
        });

      resolve();
    });

    msDocument.open(noConfigDoc);

    msDocument.getTable().then(function(d) {
        table = d;
      });

    $rootScope.$apply(function() {
      msGoogleApiDeferredMock.resolve({ foo: 'bar' });
    });

    resolve();
  });

});
