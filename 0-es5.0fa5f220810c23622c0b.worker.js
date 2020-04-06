function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _createForOfIteratorHelper(t){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=_unsupportedIterableToArray(t))){var e=0,r=function(){};return{s:r,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,i,o=!0,s=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return o=t.done,t},e:function(t){s=!0,i=t},f:function(){try{o||null==n.return||n.return()}finally{if(s)throw i}}}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _createSuper(t){return function(){var e,r=_getPrototypeOf(t);if(_isNativeReflectConstruct()){var n=_getPrototypeOf(this).constructor;e=Reflect.construct(r,arguments,n)}else e=r.apply(this,arguments);return _possibleConstructorReturn(this,e)}}function _possibleConstructorReturn(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}!function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,(function(e){return t[e]}).bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s="OqOn")}({OqOn:function(t,e,r){"use strict";r.r(e),Array.from("SDCH");var n=(Array.from("A23456789TJQK"),"SDCH".length),i=n*"A23456789TJQK".length;function o(t){return Math.floor(t/n)}function s(t){return t%n}var a=function t(e){_classCallCheck(this,t),this.success=e},u=function(t){_inherits(r,t);var e=_createSuper(r);function r(t,n,i,o){var s;return _classCallCheck(this,r),(s=e.call(this,t,n,i)).desk=o,s.cardToWatch=-1,s.searchTime=500,s.done=new Set,s.buffers=[[],[]],s.iteration=0,s.path="",s.onMove=function(t,e,r){},s}return _createClass(r,[{key:"stop",value:function(t){throw new a(t)}},{key:"getAllPaths",value:function(){return this.buffers[this.iteration%2]}},{key:"getPath",value:function(){var t=this.buffers[this.iteration%2];return t[t.length-1]}},{key:"clear",value:function(){this.done.clear(),this.buffers[0].length=0,this.buffers[1].length=0,this.iteration=0,this.path=""}},{key:"prepare",value:function(){this.clear(),this.done.add(this.toKey()),this.buffers[0][0]=""}},{key:"nextIteration",value:function(){var t=this.buffers[this.iteration%2];if(this.iteration++,t.length<=0)return!1;try{var e,r=_createForOfIteratorHelper(t);try{for(r.s();!(e=r.n()).done;){var n=e.value;this.skipForward(n),this.findMoves(),this.skipBackward()}}catch(i){r.e(i)}finally{r.f()}}catch(i){return!1}return t.length=0,this.buffers[this.iteration%2].length>0}},{key:"solve",value:function(){this.prepare();var t=Date.now();try{for(var e;(e=this.buffers[this.iteration%2]).length>0;){this.iteration++;var r,n=_createForOfIteratorHelper(e);try{for(n.s();!(r=n.n()).done;){var i=r.value;this.skipForward(i),this.findMoves(),this.skipBackward()}}catch(o){n.e(o)}finally{n.f()}e.length=0,Date.now()-t>this.searchTime&&(console.log("Oops! Search timeout on ".concat(this.iteration," iteration!")),this.stop(!1))}}catch(s){if(s instanceof a)return s.success;throw s}finally{console.log("Searched: "+this.done.size+". Time (ms): "+(Date.now()-t))}return!1}},{key:"skipForward",value:function(t){for(var e=0;e<t.length;e+=2)this.desk[t.charCodeAt(e+1)].push(this.desk[t.charCodeAt(e)].pop());this.path=t}},{key:"skipBackward",value:function(){for(var t=this.path,e=t.length;e>0;e-=2)this.desk[t.charCodeAt(e-2)].push(this.desk[t.charCodeAt(e-1)].pop())}},{key:"move",value:function(t,e,r){this.desk[r].push(this.desk[e].pop());var n=this.toKey();this.done.has(n)||(this.done.add(n),this.buffers[this.iteration%2].push(this.path+String.fromCharCode(e,r)),!(this.cardToWatch<0||this.cardToWatch===t)||this.cardFilter&&!this.cardFilter[t]||this.destinationFilter&&!this.destinationFilter[r]||this.onMove(t,e,r)),this.desk[e].push(this.desk[r].pop())}},{key:"findMoves",value:function(){for(var t,e,r=this.cardFilter,n=this.getEmptyCell(),i=this.getEmptyPile(),a=0;a<this.DESK_SIZE;a++){var u=this.desk[a];if(u.length>0){var h=u[u.length-1];if(!r||r[h]){if(!this.isBase(a)){var l=this.getBase(h);l>=0&&this.move(h,a,l)}for(var c=this.PILE_START;c<this.PILE_END;c++)if(c!==a){var f=this.desk[c];f.length>0&&(e=h,o(t=f[f.length-1])===o(e)+1&&s(t)%2!=s(e)%2)&&this.move(h,a,c)}n>=0&&(this.isCell(a)||this.move(h,a,n)),i>=0&&(!this.isPile(a)||u.length>1)&&this.move(h,a,i)}}}}},{key:"baseToString",value:function(){for(var t="",e=this.BASE_START;e<this.BASE_END;e++)t+=String.fromCharCode(this.desk[e].length);return t}},{key:"pileToString",value:function(){for(var t=[],e=this.PILE_START;e<this.PILE_END;e++)t.push(String.fromCharCode.apply(String,_toConsumableArray(this.desk[e])));return t.sort(),t.join(String.fromCharCode(i))}},{key:"toKey",value:function(){return this.baseToString()+this.pileToString()}},{key:"getEmptyCell",value:function(){for(var t=this.CELL_START;t<this.CELL_END;t++)if(0===this.desk[t].length)return t;return-1}},{key:"getEmptyPile",value:function(){for(var t=this.PILE_START;t<this.PILE_END;t++)if(0===this.desk[t].length)return t;return-1}},{key:"countEmptyCells",value:function(){for(var t=0,e=this.CELL_START;e<this.CELL_END;e++)0===this.desk[e].length&&t++;return t}},{key:"countEmptyPiles",value:function(){for(var t=0,e=this.PILE_START;e<this.PILE_END;e++)0===this.desk[e].length&&t++;return t}},{key:"countEmpty",value:function(){return this.countEmptyCells()+this.countEmptyPiles()}},{key:"countCardsInBases",value:function(){for(var t=0,e=this.BASE_START;e<this.BASE_END;e++)t+=this.desk[e].length;return t}},{key:"getBase",value:function(t){for(var e=s(t),r=o(t),i=this.BASE_START+e;i<this.BASE_END;i+=n)if(this.desk[i].length===r)return i;return-1}},{key:"doneSize",get:function(){return this.done.size}}]),r}(function(){function t(e,r,n){_classCallCheck(this,t),this.PILE_NUM=e,this.CELL_NUM=r,this.BASE_NUM=n,this.PILE_START=0,this.DESK_SIZE=e+r+n,this.PILE_END=this.BASE_START=this.PILE_START+this.PILE_NUM,this.BASE_END=this.CELL_START=this.BASE_START+this.BASE_NUM,this.CELL_END=this.CELL_START+this.CELL_NUM}return _createClass(t,[{key:"isPile",value:function(t){return t>=this.PILE_START&&t<this.PILE_END}},{key:"isBase",value:function(t){return t>=this.BASE_START&&t<this.BASE_END}},{key:"isCell",value:function(t){return t>=this.CELL_START&&t<this.CELL_END}},{key:"getSpotName",value:function(t){return this.isBase(t)?"base "+(t-this.BASE_START):this.isPile(t)?"pile "+(t-this.PILE_START):this.isCell(t)?"cell "+(t-this.CELL_START):"unknown "+t}}]),t}()),h=new(function(){function t(e){_classCallCheck(this,t),this.timeout=e}return _createClass(t,[{key:"stop",value:function(){this.timerID&&(clearTimeout(this.timerID),this.timerID=void 0)}},{key:"play",value:function(t){var e=this;this.stop(),this.timerID=setTimeout((function(){e.timerID=void 0,t()&&e.play(t)}),this.timeout)}},{key:"ended",get:function(){return void 0===this.timerID}}]),t}())(1);addEventListener("message",(function(t){var e=t.data,r=e.requestId;if(r){var n=e.desk,i=new u(n.pile,n.cell,n.base,n.desk),o=i.countEmpty(),s=i.countCardsInBases();i.onMove=function(t,n,a){var u=i.countEmpty(),h=!1;if((u>o||u===o&&i.countCardsInBases()>s)&&(h=!0),h||i.doneSize>e.searchThreshold){var l={requestId:r,path:h?i.getPath():""};postMessage(l),i.stop(h)}},i.prepare(),h.play((function(){return i.nextIteration()}))}else h.stop()}))}});