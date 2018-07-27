/**
 * @copyright 2017-present, Charlike Mike Reagent (https://i.am.charlike.online)
 * @license Apache-2.0
 */

import test from 'asia';
import { parse, plugins, mappers } from '../src/index';

test('should be okey with multiline body and without scope', (t) => {
  const msg = `feat: foo bar baz

Some multiline body
Alleluah

So there is some updated things
fixes #34
resolves #225
`;

  const commit = parse(msg);
  // => {
  //   header: {
  //     type: 'feat',
  //     scope: undefined,
  //     subject: 'foo bar baz',
  //     toString: [Function: toString],
  //   },
  //   body: 'Some multiline body\nAlleluah',
  //   footer: 'So there is some updated things\nfixes #34\nresolves #225\n',
  //   increment: 'minor',
  //   isBreaking: false,
  // }

  t.strictEqual(typeof commit, 'object');
  t.ok(commit.mentions);
  t.strictEqual(commit.increment, 'minor');
  t.strictEqual(commit.isBreaking, false);
  t.strictEqual(commit.header.type, 'feat');
  t.ok(!commit.header.scope, 'commit.header.scope should be falsey');
  t.strictEqual(commit.header.subject, 'foo bar baz');
  t.strictEqual(typeof commit.header.toString, 'function');
  t.strictEqual(commit.header.toString(), 'feat: foo bar baz');
  t.strictEqual(commit.body, 'Some multiline body\nAlleluah');
  t.strictEqual(
    commit.footer,
    'So there is some updated things\nfixes #34\nresolves #225',
  );
});

test('should have empty body but contain footer', (t) => {
  const msg = `fix: some non-breaking update

Only footer
fixes #33
`;
  const commit = parse(msg, mappers.increment);
  t.ok(!commit.body, 'should have falsey value `body` property');
  t.ok(!commit.header.scope, 'commit.header.scope should be falsey');
  t.strictEqual(commit.footer, 'Only footer\nfixes #33');
  t.strictEqual(commit.increment, 'patch');
  t.strictEqual(commit.header.toString(), 'fix: some non-breaking update');
});

test('should have empty body and footer but scope', (t) => {
  const str = 'break(critical): some breaking with no body';
  const commit = parse(str, mappers.increment);

  t.ok(!commit.body, 'should have falsey value `body` property');
  t.ok(!commit.footer, 'commit.footer should be falsey');
  t.strictEqual(commit.isBreaking, true);
  t.strictEqual(commit.increment, 'major');
  t.strictEqual(commit.header.scope, 'critical');
  t.strictEqual(commit.header.toString(), str);
});

test('should support and collect all mentions from anywehere', (t) => {
  const msg = `feat(crit): thanks to @foobar for this release

Also to @barby!

thanks to @hix!
resolves #123
`;

  const commit = parse(msg, plugins);

  t.strictEqual(Array.isArray(commit.mentions), true);

  // strong type sometimes sucks?
  const mentions = commit.mentions || [];

  t.strictEqual(mentions.length, 3);
  t.strictEqual(mentions[0].handle, '@foobar');
  t.strictEqual(mentions[0].mention, 'foobar');
  t.strictEqual(mentions[1].handle, '@barby');
  t.strictEqual(mentions[1].mention, 'barby');
  t.strictEqual(mentions[2].handle, '@hix');
  t.strictEqual(mentions[2].mention, 'hix');

  t.strictEqual(commit.header.scope, 'crit');
  t.strictEqual(commit.increment, 'minor');
});

test('should .parse throw if no string as first argument', (t) => {
  t.throws(() => {
    // @ts-ignore
    parse(123);
  }, /expect `commitMessage` to be string/);
});

test('should .parse throw for invalid commit convention message', (t) => {
  t.throws(() => parse('foo bar baz'), /invalid commit message/);
});

test('do not treat BREAKING CHANGE as major when not at the beginning', (t) => {
  const commitMessage = 'fix(abc): foo bar BREAKING CHANGE here is not valid';
  const commit = parse(commitMessage, mappers.increment);

  t.strictEqual(commit.header.type, 'fix');
  t.strictEqual(commit.header.scope, 'abc');
  t.strictEqual(
    commit.header.subject,
    'foo bar BREAKING CHANGE here is not valid',
  );
  t.strictEqual(commit.increment, 'patch');
});

test('treat `BREAKINGs+CHANGE:s+` as major even if type is `fix`', (t) => {
  const msg = `fix: huge bug is resolved

BREAKING CHANGE: really big refactor

resolves #2137
`;

  const commit = parse(msg, mappers.increment);

  t.strictEqual(commit.isBreaking, true);
  t.strictEqual(commit.increment, 'major');
  t.strictEqual(commit.body, 'BREAKING CHANGE: really big refactor');
  t.strictEqual(commit.footer, 'resolves #2137');
  t.strictEqual(commit.header.type, 'fix');
  t.strictEqual(commit.header.toString(), 'fix: huge bug is resolved');
});
