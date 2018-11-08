import test from 'asia';
import increment from '../../src/plugins/increment';

test('plugins:increment: basic', (t) => {
  t.strictEqual(typeof increment, 'function');
});
