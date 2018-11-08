import test from 'asia';
import { applyPlugins, plugins, mappers } from '../src';

test('main: basic', (t) => {
  t.strictEqual(typeof applyPlugins, 'function');
  t.strictEqual(typeof mappers, 'object');
  t.strictEqual(typeof mappers.mentions, 'function');
  t.strictEqual(typeof mappers.increment, 'function');
  t.strictEqual(Array.isArray(plugins), true);
  t.strictEqual(plugins.length, 2);
});

// const res = parseCommit([
//   'feat(api): foobar',
//   'fix: some break\n\nBREAKING CHANGE: foobar',
//   `refactor: qqqq

// Foo bar baz.
// Some awesome body!

// resolves #33
// fixes #123
// Signed-off-by: Charlike Mike Reagent <mail@example.com>`,
// ]);
