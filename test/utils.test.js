import test from 'asia';
import { tryCatch, isOptional, isRequired, errorMsg } from '../src/utils';

test('plugins:increment: basic', (t) => {
  t.strictEqual(typeof tryCatch, 'function');
  t.strictEqual(typeof isOptional, 'object');
  t.strictEqual(isOptional.isJoi, true);
  t.strictEqual(typeof isRequired, 'object');
  t.strictEqual(isRequired.isJoi, true);
  t.strictEqual(typeof errorMsg, 'string');
});
