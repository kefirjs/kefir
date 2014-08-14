:bangbang: WARNING: Current API is very unstable. I am about to change a lot of things in near feature. 

# Kefir

Kefir — is an FRP (functional reactive programming) library for JavaScript
inspired by [Bacon.js](https://github.com/baconjs/bacon.js)
and [RxJS](https://github.com/Reactive-Extensions/RxJS)
with focus on high performance and low memory usage.

For docs visit [pozadi.github.io/kefir](http://pozadi.github.io/kefir).

:construction: It still behind Bacon in number of features,
but also has some unique features that not are in Bacon.
See ["Bacon vs Kefir"](https://github.com/pozadi/kefir/blob/master/bacon-vs-kefir.md)
to get a glance on progress.

[![Build Status](https://travis-ci.org/pozadi/kefir.svg?branch=master)](https://travis-ci.org/pozadi/kefir)
[![Code Climate](http://img.shields.io/codeclimate/github/pozadi/kefir.svg)](https://codeclimate.com/github/pozadi/kefir)
[![Dependency Status](https://david-dm.org/pozadi/kefir.svg)](https://david-dm.org/pozadi/kefir)
[![devDependency Status](https://david-dm.org/pozadi/kefir/dev-status.svg)](https://david-dm.org/pozadi/kefir#info=devDependencies)
[![NPM package version](http://img.shields.io/npm/v/kefir.svg)](https://www.npmjs.org/package/kefir)
![Bower version](https://badge.fury.io/bo/kefir.svg)

[![Testling](https://ci.testling.com/pozadi/kefir.png)](https://ci.testling.com/pozadi/kefir)

[Run tests in your browser](http://pozadi.github.io/kefir/test/in-browser/SpecRunner.html) (`gh-pages` branch)



# Development

To build `/dist` from `/src` and run tests on Node.js type this in console:

    NODE_PATH=./dist grunt

To run memory tests:

    coffee --nodejs '--expose-gc' test/perf/memory-specs/[some spec].coffee

To run all memory tests (see [results](https://github.com/pozadi/kefir/blob/master/test/perf/memory-results.txt)):

    coffee --nodejs '--expose-gc' test/perf/memory-all.coffee

To run performance tests:

    coffee test/perf/perf-specs/[some spec].coffee
