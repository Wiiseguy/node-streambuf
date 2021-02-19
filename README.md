# streambuf - Stream Buffers [![Build Status](https://travis-ci.org/Wiiseguy/node-streambuf.svg?branch=master)](https://travis-ci.org/Wiiseguy/node-streambuf)
> Stream Buffers - .NET's BinaryReader facsimile for Node.js

This library wraps most of [Buffer](https://nodejs.org/api/buffer.html)'s methods. The difference with Buffer is that with streambuf you don't have to specify an offset each read/write operation, it uses an internal cursor. 

This library offers an API that similar to C++'s [fstream/iostream/etc.](https://www.cplusplus.com/reference/iolibrary/) or .NET's [BinaryReader/BinaryWriter](https://docs.microsoft.com/en-us/dotnet/api/system.io).

## Install

```
$ npm install streambuf
```


## Usage

```js
const fs = require('fs');
const StreamBuffer = require('streambuf');

let buffer = StreamBuffer(fs.readFileSync('hiscore.dat'));

let nameLength = buffer.readUInt32LE();
let name = buffer.readString(nameLength);

buffer.seek(4); // go back to the beginning of the name
buffer.writeString(name.toUpperCase()); // overwrite the name in the buffer with something else

```

Refer to [Buffer](https://nodejs.org/api/buffer.html) for a list of available read and write methods supported by StreamBuffer (omit the offset param).

## API

StreamBuffer(Buffer)
---
Constructor: initialize with a Buffer object.

StreamBuffer(StreamBuffer)
--- 
Constructor: initialize with another StreamBuffer object's underlying Buffer.

StreamBuffer numeric methods
---
readInt8, readInt16LE, readInt16BE, readInt32LE, readInt32BE, readUInt8, readUInt16LE, readUInt16BE, readUInt32LE, readUInt32BE, readFloatLE, readFloatBE, readDoubleLE, readDoubleBE
writeInt8, writeInt16LE, writeInt16BE, writeInt32LE, writeInt32BE, writeUInt8, writeUInt16LE, writeUInt16BE, writeUInt32LE, writeUInt32BE, writeFloatLE, writeFloatBE, writeDoubleLE, writeDoubleBE

.buffer
---
Provides raw access to the underlying Buffer object (read-only)

.read(numBytes)
---
Returns a new StreamBuffer that references the same Buffer as the original, but cropped by offset and offset + numBytes.

.write(buffer: Buffer)
---
Writes the contents of another Buffer.

.readByte()
---
Alias for .readUInt8()

.readSByte()
---
Alias for .readInt8()

.writeByte()
---
Alias for .writeUInt8()

.writeSByte()
---
Alias for .writeInt8()

.read7BitInt()
---
Reads a 7 bit encoded integer, like those used by [.NET](https://msdn.microsoft.com/en-us/library/system.io.binarywriter.write7bitencodedint(v=vs.110).aspx)

.write7BitInt()
---
Writes a 7 bit encoded integer, like those used by [.NET](https://msdn.microsoft.com/en-us/library/system.io.binarywriter.write7bitencodedint(v=vs.110).aspx)

.readString([length, [encoding]])
---
Decodes to a string according to the specified character encoding in encoding and length.
'encoding' defaults to utf8.
'length' is optional. If left undefined, it will use the first occuring zero (0) byte as the end of the string.

.peekString([length, [encoding]])
---
Functions the same way as .readString(), but does not update the offset.

.readString7([encoding])
---
A specialized version of readString(), it first reads a 7 bit encoded integer and uses that as the length of the to be read string. Can be used to read strings written by .NET's BinaryWriter.

.writeString(str, [encoding])
---
Writes a string to the underlying buffer with the specified encoding.
'encoding' defaults to utf8.

.skip(numBytes)
---
Skips the specified number of bytes.

.setPos(pos) / .seek(pos)
---
Moves the offset to the specified pos.

.getPos() / .tell()
---
Returns the current offset.

.rewind()
---
Moves the offset back to 0.

.isEOF()
---
Returns true if the end of the buffer is reached. (offset >= buffer.length)

