import test from 'asia';
import { checkCommit } from '../../src/commit';

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
  t.throws(() => checkCommit(commit), /body should be string when given/);
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
  const commit = { header, body: null, footer: 'xyz' };
  const result = checkCommit(commit);

  t.deepStrictEqual(result, {
    header: { type: 'fix', scope: 'cli', subject: 'zzz' },
    body: null,
    footer: 'xyz',
  });
});

test('.checkCommit should commit.body be null when not given', (t) => {
  const header = { type: 'feat', scope: 'zazzy', subject: 'okey dude' };
  const commit = { header, footer: 'ok ok' };
  const result = checkCommit(commit);

  t.deepStrictEqual(result, { header, body: null, footer: 'ok ok' });
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

test('.checkCommit should commit.footer be null when not given', (t) => {
  const header = { type: 'feat', scope: 'zazzy', subject: 'okey dude' };
  const commit = { header };
  const result = checkCommit(commit);
  t.deepStrictEqual(result, { header, body: null, footer: null });
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

test('should checkCommit allow empty string body', (t) => {
  const header = { type: 'feat', scope: 'zazzy', subject: 'okey dude' };
  const commit = { header, body: '' };
  const result = checkCommit(commit);

  t.strictEqual(result.body, '');
});
