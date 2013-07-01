'use strict';

describe('Service: msGoogleTableParser', function () {

  // load the service's module
  beforeEach(module('mapsheetApp'));

  // instantiate service
  var msGoogleTableParser;
  beforeEach(inject(function (_msGoogleTableParser_) {
    msGoogleTableParser = _msGoogleTableParser_;
  }));

  var feedMock = {
    "feed": {
      "entry": [
        {
            "id": {
                "$t": "some-id"
            },
            "title": {
                "$t": "A1"
            },
            "content": {
                "$t": "some-content"
            },
            "gs$cell": {
                "row": "1",
                "col": "1"
            }
        },
        {
            "id": {
                "$t": "some-id"
            },
            "title": {
                "$t": "B1"
            },
            "content": {
                "$t": "some-content"
            },
            "gs$cell": {
                "row": "1",
                "col": "2"
            }
        },
        {
            "id": {
                "$t": "some-id"
            },
            "title": {
                "$t": "A2"
            },
            "content": {
                "$t": "some-content"
            },
            "gs$cell": {
                "row": "2",
                "col": "1"
            }
        },
        {
            "id": {
                "$t": "some-id"
            },
            "title": {
                "$t": "B2"
            },
            "content": {
                "$t": "some-content"
            },
            "gs$cell": {
                "row": "2",
                "col": "2"
            }
        },
        {
            "id": {
                "$t": "some-other-id"
            },
            "title": {
                "$t": "D5"
            },
            "content": {
                "$t": "some-other-content"
            },
            "gs$cell": {
                "row": "4",
                "col": "5"
            }
        }
      ]
    }
  };

  it('should correctly parse table data', function () {
    var table = msGoogleTableParser.parse(feedMock);
    // Check overal rows
    expect(table.length).toEqual(3);
    // Check row ids
    expect(table[0].id).toEqual(0);
    expect(table[1].id).toEqual(1);
    expect(table[2].id).toEqual(3);
    // Check columns
    expect(table[0].cells.length).toEqual(5);
    expect(table[1].cells.length).toEqual(5);
    expect(table[2].cells.length).toEqual(5);
    // Check ids
    expect(table[0].cells[0].id).toEqual('some-id');
    expect(table[0].cells[1].id).toEqual('some-id');
    expect(table[1].cells[0].id).toEqual('some-id');
    expect(table[1].cells[1].id).toEqual('some-id');
    expect(table[2].cells[4].id).toEqual('some-other-id');
    // Check contents
    expect(table[0].cells[0].content).toEqual('some-content');
    expect(table[0].cells[1].content).toEqual('some-content');
    expect(table[1].cells[0].content).toEqual('some-content');
    expect(table[1].cells[1].content).toEqual('some-content');
    expect(table[2].cells[4].content).toEqual('some-other-content');
    // Check empty cells
    expect(table[0].cells[2].id).toBe(null);
    expect(table[0].cells[2].content).toEqual('');
    expect(table[2].cells[2].id).toBe(null);
    expect(table[2].cells[2].content).toEqual('');
    // Checks row/cols
    expect(table[0].cells[1].row).toEqual(0);
    expect(table[0].cells[1].col).toEqual(1);
    expect(table[2].cells[2].col).toEqual(2);
    expect(table[2].cells[2].row).toEqual(3);
  });

});
