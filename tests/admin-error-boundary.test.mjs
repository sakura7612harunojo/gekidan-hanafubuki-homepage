import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'app/admin/(protected)/error.tsx');

test('admin mutations have a dedicated recoverable error screen', () => {
  assert.equal(fs.existsSync(file), true, 'admin error boundary is missing');
  const source = fs.readFileSync(file, 'utf8');
  assert.match(source, /保存|登録|処理/);
  assert.match(source, /reset\(\)/);
  assert.match(source, /管理画面に戻る/);
});
