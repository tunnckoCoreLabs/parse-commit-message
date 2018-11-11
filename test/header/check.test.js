import test from 'asia';
import { checkHeader } from '../../src/header';

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

test('.checkHeader should header.scope be null when not given', (t) => {
  const res = checkHeader({ type: 'aaa', subject: 'quxie bar' });
  t.deepStrictEqual(res, { type: 'aaa', subject: 'quxie bar', scope: null });
});

test('.checkHeader correctly header object without scope', (t) => {
  const result = checkHeader({
    type: 'fix',
    subject: 'bar qux',
  });

  t.deepStrictEqual(result, { type: 'fix', scope: null, subject: 'bar qux' });
});

test('.checkHeader object with scope', (t) => {
  const header = {
    type: 'feat',
    scope: 'quxie',
    subject: 'woo hoo',
  };

  t.deepStrictEqual(checkHeader(header), header);
});
