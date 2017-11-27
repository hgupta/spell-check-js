const assert = require('assert')

const speller = require('../index')

describe('Spell-Check-JS', () => {
  describe('read \'big.txt\' file as corpus', () => {
    before(() => {
      speller.clean()
      speller.loadFile('big.txt')
    })

    describe('#corpusSize', function() {
      it('responds with number of words in file', () => {
        assert.equal(1105221, speller.corpusSize())
      })
    })

    describe('#suggest(\'fianlly\')', () => {
      it('should return array of length 1', () => {
        assert.equal(1, speller.suggest('fianlly').length)
      })

      it('should return \'finally\' as only suggestion', () => {
        assert.equal('finally', speller.suggest('fianlly')[0])
      })
    })

    describe('#suggest(\'fianlly\', { includeProb: true })', () => {
      let ans = undefined
      before(() => {
        ans = speller.suggest('fianlly', { includeProb: true })
      })
      it('should return array of objects with keys [suggestion, count, P]',
        () => {
          assert.ok(ans[0].hasOwnProperty('suggestion'))
          assert.ok(ans[0].hasOwnProperty('count'))
          assert.ok(ans[0].hasOwnProperty('P'))
      })
    })

    describe('#suggest(\'teh\', { top: 5 })', () => {
      it('should return array of length 5', () => {
        assert.equal(5, speller.suggest('teh', { top: 5 }).length)
      })
    })

    describe('#suggest(\'somthing\', { top: 9 })', () => {
      let ans = undefined
      before(() => {
        ans = speller.suggest('somthing', { top: 9 })
      })
      it('should return array of length 2', () => {
        assert.equal(2, ans.length)
      })

      it('should return 1st element as \'something\'', () => {
        assert.equal('something', ans[0])
      })

      it('should return 2nd element as \'soothing\'', () => {
        assert.equal('soothing', ans[1])
      })
    })
  })
})
