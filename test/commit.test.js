import test from 'asia';
import {
  parseCommit,
  stringifyCommit,
  validateCommit,
  checkCommit,
} from '../src/commit';

test('commit: basic', (t) => {
  t.strictEqual(typeof parseCommit, 'function');
  t.strictEqual(typeof stringifyCommit, 'function');
  t.strictEqual(typeof validateCommit, 'function');
  t.strictEqual(typeof checkCommit, 'function');

  const res = checkCommit({
    header: { type: 'fix', subject: 'bar qux' },
    body: 'foo bar baz',
  });

  t.deepStrictEqual(res.header, { type: 'fix', scope: '', subject: 'bar qux' });
  t.strictEqual(res.body, 'foo bar baz');
  t.strictEqual(res.footer, '');
});
