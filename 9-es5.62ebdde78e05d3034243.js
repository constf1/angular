function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(t){var e=_isNativeReflectConstruct();return function(){var n,a=_getPrototypeOf(t);if(e){var r=_getPrototypeOf(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return _possibleConstructorReturn(this,n)}}function _possibleConstructorReturn(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _createForOfIteratorHelper(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var a=0,r=function(){};return{s:r,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==n.return||n.return()}finally{if(c)throw o}}}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{mUt8:function(t,e,n){"use strict";n.r(e);var a,r,o=n("ofXK"),i=n("tyNb"),c=n("3Pt+"),l=n("tk/3"),s=n("pKmL"),u=n("hctd"),f=n("fXoL"),b=n("SeXe"),p=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";_classCallCheck(this,t),this.data=e}return _createClass(t,[{key:"moveTo",value:function(t){this.data=this.data.slice(t)}},{key:"read",value:function(t){t.lastIndex=0;var e=t.exec(this.data);if(null!==e){var n=e[0];return this.moveTo(e.index+n.length),n}return null}},{key:"readAll",value:function(t){var e,n=[],a=_createForOfIteratorHelper(t);try{for(a.s();!(e=a.n()).done;){var r=e.value,o=this.read(r);if(null===o)return null;n.push(o)}}catch(i){a.e(i)}finally{a.f()}return n}},{key:"data",set:function(t){this._data=t.trim()},get:function(){return this._data}}]),t}(),d=/([MLHVZCSQTA])/gi,m=/[01]/,h=/[+-]?(([0-9]+(\.[0-9]*)?)|\.[0-9]+)/,y=/(([0-9]+(\.[0-9]*)?)|\.[0-9]+)/,v={M:[h,h],L:[h,h],H:[h],V:[h],Z:[],C:[h,h,h,h,h,h],S:[h,h,h,h],Q:[h,h,h,h],T:[h,h],A:[y,y,h,m,m,h,h]},g={inputData:"",validData:"",tokens:[]},_=((a=function(t){_inherits(n,t);var e=_createSuper(n);function n(){return _classCallCheck(this,n),e.call(this,g)}return _createClass(n,[{key:"setData",value:function(t){if(t!==this.state.inputData){var e,n=function(t){for(var e=[],n=t.split(d),a=1;a+1<n.length;a+=2)for(var r=n[a],o=new p(n[a+1]);;){var i=o.readAll(v[r.toUpperCase()]);if(null===i){console.warn("Couldn't properly parse this expression:",n[a],n[a+1],o.data);break}if(e.push([r].concat(_toConsumableArray(i))),!o.data||0===i.length)break;"M"===r?r="L":"m"===r&&(r="l")}return e}(t),a="",r=_createForOfIteratorHelper(n);try{for(r.s();!(e=r.n()).done;)a+=e.value.join(" ")}catch(o){r.e(o)}finally{r.f()}this._set({inputData:t,tokens:n,validData:a})}}}]),n}(b.a)).\u0275fac=function(t){return new(t||a)},a.\u0275prov=f.Kb({token:a,factory:a.\u0275fac}),a),T=n("0IaG"),C=n("kmnG"),k=n("qFsG"),U=n("f0Cb"),w=n("bTqV"),P=n("NFeN"),O=((r=function(){function t(e){_classCallCheck(this,t),this.pathService=e}return _createClass(t,[{key:"ngOnInit",value:function(){}},{key:"onPathChange",value:function(t){console.log("New Path:",t)}},{key:"pathData",get:function(){return this.pathService.state.inputData},set:function(t){this.pathService.setData(t)}}]),t}()).\u0275fac=function(t){return new(t||r)(f.Ob(_))},r.\u0275cmp=f.Ib({type:r,selectors:[["app-path-dialog"]],decls:20,vars:1,consts:[["mat-dialog-title",""],[1,"mat-typography"],["name","path-data","matInput","","matTextareaAutosize","","matAutosizeMinRows","4","placeholder","Place any SVG path data here",3,"ngModel","ngModelChange"],["align","center"],["mat-button",""],["mat-button","","matDialogClose","","cdkFocusInitial",""]],template:function(t,e){1&t&&(f.Ub(0,"h2",0),f.Cc(1,"SVG Path"),f.Tb(),f.Ub(2,"mat-dialog-content",1),f.Ub(3,"form"),f.Ub(4,"mat-form-field"),f.Ub(5,"mat-label"),f.Cc(6,"SVG path data:"),f.Tb(),f.Ub(7,"textarea",2),f.cc("ngModelChange",(function(t){return e.pathData=t})),f.Tb(),f.Tb(),f.Tb(),f.Tb(),f.Pb(8,"mat-divider"),f.Ub(9,"mat-dialog-actions",3),f.Ub(10,"button",4),f.Ub(11,"mat-icon"),f.Cc(12,"settings_backup_restore"),f.Tb(),f.Ub(13,"label"),f.Cc(14,"RESET"),f.Tb(),f.Tb(),f.Ub(15,"button",5),f.Ub(16,"mat-icon"),f.Cc(17,"close"),f.Tb(),f.Ub(18,"label"),f.Cc(19,"CLOSE"),f.Tb(),f.Tb(),f.Tb()),2&t&&(f.Bb(7),f.mc("ngModel",e.pathData))},directives:[T.g,T.e,c.m,c.j,c.k,C.b,C.e,k.a,k.c,c.b,c.i,c.l,U.a,T.c,w.a,P.a,T.d],styles:["mat-form-field[_ngcontent-%COMP%]{min-width:50vw}"]}),r),A=n("jhN1"),I=n("XhcP"),S=n("/t3+"),D=n("1jcm"),j=n("MutI");function M(t,e){if(1&t&&(f.Ub(0,"mat-list-item",15),f.Cc(1),f.Tb()),2&t){var n=e.$implicit;f.Bb(1),f.Dc(n[0])}}function x(t,e){if(1&t&&(f.fc(),f.Pb(0,"image",16)),2&t){var n=f.gc();f.Cb("href",n.image)}}function R(t,e){if(1&t){var n=f.Vb();f.fc(),f.ec(),f.Ub(0,"button",17),f.cc("click",(function(){return f.tc(n),f.gc(),f.rc(2).open()})),f.Ub(1,"mat-icon"),f.Cc(2,"double_arrow"),f.Tb(),f.Tb()}}var L,E=((L=function(){function t(e,n,a){_classCallCheck(this,t),this.dialog=e,this.pathService=n,this.sanitizer=a,this.image=""}return _createClass(t,[{key:"ngOnInit",value:function(){}},{key:"openPathDialog",value:function(){this.dialog.open(O,{maxHeight:"100vh"})}},{key:"loadImage",value:function(t){var e=this,n=t.target;if(n&&n.files[0]){var a=n.files[0];if(a.type.startsWith("image")){var r=new FileReader;r.onload=function(t){"string"==typeof r.result&&(e.image=r.result,console.log("Loaded:",r.result.substring(0,100)))},r.readAsDataURL(a)}}}}]),t}()).\u0275fac=function(t){return new(t||L)(f.Ob(T.b),f.Ob(_),f.Ob(A.b))},L.\u0275cmp=f.Ib({type:L,selectors:[["app-sidenav"]],decls:42,vars:6,consts:[["drawer",""],["color","primary"],["mat-icon-button","",3,"click"],[1,"flex-space-filler-1"],["color","primary",3,"checked","change"],["mat-subheader",""],[3,"click"],[2,"cursor","pointer"],["type","file","placeholder","Upload file...",3,"multiple","change"],["role","listitem",4,"ngFor","ngForOf"],[2,"position","relative"],["viewBox","0 0 1024 1024"],["width","100%","x","0","y","0",4,"ngIf"],["stroke","magenta","stroke-opacity","0.9","fill","none","stroke-width","1"],["class","sidenav-open-button","mat-icon-button","","color","primary","style","position: absolute; left: 0; top: 0",3,"click",4,"ngIf"],["role","listitem"],["width","100%","x","0","y","0"],["mat-icon-button","","color","primary",1,"sidenav-open-button",2,"position","absolute","left","0","top","0",3,"click"]],template:function(t,e){if(1&t){var n=f.Vb();f.Ub(0,"mat-sidenav-container"),f.Ub(1,"mat-sidenav",null,0),f.Ub(3,"mat-toolbar",1),f.Ub(4,"button",2),f.cc("click",(function(){return f.tc(n),f.rc(2).close()})),f.Ub(5,"mat-icon"),f.Cc(6,"close"),f.Tb(),f.Tb(),f.Pb(7,"span",3),f.Ub(8,"span"),f.Cc(9,"SVG Path Editor"),f.Tb(),f.Pb(10,"span",3),f.Ub(11,"mat-slide-toggle",4),f.cc("change",(function(t){return f.tc(n),f.rc(2).mode=t.checked?"side":"over"})),f.Tb(),f.Tb(),f.Ub(12,"mat-action-list"),f.Ub(13,"div",5),f.Cc(14,"Actions:"),f.Tb(),f.Ub(15,"mat-list"),f.Ub(16,"mat-list-item"),f.Ub(17,"mat-icon"),f.Cc(18,"image_aspect_ratio"),f.Tb(),f.Cc(19,"VIEWBOX "),f.Tb(),f.Ub(20,"mat-list-item",6),f.cc("click",(function(){return e.openPathDialog()})),f.Ub(21,"mat-icon"),f.Cc(22,"design_services"),f.Tb(),f.Cc(23,"PATH DATA "),f.Tb(),f.Ub(24,"mat-list-item"),f.Ub(25,"label",7),f.Ub(26,"mat-icon"),f.Cc(27,"image"),f.Tb(),f.Cc(28,"Image "),f.Ub(29,"input",8),f.cc("change",(function(t){return e.loadImage(t)})),f.Tb(),f.Tb(),f.Tb(),f.Tb(),f.Tb(),f.Pb(30,"span",3),f.Pb(31,"mat-divider"),f.Ub(32,"mat-action-list"),f.Ub(33,"div",5),f.Cc(34,"Draw Commands:"),f.Tb(),f.Ac(35,M,2,1,"mat-list-item",9),f.Tb(),f.Tb(),f.Ub(36,"mat-sidenav-content"),f.Ub(37,"div",10),f.fc(),f.Ub(38,"svg",11),f.Ac(39,x,1,1,"image",12),f.Pb(40,"path",13),f.Tb(),f.Ac(41,R,3,0,"button",14),f.Tb(),f.Tb(),f.Tb()}if(2&t){var a=f.rc(2);f.Bb(11),f.mc("checked","side"===a.mode),f.Bb(18),f.mc("multiple",!1),f.Bb(6),f.mc("ngForOf",e.pathService.state.tokens),f.Bb(4),f.mc("ngIf",e.image),f.Bb(1),f.Cb("d",e.pathService.state.validData),f.Bb(1),f.mc("ngIf",!a.opened)}},directives:[I.b,I.a,S.a,w.a,P.a,D.a,j.a,j.d,j.b,U.a,o.k,I.c,o.l],styles:["mat-sidenav-container[_ngcontent-%COMP%]{width:100%;height:100%;background-color:#deb887}mat-sidenav-container[_ngcontent-%COMP%]   mat-sidenav[_ngcontent-%COMP%]{min-width:280px}@-webkit-keyframes keyframes-fade-in{0%{opacity:0}to{opacity:1}}@keyframes keyframes-fade-in{0%{opacity:0}to{opacity:1}}.sidenav-open-button[_ngcontent-%COMP%]{-webkit-animation:keyframes-fade-in 3s ease 1;animation:keyframes-fade-in 3s ease 1}"]}),L);n.d(e,"SvgPathEditorModule",(function(){return V}));var B,F=[{path:"",component:E}],V=((B=function t(){_classCallCheck(this,t)}).\u0275mod=f.Mb({type:B}),B.\u0275inj=f.Lb({factory:function(t){return new(t||B)},providers:[_],imports:[[i.c.forChild(F),o.c,c.d,l.b,u.a,s.a],i.c]}),B)}}]);