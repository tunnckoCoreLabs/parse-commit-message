import joi from 'joi';
import { tryCatch, isOptional } from './utils';
import { parseHeader, stringifyHeader, validateHeader } from './header';

/**
 * Receives a full commit message `string` and parses it into an `Commit` object
 * and returns it.
 *
 * _The `parse*` methods are not doing checking and validation,
 * so you may want to pass the result to `validateCommit` or `checkCommit`,
 * or to `validateCommit` with `ret` option set to `true`._
 *
 * @name  .parseCommit
 * @param {string} commit a message like `'fix(foo): bar baz\n\nSome awesome body!'`
 * @returns {Commit} a standard object like `{ header: HeaderObject, body, footer }`
 * @public
 */
export function parseCommit(commit) {
  const { error, value: header } = parseHeader(commit);
  if (error) throw error;

  const [body = '', footer = ''] = commit.split('\n\n').slice(1);

  return { header, body, footer };
}

/**
 * Receives a `Commit` object, validates it using `validateCommit`,
 * builds a "commit" string and returns it.
 *
 * @name  .stringifyCommit
 * @param {Commit} header a `Commit` object like `{ header: HeaderObject, body, footer }`
 * @returns {string} a commit nessage stirng like `'fix(foo): bar baz'`
 * @public
 */
export function stringifyCommit(commit) {
  const result = validateCommit(commit);
  if (result.error) {
    throw result.error;
  }

  const header = stringifyHeader(commit.header);

  return `${header}${commit.body}${commit.footer}`;
}

/**
 * Validates given `Commit` object and returns `boolean`.
 * You may want to set `ret` to `true` return an object instead of throwing.
 *
 * @name  .validateCommit
 * @param {Commit} header a `Commit` like `{ header: HeaderObject, body, footer }`
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
 * @name  .checkCommit
 * @param {Commit} header a `Commit` like `{ type, scope?, subject }`
 * @returns {Commit} returns the same as given if no problems, otherwise it will throw.
 * @public
 */
export function checkCommit(commit) {
  if (!commit || (commit && typeof commit !== 'object')) {
    const type = `{ header: { type: string, scope?: string, subject: scope }, body?, footer? }`;

    throw new TypeError(`expect \`commit\` to be an object: ${type}`);
  }

  const { error, value: header } = validateHeader(commit, true);
  if (error) {
    throw error;
  }

  const schema = {
    header,
    body: isOptional,
    footer: isOptional,
  };

  const result = joi.validate(commit, schema);
  if (result.error) {
    result.error.message = `parse-commit-message: ${result.error.message}`;
    throw result.error;
  }
  return result.value;
}
