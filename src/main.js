import { tryCatch, isObject } from './utils';
import { parseCommit, stringifyCommit, checkCommit } from './commit';

/**
 * Receives and parses a single or multiple commit message(s) in form of string,
 * object, array of strings, array of objects or mixed.
 *
 * @example
 * import { parse } from 'parse-commit-message';
 *
 * const commits = [
 *   'fix(ci): tweaks for @circleci config',
 *   'chore: bar qux'
 * ];
 * const result = parse(commits);
 * console.log(result);
 * // => [{
 * //   header: { type: 'fix', scope: 'ci', subject: 'tweaks for @circleci config' },
 * //   body: null,
 * //   footer: null,
 * // }, {
 * //   header: { type: 'chore', scope: null, subject: 'bar qux' },
 * //   body: null,
 * //   footer: null,
 * // }]
 *
 * // Or pass `flat = true` to return a single object
 * // when results contain only one item.
 * const commitMessage = `feat: awesome yeah
 *
 * Awesome body!
 * resolves #123
 *
 * Signed-off-by: And Footer <abc@exam.pl>`;
 *
 * const res = parse(commitMessage, true);
 *
 * console.log(res);
 * // => {
 * //   header: { type: 'feat', scope: null, subject: 'awesome yeah' },
 * //   body: 'Awesome body!\nresolves #123',
 * //   footer: 'Signed-off-by: And Footer <abc@exam.pl>',
 * // }
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
        return acc.concat(parseCommit(val));
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
 * @example
 * import { parse, stringify } from 'parse-commit-message';
 *
 * const commitMessage = `feat: awesome yeah
 *
 * Awesome body!
 * resolves #123
 *
 * Signed-off-by: And Footer <abc@exam.pl>`;
 *
 * const flat = true;
 * const res = parse(commitMessage, flat);
 *
 * const str = stringify(res, flat);
 * console.log(str);
 * console.log(str === commitMessage);
 *
 * @name  .stringify
 * @param {string|object|array} commits a `Commit` object, or anything that can be passed to `check`
 * @param {boolean} [flat] if the returned result length is 1, then returns the first item
 * @returns {Array<string>} an array of commit strings like `'fix(foo): bar baz'`,
 *                     if `flat: true`, returns a `string`
 * @public
 */
export function stringify(commits, flat = false) {
  const result = []
    .concat(commits)
    .filter(Boolean)
    .reduce(
      (acc, val) => acc.concat(check(val).map((x) => stringifyCommit(x))),
      [],
    );

  return flat === true && result.length === 1 ? result[0] : result;
}

/**
 * Validates a single or multiple commit message(s) in form of string,
 * object, array of strings, array of objects or mixed.
 * You may want to pass `ret` to return an object instead of throwing.
 *
 * @example
 * import { validate } from 'parse-commit-message';
 *
 * console.log(validate('foo bar qux')); // false
 * console.log(validate('foo: bar qux')); // true
 * console.log(validate('fix(ci): bar qux')); // true
 *
 * console.log(validate(['a bc cqux', 'foo bar qux'])); // false
 *
 * console.log(validate({ qux: 1 })); // false
 * console.log(validate({ header: { type: 'fix' } })); // false
 * console.log(validate({ header: { type: 'fix', subject: 'ok' } })); // true
 *
 * const commitObject = {
 *   header: { type: 'test', subject: 'updating tests' },
 *   foo: 'bar',
 *   isBreaking: false,
 *   body: 'oh ah',
 * };
 * console.log(validate(commitObject)); // true
 *
 * const result = validate('foo bar qux', true);
 * console.log(result.error);
 * // => Error: expect \`commit\` to follow:
 * // <type>[optional scope]: <description>
 * //
 * // [optional body]
 * //
 * // [optional footer]
 *
 * const res = validate('fix(ci): okey barry', true);
 * console.log(result.value);
 * // => [{
 * //   header: { type: 'fix', scope: 'ci', subject: 'okey barry' },
 * //   body: null,
 * //   footer: null,
 * // }]
 *
 * const commit = { header: { type: 'fix' } };
 * const { error } = validate(commit, true);
 * console.log(error);
 * // => TypeError: header.subject should be non empty string
 *
 *
 * const commit = { header: { type: 'fix', scope: 123, subject: 'okk' } };
 * const { error } = validate(commit, true);
 * console.log(error);
 * // => TypeError: header.scope should be non empty string when given
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
 * Basically the return result is the same as if you run `.validate()` with
 * the `ret` option, but instead it throws if find problems.
 *
 * @example
 * import { check } from 'parse-commit-message';
 *
 * try {
 *   check({ header: { type: 'fix' } });
 * } catch(err) {
 *   console.log(err);
 *   // => TypeError: header.subject should be non empty string
 * }
 *
 * // Can also validate/check a strings, array of strings,
 * // or even mixed - array of strings and objects
 * try {
 *   check('fix(): invalid scope, it cannot be empty')
 * } catch(err) {
 *   console.log(err);
 *   // => TypeError: header.scope should be non empty string when given
 * }
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
    .filter((x) => x !== null || x !== undefined)
    .reduce((acc, commit) => {
      if (typeof commit === 'string') {
        commit = parseCommit(commit); // eslint-disable-line no-param-reassign
      }
      return acc.concat(checkCommit(commit));
    }, []);

  return flat === true && result.length === 1 ? result[0] : result;
}
