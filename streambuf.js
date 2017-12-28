function StreamBuffer(buf) {
	if(!(buf instanceof Buffer)) {
		throw new TypeError("Not a valid Buffer");
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
		['readInt8', 1],
		['readInt16LE', 2],
		['readInt16BE', 2],
		['readInt32LE', 4],
		['readInt32BE', 4],
		['readUInt8', 1],
		['readUInt16LE', 2],
		['readUInt16BE', 2],
		['readUInt32LE', 4],
		['readUInt32BE', 4]
	].forEach(m => {
		var [methodName, len] = m;
		this[methodName] = () => {
			var res = this.buffer[methodName](pos);
			pos = pos + len;
			return res;
		}
	});	
	this.readByte = this.readUInt8;
	this.readSByte = this.readInt8;	
	
	
	// Read (sub) buffer 
	this.read = function(numBytes) {
		var res = buf.slice(pos, pos+numBytes);
		pos = pos + numBytes;
		return res;
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
	this.peekString = function(length, encoding) {
		var res = _readString(length, encoding);
		return res;
	};
	
	// Cursor methods
	this.skip = function(length) {
		if(length == undefined) length = 1;
		pos = pos + length;
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