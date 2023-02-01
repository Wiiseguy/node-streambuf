"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StreamBuffer {
    #buf;
    #pos = 0;
    get buffer() {
        return this.#buf;
    }
    constructor(buffer) {
        if (!(buffer instanceof Buffer)) {
            if (buffer instanceof StreamBuffer) {
                buffer = buffer.buffer;
            }
            else {
                throw new TypeError("Not a valid Buffer or StreamBuffer");
            }
        }
        this.#buf = buffer;
    }
    static from(buffer) {
        return new StreamBuffer(buffer);
    }
    // Numeric methods
    #readNumber(val, skip) {
        this.skip(skip);
        return val;
    }
    #readBigInt(val, skip) {
        this.skip(skip);
        return val;
    }
    #writeNumber(val, pos) {
        this.#pos = pos;
        return val;
    }
    #writeBigInt(val, pos) {
        this.#pos = pos;
        return val;
    }
    readInt8() {
        return this.#readNumber(this.#buf.readInt8(this.#pos), 1);
    }
    readInt16LE() {
        return this.#readNumber(this.#buf.readInt16LE(this.#pos), 2);
    }
    readInt16BE() {
        return this.#readNumber(this.#buf.readInt16BE(this.#pos), 2);
    }
    readInt32LE() {
        return this.#readNumber(this.#buf.readInt32LE(this.#pos), 4);
    }
    readInt32BE() {
        return this.#readNumber(this.#buf.readInt32BE(this.#pos), 4);
    }
    readUInt8() {
        return this.#readNumber(this.#buf.readUInt8(this.#pos), 1);
    }
    readUInt16LE() {
        return this.#readNumber(this.#buf.readUInt16LE(this.#pos), 2);
    }
    readUInt16BE() {
        return this.#readNumber(this.#buf.readUInt16BE(this.#pos), 2);
    }
    readUInt32LE() {
        return this.#readNumber(this.#buf.readUInt32LE(this.#pos), 4);
    }
    readUInt32BE() {
        return this.#readNumber(this.#buf.readUInt32BE(this.#pos), 4);
    }
    readFloatLE() {
        return this.#readNumber(this.#buf.readFloatLE(this.#pos), 4);
    }
    readFloatBE() {
        return this.#readNumber(this.#buf.readFloatBE(this.#pos), 4);
    }
    readDoubleLE() {
        return this.#readNumber(this.#buf.readDoubleLE(this.#pos), 8);
    }
    readDoubleBE() {
        return this.#readNumber(this.#buf.readDoubleBE(this.#pos), 8);
    }
    readBigInt64LE() {
        return this.#readBigInt(this.#buf.readBigInt64LE(this.#pos), 8);
    }
    readBigInt64BE() {
        return this.#readBigInt(this.#buf.readBigInt64BE(this.#pos), 8);
    }
    readBigUInt64LE() {
        return this.#readBigInt(this.#buf.readBigUInt64LE(this.#pos), 8);
    }
    readBigUInt64BE() {
        return this.#readBigInt(this.#buf.readBigUInt64BE(this.#pos), 8);
    }
    readByte() { return this.readUInt8(); }
    readSByte() { return this.readInt8(); }
    writeInt8(value) {
        return this.#writeNumber(value, this.#buf.writeInt8(value, this.#pos));
    }
    writeInt16LE(value) {
        return this.#writeNumber(value, this.#buf.writeInt16LE(value, this.#pos));
    }
    writeInt16BE(value) {
        return this.#writeNumber(value, this.#buf.writeInt16BE(value, this.#pos));
    }
    writeInt32LE(value) {
        return this.#writeNumber(value, this.#buf.writeInt32LE(value, this.#pos));
    }
    writeInt32BE(value) {
        return this.#writeNumber(value, this.#buf.writeInt32BE(value, this.#pos));
    }
    writeUInt8(value) {
        return this.#writeNumber(value, this.#buf.writeUInt8(value, this.#pos));
    }
    writeUInt16LE(value) {
        return this.#writeNumber(value, this.#buf.writeUInt16LE(value, this.#pos));
    }
    writeUInt16BE(value) {
        return this.#writeNumber(value, this.#buf.writeUInt16BE(value, this.#pos));
    }
    writeUInt32LE(value) {
        return this.#writeNumber(value, this.#buf.writeUInt32LE(value, this.#pos));
    }
    writeUInt32BE(value) {
        return this.#writeNumber(value, this.#buf.writeUInt32BE(value, this.#pos));
    }
    writeFloatLE(value) {
        return this.#writeNumber(value, this.#buf.writeFloatLE(value, this.#pos));
    }
    writeFloatBE(value) {
        return this.#writeNumber(value, this.#buf.writeFloatBE(value, this.#pos));
    }
    writeDoubleLE(value) {
        return this.#writeNumber(value, this.#buf.writeDoubleLE(value, this.#pos));
    }
    writeDoubleBE(value) {
        return this.#writeNumber(value, this.#buf.writeDoubleBE(value, this.#pos));
    }
    writeBigInt64LE(value) {
        return this.#writeBigInt(value, this.#buf.writeBigInt64LE(value, this.#pos));
    }
    writeBigInt64BE(value) {
        return this.#writeBigInt(value, this.#buf.writeBigInt64BE(value, this.#pos));
    }
    writeBigUInt64LE(value) {
        return this.#writeBigInt(value, this.#buf.writeBigUInt64LE(value, this.#pos));
    }
    writeBigUInt64BE(value) {
        return this.#writeBigInt(value, this.#buf.writeBigUInt64BE(value, this.#pos));
    }
    writeByte(val) { return this.writeUInt8(val); }
    writeSByte(val) { return this.writeInt8(val); }
    // Read 7bit encoded integer (like those used by .NET's BinaryWriter)
    read7BitInt() {
        let byte = 0, shift = 0, num = 0;
        do {
            byte = this.readByte();
            num |= (byte & 0x7f) << shift;
            shift += 7;
        } while ((byte & 0x80) != 0);
        return num;
    }
    // Write 7bit encoded integer (like those used by .NET's BinaryWriter)
    write7BitInt(val) {
        while (val >= 0x80) {
            this.writeByte((val | 0x80) & 0xff); // set 8th to 1, keep only the first 8 bits
            val >>= 7;
        }
        this.writeByte(val & 0x7f);
    }
    // Read (sub) buffer 
    read(numBytes) {
        const res = this.#buf.slice(this.#pos, this.#pos + numBytes);
        this.#pos = this.#pos + numBytes;
        return new StreamBuffer(res);
    }
    write(src) {
        if (!(src instanceof Buffer)) {
            throw new TypeError("Not a valid Buffer");
        }
        this.#pos = this.#pos + src.copy(this.#buf, this.#pos, 0);
        return src;
    }
    // String methods
    #readString(length, encoding) {
        if (length == undefined) {
            for (length = 0;; length++) {
                if (this.#pos + length >= this.#buf.length || this.#buf[this.#pos + length] === 0)
                    break;
            }
        }
        return this.#buf.toString(encoding || "utf8", this.#pos, this.#pos + length);
    }
    readString(length, encoding) {
        const res = this.#readString(length, encoding);
        this.#pos = this.#pos + (length == undefined ? Buffer.byteLength(res, encoding) + 1 : length);
        return res;
    }
    readChar(encoding) {
        return this.readString(1, encoding);
    }
    readString7(encoding) {
        const len = this.read7BitInt();
        return this.readString(len, encoding);
    }
    writeString(val, encoding) {
        this.#pos = this.#pos + this.#buf.write(val, this.#pos, encoding);
        return val;
    }
    writeChar(val, encoding) {
        this.#pos = this.#pos + this.#buf.write(val, this.#pos, 1, encoding);
        return val;
    }
    writeString7(val, encoding) {
        const len = Buffer.byteLength(val, encoding);
        this.write7BitInt(len);
        return this.writeString(val, encoding);
    }
    peekString(length, encoding) {
        return this.#readString(length, encoding);
    }
    // Cursor methods
    skip(numBytes) {
        if (numBytes == undefined)
            numBytes = 1;
        this.#pos = this.#pos + numBytes;
        if (this.#pos < 0)
            this.#pos = 0;
        if (this.#pos >= this.#buf.length)
            this.#pos = this.#buf.length;
    }
    setPos(position) {
        if (position == undefined)
            return;
        this.#pos = position;
        if (this.#pos < 0)
            this.#pos = 0;
        if (this.#pos >= this.#buf.length)
            this.#pos = this.#buf.length;
    }
    seek(position) {
        this.setPos(position);
    }
    rewind() {
        this.#pos = 0;
    }
    getPos() { return this.#pos; }
    ;
    tell() { return this.getPos(); }
    isEOF() { return this.#pos >= this.#buf.length; }
    ;
}
// Based on https://stackoverflow.com/a/54456318/1423052
function StreamBufferOptionalNew(c) {
    return new Proxy(c, {
        apply: (t, _, a) => new t(...a)
    });
}
const StreamBufferWrapper = StreamBufferOptionalNew(StreamBuffer);
exports.default = StreamBufferWrapper;
//# sourceMappingURL=streambuf.js.map