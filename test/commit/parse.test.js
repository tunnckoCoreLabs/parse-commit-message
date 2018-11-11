import test from 'asia';
import { parseCommit } from '../../src/commit';
import { isObject } from '../../src/utils';

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
