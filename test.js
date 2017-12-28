'use strict'

const test = require('tape')
const chalk = require('chalk')
const Grid = require('./')

test('translate percentages', function (t) {
  const grid = new Grid({
    width: 200,
    height: 200,
    rows: [[{width: '11%', height: '33%'}]]
  })

  t.equal(grid._rows[0].cells[0].width, 22)
  t.equal(grid._rows[0].cells[0].height, 66)
  t.end()
})

test('cell as string', function (t) {
  const grid = new Grid({
    width: 10,
    height: 1,
    rows: [['foo']]
  })

  t.equal(grid.toString(),
  // 1234567890
    'foo       ')
  t.end()
})

test('cell full', function (t) {
  const text = '0123456789\nabcdefghij\n0123456789'
  const grid = new Grid({
    width: 10,
    height: 3,
    rows: [[{text: text}]]
  })

  t.equal(grid.toString(), text)
  t.end()
})

test('padding - int', function (t) {
  const grid = new Grid({
    width: 10,
    height: 5,
    rows: [[{text: 'foo\nbar', padding: 1}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    '          \n' +
    ' foo      \n' +
    ' bar      \n' +
    '          \n' +
    '          ')
  t.end()
})

test('padding - array(1)', function (t) {
  const grid = new Grid({
    width: 10,
    height: 5,
    rows: [[{text: 'foo\nbar', padding: [1]}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    '          \n' +
    ' foo      \n' +
    ' bar      \n' +
    '          \n' +
    '          ')
  t.end()
})

test('padding - array(2)', function (t) {
  const grid = new Grid({
    width: 10,
    height: 5,
    rows: [[{text: 'foo\nbar', padding: [1, 2]}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    '          \n' +
    '  foo     \n' +
    '  bar     \n' +
    '          \n' +
    '          ')
  t.end()
})

test('padding - array(3)', function (t) {
  const grid = new Grid({
    width: 10,
    height: 5,
    rows: [[{text: 'foo\nbar', padding: [1, 2, 3]}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    '          \n' +
    '  foo     \n' +
    '          \n' +
    '          \n' +
    '          ')
  t.end()
})

test('padding right', function (t) {
  const grid = new Grid({
    width: 10,
    height: 1,
    rows: [[{text: '12345678901234567890', padding: [0, 1, 0, 0], wrap: false}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    '123456789 ')
  t.end()
})

test('padding - array(4)', function (t) {
  const grid = new Grid({
    width: 10,
    height: 5,
    rows: [[{text: 'foo\nbar', padding: [1, 2, 3, 4]}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    '          \n' +
    '    foo   \n' +
    '          \n' +
    '          \n' +
    '          ')
  t.end()
})

test('cell wrap', function (t) {
  const grid = new Grid({
    width: 10,
    height: 3,
    rows: [[{text: 'this is a test of a long line'}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    'this is a \n' +
    'test of a \n' +
    'long line ')
  t.end()
})

test('cell wrap - no whitespace', function (t) {
  const grid = new Grid({
    width: 10,
    height: 3,
    rows: [[{text: 'thisisatestofalongline'}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    'thisisate…\n' +
    '          \n' +
    '          ')
  t.end()
})

test('cell wrap - ansi codes', function (t) {
  const grid = new Grid({
    width: 10,
    height: 3,
    rows: [[{text: 'this ' + chalk.green('is') + ' a test of a long line'}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    'this \x1b[32mis\x1b[39m a \n' +
    'test of a \n' +
    'long line ')
  t.end()
})

test('no cell wrap', function (t) {
  const grid = new Grid({
    width: 10,
    height: 3,
    rows: [[{text: 'this is a test of a long line', wrap: false}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    'this is a \n' +
    '          \n' +
    '          ')
  t.end()
})

test('no cell wrap - ansi codes', function (t) {
  const grid = new Grid({
    width: 10,
    height: 3,
    rows: [[{text: 'this ' + chalk.green('is') + ' a test of a long line', wrap: false}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    'this \x1b[32mis\x1b[39m a \n' +
    '          \n' +
    '          ')
  t.end()
})

test('omit overflow lines', function (t) {
  const grid = new Grid({
    width: 10,
    height: 3,
    rows: [[{text: '1\n2\n3\n4'}]]
  })

  t.equal(grid.toString(),
  // 1234567890
    '1         \n' +
    '2         \n' +
    '3         ')
  t.end()
})

test('two columns - even', function (t) {
  const grid = new Grid({
    width: 20,
    height: 2,
    rows: [['left', 'right']]
  })

  t.equal(grid.toString(),
  // 12345678901234567890
    'left      right     \n' +
    '                    ')
  t.end()
})

test('two columns - odd', function (t) {
  const grid = new Grid({
    width: 21,
    height: 2,
    rows: [['left', 'right']]
  })

  t.equal(grid.toString(),
  // 123456789012345678901
    'left      right      \n' +
    '                     ')
  t.end()
})

test('span cells', function (t) {
  const grid = new Grid({
    width: 20,
    height: 10,
    rows: [
      [{height: 3, text: 'top'}],
      [{width: '50%', text: 'left'}, {width: '50%', text: 'right'}]
    ]
  })

  t.equal(grid.toString(),
  // 12345678901234567890
    'top                 \n' +
    '                    \n' +
    '                    \n' +
    'left      right     \n' +
    '                    \n' +
    '                    \n' +
    '                    \n' +
    '                    \n' +
    '                    \n' +
    '                    ')
  t.end()
})

test('grid.update', function (t) {
  const grid = new Grid({
    width: 5,
    height: 1,
    rows: [[{text: 'foo'}]]
  })
  t.equal(grid.toString(), 'foo  ')
  grid.update(0, 0, 'bar')
  t.equal(grid.toString(), 'bar  ')
  t.end()
})

test('grid.resize', function (t) {
  const grid = new Grid({
    width: 10,
    height: 1,
    rows: [[{text: 'this is a test'}]]
  })
  t.equal(grid.toString(),
  // 1234567890
    'this is a ')
  grid.resize(7, 2)
  t.equal(grid.toString(),
  // 1234567
    'this is\n' +
    'a test ')
  t.end()
})

test('grid.cellAt', function (t) {
  const grid = new Grid({
    width: 5,
    height: 9,
    rows: [
      ['a'],
      ['b', 'c']
    ]
  })
  t.deepEqual(grid.cellAt(0, 0), {
    text: 'a',
    wrap: true,
    width: 5,
    height: 4,
    padding: [0, 0, 0, 0],
    x: 0,
    y: 0
  })
  t.deepEqual(grid.cellAt(1, 0), {
    text: 'b',
    wrap: true,
    width: 2,
    height: 5,
    padding: [0, 0, 0, 0],
    x: 0,
    y: 4
  })
  t.deepEqual(grid.cellAt(1, 1), {
    text: 'c',
    wrap: true,
    width: 3,
    height: 5,
    padding: [0, 0, 0, 0],
    x: 2,
    y: 4
  })
  t.end()
})

test('update event', function (t) {
  const grid = new Grid({
    width: 10,
    height: 1,
    rows: [[{}]]
  })
  grid.on('update', function () {
    t.equal(grid.toString(), 'test      ')
    t.end()
  })
  grid.update(0, 0, 'test')
})
