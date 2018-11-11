import test from 'asia';
import { validate } from '../../src/main';

test('.validate should return boolean when second param `ret` is not given', (t) => {
  const header = { type: 'fix', subject: 'bar qux' };
  const boolTrue = validate({
    header,
    body: 'foo',
  });
  const boolFalse = validate({ header, body: 111, footer: 'sasa' });

  t.strictEqual(boolTrue, true);
  t.strictEqual(boolFalse, false);
});

test('.validate should return { error, value } objects when `ret` is true', (t) => {
  const header = { type: 'major', scope: 'qux', subject: 'some awful change' };
  const result = validate({ header, body: 'okkk' }, true);

  t.deepStrictEqual(result.value, [{ header, body: 'okkk', footer: null }]);

  const res2 = validate({ header: { foo: 1 }, body: 'a' }, true);
  t.ok(res2.error);
  t.ok(res2.error instanceof Error);
  t.ok(!res2.value);
});

test('should validate() similar to check() be able to accept array of mixed values', (t) => {
  const commits = [
    'fix: abr\n\nquxx qq',
    { header: { type: 'qq', subject: 'ok ok' } },
  ];
  const { value } = validate(commits, true);

  t.deepStrictEqual(value, [
    {
      header: { type: 'fix', scope: null, subject: 'abr' },
      body: 'quxx qq',
      footer: null,
    },
    {
      header: { type: 'qq', scope: null, subject: 'ok ok' },
      body: null,
      footer: null,
    },
  ]);
});
