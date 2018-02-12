/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const test = require('mukla')
const { parse, plugins } = require('../src/index.js')

test('should .parse method to work correctly', (done) => {
  const commitMsg1 = `feat(ng-list): Allow custom separator
bla bla bla

BREAKING CHANGE: some breaking change.
Thanks @foobar
`

  const commit = parse(commitMsg1, plugins)
  // => { type: 'feat',
  //   scope: 'ng-list',
  //   subject: 'Allow custom separator',
  //   header: 'feat(ng-list): Allow custom separator',
  //   body: 'bla bla bla',
  //   footer: 'BREAKING CHANGE: some breaking change.\nThanks @foobar' }

  test.strictEqual(typeof commit, 'object')
  test.strictEqual(commit.type, 'feat')
  test.strictEqual(commit.scope, 'ng-list')
  test.strictEqual(commit.subject, 'Allow custom separator')
  test.strictEqual(commit.body, 'bla bla bla')
  test.strictEqual(commit.header, 'feat(ng-list): Allow custom separator')
  test.strictEqual(
    commit.footer,
    'BREAKING CHANGE: some breaking change.\nThanks @foobar'
  )
  test.strictEqual(commit.increment, 'major')
  done()
})

test('should .parse throw for invalid commit convention message', (done) => {
  test.throws(() => parse('foo bar baz'), /invalid commit message/)
  done()
})

test('do not treat BREAKING CHANGE as major when not at the beginning', (done) => {
  const commitMessage = 'fix(abc): foo bar BREAKING CHANGE here is not valid'
  const commit = parse(commitMessage, plugins)

  test.strictEqual(commit.type, 'fix')
  test.strictEqual(commit.scope, 'abc')
  test.strictEqual(commit.subject, 'foo bar BREAKING CHANGE here is not valid')
  test.strictEqual(commit.increment, 'patch')
  done()
})
