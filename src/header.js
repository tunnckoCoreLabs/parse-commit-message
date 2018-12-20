import { EOL } from 'os';
import { tryCatch, isValidString, isObject, errorMsg } from './utils';

/**
 * Parses given `header` string into an header object.
 * Basically the same as [.parse](#parse), except that
 * it only can accept single string and returns a `Header` object.
 *
 * _The `parse*` methods are not doing any checking and validation,
 * so you may want to pass the result to `validateHeader` or `checkHeader`,
 * or to `validateHeader` with `ret` option set to `true`._
 *
 * @example
 * import { parseHeader } from 'parse-commit-message';
 *
 * const longCommitMsg = `fix: bar qux
 *
 * Awesome body!`;
 *
 * const headerObj = parseCommit(longCommitMsg);
 * console.log(headerObj);
 * // => { type: 'fix', scope: null, subject: 'bar qux' }
 *
 * @name  .parseHeader
 * @param {string} header a header stirng like `'fix(foo): bar baz'`
 * @returns {Header} a `Header` object like `{ type, scope?, subject }`
 * @public
 */
export function parseHeader(header) {
  if (!isValidString(header)) {
    throw new TypeError('expect `header` to be non empty string');
  }

  const parts = header.split(EOL);
  // eslint-disable-next-line no-param-reassign
  header = parts.length > 1 ? parts[0] : header;

  // because the last question mark, which we totally need
  // eslint-disable-next-line unicorn/no-unsafe-regex
  const regex = /^(\w+)(?:\((.+)\))?: (.+)$/i;
  if (!regex.test(header)) {
    throw new TypeError(errorMsg);
  }
  const [type, scope = null, subject] = regex.exec(header).slice(1);

  return { type, scope, subject };
}

/**
 * Receives a `header` object, validates it using `validateHeader`,
 * builds a "header" string and returns it. Method throws if problems found.
 * Basically the same as [.stringify](#stringify), except that
 * it only can accept single `Header` object.
 *
 * @example
 * import { stringifyHeader } from 'parse-commit-message';
 *
 * const headerStr = stringifyCommit({ type: 'foo', subject: 'bar qux' });
 * console.log(headerStr); // => 'foo: bar qux'
 *
 * @name  .stringifyHeader
 * @param {Header} header a `Header` object like `{ type, scope?, subject }`
 * @returns {string} a header stirng like `'fix(foo): bar baz'`
 * @public
 */
export function stringifyHeader(header) {
  const result = validateHeader(header, true);

  if (result.error) {
    throw result.error;
  }

  const { type, scope, subject } = result.value;

  return `${type}${scope ? `(${scope})` : ''}: ${subject}`.trim();
}

/**
 * Validates given `header` object and returns `boolean`.
 * You may want to pass `ret` to return an object instead of throwing.
 * Basically the same as [.validate](#validate), except that
 * it only can accept single `Header` object.
 *
 * @example
 * import { validateHeader } from 'parse-commit-message';
 *
 * const header = { type: 'foo', subject: 'bar qux' };
 *
 * const headerIsValid = validateHeader(header);
 * console.log(headerIsValid); // => true
 *
 * const { value } = validateHeader(header, true);
 * console.log(value);
 * // => {
 * //   header: { type: 'foo', scope: null, subject: 'bar qux' },
 * //   body: 'okey dude',
 * //   footer: null,
 * // }
 *
 * const { error } = validateHeader({
 *   type: 'bar'
 * }, true);
 *
 * console.log(error);
 * // => TypeError: header.subject should be non empty string
 *
 * @name  .validateHeader
 * @param {Header} header a `Header` object like `{ type, scope?, subject }`
 * @param {boolean} [ret] to return result instead of throwing, default `false`
 * @returns {boolean|object} if `ret` is `true` then returns `{ value, error }` object,
 *                          where `value` is `Header` and `error` a standard `Error`
 * @public
 */
export function validateHeader(header, ret = false) {
  return tryCatch(() => checkHeader(header), ret);
}

/**
 * Receives a `Header` and checks if it is valid.
 * Basically the same as [.check](#check), except that
 * it only can accept single `Header` object.
 *
 * @example
 * import { checkHeader } from 'parse-commit-message';
 *
 * try {
 *   checkHeader({ type: 'fix' });
 * } catch(err) {
 *   console.log(err);
 *   // => TypeError: header.subject should be non empty string
 * }
 *
 * // throws because can accept only Header objects
 * checkHeader('foo bar baz');
 * checkHeader(123);
 * checkHeader([]);
 * checkHeader([{ type: 'foo', subject: 'bar' }]);
 *
 * @name  .checkHeader
 * @param {Header} header a `Header` object like `{ type, scope?, subject }`
 * @returns {Header} returns the same as given if no problems, otherwise it will throw.
 * @public
 */
export function checkHeader(header) {
  // eslint-disable-next-line no-param-reassign
  header = (header && header.header) || header;

  if (!isObject(header)) {
    const msg = `{ type: string, scope?: string, subject: scope }`;
    throw new TypeError(`expect \`header\` to be an object: ${msg}`);
  }
  if (!isValidString(header.type)) {
    throw new TypeError('header.type should be non empty string');
  }
  if (!isValidString(header.subject)) {
    throw new TypeError('header.subject should be non empty string');
  }

  const isValidScope =
    'scope' in header && header.scope !== null
      ? isValidString(header.scope)
      : true;

  if (!isValidScope) {
    throw new TypeError(
      'commit.header.scope should be non empty string when given',
    );
  }

  return Object.assign({ scope: null }, header);
}
