!function(){function t(t,r){for(var n=0;n<r.length;n++){var e=r[n];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}function r(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||e(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=e(t))||r&&t&&"number"==typeof t.length){n&&(t=n);var a=0,o=function(){};return{s:o,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,l=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return l=t.done,t},e:function(t){u=!0,i=t},f:function(){try{l||null==n.return||n.return()}finally{if(u)throw i}}}}function e(t,r){if(t){if("string"==typeof t)return a(t,r);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(t,r):void 0}}function a(t,r){(null==r||r>t.length)&&(r=t.length);for(var n=0,e=new Array(r);n<r;n++)e[n]=t[n];return e}!function(t){var r={};function n(e){if(r[e])return r[e].exports;var a=r[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=t,n.c=r,n.d=function(t,r,e){n.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:e})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,r){if(1&r&&(t=n(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(n.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var a in t)n.d(e,a,(function(r){return t[r]}).bind(null,a));return e},n.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(r,"a",r),r},n.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},n.p="",n(n.s="EjVZ")}({EjVZ:function(e,a,o){"use strict";function i(t,r,e){if(t.length>r){var a=e.fallback,o=function(t,r){var e,a={},o=n(t);try{for(o.s();!(e=o.n()).done;){var i=e.value,l=r(i);a[l]?a[l].push(i):a[l]=[i]}}catch(u){o.e(u)}finally{o.f()}return a}(t,e.mapper);t=[];var l,u=n(e.picker(Object.keys(o)));try{for(u.s();!(l=u.n()).done;){var f=l.value,c=r-t.length,s=o[f];if((t=t.concat(a&&s.length>c?i(o[f],c,a):o[f])).length>=r)break}}catch(y){u.e(y)}finally{u.f()}}return t}function l(t){return t.split("")}function u(t,r){var n=r.x-t.x,e=t.y-r.y;return n>=0&&n<t.letters.length&&e>=0&&e<r.letters.length}function f(t,r){var n=r.x-t.x;if(n>=-1&&n<t.letters.length+1){var e=t.y-r.y;if(e>=-1&&e<r.letters.length+1)return n>=0&&n<t.letters.length&&e>=0&&e<r.letters.length&&t.letters[n]===r.letters[e]}return!0}function c(t,r){var n=r.x-t.x;if(n>=-r.letters.length-1&&n<=t.letters.length+1){var e=t.y-r.y;return e<-1||e>1}return!0}function s(t,r){var n=t.y-r.y;if(n>=-t.letters.length-1&&n<=r.letters.length+1){var e=r.x-t.x;return e<-1||e>1}return!0}function y(t,r){var e,a=n(t.yWords);try{for(a.s();!(e=a.n()).done;){if(!s(e.value,r))return!1}}catch(l){a.e(l)}finally{a.f()}var o,i=n(t.xWords);try{for(i.s();!(o=i.n()).done;){if(!f(o.value,r))return!1}}catch(l){i.e(l)}finally{i.f()}return!0}function h(t,r){var e,a=n(t.xWords);try{for(a.s();!(e=a.n()).done;){if(!c(e.value,r))return!1}}catch(l){a.e(l)}finally{a.f()}var o,i=n(t.yWords);try{for(i.s();!(o=i.n()).done;){if(!f(r,o.value))return!1}}catch(l){i.e(l)}finally{i.f()}return!0}function v(t,e,a){!function(t,e,a){var o,i={},l=n(t.xWords);try{for(l.s();!(o=l.n()).done;)for(var u=o.value,f=u.letters.length;f-- >0;)for(var c=e.length;c-- >0;)if(u.letters[f]===e[c]){var s=u.x+f,h=u.y-c,v="".concat(s,"Y").concat(h);if(!i[v]){i[v]=!0;var d={letters:e,x:s,y:h};y(t,d)&&a.push({xWords:t.xWords,yWords:[].concat(r(t.yWords),[d]),xMin:t.xMin,xMax:t.xMax,yMin:Math.min(t.yMin,d.y),yMax:Math.max(t.yMax,d.y+d.letters.length)})}}}catch(x){l.e(x)}finally{l.f()}}(t,e,a),function(t,e,a){var o,i={},l=n(t.yWords);try{for(l.s();!(o=l.n()).done;)for(var u=o.value,f=u.letters.length;f-- >0;)for(var c=e.length;c-- >0;)if(u.letters[f]===e[c]){var s=u.x-c,y=u.y+f,v="".concat(s,"X").concat(y);if(!i[v]){i[v]=!0;var d={letters:e,x:s,y:y};h(t,d)&&a.push({xWords:[].concat(r(t.xWords),[d]),yWords:t.yWords,xMin:Math.min(t.xMin,d.x),xMax:Math.max(t.xMax,d.x+d.letters.length),yMin:t.yMin,yMax:t.yMax})}}}catch(x){l.e(x)}finally{l.f()}}(t,e,a)}function d(t){return(t.xMax-t.xMin)*(t.yMax-t.yMin)}function x(t){var r,e=0,a=n(t.xWords);try{for(a.s();!(r=a.n()).done;){var o,i=r.value,l=n(t.yWords);try{for(l.s();!(o=l.n()).done;){u(i,o.value)&&(e+=1)}}catch(f){l.e(f)}finally{l.f()}}}catch(f){a.e(f)}finally{a.f()}return e}function p(t){return t.map(function(t){return+t}).sort(function(t,r){return t-r})}function g(t){return t.map(function(t){return+t}).sort(function(t,r){return r-t})}o.r(a);var m,b,M,k,W,j=(m={mapper:d,picker:p},b={mapper:function(t){return Math.abs(function(t){return t.xMax-t.xMin-t.yMax+t.yMin}(t))},picker:p},M={mapper:x,picker:g},k={mapper:function(t){return Math.abs(t.xWords.length-t.yWords.length)},picker:p},W=5e3,function(t,r,n){return r>=t.length?((((m.fallback=M).fallback=k).fallback=b).fallback=void 0,i(n,1,m)):(r>4&&n.length>W&&(W=2500,r>.9*t.length?((((m.fallback=M).fallback=b).fallback=k).fallback=void 0,n=i(n,500,m)):((((M.fallback=m).fallback=k).fallback=b).fallback=void 0,n=i(n,500,M)),n.length>W&&(n.length=W)),n)}),w=new(function(){function r(t){!function(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}(this,r),this.timeout=t}var n,e,a;return n=r,(e=[{key:"ended",get:function(){return void 0===this.timerID}},{key:"stop",value:function(){this.timerID&&(clearTimeout(this.timerID),this.timerID=void 0)}},{key:"play",value:function(t){var r=this;this.stop(),this.timerID=setTimeout(function(){r.timerID=void 0,t()&&r.play(t)},this.timeout)}}])&&t(n.prototype,e),a&&t(n,a),r}())(1);addEventListener("message",function(t){var r=t.data,e=r.requestId,a=r.words,o=r.tryCount,i=r.maxHeight,u=r.maxWidth;if(e&&(null==a?void 0:a.length)>0){var f,c=Math.max(o,1),s=0,y=0;w.play(function(){if(0===y){!function(t){for(var r=t.length;--r>0;){var n=Math.floor((r+1)*Math.random()),e=t[r];t[r]=t[n],t[n]=e}}(a);var t=l(a[y]);f=[{xWords:[{letters:t,x:0,y:0}],yWords:[],xMin:0,xMax:t.length,yMin:0,yMax:1}],s=0,y=1}else{var r,o=l(a[y]),h=[],d=n(f);try{for(d.s();!(r=d.n()).done;){v(r.value,o,h)}}catch(M){d.e(M)}finally{d.f()}if((h=h.filter(function(t){return t.xMax-t.xMin<=u&&t.yMax-t.yMin<=i})).length<1){s+=1;var x=a[y];a.splice(y,1),a.push(x)}else s=0,f=j(a,y+=1,h)}var p=f.length<1||y+s>=a.length;p&&(y=0,c--);var g,m=!p||c>0&&s>0,b={requestId:e,isWorking:m,grid:f.length>0?(g=f,g[Math.floor(Math.random()*g.length)]):null};return postMessage(b),m})}else w.stop()})}})}();