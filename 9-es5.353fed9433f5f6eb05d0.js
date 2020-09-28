function _createForOfIteratorHelper(t,n){var e;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(e=_unsupportedIterableToArray(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return{s:function(){e=t[Symbol.iterator]()},n:function(){var t=e.next();return i=t.done,t},e:function(t){c=!0,a=t},f:function(){try{i||null==e.return||e.return()}finally{if(c)throw a}}}}function _unsupportedIterableToArray(t,n){if(t){if("string"==typeof t)return _arrayLikeToArray(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray(t,n):void 0}}function _arrayLikeToArray(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}function _inherits(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),n&&_setPrototypeOf(t,n)}function _setPrototypeOf(t,n){return(_setPrototypeOf=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t})(t,n)}function _createSuper(t){var n=_isNativeReflectConstruct();return function(){var e,r=_getPrototypeOf(t);if(n){var o=_getPrototypeOf(this).constructor;e=Reflect.construct(r,arguments,o)}else e=r.apply(this,arguments);return _possibleConstructorReturn(this,e)}}function _possibleConstructorReturn(t,n){return!n||"object"!=typeof n&&"function"!=typeof n?_assertThisInitialized(t):n}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _classCallCheck(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,n,e){return n&&_defineProperties(t.prototype,n),e&&_defineProperties(t,e),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{mUt8:function(t,n,e){"use strict";e.r(n);var r=e("ofXK"),o=e("tyNb"),a=e("3Pt+"),i=e("tk/3"),c=e("pKmL"),s=e("hctd"),l=e("dqHA"),u=e("KUwc"),f={get x(){return 0},set x(t){},get y(){return 0},set y(t){}};function h(t,n,e){return{x:t+=e.x,y:n+=e.y}}function d(t){for(var n="",e=arguments.length,r=new Array(e>1?e-1:0),o=1;o<e;o++)r[o-1]=arguments[o];for(var a=0,i=r;a<i.length;a++){var c=i[a];n+=" ".concat(c.x-t.x," ").concat(c.y-t.y)}return n}var p=function(){function t(n,e,r,o){_classCallCheck(this,t),this.prev=r,this.command="M",this._endPoint=h(n,e,o?this.startPoint:f)}return _createClass(t,[{key:"paramsToString",value:function(t){return d(t,this.endPoint)}},{key:"toString",value:function(t){return t?this.command.toLowerCase()+this.paramsToString(this.startPoint):this.command+this.paramsToString(f)}},{key:"endPoint",get:function(){return this._endPoint||f}},{key:"startPoint",get:function(){var t;return(null===(t=this.prev)||void 0===t?void 0:t.endPoint)||f}}]),t}(),b=function(t){_inherits(e,t);var n=_createSuper(e);function e(t,r,o,a){var i;return _classCallCheck(this,e),(i=n.call(this,t,r,o,a)).command="L",i}return e}(p),m=function(){function t(n,e){_classCallCheck(this,t),this.x=n,this._node=e}return _createClass(t,[{key:"y",get:function(){return this._node.startPoint.y},set:function(t){}}]),t}(),g=function(t){_inherits(e,t);var n=_createSuper(e);function e(t,r,o){var a;return _classCallCheck(this,e),(a=n.call(this,t,0,r,o)).command="H",a._endPoint=new m(a.endPoint.x,_assertThisInitialized(a)),a}return _createClass(e,[{key:"paramsToString",value:function(t){return" "+(this.endPoint.x-t.x)}}]),e}(p),y=function(){function t(n,e){_classCallCheck(this,t),this.y=n,this._node=e}return _createClass(t,[{key:"x",get:function(){return this._node.startPoint.x},set:function(t){}}]),t}(),v=function(t){_inherits(e,t);var n=_createSuper(e);function e(t,r,o){var a;return _classCallCheck(this,e),(a=n.call(this,0,t,r,o)).command="V",a._endPoint=new y(a.endPoint.y,_assertThisInitialized(a)),a}return _createClass(e,[{key:"paramsToString",value:function(t){return" "+(this.endPoint.y-t.y)}}]),e}(p),C=function(){function t(n){_classCallCheck(this,t),this._node=n}return _createClass(t,[{key:"startPoint",get:function(){for(var t=this._node.prev;t;t=t.prev)if("M"===t.command)return t.endPoint;return f}},{key:"x",get:function(){return this.startPoint.x},set:function(t){}},{key:"y",get:function(){return this.startPoint.y},set:function(t){}}]),t}(),_=function(t){_inherits(e,t);var n=_createSuper(e);function e(t){var r;return _classCallCheck(this,e),(r=n.call(this,0,0,t)).command="Z",r._endPoint=new C(_assertThisInitialized(r)),r}return _createClass(e,[{key:"paramsToString",value:function(t){return" "}}]),e}(p),k=function(t){_inherits(e,t);var n=_createSuper(e);function e(t,r,o,a,i,c){var s;return _classCallCheck(this,e),(s=n.call(this,o,a,i,c)).command="Q",s._controlPoint=h(t,r,c?s.startPoint:f),s}return _createClass(e,[{key:"paramsToString",value:function(t){return d(t,this.controlPoint,this.endPoint)}},{key:"controlPoint",get:function(){return this._controlPoint}}]),e}(p),P=function(t){_inherits(e,t);var n=_createSuper(e);function e(t,r,o,a,i,c,s,l){var u;return _classCallCheck(this,e),(u=n.call(this,o,a,i,c,s,l)).command="C",u._firstControlPoint=h(t,r,l?u.startPoint:f),u}return _createClass(e,[{key:"paramsToString",value:function(t){return d(t,this.firstControlPoint,this.controlPoint,this.endPoint)}},{key:"firstControlPoint",get:function(){return this._firstControlPoint}}]),e}(k),x=function(){function t(n,e){_classCallCheck(this,t),this._node=n,this.command=e}return _createClass(t,[{key:"x",get:function(){var t=this._node,n=t.startPoint.x;return t.prev instanceof k&&(t.prev.command===t.command||t.prev.command===this.command)&&(n+=n-t.prev.controlPoint.x),n},set:function(t){}},{key:"y",get:function(){var t=this._node,n=t.startPoint.y;return t.prev instanceof k&&(t.prev.command===t.command||t.prev.command===this.command)&&(n+=n-t.prev.controlPoint.y),n},set:function(t){}}]),t}(),T=function(t){_inherits(e,t);var n=_createSuper(e);function e(t,r,o,a,i,c){var s;return _classCallCheck(this,e),(s=n.call(this,0,0,t,r,o,a,i,c)).command="S",s._firstControlPoint=new x(_assertThisInitialized(s),"C"),s}return _createClass(e,[{key:"paramsToString",value:function(t){return d(t,this.controlPoint,this.endPoint)}}]),e}(P),w=function(t){_inherits(e,t);var n=_createSuper(e);function e(t,r,o,a){var i;return _classCallCheck(this,e),(i=n.call(this,0,0,t,r,o,a)).command="T",i._controlPoint=new x(_assertThisInitialized(i),"Q"),i}return _createClass(e,[{key:"paramsToString",value:function(t){return d(t,this.endPoint)}}]),e}(k),M=function(t){_inherits(e,t);var n=_createSuper(e);function e(t,r,o,a,i,c,s,l,u){var f;return _classCallCheck(this,e),(f=n.call(this,c,s,l,u)).rx=t,f.ry=r,f.angle=o,f.largeArcFlag=a,f.sweepFlag=i,f.command="A",f}return _createClass(e,[{key:"paramsToString",value:function(t,n){return" ".concat(this.rx," ").concat(this.ry," ").concat(this.angle," ")+(!n===this.largeArcFlag?"1":"0")+(!n===this.sweepFlag?"1":"0")+d(t,this.endPoint)}},{key:"centerPoint",get:function(){var t=this.startPoint,n=this.endPoint,e=t.x,r=t.y,o=n.x,a=n.y,i=this.largeArcFlag,c=this.sweepFlag,s=Math.abs(this.rx),l=Math.abs(this.ry);if(0===s||0===l)return{x:(e+o)/2,y:(r+a)/2};var u=this.angle*Math.PI/180,f=Math.cos(u),h=Math.sin(u),d=(e-o)/2,p=(r-a)/2,b=f*d+h*p,m=-h*d+f*p,g=(b*b*l*l+m*m*s*s)/(s*s*l*l);g>1&&(s*=Math.sqrt(g),l*=Math.sqrt(g));var y=(i===c?-1:1)*Math.sqrt(Math.max(s*s*l*l-s*s*m*m-l*l*b*b,0)/(s*s*m*m+l*l*b*b)),v=y*s*m/l,C=y*-l*b/s;return{x:(f*v-h*C||0)+(e+o)/2,y:(h*v+f*C||0)+(r+a)/2}}}]),e}(p),U=/([MLHVZCSQTA])/gi,S=/[01]/,I=/[+-]?(([0-9]+(\.[0-9]*)?)|\.[0-9]+)/,B=/(([0-9]+(\.[0-9]*)?)|\.[0-9]+)/,O={M:{rexps:[I,I],build:function(t,n,e){return new p(+t[0],+t[1],n,e)}},L:{rexps:[I,I],build:function(t,n,e){return new b(+t[0],+t[1],n,e)}},H:{rexps:[I],build:function(t,n,e){return new g(+t[0],n,e)}},V:{rexps:[I],build:function(t,n,e){return new v(+t[0],n,e)}},Z:{rexps:[],build:function(t,n,e){return new _(n)}},C:{rexps:[I,I,I,I,I,I],build:function(t,n,e){return new P(+t[0],+t[1],+t[2],+t[3],+t[4],+t[5],n,e)}},S:{rexps:[I,I,I,I],build:function(t,n,e){return new T(+t[0],+t[1],+t[2],+t[3],n,e)}},Q:{rexps:[I,I,I,I],build:function(t,n,e){return new k(+t[0],+t[1],+t[2],+t[3],n,e)}},T:{rexps:[I,I],build:function(t,n,e){return new w(+t[0],+t[1],n,e)}},A:{rexps:[B,B,I,S,S,I,I],build:function(t,n,e){return new M(+t[0],+t[1],+t[2],"1"===t[3],"1"===t[4],+t[5],+t[6],n,e)}}},A=function(){function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";_classCallCheck(this,t),this.data=n}return _createClass(t,[{key:"moveTo",value:function(t){this.data=this.data.slice(t)}},{key:"read",value:function(t){t.lastIndex=0;var n=t.exec(this.data);if(null!==n){var e=n[0];return this.moveTo(n.index+e.length),e}return null}},{key:"readAll",value:function(t){var n,e=[],r=_createForOfIteratorHelper(t);try{for(r.s();!(n=r.n()).done;){var o=n.value,a=this.read(o);if(null===a)return null;e.push(a)}}catch(i){r.e(i)}finally{r.f()}return e}},{key:"data",set:function(t){this._data=t.trim()},get:function(){return this._data}}]),t}(),F=function(){function t(){_classCallCheck(this,t),this.nodes=[],this.points=[]}return _createClass(t,[{key:"fromString",value:function(t){for(var n=0,e=this.nodes,r=t.split(U),o=1;o+1<r.length;o+=2)for(var a=r[o],i=new A(r[o+1]);;){var c=O[a.toUpperCase()],s=i.readAll(c.rexps);if(null===s)break;if(e[n]=c.build(s,e[n-1],a.toLowerCase()===a),n++,!i.data||0===s.length)break;"M"===a?a="L":"m"===a&&(a="l")}e.length=n,this.updateControlPoints()}},{key:"toString",value:function(t,n){return this.nodes.map((function(n){return n.toString(t)})).join(n||"")}},{key:"updateControlPoints",value:function(){this.points.length=0;var t,n=_createForOfIteratorHelper(this.nodes);try{for(n.s();!(t=n.n()).done;){var e=t.value;if(!(e instanceof _)&&(this.points.push(e.endPoint),e instanceof k)){if(e instanceof P){var r=e.firstControlPoint;r instanceof x||this.points.push(r)}var o=e.controlPoint;o instanceof x||this.points.push(o)}}}catch(a){n.e(a)}finally{n.f()}}},{key:"getControlHandles",value:function(){var t,n="",e=_createForOfIteratorHelper(this.nodes);try{for(e.s();!(t=e.n()).done;){var r=t.value;if(r instanceof P){var o=r.startPoint,a=r.firstControlPoint,i=r.controlPoint,c=r.endPoint;a instanceof x||(n+="M".concat(o.x," ").concat(o.y,"L").concat(a.x," ").concat(a.y)),n+="M".concat(i.x," ").concat(i.y,"L").concat(c.x," ").concat(c.y)}else if(r instanceof k){var s=r.startPoint,l=r.controlPoint,u=r.endPoint;l instanceof x||(n+="M".concat(s.x," ").concat(s.y,"L").concat(l.x," ").concat(l.y,"L").concat(u.x," ").concat(u.y))}}}catch(f){e.e(f)}finally{e.f()}return n}},{key:"getReflectedControlHandles",value:function(){var t,n="",e=_createForOfIteratorHelper(this.nodes);try{for(e.s();!(t=e.n()).done;){var r=t.value;if(r instanceof T){var o=r.startPoint,a=r.firstControlPoint;n+="M".concat(o.x," ").concat(o.y,"L").concat(a.x," ").concat(a.y)}else if(r instanceof w){var i=r.startPoint,c=r.controlPoint,s=r.endPoint;n+="M".concat(i.x," ").concat(i.y,"L").concat(c.x," ").concat(c.y,"L").concat(s.x," ").concat(s.y)}else if(r instanceof M){var l=r.startPoint,u=r.centerPoint,h=r.endPoint;n+="M".concat(h.x," ").concat(h.y,"L").concat(u.x," ").concat(u.y,"L").concat(l.x," ").concat(l.y,"A").concat(r.paramsToString(f,!0))}}}catch(d){e.e(d)}finally{e.f()}return n}}]),t}(),L=e("fXoL"),D=e("XhcP"),z=e("/t3+"),H=e("bTqV"),R=e("NFeN"),j=e("1jcm"),q=e("MutI"),V=e("7EHt"),E=e("kmnG"),X=e("qFsG"),G=e("f0Cb");function W(t,n){1&t&&(L.Ub(0,"mat-action-list"),L.Cc(1," Some deferred content will be here. "),L.Tb())}function N(t,n){if(1&t&&(L.fc(),L.Pb(0,"image",27)),2&t){var e=L.gc();L.Cb("width",e.imageWidth+"%")("href",e.imageData)}}function Q(t,n){if(1&t){var e=L.Vb();L.fc(),L.Ub(0,"circle",28),L.cc("mousedown",(function(t){L.tc(e);var r=n.$implicit;return L.gc().controlPointMouseDown(t,r)})),L.Tb()}if(2&t){var r=n.$implicit;L.Cb("cx",r.x)("cy",r.y)}}function Y(t,n){if(1&t){var e=L.Vb();L.fc(),L.ec(),L.Ub(0,"button",29),L.cc("click",(function(){return L.tc(e),L.gc(),L.rc(2).open()})),L.Ub(1,"mat-icon"),L.Cc(2,"double_arrow"),L.Tb(),L.Tb()}}var Z,K=((Z=function(t){_inherits(e,t);var n=_createSuper(e);function e(t){var r;return _classCallCheck(this,e),(r=n.call(this))._renderer2=t,r._dragListener=new l.a,r._viewBox={x:0,y:0,width:1024,height:1024},r._pathDataInput="",r.pathModel=new F,r.imageData="",r.imageWidth=100,r.isPathStroke=!0,r.pathStrokeColor="#ff00ff",r.isPathFill=!1,r.pathFillColor="#04040f",r}return _createClass(e,[{key:"ngOnInit",value:function(){var t=this;this._addSubscription(this._dragListener.dragChange.subscribe((function(n){switch(n){case"DragMove":var e=t._dragListener.data,r=e.point,o=Math.floor(t._dragListener.deltaX),a=Math.floor(t._dragListener.deltaY);r.x=e.startX+o,r.y=e.startY+a}}))),this.pathDataInput="M205 698\nc-17-194 169-280 169-408s-24-259 127-274s177 84 174 243s218 217 164 452\nc43 15 31 74 55 97s50 71-18 97s-75 47-107 77s-129 64-154-28\nc-45 7-47-8-95-7s-59 10-108 13\nc-35 78-151 26-174 13s-94-9-124-25s-23-52-12-83s-26-87 30-107s40-29 73-60z\nm-9 30\nc-20 39-66 34-76 51s-12 23-4 64s-18 40-7 78s104 16 156 50s139 24 141-36s-70-102-90-157s-74-120-120-50z\nm103-60\nc-56-80 35-193 26-195s-63 84-59 160s86 96 111 126s59 83-4 85\nq20 22 31 40\na150 100-8 00 217-10\nc33-30 4-182 71-192\nc-4-74 116-10 116 7s4 21 10 16s12-38-59-66\nc20-83-54-183-71-182s85 65 51 175\nq-9-4-22-3\nc-21-119-82-163-117-316\nq-12 18-37 30t-30 15\nq-55 33-90 4t-40-28\nc-5 121-100 220-104 334z\nm390 28\nc-44 17-26 115-47 172s-23 102 16 124s80 6 119-34s68-55 102-69\nq57-20 4-74\nc-30-41-15-64-32-82s-28-14-50-12\nq-88 76-112-25z\nm9-3\nc12 73 93 20 85-3s-89-65-85 3\nm-100-403\nc-5-29-46-27-77-47s-66-11-84 6s-48 34-48 50s16 25 43 45s41 39 90 11s79-30 76-65z\nm-14-29\na51 65 2 10-86-34l24 9a23 36 0 11 37 17z\nm-120-34\na38 56-1 10-55 38l15-11a16 28-4 11 18-17z\nm-61 65\nc81 80 122 15 173-2v5c-52 27-103 80-174 3z"}},{key:"controlPointMouseDown",value:function(t,n){0===t.button&&(t.preventDefault(),this._dragListener.mouseStart(t,this._renderer2,{point:n,startX:n.x,startY:n.y}))}},{key:"convertInput",value:function(t){this._pathDataInput=this.pathModel.toString(t,"\n")}},{key:"loadImage",value:function(t){var n=this,e=t.target;if(e&&e.files[0]){var r=e.files[0];if(r.type.startsWith("image")){var o=new FileReader;o.onload=function(t){"string"==typeof o.result&&(n.imageData=o.result)},o.readAsDataURL(r)}}}},{key:"trackByIndex",value:function(t){return t}},{key:"viewBox",get:function(){var t=this._viewBox;return"".concat(t.x," ").concat(t.y," ").concat(t.width," ").concat(t.height)}},{key:"x",get:function(){return this._viewBox.x},set:function(t){this._viewBox.x=+t||0}},{key:"y",get:function(){return this._viewBox.y},set:function(t){this._viewBox.y=+t||0}},{key:"width",get:function(){return this._viewBox.width},set:function(t){this._viewBox.width=+t||0}},{key:"height",get:function(){return this._viewBox.height},set:function(t){this._viewBox.height=+t||0}},{key:"pathDataInput",get:function(){return this._pathDataInput},set:function(t){this._pathDataInput!==t&&(this._pathDataInput=t,this.pathModel.fromString(t))}}]),e}(u.a)).\u0275fac=function(t){return new(t||Z)(L.Ob(L.E))},Z.\u0275cmp=L.Ib({type:Z,selectors:[["app-svg-path-editor"]],features:[L.yb],decls:95,vars:28,consts:[["drawer",""],["color","primary"],["mat-icon-button","",3,"click"],[1,"flex-space-filler-1"],["color","primary",3,"checked","change"],["mat-subheader",""],["matInput","","type","number","name","inputX",3,"ngModel","ngModelChange"],["matInput","","type","number","name","inputY",3,"ngModel","ngModelChange"],["matInput","","type","number","name","inputW",3,"ngModel","ngModelChange"],["matInput","","type","number","name","inputH",3,"ngModel","ngModelChange"],["type","file","placeholder","file...",3,"multiple","change"],["matInput","","type","number","name","inputZ","min","1","step","1",3,"ngModel","ngModelChange"],["matInput","","name","inputS","type","color","placeholder","color",3,"disabled","ngModel","ngModelChange"],[3,"ngModel","ngModelChange"],["matInput","","name","inputF","type","color","placeholder","color",3,"disabled","ngModel","ngModelChange"],[2,"width","100%"],["matInput","","name","inputD","matTextareaAutosize","","matAutosizeMinRows","4","placeholder","Place any SVG path data here",3,"ngModel","ngModelChange"],["mat-stroked-button","","color","primary",3,"click"],["matExpansionPanelContent",""],[2,"display","inline-block","border","1px solid #ffaa22"],["x","0","y","0",4,"ngIf"],["opacity","0.9","stroke-width","1"],["opacity","0.5","stroke-width","0.8","stroke","lightgrey","fill","none"],["stroke-dasharray","2"],["opacity","0.5","stroke","black","fill","#ff0"],["r","5",3,"mousedown",4,"ngFor","ngForOf","ngForTrackBy"],["class","sidenav-open-button","mat-icon-button","","color","primary","style","position: absolute; left: 0; top: 0",3,"click",4,"ngIf"],["x","0","y","0"],["r","5",3,"mousedown"],["mat-icon-button","","color","primary",1,"sidenav-open-button",2,"position","absolute","left","0","top","0",3,"click"]],template:function(t,n){if(1&t){var e=L.Vb();L.Ub(0,"mat-sidenav-container"),L.Ub(1,"mat-sidenav",null,0),L.Ub(3,"mat-toolbar",1),L.Ub(4,"button",2),L.cc("click",(function(){return L.tc(e),L.rc(2).close()})),L.Ub(5,"mat-icon"),L.Cc(6,"close"),L.Tb(),L.Tb(),L.Pb(7,"span",3),L.Ub(8,"span"),L.Cc(9,"SVG Path Editor"),L.Tb(),L.Pb(10,"span",3),L.Ub(11,"mat-slide-toggle",4),L.cc("change",(function(t){return L.tc(e),L.rc(2).mode=t.checked?"side":"over"})),L.Tb(),L.Tb(),L.Ub(12,"mat-action-list"),L.Ub(13,"div",5),L.Cc(14,"Actions:"),L.Tb(),L.Ub(15,"mat-accordion"),L.Ub(16,"mat-expansion-panel"),L.Ub(17,"mat-expansion-panel-header"),L.Ub(18,"mat-icon"),L.Cc(19,"image_aspect_ratio"),L.Tb(),L.Cc(20,"Viewbox "),L.Tb(),L.Ub(21,"p"),L.Cc(22,"The position and dimension, in user space, of an SVG viewport."),L.Tb(),L.Ub(23,"mat-form-field"),L.Ub(24,"mat-label"),L.Cc(25,"x:"),L.Tb(),L.Ub(26,"input",6),L.cc("ngModelChange",(function(t){return n.x=t})),L.Tb(),L.Tb(),L.Ub(27,"mat-form-field"),L.Ub(28,"mat-label"),L.Cc(29,"y:"),L.Tb(),L.Ub(30,"input",7),L.cc("ngModelChange",(function(t){return n.y=t})),L.Tb(),L.Tb(),L.Ub(31,"mat-form-field"),L.Ub(32,"mat-label"),L.Cc(33,"width:"),L.Tb(),L.Ub(34,"input",8),L.cc("ngModelChange",(function(t){return n.width=t})),L.Tb(),L.Tb(),L.Ub(35,"mat-form-field"),L.Ub(36,"mat-label"),L.Cc(37,"height:"),L.Tb(),L.Ub(38,"input",9),L.cc("ngModelChange",(function(t){return n.height=t})),L.Tb(),L.Tb(),L.Tb(),L.Ub(39,"mat-expansion-panel"),L.Ub(40,"mat-expansion-panel-header"),L.Ub(41,"mat-icon"),L.Cc(42,"image"),L.Tb(),L.Cc(43,"Background "),L.Tb(),L.Ub(44,"label"),L.Cc(45,"Upload image: "),L.Ub(46,"input",10),L.cc("change",(function(t){return n.loadImage(t)})),L.Tb(),L.Tb(),L.Ub(47,"mat-form-field"),L.Ub(48,"mat-label"),L.Cc(49,"width (%):"),L.Tb(),L.Ub(50,"input",11),L.cc("ngModelChange",(function(t){return n.imageWidth=t})),L.Tb(),L.Tb(),L.Tb(),L.Ub(51,"mat-expansion-panel"),L.Ub(52,"mat-expansion-panel-header"),L.Ub(53,"mat-icon"),L.Cc(54,"design_services"),L.Tb(),L.Cc(55,"Path "),L.Tb(),L.Ub(56,"mat-form-field"),L.Ub(57,"mat-label"),L.Cc(58,"Color"),L.Tb(),L.Ub(59,"input",12),L.cc("ngModelChange",(function(t){return n.pathStrokeColor=t})),L.Tb(),L.Tb(),L.Ub(60,"mat-slide-toggle",13),L.cc("ngModelChange",(function(t){return n.isPathStroke=t})),L.Cc(61,"Stroke"),L.Tb(),L.Ub(62,"mat-form-field"),L.Ub(63,"mat-label"),L.Cc(64,"Color"),L.Tb(),L.Ub(65,"input",14),L.cc("ngModelChange",(function(t){return n.pathFillColor=t})),L.Tb(),L.Tb(),L.Ub(66,"mat-slide-toggle",13),L.cc("ngModelChange",(function(t){return n.isPathFill=t})),L.Cc(67,"Fill"),L.Tb(),L.Ub(68,"mat-form-field",15),L.Ub(69,"mat-label"),L.Cc(70,"SVG path data:"),L.Tb(),L.Ub(71,"textarea",16),L.cc("ngModelChange",(function(t){return n.pathDataInput=t})),L.Tb(),L.Tb(),L.Ub(72,"button",17),L.cc("click",(function(){return n.convertInput(!1)})),L.Cc(73,"To absolute"),L.Tb(),L.Ub(74,"button",17),L.cc("click",(function(){return n.convertInput(!0)})),L.Cc(75,"To relative"),L.Tb(),L.Tb(),L.Ub(76,"mat-expansion-panel"),L.Ub(77,"mat-expansion-panel-header"),L.Ub(78,"mat-icon"),L.Cc(79,"assignment"),L.Tb(),L.Cc(80,"Commands "),L.Tb(),L.Ac(81,W,2,0,"ng-template",18),L.Tb(),L.Tb(),L.Tb(),L.Pb(82,"span",3),L.Pb(83,"mat-divider"),L.Tb(),L.Ub(84,"mat-sidenav-content"),L.Ub(85,"div",19),L.fc(),L.Ub(86,"svg"),L.Ac(87,N,1,2,"image",20),L.Pb(88,"path",21),L.Ub(89,"g",22),L.Pb(90,"path"),L.Pb(91,"path",23),L.Tb(),L.Ub(92,"g",24),L.Ac(93,Q,1,2,"circle",25),L.Tb(),L.Tb(),L.Ac(94,Y,3,0,"button",26),L.Tb(),L.Tb(),L.Tb()}if(2&t){var r=L.rc(2);L.Bb(11),L.mc("checked","side"===r.mode),L.Bb(15),L.mc("ngModel",n.x),L.Bb(4),L.mc("ngModel",n.y),L.Bb(4),L.mc("ngModel",n.width),L.Bb(4),L.mc("ngModel",n.height),L.Bb(8),L.mc("multiple",!1),L.Bb(4),L.mc("ngModel",n.imageWidth),L.Bb(9),L.mc("disabled",!n.isPathStroke)("ngModel",n.pathStrokeColor),L.Bb(1),L.mc("ngModel",n.isPathStroke),L.Bb(5),L.mc("disabled",!n.isPathFill)("ngModel",n.pathFillColor),L.Bb(1),L.mc("ngModel",n.isPathFill),L.Bb(5),L.mc("ngModel",n.pathDataInput),L.Bb(14),L.zc("width",n.width,"px")("height",n.height,"px"),L.Bb(1),L.Cb("viewBox",n.viewBox),L.Bb(1),L.mc("ngIf",n.imageData),L.Bb(1),L.Cb("stroke",n.isPathStroke?n.pathStrokeColor:"none")("fill",n.isPathFill?n.pathFillColor:"none")("d",n.pathModel.toString()),L.Bb(2),L.Cb("d",n.pathModel.getControlHandles()),L.Bb(1),L.Cb("d",n.pathModel.getReflectedControlHandles()),L.Bb(2),L.mc("ngForOf",n.pathModel.points)("ngForTrackBy",n.trackByIndex),L.Bb(1),L.mc("ngIf",!r.opened)}},directives:[D.b,D.a,z.a,H.a,R.a,j.a,q.a,q.d,V.a,V.c,V.e,E.b,E.e,X.a,a.m,a.b,a.i,a.l,X.c,V.d,G.a,D.c,r.l,r.k],styles:["mat-sidenav-container[_ngcontent-%COMP%]{width:100%;height:100%;background-color:#282828}mat-sidenav-container[_ngcontent-%COMP%]   mat-sidenav[_ngcontent-%COMP%]{min-width:280px}@-webkit-keyframes keyframes-fade-in{0%{opacity:0}to{opacity:1}}@keyframes keyframes-fade-in{0%{opacity:0}to{opacity:1}}.sidenav-open-button[_ngcontent-%COMP%]{-webkit-animation:keyframes-fade-in 3s ease 1;animation:keyframes-fade-in 3s ease 1}mat-expansion-panel[_ngcontent-%COMP%]{max-width:26em}"]}),Z);e.d(n,"SvgPathEditorModule",(function(){return tt}));var $,J=[{path:"",component:K}],tt=(($=function t(){_classCallCheck(this,t)}).\u0275mod=L.Mb({type:$}),$.\u0275inj=L.Lb({factory:function(t){return new(t||$)},providers:[],imports:[[o.c.forChild(J),r.c,a.d,i.b,s.a,c.a],o.c]}),$)}}]);