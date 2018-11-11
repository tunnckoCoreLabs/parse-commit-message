import test from 'asia';
import { stringifyHeader } from '../../src/header';

test('.stringifyHeader throw if invalid header is given', (t) => {
  t.throws(() => stringifyHeader(1234), TypeError);
  t.throws(() => stringifyHeader({ type: 'foo' }), TypeError);
  t.throws(() => stringifyHeader(), /expect `header` to be an object/);
});

test('.stringifyHeader object', (t) => {
  const header = { type: 'fix', scope: 'huh', subject: 'yeah yeah' };
  const result = stringifyHeader(header);

  t.strictEqual(result, 'fix(huh): yeah yeah');
});

test('.stringifyHeader object without scope', (t) => {
  const header = { type: 'fix', subject: 'yeah yeah' };
  const result = stringifyHeader(header);

  t.strictEqual(result, 'fix: yeah yeah');
});
