import getMentions from 'collect-mentions';

/**
 * A plugin that adds `mentions` array property to the `commit`.
 * It is already included in the `plugins` named export,
 * and in `mappers` named export.
 * Basically each entry in that array is an object,
 * directly returned from the [collect-mentions][].
 *
 * _See the [.plugins](#plugins) and [.mappers](#mappers)  examples._
 *
 * @name  mentions
 * @param {Commit} commit a standard `Commit` object
 * @returns {Commit} plus `{ mentions: Array<Mention> }`
 * @public
 */
export default function mentions(commit) {
  const commitMentions = []
    .concat(getMentions(commit.header.subject))
    .concat(getMentions(commit.body))
    .concat(getMentions(commit.footer));

  return { mentions: commitMentions };
}
