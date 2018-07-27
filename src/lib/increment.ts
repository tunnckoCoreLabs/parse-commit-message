import { Commit } from '../types';

/* eslint-disable import/prefer-default-export */

export function increment(commit: Commit) {
  let isBreaking = isBreakingChange(commit);
  let commitIncrement = '';

  if (/fix|bugfix|patch/.test(commit.header.type)) {
    commitIncrement = 'patch';
  }
  if (/feat|feature|minor/.test(commit.header.type)) {
    commitIncrement = 'minor';
  }
  if (/break|breaking|major/.test(commit.header.type) || isBreaking) {
    commitIncrement = 'major';
  }
  isBreaking = isBreaking || commitIncrement === 'major';

  return { increment: commitIncrement, isBreaking };
}

/* eslint-disable no-param-reassign */

function isBreakingChange({ header, body, footer }: Commit) {
  body = body || '';
  footer = footer || '';

  const re = /^BREAKING\s+CHANGES?:\s+/;
  return re.test(header.subject) || re.test(body) || re.test(footer);
}
