/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const arrayify = require('arrayify')
const collectMentions = require('collect-mentions')

/**
 *
 * @param {string} commitMessage required, a whole commit message
 * @param {Array} plugins optional, a list of functions that get passed with `commit` object
 */
function parse (commitMessage, plugins) {
  if (typeof commitMessage !== 'string') {
    throw new TypeError('parseCommitMessage.parse: expect `commitMessage` to be string')
  }

  const lines = commitMessage.split('\n')
  const header = lines.shift()
  const body = lines.shift() || null
  const footer = lines.join('\n').trim() || null
  const parts = /^(\w+)(?:\((.+)\))?: (.+)$/.exec(header)

  if (!parts) {
    throw new Error('invalid commit message: <type>[optional scope]: <description>')
  }

  const [type, scope, subject] = parts.slice(1)

  const commit = {
    type,
    scope,
    subject,
    header,
    body,
    footer,
  }

  return arrayify(plugins).reduce((acc, fn) => Object.assign({}, acc, fn(acc)), commit)
}

/**
 * Mappers (plugins) for the `parseCommitMessage` function,
 * they get a `commit` object and should return an object.
 * It isn't needed to return the whole coming `commit` object, because
 * the return of plugins is merged with it automatically in any way.
 */

/**
 *
 * @param {Object} commit, the commit object coming from `parseCommitMessage`
 */
function incrementMapper (commit) {
  const isBreaking = isBreakingChange(commit)
  let increment = null

  if (/fix|bugfix|patch/.test(commit.type)) {
    increment = 'patch'
  }
  if (/feat|feature|minor/.test(commit.type)) {
    increment = 'minor'
  }
  if (/break|breaking|major/.test(commit.type) || isBreaking) {
    increment = 'major'
  }

  return { increment, isBreaking }
}

/* eslint-disable no-param-reassign */

/**
 *
 * @param {Object} commit, the commit object coming from `parseCommitMessage`
 */
function isBreakingChange ({ subject, body, footer }) {
  body = body || ''
  footer = footer || ''

  const re = 'BREAKING CHANGE:'
  return subject.includes(re) || body.includes(re) || footer.includes(re)
}

/**
 * > Collects all mentions for `subject`, `body` and `footer`
 * places of the commit message, into one single array of "mention" objects
 * like `{ mention, handle }`, see [collect-mentions][] package.
 *
 * @param   {Object} commit, the commit object coming from `parseCommitMessage`
 * @returns {Object} with a `mentions` array property
 */
function mentionsMapper ({ subject, body, footer }) {
  const mentions = []
    .concat(collectMentions(subject))
    .concat(collectMentions(body))
    .concat(collectMentions(footer))

  return { mentions }
}

/**
 * An object with all mappers, such as `plugins` array, but named.
 */
const mappers = {
  increment: incrementMapper,
  mentions: mentionsMapper,
}

/**
 * A list of all plugins, such as `mappers` but no names.
 */
const plugins = Object.keys(mappers).map((name) => mappers[name])

/**
 * Expose everything
 */
module.exports = { mappers, plugins, parse }
