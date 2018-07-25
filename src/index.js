/**
 * @copyright 2017-present, Charlike Mike Reagent (https://i.am.charlike.online)
 * @license Apache-2.0
 */

import arrayify from 'arrayify';
import collectMentions from 'collect-mentions';

/**
 * Parses given `commitMessage` to an object which can be populated with
 * more things if needed, through `plugins`.
 *
 * Plugins are functions like `(commit) => {}` and can return object with additional
 * properties that will be included in the returned "commit" object.
 *
 * There are two built-in plugins - `increment` and `mentions` which are exposed
 * as array at exposed `plugins` named export.
 *
 * The `commit.header` has also a `toString()` method concatinates
 * the `header.scope`, `header.type` and `header.subject` properties.
 *
 * **Example**
 *
 * ```js
 * import { parse } from 'parse-commit-message';
 *
 * const commit = parse(`fix(crit): some huge change
 *
 * Some awesome
 * body here.
 *
 * resolves #333
 * `);
 *
 * console.log(commit)
 * // => {
 * //   header: {
 * //     type: 'fix',
 * //     scope: 'crit',
 * //     subject: 'some huge change'
 * //     toString: [Function: toString],
 * //   },
 * //   body: 'Some awesome\nbody here.',
 * //   footer: 'resolves #333',
 * // }
 *
 * console.log(commit.header.toString())
 * // => 'fix(crit): some huge change'
 *
 * // or adding one more plugin to the builtin ones
 * const customPlugin = (commit) => {
 *   if (commit.header.type === 'fix') {
 *     return { fixed: 'yeah' };
 *   }
 *   return null;
 * };
 * const commit = parse('fix(wat): foo bar baz', plugins.concat(customPlugin));
 *
 * console.log(commit.isBreaking) // => false
 * console.log(commit.increment) // => 'patch'
 * console.log(commit.header); // => { type: 'fix', subject: 'wat', subject: 'foo bar baz' }
 * console.log(commit.fixed); // => 'yeah'
 * ```
 *
 * @name  .parse
 * @param {string} `commitMessage` required, a whole commit message
 * @param {Array} `plugins` optional, a list of functions that are passed with `commit` object
 * @return {Object} with `{ header: { type, scope, subject }, body, footer }`
 * @api public
 */

function parse(commitMessage, plugins) {
  if (typeof commitMessage !== 'string') {
    throw new TypeError(
      'parseCommitMessage.parse: expect `commitMessage` to be string',
    );
  }

  const elements = commitMessage.split(/\r?\n\r?\n/);
  const header = elements[0];
  const body = elements.length > 2 ? elements[1] : null;
  const footer = elements.length > 2 ? elements[2] : elements[1];

  // eslint-disable-next-line unicorn/no-unsafe-regex
  const parts = /^(\w+)(?:\((.+)\))?: (.+)$/.exec(header);

  if (!parts) {
    throw new Error(
      'invalid commit message: <type>[optional scope]: <description>',
    );
  }

  const [type, scope, subject] = parts.slice(1);

  const commit = {
    header: {
      type,
      scope,
      subject,
      toString() {
        return header;
      },
    },
    body: (body && body.trim()) || null,
    footer: (footer && footer.trim()) || null,
  };

  return arrayify(plugins).reduce((acc, fn) => {
    const result = fn(Object.assign({}, acc));

    return Object.assign({}, acc, result);
  }, commit);
}

/**
 * Mappers (plugins) for the `parseCommitMessage` function,
 * they get a `commit` object and should return an object.
 * It isn't needed to return the whole coming `commit` object, because
 * the return of plugins is merged with it automatically in any way.
 */

/**
 *
 * @param {Object} commit, the commit object coming from `parseCommitMessage`
 */
function incrementMapper(commit) {
  let isBreaking = isBreakingChange(commit);
  let increment = null;

  if (/fix|bugfix|patch/.test(commit.header.type)) {
    increment = 'patch';
  }
  if (/feat|feature|minor/.test(commit.header.type)) {
    increment = 'minor';
  }
  if (/break|breaking|major/.test(commit.header.type) || isBreaking) {
    increment = 'major';
  }
  isBreaking = isBreaking || increment === 'major';

  return { increment, isBreaking };
}

/* eslint-disable no-param-reassign */

/**
 *
 * @param {Object} commit, the commit object coming from `parseCommitMessage`
 */
function isBreakingChange({ header, body, footer }) {
  body = body || '';
  footer = footer || '';

  const re = /^BREAKING\s+CHANGES?:\s+/;
  return re.test(header.subject) || re.test(body) || re.test(footer);
}

/**
 * > Collects all mentions for `subject`, `body` and `footer`
 * places of the commit message, into one single array of "mention" objects
 * like `{ mention, handle }`, see [collect-mentions][] package.
 *
 * @param   {Object} commit, the commit object coming from `parseCommitMessage`
 * @returns {Object} with a `mentions` array property
 */
function mentionsMapper({ header, body, footer }) {
  const mentions = []
    .concat(collectMentions(header.subject))
    .concat(collectMentions(body))
    .concat(collectMentions(footer));

  return mentions.length > 0 ? { mentions } : null;
}

/**
 * An object with all mappers, such as `plugins` array, but named.
 * This objects is like `{ increment, mentions }` where they are plugins
 * that can be passed as second argument to `.parse`.
 *
 * 1. The `mappers.increment` adds `isBreaking` and `increment` properties
 * to the final returned "commit" object:
 * - `isBreaking` is `Boolean` that indicates if commit is containing `BREAKING CHANGE: ` or
 * the `type` of the commit is `break`, `breaking` or `major`
 * - `increment` is a `String` that can be `'patch'`, `'minor'` or `'major'`
 *
 * 2. The `mappers.mentions` adds `mentions` property to the end result object
 * - `mentions` is an array of objects like `{ handle: String, mention: String, index: Number }`,
 * see [collect-mentions][]
 *
 * **Example**
 *
 * ```js
 * import { parse, mappers } from 'parse-commit-message';
 *
 * const commit = parse('fix: BREAKING CHANGE: huge refactor', mappers.increment);
 *
 * console.log(commit);
 * // => {
 * //   header: { type: 'fix', scope: undefined, subject: 'BREAKING CHANGE: huge refactor' },
 * //   body: null,
 * //   footer: null,
 * //   isBreaking: true,
 * //   increment: 'major'
 * // }
 *
 * const str = `feat(whoa): thanks to @foobie for this
 *
 * awesome @zazzy and @quxie make this release to happen
 *
 * resolves #123
 * `
 * const cmt = parse(str, mappers.mentions);
 *
 * console.log(cmt.header.type); // => 'feat'
 * console.log(cmt.header.scope); // => 'whoa'
 * console.log(cmt.header.subject); // => 'hanks to @foobie for this'
 * console.log(cmt.body); // => 'awesome @zazzy and @quxie make this release to happen'
 * console.log(cmt.footer); // => 'resolves #123'
 * console.log(cmt.mentions[0]); // => { handle: '@foobie', mention: 'foobie' }
 * console.log(cmt.mentions[1]); // => { handle: '@zazzy', mention: 'zazzy' }
 * console.log(cmt.mentions[2]); // => { handle: '@quxie', mention: 'quxie' }
 * ```
 *
 * @name .mappers
 * @api public
 */

const mappers = {
  increment: incrementMapper,
  mentions: mentionsMapper,
};

/**
 * A list of all plugins, such as `mappers` but no names,
 * so can be passed directly to the `.parse` as second argument.
 *
 * **Example**
 *
 * ```js
 * import { parse, plugins } from 'parse-commit-message';
 *
 * const commit = parse('fix: okey', plugins)
 * console.log(commit)
 * ```
 *
 * @name .plugins
 * @api public
 */

const plugins = Object.keys(mappers).map((name) => mappers[name]);

/**
 * Expose everything
 */
export { mappers, plugins, parse };
