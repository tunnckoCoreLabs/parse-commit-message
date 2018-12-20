/**
 * A plugin that adds `increment` and `isBreaking` properties
 * to the `commit`. It is already included in the `plugins` named export,
 * and in `mappers` named export.
 *
 * _See the [.plugins](#plugins) and [.mappers](#mappers)  examples._
 *
 * @name  increment
 * @param {Commit} commit a standard `Commit` object
 * @returns {Commit} plus `{ increment: string, isBreaking: boolean }`
 * @public
 */
export default function increment(commit) {
  let isBreaking = isBreakingChange(commit);
  let commitIncrement = false;

  if (/fix|bugfix|patch/i.test(commit.header.type)) {
    commitIncrement = 'patch';
  }
  if (/feat|feature|minor/i.test(commit.header.type)) {
    commitIncrement = 'minor';
  }
  if (/break|breaking|major/i.test(commit.header.type) || isBreaking) {
    commitIncrement = 'major';
  }
  isBreaking = isBreaking || commitIncrement === 'major';

  return { increment: commitIncrement, isBreaking };
}

/* eslint-disable no-param-reassign */

function isBreakingChange({ header, body, footer }) {
  const re = /^BREAKING\s+CHANGES?:\s+/;
  return (
    re.test(header.subject) || re.test(body || '') || re.test(footer || '')
  );
}
