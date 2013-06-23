(function(globals) {
  'use strict';

  if (typeof(globals.Mapsheet) === 'undefined') {
    globals.Mapsheet = {};
  }

  globals.Mapsheet.Cell = DropletJS.Class.create({
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
}(this));
