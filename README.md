# <a href="http://pozadi.github.io/kefir/"><img src="http://pozadi.github.io/kefir/Kefir-with-bg.svg" width="60" height="60"></a> Kefir



Kefir — is an Reactive Programming library for JavaScript
inspired by [Bacon.js](https://github.com/baconjs/bacon.js)
and [RxJS](https://github.com/Reactive-Extensions/RxJS)
with focus on high performance and low memory usage.

For docs visit [pozadi.github.io/kefir](http://pozadi.github.io/kefir).



[![Build Status](https://travis-ci.org/pozadi/kefir.svg?branch=master)](https://travis-ci.org/pozadi/kefir)
[![Code Climate](http://img.shields.io/codeclimate/github/pozadi/kefir.svg)](https://codeclimate.com/github/pozadi/kefir)
[![Dependency Status](https://david-dm.org/pozadi/kefir.svg)](https://david-dm.org/pozadi/kefir)
[![devDependency Status](https://david-dm.org/pozadi/kefir/dev-status.svg)](https://david-dm.org/pozadi/kefir#info=devDependencies)

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
