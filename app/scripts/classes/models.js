if (typeof(Mapsheet) === 'undefined') {
  Mapsheet = {};
}

Mapsheet.Spreadsheet = DropletJS.Class.create({
  id: '',
  title: '',
  author: '',
  updated: null,
  worksheetsFeed: '',
  openLink: '',

  construct: function(id, title, author, updated, worksheetsFeed, openLink) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.updated = updated;
    this.worksheetsFeed = worksheetsFeed;
    this.openLink = openLink;
  },

  getHashId: function() {
    return new Hashes.SHA256().hex(this.id);
  }
});

Mapsheet.Worksheet = DropletJS.Class.create({
  id: '',
  title: '',
  cellsFeed: '',
  listFeed: '',

  construct: function(id, title, cellsFeed, listFeed) {
    this.id = id;
    this.title = title;
    this.cellsFeed = cellsFeed;
    this.listFeed = listFeed;
  },

  getHashId: function() {
    return new Hashes.SHA256().hex(this.id);
  }
});

Mapsheet.Document = DropletJS.Class.create({
  id: null,
  spreadsheet: null,
  worksheet: null,
  table: null,

  construct: function(spreadsheet, worksheet, table) {
    this.spreadsheet = spreadsheet;
    this.worksheet = worksheet;
    this.id = this.worksheet.getHashId();
    if (table) {
      this.table = table;
    }
  }
});

Mapsheet.Table = DropletJS.Class.create({
  rows: [],

  construct: function(rows) {
    this.rows = rows;
  }
});

Mapsheet.Cell = DropletJS.Class.create({
  id: '',
  name: '',
  row: -1,
  col: -1,
  content: '',

  construct: function(id, name, row, col, content) {
    this.id = id;
    this.name = name;
    this.row = row;
    this.col = col;
    this.content = content;
  }
});

Mapsheet.Project = DropletJS.Class.create({
  documents: [],
  current: null,

  construct: function(documents, current) {
    this.documents = documents;
    if (current) {
      this.current = current;
    } else if (documents) {
      this.current = documents[0];
    }
  },

  setCurrent: function(documentId) {
    var candidates = _.filter(this.documents, function(doc) { return doc.id == documentId; });
    if (candidates) {
      this.current = candidates[0];
    }
  }
});
