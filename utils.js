"use strict"

module.exports.flatten = ary => Array.prototype.concat(...ary)

module.exports.curry = (fn, ...args) => (...nArgs) => {
  if(fn.length <= (args.length + nArgs.length))
    return fn.apply(this, [...args, ...nArgs])
  return curry(fn, ...[...args, ...nArgs])
}
