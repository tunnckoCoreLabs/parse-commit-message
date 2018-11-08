import joi from 'joi';
import dedent from 'dedent';

export function tryCatch(fn, ret) {
  const result = {};
  try {
    result.value = fn();
  } catch (err) {
    result.error = err;
  }

  return ret ? result : !result.error;
}

export const errorMsg = dedent`parse-commit-message: expect \`commit\` to follow:
<type>[optional scope]: <description>

[optional body]

[optional footer]`;

export const isRequired = joi
  .string()
  .default('')
  .required();

export const isOptional = joi
  .string()
  .default('')
  .optional();
