# parse-commit-message [![npm version][npmv-img]][npmv-url] [![github release][ghrelease-img]][ghrelease-url] [![License][license-img]][license-url]

<!-- When logo is needed
<p align="center">
  <a href="https://github.com/username/repo">
    <img src="./logo.png">
  </a>
</p>
<br>
-->

> An extensible parser for commit message that follows Conventional Commits v1 spec

<div id="thetop"></div>

[![XAXA code style][codestyle-img]][codestyle-url]
[![CircleCI linux build][linuxbuild-img]][linuxbuild-url]
[![CodeCov coverage status][codecoverage-img]][codecoverage-url]
[![DavidDM dependency status][dependencies-img]][dependencies-url]
[![Renovate App Status][renovateapp-img]][renovateapp-url]
[![Make A Pull Request][prs-welcome-img]][prs-welcome-url]
[![Semantically Released][new-release-img]][new-release-url]

If you have any _how-to_ kind of questions, please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping [@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

[![Conventional Commits][ccommits-img]][ccommits-url]
[![PayPal Author Support][paypal-donate-img]][paypal-donate-url]
[![Share Love Tweet][shareb]][shareu]
[![NPM Downloads Weekly][downloads-weekly-img]][npmv-url]
[![NPM Downloads Monthly][downloads-monthly-img]][npmv-url]
[![NPM Downloads Total][downloads-total-img]][npmv-url]

Project is [semantically](https://semver.org) & automatically released on [CircleCI][codecoverage-url] with [new-release][] and its [New Release](https://github.com/apps/new-release) GitHub App.

## Highlights

- [Conventional Commits](https://conventionalcommits.org/) compliant
- Fast and lightweight in few lines of code
- Infinitely extensible through plugins, [two built-in](#mappers)
- Collecting mentions from commit message
- Detection of breaking changes in commit

## Table of Contents
- [Install](#install)
- [API](#api)
  * [.parse](#parse)
  * [.mappers](#mappers)
  * [.plugins](#plugins)
- [Related Projects](#related-projects)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Users](#users)
- [License](#license)

## Install
This project requires [**Node.js**](https://nodejs.org) **^6.9.0 || ^8.9.0 || ^10.6.0**. Install it using [**yarn**](https://yarnpkg.com) or [**npm**](https://npmjs.com).  
_We highly recommend to use Yarn when you think to contribute to this project._

```bash
$ yarn add parse-commit-message
```

## API

### [.parse](src/index.js#L72)
Parses given `commitMessage` to an object which can be populated with more things if needed, through `plugins`.

Plugins are functions like `(commit) => {}` and can return object with additional
properties that will be included in the returned "commit" object.
There are two built-in plugins - `increment` and `mentions` which are exposed
as array at exposed `plugins` named export.
The `commit.header` has also a `toString()` method concatinates
the `header.scope`, `header.type` and `header.subject` properties.

**Params**

* `commitMessage` **{string}**: required, a whole commit message    
* `plugins` **{Array}**: optional, a list of functions that are passed with `commit` object    
* `returns` **{Object}**: with `{ header: { type, scope, subject }, body, footer }`  

**Example**

```js
import { parse } from 'parse-commit-message';

const commit = parse(`fix(crit): some huge change

Some awesome
body here.

resolves #333
`);

console.log(commit)
// => {
//   header: {
//     type: 'fix',
//     scope: 'crit',
//     subject: 'some huge change'
//     toString: [Function: toString],
//   },
//   body: 'Some awesome\nbody here.',
//   footer: 'resolves #333',
// }

console.log(commit.header.toString())
// => 'fix(crit): some huge change'

// or adding one more plugin to the builtin ones
const customPlugin = (commit) => {
  if (commit.header.type === 'fix') {
    return { fixed: 'yeah' };
  }
  return null;
};
const commit = parse('fix(wat): foo bar baz', plugins.concat(customPlugin));

console.log(commit.isBreaking) // => false
console.log(commit.increment) // => 'patch'
console.log(commit.header); // => { type: 'fix', subject: 'wat', subject: 'foo bar baz' }
console.log(commit.fixed); // => 'yeah'
```

### [.mappers](src/index.js#L228)
An object with all mappers, such as `plugins` array, but named. This objects is like `{ increment, mentions }` where they are plugins that can be passed as second argument to `.parse`.

1. The `mappers.increment` adds `isBreaking` and `increment` properties
to the final returned "commit" object:
- `isBreaking` is `Boolean` that indicates if commit is containing `BREAKING CHANGE: ` or
the `type` of the commit is `break`, `breaking` or `major`
- `increment` is a `String` that can be `'patch'`, `'minor'` or `'major'`
2. The `mappers.mentions` adds `mentions` property to the end result object
- `mentions` is an array of objects like `{ handle: String, mention: String, index: Number }`,
see [collect-mentions][]

**Example**

```js
import { parse, mappers } from 'parse-commit-message';

const commit = parse('fix: BREAKING CHANGE: huge refactor', mappers.increment);

console.log(commit);
// => {
//   header: { type: 'fix', scope: undefined, subject: 'BREAKING CHANGE: huge refactor' },
//   body: null,
//   footer: null,
//   isBreaking: true,
//   increment: 'major'
// }

const str = `feat(whoa): thanks to @foobie for this

awesome @zazzy and @quxie make this release to happen

resolves #123
`
const cmt = parse(str, mappers.mentions);

console.log(cmt.header.type); // => 'feat'
console.log(cmt.header.scope); // => 'whoa'
console.log(cmt.header.subject); // => 'hanks to @foobie for this'
console.log(cmt.body); // => 'awesome @zazzy and @quxie make this release to happen'
console.log(cmt.footer); // => 'resolves #123'
console.log(cmt.mentions[0]); // => { handle: '@foobie', mention: 'foobie' }
console.log(cmt.mentions[1]); // => { handle: '@zazzy', mention: 'zazzy' }
console.log(cmt.mentions[2]); // => { handle: '@quxie', mention: 'quxie' }
```

### [.plugins](src/index.js#L250)
A list of all plugins, such as `mappers` but no names, so can be passed directly to the `.parse` as second argument.

**Example**

```js
import { parse, plugins } from 'parse-commit-message';

const commit = parse('fix: okey', plugins)
console.log(commit)
```

**[back to top](#thetop)**

## Related Projects
Some of these projects are used here or were inspiration for this one, others are just related. So, thanks for your existance!
- [asia](https://www.npmjs.com/package/asia): Blazingly fast, magical and minimalist testing framework, for Today and Tomorrow | [homepage](https://github.com/olstenlarck/asia#readme "Blazingly fast, magical and minimalist testing framework, for Today and Tomorrow")
- [charlike](https://www.npmjs.com/package/charlike): Small, fast, simple and streaming project scaffolder for myself, but not… [more](https://github.com/tunnckoCore/charlike) | [homepage](https://github.com/tunnckoCore/charlike "Small, fast, simple and streaming project scaffolder for myself, but not only. Supports hundreds of template engines through the @JSTransformers API or if you want custom `render` function passed through options")
- [collect-mentions](https://www.npmjs.com/package/collect-mentions): Collect mentions from a given text string, using battle-tested `mentions-regex` package | [homepage](https://github.com/olstenlarck/collect-mentions "Collect mentions from a given text string, using battle-tested `mentions-regex` package")
- [gitcommit](https://www.npmjs.com/package/gitcommit): Lightweight and joyful `git commit` replacement. Conventional Commits compliant. | [homepage](https://github.com/tunnckoCore/gitcommit "Lightweight and joyful `git commit` replacement. Conventional Commits compliant.")
- [new-release](https://www.npmjs.com/package/new-release): A stable alternative to [semantic-release][]. Only handles NPM publishing and nothing… [more](https://github.com/tunnckoCore/new-release#readme) | [homepage](https://github.com/tunnckoCore/new-release#readme "A stable alternative to [semantic-release][]. Only handles NPM publishing and nothing more. For creating GitHub releases use the Semantic Release GitHub App")
- [xaxa](https://www.npmjs.com/package/xaxa): Zero-config linting, powered by few amazing unicorns, AirBnB & Prettier. | [homepage](https://github.com/olstenlarck/xaxa "Zero-config linting, powered by few amazing unicorns, AirBnB & Prettier.")

**[back to top](#thetop)**

## Contributing
Please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents for advices.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping [@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

## Contributors
Thanks to the hard work of [these wonderful people](./CONTRIBUTORS.md) this project is alive and it also follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.  
[Pull requests](https://github.com/tunnckoCore/contributing#opening-a-pull-request), stars and all kind of [contributions](https://opensource.guide/how-to-contribute/#what-it-means-to-contribute) are always welcome. :stars:

## Users
You can see who uses `parse-commit-message` in the [USERS.md](./USERS.md) file. Please feel free adding this file if it not exists.  
If you or your organization are using this project, consider adding yourself to the list of users.  
**Thank You!** :heart:

## License
Copyright (c) 2017-present, [Charlike Mike Reagent][author-link] `<olsten.larck@gmail.com>`.  
Released under the [Apache-2.0 License][license-url].

---

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.7.0, on July 25, 2018._

<!-- Heading badges -->
[npmv-url]: https://www.npmjs.com/package/parse-commit-message
[npmv-img]: https://badgen.net/npm/v/parse-commit-message?label=npm%20version

[ghrelease-url]: https://github.com/tunnckoCore/parse-commit-message/releases/latest
[ghrelease-img]: https://badgen.net/github/release/tunnckoCore/parse-commit-message?label=github%20release

[license-url]: https://github.com/tunnckoCore/parse-commit-message/blob/master/LICENSE
[license-img]: https://badgen.net/npm/license/parse-commit-message

<!-- Front line badges -->

[codestyle-url]: https://github.com/tunnckoCore/xaxa
[codestyle-img]: https://badgen.net/badge/code%20style/xaxa/green

[linuxbuild-url]: https://circleci.com/gh/tunnckoCore/parse-commit-message/tree/master
[linuxbuild-img]: https://badgen.net/circleci/github/tunnckoCore/parse-commit-message/master

[codecoverage-url]: https://codecov.io/gh/tunnckoCore/parse-commit-message
[codecoverage-img]: https://badgen.net/codecov/c/github/tunnckoCore/parse-commit-message

[dependencies-url]: https://david-dm.org/tunnckoCore/parse-commit-message
[dependencies-img]: https://badgen.net/david/dep/tunnckoCore/parse-commit-message

[ccommits-url]: https://conventionalcommits.org/
[ccommits-img]: https://badgen.net/badge/conventional%20commits/v1.0.0/dfb317

[new-release-url]: https://github.com/tunnckoCore/new-release
[new-release-img]: https://badgen.net/badge/semantically/released/05c5ff

[downloads-weekly-img]: https://badgen.net/npm/dw/parse-commit-message
[downloads-monthly-img]: https://badgen.net/npm/dm/parse-commit-message
[downloads-total-img]: https://badgen.net/npm/dt/parse-commit-message

[renovateapp-url]: https://renovatebot.com
[renovateapp-img]: https://badgen.net/badge/renovate/enabled/green

[prs-welcome-img]: https://badgen.net/badge/PRs/welcome/green
[prs-welcome-url]: http://makeapullrequest.com

[paypal-donate-url]: https://paypal.me/tunnckoCore/10
[paypal-donate-img]: https://badgen.net/badge/$/support/purple

[shareu]: https://twitter.com/intent/tweet?text=https://github.com/olstenlarck/parse-commit-message&via=tunnckoCore
[shareb]: https://badgen.net/badge/twitter/share/1da1f2
[open-issue-url]: https://github.com/olstenlarck/parse-commit-message/issues/new
[author-link]: https://i.am.charlike.online

[collect-mentions]: https://github.com/olstenlarck/collect-mentions
[new-release]: https://github.com/tunnckoCore/new-release
[semantic-release]: https://github.com/semantic-release/semantic-release
