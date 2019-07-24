import { ArrayType } from './types';
import { encodeUTF8 } from '@requirex/utf-8';

export class Hasher32 {

	constructor(private tbl: number[]) {}

	append(
		src: string | ArrayType,
		srcPos = 0,
		srcEnd?: number
	) {
		let { tbl, crc } = this;

		if(typeof src == 'string') src = encodeUTF8(src);
		if(srcEnd === void 0) srcEnd = src.length;

		while(srcPos < srcEnd) {
			crc = (crc >>> 8) ^ tbl[(crc & 0xff) ^ src[srcPos++]];
		}

		this.crc = crc;

		return ~crc >>> 0;
	}

	crc = ~0;

}

/** 32-bit Cyclic Redundancy Check. */

export class CRC32 {

	/** @param poly Reversed generator polynomial, default edb88320 (Ethernet, GZIP, PNG).
	  * Other good choices are 82f63b78 (Castagnoli) used in Btrfs and eb31d82e (Koopman). */

	constructor(public poly = 0xedb88320) {
		for(let n = 0; n < 256; ++n) {
			let crc = n;
			let b = 8;

			while(b--) {
				crc = ((crc >>> 1) ^ (-(crc & 1) & poly)) >>> 0;
			}

			this.tbl[n] = crc;
		}
	}

	create() {
		return new Hasher32(this.tbl);
	}

	tbl: number[] = [];

}
