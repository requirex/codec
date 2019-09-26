import { ArrayType } from './types';
import { encodeUTF8 } from '@lib/utf-8';

/** Base64 encoding alphabet and = for padding. */
const chars64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/** Map Base64 sextet to encoded character. */
export const toBase64: string[] = [];

/** Map ASCII code of encoded character to Base64 sextet. */
export const fromBase64: number[] = [];

// Fill Base64 character mapping tables.

for(let i = 0; i < 65; ++i) {
	toBase64[i] = chars64.charAt(i);
	fromBase64[chars64.charCodeAt(i)] = i;
}

/** Base64 encode a string or numeric array to string.
  * Input strings will be first re-encoded in UTF-8.
  *
  * @param src String or array to encode.
  * @param dst Output string prefix, default is empty.
  * @param srcPos Initial offset to source data, default is 0.
  * @param srcEnd Source data end offset, default is its length.
  *
  * @return Encoded string. */

export function encode64(
	src?: string | ArrayType,
	dst = '',
	srcPos = 0,
	srcEnd?: number
) {
	let a: number, b: number, c: number;

	src = src || [];
	if(typeof src == 'string') src = encodeUTF8(src);
	if(srcEnd === void 0) srcEnd = src.length;

	while(srcPos < srcEnd) {
		a = src[srcPos++];
		b = src[srcPos++];
		c = src[srcPos++];

		dst += (
			toBase64[a >> 2] +
			toBase64[((a & 0b11) << 4) | (b >> 4)] +
			// Insert padding if input ran out:
			// (~(~n + n) & 64) converts undefined to 64, everything else to 0.
			// Note: undefined == NaN == 0 in bitwise operations.
			toBase64[(~(~b + b) & 64) | ((b & 0b1111) << 2) | (c >> 6)] +
			toBase64[(~(~c + c) & 64) | (c & 0b111111)]
		);
	}

	return dst;
}
