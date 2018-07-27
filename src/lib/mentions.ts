import getMentions from 'collect-mentions';
import { Commit, Mention } from '../types';

const collectMentions = getMentions.default || getMentions;

/* eslint-disable import/prefer-default-export */
export function mentions({ header, body, footer }: Commit) {
  const commitMentions: Mention[] = []
    .concat(collectMentions(header.subject))
    .concat(collectMentions(body))
    .concat(collectMentions(footer));

  return { mentions: commitMentions };
}
