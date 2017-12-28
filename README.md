# node-streambuf
> Streamed Buffers - .NET's BinaryReader facsimile

This library wraps most of [Buffer](https://nodejs.org/api/buffer.html)'s methods. 
The difference with Buffer is that you don't have to specify an offset each read/write operation, it uses an internal cursor.

## Install

```
$ npm install streambuf
```


## Usage

```js
const fs = require('fs');
const StreamBuffer = require('streambuf');

let buffer = new StreamBuffer(fs.readFileSync('hiscore.dat'));

let nameLength = buffer.readUInt32LE();
let name = buffer.readString(nameLength);

buffer.seek(4); // go back to the beginning of the name
buffer.writeString(name.toUpperCase()); // overwrite the name in the buffer with something else

```

Refer to [Buffer](https://nodejs.org/api/buffer.html) for a list of available read and write methods supported by StreamBuffer (omit the offset param).
