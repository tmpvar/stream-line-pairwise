var test = require('tape');
var createPairwiseStream = require('../stream-line-pairwise');
var split = require('split');

test('basic pairwise', function (t) {

  t.plan(2);

  var str = '0\nhello\n1\nworld';

  var actual = [
    ['0', 'hello'],
    ['1', 'world']
  ];

  createPairwiseStream({ object: true })
    .on('data', function(array) {
      t.deepEqual(actual.shift(), array);
    })
    .end(str);
});

test('objectMode unique pairs', function (t) {
  t.plan(2);

  var str = '0\nhello\n1\nworld';

  var actual = [
    ['0', 'hello'],
    ['1', 'world']
  ];

  var collect = [];

  createPairwiseStream({ object: true })
    .on('data', function(array) {
      collect.push(array);
    })
    .on('end', function() {
      t.equal(2, collect.length);
      t.ok(collect[0] !== collect[1]); // test identiy
    })
    .end(str);
});


test('json output', function (t) {

  t.plan(2);

  var str = '0\nhello\n1\nworld';

  var actual = [
    ['0', 'hello'],
    ['1', 'world']
  ];

  createPairwiseStream({ delimiter: '=' })
    .on('data', function(line) {
      t.deepEqual(actual.shift().join('='), line);
    })
    .end(str);
});

test('odd number of lines at end', function (t) {

  t.plan(3);

  var str = '0\nhello\n1\nworld\nanother';

  var actual = [
    ['0', 'hello'],
    ['1', 'world']
  ];

  createPairwiseStream({ object: true })
    .on('data', function(array) {
      t.deepEqual(actual.shift(), array);
    })
    .on('error', function(e) {
      t.ok(true);
    })
    .end(str);
});
