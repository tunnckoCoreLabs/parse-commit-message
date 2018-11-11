'use strict';

const path = require('path');
const esmLoader = require('esm');
const pkg = require('./package.json');

const esmRequire = esmLoader(module);

function interop(x) {
  if (Object.keys(x).length === 1 && x.default) {
    return x.default;
  }
  return x;
}

const mod = esmRequire(path.join(__dirname, pkg.module));

module.exports = interop(mod);
