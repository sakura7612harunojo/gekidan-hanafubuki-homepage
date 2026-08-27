import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'app/admin/(protected)/gallery/page.tsx');

test('gallery upload UI and server validation match the production bucket limits', () => {
  const source = fs.readFileSync(file, 'utf8');
  assert.match(source, /image\/jpeg/);
  assert.match(source, /image\/png/);
  assert.match(source, /image\/webp/);
  assert.doesNotMatch(source, /image\/heic|image\/heif/);
  assert.match(source, /10\s*\*\s*1024\s*\*\s*1024/);
  assert.match(source, /ALLOWED_IMAGE_TYPES/);
});
