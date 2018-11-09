import { EOL } from 'os';
import { tryCatch, isValidString, isObject } from './utils';
import { parseHeader, stringifyHeader, validateHeader } from './header';

/**
 * Receives a full commit message `string` and parses it into an `Commit` object
 * and returns it.
 *
 * _The `parse*` methods are not doing any checking and validation,
 * so you may want to pass the result to `validateHeader` or `checkHeader`,
 * or to `validateHeader` with `ret` option set to `true`._
 *
 * @name  .parseCommit
 * @param {string} commit a message like `'fix(foo): bar baz\n\nSome awesome body!'`
 * @returns {Commit} a standard object like `{ header: Header, body?, footer? }`
 * @public
 */
export function parseCommit(commit) {
  if (!isValidString(commit)) {
    throw new TypeError(`expect \`commit\` to be non empty string`);
  }

  const header = parseHeader(commit);
  const [body = null, footer = null] = commit.split('\n\n').slice(1);

  return { header, body, footer };
}

/**
 * Receives a `Commit` object, validates it using `validateCommit`,
 * builds a "commit" string and returns it.
 *
 * @name  .stringifyCommit
 * @param {Commit} header a `Commit` object like `{ header: Header, body?, footer? }`
 * @returns {string} a commit nessage stirng like `'fix(foo): bar baz'`
 * @public
 */
export function stringifyCommit(commit) {
  const result = validateCommit(commit, true);
  if (result.error) {
    throw result.error;
  }

  const header = stringifyHeader(commit.header);

  if (result.value.body) {
    result.value.body = EOL + EOL + result.value.body;
  }
  if (result.value.footer) {
    result.value.footer = EOL + EOL + result.value.footer;
  }
  return `${header}${result.value.body}${result.value.footer}`;
}

/**
 * Validates given `Commit` object and returns `boolean`.
 * You may want to set `ret` to `true` return an object instead of throwing.
 *
 * @name  .validateCommit
 * @param {Commit} header a `Commit` like `{ header: Header, body?, footer? }`
 * @param {boolean} [ret] to return result instead of throwing, default `false`
 * @returns {boolean|object} if `ret` is `true` then returns `{ value, error }` object,
 *                          where `value` is `Commit` and `error` a standard `Error`
 * @public
 */
export function validateCommit(commit, ret = false) {
  return tryCatch(() => checkCommit(commit), ret);
}

/**
 * Receives a `Commit` and checks if it is valid.
 *
 *
 * @name  .checkCommit
 * @param {Commit} header a `Commit` like `{ header: Header, body?, footer? }`
 * @returns {Commit} returns the same as given if no problems, otherwise it will throw.
 * @public
 */
export function checkCommit(commit) {
  if (!isObject(commit)) {
    const msg = `{ header: Header, body?, footer? }`;
    throw new TypeError(`expect \`commit\` to be an object: ${msg}`);
  }

  const { error, value: header } = validateHeader(commit, true);
  if (error) {
    throw error;
  }

  const isValidBody =
    'body' in commit && commit.body !== null
      ? isValidString(commit.body)
      : true;

  if (!isValidBody) {
    throw new TypeError('commit.body should be non empty string when given');
  }

  const isValid =
    'footer' in commit && commit.footer !== null
      ? isValidString(commit.footer)
      : true;

  if (!isValid) {
    throw new TypeError('commit.footer should be non empty string when given');
  }

  return Object.assign({ body: '', footer: '' }, commit, { header });
}
