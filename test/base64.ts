import { test } from './test';
import { encode64 } from '../packages/base64';

const inputs: [string, string][] = [
	['\0', 'AA=='],
	['\0\0', 'AAA='],
	['\0\0\0', 'AAAA'],
	['Hello, World!', 'SGVsbG8sIFdvcmxkIQ=='],
	['@', 'QA=='],
	['µ', 'wrU='],
	['馬', '6aas'],
	['🤔', '8J+klA==']
];

const stringify = JSON.stringify;

test('Base64 encode / decode', (t) => {
	t.equal(encode64(), '', 'encode64()');

	for(let input of inputs) {
		t.equal(
			stringify(encode64(input[0])),
			stringify(input[1]),
			'encode64(' + stringify(input[0]) + ')'
		);
	}

	t.end();
});
