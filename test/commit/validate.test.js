import test from 'asia';
import { validateCommit } from '../../src/commit';

test('.validateCommit should return boolean when second param `ret` is not given', (t) => {
  const header = { type: 'fix', subject: 'bar qux' };
  const boolTrue = validateCommit({
    header,
    body: 'foo',
  });
  const boolFalse = validateCommit({ header, body: 111, footer: 'sasa' });

  t.strictEqual(boolTrue, true);
  t.strictEqual(boolFalse, false);
});

test('.validateCommit should return { error, value } object when `ret` is true', (t) => {
  const header = { type: 'major', scope: 'qux', subject: 'some awful change' };
  const result = validateCommit({ header, body: 'okkk' }, true);

  t.deepStrictEqual(result, {
    value: { header, body: 'okkk', footer: null },
  });

  const res2 = validateCommit({ header: { foo: 1 }, body: 'a' }, true);
  t.ok(res2.error);
  t.ok(res2.error instanceof Error);
  t.ok(!res2.value);
});
