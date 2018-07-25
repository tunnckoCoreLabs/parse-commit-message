# {%= name %} [![npm version][npmv-img]][npmv-url] [![github release][ghrelease-img]][ghrelease-url] [![License][license-img]][license-url]

<!-- When logo is needed
<p align="center">
  <a href="https://github.com/username/repo">
    <img src="./logo.png">
  </a>
</p>
<br>
-->

> {%= description %}

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


## Table of Contents
<!-- toc -->

## Install
This project requires [**Node.js**](https://nodejs.org) **{%= engines.node %}**. Install it using [**yarn**](https://yarnpkg.com) or [**npm**](https://npmjs.com).  
_We highly recommend to use Yarn when you think to contribute to this project._

```bash
$ yarn add {%= name %}
```

## API
{%= apidocs('src/index.js') %}

**[back to top](#thetop)**

{% if (verb.related && verb.related.list && verb.related.list.length) { %}

## Related Projects
Some of these projects are used here or were inspiration for this one, others are just related. So, thanks for your existance!
{%= related(verb.related.list, { words: 11 }) %}

**[back to top](#thetop)**
{% } %}

## Contributing
Please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents for advices.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping [@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

## Contributors
Thanks to the hard work of [these wonderful people](./CONTRIBUTORS.md) this project is alive and it also follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.  
[Pull requests](https://github.com/tunnckoCore/contributing#opening-a-pull-request), stars and all kind of [contributions](https://opensource.guide/how-to-contribute/#what-it-means-to-contribute) are always welcome. :stars:

## Users
You can see who uses `{%= name %}` in the [USERS.md](./USERS.md) file. Please feel free adding this file if it not exists.  
If you or your organization are using this project, consider adding yourself to the list of users.  
**Thank You!** :heart:

## License
Copyright (c) {%= licenseStart %}-present, [Charlike Mike Reagent][author-link] `<olsten.larck@gmail.com>`.  
Released under the [{%= license %} License][license-url].

---

{%= include('footer') %}

<!-- Heading badges -->
[npmv-url]: https://www.npmjs.com/package/{%= name %}
[npmv-img]: https://badgen.net/npm/v/{%= name %}?label=npm%20version

[ghrelease-url]: https://github.com/{%= repository %}/releases/latest
[ghrelease-img]: https://badgen.net/github/release/{%= repository %}?label=github%20release

[license-url]: https://github.com/{%= repository %}/blob/master/LICENSE
[license-img]: https://badgen.net/npm/license/{%= name %}

<!-- Front line badges -->

[codestyle-url]: https://github.com/olstenlarck/xaxa
[codestyle-img]: https://badgen.net/badge/code%20style/xaxa/green

[linuxbuild-url]: https://circleci.com/gh/{%= repository %}/tree/master
[linuxbuild-img]: https://badgen.net/circleci/github/{%= repository %}/master

[codecoverage-url]: https://codecov.io/gh/{%= repository %}
[codecoverage-img]: https://codecov.io/gh/{%= repository %}/branch/master/graph/badge.svg

[dependencies-url]: https://david-dm.org/{%= repository %}
[dependencies-img]: https://badgen.net/david/dep/{%= repository %}

[ccommits-url]: https://conventionalcommits.org/
[ccommits-img]: https://badgen.net/badge/conventional%20commits/v1.0.0/dfb317

[new-release-url]: https://github.com/tunnckoCore/new-release
[new-release-img]: https://badgen.net/badge/semantically/released/05c5ff

[downloads-weekly-img]: https://badgen.net/npm/dw/{%= name %}
[downloads-monthly-img]: https://badgen.net/npm/dm/{%= name %}
[downloads-total-img]: https://badgen.net/npm/dt/{%= name %}

[renovateapp-url]: https://renovatebot.com
[renovateapp-img]: https://badgen.net/badge/renovate/enabled/green

[prs-welcome-img]: https://badgen.net/badge/PRs/welcome/green
[prs-welcome-url]: http://makeapullrequest.com

[paypal-donate-url]: https://paypal.me/tunnckoCore/10
[paypal-donate-img]: https://badgen.net/badge/$/support/purple

[shareu]: https://twitter.com/intent/tweet?text=https://github.com/{%= repository %}&via=tunnckoCore
[shareb]: https://badgen.net/badge/twitter/share/1da1f2
[open-issue-url]: https://github.com/{%= repository %}/issues/new
[author-link]: https://i.am.charlike.online
