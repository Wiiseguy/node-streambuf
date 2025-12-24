export class StreamBuffer {
    readonly #buf: Buffer
    #pos = 0

    get buffer() {
        return this.#buf
    }

    get length() {
        return this.#buf.length
    }

    constructor(buffer: Buffer | StreamBuffer) {
        if (!(buffer instanceof Buffer)) {
            if (buffer instanceof StreamBuffer) {
                buffer = buffer.buffer
            } else {
                throw new TypeError('Not a valid Buffer or StreamBuffer')
            }
        }
        this.#buf = buffer
    }

    static from(buffer: Buffer | StreamBuffer) {
        return new StreamBuffer(buffer)
    }

    // Numeric methods
    #readNumber(val: number, skip: number) {
        this.skip(skip)
        return val
    }
    #readBigInt(val: bigint, skip: number) {
        this.skip(skip)
        return val
    }
    #writeNumber(val: number, pos: number) {
        this.#pos = pos
        return val
    }
    #writeBigInt(val: bigint, pos: number) {
        this.#pos = pos
        return val
    }

    // Int
    readInt8() {
        return this.#readNumber(this.#buf.readInt8(this.#pos), 1)
    }
    readInt16LE() {
        return this.#readNumber(this.#buf.readInt16LE(this.#pos), 2)
    }
    readInt16BE() {
        return this.#readNumber(this.#buf.readInt16BE(this.#pos), 2)
    }
    readInt32LE() {
        return this.#readNumber(this.#buf.readInt32LE(this.#pos), 4)
    }
    readInt32BE() {
        return this.#readNumber(this.#buf.readInt32BE(this.#pos), 4)
    }
    readIntLE(byteLength: number) {
        return this.#readNumber(this.#buf.readIntLE(this.#pos, byteLength), byteLength)
    }
    readIntBE(byteLength: number) {
        return this.#readNumber(this.#buf.readIntBE(this.#pos, byteLength), byteLength)
    }

    // UInt
    readUInt8() {
        return this.#readNumber(this.#buf.readUInt8(this.#pos), 1)
    }
    readUInt16LE() {
        return this.#readNumber(this.#buf.readUInt16LE(this.#pos), 2)
    }
    readUInt16BE() {
        return this.#readNumber(this.#buf.readUInt16BE(this.#pos), 2)
    }
    readUInt32LE() {
        return this.#readNumber(this.#buf.readUInt32LE(this.#pos), 4)
    }
    readUInt32BE() {
        return this.#readNumber(this.#buf.readUInt32BE(this.#pos), 4)
    }
    readUIntLE(byteLength: number) {
        return this.#readNumber(this.#buf.readUIntLE(this.#pos, byteLength), byteLength)
    }
    readUIntBE(byteLength: number) {
        return this.#readNumber(this.#buf.readUIntBE(this.#pos, byteLength), byteLength)
    }

    // Floating point
    readFloatLE() {
        return this.#readNumber(this.#buf.readFloatLE(this.#pos), 4)
    }
    readFloatBE() {
        return this.#readNumber(this.#buf.readFloatBE(this.#pos), 4)
    }
    readDoubleLE() {
        return this.#readNumber(this.#buf.readDoubleLE(this.#pos), 8)
    }
    readDoubleBE() {
        return this.#readNumber(this.#buf.readDoubleBE(this.#pos), 8)
    }

    // BigInt
    readBigInt64LE() {
        return this.#readBigInt(this.#buf.readBigInt64LE(this.#pos), 8)
    }
    readBigInt64BE() {
        return this.#readBigInt(this.#buf.readBigInt64BE(this.#pos), 8)
    }
    readBigUInt64LE() {
        return this.#readBigInt(this.#buf.readBigUInt64LE(this.#pos), 8)
    }
    readBigUInt64BE() {
        return this.#readBigInt(this.#buf.readBigUInt64BE(this.#pos), 8)
    }

    // Byte
    readByte() {
        return this.readUInt8()
    }
    readSByte() {
        return this.readInt8()
    }

    // Int
    writeInt8(value: number) {
        return this.#writeNumber(value, this.#buf.writeInt8(value, this.#pos))
    }
    writeInt16LE(value: number) {
        return this.#writeNumber(value, this.#buf.writeInt16LE(value, this.#pos))
    }
    writeInt16BE(value: number) {
        return this.#writeNumber(value, this.#buf.writeInt16BE(value, this.#pos))
    }
    writeInt32LE(value: number) {
        return this.#writeNumber(value, this.#buf.writeInt32LE(value, this.#pos))
    }
    writeInt32BE(value: number) {
        return this.#writeNumber(value, this.#buf.writeInt32BE(value, this.#pos))
    }
    writeIntLE(value: number, byteLength: number) {
        return this.#writeNumber(value, this.#buf.writeIntLE(value, this.#pos, byteLength))
    }
    writeIntBE(value: number, byteLength: number) {
        return this.#writeNumber(value, this.#buf.writeIntBE(value, this.#pos, byteLength))
    }

    // UInt
    writeUInt8(value: number) {
        return this.#writeNumber(value, this.#buf.writeUInt8(value, this.#pos))
    }
    writeUInt16LE(value: number) {
        return this.#writeNumber(value, this.#buf.writeUInt16LE(value, this.#pos))
    }
    writeUInt16BE(value: number) {
        return this.#writeNumber(value, this.#buf.writeUInt16BE(value, this.#pos))
    }
    writeUInt32LE(value: number) {
        return this.#writeNumber(value, this.#buf.writeUInt32LE(value, this.#pos))
    }
    writeUInt32BE(value: number) {
        return this.#writeNumber(value, this.#buf.writeUInt32BE(value, this.#pos))
    }
    writeUIntLE(value: number, byteLength: number) {
        return this.#writeNumber(value, this.#buf.writeUIntLE(value, this.#pos, byteLength))
    }
    writeUIntBE(value: number, byteLength: number) {
        return this.#writeNumber(value, this.#buf.writeUIntBE(value, this.#pos, byteLength))
    }

    // Floating point
    writeFloatLE(value: number) {
        return this.#writeNumber(value, this.#buf.writeFloatLE(value, this.#pos))
    }
    writeFloatBE(value: number) {
        return this.#writeNumber(value, this.#buf.writeFloatBE(value, this.#pos))
    }
    writeDoubleLE(value: number) {
        return this.#writeNumber(value, this.#buf.writeDoubleLE(value, this.#pos))
    }
    writeDoubleBE(value: number) {
        return this.#writeNumber(value, this.#buf.writeDoubleBE(value, this.#pos))
    }

    // BigInt
    writeBigInt64LE(value: bigint) {
        return this.#writeBigInt(value, this.#buf.writeBigInt64LE(value, this.#pos))
    }
    writeBigInt64BE(value: bigint) {
        return this.#writeBigInt(value, this.#buf.writeBigInt64BE(value, this.#pos))
    }
    writeBigUInt64LE(value: bigint) {
        return this.#writeBigInt(value, this.#buf.writeBigUInt64LE(value, this.#pos))
    }
    writeBigUInt64BE(value: bigint) {
        return this.#writeBigInt(value, this.#buf.writeBigUInt64BE(value, this.#pos))
    }

    // Byte
    writeByte(val: number) {
        return this.writeUInt8(val)
    }
    writeSByte(val: number) {
        return this.writeInt8(val)
    }

    // Read 7bit encoded integer (like those used by .NET's BinaryWriter)
    read7BitInt() {
        let byte = 0,
            shift = 0,
            num = 0
        do {
            byte = this.readByte()
            num |= (byte & 0x7f) << shift
            shift += 7
        } while ((byte & 0x80) != 0)
        return num
    }

    // Write 7bit encoded integer (like those used by .NET's BinaryWriter)
    write7BitInt(val: number) {
        while (val >= 0x80) {
            this.writeByte((val | 0x80) & 0xff) // set 8th to 1, keep only the first 8 bits
            val >>= 7
        }
        this.writeByte(val & 0x7f)
        return val
    }

    // Read (sub) buffer
    read(numBytes: number) {
        const res = this.#buf.subarray(this.#pos, this.#pos + numBytes)
        this.#pos = this.#pos + numBytes
        return new StreamBuffer(res)
    }
    write(src: Buffer) {
        if (!(src instanceof Buffer)) {
            throw new TypeError('Not a valid Buffer')
        }
        this.#pos = this.#pos + src.copy(this.#buf, this.#pos, 0)
        return src
    }

    // String methods
    #readString(length: number, encoding: BufferEncoding) {
        if (length == undefined) {
            for (length = 0; ; length++) {
                if (this.#pos + length >= this.#buf.length || this.#buf[this.#pos + length] === 0) break
            }
        }
        return this.#buf.toString(encoding || 'utf8', this.#pos, this.#pos + length)
    }
    readString(length?: number, encoding?: BufferEncoding) {
        const res = this.#readString(length, encoding)
        this.#pos = this.#pos + (length ?? Buffer.byteLength(res, encoding) + 1)
        return res
    }
    readChar(encoding?: BufferEncoding) {
        return this.readString(1, encoding)
    }
    readString7(encoding?: BufferEncoding) {
        const len = this.read7BitInt()
        return this.readString(len, encoding)
    }
    readString0(encoding?: BufferEncoding) {
        return this.readString(undefined, encoding)
    }
    writeString(val: string, encoding?: BufferEncoding) {
        this.#pos = this.#pos + this.#buf.write(val, this.#pos, encoding)
        return val
    }
    writeChar(val: string, encoding?: BufferEncoding) {
        this.#pos = this.#pos + this.#buf.write(val, this.#pos, 1, encoding)
        return val
    }
    writeString7(val: string, encoding?: BufferEncoding) {
        const len = Buffer.byteLength(val, encoding)
        this.write7BitInt(len)
        return this.writeString(val, encoding)
    }
    writeString0(val: string, encoding?: BufferEncoding) {
        this.writeString(val, encoding)
        this.writeByte(0)
        return val
    }
    peekString(length?: number, encoding?: BufferEncoding) {
        return this.#readString(length, encoding)
    }

    // Cursor methods
    skip(numBytes?: number) {
        numBytes ??= 1
        this.#pos = this.#pos + numBytes
        if (this.#pos < 0) this.#pos = 0
        if (this.#pos >= this.#buf.length) this.#pos = this.#buf.length
    }
    setPos(position: number) {
        if (position == undefined) return
        this.#pos = position
        if (this.#pos < 0) this.#pos = 0
        if (this.#pos >= this.#buf.length) this.#pos = this.#buf.length
    }
    seek(position: number) {
        this.setPos(position)
    }
    rewind() {
        this.#pos = 0
    }
    getPos() {
        return this.#pos
    }
    tell() {
        return this.getPos()
    }
    isEOF() {
        return this.#pos >= this.#buf.length
    }
}
