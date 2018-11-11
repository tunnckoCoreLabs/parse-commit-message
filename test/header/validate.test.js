import test from 'asia';
import { validateHeader } from '../../src/header';

test('.validateHeader should return boolean when second param `ret` is not given', (t) => {
  const boolTrue = validateHeader({ type: 'fix', subject: 'bar qux' });
  const boolFalse = validateHeader({ type: 'fix' });

  t.strictEqual(boolTrue, true);
  t.strictEqual(boolFalse, false);
});

test('.validateHeader should return { error, value } object when `ret` is true', (t) => {
  const result = validateHeader({ type: 'fix', subject: 'bar qux' }, true);

  t.deepStrictEqual(result, {
    value: { type: 'fix', scope: null, subject: 'bar qux' },
  });

  const res2 = validateHeader({ type: 'fix' }, true);
  t.ok(res2.error);
  t.ok(res2.error instanceof Error);
  t.ok(!res2.value);
});
