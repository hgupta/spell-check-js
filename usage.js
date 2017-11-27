"use strict"

const readFile = require('fs').readFile

const speller = require('./index')

// You may download big.txt from http://norvig.com/big.txt
// readFile('big.txt', 'utf-8', (err, text) => {
//   if(err) {
//     console.error('Error reading file big.txt', err)
//     return false
//   }

//   speller.load(text)
//   console.log(speller.corpusSize())
//   console.log(speller.suggest('somthing', { top: 5, onlyWords: false }))
// })

speller.loadFile('big.txt')
console.log(speller.corpusSize())
console.log(speller.suggest('teh', { top: 1, includeProb: true }))
console.log(speller.suggest('teh', { top: 2, includeProb: false }))
console.log(speller.suggest('somthing', { top: 3 }))
