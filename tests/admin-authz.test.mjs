import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const protectedDir = path.join(root, 'app/admin/(protected)');
const protectedPages = [
  'members/page.tsx',
  'works/page.tsx',
  'news/page.tsx',
  'performances/page.tsx',
  'gallery/page.tsx',
].map((p) => path.join(protectedDir, p));

test('protected admin area requires membership in admin_users', () => {
  const layout = fs.readFileSync(path.join(protectedDir, 'layout.tsx'), 'utf8');
  assert.match(layout, /from\(["']admin_users["']\)/);
  assert.match(layout, /eq\(["']user_id["'],\s*user\.id\)/);
  assert.match(layout, /if\s*\(.*!.*admin/s);
});

test('protected admin pages use the authenticated Supabase client instead of service-role client', () => {
  for (const file of protectedPages) {
    const source = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /createAdminClient/);
    assert.match(source, /@\/lib\/supabase\/server/);
  }
});
