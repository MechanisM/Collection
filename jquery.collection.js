/**
 * nimble - simple JavaScript framework for working with objects
 *
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @date: 01.01.2012 21:55:59
 * @version 1.0.1
 */
var nimble = {
	/**
	 * framework name
	 * 
	 * @constant
	 * @type String
	 */
	name: "nimble",
	/**
	 * framework version
	 * 
	 * @constant
	 * @type String
	 */
	version: "1.0.1",
	/**
	 * return string: framework name + framework version
	 *
	 * @this {nimble}
	 * @return {String}
	 */
	nimble: function () { return this.name + " " + this.version; },
	
	// constants
	CONTEXT_SEPARATOR: " ",
	QUERY_SEPARATOR: "/",
	SUBQUERY_SEPARATOR: "{",
	METHOD_SEPARATOR: "->",
	
	CHILDREN: ">",
	ORDER: ["eq(", ")"],
	//
	
	/**
	 * trim
	 *
	 * @param {String} str
	 * @return {String}
	 */
	trim: function (str) {
		var
			str = str.replace(/^\s\s*/, ''),
			ws = /\s/,
			i = str.length;
		//
		while (ws.test(str.charAt((i -= 1))));
		return str.substring(0, i + 1);
	},
	/**
	 * string test
	 *
	 * @param {mixed} obj
	 * @return {Boolean}
	 */
	isString: function (obj) { return Object.prototype.toString.call(obj) === "[object String]"; },
	/**
	 * number test
	 *
	 * @param {mixed} obj
	 * @return {Boolean}
	 */
	isNumber: function (obj) { return Object.prototype.toString.call(obj) === "[object Number]"; },
	/**
	 * boolean test
	 *
	 * @param {mixed} obj
	 * @return {Boolean}
	 */
	isArray: function (obj) { return Object.prototype.toString.call(obj) === "[object Array]"; },
	/**
	 * null && undefined && empty string test
	 *
	 * @param {mixed} obj
	 * @return {Boolean}
	 */
	isExist: function (obj) { return obj !== undefined && obj !== "undefined" && obj !== null && obj !== ""; },
	
	/**
	 * calculate math expression
	 * 
	 * @param {mixed} nw - new value
	 * @param {mixed} old - old value
	 * @return {mixed}
	 */
	expr: function (nw, old) {
		old = old !== undefined || old !== null ? old : "";
		if (this.isString(nw) && nw.search(/^[+-\\*/]{1}=/) !== -1) {
			nw = nw.split("=");
			if (!isNaN(nw[1])) { nw[1] = +nw[1]; }
			// simple math
			switch (nw[0]) {
				case "+": { nw = old + nw[1]; } break;
				case "-": { nw = old - nw[1]; } break;
				case "*": { nw = old * nw[1]; } break;
				case "/": { nw = old / nw[1]; } break;
			}
		}
	
		return nw;
	},
	
	/**
	 * set new value to object by link or get object by link
	 * 
	 * @this {nimble}
	 * @param {Object|Number|Boolean} obj - some object
	 * @param {Context} context - link
	 * @param {mixed} [value] - some value
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @return {nimble|mixed}
	 */
	byLink: function (obj, context, value, deleteType) {
		context = context
					.toString()
					.replace(new RegExp("\\s*" + this.CHILDREN + "\\s*", "g"), " " + this.CHILDREN + " ")
					.split(this.CONTEXT_SEPARATOR);
		deleteType = deleteType || false;
		//
		var
			type = this.CHILDREN,
			last = 0, total = 0,
			
			key, i,
			pos, n,
	
			objLength, cLength = context.length;
	
		// remove "dead" elements
		for (i = cLength; (i -= 1) > -1;) {
			context[i] = this.trim(context[i]);
			if (context[i] === "") {
				context.splice(i, 1);
				last -= 1;
			} else if (context[i] !== this.CHILDREN) {
				if (i > last) { last = i; }
				total += 1;
			}
		}
		// recalculate length
		cLength = context.length;
		
		// overload
		if (obj === false) {
			return context.join("");
		} else if (this.isNumber(obj)) {
			if ((obj = +obj) < 0) { obj += total; }
			if (value === undefined) { 
				for (i = -1, n = 0; (i += 1) < cLength;) {
					if (context[i] !== this.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(i + 1, cLength);
							return context.join("");
						}
					}
				}
			} else {
				for (i = cLength, n = 0; (i -= 1) > -1;) {
					if (context[i] !== this.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(0, i);
							return context.join("");
						}
					}
				}
			}
		}
		//
		for (i = -1; (i += 1) < cLength;) {
			switch (context[i]) {
				case this.CHILDREN : { type = context[i]; } break;
				default : {
					if (type === this.CHILDREN && context[i].substring(0, this.ORDER[0].length) !== this.ORDER[0]) {
						if (i === last && value !== undefined) {
							if (deleteType === false) {
								obj[context[i]] = this.expr(value, obj[context[i]]);
							} else {
								if (nimble.isArray(obj)) {
									obj.splice(context[i], 1);
								} else { delete obj[context[i]]; }
							}
						} else { obj = obj[context[i]]; }
					} else {
						pos = context[i].substring(this.ORDER[0].length);
						pos = pos.substring(0, (pos.length - 1));
						pos = +pos;
						//
						if (this.isArray(obj)) {
							if (i === last && value !== undefined) {
								if (pos >= 0) {
									if (deleteType === false) {
										obj[pos] = this.expr(value, obj[pos]);
									} else { obj.splice(pos, 1); }
								} else {
									if (deleteType === false) {
										obj[obj.length + pos] = this.expr(value, obj[obj.length + pos]);
									} else { obj.splice(obj.length + pos, 1); }
								}
							} else {
								if (pos >= 0) {
									obj = obj[pos];
								} else { obj = obj[obj.length + pos]; }
							}
						} else {
							if (pos < 0) {
								objLength = 0;
								for (key in obj) {
									if (obj.hasOwnProperty(key)) { objLength += 1; }
								}
								//
								pos += objLength;
							}
			
							n = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) {
									if (pos === n) {
										if (i === last && value !== undefined) {
											if (deleteType === false) {
												obj[key] = this.expr(value, obj[key]);
											} else { delete obj[key]; }
										} else { obj = obj[key]; }
										break;
									}
									n += 1;
								}
							}
						}
					}
				}
			}
		}
		
		if (value !== undefined) { return this; }
		return obj;
	},
	
	/**
	 * execute event
	 * 
	 * @this {nimble}
	 * @param {String} query - query string
	 * @param {Object} event - event request
	 * @param {mixed} [param] - input parameters
	 * @param {mixed} [_this=event] - this
	 * @return {mixed}
	 */
	execEvent: function (query, event, param, _this) {
		query = query.split(this.QUERY_SEPARATOR);
		param = this.isExist(param) ? param : [];
		param = this.isArray(param) ? param : [param];
		//
		var 
			i = -1,
			qLength = query.length - 1,
			spliter;
	
		for (; (i += 1) < qLength;) { event = event[query[i]]; }
		//
		if (query[i].search(this.SUBQUERY_SEPARATOR) !== -1) {
			spliter = query[i].split(this.SUBQUERY_SEPARATOR);
			event = event[spliter[0]];
			spliter.splice(0, 1);
			param = param.concat(spliter);
			return event.apply(_this || event, param);
		} else { return event[query[i]].apply(_this || event, param); }
	},
	
	/**
	 * add new element to object
	 *
	 * @this {nimble}
	 * @param {Plain Object} obj - some object
	 * @param {String} active - property name (can use "->unshift" - the result will be similar to work for an array "unshift")
	 * @param {mixed} value - some value
	 * @return {Plain Object|Boolean}
	 */
	addElementToObject: function (obj, active, value) {
		active = active.split(this.METHOD_SEPARATOR);
		var key, newObj = {};
	
		if (active[1] && active[1] == "unshift") {
			newObj[!isNaN(Number(active[0])) ? 0 : active[0]] = value;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) { newObj[!isNaN(Number(key)) ? +key + 1 : key] = obj[key]; }
			}
			obj = newObj;
	
			return obj;
		} else if (!active[1] || active[1] == "push") { obj[active[0]] = value; }
	
		return true;
	}
};
﻿/**
 * $.Collection - JavaScript framework for working with collections of data (using jQuery)
 *
 * glossary:
 * 1) Collection - data object the JavaScript (the JS), can be implemented as an array, and as a hash table (you can combine arrays with the hash, for example: [{...},{...},...]);
 * 2) Filter - the special function JS, which are selected from the collection by this or any other condition;
 * 3) Parser - the special function JS, engaged in post-processing of the resulting string selection from the collection of the;
 * 4) Context - a string that specifies a link to a certain context (region) collection, for example, the string "Name approximately 1" indicates the obj.Name[1], where obj is a collection of;
 * 5) Template - the special function JS, which converts the collection in line view, in accordance with these instructions for pasting in the DOM;
 *
 * addition:
 * the code is documented in accordance with the standard jsDoc
 * specific data types:
 * 1) [Colletion Object] is a reduced form of the [Object] and means an instance of $.Collection;
 * 2) [Colletion] is a reduced form of the [Object|Array] and means an collection of data;
 * 3) [Selector] is a reduced form of the [String] , and means the css selector (Sizzle syntax);
 * 4) [Context] is the reduced form of the [String] , and means the context of the collection;
 * 5) [Template] is a reduced form of the [Function] and means function-template;
 * 6) [Filter] is a reduced form of the [Function] and means the function-filter;
 * 7) [Parser] is a reduced form of the [Function] and means function-parser;
 * 8) [Plain Object] is a reduced form of the [Object] and means hash table;
 * 9) [jQuery Object] is a reduced form of the [Object] and means an instance of jQuery;
 * 10) [jQuery Deferred] is the reduced form of the [Object] and means an instance of jQuery.Deferred.
 * --
 * the record type: [some parameter] means that this parameter is optional , and if not specified explicitly, it is not defined (has no default value)
 * all overloading methods documented in the description of the method, because the syntax of the jsDoc not allow it to do
 * --
 * for comfortable work it is recommended to use the latest stable version of jQuery
 *
 * enjoy!
 * 
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @date: 08.01.2012 02:29:21
 * @version 3.3.2
 */
(function ($) {
	// try to use ECMAScript 5 "strict mode"
	"use strict";	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	/**
	 * @constructor
	 * @this {Colletion Object}
	 * @param {Collection|Selector} [collection=null] - collection or selector for field "target"
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.active] - user's preferences
	 */
	$.Collection = function (collection, uProp) {
		collection = collection || null;
		uProp = uProp || null;
		
		// create "factory" function if need	
		if (this.fn && (!this.fn.name || this.fn.name !== "$.Collection")) { return new $.Collection(collection, uProp); }
		
		// mixin public fields
		$.extend(true, this, $.Collection.storage);
			
		var active = this.dObj.active;
				
		// extend public fields by user's preferences if need
		if (uProp) { $.extend(true, active, uProp); }
		
		// if "collection" is string
		if ($.isString(collection)) {
			active.target = $(collection);
			active.collection = null;
		} else { active.collection = collection; }
	};
	
	//
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function (callback, _this) {
			var i = -1, aLength = this.length;
			
			for (; (i += 1) < aLength;) {
				if (!_this) {
					callback(this[i], i, this);
				} else { callback.call(_this, this[i], i, this); }
			}
		}
	}
	if (!Array.prototype.some) {
		Array.prototype.some = function (callback, _this) {
			var i = -1, aLength = this.length, res;
			
			for (; (i += 1) < aLength;) {
				if (!_this) {
					res = callback(this[i], i, this);
				} else { res = callback.call(_this, this[i], i, this); }
				if (res === true) { break; }
			}
		}
	}	
	/////////////////////////////////
	//// prototype
	/////////////////////////////////
	
	$.Collection.fn = $.Collection.prototype = {
		/**
		 * framework name
		 * 
		 * @constant
		 * @type String
		 */
		name: "$.Collection",
		/**
		 * framework version
		 * 
		 * @constant
		 * @type String
		 */
		version: "3.3.2",
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Prototype}
		 * @return {String}
		 */
		collection: function () { return this.name + " " + this.version; },
		
		// const
		ACTIVE: "active",
		
		/**
		 * stack parameters
		 * 
		 * @field
		 * @type Array
		*/
		stack: [
		"collection",
		"filter",
		"context",
		"cache",
		"index",
		"map",
		"variable",
		"defer",
		
		"page",
		"parser",
		"appendType",
		"target",
		"calculator",
		"pager",
		"template",
		"numberBreak",
		"pageBreak",
		"resultNull"
		],
		
		//////
		
		/**
		 * return active property
		 * 
		 * @this {Collection Object}
		 * @return {String}
		 */
		getActiveParam: function (name) {
			return this.dObj.sys.flags.use[name] === undefined || this.dObj.sys.flags.use[name] === true? this.dObj.active[name] : "";
		},
		
		/**
		 * enable property
		 * 
		 * @this {Collection Object}
		 * @param {String} name - property name
		 * @return {Collection Object}
		 */
		enable: function (name) {
			this.dObj.sys.flags.use[name] = true;
			
			return this;
		},
		/**
		 * disable property
		 * 
		 * @this {Collection Object}
		 * @param {String} name - property name
		 * @return {Collection Object}
		 */
		disable: function (name) {
			this.dObj.sys.flags.use[name] = false;
		
			return this;
		},
		/**
		 * toggle property
		 * 
		 * @this {Collection Object}
		 * @param {String} name - property name
		 * @return {Collection Object}
		 */
		toggle: function (name) {
			if (this.dObj.sys.flags.use[name] === true) { return this.disable(name); }
			
			return this.enable(name);
		}
	};	
	/////////////////////////////////
	//// jQuery methods (core)
	/////////////////////////////////
		
	/**
	 * jQuery collection
	 * 
	 * @this {jQuery Object}
	 * @param {Object} prop - user's preferences
	 * @return {Colletion Object}
	 */
	$.fn.collection = function (prop) {
		var
			stat = $.fn.collection.stat,
			text = function (elem) {
				elem = elem.childNodes;
				var
					eLength = elem.length,
					i = -1,
					str = "";
				//
				for (; (i += 1) < eLength;) {
					if (elem[i].nodeType === 3 && $.trim(elem[i].textContent)) { str += elem[i].textContent; }
				}
				//
				if (str) { return str; }
	
				return false;
			},
			inObj = function (elem) {
				var array = [];
				//
				elem.each(function (n) {
					var
						$this = $(this),
						data = $this.data(),
	
						classes = $this.attr("class") ? $this.attr("class").split(" ") : "",
						cLength = classes ? classes.length : 0,
	
						txt = text($this[0]),
	
						key;
	
					array.push({});
					for (key in data) { if (data.hasOwnProperty(key)) { array[n][key] = data[key]; } }
					//
					if (cLength) {
						array[n][stat.classes] = {};
						classes.forEach(function (el) {
							array[n][stat.classes][el] = el;
						});
					}
					//
					if ($this.children().length !== 0) { array[n][stat.childNodes] = inObj($this.children()); }
					if (txt !== false) { array[n][stat.val] = txt.replace(/[\r\t\n]/g, " "); }
				});
	
				return array;
			},
			data = inObj(this);
	
		if (prop) { return new $.Collection(data, prop); }
	
		return new $.Collection(data);
	};
	// values by default
	if (!$.fn.collection.stat) {
		$.fn.collection.stat = {
			val: "val",
			childNodes: "childNodes",
			classes: "classes"
		};
	};
	/////////////////////////////////
	//// jQuery methods (compiler templates)
	/////////////////////////////////
	
	/**
	 * compiler templates
	 * 
	 * @this {jQuery Object}
	 * @throw {Error}
	 * @return {Function}
	 */
	$.fn.ctplCompile = function () {
		if (this.length === 0) { throw new Error("DOM element isn't exist!"); }
		
		var
			html = this.html(),
			elem = html
				.replace(/\/\*.*?\*\//g, "")
				.split("?>")
				.join("<?js")
				.replace(/[\r\t\n]/g, " ")
				.split("<?js"),
			
			eLength = elem.length,
			resStr = "var key = i, result = ''; ";
		
		elem.forEach(function (el, i) {
			if (i === 0 || i % 2 === 0) {
				resStr += "result +='" + el + "';";
			} else { resStr += el.split("echo").join("result +="); }
		});
		
		return new Function("el", "data", "i", "cOLength", "self", "id", resStr + " return result;");
	};
	
	/**
	 * make template
	 * 
	 * @this {jQuery Object}
	 * @param {Collection Object} cObj - an instance of $.Collection
	 * @throw {Error}
	 * @return {Function}
	 */
	$.fn.ctplMake = function (cObj) {
		this.find("[type='text/ctpl']").each(function () {
			var
				$this = $(this),
				data = $this.data(),
				
				prefix = data.prefix ? data.prefix + "_" : "";
			//
			cObj.pushTemplate(prefix + data.name, $this.ctplCompile());
			if (data.set && data.set === true) { cObj.setTemplate(prefix + data.name); }
		});
	};	
	/////////////////////////////////
	//// jQuery methods (other)
	/////////////////////////////////
		
	/**
	 * string test
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isString = function (val) { return nimble.isString(val); };
	/**
	 * boolean test
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isBoolean = function (val) {
		return Object.prototype.toString.call(val) === "[object Boolean]";
	};
	/**
	 * null && undefined && empty string test
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isExist = function (val) { return nimble.isExist(val); };
	/**
	 * unshift for arguments (object)
	 * 
	 * @param {Object} obj - some object
	 * @param {mixed} pushVal - new value
	 * @return {Array}
	 */
	$.unshiftArguments = function (obj, pushVal) {
		var newObj = [pushVal], i = -1, oLength = obj.length;
		for (; (i += 1) < oLength;) { newObj.push(obj[i]); }
		
		return newObj;
	};
	/**
	 * toUpperCase function
	 * 
	 * @param {String} str - some str
	 * @param {Number} [to=str.length] - end
	 * @param {Number} [from=0] - start
	 * @return {String}
	 */
	$.toUpperCase = function (str, to, from) {
		from = from || 0;
		
		if (!to) { return str.toUpperCase(); }
		return str.substring(from, to).toUpperCase() + str.substring(to);
	};
	/**
	 * toLowerCase function
	 * 
	 * @param {String} str - some str
	 * @param {Number} [to=str.length] - end
	 * @param {Number} [from=0] - start
	 * @return {String}
	 */
	$.toLowerCase = function (str, to, from) {
		from = from || 0;
		
		if (!to) { return str.toLowerCase(); }
		return str.substring(from, to).toLowerCase() + str.substring(to);
	};	
	/////////////////////////////////
	//// public fields (active)
	/////////////////////////////////
	
	$.Collection.storage = {
		// root
		dObj: {
			// active fields
			active: {
				/////////////////////////////////
				//// data
				/////////////////////////////////
				
				/**
				 * active collection
				 * 
				 * @field
				 * @type Collection|Null
				 */
				collection: null,
				/**
				 * active filter ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				filter: false,
				/**
				 * active context
				 * 
				 * @field
				 * @type Context
				 */
				context: "",
				/**
				 * active cache object
				 * 
				 * @field
				 * @type Plain Object
				 */
				cache: {
					/**
					 * auto cache
					 * 
					 * @field
					 * @type Boolean
					 */
					autoIteration: false,
					/**
					 * use cache
					 * 
					 * @field
					 * @type Boolean
					 */
					iteration: false,
					/**
					 * first iteration
					 * 
					 * @field
					 * @type Number
					 */
					firstIteration: false,
					/**
					 * last iteration
					 * 
					 * @field
					 * @type Number
					 */
					lastIteration: false
				},
				/**
				 * active index
				 * 
				 * @field
				 * @type Plain Object
				 */
				index: null,
				/**
				 * active map
				 * 
				 * @field
				 * @type Plain Object
				 */
				map: null,
				/**
				 * active var
				 * 
				 * @field
				 * @type mixed
				 */
				variable: null,
				/**
				 * active deferred
				 * 
				 * @field
				 * @type jQuery Deferred
				 */
				defer: "",
				
				/////////////////////////////////
				//// templating
				/////////////////////////////////
				
				/**
				 * active page
				 * 
				 * @field
				 * @type Number
				 */
				page: 1,
				/**
				 * active parser ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				parser: false,
				/**
				 * active DOM insert mode (jQuery methods)
				 * 
				 * @field
				 * @param String
				 */
				appendType: "html",
				/**
				 * active target (target to insert the result templating)
				 * 
				 * @field
				 * @type jQuery Object
				 */
				target: null,
				/**
				 * active selector (used to calculate the number of records per page)
				 * 
				 * @field
				 * @type Selector
				 */
				calculator: ".line",
				/**
				 * active pager
				 * 
				 * @field
				 * @type Selector
				 */
				pager: "#pageControl",
				/**
				 * active template
				 * 
				 * @field
				 * @type Function
				 */
				template: null,
				/**
				 * active records in one page
				 * 
				 * @field
				 * @type Number
				 */
				numberBreak: 10,
				/**
				 * active page count (used in "controlMode")
				 * 
				 * @field
				 * @type Number
				 */
				pageBreak: 10,
				/**
				 * active empty result
				 * 
				 * @field
				 * @type String
				 */
				resultNull: ""
			}
		}
	};	
	/////////////////////////////////
	//// public fields (system)
	/////////////////////////////////
	
	$.Collection.storage.dObj.sys = {
		flags: {
			use: {
				/**
				 * use active context in methods
				 * 
				 * @field
				 * @type Boolean
				 */
				context: true,
				/**
				 * use active filter in methods
				 * 
				 * @field
				 * @type Boolean
				 */
				filter: true,
				/**
				 * use active parser in methods
				 * 
				 * @field
				 * @type Boolean
				 */
				parser: true
			}
		}
	};
	// generate system fields
	(function (data) {
		var
			upperCase,
			sys = $.Collection.storage.dObj.sys;
		//
		data.forEach(function (el) {
			upperCase = $.toUpperCase(el, 1);
			
			sys["active" + upperCase + "ID"] = null;
			sys["tmp" + upperCase] = {};
			sys[el + "ChangeControl"] = null;
			sys[el + "Back"] = [];
		});
	})($.Collection.fn.stack);	
	/////////////////////////////////
	//// stack methods
	/////////////////////////////////
	
	/**
	 * new property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {mixed} newProp - new property
	 * @return {Colletion Object}
	 */
	$.Collection.fn._$ = function (propName, newProp) {
		var
			dObj = this.dObj,
			active = dObj.active,
			upperCase = $.toUpperCase(propName, 1);

		active[propName] = nimble.expr(newProp, active[propName] || "");
		dObj.sys["active" + upperCase + "ID"] = null;

		return this;
	};
	/**
	 * update active property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {mixed} newProp - new value
	 * @return {Colletion Object}
	 */
	$.Collection.fn._update = function (propName, newProp) {
		var
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
			
			upperCase = $.toUpperCase(propName, 1),
			activeID = sys["active" + upperCase + "ID"];
		
		active[propName] = nimble.expr(newProp, active[propName] || "");
		if (activeID) { sys["tmp" + upperCase][activeID] = active[propName]; }

		return this;
	};
	/**
	 * return property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.ACTIVE] - stack ID
	 * @return {mixed}
	 */
	$.Collection.fn._get = function (propName, id) {
		var dObj = this.dObj;
		if (id && id !== this.ACTIVE) { return dObj.sys["tmp" + $.toUpperCase(propName, 1)][id]; }

		return dObj.active[propName];
	};
	
	/**
	 * add new value to stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Plain Object} objID - stack ID or object (ID: value)
	 * @param {mixed} [newProp] - value (overload)
	 * @throw {Error} 
	 * @return {Colletion Object}
	 */
	$.Collection.fn._push = function (propName, objID, newProp) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			active = dObj.active,

			upperCase = $.toUpperCase(propName, 1),
			tmp = sys["tmp" + upperCase],
			activeID = sys["active" + upperCase + "ID"],

			key;
			
		if ($.isPlainObject(objID)) {
			for (key in objID) {
				if (objID.hasOwnProperty(key)) {
					if (key === this.ACTIVE) {
						throw new Error("invalid property name!");
					} else {
						if (tmp[key] && activeID && activeID === key) {
							this._update(propName, objID[key]);
						} else { tmp[key] = objID[key]; }
						
					}
				}
			}
		} else {
			if (objID === this.ACTIVE) {
				throw new Error("invalid property name!");
			} else {
				if (tmp[objID] && activeID && activeID === objID) {
					this._update(propName, newProp);
				} else { tmp[objID] = newProp; }
			}
		}

		return this;
	};
	/**
	 * set new active property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} id - stack ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn._set = function (propName, id) {
		var
			dObj = this.dObj,
			sys = dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			tmpChangeControlStr = propName + "ChangeControl",
			tmpActiveIDStr = "active" + upperCase + "ID";

		if (sys[tmpActiveIDStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIDStr] = id;
		} else { sys[tmpChangeControlStr] = false; }

		sys[propName + "Back"].push(id);
		dObj.active[propName] = sys["tmp" + upperCase][id];

		return this;
	};
	/**
	 * history back
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {Number} [nmb=1] - number of steps
	 * @return {Colletion Object}
	 */
	$.Collection.fn._back = function (propName, nmb) {
		var
			dObj = this.dObj,
			sys = dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			propBack = sys[propName + "Back"],

			pos;

		sys[propName + "ChangeControl"] = false;
		pos = propBack.length - (nmb || 1) - 1;

		if (pos >= 0 && propBack[pos]) {
			if (sys["tmp" + upperCase][propBack[pos]]) {
				sys["active" + upperCase + "ID"] = propBack[pos];
				dObj.active[propName] = sys["tmp" + upperCase][propBack[pos]];

				propBack.splice(pos + 1, propBack.length);
			}
		}

		return this;
	};
	/**
	 * history back (if history changed)
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {Number} [nmb=1] - number of steps
	 * @return {Colletion Object}
	 */
	$.Collection.fn._backIf = function (propName, nmb) {
		if (this.dObj.sys[propName + "ChangeControl"] === true) {
			return this._back.apply(this, arguments);
		}

		return this;
	};
	/**
	 * remove property from stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array|Plain Object} [objID=active] - stack ID or array of IDs
	 * @param {mixed} [deleteVal=false] - default value (for active properties)
	 * @param {mixed} [resetVal] - reset value
	 * @return {Colletion Object}
	 */
	$.Collection.fn._drop = function (propName, objID, deleteVal, resetVal) {
		deleteVal = deleteVal === undefined ? false : deleteVal;

		var
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
			
			upperCase = $.toUpperCase(propName, 1),
			tmpActiveIDStr = "active" + upperCase + "ID",
			tmpTmpStr = "tmp" + upperCase,

			activeID = sys[tmpActiveIDStr],
			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],
			
			key;

		if (tmpArray[0] && tmpArray[0] !== this.ACTIVE) {
			for (key in tmpArray) {
				if (tmpArray.hasOwnProperty(key)) {
					if (!tmpArray[key] || tmpArray[key] === this.ACTIVE) {
						if (resetVal === undefined) {
							if (activeID) { delete sys[tmpTmpStr][activeID]; }
							sys[tmpActiveIDStr] = null;
							active[propName] = deleteVal;
						} else {
							if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
							active[propName] = resetVal;
						}
					} else {
						if (resetVal === undefined) {
							delete sys[tmpTmpStr][tmpArray[key]];
							if (activeID && tmpArray[key] === activeID) {
								sys[tmpActiveIDStr] = null;
								active[propName] = deleteVal;
							}
						} else {
							sys[tmpTmpStr][tmpArray[key]] = resetVal;
							if (activeID && tmpArray[key] === activeID) { active[propName] = resetVal; }
						}
					}
				}
			}
		} else {
			if (resetVal === undefined) {
				if (activeID) { delete sys[tmpTmpStr][activeID]; }
				sys[tmpActiveIDStr] = null;
				active[propName] = deleteVal;
			} else {
				if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
				active[propName] = resetVal;
			}
		}

		return this;
	};
	/**
	 * reset property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array|Plain Object} [objID=active] - stack ID or array of IDs
	 * @param {mixed} [resetVal=false] - reset value
	 * @return {Colletion Object}
	 */
	$.Collection.fn._reset = function (propName, objID, resetVal) {
		resetVal = resetVal === undefined ? false : resetVal;

		return this._drop(propName, objID || "", "", resetVal);
	};
	/**
	 * reset property to another value
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array} [objID=active] - stack ID or array of IDs
	 * @param {String} [id=this.ACTIVE] - source ID (for merge)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._resetTo = function (propName, objID, id) {
		var
			dObj = this.dObj,
			mergeVal = !id || id === this.ACTIVE ? dObj.active[propName] : dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		
		return this._reset(propName, objID || "", mergeVal);
	};

	/**
	 * check the existence of property in the stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.ACTIVE] - stack ID
	 * @return {Boolean}
	 */
	$.Collection.fn._exist = function (propName, id) {
		var 
			dObj = this.dObj,
			upperCase = $.toUpperCase(propName, 1);
		
		if ((!id || id === this.ACTIVE) && dObj.sys["active" + upperCase + "ID"]) {
			return true;
		}
		if (dObj.sys["tmp" + upperCase][id] !== undefined) {
			return true;
		}

		return false;
	};
	/**
	 * check the property on the activity
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} id - stack ID
	 * @return {Boolean}
	 */
	$.Collection.fn._is = function (propName, id) {
		if (id === this.dObj.sys["active" + $.toUpperCase(propName, 1) + "ID"]) {
			return true;
		}

		return false;
	};
	
	/////////////////////////////////
	//// assembly
	/////////////////////////////////
			
	/**
	 * use the assembly
	 * 
	 * @this {Colletion Object}
	 * @param {String} stack ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.use = function (id) {
		for (var i = this.stack.length; (i -= 1) > -1;) { if (this._exist(this.stack[i], id)) { this._set(this.stack[i], id); } }
				
		return this;
	};	
	/////////////////////////////////
	//// control settings
	/////////////////////////////////
	
	/**
	 * set/get property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Plain Object} objKey - property name or object (name: value)
	 * @param {mixed} [value] - value (overload)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._prop = function (propName, objKey, value) {
		var prop = this.dObj[propName];
			
		if (arguments.length !== 3) {
			if ($.isPlainObject(objKey)) {
				$.extend(prop, objKey);
			} else { return prop[objKey]; }
		} else { prop[objKey] = value; }
			
		return this;
	};
		
	$.Collection.fn.active = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "active"));
	};	
	/////////////////////////////////
	//// stack methods (aliases)
	/////////////////////////////////
		
	// generate aliases
	(function (data) {
		var fn = $.Collection.fn, nm;
		
		data.forEach(function (el) {
			nm = $.toUpperCase(el, 1);
			
			fn["$" + nm] = function (nm) {
				return function (newParam) { return this._$(nm, newParam); };
			}(el);
			//
			fn["update" + nm] = function (nm) {
				return function (newParam) { return this._update(nm, newParam); };
			}(el);
			//
			fn["reset" + nm + "To"] = function (nm) {
				return function (objID, id) { return this._resetTo(nm, objID, id); };
			}(el);	
			//
			fn["push" + nm] = function (nm) {
				return function (objID, newParam) { return this._push.apply(this, $.unshiftArguments(arguments, nm)); }
			}(el);
			//
			fn["set" + nm] = function (nm) {
				return function (id) { return this._set(nm, id); };
			}(el);
			//
			fn["pushSet" + nm] = function (nm) {
				return function (id, newParam) { return this._push(nm, id, newParam)._set(nm, id); };
			}(el);
			//
			fn["back" + nm] = function (nm) {
				return function (nmb) { return this._back(nm, nmb || ""); };
			}(el);	
			//
			fn["back" + nm + "If"] = function (nm) {
				return function (nmb) { return this._backIf(nm, nmb || ""); };
			}(el);	
			//
			if (el === "filter" || el === "parser") {
				fn["drop" + nm] = function (nm) {
					return function () { return this._drop(nm, arguments); };
				}(el);	
			} else {
				fn["drop" + nm] = function (nm) {
					return function () { return this._drop(nm, arguments, null); };
				}(el);	
			}
			//
			if (el === "filter" || el === "parser") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments); };
				}(el);	
			} else if (el === "page") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, 1); };
				}(el);	
			} else if (el === "context") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, ""); };
				}(el);	
			}
			//
			fn["is" + nm] = function (nm) {
				return function (id) { return this._is(nm, id); };
			}(el);	
			//
			fn["exist" + nm] = function (nm) {
				return function (id) { return this._exist(nm, id || ""); };
			}(el);
			//
			fn["get" + nm] = function (nm) {
				return function (id) { return this._get(nm, id || ""); };
			}(el);
		});
	})($.Collection.fn.stack);	
	/////////////////////////////////
	//// single methods (core)
	/////////////////////////////////
	
	/**
	 * set new value to element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] - additional context
	 * @param {mixed} value - new value
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.set = function (context, value, id) {
		context = $.isExist(context) ? context.toString() : "";
		value = value === undefined ? "" : value;
		id = id || "";
		var
			dObj = this.dObj,	
			activeContext = this.getActiveParam("context").toString();
		//
		if (!context && !activeContext) {
			if (id && id !== this.ACTIVE) {
				return this._push("collection", id, value);
			} else { return this._update("collection", value); }
		}
		nimble.byLink(this._get("collection", id), activeContext + nimble.CHILDREN + context, value);
	
		return this;
	};
	/**
	 * get element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] - additional context
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {mixed}
	 */
	$.Collection.fn.get = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		var dObj = this.dObj;
		
		return nimble.byLink(this._get("collection", id || ""), this.getActiveParam("context").toString() + nimble.CHILDREN + context);
	};	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to object (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} [cValue] - new element or context for sourceID
	 * @param {String} [propType="push"] - add type (constants: "push", "unshift") or property name (can use "->unshift" - the result will be similar to work for an array "unshift")
	 * @param {String} [activeID=this.dObj.active.collectionID] - collection ID
	 * @param {String} [sourceID] - source ID (if move)
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.add = function (cValue, propType, activeID, sourceID, deleteType) {
		cValue = cValue !== undefined ? cValue : "";
		propType = propType || "push";
		deleteType = deleteType || false;
		//
		var
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
	
			cObj, sObj,
	
			collectionID = sys.collectionID,
			oCheck, lCheck;
		//
		cObj = nimble.byLink(this._get("collection", activeID || ""), this.getActiveParam("context").toString());
		//
		if (typeof cObj === "object") {
			oCheck = $.isPlainObject(cObj);
			
			// simple add
			if (!sourceID) {
				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + nimble.METHOD_SEPARATOR + "unshift" : propType;
					lCheck = nimble.addElementToObject(cObj, propType.toString(), cValue);
				} else {
					lCheck = true;
					cObj[propType](cValue);
				}
			
			// move
			} else {
				cValue = $.isExist(cValue) ? cValue.toString() : "";
				sObj = nimble.byLink(this._get("collection", sourceID || ""), cValue);
				
				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + nimble.METHOD_SEPARATOR + "unshift" : propType;
					lCheck = nimble.addElementToObject(cObj, propType.toString(), sObj);
				} else {
					lCheck = true;
					cObj[propType](sObj);
				}
				
				// delete element
				if (deleteType === true) { this.disable("context").deleteElementByLink(cValue, sourceID).enable("context"); }
			}
			
			// rewrites links (if used for an object "unshift")
			if (lCheck !== true) { this.set("", lCheck, activeID || ""); }
		} else { throw new Error("unable to set property!"); }
	
		return this;
	};
	
	/**
	 * push new element (only active)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj - new element
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.push = function (obj, id) {
		return this.add(obj, "", id || "");
	};
	/**
	 * unshift new element (only active)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj - new element
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.unshift = function (obj, id) {
		return this.add(obj, "unshift", id || "");
	};	
	/////////////////////////////////
	//// single methods (delete)
	/////////////////////////////////
		
	/**
	 * delete element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] - link
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementByLink = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		var
			cObj,
			activeContext = this.getActiveParam("context").toString();
		
		if (!context && !activeContext) {
			this.set("", null);
		} else { nimble.byLink(this._get("collection", id || ""), activeContext + nimble.CHILDREN + context, "", true); }
	
		return this;
	};
	/**
	 * delete elements by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext - link, array of links or object (collection ID: array of links)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementsByLink = function (objContext, id) {
		id = id || "";
		var key, i;
		if ($.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if ($.isArray(objContext[key])) {
						for (i = objContext[key].length; (i -= 1) > -1;) {
							this.deleteElementByLink(objContext[key][i], key);
						}
					} else { this.deleteElementByLink(objContext[key], key); }
				}
			}
		} else if ($.isArray(objContext)) {
			for (i = objContext.length; (i -= 1) > -1;) { this.deleteElementByLink(objContext[i], id); }
		} else { this.deleteElementByLink(objContext, id); }
	
		return this;
	};
	
	/**
	 * pop element
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.pop = function (id) { return this.deleteElementByLink("eq(-1)", id || ""); };
	/**
	 * shift element
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.shift = function (id) { return this.deleteElementByLink("eq(0)", id || ""); };	
	/////////////////////////////////
	//// single methods (concatenation)
	/////////////////////////////////
	
	/**
	 * concatenation of collections (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj - collection
	 * @param {Context} [context] - additional context
	 * @param {String} [id=this.ACTIVE] - collection ID, which is the concatenation
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.concat = function (obj, context, id) {
		context = $.isExist(context) ? context.toString() : "";
		id = id || "";
		var
			dObj = this.dObj,
			cObj = nimble.byLink(this._get("collection", id), this.getActiveParam("context").toString() + nimble.CHILDREN + context);	
		
		if (typeof cObj === "object") {
			if ($.isPlainObject(cObj)) {
				$.extend(true, cObj, obj)
			} else if ($.isArray(cObj)) {
				if ($.isArray(obj)) {
					cObj = Array.prototype.concat(cObj, obj);
					this.set(context, cObj, id);
				} else { this.add(obj, "push", id); }
			}
		} else { throw new Error("incorrect data type!"); }
	
		return this;
	};	
	/////////////////////////////////
	//// mult methods (core)
	/////////////////////////////////
	
	/**
	 * collection length (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Collection} [filter=false] - filter function, string expressions or "false"
	 * @param {String|Collection} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.fn.length = function (filter, id) {
		filter = $.isExist(filter) ? filter : this.getActiveParam("filter");
		var
			dObj = this.dObj,
			cObj, cOLength, aCheck,
			i, countRecords;
		
		if (!$.isFunction(filter)) {
			if (($.isString(filter) && !$.isExist(id)) || $.isArray(filter) || $.isPlainObject(filter)) {
				id = filter;
				filter = false;
			}
		}
		
		if (!id || id === this.ACTIVE) {
			cObj = dObj.active.collection;
		} else if ($.isString(id)) {
			cObj = dObj.sys.tmpCollection[id];
		} else {
			aCheck = true;
			cObj = id;
		}
		// if cObj is null
		if (cObj === null) { return 0; }
		// if cObj is collection
		if (aCheck !== true) { cObj = nimble.byLink(cObj, this.getActiveParam("context").toString()); }
		cOLength = cObj.length;
		// if cObj is String
		if ($.isString(cObj)) { return cOLength; }
		
		if (typeof cObj === "object") {
			if (filter === false && cOLength !== undefined) {
				countRecords = cOLength;
			} else {
				countRecords = 0;
				if (cOLength !== undefined) {
					cObj.forEach(function (el, i, obj) {
						if (this.customFilter(filter, el, cObj, i, cOLength || null, this, id ? id : this.ACTIVE) === true) {
							countRecords += 1;
						}
					}, this);
				} else {
					for (i in cObj) {
						if (cObj.hasOwnProperty(i)) {
							if (this.customFilter(filter, cObj[i], cObj, i, cOLength || null, this, id ? id : this.ACTIVE) === true) {
								countRecords += 1;
							}
						}
					}
				}
			}
		} else { throw new Error("incorrect data type!"); }
	
		return countRecords;
	};
	/**
	 * forEach method (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Function|Plain Object} callback - callback
	 * @param {Filter|String|Boolean} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.forEach = function (callback, filter, id, mult, count, from, indexOf) {
		callback = $.isFunction(callback) ? {filter: callback} : callback;
		filter = $.isExist(filter) ? filter : this.getActiveParam("filter");
		id = $.isExist(id) ? id : this.ACTIVE;
		
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			dObj = this.dObj,
			cObj, cOLength,
			cloneObj,
	
			i, j = 0;
		
		//
		cObj = nimble.byLink(id !== this.ACTIVE ? dObj.sys.tmpCollection[id] : dObj.active.collection, this.getActiveParam("context").toString());
		cOLength = this.length(cObj);
		//
		if ($.isArray(cObj)) {
			//
			if (indexOf !== false) {
				cloneObj = cObj.slice(indexOf);
			} else { cloneObj = cObj; }
			//
			cloneObj.some(function (el, i, obj) {
				i += indexOf;
				if (count !== false && j === count) { return true; }
					
				if (this.customFilter(filter, el, cObj, i, cOLength, this, id) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {
						if (callback.filter && callback.filter.call(callback.filter, el, cObj, i, cOLength, this, id) === false) { return true; }
						if (mult === false) { return true; }
						j += 1;
					}
				} else { if (callback.denial && (from === false || from === 0) && callback.denial.call(callback.denial, el, cObj, i, cOLength, this, id) === false) { return true; }}
				//
				if (callback.full && (from === false || from === 0) && callback.full.call(callback.full, el, cObj, i, cOLength, this, id) === false) { return true; }
			}, this);
		} else {
			for (i in cObj) {
				if (cObj.hasOwnProperty(i)) {
					if (count !== false && j === count) { break; }
					if (indexOf !== false && indexOf !== 0) { indexOf -= 1; continue; }
					
					if (this.customFilter(filter, cObj[i], cObj, i, cOLength, this, id) === true) {
						if (from !== false && from !== 0) {
							from -= 1;
						} else {	
							if (callback.filter && callback.filter.call(callback.filter, cObj[i], cObj, i, cOLength, this, id) === false) { break; }
							if (mult === false) { break; }
							j += 1;
						}
					}
				} else { if (callback.denial && (from === false || from === 0) && callback.denial.call(callback.denial, cObj[i], cObj, i, cOLength, this, id) === false) { break; }}
				//
				if (callback.full && (from === false || from === 0) && callback.full.call(callback.full, cObj[i], cObj, i, cOLength, this, id) === false) { break; }
			}
		}
	
		return this;
	};	
	/////////////////////////////////
	//// mult methods (search)
	/////////////////////////////////
	
	/**
	 * search elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Number|Array}
	 */
	$.Collection.fn.searchElements = function (filter, id, mult, count, from, indexOf) {
		filter = $.isExist(filter) ? filter : this.getActiveParam("filter");
		id = $.isExist(id) ? id : this.ACTIVE;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			result = [],
			action = function (el, data, i, aLength, self, id) {
				if (mult === true) {
					result.push(i);
				} else {
					result = i;
					return false;
				}
	
				return true;
			};
	
		this.forEach(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * search element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|Array}
	 */
	$.Collection.fn.searchElement = function (filter, id) {
		return this.searchElements(filter || "", id || "", false);
	};	
	/////////////////////////////////
	//// mult methods (return)
	/////////////////////////////////
	
	/**
	 * return elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {mixed}
	 */
	$.Collection.fn.returnElements = function (filter, id, mult, count, from, indexOf) {
		filter = $.isExist(filter) ? filter : this.getActiveParam("filter");
		id = $.isExist(id) ? id : this.ACTIVE;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			result = [],
			action = function (el, data, i, aLength, self, id) {
				if (mult === true) {
					result.push(data[i]);
				} else {
					result = data[i];
					return false;
				}
	
				return true;
			};
	
		this.forEach(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * return element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {mixed}
	 */
	$.Collection.fn.returnElement = function (filter, id) {
		return this.returnElements(filter || "", id || "", false);
	};
	/////////////////////////////////
	//// mult methods (replace)
	/////////////////////////////////
	
	/**
	 * replace elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 *  
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElements = function (filter, replaceObj, id, mult, count, from, indexOf) {
		filter = $.isExist(filter) ? filter : this.getActiveParam("filter");
		id = $.isExist(id) ? id : this.ACTIVE;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			replaceCheck = $.isFunction(replaceObj),
			action = function (el, data, i, aLength, self, id) {
				if (replaceCheck) {
					replaceObj.call(replaceObj, el, data, i, aLength, self, id);
				} else { data[i] = nimble.expr(replaceObj, data[i]); }
	
				return true;
			};
	
		this.forEach(action, filter, id, mult, count, from, indexOf);
	
		return this;
	};
	/**
	 * replace element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElement = function (filter, replaceObj, id) {
		return this.replaceElements(filter || "", replaceObj, id || "", false);
	};
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} [context] - source context
	 * @param {String} [sourceID=this.ACTIVE] - source ID
	 * @param {String} [activeID=this.ACTIVE] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of transfers (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, deleteType) {
		moveFilter = $.isExist(moveFilter) ? moveFilter : this.getActiveParam("filter");
		deleteType = deleteType === false ? false : true;
		context = $.isExist(context) ? context.toString() : "";
		
		sourceID = sourceID || "";
		activeID = activeID || "";
		
		addType = addType || "push";
		
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			deleteList = [],
			aCheckType = $.isArray(nimble.byLink(this._get("collection", activeID), this.getActiveParam("context").toString())),
	
			elements;
	
		// search elements
		this.disable("context");
		elements = this.searchElements(moveFilter, sourceID, mult, count, from, indexOf);
		this.enable("context");
		// move
		if (mult === true) {
			elements.forEach(function (el) {
				this.add(context + nimble.CHILDREN + el, aCheckType === true ? addType : el + nimble.METHOD_SEPARATOR + addType, activeID, sourceID);
				deleteType === true && deleteList.push(el);
			}, this);
		} else {
			this.add(context + nimble.CHILDREN + elements, aCheckType === true ? addType : elements + nimble.METHOD_SEPARATOR + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
		
		// delete element
		if (deleteType === true) { this.disable("context").deleteElementsByLink(deleteList, sourceID).enable("context"); }
	
		return this;
	},
	/**
	 * move element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context
	 * @param {String} [sourceID=this.ACTIVE] - source ID
	 * @param {String} [activeID=this.ACTIVE] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false);
	};
	/**
	 * copy elements (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context
	 * @param {String} [sourceID=this.ACTIVE] - source ID
	 * @param {String} [activeID=this.ACTIVE] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of copies (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf) {
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "push", mult, count, from, indexOf, false);
	};
	/**
	 * copy element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context
	 * @param {String} [sourceID=this.ACTIVE] - source ID
	 * @param {String} [activeID=this.ACTIVE] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false, "", "", "", false);
	};	
	/////////////////////////////////
	//// mult methods (delete)
	/////////////////////////////////
	
	/**
	 * delete elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of deletions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElements = function (filter, id, mult, count, from, indexOf) {
		filter = $.isExist(filter) ? filter : this.getActiveParam("filter");
		id = $.isExist(id) ? id : this.ACTIVE;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var elements = this.searchElements(filter, id, mult, count, from, indexOf), i;
		if (mult === false) {
			this.deleteElementByLink(elements, id);
		} else { for (i = elements.length; (i -= 1) > -1;) { this.deleteElementByLink(elements[i], id); } }
	
		return this;
	};
	/**
	 * delete element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElement = function (filter, id) {
		return this.deleteElements(filter || "", id || "", false);
	};	
	/////////////////////////////////
	// additional methods
	/////////////////////////////////
	
	/**
	 * calculate multi filter
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Collection} data - link to collection
	 * @param {Number|String} i - iteration (key)
	 * @param {Number} cOLength - collection length
	 * @param {Collection Object} self - link to collection object
	 * @param {String} id - collection ID
	 * @return {Boolean}
	 */
	$.Collection.fn.customFilter = function (filter, el, data, i, cOLength, self, id) {
		var
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
			
			fLength,
			calFilter, tmpFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			j = -1;
		
		// if filter is disabled
		if (filter === false) { return true; }
		// if filter is function
		if ($.isFunction(filter)) { return filter.call(filter, el, data, i, cOLength, self, id); }
		
		// if filter is not defined or filter is a string constant
		if (!filter || ($.isString(filter) && $.trim(filter) === this.ACTIVE)) {
			if (active.filter) { return active.filter.call(active.filter, el, data, i, cOLength, self, id); }
			
			return true;
		} else {
			// if filter is string
			if (!$.isArray(filter)) {
				// if simple filter
				if (filter.search(/\|\||&&|!|\(|\)/) === -1) {
					return sys.tmpFilter[filter].call(sys.tmpFilter[filter], el, data, i, cOLength, self, id);
				}
				
				filter = $.trim(
							filter
								.toString()
								.replace(/\s*(\(|\))\s*/g, " $1 ")
								.replace(/\s*(\|\||&&)\s*/g, " $1 ")
								.replace(/(!)\s*/g, "$1")
						).split(" ");
			}
			// calculate deep filter
			calFilter = function (array, iter) {
				var
					i = -1,
					aLength = array.length,
					pos = 0,
					result = [];
				
				for (; (i += 1) < aLength;) {
					iter += 1;
					if (array[i] === "(") { pos += 1; }
					if (array[i] === ")") {
						if (pos === 0) {
							return {result: result, iter: iter};
						} else { pos -= 1; }
					}
					result.push(array[i]);
				}
			};
			
			// calculate filter
			fLength = filter.length;
			for (; (j += 1) < fLength;) {
				// calculate atoms
				if (filter[j] === "(" || filter[j] === "!(") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = calFilter(filter.slice((j + 1)), j);
					j = tmpFilter.iter;
					//
					tmpResult = this.customFilter(tmpFilter.result, el, data, i, cOLength, self, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else { result = inverse === true ? !tmpResult : tmpResult || result; }
				// calculate outer filter
				} else if (filter[j] !== ")" && filter[j] !== "||" && filter[j] !== "&&") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = filter[j] === this.ACTIVE ? active.filter : sys.tmpFilter[filter[j]];
					tmpResult = tmpFilter.call(tmpFilter, el, data, i, cOLength, self, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else { result = inverse === true ? !tmpResult : tmpResult || result; }
				// "and" or "or"
				} else if (filter[j] === "||") {
					and = false;
					or = true;
				} else if (filter[j] === "&&") {
					or = false;
					and = true;
				}
			}
			
			return result;
		}
	};
	/**
	 * calculate multi parser
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|String|Boolean} parser - parser function or string expressions or "false"
	 * @param {String} str - source string
	 * @return {String}
	 */
	$.Collection.fn.customParser = function (parser, str) {
		var
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
			
			tmpParser;
		
		// if parser is disabled
		if (parser === false) { return str; }
		// if parser is function
		if ($.isFunction(parser)) { return parser.call(parser, str, this); }
		
		// if parser is not defined or parser is a string constant
		if (!parser || ($.isString(parser) && $.trim(parser) === this.ACTIVE)) {
			if (active.parser) { return active.parser.call(active.parser, str, this); }
	
			return str;
		} else {
			if ($.isString(parser)) {
				parser = $.trim(parser);
				// if simple parser
				if (parser.search("&&") === -1) { return sys.tmpParser[parser].call(sys.tmpParser[parser], str, this); }
				parser = parser.split("&&");
			}
			//
			parser.forEach(function (el) {
				el = $.trim(el);
				tmpParser = el === this.ACTIVE ? active.parser : sys.tmpParser[el];
				
				str = tmpParser.call(tmpParser, str, this);
			}, this);
	
			return str;
		}
	};
	
	/**
	 * calculate parent context
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level up
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {String}
	 */
	$.Collection.fn.parentContext = function (n, id) {
		n = n || 1;
		var context = "", i;
		//
		context = this._get("collection", id || "").split(nimble.CHILDREN);
        for (i = n; (i -= 1) > -1;) { context.splice(-1, 1); }
	
		return context.join(nimble.CHILDREN);
	};
	/**
	 * parent
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level up
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.parent = function (n, id) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			active = dObj.active,
	
			contextID = sys.contextID,
			context = this.parentContext.apply(this, arguments);
	
		if (!id || id === this.ACTIVE) {
			if (contextID) { sys.tmpContext[contextID] = context; }
			active.context = context;
		} else {
			sys.tmpContext[id] = context;
			if (contextID && id === contextID) { active.context = context; }
		}
	
		return this;
	};	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * sort collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [field] - field name
	 * @param {Boolean} [rev=false] - reverce (contstants: "shuffle" - random order)
	 * @param {Function|Boolean} [fn=toUpperCase] - callback ("false" if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.orderBy = function (field, rev, fn, id) {
		field = field || null;
		rev = rev || false;
		fn = fn ? fn === false ? null : fn : function (a) {
			if (isNaN(a)) { return a.toUpperCase(); }
			
			return a;
		};
	
		id = id || "";
	
		var
			dObj = this.dObj,
			sys = dObj.sys,
	
			collectionID = sys.collectionID,
			cObj,
	
			// sort object by key
			sortObjectByKey = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					key;
				//
				for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
				sortedKeys.sort(statObj.sort.sortBy(field, rev, fn));
				//
				for (key in sortedKeys) {
					if (sortedKeys.hasOwnProperty(key)) { sortedObj[sortedKeys[key]] = obj[sortedKeys[key]]; }
				}
	
				return sortedObj;
			},
			// sort object by value
			sortObject = function (obj) {
				var
					sortedValues = [],
					sortedObj = {},
					key;
				//
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						sortedValues.push({
							key: key,
							value: obj[key]
						});
					}
				}
				sortedValues.sort(statObj.sort.sortBy(field === true ? "value" : "value" + statObj.obj.contextSeparator + field, rev, fn));
				//
				for (key in sortedValues) {
					if (sortedValues.hasOwnProperty(key)) { sortedObj[sortedValues[key].key] = sortedValues[key].value; }
				}
	
				return sortedObj;
			};
		//
		cObj = nimble.byLink(this._get("collection", id), this.getActiveParam("context").toString());
		if (typeof cObj === "object") {
			if ($.isArray(cObj)) {
				cObj.sort($.Collection.sort.sortBy(field, rev, fn));
			} else {
				if (field) {
					cObj = sortObject.call(this, cObj);
				} else { cObj = sortObjectByKey.call(this, cObj); }
				//
				this.set("", cObj, id || "");
			}
		} else { throw new Error("incorrect data type!"); }
	
		return this;
	};	
	/////////////////////////////////
	// native
	/////////////////////////////////
		
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Collection} [objID=this.ACTIVE] - collection ID or collection
	 * @param {Function|Array} [replacer] - an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space] - indentation of nested structures
	 * @return {String}
	 */
	$.Collection.fn.toString = function (objID, replacer, space) {
		var dObj = this.dObj, cObj;
		
		if (objID && ($.isArray(objID) || $.isPlainObject(objID))) {
			if (JSON && JSON.stringify) { return JSON.stringify(objID, replacer || "", space || ""); }
			throw new Error("object JSON is not defined!");
		}
		//
		cObj = nimble.byLink(this._get("collection", objID || ""), this.getActiveParam("context").toString());
		//
		if (JSON && JSON.stringify) { return JSON.stringify(cObj, replacer || "", space || ""); }
		throw new Error("object JSON is not defined!");
	};
	/**
	 * return collection length
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number}
	 */
	$.Collection.fn.valueOf = function (id) {
		return this.length($.isExist(id) ? id : this.ACTIVE);
	};	
	/////////////////////////////////
	// other
	/////////////////////////////////
	
	/**
	 * jQuery "then" method
	 * 
	 * @this {Colletion Object}
	 * @param {Function} done - callback (if success)
	 * @param {Function} [fail=done] - callback (if failed)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.then = function (done, fail) {
		var self = this;
		
		if (arguments.length === 1) {
			$.when(self.active("defer")).always(function () { done.apply(self, arguments); });
		} else {
			$.when(self.active("defer")).then(
				function () { done().apply(self, arguments); },
				function () { fail().apply(self, arguments); }
			);
		}
			
		return this;
	};	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
		
	/**
	 * templating (in context)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Collection|String} [param.collection=this.dObj.active.collection] - collection or collection ID
	 * @param {String} [param.context] - additional context
	 * @param {Number} [param.page=this.dObj.active.page] - page number
	 * @param {Template} [param.template=this.dObj.active.template] - template
	 * @param {Number|Boolean} [param.numberBreak=this.dObj.active.numberBreak] - number of entries on 1 page (if "false", returns all records)
	 * @param {Number} [param.pageBreak=this.dObj.active.pageBreak] - number of displayed pages (navigation, > 2)
	 * @param {jQuery Object|Boolean} [param.target=this.dObj.active.target] - element to output the result ("false" - if you print a variable)
	 * @param {String} [param.variable=this.dObj.sys.variableID] - variable ID (if param.target === false)
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.active.parser] - parser function, string expressions or "false"
	 * @param {Boolean} [param.cacheIteration=this.dObj.cache.iteration] - if "true", the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.dObj.active.calculator] - selector, on which is the number of records per page
	 * @param {Selector} [param.pager=this.dObj.active.pager] - selector to pager
	 * @param {String} [param.appendType=this.dObj.active.appendType] - type additions to the DOM
	 * @param {String} [param.resultNull=this.dObj.active.resultNull] - text displayed if no results
	 * @param {Boolean} [page=false] - break on page
	 * @param {Boolean} [clear=false] - clear the cache
	 * @return {Colletion Object}
	 */
	$.Collection.fn.print = function (param, page, clear) {
		page = page || false;
		clear = clear || false;
		var
			dObj = this.dObj,
			active = dObj.active,
			opt = {},
			
			cObj, cOLength,
			start, inc = 0, checkPage, from = null,
			
			result = "", action;
			
		// easy implementation
		if ($.isExist(param) && ($.isString(param) || $.isNumeric(param))) {
			param = {page: param};
		} else if ($.isBoolean(param)) {
			page = param;
		} else if (!$.isExist(param)) { param = {page: active.page} }
		
		//
		$.extend(true, opt, active, param);
		if (param) { opt.page = nimble.expr(opt.page, active.page || ""); }
		if (opt.page < 1) { opt.page = 1; }
		//
		opt.collection = $.isString(opt.collection) ? this._get("collection", opt.collection) : opt.collection;
		opt.template = $.isString(opt.template) ? this._get("template", opt.template) : opt.template;
		//
		opt.filter = $.isExist(param.filter) ? param.filter : this.getActiveParam("filter");
		opt.parser = $.isExist(param.parser) ? param.parser : this.getActiveParam("parser");
		//
		if (clear === true) { opt.cache.iteration = false; }
		//
		checkPage = active.page - opt.page;
		this.updatePage(opt.page);
		//
		action = function (el, data, i, cOLength, self, id) {
			// callback
			opt.callback && opt.callback.apply(this, arguments);
			//
			result += opt.template.call(opt.template, el, data, i, cOLength, self, id);
			inc = i;
				
			return true;
		};
		// get collection
		cObj = nimble.byLink(opt.collection, this.getActiveParam("context").toString() + nimble.CHILDREN + ((param && param.context) || ""));
		cOLength = this.length();
		
		// number of records per page
		opt.numberBreak = !page || opt.numberBreak === false ? cOLength : opt.numberBreak;
		//
		if ($.isPlainObject(cObj) || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = !page || opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak;
			//
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.numberBreak, start);
			if (opt.cache.iteration === false) { opt.cache.lastIteration = false; }
		} else if ($.isArray(cObj) && opt.cache.iteration === true) {
			// calculate the starting position
			start = !page || opt.filter === false ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak : opt.cache.iteration === true ?
							checkPage >= 0 ? opt.cache.firstIteration : opt.cache.lastIteration : i;
							
			// rewind cached step back
			if (checkPage > 0 && (page === true && opt.filter !== false)) {
				checkPage = opt.numberBreak * checkPage;
				for (; (start -= 1) > -1;) {
					if (this.customFilter(opt.filter, cObj[start], cObj, start, cOLength, this, this.ACTIVE) === true) {
						if (inc === checkPage) {
							break;
						} else { inc += 1; }
					}
				}
				opt.cache.lastIteration = (start += 1);
				from = null;
			} else if (checkPage < 0 && (page === true && opt.filter !== false)) { from = Math.abs(checkPage) * opt.numberBreak - opt.numberBreak || null; }
			//
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.numberBreak, from, start);
		}
		if (checkPage !== 0 && opt.cache.iteration !== false) {
			// cache
			active.cache.firstIteration = opt.cache.lastIteration;
			active.cache.lastIteration = inc + 1;
		}
		if (opt.cache.autoIteration === true) { active.cache.iteration = true; }
		//
		result = !result ? opt.resultNull : this.customParser(opt.parser, result);
		// append to DOM
		if (opt.target === false) {
			if (!opt.variable) {
				this._$("variable", result);
			} else { this._push("variable", opt.variable, result); }
			
			return this;
		} else { opt.target[opt.appendType](result); }
		//
		if (!page) { return this; }
		//
		opt.nmbOfEntries = opt.filter !== false ? this.length(opt.filter) : cOLength;
		opt.nmbOfEntriesInPage = opt.target.find(opt.calculator).length;
		opt.finNumber = opt.numberBreak * opt.page - (opt.numberBreak - opt.nmbOfEntriesInPage);
		// generate navigation bar
		if (opt.page !== 1 && opt.nmbOfEntriesInPage === 0) {
			this.updatePage((opt.page -= 1)).print(opt, true, true);
		} else { this.easyPage(opt); }
	
		return this;
	};
	
	/**
	 * activation of the model template
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param] - object settings (depends on the model template)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.easyPage = function (param) {
		var
			str = "",
			//
			nmbOfPages = param.nmbOfEntries % param.numberBreak !== 0 ? ~~(param.nmbOfEntries / param.numberBreak) + 1 : param.nmbOfEntries / param.numberBreak,
			genPage = function (data, classes, i) {
				var key, str = "<" + (data.tag || "span") + ' data-page="' + i + '"';
				if (data.attr) {
					for (key in data.attr) {
						if (data.attr.hasOwnProperty(key)) {
							str += ' ' + key + '="' + data.attr[key] + '"';
						}
					}
				}
				//
				if (i === param.page) { str += ' class="' + (classes && classes.active || "active") + '"'; }
				return str += ">" + i + "</" + (data.tag || "span") + ">";
			},
			//
			i, j = 0, from, to;
		//
		param.pager.find("[data-ctm]").each(function () {
			if (param.pageBreak <= 2) { throw new Error('parameter "pageBreak" must be more than 2'); }
			
			var
				$this = $(this),
				data = $this.data("ctm"),
				classes = data.classes;

			if (data.nav) {
				if ((data.nav === "prev" && param.page === 1) || (data.nav === "next" && param.finNumber === param.nmbOfEntries)) {
					$this.addClass(classes && classes.disabled || "disabled");
				} else if (data.nav === "prev" || data.nav === "next") { $this.removeClass(classes && classes.disabled || "disabled"); }
				//
				if (data.nav === "pageList") {
					if (nmbOfPages > param.pageBreak) {	
						j = param.pageBreak % 2 !== 0 ? 1 : 0;
						from = (param.pageBreak - j) / 2;
						to = from;
						if (param.page - j < from) {
							from = 0;
						} else {
							from = param.page - from - j;
							if (param.page + to > nmbOfPages) {
								from -= param.page + to - nmbOfPages;
							}
						}
						
						for (i = from, j = -1; (i += 1) <= nmbOfPages && (j += 1) !== null;) {
							if (j === param.pageBreak && i !== param.page) { break; }
							str += genPage(data, classes || "", i);
						}
					} else { for (i = 0; (i += 1) <= nmbOfPages;) { str += genPage(data, classes || "", i); } }
					$this.html(str);
				}
			} else if (data.info) {
				if (param.nmbOfEntriesInPage === 0) {
					$this.addClass(classes && classes.noData || "noData");
				} else { $this.removeClass(classes && classes.noData || "noData"); }
				//
				switch (data.info) {
					case "page" : { $this.html(param.page); } break;
					case "total" : { $this.html(param.nmbOfEntries); } break;
					case "from" : { $this.html((param.page - 1) * param.numberBreak + 1); } break;
					case "to" : { $this.html(param.finNumber); } break;
					case "inPage" : { $this.html(param.nmbOfEntriesInPage); } break;
					case "nmbOfPages" : { $this.html(param.nmbOfPages); } break;
				}
			}
		});
		
		return this;
	};	
	/////////////////////////////////
	//// design methods (table)
	/////////////////////////////////
		
	/**
	 * generating the table
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [count=4] - td number to a string
	 * @param {String} [tag="div"] - tag name
	 * @param {Boolean} [empty=true] - display empty cells
	 * @return {Colletion Object}
	 */
	$.Collection.fn.genTable = function (count, tag, empty) {
		count = count || 4;
		tag = tag || "div";
		empty = empty === false ? false : true;
		var
			i = 1, j,
	
			target = this.dObj.active.target,
			tagLength = target.find(tag).length,
	
			queryString = "";
		
		target.find(tag).each(function (n) {
			if (this.tagName !== "td") { $(this).wrap("<td></td>"); }
			//
			if (i === count) {
				queryString = "";
				//
				for (j = -1; (j += 1) < count;) {
					queryString += "td:eq(" + (n - j) + ")";
					if (j !== (count - 1)) { queryString += ","; }
				}
				//
				target.find(queryString).wrapAll("<tr></tr>");
				i = 0;
			} else if (n === (tagLength - 1) && i !== count) {
				queryString = "";
				//
				for (j = -1, i; (j += 1) < i;) {
					queryString += "td:eq(" + (n - j) + ")";
					if (j !== (i - 1)) { queryString += ","; }
				}
				i -= 1;
				target.find(queryString).wrapAll("<tr></tr>");	
				//
				if (empty === true) {
					queryString = "";
					for (; (i += 1) < count;) { queryString += "<td></td>"; }
					target.find("tr:last").append(queryString);
				}
			}
			i += 1;
		});
		if (target[0].tagName !== "table") { target.children("tr").wrapAll("<table></table>"); }
	
		return this;
	};
})(jQuery); //