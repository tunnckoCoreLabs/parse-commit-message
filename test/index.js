/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const test = require('mukla')
const { parse } = require('../src/index.js')

test('should .parse method to work correctly', (done) => {
  const commitMsg1 = `feat(ng-list): Allow custom separator
bla bla bla

BREAKING CHANGE: some breaking change.
Thanks @foobar
`

  const commit = parse(commitMsg1)
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
  done()
})

test('should .parse throw for invalid commit convention message', (done) => {
  test.throws(() => parse('foo bar baz'), /invalid commit message/)
  done()
})
