import { EOL } from 'os';
import test from 'asia';
import dedent from 'dedent';
import { applyPlugins, plugins, mappers, parse, check } from '../src';

test('index: basic', (t) => {
  t.strictEqual(typeof applyPlugins, 'function');
  t.strictEqual(typeof mappers, 'object');
  t.strictEqual(typeof mappers.mentions, 'function');
  t.strictEqual(typeof mappers.increment, 'function');
  t.strictEqual(Array.isArray(plugins), true);
  t.strictEqual(plugins.length, 2);
});

test('should apply increment plugin add `increment: patch` property to Commit objects', (t) => {
  const commitMsg = dedent`fix(fox): bar qux

  resolves #123
  closes #1111

  Awesome
  Signed-off-by: Bar Qux`;

  const commitObj = {
    header: { type: 'fix', scope: 'fox', subject: 'bar qux' },
    body: 'resolves #123\ncloses #1111',
    footer: 'Awesome\nSigned-off-by: Bar Qux',
    increment: 'patch',
    isBreaking: false,
  };

  const [commit] = applyPlugins(mappers.increment, parse(commitMsg));

  t.deepStrictEqual(commit, commitObj);
});

test('should apply increment plugin add `increment: minor` property to Commit objects', (t) => {
  const [commit] = applyPlugins(mappers.increment, parse('feat(bar): bar qux'));

  t.deepStrictEqual(commit.increment, 'minor');
  t.deepStrictEqual(commit.isBreaking, false);
});

test('should apply increment plugin add `increment: major` property to Commit objects', (t) => {
  const [commit] = applyPlugins(
    mappers.increment,
    parse('major(bar): bar qux'),
  );

  t.deepStrictEqual(commit.increment, 'major');
  t.deepStrictEqual(commit.isBreaking, true);
});

test('should increment plugin consider `major` when find `BREAKING CHANGE: ` label', (t) => {
  const [res] = applyPlugins(
    mappers.increment,
    parse(
      dedent`fix: bar qux

      BREAKING CHANGE: ooh ouch!`,
    ),
  );

  t.strictEqual(res.increment, 'major');
  t.strictEqual(res.isBreaking, true);
  t.strictEqual(res.header.type, 'fix');
  t.strictEqual(res.header.scope, null);
  t.strictEqual(res.header.subject, 'bar qux');
  t.strictEqual(res.body, 'BREAKING CHANGE: ooh ouch!');
});

test('should add mentions plugin and `mentions: Array<Mention>` property', (t) => {
  const [res] = applyPlugins(mappers.mentions, parse('fix: bar @qux zaz'));

  t.deepStrictEqual(res.header, {
    type: 'fix',
    scope: null,
    subject: 'bar @qux zaz',
  });
  t.deepStrictEqual(res.mentions, [
    { handle: '@qux', mention: 'qux', index: 3 },
  ]);
});

test('should add both mentions and increment plugins and respective props to Commit object', (t) => {
  const commits = parse(
    'chore(ci): yeah @bar & @qux zaz\n\nBREAKING CHANGE: oh yeah',
  );
  const [res] = applyPlugins(plugins, commits);

  t.deepStrictEqual(res.mentions, [
    { handle: '@bar', mention: 'bar', index: 4 },
    { handle: '@qux', mention: 'qux', index: 11 },
  ]);
  t.strictEqual(res.isBreaking, true);
  t.strictEqual(res.increment, 'major');
  t.strictEqual(res.header.type, 'chore');
  t.strictEqual(res.header.scope, 'ci');
  t.strictEqual(res.header.subject, 'yeah @bar & @qux zaz');
  t.strictEqual(res.body, 'BREAKING CHANGE: oh yeah');
});

test('should result.increment be false if no bump needed', (t) => {
  const [result] = applyPlugins(mappers.increment, parse('chore(zz): foo bar'));

  t.strictEqual(result.increment, false);
  t.strictEqual(result.isBreaking, false);
  t.strictEqual(result.header.type, 'chore');
  t.strictEqual(result.header.scope, 'zz');
  t.strictEqual(result.header.subject, 'foo bar');
});

test('ensure most common usage', (t) => {
  const commitMsg = 'fix: bar qux';
  const [res1] = applyPlugins(plugins, check(parse(commitMsg)));
  const [res2] = applyPlugins(plugins, check(parse(commitMsg + EOL)));
  const [res3] = applyPlugins(plugins, check(parse(commitMsg + EOL + EOL)));

  t.deepStrictEqual(res1, res2);

  t.strictEqual(res2.body, null);
  t.strictEqual(res2.header.type, 'fix');
  t.strictEqual(res2.header.scope, null);
  t.strictEqual(res2.header.subject, 'bar qux');
  t.strictEqual(res2.isBreaking, false);
  t.strictEqual(res2.increment, 'patch');

  t.strictEqual(res3.body.trim(), '');
  t.strictEqual(res3.header.type, 'fix');
  t.strictEqual(res3.header.scope, null);
  t.strictEqual(res3.header.subject, 'bar qux');
  t.strictEqual(res3.isBreaking, false);
  t.strictEqual(res3.increment, 'patch');
});

test('ensure empty footer is allowed (git commit defaults)', (t) => {
  const commitMsg = 'fix: bar qux\n\nBar qux';
  const [res1] = applyPlugins(plugins, check(parse(commitMsg)));
  const [res2] = applyPlugins(plugins, check(parse(commitMsg + EOL)));
  const [res3] = applyPlugins(plugins, check(parse(commitMsg + EOL + EOL)));

  t.strictEqual(res1.body, 'Bar qux');
  t.strictEqual(res1.footer, null);

  t.strictEqual(res2.body, `Bar qux${EOL}`);
  t.strictEqual(res2.footer, null);

  t.strictEqual(res3.body, 'Bar qux');
  t.strictEqual(res3.footer, '');
});
