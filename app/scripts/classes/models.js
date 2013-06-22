(function(globals) {
  'use strict';

  if (typeof(globals.Mapsheet) === 'undefined') {
    globals.Mapsheet = {};
  }

  globals.Mapsheet.Table = DropletJS.Class.create({
    rows: [],

    construct: function(rows) {
      this.rows = rows;
    },

    row: function(id) {
      var row = _.filter(this.rows, function (r) { return r.id === id; });

      if (row.length === 0) {
        return null;
      }

      return row[0];
    },

    col: function(id) {
      console.log('NYI col: ' + id);
      return null;
    }
  });

  globals.Mapsheet.Row = DropletJS.Class.create({
    id: null,
    cells: [],

    construct: function(id, cells) {
      this.id = id;
      this.cells = cells;
    },

    cell: function(id) {
      var cell = _.filter(this.cells, function (c) { return id === c.id; });

      if (cell.length === 0) {
        return null;
      }

      return cell[0];
    },

    col: function(colId) {
      var cell = _.filter(this.cells, function (c) { return colId === c.col; });

      if (cell.length === 0) {
        return null;
      }

      return cell[0];
    },

    setCell: function(cell) {
      this.cells[cell.col] = cell;
    }
  });

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
