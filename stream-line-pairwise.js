var dup = require('duplexer');
var through = require('through2');
var split = require('split');

function createPairwiseStream(options) {
  options = options || {};
  options.object = !!options.object;
  options.delimiter = options.delimiter || ':';
  options.encoding = options.encoding || 'utf8';

  var source = split();
  var pair = new Array(2);
  var state = 0;
  var lastLine = null;

  var dest = through({
    objectMode : options.object
  }, function (line, enc, done) {
    lastLine = line;

    if (state < 2) {
      pair[state] = line;
      state++;
    }

    if (state > 1) {

      // don't emit empty pairs
      if (pair[0].length && pair[1].length) {
        if (!options.object) {
          this.push(pair.join(options.delimiter));
        } else {
          this.push(pair);

          // ensure when in objectMode that each emitted array
          // is unique.
          pair = new Array(2);
        }
      }
      state = 0;
    }

    done();
  });

  dest.on('end', function() {
    if (state && state < 2 && lastLine && lastLine.trim().length) {
      dest.emit('error', new Error('pending data at "end" event'));
    }
  });

  !options.object && dest.setEncoding(options.encoding);

  source.pipe(dest);

  return dup(source, dest);
}

module.exports = createPairwiseStream;
