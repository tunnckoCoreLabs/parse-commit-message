import { Commit, Plugin } from '../types';
import { mentions } from './mentions';
import { increment } from './increment';

const defaultPlugins: Plugin[] = [mentions, increment];

function arrayify(val: any) {
  /* istanbul ignore next */
  if (!val) return [];
  /* istanbul ignore next */
  if (!Array.isArray(val)) return [val];
  /* istanbul ignore next */
  return val;
}

export type IPlugins = Plugin | Plugin[] | boolean;

/* eslint-disable import/prefer-default-export */
export function parse(commitMessage: string, plugins: IPlugins = true): Commit {
  if (typeof commitMessage !== 'string') {
    throw new TypeError(
      'parseCommitMessage.parse: expect `commitMessage` to be string',
    );
  }

  const elements = commitMessage.split(/\r?\n\r?\n/);
  const headerStr: string = elements[0];
  const body: string | null = elements.length > 2 ? elements[1] : null;
  const footer: string = elements.length > 2 ? elements[2] : elements[1];

  // eslint-disable-next-line unicorn/no-unsafe-regex
  const parts = /^(\w+)(?:\((.+)\))?: (.+)$/.exec(headerStr);

  if (!parts) {
    throw new Error(
      'invalid commit message: <type>[optional scope]: <description>',
    );
  }

  const [type, scope = '', subject] = parts.slice(1);

  const commit: Commit = {
    header: {
      type,
      scope,
      subject,
      toString: () => headerStr,
    },
    body: (body && body.trim()) || null,
    footer: (footer && footer.trim()) || null,
  };

  if (plugins === true) {
    // eslint-disable-next-line no-param-reassign
    plugins = defaultPlugins;
  }

  return arrayify(plugins).reduce((acc, fn) => {
    const result = fn(acc);

    return { ...acc, ...result };
  }, commit);
}
