# stream-line-pairwise

outputs pairs of lines

## install

```npm install stream-line-pairwise```

## use

```javascript

var createPairwiseStream = require('./stream-line-pairwise');

var s = createPairwiseStream({
  object: false, // false is the default
  delimiter: '=' // default is ':'
})

s.on('data', function(line) {
  console.log(line); // outputs: me=robot
})

s.end('me\nrobot');

```

### options

`object` - if truthy, a stream of arrays will be emitted (_default_: `false`)

`delimiter` - if truthy, each pair of lines will be `Array#join`'d with this value (_default_: `:`)

`encoding` - changes the encoding of the output (_default_: `utf8`)

## license

[MIT LICENSE](LICENSE)
