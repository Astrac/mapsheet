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
  var $q;

  // Some data fixture
  var noConfigDoc = {
    id: 'some-id',
    worksheet: {
      id: 'some-worksheet-uri',
      cellsFeed: '/some-worksheet-uri'
    },
    spreadsheet: 'some-spreadsheet-uri',
  };

  var resolveUser = function(id) {
    if (!id) {
      id = 'some-user-id';
    }

    $rootScope.$apply(function() {
      msGoogleApiDeferredMock.resolve({ 'id': id });
      // Creates a new deferred to allow different resolutions
      msGoogleApiDeferredMock = $q.defer();
    });
  };

  beforeEach(module('mapsheetApp', function($provide) {
    $provide.value('msGoogleApi', {
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
    $q = _$q_;

    msGoogleApiDeferredMock = $q.defer();
    localStorageService.clearAll();
  }));

  it('should initialize the documents, reload user data if re-initialized', function () {
    var docs;

    waitsFor(function() {
      return docs;
    }, 500);

    runs(function() {
      expect(msGoogleApi.request.calls.length).toEqual(1);
      expect(docs).toEqual({});

      msStorage.init();

      msStorage.getDocuments().then(function(d) {
        expect(msGoogleApi.request.calls.length).toEqual(2);
      });

      resolveUser();
    });

    msStorage.init();

    msStorage.getDocuments().then(function(d) {
      docs = d;
    });

    resolveUser();
  });

  it('should add documents to the storage, retrieve by id or retrieve list preserving data if reinitialized', function () {
    var docId;

    waitsFor(function() {
      return docId;
    }, 500);

    runs(function() {
      expect(msGoogleApi.request).toHaveBeenCalled();
      expect(docId).toEqual('some-doc-id');

      msStorage.getDocument(docId).then(function(doc) {
        expect(doc).toEqual({id: 'some-doc-id'});
        expect(msGoogleApi.request.calls.length).toEqual(1);
      });

      resolveUser();

      msStorage.init();

      msStorage.getDocuments().then(function(docs) {
        expect(docs).toEqual({'some-doc-id': {id: 'some-doc-id'}});
        expect(msGoogleApi.request.calls.length).toEqual(2);
      });

      resolveUser();
    });

    msStorage.addDocument({ id: 'some-doc-id' }).then(function(d) {
      docId = d;
    });

    resolveUser();
  });

  it('should keep different document lists for different users', function () {
    msStorage.init();
    msStorage.addDocument({ id: 'doc-id-1' }).then(function(docId) {
      expect(docId).toEqual('doc-id-1');
    });

    resolveUser('user-1');

    msStorage.init();
    msStorage.addDocument({ id: 'doc-id-2' }).then(function(docId) {
      expect(docId).toEqual('doc-id-2');
    });

    resolveUser('user-2');

    msStorage.init();
    msStorage.getDocuments().then(function(docs) {
      expect(docs).toEqual({'doc-id-1': { id: 'doc-id-1' }});
    });

    resolveUser('user-1');

    msStorage.init();
    msStorage.getDocuments().then(function(docs) {
      expect(docs).toEqual({'doc-id-2': { id: 'doc-id-2' }});
    });

    resolveUser('user-2');
  });
});
