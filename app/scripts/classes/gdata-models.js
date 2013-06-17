(function(globals) {
  'use strict';

  if (typeof(globals.Mapsheet) === 'undefined') {
    globals.Mapsheet = {};
  }

  globals.Mapsheet.Spreadsheet = DropletJS.Class.create({
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

  globals.Mapsheet.Worksheet = DropletJS.Class.create({
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

})(this);
