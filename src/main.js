import { tryCatch, isObject } from './utils';
import { parseCommit, stringifyCommit, checkCommit } from './commit';

/**
 * Receives and parses a single or multiple commit message(s) in form of string,
 * object, array of strings, array of objects or mixed.
 *
 * @name  .parse
 * @param {string|object|array} commits a value to be parsed into an object like `Commit` type
 * @param {boolean} [flat] if the returned result length is 1, then returns the first item
 * @returns {Array<Commit>} if `flat: true`, returns a `Commit`
 * @public
 */
export function parse(commits, flat = false) {
  const result = []
    .concat(commits)
    .filter(Boolean)
    .reduce((acc, val) => {
      if (typeof val === 'string') {
        return acc.conact(parseCommit(val));
      }
      if (isObject(val)) {
        return acc.concat(val);
      }

      return acc.concat(parse(val));
    }, []);

  return flat === true && result.length === 1 ? result[0] : result;
}

/**
 * Receives a `Commit` object, validates it using `validate`,
 * builds a "commit" message string and returns it.
 *
 * This method does checking and validation too,
 * so if you pass a string, it will be parsed and validated,
 * and after that turned again to string.
 *
 * @name  .stringify
 * @param {string|object|array} commit a `Commit` object, or anything that can be passed to `check`
 * @param {boolean} [flat] if the returned result length is 1, then returns the first item
 * @returns {Array<string>} an array of commit strings like `'fix(foo): bar baz'`,
 *                     if `flat: true`, returns a `string`
 * @public
 */
export function stringify(commit, flat = false) {
  const result = []
    .concat(commit)
    .filter(Boolean)
    .reduce((acc, val) => acc.concat(stringifyCommit(check(val))), []);

  return flat === true && result.length === 1 ? result[0] : result;
}

/**
 * Validates a single or multiple commit message(s) in form of string,
 * object, array of strings, array of objects or mixed.
 * You may want to pass `ret` to return an object instead of throwing.
 *
 * @name  .validate
 * @param {string|object|array} commits a value to be parsed & validated into an object like `Commit` type
 * @param {boolean} [ret] to return result instead of throwing, default `false`
 * @returns {boolean|object} if `ret` is `true` then returns `{ value, error }` object,
 *                          where `value` is `Commit|Array<Commit>` and `error` a standard `Error`
 * @public
 */
export function validate(commits, ret = false) {
  return tryCatch(() => check(commits), ret);
}

/**
 * Receives a single or multiple commit message(s) in form of string,
 * object, array of strings, array of objects or mixed.
 *
 * @name  .check
 * @param {string|object|array} commits a value to be parsed & validated into an object like `Commit` type
 * @param {boolean} [flat] if the returned result length is 1, then returns the first item
 * @returns {Array<Commit>} returns the same as given if no problems, otherwise it will throw;
 *                     if `flat: true`, returns a `Commit`
 * @public
 */
export function check(commits, flat) {
  const result = []
    .concat(commits)
    .filter(Boolean)
    .reduce((acc, commit) => {
      if (typeof commit === 'string') {
        commit = parseCommit(commit); // eslint-disable-line no-param-reassign
      }
      return acc.concat(checkCommit(commit));
    }, []);

  return flat === true && result.length === 1 ? result[0] : result;
}
