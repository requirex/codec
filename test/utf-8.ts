import { test } from './test';
import { encodeUTF8, decodeUTF8 } from '../packages/utf-8';

const validInputs: [number[], string][] = [
	// Simple ASCII.
	[[], ''],
	[[0], '\0'],
	[[0x40], '@'],
	[[0x41, 0, 0x7e, 0x7f, 0], 'A\0~\x7f\0'],

	// 2-byte min / max.
	[[0xc2, 0x80], '\x80'],
	[[0xdf, 0xbf], '\u07ff'],

	// 3-byte min / max.
	[[0xe0, 0xa0, 0x80], '\u0800'],
	[[0xef, 0xbf, 0xbf], '\uffff'],

	// 4-byte min / max.
	[[0xf0, 0x90, 0x80, 0x80], '\ud800\udc00'],
	[[0xf4, 0x8f, 0xbf, 0xbf], '\udbff\udfff'],

	// Individual characters.
	[[0xf0, 0x9f, 0xa4, 0x94], '\ud83e\udd14'],

	// Invalid surrogates.
	[[0xed, 0xa0, 0x80], '\ud800'],
	[[0xed, 0xaf, 0xbf], '\udbff'],
	[[0xed, 0xb0, 0x80], '\udc00'],
	[[0xed, 0xbf, 0xbf], '\udfff'],
	[[0x20, 0xed, 0xa0, 0x80], ' \ud800'],
	[[0xed, 0xa0, 0x80, 0x20], '\ud800 '],
	[[0x20, 0xed, 0xb0, 0x80], ' \udc00'],
	[[0xed, 0xb0, 0x80, 0x20], '\udc00 ']
];

const invalidInputs: [number[], string][] = [
	// Invalid bytes.
	[[0xfe], '\ufffd'],
	[[0xfe, 0x80], '\ufffd'],
	[[0xff], '\ufffd'],
	[[0xff, 0x80], '\ufffd'],

	// Orphaned continuation bytes.
	[[0x80], '\ufffd'],
	[[0xbf], '\ufffd'],
	[[0x80, 0xbf], '\ufffd'],

	// 2-byte overlong forms, with and without additional errors.
	[[0xc0], '\ufffd'],
	[[0xc0, 0x80], '\0'],
	[[0xc1, 0x80], '@'],
	[[0xc1, 0x80, 0x80], '@\ufffd'],

	// 3-byte overlong forms.
	[[0xe0], '\ufffd'],
	[[0xe0, 0x80], '\ufffd'],
	[[0xe0, 0x80, 0x80], '\0'],
	[[0xe0, 0x80, 0x80, 0x80], '\0\ufffd'],

	// 4-byte overlong forms.
	[[0xf0], '\ufffd'],
	[[0xf0, 0x80, 0x80], '\ufffd'],
	[[0xf0, 0x80, 0x80, 0x80], '\0'],
	[[0xf0, 0x80, 0x80, 0x80, 0x80], '\0\ufffd'],

	// 5-byte overlong forms.
	[[0xf8], '\ufffd'],
	[[0xf8, 0x80, 0x80, 0x80], '\ufffd'],
	[[0xf8, 0x80, 0x80, 0x80, 0x80], '\0'],
	[[0xf8, 0x80, 0x80, 0x80, 0x80, 0x80], '\0\ufffd'],

	// 6-byte overlong forms.
	[[0xfc], '\ufffd'],
	[[0xfc, 0x80, 0x80, 0x80, 0x80], '\ufffd'],
	[[0xfc, 0x80, 0x80, 0x80, 0x80, 0x80], '\0'],
	[[0xfc, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80], '\0\ufffd']
];

const stringify = JSON.stringify;

test('UTF-8 encode / decode', (t) => {
	for(let input of validInputs) {
		t.equal(
			stringify(encodeUTF8(input[1])),
			stringify(input[0]),
			'encodeUTF8(' + stringify(input[1]) + ')'
		);

		t.equal(
			stringify(decodeUTF8(input[0])),
			stringify(input[1]),
			'decodeUTF8(' + stringify(input[0]) + ')'
		);
	}

	t.end();
});

test('UTF-8 error handling', (t) => {
	for(let input of invalidInputs) {
		t.equal(
			stringify(decodeUTF8(input[0])),
			stringify(input[1]),
			'decodeUTF8(' + stringify(input[0]) + ')'
		);
	}

	t.end();
});
