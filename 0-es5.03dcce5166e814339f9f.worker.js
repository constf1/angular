!function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function e(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return r(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var a=0,o=function(){};return{s:o,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var l,i=!0,u=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return i=t.done,t},e:function(t){u=!0,l=t},f:function(){try{i||null==n.return||n.return()}finally{if(u)throw l}}}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}!function(t){var e={};function r(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,(function(e){return t[e]}).bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s="NkOZ")}({NkOZ:function(r,n,a){"use strict";function o(t,r,n){if(t.length>r){var a=n.fallback,l=function(t,r){var n,a={},o=e(t);try{for(o.s();!(n=o.n()).done;){var l=n.value,i=r(l);a[i]?a[i].push(l):a[i]=[l]}}catch(u){o.e(u)}finally{o.f()}return a}(t,n.mapper);t=[];var i,u=e(n.picker(Object.keys(l)));try{for(u.s();!(i=u.n()).done;){var f=i.value,c=r-t.length,v=l[f];if((t=t.concat(a&&v.length>c?o(l[f],c,a):l[f])).length>=r)break}}catch(s){u.e(s)}finally{u.f()}}return t}function l(t,e){var r=e.x-t.x,n=t.y-e.y;return r>=0&&r<t.letters.length&&n>=0&&n<e.letters.length&&t.letters[r]===e.letters[n]}function i(t,e){var r=e.x-t.x;if(r>=-1&&r<t.letters.length+1){var n=t.y-e.y;if(n>=-1&&n<e.letters.length+1)return r>=0&&r<t.letters.length&&n>=0&&n<e.letters.length&&t.letters[r]===e.letters[n]}return!0}function u(t){return t.vertical?1:t.letters.length}function f(t){return t.vertical?t.letters.length:1}function c(t){for(var e=t.x;t=t.prev;)e=Math.min(e,t.x);return e}function v(t){for(var e=t.y;t=t.prev;)e=Math.min(e,t.y);return e}function s(t){for(var e=t.x+u(t);t=t.prev;)e=Math.max(e,t.x+u(t));return e}function h(t){for(var e=t.y+f(t);t=t.prev;)e=Math.max(e,t.y+f(t));return e}function p(t){return(s(t)-c(t))*(h(t)-v(t))}function y(t){for(var e,r,n=0;t;t=t.prev)for(var a=t.prev;a;a=a.prev)r=a,(!(e=t).vertical&&r.vertical?l(e,r):e.vertical&&!r.vertical&&l(r,e))&&(n+=1);return n}function d(t,e){do{if(n=e,!((r=t).vertical?n.vertical?function(t,e){var r=t.y-e.y;if(r>=-t.letters.length-1&&r<=e.letters.length+1){var n=e.x-t.x;return n<-1||n>1}return!0}(r,n):i(n,r):n.vertical?i(r,n):function(t,e){var r=e.x-t.x;if(r>=-e.letters.length-1&&r<=t.letters.length+1){var n=t.y-e.y;return n<-1||n>1}return!0}(r,n)))return!1}while(t=t.prev);var r,n;return!0}function g(t,e,r){var n={},a=t;do{for(var o=a.letters.length;o-- >0;)for(var l=a.letters[o],i=e.length;i-- >0;)if(l===e[i]){var u=a.vertical?{x:a.x-i,y:a.y+o,letters:e,prev:t}:{x:a.x+o,y:a.y-i,letters:e,prev:t,vertical:!0},f="".concat(u.x,":").concat(u.y);n[f]||(n[f]=!0,d(t,u)&&r.push(u))}}while(a=a.prev)}function b(t){return t.map((function(t){return+t})).sort((function(t,e){return t-e}))}function m(t){return t.map((function(t){return+t})).sort((function(t,e){return e-t}))}a.r(n);var x,k,M,w,O,j=(x={mapper:p,picker:b},k={mapper:function(t){return Math.abs(s(e=t)+v(e)-c(e)-h(e));var e},picker:b},M={mapper:y,picker:m},w={mapper:function(t){return Math.abs(function(t){var e=0;do{e+=t.vertical?-1:1}while(t=t.prev);return e}(t))},picker:b},O=5e3,function(t,e,r){return e>=t.length?((((x.fallback=M).fallback=w).fallback=k).fallback=void 0,o(r,1,x)):(e>4&&r.length>O&&(O=2500,e>.85*t.length?((((x.fallback=M).fallback=k).fallback=w).fallback=void 0,r=o(r,500,x)):((((M.fallback=x).fallback=w).fallback=k).fallback=void 0,r=o(r,500,M)),r.length>O&&(r.length=O)),r)}),I=new(function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.timeout=t}var r,n,a;return r=e,(n=[{key:"stop",value:function(){this.timerID&&(clearTimeout(this.timerID),this.timerID=void 0)}},{key:"play",value:function(t){var e=this;this.stop(),this.timerID=setTimeout((function(){e.timerID=void 0,t()&&e.play(t)}),this.timeout)}},{key:"ended",get:function(){return void 0===this.timerID}}])&&t(r.prototype,n),a&&t(r,a),e}())(1);addEventListener("message",(function(t){var r=t.data,n=r.requestId,a=r.words,o=r.tryCount;if(n&&(null==a?void 0:a.length)>0){var l,i=Math.max(o,1),u=0;I.play((function(){var t;if(0===u)!function(t){for(var e=t.length;--e>0;){var r=Math.floor((e+1)*Math.random()),n=t[e];t[e]=t[r],t[r]=n}}(a),t=[{x:0,y:0,letters:a[0].split("")}];else{t=[];var r,o=e(l);try{for(o.s();!(r=o.n()).done;){g(r.value,a[u].split(""),t)}}catch(p){o.e(p)}finally{o.f()}}u++;var f,s=null;(l=j(a,u,t)).length>0?s=function(t){var e=[],r=c(t),n=v(t);do{e.push({x:t.x-r,y:t.y-n,letters:t.letters,vertical:t.vertical})}while(t=t.prev);return e}((f=l)[Math.floor(Math.random()*f.length)]):(u=0,i--);var h=u<a.length&&i>0;return postMessage({requestId:n,isWorking:h,items:s}),h}))}else I.stop()}))}})}();