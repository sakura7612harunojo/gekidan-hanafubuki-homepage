import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buttonPath = path.join(root, 'components/admin/AdminSubmitButton.tsx');
const adminPages = [
  'app/admin/(protected)/members/page.tsx',
  'app/admin/(protected)/works/page.tsx',
  'app/admin/(protected)/news/page.tsx',
  'app/admin/(protected)/performances/page.tsx',
  'app/admin/(protected)/gallery/page.tsx',
];

test('admin mutation buttons lock while a form action is pending', () => {
  assert.equal(fs.existsSync(buttonPath), true, 'shared pending-aware submit button is missing');

  const buttonSource = fs.readFileSync(buttonPath, 'utf8');
  assert.match(buttonSource, /useFormStatus/);
  assert.match(buttonSource, /disabled=\{pending\}/);
  assert.match(buttonSource, /pendingLabel/);

  for (const relativePath of adminPages) {
    const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
    assert.match(source, /AdminSubmitButton/, `${relativePath} must use the pending-aware submit button`);
    assert.doesNotMatch(
      source,
      /<button[\s\S]{0,220}?type=["']submit["']/,
      `${relativePath} still contains an unguarded submit button`,
    );
  }
});
