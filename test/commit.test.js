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
});
