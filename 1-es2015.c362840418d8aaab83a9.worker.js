!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,(function(e){return t[e]}).bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s="NkOZ")}({NkOZ:function(t,e,n){"use strict";function r(t,e,n){if(t.length>e){const o=n.fallback,l=function(t,e){const n={};for(const r of t){const t=e(r);n[t]?n[t].push(r):n[t]=[r]}return n}(t,n.mapper);t=[];for(const s of n.picker(Object.keys(l))){const n=e-t.length,i=l[s];if((t=t.concat(o&&i.length>n?r(l[s],n,o):l[s])).length>=e)break}}return t}function o(t){return t.split("")}function l(t,e){const n=e.x-t.x,r=t.y-e.y;return n>=0&&n<t.letters.length&&r>=0&&r<e.letters.length}function s(t,e){const n=e.x-t.x;if(n>=-1&&n<t.letters.length+1){const r=t.y-e.y;if(r>=-1&&r<e.letters.length+1)return n>=0&&n<t.letters.length&&r>=0&&r<e.letters.length&&t.letters[n]===e.letters[r]}return!0}function i(t,e){const n=e.x-t.x;if(n>=-e.letters.length-1&&n<=t.letters.length+1){const n=t.y-e.y;return n<-1||n>1}return!0}function f(t,e){const n=t.y-e.y;if(n>=-t.letters.length-1&&n<=e.letters.length+1){const n=e.x-t.x;return n<-1||n>1}return!0}function c(t,e){for(const n of t.yWords)if(!f(n,e))return!1;for(const n of t.xWords)if(!s(n,e))return!1;return!0}function a(t,e){for(const n of t.xWords)if(!i(n,e))return!1;for(const n of t.yWords)if(!s(e,n))return!1;return!0}function u(t,e,n){!function(t,e,n){const r={};for(const o of t.xWords)for(let l=o.letters.length;l-- >0;)for(let s=e.length;s-- >0;)if(o.letters[l]===e[s]){const i=o.x+l,f=o.y-s,a=`${i}Y${f}`;if(!r[a]){r[a]=!0;const o={letters:e,x:i,y:f};c(t,o)&&n.push({xWords:t.xWords,yWords:[...t.yWords,o],xMin:t.xMin,xMax:t.xMax,yMin:Math.min(t.yMin,o.y),yMax:Math.max(t.yMax,o.y+o.letters.length)})}}}(t,e,n),function(t,e,n){const r={};for(const o of t.yWords)for(let l=o.letters.length;l-- >0;)for(let s=e.length;s-- >0;)if(o.letters[l]===e[s]){const i=o.x-s,f=o.y+l,c=`${i}X${f}`;if(!r[c]){r[c]=!0;const o={letters:e,x:i,y:f};a(t,o)&&n.push({xWords:[...t.xWords,o],yWords:t.yWords,xMin:Math.min(t.xMin,o.x),xMax:Math.max(t.xMax,o.x+o.letters.length),yMin:t.yMin,yMax:t.yMax})}}}(t,e,n)}function x(t){return(t.xMax-t.xMin)*(t.yMax-t.yMin)}function h(t){let e=0;for(const n of t.xWords)for(const r of t.yWords)l(n,r)&&(e+=1);return e}function y(t){return t.map(t=>+t).sort((t,e)=>t-e)}function d(t){return t.map(t=>+t).sort((t,e)=>e-t)}n.r(e);const M=function(t,e){const n={mapper:x,picker:y},o={mapper:t=>Math.abs(function(t){return t.xMax-t.xMin-t.yMax+t.yMin}(t)),picker:y},l={mapper:h,picker:d},s={mapper:t=>Math.abs(t.xWords.length-t.yWords.length),picker:y};let i=5e3;return(t,e,f)=>e>=t.length?((((n.fallback=l).fallback=s).fallback=o).fallback=void 0,r(f,1,n)):(e>4&&f.length>i&&(i=2500,e>.9*t.length?((((n.fallback=l).fallback=o).fallback=s).fallback=void 0,f=r(f,500,n)):((((l.fallback=n).fallback=s).fallback=o).fallback=void 0,f=r(f,500,l)),f.length>i&&(f.length=i)),f)}(),g=new class{constructor(t){this.timeout=t}get ended(){return void 0===this.timerID}stop(){this.timerID&&(clearTimeout(this.timerID),this.timerID=void 0)}play(t){this.stop(),this.timerID=setTimeout(()=>{this.timerID=void 0,t()&&this.play(t)},this.timeout)}}(1);addEventListener("message",t=>{const e=t.data,{requestId:n,words:r,tryCount:l,maxHeight:s,maxWidth:i}=e;if(n&&(null==r?void 0:r.length)>0){let t,e=Math.max(l,1),f=0,c=0;g.play(()=>{let l;if(0===c){!function(t){for(let e=t.length;--e>0;){const n=Math.floor((e+1)*Math.random()),r=t[e];t[e]=t[n],t[n]=r}}(r);const t=o(r[0]);l=[{xWords:[{letters:t,x:0,y:0}],yWords:[],xMin:0,xMax:t.length,yMin:0,yMax:1}],f=0}else{l=[];for(const e of t)u(e,o(r[c]),l);l=l.filter(t=>t.xMax-t.xMin<=i&&t.yMax-t.yMin<=s)}if(0===l.length){f+=1;const t=r[c];r.splice(c,1),r.push(t)}else f=0,c+=1,t=M(r,c,l);let a=null;var x;t.length>0?a=(x=t)[Math.floor(Math.random()*x.length)]:(c=0,e--);const h=c+f<r.length&&e>0;return postMessage({requestId:n,isWorking:h,grid:a}),h})}else g.stop()})}});