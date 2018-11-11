import test from 'asia';
import dedent from 'dedent';
import { parse } from '../../src/main';

test('main: basic', (t) => {
  t.strictEqual(typeof parse, 'function');
});

test('should parse() string commit message into an array of Commit objects', (t) => {
  const result = parse('fix: foo bar');
  t.strictEqual(Array.isArray(result), true);

  const [res] = result;
  t.deepStrictEqual(res, {
    header: { type: 'fix', scope: null, subject: 'foo bar' },
    body: null,
    footer: null,
  });
});

test('should parse(string) return an object when `flat: true` and single commit', (t) => {
  const res = parse('feat(cli): qux bar', true);

  t.strictEqual(typeof res, 'object');
  t.strictEqual(Array.isArray(res), false);
  t.strictEqual(res.header.scope, 'cli');
});

test('should parse() work okey with array of arrays', (t) => {
  const [one, two] = parse(['fix: bar', ['qux: zaz']]);

  t.deepStrictEqual(one, {
    header: { type: 'fix', scope: null, subject: 'bar' },
    body: null,
    footer: null,
  });
  t.deepStrictEqual(two, {
    header: { type: 'qux', scope: null, subject: 'zaz' },
    body: null,
    footer: null,
  });
});

test('should parse(object) passthrough if object is passed as commit', (t) => {
  const result = parse({ foo: 'bar' }, true);

  t.strictEqual(typeof result, 'object');
  t.strictEqual(result.foo, 'bar');
});

test('should parse(array) be able to accept array', (t) => {
  const commits = parse([
    'fix: bar qux',
    dedent`feat(cli): zazzy qux

    BREAKING CHANGE: woo hoo`,
    'chore(ci): abc fux',
    dedent`fix(src-foo): alleluah yeah

    resolves #3
    closes #123

    Signed-off-by: Foo Bar <abc@exam.pl>`,
  ]);

  t.strictEqual(commits.length, 4);

  const [one, two, three, four] = commits;
  t.strictEqual(one.header.type, 'fix');
  t.strictEqual(one.header.scope, null);
  t.strictEqual(one.header.subject, 'bar qux');
  t.strictEqual(one.body, null);
  t.strictEqual(one.footer, null);

  t.strictEqual(two.header.type, 'feat');
  t.strictEqual(two.header.scope, 'cli');
  t.strictEqual(two.header.subject, 'zazzy qux');
  t.strictEqual(two.body, 'BREAKING CHANGE: woo hoo');
  t.strictEqual(two.footer, null);

  t.strictEqual(three.header.type, 'chore');
  t.strictEqual(three.header.scope, 'ci');
  t.strictEqual(three.header.subject, 'abc fux');
  t.strictEqual(three.body, null);
  t.strictEqual(three.footer, null);

  t.strictEqual(four.header.type, 'fix');
  t.strictEqual(four.header.scope, 'src-foo');
  t.strictEqual(four.header.subject, 'alleluah yeah');
  t.strictEqual(four.body, 'resolves #3\ncloses #123');
  t.strictEqual(four.footer, 'Signed-off-by: Foo Bar <abc@exam.pl>');
});
