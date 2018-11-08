import joi from 'joi';
import { tryCatch, isRequired, isOptional, errorMsg } from './utils';

/**
 * Parses given `header` string into an header object.
 *
 * _The `parse*` methods are not doing checking and validation,
 * so you may want to pass the result to `validateHeader` or `checkHeader`,
 * or to `validateHeader` with `ret` option set to `true`._
 *
 * @name  .parseHeader
 * @param {string} header a header stirng like `'fix(foo): bar baz'`
 * @returns {HeaderObject} a `HeaderObject` like `{ type, scope?, subject }`
 * @public
 */
export function parseHeader(header) {
  if (!header || (header && typeof header !== 'string')) {
    const msg = `{ type: string, scope?: string, subject: scope }`;
    throw new TypeError(`expect \`commit.header\` to be an object: ${msg}`);
  }

  const colonIdx = header.indexOf(': ');
  if (colonIdx === -1) {
    throw new TypeError(errorMsg);
  }

  const parts = header.split('\n');
  // eslint-disable-next-line no-param-reassign
  header = parts.length > 0 ? parts[0] : header;

  // because the last question mark, which we totally need
  // eslint-disable-next-line unicorn/no-unsafe-regex
  const regex = /^(\w+)(?:\((.+)\))?: (.+)$/;
  if (!regex.test(header)) {
    throw new TypeError(errorMsg);
  }
  const [type, scope, subject] = regex.exec(header).slice(1);

  return { type, scope, subject };
}

/**
 * Receives a `header` object, validates it using `validateHeader`,
 * builds a "header" string and returns it.
 *
 * @name  .stringifyHeader
 * @param {HeaderObject} header a `HeaderObject` like `{ type, scope?, subject }`
 * @returns {string} a header stirng like `'fix(foo): bar baz'`
 * @public
 */
export function stringifyHeader(header) {
  const result = validateHeader(header, true);

  if (result.error) throw result.error;

  const { type, scope, subject } = result.value;

  return `${type}${scope ? `(${scope})` : ''}: ${subject}`.trim();
}

/**
 * Validates given `header` object and returns `boolean`.
 * You may want to pass `ret` to return an object instead of throwing.
 *
 * @name  .validateHeader
 * @param {HeaderObject} header a `HeaderObject` like `{ type, scope?, subject }`
 * @param {boolean} [ret] to return result instead of throwing, default `false`
 * @returns {boolean|object} if `ret` is `true` then returns `{ value, error }` object,
 *                          where `value` is `HeaderObject` and `error` a standard `Error`
 * @public
 */
export function validateHeader(header, ret = false) {
  return tryCatch(() => checkHeader(header), ret);
}

/**
 * Receives a `HeaderObject` and checks if it is valid.
 *
 * @name  .checkHeader
 * @param {HeaderObject} header a `HeaderObject` like `{ type, scope?, subject }`
 * @returns {HeaderObject} returns the same as given if no problems, otherwise it will throw.
 * @public
 */
export function checkHeader(header) {
  // eslint-disable-next-line no-param-reassign
  header = header.header || header;

  if (!header || (header && typeof header !== 'object')) {
    const msg = `{ type: string, scope?: string, subject: scope }`;
    throw new TypeError(`expect \`commit.header\` to be an object: ${msg}`);
  }

  const schema = {
    type: isRequired,
    scope: isOptional,
    subject: isRequired,
  };

  const result = joi.validate(header, schema);
  if (result.error) {
    result.error.message = `parse-commit-message: ${result.error.message}`;
    throw result.error;
  }
  return result.value;
}
