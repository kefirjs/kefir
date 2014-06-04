# Kefir

Kefir — is an FRP (functional reactive programming) library for JavaScript
inspired by [Bacon.js](https://github.com/baconjs/bacon.js)
and [RxJS](https://github.com/Reactive-Extensions/RxJS)
with focus on high perfomance and low memory usage.
It has nice Bacon.js like API
and RxJS's performance / memory usage characteristics.

For docs visit [pozadi.github.io/kefir](http://pozadi.github.io/kefir).

:construction: It still in alpha developnet stage. See [Bacon.js API implementation status](https://github.com/pozadi/kefir/blob/master/bacon-api-impl-status.md).



# Tests

[![Build Status](https://travis-ci.org/pozadi/kefir.svg?branch=master)](https://travis-ci.org/pozadi/kefir)

[![Testling](https://ci.testling.com/pozadi/kefir.png)](https://ci.testling.com/pozadi/kefir)

[Run tests in your browser](http://pozadi.github.io/kefir/test/in-browser/SpecRunner.html) (`gh-pages` branch)



# Development

To build `/dist` from `/src` and run tests on Node.js type this in console:

    grunt

To run memory tests:

    node --expose-gc test/perf/memory.js

To run perfomance tests:

    coffee test/perf/benchmarks/[some benchmark].coffee

To run all perfomance tests:

    coffee test/perf/all-benchmarks.coffee
