# @lib/utf-8

This is a well-tested UTF-8 encoder / decoder with some distinctive features:

- Very small when minified.
- Forgiving with invalid inputs.
  - Any JavaScript string will remain identical after encoding and decoding, even if the string itself is invalid UTF-16. See [WTF-8 encoding](https://simonsapin.github.io/wtf-8/).
  - Overlong UTF-8 sequences of up to 6 bytes are allowed.
- Detects unrecoverably corrupt UTF-8 input.
  - Runs of unexpected continuation bytes, or a start byte followed by insufficient continuation bytes, become [replacement character fffd](https://en.wikipedia.org/wiki/Specials_(Unicode_block)).
- Handles astral plane characters like emoji.
- Supports reading from and writing into existing buffers using given offsets.
- Written in TypeScript.

## Installation

From npm and Node.js:

```bash
npm install --save @lib/utf-8
```

```JavaScript
var utf8 = require('@lib/utf-8');
```

From CDN in HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@lib/utf-8@0.1/bundle.js"></script>
```

Using [RequireX](https://github.com/requirex/requirex#readme):

```TypeScript
import * as utf8 from '@lib/utf-8';
```

## Usage

```TypeScript
// Prints: 194, 189
console.log(utf8.encodeUTF8('½').join(', '));

// Prints: ½
console.log(utf8.decodeUTF8([194, 189]));
```

## API

### `encodeUTF8(src, dst?, dstPos?, srcPos?, srcEnd?)`

UTF-8 encode a string to an array of bytes.
This transform cannot fail and is reversible for any input string,
regardless of strange or invalid characters (handled using WTF-8).

- `src` String to encode.
- `dst` Destination array or buffer for storing the result.
- `dstPos` Initial offset to destination, default is 0.
- `srcPos` Initial offset to source data, default is 0.
- `srcEnd` Source data end offset, default is its length.

Returns end offset past data stored if a destination was given,
otherwise a numeric array containing the encoded result.
Note that output length cannot exceed 3 * input length.

### `decodeUTF8(src, dst?, srcPos?, srcEnd?)`

UTF-8 decode an array of bytes into a string.
Invalid surrogate pairs are left as-is to support WTF-8.
All other invalid codes become replacement characters (fffd).

- `src` Array to encode.
- `dst` Output string prefix, default is empty.
- `srcPos` Initial offset to source data, default is 0.
- `srcEnd` Source data end offset, default is its length.

Returns decoded string.

# License

[The MIT License](https://raw.githubusercontent.com/requirex/codec/master/LICENSE)

Copyright (c) 2019- RequireX authors.
