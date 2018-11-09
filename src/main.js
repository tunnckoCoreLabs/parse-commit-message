import { tryCatch } from './utils';
import { parseCommit, stringifyCommit, checkCommit } from './commit';

/**
 * Receives and parses a single or multiple commit message(s) in form of string,
 * object, array of strings, array of objects or mixed.
 *
 * _The `parse*` methods are not doing checking and validation,
 * so you may want to pass the result to `validate` or `check`,
 * or to `validate` with `ret` option set to `true`._
 *
 * @name  .parse
 * @param {string|object|array} commits a value to be parsed into an object like `Commit` type
 * @param {boolean} [flat] if the returned result length is 1, then returns the first item
 * @returns {Array<Commit>} if `flat` is true, returns a `Commit`
 * @public
 */
export function parse(commits, flat = false) {
  if (commits && typeof commits === 'string') {
    return [parseCommit(commits)];
  }

  const result = []
    .concat(commits)
    .filter(Boolean)
    .reduce((acc, val) => {
      if (commits && typeof commits === 'object' && !Array.isArray(commits)) {
        return acc.concat(commits);
      }

      return acc.concat(parse(val));
    }, []);

  return flat === true && result.length === 1 ? result[0] : result;
}

/**
 * Receives a `Commit` object, validates it using `validate`,
 * builds a "commit" message string and returns it.
 *
 * @name  .stringify
 * @param {Commit} commit a `Commit` object
 * @returns {string} a commit stirng like `'fix(foo): bar baz'`
 * @public
 */
export function stringify(commit) {
  if (commit && typeof commit === 'string') {
    return [commit];
  }
  if (commit && typeof commit === 'object' && !Array.isArray(commit)) {
    return [stringifyCommit(commit)];
  }
  return []
    .concat(commit)
    .filter(Boolean)
    .reduce((acc, val) => acc.concat(stringify(val)), []);
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
