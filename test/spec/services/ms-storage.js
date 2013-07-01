'use strict';

describe('Service: msStorage', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msStorage;
  var localStorageService;
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
  beforeEach(inject(function (_msStorage_, _localStorageService_, _msGoogleApi_, _$rootScope_, _$q_) {
    msStorage = _msStorage_;
    localStorageService = _localStorageService_;
    $rootScope = _$rootScope_;
    msGoogleApi = _msGoogleApi_;

    msGoogleApiDeferredMock = _$q_.defer();
    localStorageService.clearAll();
  }));

  it('should initialize the documents', function () {
    var docs;

    waitsFor(function() {
      return docs;
    }, 500);

    runs(function() {
      expect(msGoogleApi.request).toHaveBeenCalled();
      expect(docs).toEqual({});
    });

    msStorage.init().then(function(d) {
      docs = d;
    });

    $rootScope.$apply(function() {
      msGoogleApiDeferredMock.resolve({ id: 'some-user-id' });
    });
  });

  it('should add documents to the storage', function () {
    var docId;

    var resolve = function() {
      $rootScope.$apply(function() {
        msGoogleApiDeferredMock.resolve({ id: 'some-user-id' });
      });
    };

    waitsFor(function() {
      return docId;
    }, 500);

    runs(function() {
      expect(msGoogleApi.request).toHaveBeenCalled();
      expect(docId).toEqual('some-doc-id');
      msStorage.getDocument(docId).then(function(doc) {
        expect(doc).toEqual({id: 'some-doc-id'});
        // expect(msGoogleApi.request.calls.length).toEqual(1); TODO: Caching strategy for user in storage
      });

      resolve();

      msStorage.getDocuments().then(function(docs) {
        expect(docs).toEqual({'some-doc-id': {id: 'some-doc-id'}});
        // expect(msGoogleApi.request.calls.length).toEqual(1); TODO: Caching strategy for user in storage
      });

      resolve();
    });

    msStorage.addDocument({ id: 'some-doc-id' }).then(function(d) {
      docId = d;
    });

    resolve();
  });
});
