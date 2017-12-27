'use strict'

const wrap = require('wrap-ansi')
const substr = require('ansi-substring')
const pad = require('fixed-width-string')

module.exports = Grid

function Grid (opts) {
  if (!(this instanceof Grid)) return new Grid(opts)

  const rows = Array.isArray(opts) ? opts : opts.rows
  this._rows = rows.map(function (row) {
    if (Array.isArray(row)) row = {cells: row}
    row.cells = row.cells.map(function (cell) {
      return {
        _width: cell.width || 'auto',
        _height: cell.height || 'auto',
        text: cell.text || '',
        wrap: cell.wrap !== false
      }
    })
    return row
  })

  this.resize(
    opts.width || process.stdout.columns,
    opts.height || process.stdout.rows
  )
}

Grid.prototype.toString = function () {
  return this._rows.reduce(function (str, row) {
    for (let line = 0; line < row.height; line++) {
      str = row.cells.reduce(function (str, cell) {
        return str + (line >= cell.lines.length
          ? cell.whitespace
          : cell.lines[line])
      }, str) + '\n'
    }
    return str
  }, '').slice(0, -1) // drop last line break
}

Grid.prototype.update = function (row, col, text) {
  const cell = this._rows[row].cells[col]
  cell.text = text
  cell.lines = renderCellLines(cell)
}

Grid.prototype.resize = function (viewportWidth, viewportHeight) {
  const autoHeightRows = []
  let fixedHeight = 0

  this._rows.forEach(function (row) {
    const autoWidthCells = []
    let autoHeight = false

    // calculate cell dimentions for cells with fixed sizes
    row.cells.forEach(function (cell) {
      // in case we're resizing, reset the previously calculated dimentions
      cell.width = null
      cell.height = null

      if (cell._width === 'auto') autoWidthCells.push(cell)
      else cell.width = normalizeSize(cell._width, viewportWidth)
      if (cell._height === 'auto') autoHeight = true
      else cell.height = normalizeSize(cell._height, viewportHeight)
    })

    // calculate width for cells with 'auto' width
    if (autoWidthCells.length > 0) {
      const remainingWidth = calcRemainingWidth(row.cells, viewportWidth)
      const autoWidth = Math.floor(remainingWidth / autoWidthCells.length)
      let cell
      for (let i = 0; i < autoWidthCells.length; i++) {
        cell = autoWidthCells[i]
        cell.width = autoWidth
      }
      cell.width += (remainingWidth % autoWidthCells.length) * autoWidthCells.length
    }

    if (autoHeight) {
      autoHeightRows.push(row)
    } else {
      // populate row height if not 'auto'
      row.height = rowHeight(row)
      fixedHeight += row.height
    }
  })

  // calculate height for rows with 'auto' height
  if (autoHeightRows.length > 0) {
    const remainingHeight = viewportHeight - fixedHeight
    const autoHeight = Math.floor(remainingHeight / autoHeightRows.length)

    // set height on rows that are 'auto'
    let row
    for (let i = 0; i < autoHeightRows.length; i++) {
      row = autoHeightRows[i]
      row.height = autoHeight
    }
    row.height += (remainingHeight % autoHeightRows.length) * autoHeightRows.length

    // inherit row height on all calls that are 'auto'
    for (let i = 0; i < autoHeightRows.length; i++) {
      autoHeightRows[i].cells.forEach(function (cell) {
        cell.height = cell.height || row.height
      })
    }
  }

  // populate remaining cell properties
  const self = this
  this._rows.forEach(function (row) {
    const y = calcY(self._rows, row)
    row.cells.forEach(function (cell) {
      cell.whitespace = Array(cell.width + 1).join(' ')
      cell.lines = renderCellLines(cell)
      cell.x = calcX(row, cell)
      cell.y = y
    })
  })
}

function normalizeSize (size, max) {
  if (Number.isFinite(size) || size === 'auto') {
    // we'll deal with 'auto' when we have normalized everything else
    return size
  } else if (typeof size === 'string') {
    const isPct = size.indexOf('%') !== -1
    return isPct
      ? Math.round(parseInt(size, 10) / 100 * max)
      : parseInt(size, 10)
  } else {
    throw new Error('Unexpected size: ' + size)
  }
}

function calcRemainingWidth (cells, viewportWidth) {
  const fixedWidth = cells.reduce(function (total, cell) {
    return total + (cell.width || 0)
  }, 0)
  return viewportWidth - fixedWidth
}

function renderCellLines (cell) {
  let text = cell.text
  if (cell.wrap) text = wrap(text, cell.width)
  const lines = text.split('\n').slice(0, cell.height)
  if (cell.wrap) {
    return lines.map(function (line) {
      return pad(line, cell.width)
    })
  } else {
    return lines.map(function (line) {
      return pad(substr(line, 0, cell.width), cell.width)
    })
  }
}

function rowHeight (row) {
  return row.cells.reduce(function (height, cell) {
    return cell.height > height ? cell.height : height
  }, 0)
}

function calcX (row, cell) {
  let x = 0
  while (--cell > 0) x += row.cells[cell].width
  return x
}

function calcY (rows, row) {
  let y = 0
  while (--row > 0) y += rows[row].height
  return y
}
