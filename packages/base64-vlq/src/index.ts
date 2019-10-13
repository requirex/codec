import { fromBase64, toBase64 } from '@lib/base64';

export function decodeVLQ(src: string): number[];
export function decodeVLQ(
	src: string,
	dst: number[],
	dstPos?: number,
	srcPos?: number,
	srcEnd?: number,
	dstEnd?: number
): number;

/** Decode a string containing Base64 variable-length quantities,
  * as seen in source maps.
  *
  * @param src String to decode.
  * @param dst Destination array for storing the result.
  * @param dstPos Initial offset to destination, default is 0.
  * @param srcPos Initial offset to source data, default is 0.
  * @param srcEnd Source data end offset, default is its length.
  * @param dstEnd Maximum destination array size.
  *
  * @return End offset past data stored if a destination was given,
  * otherwise a numeric array containing the encoded result. */

export function decodeVLQ(
	src: string,
	dst?: number[],
	dstPos = 0,
	srcPos = 0,
	srcEnd = src.length,
	dstEnd = srcEnd
) {
	let result: number[] | undefined;
	let shift = 0;
	let code: number;
	let sign: number;
	let num = 0;

	dst = dst || (result = []);

	while(srcPos < srcEnd && dstPos < dstEnd) {
		code = fromBase64[src.charCodeAt(srcPos++)];
		num += (code & 31) << shift;

		if(code & 32) {
			shift += 5;
		} else {
			sign = num & 1;
			// Zig-zag decode unsigned to signed.
			dst[dstPos++] = ((num >>> 1) ^ -sign) + sign;
	
			shift = 0;
			num = 0;
		}
	}

	return result || dstPos;
}

export function encodeVLQ(
	src: number[],
	dst = '',
	srcPos = 0,
	srcEnd = src.length
) {
	let num: number;
	let sign: number;

	while(srcPos < srcEnd) {
		num = src[srcPos++];
		sign = num >> 31;

		// Zig-zag encode signed to unsigned.
		num = ((num + sign) << 1) ^ sign;

		while(num > 31) {
			dst += toBase64[(num & 31) | 32];
			num >>>= 5;
		}

		dst += toBase64[num & 31];
	}

	return dst;
}
