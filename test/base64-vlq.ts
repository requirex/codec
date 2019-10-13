import { test } from './test';
import { encodeVLQ, decodeVLQ } from '../packages/base64-vlq';

const inputs: [number[], string][] = [
	[[], ''],
	[[0], 'A'],
	[[0, 1, -1, 2, -2, 16, -16, 17, -17], 'ACDEFgBhBiBjB']
];

const stringify = JSON.stringify;

test('Base64 VLQ encode / decode', (t) => {
	for(let input of inputs) {
		t.equal(
			stringify(encodeVLQ(input[0])),
			stringify(input[1]),
			'encodeVLQ(' + stringify(input[0]) + ')'
		);

		t.equal(
			stringify(decodeVLQ(input[1])),
			stringify(input[0]),
			'decodeVLQ(' + stringify(input[1]) + ')'
		);
	}

	t.end();
});
