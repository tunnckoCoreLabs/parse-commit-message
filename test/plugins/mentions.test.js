import test from 'asia';
import mentions from '../../src/plugins/mentions';

test('plugins:mentions: basic', (t) => {
  t.strictEqual(typeof mentions, 'function');
});
