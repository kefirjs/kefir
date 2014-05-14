// var Kefir = require('../../dist/kefir.js');
// var helpers = require('../test-helpers');


// if (typeof window !== 'undefined'){

//   describe("jQuery::eventStream()", function(){


//     it("jquery itself works", function(){

//       var count = 0;
//       function handler(){ count++ }

//       jQuery('body').on('click', handler);
//       jQuery('body').trigger('click');
//       jQuery('body').off('click', handler);

//       expect(count).toBe(1);

//     });



//     it("just event name", function(done){

//       var stream = jQuery('body').eventStream('click').take(2);

//       helpers.captureOutput(stream, function(values){
//         expect(values.length).toBe(2);
//         done();
//       });

//       jQuery('body').trigger('click');
//       jQuery('body').trigger('click');
//       jQuery('body').trigger('click');

//     });


//     it("event name and selector", function(done){

//       var stream = jQuery('body').eventStream('click', '.my-button').take(2);

//       helpers.captureOutput(stream, function(values){
//         expect(values.length).toBe(2);
//         done();
//       });

//       $btn = jQuery('<button class="my-button">my-button</button>').appendTo('body');

//       $btn.trigger('click');
//       $btn.trigger('click');
//       $btn.trigger('click');

//       $btn.remove()

//     });


//     it("event name, selector, and transformer", function(done){

//       var stream = jQuery('body')
//         .eventStream('click', '.my-button', function(event){
//           return this === event.currentTarget && jQuery(this).hasClass('my-button');
//         }).take(2);

//       helpers.captureOutput(stream, function(values){
//         expect(values).toEqual([true, true]);
//         done();
//       });

//       $btn = jQuery('<button class="my-button">my-button</button>').appendTo('body');

//       $btn.trigger('click');
//       $btn.trigger('click');
//       $btn.trigger('click');

//       $btn.remove()

//     });


//   });

// }
