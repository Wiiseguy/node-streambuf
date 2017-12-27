# node-streambuf
Streamed Buffers - .NET's BinaryReader facsimile

## Install

```
$ npm install streambuf
```


## Usage

```js
const fs = require('fs');
const StreamBuffer = require('streambuf');

let buffer = new StreamBuffer(fs.readFileSync('hiscore.dat'));

```