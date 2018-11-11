import test from 'asia';
import dedent from 'dedent';
import { stringifyCommit } from '../../src/commit';

test('.stringifyCommit throw if invalid header is given', (t) => {
  t.throws(() => stringifyCommit(1234), TypeError);
  t.throws(() => stringifyCommit({ header: { type: 'foo' } }), TypeError);
  t.throws(() => stringifyCommit(), /expect `commit` to be an object/);
});

test('.stringifyCommit object', (t) => {
  const header = { type: 'fix', scope: 'huh', subject: 'yeah yeah' };
  const result = stringifyCommit({ header });

  t.strictEqual(result, 'fix(huh): yeah yeah');

  const cmt = {
    header,
    body: 'resolves #1\nfixes #3',
    footer: 'BREAKING CHANGE: yeah!',
  };
  const commitMessage = dedent`${result}

  resolves #1
  fixes #3

  BREAKING CHANGE: yeah!`;

  t.strictEqual(stringifyCommit(cmt), commitMessage);
});

test('.stringifyCommit object without scope', (t) => {
  const header = {
    header: { type: 'fix', subject: 'yeah yeah' },
    body: 'woo hoo',
  };
  const result = stringifyCommit(header);

  t.strictEqual(result, 'fix: yeah yeah\n\nwoo hoo');
});
