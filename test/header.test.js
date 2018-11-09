import test from 'asia';
import {
  parseHeader,
  stringifyHeader,
  validateHeader,
  checkHeader,
} from '../src/header';
import { isObject } from '../src/utils';

test('header: basic', (t) => {
  t.strictEqual(typeof parseHeader, 'function');
  t.strictEqual(typeof stringifyHeader, 'function');
  t.strictEqual(typeof validateHeader, 'function');
  t.strictEqual(typeof checkHeader, 'function');
});

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

test('.checkHeader throw if not object given', (t) => {
  t.throws(() => checkHeader({}), TypeError);
  t.throws(() => checkHeader([]), TypeError);
  t.throws(() => checkHeader(null), TypeError);
  t.throws(() => checkHeader(123), /expect `header` to be an object/);
});

test('.checkHeader throw if header.type is not a string', (t) => {
  const fixture = () => checkHeader({ foo: 'bar' });
  t.throws(fixture, /type should be non empty string/);
});

test('.checkHeader throw if header.subject is not a string', (t) => {
  t.throws(
    () => checkHeader({ type: 'fix' }),
    /subject should be non empty string/,
  );
  t.throws(
    () => checkHeader({ type: 'fix', subject: '' }),
    /subject should be non empty string/,
  );
});

test('.checkHeader throw if header.scope is not a string when given', (t) => {
  t.throws(
    () => checkHeader({ type: 'fix', subject: 'qux zaz', scope: 123 }),
    /scope should be non empty string when given/,
  );
});

test('.checkHeader should header.scope be `null` when explicitly null given', (t) => {
  const result = checkHeader({ type: 'fix', subject: 'ss', scope: null });
  t.deepStrictEqual(result, { type: 'fix', subject: 'ss', scope: null });
});

test('.checkHeader should header.scope be empty string when not given', (t) => {
  const res = checkHeader({ type: 'aaa', subject: 'quxie bar' });
  t.deepStrictEqual(res, { type: 'aaa', subject: 'quxie bar', scope: '' });
});

test('.checkHeader correctly header object without scope', (t) => {
  const result = checkHeader({
    type: 'fix',
    subject: 'bar qux',
  });

  t.deepStrictEqual(result, { type: 'fix', scope: '', subject: 'bar qux' });
});

test('.checkHeader object with scope', (t) => {
  const header = {
    type: 'feat',
    scope: 'quxie',
    subject: 'woo hoo',
  };

  t.deepStrictEqual(checkHeader(header), header);
});

test('.stringifyHeader throw if invalid header is given', (t) => {
  t.throws(() => stringifyHeader(1234), TypeError);
  t.throws(() => stringifyHeader({ type: 'foo' }), TypeError);
  t.throws(() => stringifyHeader(), /expect `header` to be an object/);
});

test('.stringifyHeader object', (t) => {
  const header = { type: 'fix', scope: 'huh', subject: 'yeah yeah' };
  const result = stringifyHeader(header);

  t.strictEqual(result, 'fix(huh): yeah yeah');
});

test('.stringifyHeader object without scope', (t) => {
  const header = { type: 'fix', subject: 'yeah yeah' };
  const result = stringifyHeader(header);

  t.strictEqual(result, 'fix: yeah yeah');
});

test('.validateHeader should return boolean when second param `ret` is not given', (t) => {
  const boolTrue = validateHeader({ type: 'fix', subject: 'bar qux' });
  const boolFalse = validateHeader({ type: 'fix' });

  t.strictEqual(boolTrue, true);
  t.strictEqual(boolFalse, false);
});

test('.validateHeader should return { error, value } object when `ret` is true', (t) => {
  const result = validateHeader({ type: 'fix', subject: 'bar qux' }, true);

  t.deepStrictEqual(result, {
    value: { type: 'fix', scope: '', subject: 'bar qux' },
  });

  const res2 = validateHeader({ type: 'fix' }, true);
  t.ok(res2.error);
  t.ok(res2.error instanceof Error);
  t.ok(!res2.value);
});
