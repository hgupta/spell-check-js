"use strict"

const readFile = require('fs').readFile

const speller = require('./index')

// You may download big.txt from http://norvig.com/big.txt
readFile('big.txt', 'utf-8', (err, text) => {
  if(err) {
    console.error('Error reading file big.txt', err)
    return false
  }

  speller.load(text)
  console.log(speller.totalWordsCount());
  console.log(speller.suggest('somthing', { top: 5, onlyWords: false }));
})
