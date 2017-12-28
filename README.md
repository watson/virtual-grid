# virtual-grid

A viewport into a virtual grid of text cells.

Renderes cells in a grid. Each cell contains text that is wrapped and
truncated to fit inside the cell. Full support for ANSI colors. Useful
as a layout manager for terminal apps.

[![Build status](https://travis-ci.org/watson/virtual-grid.svg?branch=master)](https://travis-ci.org/watson/virtual-grid)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install virtual-grid --save
```

## Usage

```js
const Grid = require('virtual-grid')

const grid = new Grid({
  height: 10,
  width: 20,
  rows: [
    [{height: 5, text: 'This is the top cell spanning the entire width'}],
    [{width: '50%', text: 'Left column'}, {width: '50%', text: 'Right column'}]
  ]
})

// Update the text in cell C
grid.update(1, 1, 'This text have been overwritten')

console.log(grid.toString())
```

Output:

```
This is the top cell
spanning the entire
width


Left      This text
column    have been
          overwritt…


```

## API

### `grid = new Grid(options)`

Provide an `options` object as the first argument. The following options
are supported:

- `width` - The total width of the viewport (defaults to
  `process.stdout.columns`)
- `height` - The total height of the viewport (defaults to
  `process.stdout.rows`)
- `rows` - An array of rows. Each row is an array of `cell` objects

A `cell` object supports the following properties:

- `width` - The width of the cell. If the value is the string `auto` it
  will fill out the remaining space in the viewport. If the value is a
  string containing a percent sign (e.g. `25%`), it's treated as a
  percentage of the total width of the viewport. Otherwise it's treated
  as an integer representing the width in columns (defaults to `auto`)
- `height` - The height of the cell. If the value is the string `auto`
  it will fill out the remaining space in the viewport. If the value is
  a string containing a percent sign (e.g. `25%`), it's treated as a
  percentage of the total height of the viewport. Otherwise it's treated
  as an integer representing the height in rows (defaults to `auto`)
- `text` - Default text content of the cell (defaults to an empty
  string)
- `wrap` - Set to `false` to disable automatic line wrapping (defaults
  to `true`)

You can use strings instead of objects for cells. This is equivalent to
`{text: cell}`

### `grid = new Grid(rows)`

An alias for:

```js
new Grid({rows: rows})
```

### Event: `update`

Emitted every time a cell in the grid is updated.

### `grid.update(row, cell, text)`

Update the text content of a cell.

Arguments:

- `row` - The row index
- `cell` - The cell index inside the row
- `text` - The new text content of the cell

### `grid.resize(width, height)`

Resize the viewport to new `width` and `height`.

### `cell = grid.cellAt(row, index)`

Return the cell at the gien `row` and index`.

### `str = grid.toString()`

Render all content in all cells in the grid and return the result as one
big string.

## License

MIT
