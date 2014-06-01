var Benchmark = require('benchmark');
var Kefir = require('../../dist/kefir.js');
var Bacon = require('baconjs');




function noop(){}
function id(x){return x}



console.log('\nKefir')

var bus = Kefir.bus();
bus.onValue(noop);

var busMap = Kefir.bus();
busMap.map(id).onValue(noop);


var suite = new Benchmark.Suite;

suite.add('bus()', function() {
  bus.push(1);
})
.add('bus().map()', function() {
  busMap.push(1);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({ 'async': false });




console.log('\nBacon')

var bus = new Bacon.Bus();
bus.onValue(noop);

var busMap = new Bacon.Bus();
busMap.map(id).onValue(noop);


var suite = new Benchmark.Suite;

suite.add('bus()', function() {
  bus.push(1);
})
.add('bus().map()', function() {
  busMap.push(1);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({ 'async': false });

