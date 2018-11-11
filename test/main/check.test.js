import test from 'asia';
import { check } from '../../src/main';

test('should check(string) be able to accept a string and return an array of object items', (t) => {
  const res = check('fix: bar qux');

  t.strictEqual(Array.isArray(res), true);
  t.strictEqual(res.length, 1);
  t.strictEqual(typeof res[0], 'object');
  t.deepStrictEqual(res[0], {
    header: {
      type: 'fix',
      scope: null,
      subject: 'bar qux',
    },
    body: null,
    footer: null,
  });
});

test('should check(string) support flat=true', (t) => {
  const res = check('fix: bar', true);
  t.strictEqual(Array.isArray(res), false);
  t.strictEqual(typeof res, 'object');
});

test('should check(object|array) return array even with flat=true, if more than 1 commits', (t) => {
  const commits = [
    'feat(ci): tweaks bar\n\nAwesome body',
    { header: { type: 'refactor', subject: 'woo hoo' } },
  ];
  const res = check(commits, true);
  t.strictEqual(Array.isArray(res), true);

  const [one, two] = res;

  t.deepStrictEqual(one, {
    header: { type: 'feat', scope: 'ci', subject: 'tweaks bar' },
    body: 'Awesome body',
    footer: null,
  });
  t.deepStrictEqual(two, {
    header: { type: 'refactor', scope: null, subject: 'woo hoo' },
    body: null,
    footer: null,
  });
});
