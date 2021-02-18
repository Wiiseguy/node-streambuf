function StreamBuffer(buf) {
	if(!(buf instanceof Buffer)) {
		if(buf instanceof StreamBuffer) {
			return new StreamBuffer(buf.buffer);
		} else {
			throw new TypeError("Not a valid Buffer");
		}
	}
	if(!(this instanceof StreamBuffer)) {
		return new StreamBuffer(buf);
	}
	
	var pos = 0;
	
	Object.defineProperty(this, "buffer", {
		value: buf,
		writable: false
	});
	
	// Numeric methods
	[
		['Int8', 1],
		['Int16LE', 2],
		['Int16BE', 2],
		['Int32LE', 4],
		['Int32BE', 4],
		['UInt8', 1],
		['UInt16LE', 2],
		['UInt16BE', 2],
		['UInt32LE', 4],
		['UInt32BE', 4],
		['FloatLE', 4],
		['FloatBE', 4],
		['DoubleLE', 8],
		['DoubleBE', 8],		
	].forEach(m => {
		var [methodName, len] = m;
		
		var readMethodName = 'read' + methodName;
		this[readMethodName] = () => {
			var res = this.buffer[readMethodName](pos);
			pos = pos + len;
			return res;
		}
		
		var writeMethodName = 'write' + methodName;
		this[writeMethodName] = (val) => {
			pos = this.buffer[writeMethodName](val, pos);
			return val;
		};
	});	
	this.readByte = this.readUInt8;
	this.readSByte = this.readInt8;	
	this.writeByte = this.writeUInt8;
	this.writeSByte = this.writeInt8;
	
	// Read 7bit encoded integer (like those used by .NET's BinaryWriter)
	this.read7BitInt = function() {
		var byte=0, shift=0, num=0;
		do {
			byte = this.readByte();
			num |= (byte & 0x7f) << shift;
			shift += 7;
		} while ((byte & 0x80) != 0);
		return num;
	};
	
	// Write 7bit encoded integer (like those used by .NET's BinaryWriter)
	this.write7BitInt = function(val) {
		while (val >= 0x80) {
			this.writeByte((val | 0x80) & 0xff); // set 8th to 1, keep only first the 8 bits
			val >>= 7;
		}
		this.writeByte(val & 0x7f)
	};
	
	// Read (sub) buffer 
	this.read = function(numBytes) {
		var res = buf.slice(pos, pos+numBytes);
		pos = pos + numBytes;
		return new StreamBuffer(res);
	};
	this.write = function(src) {
		if(!(src instanceof Buffer)) {
			throw new TypeError("Not a valid Buffer");
		}
		pos = pos + src.copy(buf, pos, 0);
		return src;
	};
	
	// String methods
	var _readString = function(length, encoding) {
		if(length == undefined) {			
			for(length = 0;;length++) {
				if(pos+length >= buf.length || buf[pos + length] === 0) break;
			}
		}
		return buf.toString(encoding || "utf8", pos, pos+length);
	};
	this.readString = function(length, encoding) {
		var res = _readString(length, encoding);	
		pos = pos + (length == undefined ? Buffer.byteLength(res, encoding)+1 : length);
		return res;
	};
	this.readString7 = function() {
		var len = this.read7BitInt();
		return this.readString(len);
	};
	this.writeString = function(val, encoding) {
		pos = pos + buf.write(val, pos, encoding);
		return val;
	};
	this.peekString = function(length, encoding) {
		var res = _readString(length, encoding);
		return res;
	};
	
	// Cursor methods
	this.skip = function(numBytes) {
		if(numBytes == undefined) numBytes = 1;
		pos = pos + numBytes;
	};
	this.setPos = this.seek = function(position) {
		if(position != undefined) {
			pos = position;
		}
	};
	this.rewind = function() {
		pos = 0;
	};
	this.getPos = this.tell = function() { return pos; };
	this.isEOF = function() { return pos >= buf.length; };
}

module.exports = StreamBuffer;