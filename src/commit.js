import { EOL } from 'os';
import { tryCatch, isValidString, isObject } from './utils';
import { parseHeader, stringifyHeader, validateHeader } from './header';

/**
 * Receives a full commit message `string` and parses it into an `Commit` object
 * and returns it.
 * Basically the same as [.parse](#parse), except that
 * it only can accept single string.
 *
 * _The `parse*` methods are not doing any checking and validation,
 * so you may want to pass the result to `validateCommit` or `checkCommit`,
 * or to `validateCommit` with `ret` option set to `true`._
 *
 * @example
 * import { parseCommit } from 'parse-commit-message';
 *
 * const commitObj = parseCommit('foo: bar qux\n\nokey dude');
 * console.log(commitObj);
 * // => {
 * //   header: { type: 'foo', scope: null, subject: 'bar qux' },
 * //   body: 'okey dude',
 * //   footer: null,
 * // }
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
 * builds a "commit" string and returns it. Method throws if problems found.
 * Basically the same as [.stringify](#stringify), except that
 * it only can accept single `Commit` object.
 *
 * @example
 * import { stringifyCommit } from 'parse-commit-message';
 *
 * const commitStr = stringifyCommit({
 *   header: { type: 'foo', subject: 'bar qux' },
 *   body: 'okey dude',
 * });
 * console.log(commitStr); // => 'foo: bar qux\n\nokey dude'
 *
 * @name  .stringifyCommit
 * @param {Commit} commit a `Commit` object like `{ header: Header, body?, footer? }`
 * @returns {string} a commit nessage stirng like `'fix(foo): bar baz'`
 * @public
 */
export function stringifyCommit(commit) {
  const result = validateCommit(commit, true);
  if (result.error) {
    throw result.error;
  }

  const header = stringifyHeader(result.value.header);

  result.value.body = result.value.body ? EOL + EOL + result.value.body : '';
  result.value.footer = result.value.footer
    ? EOL + EOL + result.value.footer
    : '';

  return `${header}${result.value.body}${result.value.footer}`;
}

/**
 * Validates given `Commit` object and returns `boolean`.
 * You may want to set `ret` to `true` return an object instead of throwing.
 * Basically the same as [.validate](#validate), except that
 * it only can accept single `Commit` object.
 *
 * @example
 * import { validateCommit } from 'parse-commit-message';
 *
 * const commit = {
 *   header: { type: 'foo', subject: 'bar qux' },
 *   body: 'okey dude',
 * };
 *
 * const commitIsValid = validateCommit(commit);
 * console.log(commitIsValid); // => true
 *
 * const { value } = validateCommit(commit, true);
 * console.log(value);
 * // => {
 * //   header: { type: 'foo', scope: null, subject: 'bar qux' },
 * //   body: 'okey dude',
 * //   footer: null,
 * // }
 *
 * @name  .validateCommit
 * @param {Commit} commit a `Commit` like `{ header: Header, body?, footer? }`
 * @param {boolean} [ret] to return result instead of throwing, default `false`
 * @returns {boolean|object} if `ret` is `true` then returns `{ value, error }` object,
 *                          where `value` is `Commit` and `error` a standard `Error`
 * @public
 */
export function validateCommit(commit, ret = false) {
  return tryCatch(() => checkCommit(commit), ret);
}

/**
 * Receives a `Commit` and checks if it is valid. Method throws if problems found.
 * Basically the same as [.check](#check), except that
 * it only can accept single `Commit` object.
 *
 * @example
 * import { checkCommit } from 'parse-commit-message';
 *
 * try {
 *   checkCommit({ header: { type: 'fix' } });
 * } catch(err) {
 *   console.log(err);
 *   // => TypeError: header.subject should be non empty string
 * }
 *
 * // throws because can accept only Commit objects
 * checkCommit('foo bar baz');
 * checkCommit(123);
 * checkCommit([{ header: { type: 'foo', subject: 'bar' } }]);
 *
 * @name  .checkCommit
 * @param {Commit} commit a `Commit` like `{ header: Header, body?, footer? }`
 * @returns {Commit} returns the same as given if no problems, otherwise it will throw.
 * @public
 */
export function checkCommit(commit) {
  if (!isObject(commit)) {
    const msg = `{ header: Header, body?, footer? }`;
    throw new TypeError(`expect \`commit\` to be an object: ${msg}`);
  }

  const { error, value: header } = validateHeader(commit.header, true);
  if (error) {
    throw error;
  }

  const isValidBody =
    'body' in commit && commit.body !== null
      ? typeof commit.body === 'string'
      : true;

  if (!isValidBody) {
    throw new TypeError('commit.body should be string when given');
  }

  const isValid =
    'footer' in commit && commit.footer !== null
      ? typeof commit.footer === 'string'
      : true;

  if (!isValid) {
    throw new TypeError('commit.footer should be string when given');
  }

  return Object.assign({ body: null, footer: null }, commit, { header });
}
