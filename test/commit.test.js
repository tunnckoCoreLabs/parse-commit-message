import test from 'asia';
import dedent from 'dedent';
import {
  parseCommit,
  stringifyCommit,
  validateCommit,
  checkCommit,
} from '../src/commit';
import { isObject } from '../src/utils';

test('commit: basic', (t) => {
  t.strictEqual(typeof parseCommit, 'function');
  t.strictEqual(typeof stringifyCommit, 'function');
  t.strictEqual(typeof validateCommit, 'function');
  t.strictEqual(typeof checkCommit, 'function');
});

test('.parseCommit throw if not a string given', (t) => {
  t.throws(() => parseCommit(123), TypeError);
  t.throws(() => parseCommit(123), /expect `commit` to be non empty string/);
  t.throws(() => parseCommit(''), /expect `commit` to be non empty string/);
});

test('.parseCommit throw when invalid conventional commits', (t) => {
  function fixture() {
    parseCommit('fix bar qux');
  }
  t.throws(fixture, Error);
  t.throws(fixture, /<type>\[optional scope\]: <description>/);
});

test('.parseCommit NOT throw when header is valid by conventional commits', (t) => {
  const one = parseCommit('fix: zzz qux');
  const two = parseCommit('fix(cli): aaaa qux');
  const res = parseCommit('fix(cli): qqqqq qux\n\nSome awesome body');

  t.ok(isObject(one));
  t.ok(isObject(two));
  t.ok(isObject(res));
});

test('.parseCommit correctly commit message string without scope', (t) => {
  const result = parseCommit('fix: bar qux');

  t.deepStrictEqual(result, {
    header: { type: 'fix', scope: null, subject: 'bar qux' },
    body: null,
    footer: null,
  });
});

test('.parseCommit header string with scope', (t) => {
  t.deepStrictEqual(parseCommit('fix(cli): bar qux'), {
    header: { type: 'fix', scope: 'cli', subject: 'bar qux' },
    body: null,
    footer: null,
  });
});

test('.checkCommit throw if not object given', (t) => {
  t.throws(() => checkCommit({}), TypeError);
  t.throws(() => checkCommit([]), TypeError);
  t.throws(() => checkCommit(null), TypeError);
  t.throws(() => checkCommit(123), /expect `commit` to be an object/);
});

test('.checkCommit throw if commit.header.type is not a string', (t) => {
  const fixture = () => checkCommit({ header: { foo: 'bar' } });
  t.throws(fixture, /type should be non empty string/);
});

test('.checkCommit throw if commit.header.subject is not a string', (t) => {
  t.throws(
    () => checkCommit({ header: { type: 'fix' } }),
    /subject should be non empty string/,
  );
  t.throws(
    () => checkCommit({ header: { type: 'fix', subject: '' } }),
    /subject should be non empty string/,
  );
});

test('.checkCommit throw if commit.header.scope is not a string when given', (t) => {
  const commit = { header: { type: 'fix', subject: 'qux zaz', scope: 123 } };
  t.throws(
    () => checkCommit(commit),
    /scope should be non empty string when given/,
  );
});

test('.checkCommit throw if commit.body is not a string when given', (t) => {
  const commit = { header: { type: 'fix', subject: 'qux zaz' }, body: 123 };
  t.throws(
    () => checkCommit(commit),
    /body should be non empty string when given/,
  );
});
test('.checkCommit throw if commit.footer is not a string when given', (t) => {
  const commit = { header: { type: 'fix', subject: 'qux zaz' }, footer: 123 };
  t.throws(
    () => checkCommit(commit),
    /footer should be non empty string when given/,
  );
});

test('.checkCommit should commit.body be `null` when explicitly null given', (t) => {
  const header = { type: 'fix', scope: 'cli', subject: 'zzz' };
  const commit = { header, body: null };
  const result = checkCommit(commit);

  t.deepStrictEqual(result, {
    header: { type: 'fix', scope: 'cli', subject: 'zzz' },
    body: null,
    footer: '',
  });
});

test('.checkCommit should commit.body be empty string when not given', (t) => {
  const header = { type: 'feat', scope: 'zazzy', subject: 'okey dude' };
  const commit = { header, footer: 'ok ok' };
  const result = checkCommit(commit);
  t.deepStrictEqual(result, { header, body: '', footer: 'ok ok' });
});

test('.checkCommit should commit.footer be `null` when explicitly null given', (t) => {
  const header = { type: 'fix', scope: 'cli', subject: 'zzz' };
  const commit = { header, footer: null, body: 'BREAKING CHANGE: whoa!' };
  const result = checkCommit(commit);

  t.deepStrictEqual(result, {
    header: { type: 'fix', scope: 'cli', subject: 'zzz' },
    body: 'BREAKING CHANGE: whoa!',
    footer: null,
  });
});

test('.checkCommit should commit.footer be empty string when not given', (t) => {
  const header = { type: 'feat', scope: 'zazzy', subject: 'okey dude' };
  const commit = { header };
  const result = checkCommit(commit);
  t.deepStrictEqual(result, { header, body: '', footer: '' });
});

test('.checkCommit object with scope, body and footer', (t) => {
  const commit = {
    header: {
      type: 'feat',
      scope: 'quxie',
      subject: 'woo hoo',
    },
    body: 'qux zaz faz',
    footer: 'Breaking yeah',
  };
  t.deepStrictEqual(checkCommit(commit), commit);
});

test('.stringifyCommit throw if invalid header is given', (t) => {
  t.throws(() => stringifyCommit(1234), TypeError);
  t.throws(() => stringifyCommit({ header: { type: 'foo' } }), TypeError);
  t.throws(() => stringifyCommit(), /expect `commit` to be an object/);
});

test('.stringifyCommit object', (t) => {
  const header = { type: 'fix', scope: 'huh', subject: 'yeah yeah' };
  const result = stringifyCommit({ header });

  t.strictEqual(result, 'fix(huh): yeah yeah');

  const cmt = {
    header,
    body: 'resolves #1\nfixes #3',
    footer: 'BREAKING CHANGE: yeah!',
  };
  const commitMessage = dedent`${result}

  resolves #1
  fixes #3

  BREAKING CHANGE: yeah!`;

  t.strictEqual(stringifyCommit(cmt), commitMessage);
});

test('.stringifyCommit object without scope', (t) => {
  const header = {
    header: { type: 'fix', subject: 'yeah yeah' },
    body: 'woo hoo',
  };
  const result = stringifyCommit(header);

  t.strictEqual(result, 'fix: yeah yeah\n\nwoo hoo');
});

test('.validateCommit should return boolean when second param `ret` is not given', (t) => {
  const header = { type: 'fix', subject: 'bar qux' };
  const boolTrue = validateCommit({
    header,
    body: 'foo',
  });
  const boolFalse = validateCommit({ header, body: 111, footer: 'sasa' });

  t.strictEqual(boolTrue, true);
  t.strictEqual(boolFalse, false);
});

test('.validateCommit should return { error, value } object when `ret` is true', (t) => {
  const header = { type: 'major', scope: 'qux', subject: 'some awful change' };
  const result = validateCommit({ header, body: 'okkk' }, true);

  t.deepStrictEqual(result, {
    value: { header, body: 'okkk', footer: '' },
  });

  const res2 = validateCommit({ header: { foo: 1 }, body: 'a' }, true);
  t.ok(res2.error);
  t.ok(res2.error instanceof Error);
  t.ok(!res2.value);
});
