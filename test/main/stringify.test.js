import test from 'asia';
import dedent from 'dedent';
import { stringify } from '../../src/main';

test('should stringify(string) check and validate and return array of commit messages', (t) => {
  const result = stringify('fix: foo bar');
  t.strictEqual(Array.isArray(result), true);

  const [res] = result;
  t.strictEqual(res, 'fix: foo bar');

  t.throws(() => stringify('foo bar baz'), Error);
  t.throws(() => stringify(123), TypeError);
  t.throws(() => stringify('fix(): zazaz'), /expect `commit` to follow/);
});

test('should stringify support passing flat=true', (t) => {
  const res = stringify(['foo: bar baz'], true);
  t.strictEqual(typeof res, 'string');
});

test('should stringify return array even with flat=true, if more than 1 commits', (t) => {
  const res = stringify(['foo: bar baz', 'boo: qux zaz'], true);
  t.strictEqual(Array.isArray(res), true);
});

test('should stringify(object) into array of commits', (t) => {
  const result = stringify({ header: { type: 'test', subject: 'updates' } });

  t.strictEqual(Array.isArray(result), true);
  t.strictEqual(result[0], 'test: updates');
});

test('should stringify check and validate an array of mixed values', (t) => {
  const commits = [
    'fix: bar qux',
    {
      header: { type: 'bar', scope: 'zz', subject: 'quack quack' },
      body: 'fixes #1\ncloses #12',
      footer: 'Signed of by',
    },
    dedent`feat(cli): bah bah

    resolves #3
    `,
    { header: { type: 'test', scope: 'ok', subject: 'bar quack' }, zaz: 12 },
  ];

  const commitMessages = stringify(commits);

  t.strictEqual(commitMessages.length, 4);
  t.deepStrictEqual(commitMessages, [
    'fix: bar qux',
    'bar(zz): quack quack\n\nfixes #1\ncloses #12\n\nSigned of by',
    'feat(cli): bah bah\n\nresolves #3',
    'test(ok): bar quack',
  ]);
});
