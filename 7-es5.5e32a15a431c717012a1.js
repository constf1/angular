function _defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function _createForOfIteratorHelper(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,a=function(){};return{s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==n.return||n.return()}finally{if(c)throw o}}}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{C9RU:function(t,e,n){"use strict";n.r(e);var r=n("ofXK"),a=n("3Pt+"),o=n("tyNb"),i=n("hctd"),c=n("pKmL");function p(t,e){return{name:"subtraction",operator:{name:"minus",notation:"-"},first:{name:"minuend",value:t},second:{name:"subtrahend",value:e},result:{name:"difference",value:t-e}}}var s=n("dPmG"),u=n("fKvJ"),d=n("voYn"),g=n("bgvp"),l=n("fXoL"),m=n("NFeN"),f=n("jhN1");function b(t,e){if(1&t&&(l.fc(),l.Pb(0,"path",7)),2&t){var n=e.$implicit;l.mc("ngStyle",n.style),l.Cb("d",n.d)}}var h,C,x=["*"],O=((h=function(){function t(){_classCallCheck(this,t),this.rowNum=41,this.colNum=34,this.paths=[{d:"M".concat(24*(this.colNum-4)," 0v").concat(this.height),style:{fill:"none",stroke:"#f00",strokeWidth:"2px"}}]}return _createClass(t,[{key:"ngOnInit",value:function(){}},{key:"width",get:function(){return 24*this.colNum}},{key:"height",get:function(){return 24*this.rowNum}}]),t}()).\u0275fac=function(t){return new(t||h)},h.\u0275cmp=l.Ib({type:h,selectors:[["app-squared-paper"]],inputs:{rowNum:"rowNum",colNum:"colNum",paths:"paths"},ngContentSelectors:x,decls:10,vars:7,consts:[[1,"squared-paper"],[1,"squared-paper-bg"],["id","patternSquaredPaper","x","0","y","0","width","24","height","24","patternUnits","userSpaceOnUse"],["fill","none","stroke","#00f","stroke-width",".25","d","M0 0h24v24H0z"],["width","100%","height","100%","fill","url(#patternSquaredPaper)"],[3,"ngStyle",4,"ngFor","ngForOf"],[1,"squared-paper-fg"],[3,"ngStyle"]],template:function(t,e){1&t&&(l.lc(),l.Ub(0,"div",0),l.Ub(1,"div",1),l.fc(),l.Ub(2,"svg"),l.Ub(3,"defs"),l.Ub(4,"pattern",2),l.Pb(5,"path",3),l.Tb(),l.Tb(),l.Pb(6,"rect",4),l.zc(7,b,1,2,"path",5),l.Tb(),l.Tb(),l.ec(),l.Ub(8,"div",6),l.kc(9),l.Tb(),l.Tb()),2&t&&(l.yc("width",e.width,"px")("height",e.height,"px"),l.Bb(2),l.Cb("width",e.width)("height",e.height),l.Bb(5),l.mc("ngForOf",e.paths))},directives:[r.k,r.m],styles:[".squared-paper[_ngcontent-%COMP%]{position:relative;margin-left:1px;margin-top:1px;background-color:#f5f5f5;font-family:Fira Mono,monospace;font-weight:500;font-size:20px;line-height:24px}.squared-paper-bg[_ngcontent-%COMP%]{width:100%;height:100%}.squared-paper-fg[_ngcontent-%COMP%]{position:absolute;left:0;right:0;top:0;bottom:0}.squared-paper-par[_ngcontent-%COMP%]{text-indent:48px;padding-left:6px;margin-bottom:24px}.squared-paper-text-indent-1[_ngcontent-%COMP%]{text-indent:24px}.squared-paper-text-indent-2[_ngcontent-%COMP%]{text-indent:48px}.squared-paper-text-indent-3[_ngcontent-%COMP%]{text-indent:72px}.squared-paper-text-indent-4[_ngcontent-%COMP%]{text-indent:96px}.squared-paper-pl[_ngcontent-%COMP%]{padding-left:6px}.squared-paper-pr[_ngcontent-%COMP%]{padding-right:6px}.squared-paper-margin-1[_ngcontent-%COMP%]{margin:24px}.squared-paper-margin-2[_ngcontent-%COMP%]{margin:48px}.squared-paper-margin-3[_ngcontent-%COMP%]{margin:72px}.squared-paper-margin-4[_ngcontent-%COMP%]{margin:96px}.squared-paper-mb-1[_ngcontent-%COMP%]{margin-bottom:24px}.squared-paper-ml-1[_ngcontent-%COMP%]{margin-left:24px}.squared-paper-mr-1[_ngcontent-%COMP%]{margin-right:24px}.squared-paper-mt-1[_ngcontent-%COMP%]{margin-top:24px}.squared-paper-mb-2[_ngcontent-%COMP%]{margin-bottom:48px}.squared-paper-ml-2[_ngcontent-%COMP%]{margin-left:48px}.squared-paper-mr-2[_ngcontent-%COMP%]{margin-right:48px}.squared-paper-mt-2[_ngcontent-%COMP%]{margin-top:48px}.squared-paper-mb-3[_ngcontent-%COMP%]{margin-bottom:72px}.squared-paper-ml-3[_ngcontent-%COMP%]{margin-left:72px}.squared-paper-mr-3[_ngcontent-%COMP%]{margin-right:72px}.squared-paper-mt-3[_ngcontent-%COMP%]{margin-top:72px}.squared-paper-mb-4[_ngcontent-%COMP%]{margin-bottom:96px}.squared-paper-ml-4[_ngcontent-%COMP%]{margin-left:96px}.squared-paper-mr-4[_ngcontent-%COMP%]{margin-right:96px}.squared-paper-mt-4[_ngcontent-%COMP%]{margin-top:96px}.squared-paper-teacher[_ngcontent-%COMP%]{font-family:Pacifico,cursive;font-weight:400;font-size:32px;color:red;letter-spacing:normal}.squared-paper-spacing[_ngcontent-%COMP%]{letter-spacing:12px}.squared-paper-col-3[_ngcontent-%COMP%], .squared-paper-col-12[_ngcontent-%COMP%], .squared-paper-col-15[_ngcontent-%COMP%], .squared-paper-col-30[_ngcontent-%COMP%]{display:inline-block}.squared-paper-col-3[_ngcontent-%COMP%]{width:72px}.squared-paper-col-12[_ngcontent-%COMP%]{width:288px}.squared-paper-col-15[_ngcontent-%COMP%]{width:360px}.squared-paper-col-30[_ngcontent-%COMP%]{width:720px}"]}),h),_=n("bTqV"),M=((C=function(){function t(e){_classCallCheck(this,t),this._ref=e}return _createClass(t,[{key:"ngAfterViewInit",value:function(){var t=this;setTimeout((function(){var e,n=null===(e=t._ref)||void 0===e?void 0:e.nativeElement;n&&n.focus()}))}}]),t}()).\u0275fac=function(t){return new(t||C)(l.Ob(l.l))},C.\u0275dir=l.Jb({type:C,selectors:[["","appFocus",""]]}),C),q=n("STbY"),P=["itemInputs"];function v(t,e){if(1&t&&l.Pb(0,"mat-icon",14),2&t){var n=l.gc();l.Fb("step1",1===n.todayVictories)("step2",2===n.todayVictories)("step3",3===n.todayVictories)("step4",4===n.todayVictories)("step5",n.todayVictories>=5)("animate",n.victoryAnimation)}}function y(t,e){1&t&&(l.Ub(0,"div",24),l.Bc(1,"\u2713"),l.Tb())}function k(t,e){if(1&t&&(l.Sb(0),l.Ub(1,"span",26),l.Bc(2),l.Tb(),l.Ub(3,"span",27),l.Bc(4,"="),l.Tb(),l.Rb()),2&t){var n=l.gc(2).$implicit;l.Bb(1),l.mc("title",n.expression.second.name),l.Bb(1),l.Cc(n.expression.second.value)}}function I(t,e){if(1&t&&(l.Ub(0,"label",25),l.Ub(1,"span",26),l.Bc(2),l.Tb(),l.Ub(3,"span",26),l.Bc(4),l.Tb(),l.zc(5,k,5,2,"ng-container",10),l.Tb()),2&t){var n=l.gc().$implicit;l.mc("for",n.inputName),l.Bb(1),l.mc("title",n.expression.first.name),l.Bb(1),l.Cc(n.expression.first.value),l.Bb(1),l.mc("title",n.expression.operator.name),l.Bb(1),l.Cc(n.expression.operator.notation),l.Bb(1),l.mc("ngIf","second"!==n.inputIndex)}}function T(t,e){if(1&t&&(l.Sb(0),l.Ub(1,"span",26),l.Bc(2),l.Tb(),l.Ub(3,"span",26),l.Bc(4),l.Tb(),l.Rb()),2&t){var n=l.gc(2).$implicit;l.Bb(1),l.mc("title",n.expression.operator.name),l.Bb(1),l.Cc(n.expression.operator.notation),l.Bb(1),l.mc("title",n.expression.second.name),l.Bb(1),l.Cc(n.expression.second.value)}}function B(t,e){if(1&t&&(l.Ub(0,"label",28),l.zc(1,T,5,4,"ng-container",10),l.Ub(2,"span",27),l.Bc(3,"="),l.Tb(),l.Ub(4,"span",26),l.Bc(5),l.Tb(),l.Tb()),2&t){var n=l.gc().$implicit;l.mc("for",n.inputName),l.Bb(1),l.mc("ngIf","second"!==n.inputIndex),l.Bb(3),l.mc("title",n.expression.result.name),l.Bb(1),l.Cc(n.expression.result.value)}}function w(t,e){if(1&t){var n=l.Vb();l.Ub(0,"div",15),l.Ub(1,"div",16),l.zc(2,y,2,0,"div",17),l.Tb(),l.Ub(3,"div",18),l.Ub(4,"div",19),l.zc(5,I,6,6,"label",20),l.Ub(6,"input",21,22),l.cc("ngModelChange",(function(t){l.tc(n);var r=e.index,a=e.$implicit;return l.gc().onInputChange(r,a.inputValue=t)}))("keyup.Enter",(function(){l.tc(n);var t=e.index;return l.gc().onInputEnter(t)}))("focus",(function(t){l.tc(n);var r=e.index,a=l.gc(),o=l.rc(8);return a.onInputFocus(t,o,r)})),l.Tb(),l.zc(8,B,6,4,"label",23),l.Tb(),l.Tb(),l.Tb()}if(2&t){var r=e.$implicit,a=l.gc();l.Bb(2),l.mc("ngIf",r.isChecked&&r.isValid),l.Bb(3),l.mc("ngIf","first"!==r.inputIndex),l.Bb(1),l.Fb("invalid",r.isChecked&&!r.isValid),l.mc("id",r.inputName)("name",r.inputName)("readonly","active"!==a.status)("ngModel",r.inputValue),l.Cb("maxlength",r.inputLength),l.Bb(2),l.mc("ngIf","result"!==r.inputIndex)}}function U(t,e){if(1&t){var n=l.Vb();l.Ub(0,"div",32),l.Ub(1,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(1)})),l.Bc(2,"1"),l.Tb(),l.Ub(3,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(2)})),l.Bc(4,"2"),l.Tb(),l.Ub(5,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(3)})),l.Bc(6,"3"),l.Tb(),l.Ub(7,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(4)})),l.Bc(8,"4"),l.Tb(),l.Ub(9,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(5)})),l.Bc(10,"5"),l.Tb(),l.Ub(11,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(6)})),l.Bc(12,"6"),l.Tb(),l.Ub(13,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(7)})),l.Bc(14,"7"),l.Tb(),l.Ub(15,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(8)})),l.Bc(16,"8"),l.Tb(),l.Ub(17,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(9)})),l.Bc(18,"9"),l.Tb(),l.Ub(19,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputNext(0)})),l.Bc(20,"0"),l.Tb(),l.Ub(21,"button",33),l.cc("click",(function(){return l.tc(n),l.gc(2).onInputBack()})),l.Bc(22,"\u2190"),l.Tb(),l.Ub(23,"button",33),l.cc("click",(function(){l.tc(n);var t=l.gc(2);return t.showKeyboard=t.onInputEnter(t.inputIndex)})),l.Bc(24,"OK"),l.Tb(),l.Tb()}}function S(t,e){if(1&t){var n=l.Vb();l.Ub(0,"div",29),l.Ub(1,"div",30),l.cc("click",(function(){l.tc(n);var t=l.gc();return t.showKeyboard=!t.showKeyboard})),l.Ub(2,"mat-icon"),l.Bc(3),l.Tb(),l.Tb(),l.zc(4,U,25,0,"div",31),l.Tb()}if(2&t){var r=l.gc();l.yc("transform",r.keyboardTransform),l.Bb(3),l.Cc(r.toggleKeyboardIcon),l.Bb(1),l.mc("ngIf",r.showKeyboard)}}function V(t,e){if(1&t){var n=l.Vb();l.Sb(0),l.Ub(1,"button",34),l.Ub(2,"mat-icon"),l.Bc(3,"face"),l.Tb(),l.Tb(),l.Ub(4,"mat-menu",35,36),l.Ub(6,"button",37),l.cc("click",(function(){return l.tc(n),l.gc().onRefresh()})),l.Ub(7,"mat-icon",38),l.Bc(8,"refresh"),l.Tb(),l.Ub(9,"span"),l.Bc(10),l.Tb(),l.Tb(),l.Tb(),l.Rb()}if(2&t){var r=l.rc(5),a=l.gc();l.Bb(1),l.mc("matMenuTriggerFor",r),l.Bb(9),l.Cc(a.refreshButtonLabel)}}function N(t,e){if(1&t&&(l.Sb(0),l.Ub(1,"button",39),l.Ub(2,"mat-icon"),l.Bc(3,"face"),l.Tb(),l.Tb(),l.Rb()),2&t){var n=l.gc();l.Bb(1),l.mc("disabled",!n.canSubmit())}}function F(t,e){if(1&t&&(l.Ub(0,"span",40),l.Bc(1),l.Tb()),2&t){var n=l.gc();l.Bb(1),l.Cc(n.scoreMessage)}}var j,A=["first","second","result"],z="[School.Math.Grade-3.Mental-math]",L=((j=function(){function t(e,n){_classCallCheck(this,t),this.topic="\u041d\u0430\u0439\u0434\u0438 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0432\u044b\u0440\u0430\u0436\u0435\u043d\u0438\u044f.",this.items=[],this.status="active",this.scoreMessage="",this.score=0,this.autoplay=new u.a,this.showKeyboard=!1,this.keyboardTransform="",this.inputIndex=-1,this.todayVictories=0,this.victoryAnimation=!1,e.addSvgIcon("icon_sun",n.bypassSecurityTrustResourceUrl("assets/school/sun.svg"))}return _createClass(t,[{key:"init",value:function(){for(this.autoplay.stop(),this.status="active",this.score=0,this.scoreMessage="",this.items=[];this.items.length<10;){var t=Object(s.d)(0,2),e=A[Object(s.d)(0,A.length)],n="mathExpression"+this.items.length;if(0===t){var r=Object(s.d)(0,101),a=Object(s.d)(0,r+1),o={name:"addition",operator:{name:"plus",notation:"+"},first:{name:"augend",value:g=a},second:{name:"addend",value:l=r-a},result:{name:"sum",value:g+l}},i=o[e].value.toString().length;this.items.push({inputName:n,inputValue:"",inputIndex:e,inputLength:i,expression:o})}else if(1===t){var c=Object(s.d)(0,101),u=p(c,Object(s.d)(0,c+1)),d=u[e].value.toString().length;this.items.push({inputName:n,inputValue:"",inputIndex:e,inputLength:d,expression:u})}}var g,l}},{key:"ngOnInit",value:function(){this.init();var t=localStorage.getItem(z);if(t){var e=JSON.parse(t);if(e){var n=e[Object(g.a)("YYYY-MM-DD")];"number"==typeof n&&n>this.todayVictories&&(this.todayVictories=n)}}}},{key:"ngAfterViewInit",value:function(){this.nextItemRequestFocus(0)}},{key:"onRefresh",value:function(){var t=this;this.init(),setTimeout((function(){t.nextItemRequestFocus(0)}),100)}},{key:"canSubmit",value:function(){if("active"!==this.status)return!1;var t,e=_createForOfIteratorHelper(this.items);try{for(e.s();!(t=e.n()).done;)if(!t.value.inputValue)return!1}catch(n){e.e(n)}finally{e.f()}return!0}},{key:"setScore",value:function(){var t,e=0,n=_createForOfIteratorHelper(this.items);try{for(n.s();!(t=n.n()).done;)t.value.isValid&&e++}catch(a){n.e(a)}finally{n.f()}if(this.score=e/this.items.length,this.score>=1){this.todayVictories++,this.victoryAnimation=this.todayVictories>0&&this.todayVictories<=5;try{var r=Object(g.a)("YYYY-MM-DD");localStorage.setItem(z,JSON.stringify(_defineProperty({},r,this.todayVictories)))}catch(o){console.warn("localStorage error:",o)}}return function(t){if(1===t){var e=["","\u0417\u0434\u043e\u0440\u043e\u0432\u043e!","\u041f\u0440\u0435\u043a\u0440\u0430\u0441\u043d\u043e!","\u041e\u0442\u043b\u0438\u0447\u043d\u043e!","\u041c\u043e\u043b\u043e\u0434\u0435\u0446!","\u0423\u043c\u043d\u0438\u0446\u0430!","\u0423\u043c\u043d\u0438\u0447\u043a\u0430!!!","\u0425\u0432\u0430\u043b\u044e!","\u0411\u0440\u0430\u0432\u043e!","\u0422\u0430\u043b\u0430\u043d\u0442!","\u041f\u0440\u0435\u0432\u043e\u0441\u0445\u043e\u0434\u043d\u043e!","\u0422\u0430\u043a \u0434\u0435\u0440\u0436\u0430\u0442\u044c!","\u0417\u0430\u043c\u0435\u0447\u0430\u0442\u0435\u043b\u044c\u043d\u043e!","\u0427\u0443\u0434\u0435\u0441\u043d\u043e!"];return"5+ "+e[Object(s.d)(0,e.length)]}if(t>=.99)return"5+";if(t>.9)return"5";if(t>=.8)return"5-";if(t>=.7)return"4";if(t>=.6)return"4-";if(t>=.5)return"3";if(t>=.4)return"3-";if(t>=.3)return"2";if(t>=.2)return"2-";var n=["","","","","\u043f\u043b\u043e\u0445\u043e.","\u043e\u0442\u0432\u0440\u0430\u0442\u0438\u0442\u0435\u043b\u044c\u043d\u043e.","\u0443\u0436\u0430\u0441\u043d\u043e."];return"1 "+n[Object(s.d)(0,n.length)]}(this.score)}},{key:"onSubmit",value:function(t){var e=this;if(this.canSubmit()){this.status="validation";var n=this.items,r=0;this.autoplay.timeout=250,this.autoplay.play((function(){if(r<n.length){var t=n[r];t.isChecked=!0,t.isValid=t.expression[t.inputIndex].value===+t.inputValue}var a=++r<e.items.length;if(!a){e.status="done";var o=e.setScore();e.scoreMessage="",e.autoplay.timeout=100,e.autoplay.play((function(){var t=Object(d.a)(e.scoreMessage,o);return e.scoreMessage=t.length<o.length?o.substring(0,t.length+1):o,e.scoreMessage!==o||(!e.victoryAnimation&&e.score>=1&&(e.victoryAnimation=!0),!1)}))}return a}))}else console.warn("Cannot submit:",t.value)}},{key:"onInputEnter",value:function(t){if(t>=0&&t<this.items.length){var e=this.items[t].inputValue;if(e&&!isNaN(+e))return this.nextItemRequestFocus(t+1)}return!0}},{key:"onInputFocus",value:function(t,e,n){this.inputIndex=n;var r=t.target;if(e&&r){var a=e.getBoundingClientRect(),o=r.getBoundingClientRect();this.keyboardTransform="translate(".concat(o.left-a.left,"px, ").concat(o.bottom-a.top,"px)")}}},{key:"onInputChange",value:function(t,e){var n=this.items[t];if(n){var r=e.replace(/[^0-9]/g,"").substring(0,n.inputLength);r!==n.inputValue&&setTimeout((function(){n.inputValue=r}),100)}}},{key:"onInputNext",value:function(t){if(this.inputIndex>=0&&this.inputIndex<this.items.length){var e=this.items[this.inputIndex];e.inputValue.length<e.inputLength&&(e.inputValue=e.inputValue+t)}}},{key:"onInputBack",value:function(){if(this.inputIndex>=0&&this.inputIndex<this.items.length){var t=this.items[this.inputIndex],e=t.inputValue.length;e>0&&(t.inputValue=t.inputValue.substring(0,e-1))}}},{key:"nextItemRequestFocus",value:function(t){for(var e=this.inputList.toArray(),n=e.length,r=function(r){var a=e[(t+r)%n].nativeElement;if(a&&!a.value)return{v:(setTimeout((function(){a.focus()})),!0)}},a=0;a<n;a++){var o=r(a);if("object"==typeof o)return o.v}return!1}},{key:"toggleKeyboardIcon",get:function(){return this.showKeyboard?"keyboard_hide":"keyboard"}},{key:"submitButtonLabel",get:function(){switch(this.status){case"active":return this.canSubmit()?"\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u043c?":"?";case"validation":return"\u041f\u0440\u043e\u0432\u0435\u0440\u044f\u0435\u043c...";case"done":return"\u041e\u0446\u0435\u043d\u043a\u0430: "}}},{key:"refreshButtonLabel",get:function(){return this.score>=1?"\u0415\u0449\u0451 \u0440\u0430\u0437?":"\u041f\u0435\u0440\u0435\u0438\u0433\u0440\u0430\u0442\u044c!"}}]),t}()).\u0275fac=function(t){return new(t||j)(l.Ob(m.c),l.Ob(f.b))},j.\u0275cmp=l.Ib({type:j,selectors:[["app-mental-math"]],viewQuery:function(t,e){var n;1&t&&l.Fc(P,!0),2&t&&l.qc(n=l.dc())&&(e.inputList=n)},inputs:{topic:"topic",items:"items"},decls:18,vars:8,consts:[[2,"position","absolute","right","0","top","0"],["class","squared-paper-trophy","svgIcon","icon_sun",3,"step1","step2","step3","step4","step5","animate",4,"ngIf"],[1,"squared-paper-topic"],[1,"squared-paper-form",3,"ngSubmit"],["form","ngForm"],[1,"squared-paper-form-main"],["main",""],["class","squared-paper-form-item",4,"ngFor","ngForOf"],["class","squared-paper-form-keyboard",3,"transform",4,"ngIf"],[1,"squared-paper-form-submit-button"],[4,"ngIf"],[1,"squared-paper-form-submit-message"],["for","onSubmitButton",2,"vertical-align","top"],["class","squared-paper-teacher",4,"ngIf"],["svgIcon","icon_sun",1,"squared-paper-trophy"],[1,"squared-paper-form-item"],[1,"squared-paper-col-3"],["class","squared-paper-form-check",4,"ngIf"],[1,"squared-paper-col-12"],[1,"squared-paper-form-entry"],[3,"for",4,"ngIf"],["type","text","placeholder","?","autocomplete","off",3,"id","name","readonly","ngModel","ngModelChange","keyup.Enter","focus"],["itemInputs",""],["class","squared-paper-pl",3,"for",4,"ngIf"],[1,"squared-paper-form-check"],[3,"for"],[3,"title"],["title","equals"],[1,"squared-paper-pl",3,"for"],[1,"squared-paper-form-keyboard"],[1,"squared-paper-form-keyboard-icon",3,"click"],["class","squared-paper-form-keyboard-dial",4,"ngIf"],[1,"squared-paper-form-keyboard-dial"],["type","button","mat-button","",3,"click"],["id","onSubmitButton","mat-icon-button","","color","warn","aria-label","refresh button","type","button","appFocus","",3,"matMenuTriggerFor"],["yPosition","above"],["menu","matMenu"],["mat-menu-item","","type","button",3,"click"],["color","primary"],["id","onSubmitButton","mat-icon-button","","color","primary","aria-label","submission button","type","submit",3,"disabled"],[1,"squared-paper-teacher"]],template:function(t,e){if(1&t){var n=l.Vb();l.Ub(0,"app-squared-paper"),l.Ub(1,"div",0),l.zc(2,v,1,12,"mat-icon",1),l.Tb(),l.Ub(3,"div",2),l.Bc(4),l.Tb(),l.Ub(5,"form",3,4),l.cc("ngSubmit",(function(){l.tc(n);var t=l.rc(6);return e.onSubmit(t)})),l.Ub(7,"div",5,6),l.zc(9,w,9,10,"div",7),l.zc(10,S,5,4,"div",8),l.Tb(),l.Ub(11,"div",9),l.zc(12,V,11,2,"ng-container",10),l.zc(13,N,4,1,"ng-container",10),l.Tb(),l.Ub(14,"div",11),l.Ub(15,"label",12),l.Bc(16),l.Tb(),l.zc(17,F,2,1,"span",13),l.Tb(),l.Tb(),l.Tb()}2&t&&(l.Bb(2),l.mc("ngIf",e.todayVictories>0),l.Bb(2),l.Cc(e.topic),l.Bb(5),l.mc("ngForOf",e.items),l.Bb(1),l.mc("ngIf",e.keyboardTransform&&"active"===e.status),l.Bb(2),l.mc("ngIf","done"===e.status),l.Bb(1),l.mc("ngIf","done"!==e.status),l.Bb(3),l.Cc(e.submitButtonLabel),l.Bb(1),l.mc("ngIf","done"===e.status))},directives:[O,r.l,a.m,a.j,a.k,r.k,m.a,a.b,a.e,a.i,a.l,_.a,M,q.c,q.d,q.a],styles:['.squared-paper[_ngcontent-%COMP%]{position:relative;margin-left:1px;margin-top:1px;background-color:#f5f5f5;font-family:Fira Mono,monospace;font-weight:500;font-size:20px;line-height:24px}.squared-paper-bg[_ngcontent-%COMP%]{width:100%;height:100%}.squared-paper-fg[_ngcontent-%COMP%]{position:absolute;left:0;right:0;top:0;bottom:0}.squared-paper-par[_ngcontent-%COMP%]{text-indent:48px;padding-left:6px;margin-bottom:24px}.squared-paper-text-indent-1[_ngcontent-%COMP%]{text-indent:24px}.squared-paper-text-indent-2[_ngcontent-%COMP%]{text-indent:48px}.squared-paper-text-indent-3[_ngcontent-%COMP%]{text-indent:72px}.squared-paper-text-indent-4[_ngcontent-%COMP%]{text-indent:96px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-check[_ngcontent-%COMP%], .squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-entry[_ngcontent-%COMP%], .squared-paper-pl[_ngcontent-%COMP%]{padding-left:6px}.squared-paper-pr[_ngcontent-%COMP%]{padding-right:6px}.squared-paper-margin-1[_ngcontent-%COMP%]{margin:24px}.squared-paper-margin-2[_ngcontent-%COMP%]{margin:48px}.squared-paper-margin-3[_ngcontent-%COMP%]{margin:72px}.squared-paper-margin-4[_ngcontent-%COMP%]{margin:96px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-item[_ngcontent-%COMP%], .squared-paper-mb-1[_ngcontent-%COMP%]{margin-bottom:24px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-check[_ngcontent-%COMP%], .squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-submit-button[_ngcontent-%COMP%], .squared-paper-ml-1[_ngcontent-%COMP%]{margin-left:24px}.squared-paper-mr-1[_ngcontent-%COMP%]{margin-right:24px}.squared-paper-mt-1[_ngcontent-%COMP%]{margin-top:24px}.squared-paper-mb-2[_ngcontent-%COMP%]{margin-bottom:48px}.squared-paper-ml-2[_ngcontent-%COMP%]{margin-left:48px}.squared-paper-mr-2[_ngcontent-%COMP%]{margin-right:48px}.squared-paper-mt-2[_ngcontent-%COMP%]{margin-top:48px}.squared-paper-mb-3[_ngcontent-%COMP%]{margin-bottom:72px}.squared-paper-ml-3[_ngcontent-%COMP%]{margin-left:72px}.squared-paper-mr-3[_ngcontent-%COMP%]{margin-right:72px}.squared-paper-mt-3[_ngcontent-%COMP%]{margin-top:72px}.squared-paper-mb-4[_ngcontent-%COMP%]{margin-bottom:96px}.squared-paper-ml-4[_ngcontent-%COMP%]{margin-left:96px}.squared-paper-mr-4[_ngcontent-%COMP%]{margin-right:96px}.squared-paper-mt-4[_ngcontent-%COMP%]{margin-top:96px}.squared-paper-teacher[_ngcontent-%COMP%]{font-family:Pacifico,cursive;font-weight:400;font-size:32px;color:red;letter-spacing:normal}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-check[_ngcontent-%COMP%], .squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-entry[_ngcontent-%COMP%], .squared-paper-spacing[_ngcontent-%COMP%]{letter-spacing:12px}.squared-paper-col-3[_ngcontent-%COMP%], .squared-paper-col-12[_ngcontent-%COMP%], .squared-paper-col-15[_ngcontent-%COMP%], .squared-paper-col-30[_ngcontent-%COMP%], .squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-item[_ngcontent-%COMP%], .squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-submit-message[_ngcontent-%COMP%]{display:inline-block}.squared-paper-col-3[_ngcontent-%COMP%]{width:72px}.squared-paper-col-12[_ngcontent-%COMP%]{width:288px}.squared-paper-col-15[_ngcontent-%COMP%], .squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-item[_ngcontent-%COMP%]{width:360px}.squared-paper-col-30[_ngcontent-%COMP%], .squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-submit-message[_ngcontent-%COMP%]{width:720px}.squared-paper-topic[_ngcontent-%COMP%]{margin:24px 96px 24px 0;padding-left:6px;text-indent:48px}.squared-paper-form[_ngcontent-%COMP%]{position:relative}.squared-paper-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{font:inherit;letter-spacing:inherit;padding:0;border:none;background-color:transparent}.squared-paper-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{letter-spacing:normal;outline:thin dashed #00f;background-color:#fed}.squared-paper-form[_ngcontent-%COMP%]   input.invalid[_ngcontent-%COMP%]{-webkit-text-decoration:solid red line-through;text-decoration:solid red line-through}.squared-paper-form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{cursor:pointer}.squared-paper-form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:hover{text-shadow:1px 1px 2px #eba}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-main[_ngcontent-%COMP%]{position:relative;margin-right:96px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-check[_ngcontent-%COMP%]{color:red;font-weight:600}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-entry[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{margin-left:-6px;padding-left:6px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-entry[_ngcontent-%COMP%]   input[maxlength="1"][_ngcontent-%COMP%]{width:18px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-entry[_ngcontent-%COMP%]   input[maxlength="2"][_ngcontent-%COMP%]{width:42px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-entry[_ngcontent-%COMP%]   input[maxlength="3"][_ngcontent-%COMP%]{width:66px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-entry[_ngcontent-%COMP%]   input[maxlength="4"][_ngcontent-%COMP%]{width:90px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-entry[_ngcontent-%COMP%]   input[maxlength="5"][_ngcontent-%COMP%]{width:114px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-submit-button[_ngcontent-%COMP%]{padding:4px;float:left}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-submit-message[_ngcontent-%COMP%]{padding-left:6px}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-keyboard[_ngcontent-%COMP%]{position:absolute;top:0;left:0;transition:transform .6s ease-in-out}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-keyboard-dial[_ngcontent-%COMP%]{position:relative;border:1px solid #bbf;border-radius:4px;padding:2px;top:-24px;left:24px;width:192px;background-color:#ddf;box-shadow:2px 2px 4px #888}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-keyboard-dial[_ngcontent-%COMP%]   .mat-button[_ngcontent-%COMP%], .squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-keyboard-dial[_ngcontent-%COMP%]   .mat-stroked-button[_ngcontent-%COMP%]{color:#008}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-keyboard-icon[_ngcontent-%COMP%]{cursor:pointer;height:24px;color:#bbf;transition:color .6s ease-in-out}.squared-paper-form[_ngcontent-%COMP%]   .squared-paper-form-keyboard-icon[_ngcontent-%COMP%]:hover{color:#008}.squared-paper-trophy[_ngcontent-%COMP%]{display:block;width:96px;height:96px}']}),j);n.d(e,"SchoolModule",(function(){return E}));var R,K=[{path:"mental-math",component:L},{path:"",component:L}],E=((R=function t(){_classCallCheck(this,t)}).\u0275mod=l.Mb({type:R}),R.\u0275inj=l.Lb({factory:function(t){return new(t||R)},imports:[[o.c.forChild(K),r.c,a.d,i.a,c.a],o.c]}),R)}}]);