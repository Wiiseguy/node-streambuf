import test from 'ava';
import StreamBuffer from '.'

test('read unsigned integers', t => {
    var buffer = Buffer.from([1,2,3,4,5,6,7,8]);
	var sb = StreamBuffer(buffer);	

	t.true(sb.read(2).equals(Buffer.from([1,2])) );
	t.true(sb.read(1).equals(Buffer.from([3])) );
	t.true(sb.read(4).equals(Buffer.from([4,5,6,7])) );
	t.true(sb.read(2).equals(Buffer.from([8])) );	// read beyond the length
}); 

test('read string (unknown length)', t => {
	var buffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0, 0x68, 0x69, 0x21]); // h, e, l, l, o, (zero), h, i, !
	var sb = StreamBuffer(buffer);

	t.is(sb.readString(), 'hello'); // read until a 0 is encountered
	t.is(sb.tell(), 6);	// position should point to 0x68, the 0 should have been gobbled
	t.is(sb.readString(), 'hi!');
	
});

test('read string (known length)', t => {
	var buffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0, 0x68, 0x69, 0x21]); // h, e, l, l, o, (zero), h, i, !
	var sb = StreamBuffer(buffer);

	t.is(sb.readString(5), 'hello');
	t.is(sb.tell(), 5);	// position should point to the 0 entry
	sb.skip(1);
	t.is(sb.readString(2), 'hi');
	
});

test('read strings (mixed encodings)', t => {
	 var buffer = Buffer.from([0x9a,0x03, 0x91,0x03, 0xa3,0x03, 0xa3,0x03, 0x95,0x03, 0, 0x68, 0x69, 0x21 ]); //'\u039a\u0391\u03a3\u03a3\u0395\u0000', 'ucs2');
	 var sb = StreamBuffer(buffer);
	 
	 t.is(sb.readString(null, 'ucs2'), 'ΚΑΣΣΕ');
	 t.is(sb.tell(), 11);
	 t.is(sb.readString(), 'hi!');
});

test('read strings (multibyte utf8)', t => {
	 var buffer = Buffer.from([0xF0, 0x9F, 0x98, 0x83,  0, 0x68, 0x69, 0x21 ]); //'\u039a\u0391\u03a3\u03a3\u0395\u0000', 'ucs2');
	 var sb = StreamBuffer(buffer);
	 
	 t.is(sb.readString(), '😃');
	 t.is(sb.tell(), 5);
	 t.is(sb.readString(), 'hi!');
});
 
test('read unsigned integers', t => {
    var buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
	var sb = StreamBuffer(buffer);
	
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
    var buffer = Buffer.from([0xff, 0x01, 0x7f, 0x80]);
	var sb = StreamBuffer(buffer);
	
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

test('correct position increase (numeric methods)', t => {
	var buffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]);
	var sb = StreamBuffer(buffer);
	
	var methods = [
		[sb.readInt8, 1],
		[sb.readInt16LE, 2],
		[sb.readInt16BE, 2],
		[sb.readInt32LE, 4],
		[sb.readInt32BE, 4],
		[sb.readUInt8, 1],
		[sb.readByte, 1],
		[sb.readUInt16LE, 2],
		[sb.readUInt16BE, 2],
		[sb.readUInt32LE, 4],
		[sb.readUInt32BE, 4]
	];
	
	methods.forEach(m => {
		let [method, len] = m;

		method();
		
		t.is(sb.getPos(), len);
		sb.rewind();
	})
	
});

test('buffer access', t => {
	var buffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]);
	var sb = StreamBuffer(buffer);
	
	// The buffer isn't copied
	t.is(sb.buffer, buffer);
	
	// The 'buffer' property should be read-only
	const error = t.throws(() => {
		sb.buffer = Buffer.from([1,2,3]);
	});

	t.true(error instanceof TypeError);
	
});


// Abandoned for now. 64-bit ints do not offer the wanted precision
// Math.pow(2, 63) yields 9223372036854776000, but is in fact 9223372036854775808
/*
test('read 64 bit unsigned integers', t => {
    var buffer = Buffer.from([1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 2]);
	var sb = StreamBuffer(buffer);
	
	var a = sb.readUInt32LE();
	var b = sb.readUInt32LE();
	var uint64 = a + (b * Math.pow(2, 32));
	
	//t.is(uint64, 18446744073709552000);
	t.is(uint64, 0x02ffffffffffff01);
	sb.rewind();
	
	a = sb.readUInt32BE();
	b = sb.readUInt32BE();
	uint64 = b + (a * Math.pow(2, 32));
	
	//t.is(uint64, 18446744073709552000);
	t.is(uint64, 0x01ffffffffffff02);
	sb.rewind();
	
}); 

test('read 64 bit signed integers', t => {
    var buffer = Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]);
	var sb = StreamBuffer(buffer);
	
	var a,b,int64;	
	
	a = sb.readUInt32LE();
	b = sb.readInt32LE();
	var int64 = a + (b * Math.pow(2, 32));
	
	console.log(`a=${a} b=${b} int64=${int64}`)
	
	t.is(int64, Math.pow(2, 63));
	//t.is(int64, 0x02ffffffffffff01);
}); 
*/