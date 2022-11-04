"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("aqa");
const streambuf_1 = require("./streambuf");
test('initializers', t => {
    const sb1 = new streambuf_1.default(Buffer.from([1]));
    t.true(sb1 instanceof streambuf_1.default);
    // Deprecated, but should still work for backwards compatibility
    const sb2 = (0, streambuf_1.default)(Buffer.from([1]));
    t.true(sb2 instanceof streambuf_1.default);
    const sb3 = streambuf_1.default.from(Buffer.from([1]));
    t.true(sb3 instanceof streambuf_1.default);
    /** @ts-ignore Intentional wrong param */
    t.throws(_ => new streambuf_1.default('hello'), { instanceOf: TypeError });
    const buffer = Buffer.from([0, 1]);
    const sb4 = new streambuf_1.default(buffer);
    const sb5 = new streambuf_1.default(sb4);
    t.false(sb4 == sb5);
    t.true(sb4.buffer == sb5.buffer);
});
test('buffer access', t => {
    const source = [0, 1, 2, 3, 4, 5, 6, 7];
    const buffer = Buffer.from(source);
    const sb = new streambuf_1.default(buffer);
    // The buffer isn't copied
    t.is(sb.buffer, buffer);
    // @ts-ignore The 'buffer' property should be read-only	
    let e = t.throws(_ => sb.buffer = Buffer.from([1, 2, 3]));
    t.true(sb.buffer.equals(Buffer.from(source)));
});
test('buffer access - strict', t => {
    'use strict';
    const buffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]);
    const sb = new streambuf_1.default(buffer);
    // The buffer isn't copied
    t.is(sb.buffer, buffer);
    // @ts-ignore The 'buffer' property should be read-only
    t.throws(() => sb.buffer = Buffer.from([1, 2, 3]), { instanceOf: TypeError });
});
test('read part of the buffer', t => {
    const buffer = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
    const sb = new streambuf_1.default(buffer);
    const ssb = sb.read(3);
    t.true(ssb instanceof streambuf_1.default); // the read sub buffer should also be a StreamBuffer instance
    ssb.seek(1);
    t.is(ssb.readByte(), 2);
    t.true(sb.read(4).buffer.equals(Buffer.from([4, 5, 6, 7])));
    t.true(sb.read(2).buffer.equals(Buffer.from([8]))); // read beyond the length
});
test('write', t => {
    const buffer = Buffer.from([0, 0, 0, 0]);
    const sb = new streambuf_1.default(buffer);
    sb.write(Buffer.from([1, 2]));
    sb.write(Buffer.from([3, 4]));
    t.true(sb.buffer.equals(Buffer.from([1, 2, 3, 4])));
});
test('write - invalid', t => {
    const buffer = Buffer.from([0, 0, 0, 0]);
    const sb = new streambuf_1.default(buffer);
    t.throws(_ => sb.write('hello'), { instanceOf: TypeError });
});
test('seek / setPos', t => {
    const buffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // h, e, l, l, o
    const sb = new streambuf_1.default(buffer);
    sb.seek(1);
    t.is(sb.tell(), 1);
    sb.setPos(1);
    t.is(sb.tell(), 1);
    /** @ts-ignore Intentional */
    sb.setPos();
    t.is(sb.tell(), 1);
    sb.seek(-1);
    t.is(sb.tell(), 0);
    sb.seek(1000);
    t.is(sb.tell(), 5);
    t.is(sb.isEOF(), true);
});
test('skip', t => {
    const buffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // h, e, l, l, o
    const sb = new streambuf_1.default(buffer);
    t.is(sb.tell(), 0);
    sb.skip(1);
    t.is(sb.tell(), 1);
    t.is(sb.readChar(), 'e');
    t.is(sb.tell(), 2);
    sb.skip();
    t.is(sb.tell(), 3);
    t.is(sb.readChar(), 'l');
    t.is(sb.tell(), 4);
    sb.skip(-1);
    t.is(sb.tell(), 3);
    t.is(sb.readChar(), 'l');
    t.is(sb.tell(), 4);
    sb.skip(-2);
    t.is(sb.tell(), 2);
    sb.skip(2);
    t.is(sb.tell(), 4);
    t.is(sb.readChar(), 'o');
    sb.skip(20);
    t.is(sb.tell(), 5);
    t.is(sb.readChar(), '');
});
test('skip - skip to before 0', t => {
    const buffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // h, e, l, l, o
    const sb = new streambuf_1.default(buffer);
    sb.skip(-1);
    t.is(sb.readString(5), 'hello');
});
test('read string (unknown length)', t => {
    const buffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0, 0x68, 0x69, 0x21]); // h, e, l, l, o, (zero), h, i, !
    const sb = new streambuf_1.default(buffer);
    t.is(sb.readString(), 'hello'); // read until a 0 is encountered
    t.is(sb.tell(), 6); // position should point to 0x68, the 0 should have been gobbled
    t.is(sb.readString(), 'hi!');
});
test('read string (known length)', t => {
    const buffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0, 0x68, 0x69, 0x21]); // h, e, l, l, o, (zero), h, i, !
    const sb = new streambuf_1.default(buffer);
    t.is(sb.readString(5), 'hello');
    t.is(sb.tell(), 5); // position should point to the 0 entry
    sb.skip(1);
    t.is(sb.readString(2), 'hi');
});
test('read strings (mixed encodings)', t => {
    const buffer = Buffer.from([0xc6, 0x30, 0xb9, 0x30, 0xc8, 0x30, 0, 0x68, 0x69, 0x21]); // テ, ス, ト, (zero), h, i, !
    const sb = new streambuf_1.default(buffer);
    t.is(sb.readString(null, 'ucs2'), 'テスト');
    t.is(sb.tell(), 7);
    t.is(sb.readString(), 'hi!');
});
test('read strings (multibyte utf8)', t => {
    const buffer = Buffer.from([0xF0, 0x9F, 0x98, 0x83, 0, 0x68, 0x69, 0x21]);
    const sb = new streambuf_1.default(buffer);
    t.is(sb.readString(), '😃');
    t.is(sb.tell(), 5);
    t.is(sb.readString(), 'hi!');
});
test('peek string (unknown length)', t => {
    const buffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0, 0x68, 0x69, 0x21]); // h, e, l, l, o, (zero), h, i, !
    const sb = new streambuf_1.default(buffer);
    t.is(sb.peekString(), 'hello'); // read until a 0 is encountered
    t.is(sb.tell(), 0); // position should still be 0, as peekString doesn't move the pointer
});
test('readString7', t => {
    const buffer = Buffer.from([3, 0x68, 0x69, 0x21]);
    const sb = new streambuf_1.default(buffer);
    t.is(sb.readString7(), 'hi!');
});
test('writeString7', t => {
    const buffer = Buffer.alloc(4);
    const sb = new streambuf_1.default(buffer);
    sb.writeString7('hi!');
    t.deepEqual(buffer, [3, 0x68, 0x69, 0x21]);
});
test('read unsigned integers', t => {
    const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
    const sb = new streambuf_1.default(buffer);
    t.is(sb.readUInt8(), buffer.readUInt8());
    t.is(sb.readUInt8(), buffer.readUInt8(1));
    t.is(sb.readUInt8(), buffer.readUInt8(2));
    t.is(sb.readUInt8(), buffer.readUInt8(3));
    sb.rewind();
    t.is(sb.readByte(), buffer.readUInt8());
    t.is(sb.readByte(), buffer.readUInt8(1));
    t.is(sb.readByte(), buffer.readUInt8(2));
    t.is(sb.readByte(), buffer.readUInt8(3));
    sb.rewind();
    t.is(sb.readUInt16LE(), buffer.readUInt16LE());
    t.is(sb.readUInt16LE(), buffer.readUInt16LE(2));
    sb.rewind();
    t.is(sb.readUInt16BE(), buffer.readUInt16BE());
    t.is(sb.readUInt16BE(), buffer.readUInt16BE(2));
    sb.rewind();
    t.is(sb.readUInt32LE(), buffer.readUInt32LE());
    sb.rewind();
    t.is(sb.readUInt32BE(), buffer.readUInt32BE());
    sb.rewind();
});
test('read signed integers', t => {
    const buffer = Buffer.from([0xff, 0x01, 0x7f, 0x80]);
    const sb = new streambuf_1.default(buffer);
    t.is(sb.readInt8(), buffer.readInt8());
    t.is(sb.readInt8(), buffer.readInt8(1));
    t.is(sb.readInt8(), buffer.readInt8(2));
    t.is(sb.readInt8(), buffer.readInt8(3));
    sb.rewind();
    t.is(sb.readInt16LE(), buffer.readInt16LE());
    t.is(sb.readInt16LE(), buffer.readInt16LE(2));
    sb.rewind();
    t.is(sb.readInt16BE(), buffer.readInt16BE());
    t.is(sb.readInt16BE(), buffer.readInt16BE(2));
    sb.rewind();
    t.is(sb.readInt32LE(), buffer.readInt32LE());
    sb.rewind();
    t.is(sb.readInt32BE(), buffer.readInt32BE());
    sb.rewind();
});
test('read floating point numbers', t => {
    const buffer = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
    const sb = new streambuf_1.default(buffer);
    t.is(sb.readFloatLE(), buffer.readFloatLE());
    t.is(sb.readFloatLE(), buffer.readFloatLE(4));
    sb.rewind();
    t.is(sb.readFloatBE(), buffer.readFloatBE());
    t.is(sb.readFloatBE(), buffer.readFloatBE(4));
    sb.rewind();
    t.is(sb.readDoubleLE(), buffer.readDoubleLE());
    sb.rewind();
    t.is(sb.readDoubleBE(), buffer.readDoubleBE());
    sb.rewind();
});
test('read 7bit encoded ints (like those used by .NET)', t => {
    const buffer = Buffer.from([2, 0x80, 2, 0x80, 0x80, 2, 1 | 0x80, 2]);
    const sb = new streambuf_1.default(buffer);
    t.is(sb.read7BitInt(), 2);
    t.is(sb.read7BitInt(), 256); // 2 << 7
    t.is(sb.read7BitInt(), 32768); // 2 << 14
    t.is(sb.read7BitInt(), 257); // 1 + (2 << 7)
});
test('correct position increase (numeric read methods)', t => {
    const buffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]);
    const sb = new streambuf_1.default(buffer);
    const readMethods = [
        [sb.readInt8, 1],
        [sb.readSByte, 1],
        [sb.readInt16LE, 2],
        [sb.readInt16BE, 2],
        [sb.readInt32LE, 4],
        [sb.readInt32BE, 4],
        [sb.readUInt8, 1],
        [sb.readByte, 1],
        [sb.readUInt16LE, 2],
        [sb.readUInt16BE, 2],
        [sb.readUInt32LE, 4],
        [sb.readUInt32BE, 4],
        [sb.readFloatLE, 4],
        [sb.readFloatBE, 4],
        [sb.readDoubleLE, 8],
        [sb.readDoubleBE, 8],
        [sb.readBigInt64LE, 8],
        [sb.readBigInt64BE, 8],
        [sb.readBigUInt64LE, 8],
        [sb.readBigUInt64BE, 8],
    ];
    const writeMethods = [
        [sb.writeInt8, 1, 0],
        [sb.writeSByte, 1, 0],
        [sb.writeInt16LE, 2, 0],
        [sb.writeInt16BE, 2, 0],
        [sb.writeInt32LE, 4, 0],
        [sb.writeInt32BE, 4, 0],
        [sb.writeUInt8, 1, 0],
        [sb.writeByte, 1, 0],
        [sb.writeUInt16LE, 2, 0],
        [sb.writeUInt16BE, 2, 0],
        [sb.writeUInt32LE, 4, 0],
        [sb.writeUInt32BE, 4, 0],
        [sb.writeFloatLE, 4, 0],
        [sb.writeFloatBE, 4, 0],
        [sb.writeDoubleLE, 8, 0],
        [sb.writeDoubleBE, 8, 0],
        [sb.writeBigInt64LE, 8, 0n],
        [sb.writeBigInt64BE, 8, 0n],
        [sb.writeBigUInt64LE, 8, 0n],
        [sb.writeBigUInt64BE, 8, 0n],
    ];
    readMethods.forEach(m => {
        let [method, len] = m;
        method.bind(sb)();
        t.is(sb.getPos(), len);
        sb.rewind();
    });
    writeMethods.forEach(m => {
        let [method, len, testValue] = m;
        // BigInt methods complain when you pass a normal number, so use the 3rd argument to test them
        method.bind(sb)(testValue);
        t.is(sb.getPos(), len);
        sb.rewind();
    });
});
test('write numbers', t => {
    const buffer = Buffer.alloc(8);
    const sb = new streambuf_1.default(buffer);
    sb.writeUInt8(1);
    sb.writeUInt8(2);
    sb.writeUInt8(3);
    sb.writeUInt8(255);
    sb.writeUInt32BE(0xaabbccdd);
    t.true(buffer.equals(Buffer.from([1, 2, 3, 255, 0xaa, 0xbb, 0xcc, 0xdd])));
});
test('write floating point numbers', t => {
    const buffer = Buffer.alloc(8);
    const sb = new streambuf_1.default(buffer);
    sb.writeFloatLE(123); // Why not test it with something like 123.4? Because it gets read back as 123.4000015258789
    sb.writeFloatLE(456);
    sb.rewind();
    t.is(sb.readFloatLE(), 123);
    t.is(sb.readFloatLE(), 456);
    sb.rewind();
    sb.writeDoubleLE(58008.80085);
    sb.rewind();
    t.is(sb.readDoubleLE(), 58008.80085);
});
test('write 7bit encoded ints (like those used by .NET)', t => {
    const buffer = Buffer.alloc(8);
    const sb = new streambuf_1.default(buffer);
    sb.write7BitInt(2);
    sb.write7BitInt(256);
    sb.write7BitInt(32768);
    sb.write7BitInt(257);
    sb.rewind();
    t.is(sb.readByte(), 2);
    t.is(sb.readByte(), 0x80);
    t.is(sb.readByte(), 2);
    t.is(sb.readByte(), 0x80);
    t.is(sb.readByte(), 0x80);
    t.is(sb.readByte(), 2);
    t.is(sb.readByte(), 0x81);
    t.is(sb.readByte(), 2);
    sb.rewind();
    t.is(sb.read7BitInt(), 2);
    t.is(sb.read7BitInt(), 256); // 2 << 7
    t.is(sb.read7BitInt(), 32768); // 2 << 14
    t.is(sb.read7BitInt(), 257); // 1 + (2 << 7)
});
test('write strings', t => {
    const buffer = Buffer.alloc(6);
    const sb = new streambuf_1.default(buffer);
    sb.writeString('hel');
    sb.writeString('lo');
    t.is(sb.isEOF(), false);
    t.true(buffer.equals(Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0])));
});
test('write multibyte utf8 strings', t => {
    const buffer = Buffer.alloc(4);
    const sb = new streambuf_1.default(buffer);
    sb.writeString('😃');
    t.is(sb.tell(), 4);
    t.is(sb.isEOF(), true);
    t.true(buffer.equals(Buffer.from([0xF0, 0x9F, 0x98, 0x83])));
});
test('write multibyte utf8 stringzs', t => {
    const buffer = Buffer.alloc(2);
    const sb = new streambuf_1.default(buffer);
    sb.writeByte(0xf0);
    sb.writeSByte(-2);
    t.deepEqual(buffer, [0xf0, 0xfe]);
});
test('write mixed encoded strings', t => {
    const buffer = Buffer.alloc(10);
    const sb = new streambuf_1.default(buffer);
    sb.writeString('テスト', 'ucs2');
    t.is(sb.tell(), 6);
    sb.writeByte(0);
    sb.writeString('hi!');
    sb.rewind();
    t.is(sb.readString(null, 'ucs2'), 'テスト');
    t.is(sb.readString(null, 'utf8'), 'hi!');
});
test('sbyte', t => {
    const buffer = Buffer.alloc(1);
    const sb = new streambuf_1.default(buffer);
    sb.writeByte(128);
    sb.rewind();
    t.is(sb.readSByte(), -128);
});
test('writeChar', t => {
    const buffer = Buffer.alloc(2);
    const sb = new streambuf_1.default(buffer);
    sb.writeChar('h');
    sb.writeChar('i');
    t.deepEqual(buffer, [0x68, 0x69]);
});
test('writeChar - multibyte utf8 strings', t => {
    const buffer = Buffer.alloc(4);
    const sb = new streambuf_1.default(buffer);
    sb.writeChar('ë');
    t.deepEqual(buffer, [0, 0, 0, 0]);
});
test('isEOF tests', t => {
    const buffer = Buffer.from([0, 1, 2]);
    const sb = new streambuf_1.default(buffer);
    t.is(sb.tell(), 0);
    t.false(sb.isEOF());
    sb.readByte();
    t.is(sb.tell(), 1);
    t.false(sb.isEOF());
    sb.readByte();
    t.is(sb.tell(), 2);
    t.false(sb.isEOF());
    sb.readByte();
    t.is(sb.tell(), 3);
    t.true(sb.isEOF());
});
test('README example', t => {
    const name1 = 'abc';
    const hiscoreFile = Buffer.alloc(7);
    const hiscoreFileSb = new streambuf_1.default(hiscoreFile);
    hiscoreFileSb.writeUInt32LE(name1.length);
    hiscoreFileSb.writeString(name1);
    // README example start
    const file = Buffer.from(hiscoreFile); // "Read" hiscore.dat
    const buffer = new streambuf_1.default(file);
    let nameLength = buffer.readUInt32LE();
    let name = buffer.readString(nameLength);
    buffer.skip(-nameLength); // go back to the beginning of the name
    buffer.writeString(name.toUpperCase()); // overwrite the name in the buffer with something else	
    // README example end
    t.is(hiscoreFile.toString('utf8', 4), 'abc'); // original file
    t.is(file.toString('utf8', 4), 'ABC');
});
test('read 64 bit unsigned integers', t => {
    const buffer = Buffer.from([0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
    const sb = new streambuf_1.default(buffer);
    let a = sb.readBigUInt64LE();
    t.is(a, 0xfffffffffffffffen);
});
test('read 64 bit signed integers', t => {
    const buffer = Buffer.from([0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
    const sb = new streambuf_1.default(buffer);
    let a = sb.readBigInt64LE();
    t.is(a, -2n);
});
//# sourceMappingURL=test.js.map