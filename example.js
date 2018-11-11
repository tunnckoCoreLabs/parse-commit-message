import dedent from 'dedent';
import { applyPlugins, plugins, parse, check } from './src';

const commits = [
  'fix: bar qux',
  dedent`feat(foo): yea yea

   Awesome body here with @some mentions
   resolves #123

   BREAKING CHANGE: ouch!`,
  'chore(ci): updates for ci config',
  {
    header: { type: 'fix', subject: 'Barry White' },
    body: 'okey dude',
    foo: 'possible',
  },
];

const results = applyPlugins(plugins, check(parse(commits)));

console.log(results);
// => [ { body: null,
//   footer: null,
//   header: { scope: null, type: 'fix', subject: 'bar qux' },
//   mentions: [],
//   increment: 'patch',
//   isBreaking: false },
// { body: 'Awesome body here with @some mentions\nresolves #123',
//   footer: 'BREAKING CHANGE: ouch!',
//   header: { scope: 'foo', type: 'feat', subject: 'yea yea' },
//   mentions: [ [Object] ],
//   increment: 'major',
//   isBreaking: true },
// { body: null,
//   footer: null,
//   header:
//    { scope: 'ci', type: 'chore', subject: 'updates for ci config' },
//   mentions: [],
//   increment: false,
//   isBreaking: false },
// { body: 'okey dude',
//   footer: null,
//   header: { scope: null, type: 'fix', subject: 'Barry White' },
//   foo: 'possible',
//   mentions: [],
//   increment: 'patch',
//   isBreaking: false } ]
