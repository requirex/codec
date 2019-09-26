import { test } from './test';
import { CRC32 } from '../packages/crc32';

const ethernet = new CRC32(0xedb88320);
const castagnoli = new CRC32(0x82f63b78);
const koopman = new CRC32(0xeb31d82e);

test('CRC32', (t) => {
	let hash = ethernet.create();

	t.equal(hash.append(), 0);
	t.equal(hash.append([0]), 0xd202ef8d);
	t.equal(hash.append('µ'), 0xbd862bdd);

	hash = ethernet.create();
	t.equal(hash.append('Hello'), 0xf7d18982);
	t.equal(hash.append(', World!'), 0xec4ac3d0);

	hash = castagnoli.create();

	t.equal(hash.append([0]), 0x527d5351);
	t.equal(hash.append('馬'), 0x7afed94d);

	hash = koopman.create();

	t.equal(hash.append([0]), 0x3f522c72);
	t.equal(hash.append('🤔'), 0x7ceea2d7);

	t.end();
});
