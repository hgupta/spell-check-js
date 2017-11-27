"use strict"

const rfs = require('fs').readFileSync

const u = require('./utils')

let corpus = {}
let N = -1
let ALPHABETS = 'abcdefghijklmnopqrstuvwxyz'.split('')

const tokenize = text => text.toLowerCase().match(/[a-z]+/g)
const frequencinize = (freqs, token) => {
  freqs[token] = (freqs[token] || 0) + 1
  return freqs
}

const corpusSize = () => N
const load = text => {
  corpus = tokenize(text).reduce(frequencinize, {})
  N = Object.keys(corpus).reduce((sum, word) => sum += corpus[word], 0)
}
const loadFile = filepath => load(
  rfs(filepath, { encoding: 'utf-8'} ).toString()
)
const clean = () => {
  corpus = {}
  N = -1
}

const pairify = (w, i) => [w.slice(0, i), w.slice(i)]
const splitter = word => Array(word.length + 1).fill(word).map(pairify)
const inFreqSet = (freqs, word) => !!freqs[word]

const _byLength = len => ([a, b]) => b.length > len

const edit1 = word => {
  let pairs = splitter(word)

  let deletes = pairs
    .filter(_byLength(0))
    .map(([a, b]) => a + b.slice(1))

  let transposes = pairs
    .filter(_byLength(1))
    .map(([a, b]) => a + b[1] + b[0] + b.slice(2))

  let replaces = u.flatten(
    pairs
      .map(([a, b]) => ALPHABETS.map(c => a + c + b.slice(1)))
  )

  let inserts = u
    .flatten(
      pairs
        .map(([a, b]) => ALPHABETS.map(c => a + c + b))
  )
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

const smoothers = {
  additive: word => (corpus[word] + 1) / (N + 1)
}

const _suggest = (word, smoother) => candidates(word)
  .map(s => ({ suggestion: s, count: corpus[s], P: smoother(s) }))
  .sort((a, b) => b.P - a.P)

const suggest = (word, opts) => {
  opts = opts || {}
  opts.top = opts.top || 1
  opts.includeProb = opts.includeProb === undefined ? false : opts.includeProb
  opts.smoother = opts.smoother || smoothers.additive

  let answers = _suggest(word, opts.smoother)
  if(!opts.includeProb) answers = answers.map(a => a.suggestion)
  return answers.slice(0, opts.top)
}

module.exports = {
  load, loadFile, clean, known, suggest, corpusSize, smoothers
}
