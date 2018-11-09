import test from 'asia';
import { applyPlugins, plugins, mappers } from '../src';

test('main: basic', (t) => {
  t.strictEqual(typeof applyPlugins, 'function');
  t.strictEqual(typeof mappers, 'object');
  t.strictEqual(typeof mappers.mentions, 'function');
  t.strictEqual(typeof mappers.increment, 'function');
  t.strictEqual(Array.isArray(plugins), true);
  t.strictEqual(plugins.length, 2);
});
