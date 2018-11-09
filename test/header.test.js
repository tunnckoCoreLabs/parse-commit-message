import test from 'asia';
import {
  parseHeader,
  stringifyHeader,
  validateHeader,
  checkHeader,
} from '../src/header';

test('header: basic', (t) => {
  t.strictEqual(typeof parseHeader, 'function');
  t.strictEqual(typeof stringifyHeader, 'function');
  t.strictEqual(typeof validateHeader, 'function');
  t.strictEqual(typeof checkHeader, 'function');

  const result = checkHeader({
    type: 'fix',
    subject: 'bar qux',
  });

  t.deepStrictEqual(result, { type: 'fix', scope: '', subject: 'bar qux' });
});
