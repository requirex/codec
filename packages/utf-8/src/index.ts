import { ArrayType } from './types';

/** Subtract from shifted and summed UTF-16 surrogate pair code units to get
  * correct Unicode code point. Equals:
  * (0xd800 << 10) + 0xdc00 - 0x10000 */
const surrogateOffset = 0x35fdc00;

export function encodeUTF8(src: string): number[];
export function encodeUTF8(
	src: string,
	dst?: ArrayType,
	dstPos?: number,
	srcPos?: number,
	srcEnd?: number
): number;

/** UTF-8 encode a string to an array of bytes.
  * This transform is reversible for any input string,
  * regardless of strange or invalid characters.
  *
  * @param src String to encode.
  * @param dst Destination array or buffer for storing the result.
  * @param dstPos Initial offset to destination, default is 0.
  * @param srcPos Initial offset to source data, default is 0.
  * @param srcEnd Source data end offset, default is its length.
  *
  * @return End offset past data stored if a destination was given,
  * otherwise a numeric array containing the encoded result.
  * Note that output length cannot exceed 3 * input length. */

export function encodeUTF8(
	src: string,
	dst?: ArrayType,
	dstPos = 0,
	srcPos = 0,
	srcEnd = src.length
) {
	let result: number[] | undefined;
	let code: number;
	let a: number, b: number;

	dst = dst || (result = []);

	while(srcPos < srcEnd) {
		code = src.charCodeAt(srcPos++);

		if(code >= 0x80) {
			b = 0b11000000;

			if(code >= 0x800) {
				a = 0b11100000;
				b = 0b10000000;

				// Note: code <= 0xffff because JavaScript API exposes strings
				// only as a 16-bit, UTF-16 encoded buffer.

				if((code - 0xd800 & 0xfc00) == 0) {
					// Surrogate pair first half.
					const next = src.charCodeAt(srcPos) || 0;

					if((next - 0xdc00 & 0xfc00) == 0) {
						// Surrogate pair second half. Re-encode only if both
						// halves are in the valid range. Otherwise store them
						// as-is, to avoid altering decoded result.

						a = 0b10000000;
						code = (code << 10) + next - surrogateOffset;
						dst[dstPos++] = 0b11110000 | (code >> 18);
						++srcPos;
					}
				}

				dst[dstPos++] = a | ((code >> 12) & 0b00111111);
			}

			dst[dstPos++] = b | ((code >> 6) & 0b00111111);
			code = 0b10000000 | (code & 0b00111111);
		}

		dst[dstPos++] = code;
	}

	return result || dstPos;
}
