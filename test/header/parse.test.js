import test from 'asia';
import { parseHeader } from '../../src/header';
import { isObject } from '../../src/utils';

test('.parseHeader throw if not a string given', (t) => {
  t.throws(() => parseHeader(123), TypeError);
  t.throws(() => parseHeader(123), /expect `header` to be non empty string/);
  t.throws(() => parseHeader(''), /expect `header` to be non empty string/);
});

test('.parseHeader throw when invalid conventional commits', (t) => {
  function fixture() {
    parseHeader('fix bar qux');
  }
  t.throws(fixture, Error);
  t.throws(fixture, /<type>\[optional scope\]: <description>/);
});

test('.parseHeader NOT throw when header is valid by conventional commits', (t) => {
  const one = parseHeader('fix: zzz qux');
  const two = parseHeader('fix(cli): aaaa qux');
  const res = parseHeader('fix(cli): qqqqq qux\n\nSome awesome body');

  t.ok(isObject(one));
  t.ok(isObject(two));
  t.ok(isObject(res));
});

test('.parseHeader correctly header string without scope', (t) => {
  const result = parseHeader('fix: bar qux');

  t.deepStrictEqual(result, { type: 'fix', scope: null, subject: 'bar qux' });
});

test('.parseHeader header string with scope', (t) => {
  t.deepStrictEqual(parseHeader('fix(cli): bar qux'), {
    type: 'fix',
    scope: 'cli',
    subject: 'bar qux',
  });
});
