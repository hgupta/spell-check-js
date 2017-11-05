"use strict"

const u = require('./utils')

let corpus = {}
let N = -1
let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

const tokenize = text => text.toLowerCase().match(/[a-z]+/g)
const frequencinize = (freqs, token) => {
  freqs[token] = (freqs[token] || 0) + 1
  return freqs
}

const load = text => {
  corpus = tokenize(text).reduce(frequencinize, {})
  N = Object.keys(corpus).reduce((sum, word) => sum += corpus[word], 0)
}

const totalWordsCount = () => N

const pairify = (w, i) => [w.slice(0, i), w.slice(i)]
const splitter = word => Array(word.length + 1).fill(word).map(pairify)
const inFreqSet = (freqs, word) => !!freqs[word]

const P = word => (corpus[word] + 1) / (N + 1)

const edit1 = word => {
  let pairs = splitter(word)
  let deletes = pairs
    .filter(([a, b]) => b.length > 0)
    .map(([a, b]) => a + b.slice(1))
  let transposes = pairs
    .filter(([a, b]) => b.length > 1)
    .map(([a, b]) => a + b[1] + b[0] + b.slice(2))
  let replaces = u.flatten(pairs
    .map(([a, b]) => alphabet.map(c => a + c + b.slice(1)))
  )
  let inserts = u.flatten(pairs.map(([a, b]) => alphabet.map(c => a + c + b)))
  return Array.from(
    new Set(deletes.concat(transposes).concat(replaces).concat(inserts))
  )
}

const edit2 = word => Array.from(
  new Set(
    u.flatten(edit1(word).map(e1 => edit1(e1).map(e2 => e2)))
  )
)

const known = words => Array.from(
  new Set(
    words.filter(u.curry(inFreqSet, corpus))
  )
)

const candidates = word => {
  let c = known([word])
  if(c.length > 0) return c

  c = known(edit1(word))
  if(c.length > 0) return c

  c = known(edit2(word))
  if(c.length > 0) return c

  return [word]
}

const _suggest = word => candidates(word)
  .map(s => ({ suggestion: s, count: corpus[s], P: P(s) }))
  .sort((a, b) => b.P - a.P)

const suggest = (word, opts) => {
  opts.top = opts.top || 1
  opts.onlyWords = opts.onlyWords === undefined ? true : opts.onlyWords

  let answers = _suggest(word)
  if(opts.onlyWords) answers = answers.map(a => a.suggestion)
  return answers.slice(0, opts.top)
}

module.exports = { load, known, suggest, totalWordsCount, P }
