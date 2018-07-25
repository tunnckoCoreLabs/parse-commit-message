/**
 * @copyright 2017-present, Charlike Mike Reagent (https://i.am.charlike.online)
 * @license Apache-2.0
 */

import arrayify from 'arrayify';
import collectMentions from 'collect-mentions';

/**
 *
 * @param {string} commitMessage required, a whole commit message
 * @param {Array} plugins optional, a list of functions that get passed with `commit` object
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
 */
const mappers = {
  increment: incrementMapper,
  mentions: mentionsMapper,
};

/**
 * A list of all plugins, such as `mappers` but no names.
 */
const plugins = Object.keys(mappers).map((name) => mappers[name]);

/**
 * Expose everything
 */
export { mappers, plugins, parse };
