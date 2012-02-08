/**
 * nimble - simple JavaScript framework for working with objects
 *
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @date: 01.01.2012 21:55:59
 * @version 1.0.2
 */
var nimble = (function () {
	// try to use ECMAScript 5 "strict mode"
	"use strict";
	
	return {
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
		version: "1.0.2",
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
			while (ws.test(str.charAt((i -= 1)))){};
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
		isExists: function (obj) { return obj !== undefined && obj !== "undefined" && obj !== null && obj !== ""; },
		
		/**
		 * calculate math expression
		 * 
		 * @param {mixed} val - new value
		 * @param {mixed} old - old value
		 * @return {mixed}
		 */
		expr: function (val, old) {
			old = old !== undefined || old !== null ? old : "";
			if (this.isString(val) && val.search(/^[+-\\*/]{1}=/) !== -1) {
				val = val.split("=");
				if (!isNaN(val[1])) { val[1] = +val[1]; }
				// simple math
				switch (val[0]) {
					case "+": { val = old + val[1]; } break;
					case "-": { val = old - val[1]; } break;
					case "*": { val = old * val[1]; } break;
					case "/": { val = old / val[1]; } break;
				}
			}
		
			return val;
		},
		
		/**
		 * set new value to object by link or get object by link
		 * 
		 * @this {nimble}
		 * @param {Object|Number|Boolean} obj - some object
		 * @param {Context} context - link
		 * @param {mixed} [value] - some value
		 * @param {Boolean} [del=false] - if "true", remove source element
		 * @return {nimble|Boolean|mixed}
		 */
		byLink: function (obj, context, value, del) {
			context = context
						.toString()
						.replace(new RegExp("\\s*" + this.CHILDREN + "\\s*", "g"), " " + this.CHILDREN + " ")
						.split(this.CONTEXT_SEPARATOR);
			del = del || false;
			
			//
			var
				type = this.CHILDREN,
				last = 0, total = 0,
				
				key, i = context.length,
				pos, n,
		
				objLength, cLength;
		
			// remove "dead" elements
			while ((i -= 1) > -1) {
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
								if (del === false) {
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
										if (del === false) {
											obj[pos] = this.expr(value, obj[pos]);
										} else { obj.splice(pos, 1); }
									} else {
										if (del === false) {
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
												if (del === false) {
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
		 * @param {mixed} [_this=event] - this object
		 * @return {mixed}
		 */
		execEvent: function (query, event, param, _this) {
			query = query.split(this.QUERY_SEPARATOR);
			param = this.isExists(param) ? param : [];
			param = this.isArray(param) ? param : [param];
			//
			var 
				i = -1,
				qLength = query.length - 1,
				spliter;
		
			while ((i += 1) < qLength) { event = event[query[i]]; }
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
})();﻿/**
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
 * 6) [Filter] is a reduced form of the [Filter|String|Boolean] and means the function-filter, string expressions or "false";
 * 7) [Parser] is a reduced form of the [Parser|String|Boolean] and means function-parser, string expressions or "false";
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
 * @date: 15.01.2012 23:16:19
 * @version 3.4
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
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.active] - additional properties
	 */
	$.Collection = function (collection, prop) {
		collection = collection || null;
		prop = prop || null;
		
		// create "factory" function if need
		if (this.fn && (!this.fn.name || this.fn.name !== "$.Collection")) { return new $.Collection(collection, prop); }
		
		// mixin public fields
		$.extend(true, this, $.Collection.storage);
		var active = this.dObj.active;
		
		// extend public fields by additional properties if need
		if (prop) { $.extend(true, active, prop); }
		if ($.isString(active.filter)) { active.filter = this._compileFilter(active.filter); }
		
		// if "collection" is string
		if ($.isString(collection)) {
			active.target = $(collection);
			active.collection = null;
		} else { active.collection = collection; }
	};	
	/////////////////////////////////
	//// array prototype
	/////////////////////////////////

	if (!Array.prototype.forEach) {
		/**
		 * calls a function for each element in the array
		 *
		 * @this {Array}
		 * @param {Function} callback - callback function
		 * @param {mixed} [_this] - object to use as this when executing callback
		 * @return {undefined}
		 */
		Array.prototype.forEach = function (callback, _this) {
			var i = -1, aLength = this.length;
			//
			while ((i += 1) < aLength) {
				if (!_this) {
					callback(this[i], i, this);
				} else { callback.call(_this, this[i], i, this); }
			}
		}
	}
	//
	if (!Array.prototype.some) {
		/**
		 * tests whether some element in the array passes the test implemented by the provided function
		 *
		 * @this {Array}
		 * @param {Function} callback - callback function
		 * @param {mixed} [_this] - object to use as this when executing callback
		 * @return {undefined}
		 */
		Array.prototype.some = function (callback, _this) {
			var i = -1, aLength = this.length, res;
			//
			while ((i += 1) < aLength) {
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
	
	$.Collection.prototype = {
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
		version: "3.5",
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Prototype}
		 * @return {String}
		 */
		collection: function () { return this.name + " " + this.version; },
		
		// const
		ACTIVE: "active",
		SHUFFLE: "shuffle",
		NAMESPACE_SEPARATOR: ".",
		
		/**
		 * stack parameters
		 * 
		 * @field
		 * @type Array
		*/
		stack: [
		"namespace",
		
		"collection",
		"filter",
		"context",
		"cache",
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
		]
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
				while ((i += 1) < eLength) {
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
	
						txt = text(this),
						key;
	
					array.push({});
					for (key in data) { if (data.hasOwnProperty(key)) { array[n][key] = data[key]; } }
					//
					if (classes) {
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
		if (this.length === 0) { throw new Error("DOM element does't exist!"); }
		
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
		//
		elem.forEach(function (el, i) {
			if (i === 0 || i % 2 === 0) {
				resStr += "result +='" + el + "';";
			} else { resStr += el.split("echo").join("result +="); }
		});
		
		return new Function("el", "i", "data", "cOLength", "cObj", "id", resStr + " return result;");
	};
	
	/**
	 * make templates
	 * 
	 * @this {jQuery Object}
	 * @param {Collection Object} cObj - an instance of $.Collection
	 * @return {Collection Object}
	 */
	$.fn.ctplMake = function (cObj) {
		this.each(function () {
			var
				$this = $(this),
				data = $this.data("ctpl"), key,
				
				prefix = data.prefix ? data.prefix + "_" : "";
			//
			if ($.isString(data)) { data = $.parseJSON(data); }
			//
			cObj._push("template", prefix + data.name, $this.ctplCompile());
			if (data.set && data.set === true) { cObj._set("template", prefix + data.name); }
			
			//
			for (key in data) {
				if (!data.hasOwnProperty(key)){ continue; }
				if (key === "prefix" || key === "set" || key === "print" || key === "name") { continue; }
				//
				if (key === "target" || key === "pager") { data[key] = $(data[key]); }
				
				cObj._push(key, prefix + data.name, data[key]);
				if (data.set && data.set === true) { cObj._set(key, prefix + data.name); }
				//
				if (key === "filter" || key === "parser" ) { data[key] = prefix + data.name; }
			}
			//
			if (data.print && data.print === true) {
				data.template = data.name;
				cObj.print(data);
			}
		});
		
		return this;
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
	$.isExists = function (val) { return nimble.isExists(val); };
	/**
	 * unshift for arguments (object)
	 * 
	 * @param {Object} obj - some object
	 * @param {mixed} pushVal - new value
	 * @return {Array}
	 */
	$.unshiftArguments = function (obj, pushVal) {
		var newObj = [pushVal], i = -1, oLength = obj.length;
		while ((i += 1) < oLength) { newObj.push(obj[i]); }
		
		return newObj;
	};
	/**
	 * toUpperCase function
	 * 
	 * @param {String} str - some str
	 * @param {Number} [max=str.length] - the maximum number of characters
	 * @param {Number} [from=0] - start position
	 * @return {String}
	 */
	$.toUpperCase = function (str, max, from) {
		from = from || 0;
		max = $.isExists(max) ? from + max : str.length;
		
		return str.substring(0, from) + str.substring(from, max).toUpperCase() + str.substring(max);
	};
	/**
	 * toLowerCase function
	 * 
	 * @param {String} str - some str
	 * @param {Number} [max=str.length] - the maximum number of characters
	 * @param {Number} [from=0] - start position
	 * @return {String}
	 */
	$.toLowerCase = function (str, max, from) {
		from = from || 0;
		max = $.isExists(max) ? from + max : str.length;
		
		return str.substring(0, from) + str.substring(from, max).toLowerCase() + str.substring(max);
	};
	
	/**
	 * get random integer number
	 * 
	 * @param {Number} min - min number
	 * @param {Number} max - max number
	 * @return {Number}
	 */
	$.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
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
				 * namespace
				 * 
				 * @field
				 * @type String
				 */
				namespace: "nm",
				
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
					autoIteration: true,
					/**
					 * use cache
					 * 
					 * @field
					 * @type Boolean
					 */
					iteration: true,
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
				 * @type jQuery Object
				 */
				pager: null,
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
		//
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
				parser: true,
				
				/**
				 * use cache
				 * 
				 * @field
				 * @type Boolean
				 */
				cache: false
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
	})($.Collection.prototype.stack);	
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
	$.Collection.prototype._new = function (propName, newProp) {
		var
			active = this.dObj.active,
			upperCase = $.toUpperCase(propName, 1);
		//
		if ((propName === "filter" || propName === "parser") && $.isString(newProp) && newProp.search(/^:/) !== -1) {
			active[propName] = this["_compile" + $.toUpperCase(propName, 1)](newProp);
		} else { active[propName] = nimble.expr(newProp, active[propName] || ""); }
		this.dObj.sys["active" + upperCase + "ID"] = null;
		//
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
	$.Collection.prototype._update = function (propName, newProp) {
		var
			active = this.dObj.active,
			sys = this.dObj.sys,
			
			activeID = this._getActiveID(propName);
		
		if ((propName === "filter" || propName === "parser") && $.isString(newProp) && newProp.search(/^:/) !== -1) {
			active[propName] = this["_compile" + $.toUpperCase(propName, 1)](newProp);
		} else { active[propName] = nimble.expr(newProp, active[propName] || ""); }
		if (activeID) { sys["tmp" + $.toUpperCase(propName, 1)][activeID] = active[propName]; }

		return this;
	};
	/**
	 * get property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.ACTIVE] - stack ID
	 * @throw {Error}
	 * @return {mixed}
	 */
	$.Collection.prototype._get = function (propName, id) {
		if (id && id !== this.ACTIVE) {
			if (!this._exists(propName, id)) { throw new Error('the object "' + id + '" -> "' + propName + '" doesn\'t exist in the stack!'); }
			//
			return this.dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		}

		return this.dObj.active[propName];
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
	$.Collection.prototype._push = function (propName, objID, newProp) {
		var
			tmp = this.dObj.sys["tmp" + $.toUpperCase(propName, 1)],
			activeID = this._getActiveID(propName),

			key;
		//	
		if ($.isPlainObject(objID)) {
			for (key in objID) {
				if (objID.hasOwnProperty(key)) {
					if (key === this.ACTIVE) {
						throw new Error("invalid property name!");
					} else {
						if (tmp[key] && activeID && activeID === key) {
							this._update(propName, objID[key]);
						} else {
							if ((propName === "filter" || propName === "parser") && $.isString(objID[key]) && newProp.search(/^:/) !== -1) {
								tmp[key] = this["_compile" + $.toUpperCase(propName, 1)](objID[key]);
							} else { tmp[key] = objID[key]; }
						}
						
					}
				}
			}
		} else {
			if (objID === this.ACTIVE) {
				throw new Error("invalid property name!");
			} else {
				if (tmp[objID] && activeID && activeID === objID) {
					this._update(propName, newProp);
				} else {
					if ((propName === "filter" || propName === "parser") && $.isString(newProp) && newProp.search(/^:/) !== -1) {
						tmp[objID] = this["_compile" + $.toUpperCase(propName, 1)](newProp);
					} else { tmp[objID] = newProp; }
				}
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
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._set = function (propName, id) {
		var
			sys = this.dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			tmpChangeControlStr = propName + "ChangeControl",
			tmpActiveIDStr = "active" + upperCase + "ID";
		
		if (!this._exists(propName, id)) { throw new Error('the object "' + id + '" -> "' + propName + '" doesn\'t exist in the stack!'); }
		//
		if (sys[tmpActiveIDStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIDStr] = id;
		} else { sys[tmpChangeControlStr] = false; }

		sys[propName + "Back"].push(id);
		this.dObj.active[propName] = sys["tmp" + upperCase][id];

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
	$.Collection.prototype._back = function (propName, nmb) {
		var
			sys = this.dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			propBack = sys[propName + "Back"],

			pos = propBack.length - (nmb || 1) - 1;
		//
		if (pos >= 0 && propBack[pos]) {
			if (sys["tmp" + upperCase][propBack[pos]]) {
				this._set(propName, propBack[pos]);
				sys[propName + "ChangeControl"] = false;
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
	$.Collection.prototype._backIf = function (propName, nmb) {
		if (this.dObj.sys[propName + "ChangeControl"] === true) { return this._back.apply(this, arguments); }

		return this;
	};
	/**
	 * remove property from stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array|Plain Object} [objID=active] - stack ID or array of IDs
	 * @param {mixed} [deleteVal=false] - default value (for active properties)
	 * @param {mixed} [resetVal] - reset value (overload)
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._drop = function (propName, objID, deleteVal, resetVal) {
		deleteVal = deleteVal === undefined ? false : deleteVal;
		//
		var
			active = this.dObj.active,
			sys = this.dObj.sys,
			
			upperCase = $.toUpperCase(propName, 1),
			tmpActiveIDStr = "active" + upperCase + "ID",
			tmpTmpStr = "tmp" + upperCase,

			activeID = this._getActiveID(propName),
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
	$.Collection.prototype._reset = function (propName, objID, resetVal) {
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
	$.Collection.prototype._resetTo = function (propName, objID, id) {
		var mergeVal = !id || id === this.ACTIVE ? this.dObj.active[propName] : this.dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		
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
	$.Collection.prototype._exists = function (propName, id) {
		var upperCase = $.toUpperCase(propName, 1);
		
		if ((!id || id === this.ACTIVE) && this._getActiveID(propName)) { return true; }
		if (this.dObj.sys["tmp" + upperCase][id] !== undefined) { return true; }

		return false;
	};
	/**
	 * get active ID
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @return {String|Null}
	 */
	$.Collection.prototype._getActiveID = function (propName) {
		return this.dObj.sys["active" + $.toUpperCase(propName, 1) + "ID"];
	};
	/**
	 * check the property on the activity
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} id - stack ID
	 * @return {Boolean}
	 */
	$.Collection.prototype._isActive = function (propName, id) {
		if (id === this._getActiveID(propName)) { return true; }

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
	$.Collection.prototype.use = function (id) {
		this.stack.forEach(function (el) {
			var nm, tmpNm, i;
			//
			if (this._exists(el, id)) {
				this._set(el, id);
			} else {
				nm = id.split(this.NAMESPACE_SEPARATOR);
				for (i = nm.length; (i -= 1) > -1;) {
					nm.splice(i, 1);
					tmpNm = nm.join(this.NAMESPACE_SEPARATOR);
					//
					if (this._exists(el, tmpNm)) {
						this._set(el, tmpNm);
						break;
					}
				}
				
			}
		}, this);
				
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
	$.Collection.prototype._prop = function (propName, objKey, value) {
		var prop = this.dObj[propName];
		
		if (arguments.length !== 3) {
			if ($.isPlainObject(objKey)) {
				$.extend(prop, objKey);
			} else { return prop[objKey]; }
		} else { prop[objKey] = value; }
		
		return this;
	};
		
	$.Collection.prototype.active = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "active"));
	};	
	/////////////////////////////////
	//// stack methods (aliases)
	/////////////////////////////////
		
	// generate aliases
	(function (data) {
		var fn = $.Collection.prototype, nm;
		
		data.forEach(function (el) {
			nm = $.toUpperCase(el, 1);
			
			fn["new" + nm] = function (nm) {
				return function (newParam) { return this._new(nm, newParam); };
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
			fn["isActive" + nm] = function (nm) {
				return function (id) { return this._isActive(nm, id); };
			}(el);	
			//
			fn["exists" + nm] = function (nm) {
				return function (id) { return this._exists(nm, id || ""); };
			}(el);
			//
			fn["get" + nm + "ActiveID"] = function (nm) {
				return function (id) { return this._getActiveID(nm); };
			}(el);
			//
			fn["get" + nm] = function (nm) {
				return function (id) { return this._get(nm, id || ""); };
			}(el);
		});
	})($.Collection.prototype.stack);	
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
	$.Collection.prototype._setOne = function (context, value, id) {
		context = $.isExists(context) ? context.toString() : "";
		value = value === undefined ? "" : value;
		id = id || "";
		//
		var activeContext = this._getActiveParam("context");
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
	$.Collection.prototype._getOne = function (context, id) {
		context = $.isExists(context) ? context.toString() : "";
		//
		return nimble.byLink(this._get("collection", id || ""), this._getActiveParam("context") + nimble.CHILDREN + context);
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
	 * @param {String} [activeID=this.ACTIVE] - collection ID
	 * @param {String} [sourceID] - source ID (if move)
	 * @param {Boolean} [del=false] - if "true", remove source element
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.add = function (cValue, propType, activeID, sourceID, del) {
		cValue = cValue !== undefined ? cValue : "";
		propType = propType || "push";
		activeID = activeID || "";
		del = del || false;
		//
		var cObj, sObj, lCheck;
		//
		cObj = nimble.byLink(this._get("collection", activeID), this._getActiveParam("context"));
		//
		if (typeof cObj === "object") {
			// simple add
			if (!sourceID) {
				// add type
				if ($.isPlainObject(cObj)) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + nimble.METHOD_SEPARATOR + "unshift" : propType;
					lCheck = nimble.addElementToObject(cObj, propType.toString(), cValue);
				} else {
					lCheck = true;
					cObj[propType](cValue);
				}
			
			// move
			} else {
				cValue = $.isExists(cValue) ? cValue.toString() : "";
				sObj = nimble.byLink(this._get("collection", sourceID || ""), cValue);
				
				// add type
				if ($.isPlainObject(cObj)) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + nimble.METHOD_SEPARATOR + "unshift" : propType;
					lCheck = nimble.addElementToObject(cObj, propType.toString(), sObj);
				} else {
					lCheck = true;
					cObj[propType](sObj);
				}
				
				// delete element
				if (del === true) { this.disable("context")._removeOne(cValue, sourceID).enable("context"); }
			}
			
			// rewrites links (if used for an object "unshift")
			if (lCheck !== true) { this._setOne("", lCheck, activeID); }
		} else { throw new Error("unable to set property!"); }
	
		return this;
	};
	
	/**
	 * push new element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj - new element
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.push = function (obj, id) {
		return this.add(obj, "", id || "");
	};
	/**
	 * unshift new element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj - new element
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.unshift = function (obj, id) {
		return this.add(obj, "unshift", id || "");
	};	
	/////////////////////////////////
	//// single methods (remove)
	/////////////////////////////////
		
	/**
	 * delete element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] - link
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._removeOne = function (context, id) {
		context = $.isExists(context) ? context.toString() : "";
		var activeContext = this._getActiveParam("context");
		
		if (!context && !activeContext) {
			this._setOne("", null);
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
	$.Collection.prototype._remove = function (objContext, id) {
		id = id || "";
		var key, i;
		//
		if ($.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if ($.isArray(objContext[key])) {
						for (i = objContext[key].length; (i -= 1) > -1;) {
							this._removeOne(objContext[key][i], key);
						}
					} else { this._removeOne(objContext[key], key); }
				}
			}
		} else if ($.isArray(objContext)) {
			for (i = objContext.length; (i -= 1) > -1;) { this._removeOne(objContext[i], id); }
		} else { this._removeOne(objContext, id); }
	
		return this;
	};
	
	/**
	 * pop element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.pop = function (id) { return this._removeOne("eq(-1)", id || ""); };
	/**
	 * shift element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.shift = function (id) { return this._removeOne("eq(0)", id || ""); };	
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
	$.Collection.prototype.concat = function (obj, context, id) {
		context = $.isExists(context) ? context.toString() : "";
		id = id || "";
		//
		var cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context") + nimble.CHILDREN + context);	
		//
		if (typeof cObj === "object") {
			if ($.isPlainObject(cObj)) {
				$.extend(true, cObj, obj)
			} else if ($.isArray(cObj)) {
				if ($.isArray(obj)) {
					cObj = Array.prototype.concat(cObj, obj);
					this._setOne(context, cObj, id);
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
	 * @param {Filter|String|Boolean|Collection} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {String|Collection} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.prototype.length = function (filter, id) {
		filter = filter || "";
		//
		var
			tmpObj = {},
			cObj, aCheck, key, cOLength;
		//
		if (!$.isFunction(filter)) {
			if (($.isString(filter) && !this._filterTest(filter) && !$.isExists(id)) || $.isArray(filter) || $.isPlainObject(filter)) {
				id = filter;
				filter = false;
			}
		}
		//
		if (!id || id === this.ACTIVE) {
			cObj = this._get("collection");
		} else if ($.isString(id)) {
			cObj = this._get("collection", id);
		} else {
			aCheck = true;
			cObj = id;
		}
		// if cObj is null
		if (cObj === null) { return 0; }
		// if cObj is collection
		if (aCheck !== true) { cObj = nimble.byLink(cObj, this._getActiveParam("context")); }
		
		// if cObj is String
		if ($.isString(cObj)) { return cObj.length; }
		
		// throw error
		if (typeof cObj !== "object") { throw new Error("incorrect data type!"); }
		//
		if (filter === false && cObj.length !== undefined) {
			cOLength = cObj.length;
		} else {
			cOLength = 0;
			if (cObj.length !== undefined) {
				cObj.forEach(function (el, i, obj) {
					if (this._customFilter(filter, el, i, cObj, cOLength || null, this, id ? id : this.ACTIVE, tmpObj) === true) {
						cOLength += 1;
					}
				}, this);
			} else {
				for (key in cObj) {
					if (!cObj.hasOwnProperty(key)) { continue; }
					//
					if (this._customFilter(filter, cObj[key], key, cObj, cOLength || null, this, id ? id : this.ACTIVE, tmpObj) === true) {
						cOLength += 1;
					}
				}
			}
		}
		//
		tmpObj.name && this._drop("filter", "__tmp:" + tmpObj.name);
		
		return cOLength;
	};
	/**
	 * forEach method (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - callback function
	 * @param {Filter} [filter=this.ACTIVE] - filter function or string expressions
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: 0)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: 0)
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.forEach = function (callback, filter, id, mult, count, from, indexOf) {
		callback = $.isFunction(callback) ? {filter: callback} : callback;
		filter = filter || "";
		id = $.isExists(id) ? id : this.ACTIVE;
		
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
			tmpObj = {},
		
			cObj, cOLength,
			cloneObj,
	
			i, j = 0, res = false, tmpRes;
		
		//
		cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		if (typeof cObj !== "object") { throw new Error("incorrect data type!"); }
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
					
				if (this._customFilter(filter, el, i, cObj, cOLength, this, id, tmpObj) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {
						if (callback.filter) { res = callback.filter.call(callback.filter, el, i, cObj, cOLength, this, id) === false; }
						if (mult === false) { res = true; }
						j += 1;
					}
				} else {
					if (callback.denial && (from === false || from === 0)) {
						tmpRes = callback.denial.call(callback.denial, el, i, cObj, cOLength, this, id);
						if (res === false && tmpRes === false) { res = true; }
					}
				}
				//
				if (callback.full && (from === false || from === 0)) {
					tmpRes = callback.full.call(callback.full, el, i, cObj, cOLength, this, id);
					if (res === false && tmpRes === false) { res = true; }
				}
				//
				if (res === true) { return true; }
				tmpRes = "";
			}, this);
		} else {
			for (i in cObj) {
				if (!cObj.hasOwnProperty(i)) { continue; }
				//	
				if (count !== false && j === count) { break; }
				if (indexOf !== false && indexOf !== 0) { indexOf -= 1; continue; }
				//
				if (this._customFilter(filter, cObj[i], i, cObj, cOLength, this, id, tmpObj) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {	
						if (callback.filter) { res = callback.filter.call(callback.filter, cObj[i], i, cObj, cOLength, this, id) === false; }
						if (mult === false) { res = true; }
						j += 1;
					}
				} else {
					if (callback.denial && (from === false || from === 0)) {
						tmpRes = callback.denial.call(callback.denial, cObj[i], i, cObj, cOLength, this, id);
						if (res === false && tmpRes === false) { res = true; }
					}
				}
				//
				if (callback.full && (from === false || from === 0)) {
					tmpRes = callback.full.call(callback.full, cObj[i], i, cObj, cOLength, this, id);
					if (res === false && tmpRes === false) { res = true; }
				}
				//
				if (res === true) { break; }
				tmpRes = "";
			}
		}
		//
		tmpObj.name && this._drop("filter", "__tmp:" + tmpObj.name);
		
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
	 * @param {Filter} [filter=this.ACTIVE] - filter function or string expressions
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Number|Array}
	 */
	$.Collection.prototype.search = function (filter, id, mult, count, from, indexOf) {
		filter = filter || "";
		id = $.isExists(id) ? id : this.ACTIVE;
	
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
		//
		var
			result = mult === true ? [] : -1,
			action = function (el, i, data, aLength, self, id) {
				if (mult === true) {
					result.push(i);
				} else { result = i; }
				
				return true;
			};
	
		this.forEach(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * search element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter} [filter=this.ACTIVE] - filter function or string expressions
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|Array}
	 */
	$.Collection.prototype.searchOne = function (filter, id) {
		return this.search($.isExists(filter) ? filter : "", id || "", false);
	};
	
	/**
	 * indexOf (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement - element to locate in the array
	 * @param {fromIndex} [fromIndex=0] - the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|String}
	 */
	$.Collection.prototype.indexOf = function (searchElement, fromIndex, id) {
		id = id || "";
		fromIndex = fromIndex || "";
		//
		var cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		//
		if ($.isArray(cObj) && cObj.indexOf) {
			if (fromIndex) { return cObj.indexOf(searchElement, fromIndex); }
			//
			return cObj.indexOf(searchElement);
		} else { return this.search(function (el) { return el === searchElement; }, id, false, "", "", fromIndex); }
	}
	/**
	 * lastIndexOf (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement - element to locate in the array
	 * @param {fromIndex} [fromIndex=0] - the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|String}
	 */
	$.Collection.prototype.lastIndexOf = function (searchElement, fromIndex, id) {
		id = id || "";
		fromIndex = fromIndex || "";
		//
		var el, cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		//
		if ($.isArray(cObj) && cObj.lastIndexOf) {
			if (fromIndex) { return cObj.lastIndexOf(searchElement, fromIndex); }
			//
			return cObj.lastIndexOf(searchElement);
		} else {
			el = this.search(function (el) { return el === searchElement; }, id, "", "", "", fromIndex);
			//
			return el[el.length - 1] !== undefined ? el[el.length - 1] : -1;
		}
	}	
	/////////////////////////////////
	//// mult methods (get)
	/////////////////////////////////
	
	/**
	 * get elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Context|Null} [filter=this.ACTIVE] - filter function, string expressions or "false" or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {mixed}
	 */
	$.Collection.prototype.get = function (filter, id, mult, count, from, indexOf) {
		if ($.isNumeric(filter) || (arguments.length < 2 && $.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 2 && filter === null)) {
				return this._getOne(filter, id || "");
			}
		//
		filter = filter = filter || "";
		id = $.isExists(id) ? id : this.ACTIVE;
	
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
		//
		var
			result = mult === true ? [] : -1,
			action = function (el, i, data, aLength, self, id) {
				if (mult === true) {
					result.push(data[i]);
				} else { result = data[i]; }
	
				return true;
			};
		//
		this.forEach(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * get element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] - filter function, string expressions or "false" or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {mixed}
	 */
	$.Collection.prototype.getOne = function (filter, id) {
		return this.get($.isExists(filter) ? filter : "", id || "", false);
	};
	/////////////////////////////////
	//// mult methods (set)
	/////////////////////////////////
	
	/**
	 * set elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 *  
	 * @this {Colletion Object}
	 * @param {Filter|Context|Null} [filter=this.ACTIVE] - filter function, string expressions or "false" or context (overload)
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.set = function (filter, replaceObj, id, mult, count, from, indexOf) {
		if ($.isNumeric(filter) || (arguments.length < 3 && $.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 3 && filter === null)) {
				return this._setOne(filter, replaceObj, id || "");
			}
		//
		var
			arg, replaceCheck = $.isFunction(replaceObj),
			action = function (el, i, data, aLength, self, id) {
				if (replaceCheck) {
					data[i] = replaceObj.call(replaceObj, el, i, data, aLength, self, id);
				} else { data[i] = nimble.expr(replaceObj, data[i]); }
	
				return true;
			};
		//
		arg = $.unshiftArguments(arguments, action);
		arg.splice(2, 1);
		return this.forEach.apply(this, arg);
	};
	/**
	 * replace element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter} [filter=this.ACTIVE] - filter function or string expressions
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.setOne = function (filter, replaceObj, id) {
		return this.set($.isExists(filter) ? filter : "", replaceObj, id || "", false);
	};
	
	/**
	 * map (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.map = function (replaceObj, id) {
		return this.set(true, replaceObj, id || "");
	};
	
	/**
	 * some (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - callback function
	 * @param {Filter} [filter=this.ACTIVE] - filter function or string expressions
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.some = function (callback, filter, id) {
		return this.forEach(callback, filter || "", id || "", false);
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
	$.Collection.prototype.move = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, deleteType) {
		moveFilter = moveFilter || "";
		deleteType = deleteType === false ? false : true;
		context = $.isExists(context) ? context.toString() : "";
		//
		sourceID = sourceID || "";
		activeID = activeID || "";
		//
		addType = addType || "push";
		//
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		//
		var
			deleteList = [],
			aCheckType = $.isArray(nimble.byLink(this._get("collection", activeID), this._getActiveParam("context"))),
	
			elements;
	
		// search elements
		this.disable("context");
		elements = this.search(moveFilter, sourceID, mult, count, from, indexOf);
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
		if (deleteType === true) { this.disable("context")._remove(deleteList, sourceID).enable("context"); }
	
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
	$.Collection.prototype.moveOne = function (moveFilter, context, sourceID, activeID, addType) {
		return this.move($.isExists(moveFilter) ? moveFilter : "", $.isExists(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false);
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
	$.Collection.prototype.copy = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf) {
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		return this.move($.isExists(moveFilter) ? moveFilter : "", $.isExists(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "push", mult, count, from, indexOf, false);
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
	$.Collection.prototype.copyOne = function (moveFilter, context, sourceID, activeID, addType) {
		return this.move($.isExists(moveFilter) ? moveFilter : "", $.isExists(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false, "", "", "", false);
	};	
	/////////////////////////////////
	//// mult methods (remove)
	/////////////////////////////////
	
	/**
	 * delete elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Context|Array|Null} [filter=this.ACTIVE] - filter function, string expressions or "false" or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of deletions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.remove = function (filter, id, mult, count, from, indexOf) {
		if ($.isNumeric(filter) || (arguments.length < 2 && $.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 2 && filter === null)) {
				return this._removeOne(filter, id || "");
			} else if ($.isArray(filter) || $.isPlainObject(filter)) { return this._remove(filter, id || ""); }
		//
		var elements = this.search.apply(this, arguments), i;
		if (!$.isArray(elements)) {
			this._removeOne(elements, id);
		} else { for (i = elements.length; (i -= 1) > -1;) { this._removeOne(elements[i], id); } }
	
		return this;
	};
	/**
	 * delete element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] - filter function, string expressions or "false" or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.removeOne = function (filter, id) {
		return this.remove($.isExists(filter) ? filter : "", id || "", false);
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
	 * @param {Function|Boolean} [fn=toUpperCase] - callback function ("false" if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.sort = function (field, rev, fn, id) {
		field = field || null;
		rev = rev || false;
		fn = fn && fn !== true ? fn === false ? null : fn : function (a) {
			if (isNaN(a)) { return a.toUpperCase(); }
			
			return a;
		};
		id = id || "";
		//
		var
			self = this,
			cObj,
			
			// sort function
			sort = function (a, b) {
				var r = rev ? -1 : 1;
				
				// sort by field
				if (field) {
					a = nimble.byLink(a, field);
					b = nimble.byLink(b, field);
				}
				// callback function
				if (fn) {
					a = fn(a);
					b = fn(b);
				}
				
				//
				if (rev !== self.SHUFFLE) {	
					if (a < b) { return r * -1; }
					if (a > b) { return r; }
					
					return 0;
				} else { return Math.floor(Math.random() * 2  - 1); }
			},
			
			// sort object by key
			sortObjectByKey = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					key;
				//
				for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
				sortedKeys.sort(sort);
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
				field = field === true ? "value" : "value" + nimble.CHILDREN + field;
				sortedValues.sort(sort);
				//
				for (key in sortedValues) {
					if (sortedValues.hasOwnProperty(key)) { sortedObj[sortedValues[key].key] = sortedValues[key].value; }
				}
	
				return sortedObj;
			};
		//
		cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		if (typeof cObj === "object") {
			if ($.isArray(cObj)) {
				cObj.sort(sort);
			} else {
				if (field) {
					cObj = sortObject(cObj);
				} else { cObj = sortObjectByKey(cObj); }
				//
				this._setOne("", cObj, id);
			}
		} else { throw new Error("incorrect data type!"); }
		
		return this;
	};	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * reverse collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.reverse = function (id) {
		id = id || "";
		//
		var
			cObj,
			reverseObject = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					key;
				//
				for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
				sortedKeys.reverse();
				//
				for (key in sortedKeys) {
					if (sortedKeys.hasOwnProperty(key)) { sortedObj[sortedKeys[key]] = obj[sortedKeys[key]]; }
				}
	
				return sortedObj;
			};
		//
		cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		if (typeof cObj === "object") {
			if ($.isArray(cObj)) {
				cObj.reverse();
			} else { this._setOne("", reverseObject(cObj), id); }
		} else { throw new Error("incorrect data type!"); }
		
		return this;
	};	
	/////////////////////////////////
	//// local storage
	/////////////////////////////////
	
	/**
	 * save collection in DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.save = function (id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		id = id || this.ACTIVE;
		namespace = namespace || "";
		//
		var
			name = "__" + this.name + "__" + this._get("namespace", namespace),
			//
			active = id === this.ACTIVE ? this._exists("collection") ? this._getActiveID("collection") : "" : this._isActive("collection", id) ? "active" : "",
			storage = local === false ? sessionStorage : localStorage;
		//
		storage.setItem(name + ":" + id, this.toString(id));
		storage.setItem(name + "__date:" + id, new Date().toString());
		storage.setItem(name + "__active:" + id, active);
		//
		storage.setItem(name + "__date", new Date().toString());
		
		return this;
	};
	/**
	 * save all collection in DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.saveAll = function (namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		namespace = namespace || "";
		local = local === false ? local : true;
		//
		var
			key,
			tmp = this.dObj.sys.tmpCollection,
			active = false;
		
		// clear storage
		this.dropAll(namespace, local);
		//
		for (key in tmp) {
			this._isActive("Collection", key) && (active = true);
			//
			if (tmp.hasOwnProperty(key)) { this.save(key, namespace, local); }
		}
		active === false && this.save("", namespace, local);
		
		return this;
	};
	
	/**
	 * load collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local=true] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.load = function (id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		id = id || this.ACTIVE;
		namespace = namespace || "";
		//
		var
			name = "__" + this.name + "__" + this._get("namespace", namespace),
			//
			active,
			storage = local === false ? sessionStorage : localStorage;
		//
		if (id === this.ACTIVE) {
			this._new("collection", $.parseJSON(storage.getItem(name + ":" + id)));
		} else { this._push("collection", id, $.parseJSON(storage.getItem(name + ":" + id))); }
		//
		active = storage.getItem(name + "__active:" + id);
		if (active === this.ACTIVE) {
			this._set("collection", id);
		} else if (active) {
			this
				._push("collection", active, this._get("collection"))
				._set("collection", active);
		}
		
		return this;
	};
	/**
	 * load all collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @param {String} [type="load"] - operation type
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.loadAll = function (namespace, local, type) {
		type = type ? "drop" : "load";
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		local = local === false ? local : true;
		namespace = namespace || "";
		//
		var
			name = "__" + this.name + "__" + this._get("namespace", namespace),
			//
			storage = local === false ? sessionStorage : localStorage,
			sLength = storage.length,
			key, id;
		//
		try {
			for (key in storage) {
				if (storage.hasOwnProperty(key)) {
					if ((id = key.split(":"))[0] === name) { this[type](id[1], namespace, local); }
				}
			}
		} catch (e) {
			while ((sLength -= 1) > -1) {
				if ((id = storage[sLength].split(":"))[0] === name) { this[type](id[1], namespace, local); }
			}
		}
		
		return this;
	};
	/**
	 * get the time of the conservation of collections
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Date}
	 */
	$.Collection.prototype.loadDate = function (id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		id = id ? ":" + id : "";
		namespace = namespace || "";
		//
		var storage = local === false ? sessionStorage : localStorage;
		//
		return new Date(storage.getItem("__" + this.name + "__" + this._get("namespace", namespace) + "__date" + id));
	};
	/**
	 * checking the life of the collection
	 * 
	 * @this {Colletion Object}
	 * @param {Number} time - milliseconds
	 * @param {String} [id] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Boolean}
	 */
	$.Collection.prototype.isExpires = function (time, id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		return new Date(new Date() - new Date(this.loadDate(id || "", namespace || "", local || ""))) > time;
	};
	
	/**
	 * remove collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.drop = function (id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		id = id || this.ACTIVE;
		namespace = namespace || "";
		//
		var
			name = "__" + this.name + "__" + this._get("namespace", namespace),
			storage = local === false ? sessionStorage : localStorage;
		//
		storage.removeItem(name + ":" + id);
		storage.removeItem(name + "__date:" + id);
		storage.removeItem(name + "__active:" + id);
		
		return this;
	};
	/**
	 * remove all collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.dropAll = function (namespace, local) {
		namespace = namespace || "";
		(local === false ? sessionStorage : localStorage).removeItem( "__" + this.name + "__" + this._get("namespace", namespace) + "__date");
		//
		return this.loadAll(namespace, local || "", true);
	};	
	/////////////////////////////////
	//// compile (filter)
	/////////////////////////////////
	
	/**
	 * calculate custom filter
	 * 
	 * @this {Colletion Object}
	 * @param {Filter} [filter=this.ACTIVE] - filter function or string expressions
	 * @param {mixed} el - current element
	 * @param {Number|String} i - iteration (key)
	 * @param {Collection} data - link to collection
	 * @param {Number} cOLength - collection length
	 * @param {Collection Object} self - link to collection object
	 * @param {String} id - collection ID
	 * @return {Boolean}
	 */
	$.Collection.prototype._customFilter = function (filter, el, i, data, cOLength, self, id, _tmpFilter) {
		var
			fLength,
			calFilter, tmpFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			i;
		
		//
		if (!filter || ($.isString(filter) && (filter = $.trim(filter)) === this.ACTIVE)) {
			if (!this._getActiveParam("filter") && filter !== this.ACTIVE) { return true; }
			//
			if (this._get("filter")) {
				if ($.isFunction(this._get("filter"))) {
					return this._get("filter").call(this._get("filter"), el, i, data, cOLength, self, id);
				}
				//
				return this._customFilter(this._get("filter"), el, i, data, cOLength, self, id, _tmpFilter);
			}
			
			return true;
		}

		// if filter is function
		if ($.isFunction(filter)) {
			if (!this._getActiveParam("filter") || !_tmpFilter) {
				return filter.call(filter, el, i, data, cOLength, self, id);
			} else {
				if (!_tmpFilter.name) {
					while (this._exists("filter", "__tmp:" + (_tmpFilter.name = $.getRandomInt(0, 10000)))) {
						_tmpFilter.name = $.getRandomInt(0, 10000);
					}
					this._push("filter", "__tmp:" + _tmpFilter.name, filter);
				}
				//
				return this._customFilter(this.ACTIVE + " && " + "__tmp:" + _tmpFilter.name, el, i, data, cOLength, self, id, _tmpFilter);
			}
		}
		
		// if filter is string
		if (!$.isArray(filter)) {
			//
			if (!this._getActiveParam("filter") === false && _tmpFilter) {
				filter = this.ACTIVE + " && (" + filter + ")";
			}
			// if simple filter
			if (filter.search(/\|\||&&|!/) === -1) {
				if ((filter = $.trim(filter)).search(/^(?:\(|)*:/) !== -1) {
					tmpFilter = this._compileFilter(filter);
					return tmpFilter.call(tmpFilter, el, i, data, cOLength, self, id);
				}
				//
				return this._customFilter(this._get("filter", filter), el, i, data, cOLength, self, id, _tmpFilter);
			}
			
			//
			filter = $.trim(
						filter
							.toString()
							.replace(/\s*(\(|\))\s*/g, " $1 ")
							.replace(/\s*(\|\||&&)\s*/g, " $1 ")
							.replace(/(!)\s*/g, "$1")
					).split(" ");
			// remove "dead" elements		
			for (i = filter.length; (i -= 1) > -1;) {
				if (filter[i] === "") { filter.splice(i, 1); }
			}
		}
		
		// calculate deep filter
		calFilter = function (array, iter) {
			var
				i = -1,
				aLength = array.length,
				pos = 0,
				result = [];
			//
			while ((i += 1) < aLength) {
				iter += 1;
				if (array[i] === "(" || array[i] === "!(") { pos += 1; }
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
		for (i = -1; (i += 1) < fLength;) {
			// calculate atoms
			if (filter[i] === "(" || filter[i] === "!(") {
				if (filter[i].substring(0, 1) === "!") {
					inverse = true;
					filter[i] = filter[i].substring(1);
				} else { inverse = false; }
				
				//
				tmpFilter = calFilter(filter.slice((i + 1)), i);
				tmpResult = tmpFilter.result.join(" ");
				i = tmpFilter.iter;
				//
				
				if (tmpResult.search(/^:/) !== -1) {
					if (!this._exists("filter", "__tmp:" + tmpResult)) {
						this._push("filter", "__tmp:" + tmpResult, this._compileFilter(tmpResult));
						tmpFilter.result = this._compileFilter(tmpResult);
					}
					tmpFilter.result = this._get("filter", "__tmp:" + tmpResult);
				}
				//
				tmpResult = this._customFilter(tmpFilter.result, el, i, data, cOLength, self, id);
				
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// calculate outer filter
			} else if (filter[i] !== ")" && filter[i] !== "||" && filter[i] !== "&&") {
				if (filter[i].substring(0, 1) === "!") {
					inverse = true;
					filter[i] = filter[i].substring(1);
				} else { inverse = false; }
				
				//
				if ($.isString(this._get("filter", filter[i]))) {
					tmpResult = this._customFilter(this._get("filter", filter[i]), el, i, data, cOLength, self, id);
				} else {
					tmpResult = this._get("filter", filter[i]).call(this._get("filter", filter[i]), el, i, data, cOLength, self, id);
				}
				//
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// "and" or "or"
			} else if (filter[i] === "||") {
				and = false;
				or = true;
			} else if (filter[i] === "&&") {
				or = false;
				and = true;
			}
		}
		
		return result;
	};
	/**
	 * compile filter
	 * 
	 * @param {String} str - some string
	 * @return {Function}
	 */
	$.Collection.prototype._compileFilter = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split("<:").join('self.getVariable("').split(":>").join('")');
		//
		return new Function("el", "i", "data", "cOLength", "cObj", "id", "var key = i; return " + str.replace(/^\s*:/, "") + ";");
	}	
	/////////////////////////////////
	//// compile (parser)
	/////////////////////////////////
	
	/**
	 * calculate custom parser
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|String|Boolean} parser - parser function or string expressions or "false"
	 * @param {String} str - source string
	 * @return {String}
	 */
	$.Collection.prototype._customParser = function (parser, str) {
		// if parser is disabled
		if (parser === false) { return str; }
		// if parser is function
		if ($.isFunction(parser)) { return parser.call(parser, str, this); }
		
		// if parser is not defined or parser is a string constant
		if (!parser || ($.isString(parser) && $.trim(parser) === this.ACTIVE)) {
			if (this._get("parser")) {
				if ($.isFunction(this._get("parser"))) {
					return this._get("parser").call(this._get("parser"), str, this);
				}
				//
				return this._customParser(this._get("parser"), str);
			}
	
			return str;
		} else {
			if ($.isString(parser)) {
				parser = $.trim(parser);
				// if simple parser
				if (parser.search("&&") === -1) { return this._customParser(this._get("parser", parser), str); }
				parser = parser.split("&&");
			}
			//
			parser.forEach(function (el) {
				el = $.trim(el);
				str = this._get("parser", el).call(this._get("parser", el), str, this);
			}, this);
	
			return str;
		}
	};
	/**
	 * compile parser
	 * 
	 * @param {String} str - some string
	 * @return {Function}
	 */
	$.Collection.prototype._compileParser = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split("<:").join('self.getVariable("').split(":>").join('")');
		//
		return new Function("str", "cObj", "return " + str.replace(/^\s*:/, "") + ";");
	};	
	/////////////////////////////////
	// context methods
	/////////////////////////////////
	
	/**
	 * calculate parent context
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {String}
	 */
	$.Collection.prototype.parentContext = function (n, id) {
		var
			context = this._get("context", id || "").split(nimble.CHILDREN),
			i = n || 1;
		//
		while ((i -= 1) > -1) { context.splice(-1, 1); }
		//
		return context.join(nimble.CHILDREN);
	};
	/**
	 * parent
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.parent = function (n, id) {
		if (!id) { return this._update("context", this.parentContext.apply(this, arguments)); }
		return this._push("context", id, this.parentContext.apply(this, arguments));
	};	
	/////////////////////////////////
	// additional methods
	/////////////////////////////////
	
	/**
	 * return active property
	 * 
	 * @this {Collection Object}
	 * @param {String} name - property name
	 * @return {mixed}
	 */
	$.Collection.prototype._getActiveParam = function (name) {
		var param = this.dObj.sys.flags.use[name] === undefined || this.dObj.sys.flags.use[name] === true? this.dObj.active[name] : false;
		
		if (name === "context") { return param ? param.toString() : ""; }
		return param;
	};
		
	/**
	 * filter test
	 * 
	 * @this {Collection Object}
	 * @param {String} str - some string
	 * @return {Boolean}
	 */
	$.Collection.prototype._filterTest = function (str) {
		return str === this.ACTIVE || this._exists("filter", str) || str.search(/&&|\|\||:/) !== -1;
	};
		
	/**
	 * enable property
	 * 
	 * @this {Collection Object}
	 * @param {String} name - property name
	 * @return {Collection Object}
	 */
	$.Collection.prototype.enable = function (name) {
		this.dObj.sys.flags.use[name] = true;
		
		return this;
	};
	/**
	 * disable property
	 * 
	 * @this {Collection Object}
	 * @param {String} name - property name
	 * @return {Collection Object}
	 */
	$.Collection.prototype.disable = function (name) {
		this.dObj.sys.flags.use[name] = false;
		
		return this;
	};
	/**
	 * toggle property
	 * 
	 * @this {Collection Object}
	 * @param {String} name - property name
	 * @return {Collection Object}
	 */
	$.Collection.prototype.toggle = function (name) {
		if (this.dObj.sys.flags.use[name] === true) { return this.disable(name); }
		
		return this.enable(name);
	};
	
	// native
	
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Collection} [objID=this.ACTIVE] - collection ID or collection
	 * @param {Function|Array} [replacer] - an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space] - indentation of nested structures
	 * @return {String}
	 */
	$.Collection.prototype.toString = function (objID, replacer, space) {
		if (!JSON || !JSON.stringify) { throw new Error("object JSON is not defined!"); }
		//
		replacer = replacer || "";
		space = space || "";
		//
		if (objID && ($.isArray(objID) || $.isPlainObject(objID))) { return JSON.stringify(objID, replacer, space); }
		//
		return JSON.stringify(nimble.byLink(this._get("collection", objID || ""), this._getActiveParam("context")), replacer, space);
	};
	/**
	 * return collection length (only active)
	 * 
	 * @this {Colletion Object}
	 * @return {Number}
	 */
	$.Collection.prototype.valueOf = function () { return this.length(this.ACTIVE); };	
	/////////////////////////////////
	// other
	/////////////////////////////////
	
	/**
	 * jQuery "then" method
	 * 
	 * @this {Colletion Object}
	 * @param {Function} done - callback function (if success)
	 * @param {Function} [fail=done] - callback function (if failed)
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.then = function (done, fail) {
		var self = this;
		
		if (arguments.length === 1) {
			$.when(this.active("defer")).always(function () { done.apply(self, arguments); });
		} else {
			$.when(this.active("defer")).then(
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
	 * @param {Collection|String} [param.collection=this.ACTIVE] - collection or collection ID
	 * @param {String} [param.context] - additional context
	 * @param {Number} [param.page=this.ACTIVE] - page number
	 * @param {Template} [param.template=this.ACTIVE] - template
	 * @param {Number|Boolean} [param.numberBreak=this.ACTIVE] - number of entries on 1 page (if "false", returns all records)
	 * @param {Number} [param.pageBreak=this.ACTIVE] - number of displayed pages (navigation, > 2)
	 * @param {jQuery Object|Boolean} [param.target=this.ACTIVE] - element to output the result ("false" - if you print a variable)
	 * @param {String} [param.variable=this.ACTIVE] - variable ID (if param.target === false)
	 * @param {Filter} [param.filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {Parser} [param.parser=this.ACTIVE] - parser function, string expressions or "false"
	 * @param {Boolean} [param.cacheIteration=this.ACTIVE] - if "true", the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.ACTIVE] - selector, on which is the number of records per page
	 * @param {Selector} [param.pager=this.ACTIVE] - selector to pager
	 * @param {String} [param.appendType=this.ACTIVE] - type additions to the DOM
	 * @param {String} [param.resultNull=this.ACTIVE] - text displayed if no results
	 * @param {Boolean} [clear=false] - clear the cache
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.print = function (param, clear) {
		clear = clear || false;
		
		//
		var
			opt = {},
			
			cObj, cOLength,
			start, inc = 0, checkPage, from = null,
			
			result = "", action;
			
		// easy implementation
		if ($.isExists(param) && ($.isString(param) || $.isNumeric(param))) {
			param = {page: param};
		} else if (!$.isExists(param)) { param = {page: this._get("page")}; }
		
		//
		$.extend(true, opt, this.dObj.active, param);
		if (param) { opt.page = nimble.expr(opt.page, this._get("page")); }
		if (opt.page < 1) { opt.page = 1; }
		//
		opt.collection = $.isString(opt.collection) ? this._get("collection", opt.collection) : opt.collection;
		opt.template = $.isString(opt.template) ? this._get("template", opt.template) : opt.template;
		//
		opt.cache = $.isExists(param.cache) ? param.cache : this._getActiveParam("cache");
		//
		if (clear === true) { opt.cache.iteration = false; }
		//
		checkPage = this._get("page") - opt.page;
		this._update("page", opt.page);
		
		// template function 
		action = function (el, i, data, cOLength, self, id) {
			// callback
			opt.callback && opt.callback.apply(this, arguments);
			//
			result += opt.template.call(opt.template, el, i, data, cOLength, self, id);
			inc = i;
				
			return true;
		};
		
		// get collection
		cObj = nimble.byLink(opt.collection, this._getActiveParam("context") + nimble.CHILDREN + ((param && param.context) || ""));
		cOLength = this.length();
		// number of records per page
		opt.numberBreak = !$.isExists(opt.numberBreak) || opt.numberBreak === false ? cOLength : opt.numberBreak;
		
		//
		if ($.isPlainObject(cObj) || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = !opt.pager || opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak;
			//
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.numberBreak, start);
			if (opt.cache.iteration === false) { opt.cache.lastIteration = false; }
		//
		} else if ($.isArray(cObj) && opt.cache.iteration === true) {
			// calculate the starting position
			start = !opt.pager || opt.filter === false ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak : opt.cache.iteration === true ?
							checkPage >= 0 ? opt.cache.firstIteration : opt.cache.lastIteration : i;
						
			// rewind cached step back
			if (checkPage > 0 && (opt.pager === true && opt.filter !== false)) {
				checkPage = opt.numberBreak * checkPage;
				for (; (start -= 1) > -1;) {
					if (this._customFilter(opt.filter, cObj[start], cObj, start, cOLength, this, this.ACTIVE) === true) {
						if (inc === checkPage) {
							break;
						} else { inc += 1; }
					}
				}
				opt.cache.lastIteration = (start += 1);
				from = null;
			} else if (checkPage < 0 && (opt.pager && opt.filter !== false)) { from = Math.abs(checkPage) * opt.numberBreak - opt.numberBreak || null; }
			//
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.numberBreak, from, start);
		}
		
		if (checkPage !== 0 && opt.cache.iteration !== false) {
			// cache
			this._get("cache").firstIteration = opt.cache.lastIteration;
			this._get("cache").lastIteration = inc + 1;
		}
		if (opt.cache.autoIteration === true) { this._get("cache").iteration = true; }
		//
		result = !result ? opt.resultNull : this._customParser(opt.parser, result);
		// append to DOM
		if (opt.target === false) {
			if (!opt.variable) {
				this._new("variable", result);
			} else { this._push("variable", opt.variable, result); }
			
			return this;
		} else { opt.target[opt.appendType](result); }
		//
		
		if (!opt.pager) { return this; }
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
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.easyPage = function (param) {
		var
			self = this,
			//
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
		param.pager.find(".ctm").each(function () {
			if (param.pageBreak <= 2) { throw new Error('parameter "pageBreak" must be more than 2'); }
			//
			var
				$this = $(this),
				data = $this.data("ctm"),
				classes = data.classes;
			//
			if (data.nav) {
				// attach event
				if ((data.nav === "prev" || data.nav === "next") && !$this.data("ctm-delegated")) {
					$this.click(function () {
						var $this = $(this);
						//
						if (!$this.hasClass(data.classes && data.classes.disabled || "disabled")) {
							data.nav === "prev" && (param.page = "-=1");
							data.nav === "next" && (param.page = "+=1");
							//
							db.print(param);
						}
					}).data("ctm-delegated", true);
				}
				//
				if ((data.nav === "prev" && param.page === 1) || (data.nav === "next" && param.finNumber === param.nmbOfEntries)) {
					$this.addClass(classes && classes.disabled || "disabled");
				} else if (data.nav === "prev" || data.nav === "next") { $this.removeClass(classes && classes.disabled || "disabled"); }
				//
				if (data.nav === "pageList") {
					if (nmbOfPages > param.pageBreak) {	
						j = param.pageBreak % 2 !== 0 ? 1 : 0;
						from = (param.pageBreak - j) / 2;
						to = from;
						//
						if (param.page - j < from) {
							from = 0;
						} else {
							from = param.page - from - j;
							if (param.page + to > nmbOfPages) {
								from -= param.page + to - nmbOfPages;
							}
						}
						//
						for (i = from, j = -1; (i += 1) <= nmbOfPages && (j += 1) !== null;) {
							if (j === param.pageBreak && i !== param.page) { break; }
							str += genPage(data, classes || "", i);
						}
					} else { for (i = 0; (i += 1) <= nmbOfPages;) { str += genPage(data, classes || "", i); } }
					//
					$this.html(str);
					// delegate event
					if (!$this.data("ctm-delegated")) {
						$this.on("click", data.tag || "span", function () {
							var $this = $(this);
							//
							if (!$this.hasClass(data.classes && data.classes.active || "active")) {
								param.page = $this.data("page");
								self.print(param);
							}
						}).data("ctm-delegated", true);
					}
				}
			//
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
	$.Collection.prototype.genTable = function (count, tag, empty) {
		count = count || 4;
		tag = tag || "div";
		empty = empty === false ? false : true;
		//
		var
			i = 1, j,
	
			target = this._get("target"),
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