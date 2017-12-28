# Spell Checker
Peter Norvig's Spell Checker in JavaScript

It is a simple attempt to replicate Perter Norvig's Spell Checker.
I used simple `1-Additive LaPlace Smoothing` for sorting suggestions.

http://norvig.com/spell-correct.html

Dictionary used: http://norvig.com/big.txt

## Usage
```javascript
const speller = require('./index')

speller.load('Some random string') // load text
// OR
speller.loadFile('filepath') // load text from file

// Corpus size (Word count)
speller.corpusSize()

let ans = speller('somthing')
// ['somehitng', 'soothing']

ans = speller('somthing', { includeProb: true })
/* [ { suggestion: 'something', count: 683, P: 0.0006188801887765535 },
  { suggestion: 'soothing', count: 16, P: 0.000015381525159651182 } ] */

ans = speller('teh', { top: 9 })
// [ 'the', 'ten', 'tea', 'eh', 'th', 'heh', 'ted', 'te' ]

ans = speller('teh', { top: 9, includeProb: true })
/* [ { suggestion: 'the', count: 80030, P: 0.07241169647364963 },
  { suggestion: 'ten', count: 219, P: 0.00019905503147783885 },
  { suggestion: 'tea', count: 107, P: 0.00009771792454366634 },
  { suggestion: 'eh', count: 89, P: 0.00008143160378638862 },
  { suggestion: 'th', count: 51, P: 0.00004704937107658009 },
  { suggestion: 'heh', count: 2, P: 0.0000027143867928796206 },
  { suggestion: 'ted', count: 2, P: 0.0000027143867928796206 },
  { suggestion: 'te', count: 1, P: 0.0000018095911952530805 } ] */
```

## TODO
- Case-insensitive
- Addition of corpus
- More smoothing algorithms
- Test cases (partial)
