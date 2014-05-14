// $::eventStream()

// var jQuery = global.jQuery || global.Zepto || (
//   typeof window !== 'undefined' && (window.jQuery || window.Zepto)
// );
// if (jQuery) {

//   jQuery.fn.eventStream = function(events, selector, eventTransformer){

//     if (arguments.length === 2 && isFn(selector)) {
//       eventTransformer = selector;
//       selector = null;
//     }

//     if (!isFn(eventTransformer)) {
//       eventTransformer = id;
//     }

//     var $this = this;

//     function handler(){
//       result._send( eventTransformer.apply(this, arguments) );
//     }
//     function sub(){
//       $this.on(events, selector, handler);
//     }
//     function unsub(){
//       $this.off(events, selector, handler);
//     }

//     var result = new Stream(sub, unsub);

//     return result;
//   }

// }
