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

export function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

export function validator(schema, obj) {
  const result = { value: null };

  // eslint-disable-next-line no-restricted-syntax
  for (const [key] of Object.entries(Object.assign({}, obj, schema))) {
    const value = obj[key];
    result.value = Object.assign({}, result.value);

    if (schema[key] && !obj[key]) {
      result.value[key] = schema[key]();
    } else if (schema[key] && obj[key]) {
      const isValid = schema[key](value);
      if (!isValid) {
        result.error = new Error(`validation failed for key: ${key}`);
        break;
      }
      result.value[key] = value;
    } else if (!schema[key] && obj[key]) {
      result.value[key] = value;
    }
  }

  return result;
}

// const header = { type: 'fix', scope: '', subject: 'bar baz' };
// const commit = { header, body: 'Quxie yeah', foo: 1 };

export function isValidString(x) {
  return Boolean(typeof x === 'string' && x.length > 0);
}
