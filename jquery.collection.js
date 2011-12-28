/**
 * $.Collection - Javascript framework for working with collections of data (using jQuery)
 *
 * glossary:
 * 1) Collection - data object the JavaScript (the JS), can be implemented as an array, and as a hash table (you can combine arrays with the hash, for example: [{...},{...},...]);
 * 2) Filter - the special function JS, which are selected from the collection by this or any other condition;
 * 3) Parser - the special function JS, engaged in post-processing of the resulting string selection from the collection of the;
 * 4) Context - a string that specifies a link to a certain context (region) collection, for example, the string "Name approximately 1" indicates the obj.Name[1], where obj is a collection of;
 * 5) Template - the special function JS, which converts the collection in line view, in accordance with these instructions for pasting in the DOM;
 * 6) Template model - the special function JS, which generates the navigation bar to the template.
 *
 * $.Collection consists of:
 * 1) six extensions jQuery object:
 * 1.1) collection - main class;
 * 1.2) tplCompile - function for "compilation" templates from the DOM;
 * 1.3) isString - test of string;
 * 1.4) isBoolean - test of boolean;
 * 1.5) isExist - exist (not null, undefined or empty string);
 * 1.6) unshiftArguments - function for the modification of an object arguments.
 * 2) one extension of the jQuery.prototype: 
 * 2.1) collection - the transformation function of the collection of jQuery in the $.Collection.
 *
 * addition:
 * the code is documented in accordance with the standard jsDoc
 * specific data types:
 * 1) [Colletion Object] is a reduced form of the [Object] and means an instance of $.Collection;
 * 2) [Colletion] is a reduced form of the [Object|Array] and means an collection of data;
 * 3) [Selector] is a reduced form of the [String] , and means the css selector (Sizzle syntax);
 * 4) [Context] is the reduced form of the [String] , and means the context of the collection;
 * 5) [Template] is a reduced form of the [Function] and means function-template;
 * 6) [Template Model] is the reduced form of the [Function] and means function-model;
 * 7) [Filter] is a reduced form of the [Function] and means the function-filter;
 * 8) [Parser] is a reduced form of the [Function] and means function-parser;
 * 9) [Plain Object] is a reduced form of the [Object] and means hash table;
 * 10) [jQuery Object] is a reduced form of the [Object] and means an instance of jQuery;
 * 11) [jQuery Deferred] is the reduced form of the [Object] and means an instance of jQuery.Deferred.
 * --
 * the record type: [active=undefined] means that this parameter is optional , and if not specified explicitly, it is not defined (has no default value)
 * all overloading methods documented in the description of the method, because the syntax of the jsDoc not allow it to do
 * --
 * for comfortable work it is recommended to use the latest stable version of jQuery
 *
 * enjoy!
 * 
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @date: 22.12.2011 20:08:43
 * @version 3.2.5
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
		version: "3.2.5",
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Prototype}
		 * @return {String}
		 */
		collection: function () { return this.name + " " + this.version; },
		
		// framework config object
		config: {
			constants: {
				/**
				 * default "active" constant
				 * 
				 * @field
				 * @type String
				 */
				active: "active",
				
				/**
				 * default separator: context
				 * 
				 * @field
				 * @type String
				 */
				contextSeparator: "~",
				/**
				 * default separator: subcontext
				 * 
				 * @field
				 * @type String
				 */
				subcontextSeparator: "#",
				
				/**
				 * default separator: method
				 * 
				 * @field
				 * @type String
				 */
				methodSeparator: "::",
				
				/**
				 * default separator: event request
				 * 
				 * @field
				 * @type String
				 */
				querySeparator: "/",
				/**
				 * default separator: subevent request
				 * 
				 * @field
				 * @type String
				 */
				subquerySeparator: "{"
			}
		},
		
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
		"templateModel",
		"numberBreak",
		"pageBreak",
		"resultNull"
		],
		
		//////
		
		/**
		 * return active context
		 * 
		 * @this {Collection Object}
		 * @return {String}
		 */
		getActiveContext: function () {
			return this.dObj.sys.flags.use.ac === true ? this.dObj.active.context.toString() : "";
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
			if (this.dObj.sys.flags.use[name] === true) {
				return this.disable(name);
			}
			return this.enable(name);
		}
	};	
	/////////////////////////////////
	//// static methods (object && template mode)
	/////////////////////////////////
	
	// static template models
	$.Collection.templateModels = {};
	
	// static methods for object
	$.Collection.obj = {
		// link to constants
		constants: $.Collection.fn.config.constants,
		
		/**
		 * calculate math expression
		 * 
		 * @param {mixed} nw - new value
		 * @param {mixed} old - old value
		 * @return {mixed}
		 */
		expr: function (nw, old) {
			old = old !== undefined || old !== null ? old : "";
			
			if ($.isString(nw) && nw.search(/^[+-\\*/]{1}=/) !== -1) {
				nw = nw.split("=");
				if (!isNaN(nw[1])) { nw[1] = +nw[1]; }
				// simple math
				switch (nw[0]) {
					case "+" : { nw = old + nw[1]; } break;
					case "-" : { nw = old - nw[1]; } break;
					case "*" : { nw = old * nw[1]; } break;
					case "/" : { nw = old / nw[1]; } break;
				}
			}
			
			return nw;
		},
		
		/**
		* get object by link
		* 
		* @param {Object} obj - some object
		* @param {Context} context - link (sharp (#) char indicates the order)
		* @return {Object}
		*/
		getByLink: function (obj, context) {
			context = context.toString().split(this.constants.contextSeparator);
			
			var
				key, i = -1,
				pos, n,
				
				objLength,
				cLength = context.length - 1;
			
			for (; i++ < cLength;) {
				context[i] = $.trim(context[i]);
				//
				if (context[i] && context[i] !== this.constants.subcontextSeparator) {
					if (context[i].search(this.constants.subcontextSeparator) === -1) {
						obj = obj[context[i]];
					} else {
						pos = +context[i].replace(this.constants.subcontextSeparator, "");
						
						if ($.isArray(obj)) {
							if (pos >= 0) {
								obj = obj[pos];
							} else {
								obj = obj[obj.length + pos];
							}
						} else {
							if (pos < 0) { 
								objLength = 0;
								for (key in obj) {
									if (obj.hasOwnProperty(key)) { objLength++; }
								}
								//
								pos += objLength;
							}
							
							n = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) {
									if (pos === n) {
										obj = obj[key];
										break;
									}
									n++;
								}
							}
						}
					}
				}
			}
			
			return obj;
		},
		/**
		* set new value to object by link
		* 
		* @this {$.Collection.obj}
		* @param {Object} obj - some object
		* @param {Context} context - link (sharp (#) char indicates the order)
		* @param {mixed} value - some value
		* @return {$.Collection.obj}
		*/
		setByLink: function (obj, context, value) {
			context = context.toString().split(this.constants.contextSeparator);
			
			var
				key, i,
				pos, n,
				
				objLength,
				cLength = context.length;
			
			// remove "dead" elements
			for (i = cLength; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === this.constants.subcontextSeparator) { context.splice(i, 1); }
			}
			// recalculate length
			cLength = context.length - 1;
			i = -1;
			
			for (; i++ < cLength;) {
				if (context[i].search(this.constants.subcontextSeparator) === -1) {
					if (i === cLength) {
						obj[context[i]] = this.expr(value, obj[context[i]]);
					} else {
						obj = obj[context[i]];
					}
				} else {
					pos = +context[i].replace(this.constants.subcontextSeparator, "");
						
					if ($.isArray(obj)) {
						if (i === cLength) {
							if (pos >= 0) {
								obj[pos] = this.expr(value, obj[pos]);
							} else {
								obj[obj.length + pos] = value;
							}
						} else {
							if (pos >= 0) {
								obj = obj[pos];
							} else {
								obj = this.expr(value, obj[obj.length + pos]);
							}
						}
					} else {
						if (pos < 0) { 
							objLength = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) { objLength++; }
							}
							//
							pos += objLength;
						}
						
						n = 0;
						for (key in obj) {
							if (obj.hasOwnProperty(key)) {
								if (pos === n) {
									if (i === cLength) {
										obj[key] = this.expr(value, obj[key]);
									} else {
										obj = obj[key];
									}
									break;
								}
								n++;
							}
						}
					}
				}
			}
			
			return this;
		},
		/**
		 * execute event
		 * 
		 * @this {$.Collection.obj}
		 * @param {String} query - query string
		 * @param {Object} event - event request
         * @param {mixed} [param=undefined] - input parameters
         * @param {mixed} [_this=event] - this
		 * @return {$.Collection.obj}
		 */
		execEvent: function (query, event, param, _this) {
            param = $.isExist(param) ? param : [];
            param = $.isArray(param) ? param : [param];
			//
            query = query.split(this.constants.querySeparator);
			//
            var i = -1, qLength = query.length - 2, spliter;
			
			for (; i++ < qLength;) { event = event[query[i]]; }
			//
			if (query[i].search(this.constants.subquerySeparator) !== -1) {
				spliter = query[i].split(this.constants.subquerySeparator);
				event = event[spliter[0]];
				spliter.splice(0, 1);
                param = param.concat(spliter);
				event.apply(_this || event, param);
			} else { event[query[i]].apply(_this || event, param); }
			
			return this;
		},
		/**
		 * add new element to object
		 * 
		 * @param {Plain Object} obj - some object
		 * @param {String} active - property name (can use "::unshift" - the result will be similar to work for an array "unshift")
		 * @param {mixed} value - some value
		 * @return {Plain Object|Boolean}
		 */
		addElementToObject: function (obj, active, value) {
			active = active.split(this.constants.methodSeparator);
			
			var key, newObj = {};
			
			if (active[1] && active[1] == "unshift") {
				newObj[active[0]] = value;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
				obj = newObj;
					
				return obj;
			} else if (!active[1] || active[1] == "push") { obj[active[0]] = value; }
				
			return true;
		}
	};	
	/////////////////////////////////
	//// static methods (sort)
	/////////////////////////////////
	
	$.Collection.sort = {
		/**
		 * sort field name
		 * 
		 * @field
		 * @type String|Null
		 */
		field: null,
		/**
		 * reverce
		 * 
		 * @field
		 * @type Boolean
		 */
		rev: false,
		/**
		 * shuffle
		 * 
		 * @field
		 * @type Boolean
		 */
		shuffle: false,
		/**
		 * sort callback
		 * 
		 * @field
		 * @type Function|Boolean|Null
		 */
		fn: null,
		
		/**
		 * main sort function
		 * 
		 * @param {String} [field=null] - field name
		 * @param {Boolean} [rev=false] - reverce (contstants: "shuffle" - random order)
		 * @param {Function} [fn=null] - callback
		 * @return {Function}
		 */
		sortBy: function (field, rev, fn) {
			this.field = field || null;
			this.rev = rev ? rev !== "shuffle" ? rev : false : false;
			this.shuffle = rev ? rev === "shuffle" ? rev : false : false;
			this.fn = fn || null;
				
			return this.sortHelper;
		},
		/**
		 * sort helper
		 * 
		 * @return {Number}
		 */
		sortHelper: function (a, b) {	
			var
				stat = $.Collection,	
				$this = stat.sort,
				rev = $this.shuffle ? Math.round(Math.random() * 2  - 1) : $this.rev ? $this.rev === true ? -1 : 1 : 1;
			
			if ($this.field) {
				a = stat.obj.getByLink(a, $this.field);
				b = stat.obj.getByLink(b, $this.field);
			}
					
			if ($this.fn) {
				a = $this.fn(a);
				b = $this.fn(b);
			}
			
			if (!$this.shuffle) {	
				if (a < b) { return rev * -1; }
				if (a > b) { return rev; }
				
				return 0;
			} else { return rev; }
		}
	};	
	/////////////////////////////////
	//// jQuery methods (core)
	/////////////////////////////////
		
	/**
	 * jQuery collection
	 * 
	 * @this {jQuery Object}
	 * @param {Object} active - user's preferences
	 * @return {Colletion Object}
	 */
	$.fn.collection = function (active) {
		var
			stat = $.fn.collection.stat,
			text = function (elem) {
				elem = elem.childNodes;
				var
					eLength = elem.length - 1,
					i = -1,
					str = "";
	
				for (; i++ < eLength;) {
					if (elem[i].nodeType === 3 && $.trim(elem[i].textContent)) {
						str += elem[i].textContent;
					}
				}
	
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
	
						i;
	
					array.push({});
	
					for (i in data) {
						if (data.hasOwnProperty(i)) {
							array[n][i] = data[i];
						}
					}
	
					if (cLength) {
						cLength--;
						array[n][stat.classes] = {};
						for (i = -1; i++ < cLength;) {
							array[n][stat.classes][classes[i]] = classes[i];
						}
					}
	
					if ($this.children().length !== 0) {
						array[n][stat.childNodes] = inObj($this.children());
					}
	
					if (txt !== false) { array[n][stat.val] = txt.replace(/[\r\t\n]/g, " "); }
				});
	
				return array;
			},
			data = inObj(this);
	
		if (active) { return new $.Collection(data, active); }
	
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
	$.fn.tplCompile = function () {
		if (this.length === 0) { throw new Error("DOM element isn't exist!"); }
		
		var
			html = this.html(),
			elem = html
                .replace(/\/\*.*?\*\//g, "")
				.split("?>")
				.join("<?js")
				.replace(/[\r\t\n]/g, " ")
				.split("<?js"),
			
			eLength = elem.length - 1,
			resStr = "var key = i, result = ''; ", i = -1;
		
		for (; i++ < eLength;) {
			if (i === 0 || i % 2 === 0) {
				resStr += "result +='" + elem[i] + "';";
			} else { resStr += elem[i].split("echo").join("result +="); }
		}
		
		return new Function("data", "i", "cOLength", "self", "id", resStr + " return result;");
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
	$.isString = function (val) {
		return Object.prototype.toString.call(val) === "[object String]";
	};
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
	$.isExist = function (val) {
		return val !== undefined && val !== "undefined" && val !== null && val !== "";
	};
	/**
	 * unshift for arguments (object)
	 * 
	 * @param {Object} obj - some object
	 * @param {mixed} pushVal - new value
	 * @param {String|Number} [pushName=0] - property name
	 * @return {Array}
	 */
	$.unshiftArguments = function (obj, pushVal) {
		var newObj = [pushVal], i = 0, oLength = obj.length;
		
		for (; i < oLength; i++) { newObj.push(obj[i]); }
		
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
	//// template model (simple)
	/////////////////////////////////
	
	/**
	 * simple model
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @return {Boolean}
	 */
	$.Collection.templateModels.simple = function (param) {		
		var
			dObj = this.dObj,
			vv = dObj.viewVal,
			css = dObj.css;
		
		// next
		if (param.finNumber === param.nmbOfEntries) {
			$("." + css.next, param.pager).addClass(css.disabled);
		} else {
			$("." + css.next + "." + css.disabled, param.pager).removeClass(css.disabled);
		}
		// prev
		if (param.page === 1) {
			$("." + css.prev, param.pager).addClass(css.disabled);
		} else {
			$("." + css.prev + "." + css.disabled, param.pager).removeClass(css.disabled);
		}	
		// info
		if (param.nmbOfEntriesInPage === 0) {
			$("." + css.info, param.pager).empty();
		} else {
			$("." + css.info, param.pager).text(((param.page - 1) * param.numberBreak + 1) + "-" + param.finNumber + ' ' + vv.from + ' ' + param.nmbOfEntries);
		}
							
		return true;
	};	
	/////////////////////////////////
	//// template model (advansed)
	/////////////////////////////////
	
	/**
	 * advansed model
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @return {Boolean}
	 */
	$.Collection.templateModels.control = function (param) {
		var
			dObj = this.dObj,
			vv = dObj.viewVal,
			css = dObj.css,
			
			nmbOfPages = param.nmbOfEntries % param.numberBreak !== 0 ? ~~(param.nmbOfEntries / param.numberBreak) + 1 : param.nmbOfEntries / param.numberBreak,
			str = "",
			
			i, j = 0, z;
		
		if (nmbOfPages > param.pageBreak) {	
			if (param.page !== 1) {
				str += '<a href="javascript:;" class="' + css.prev + '" data-page="1">' + vv.prev + '</a>';
			} else {
				str += '<a href="javascript:;" class="' + css.prev + ' ' + css.disabled + '" data-page="1">' + vv.prev + '</a>';
			}
			//
			for (i = (param.page - 1); i++ < nmbOfPages;) { j++; }
			if (j < param.pageBreak) { z = param.pageBreak - j + 1; } else { z = 1; }
			//
			for (j = 0, i = (param.page - z); i++ < nmbOfPages; j++) {
				if (j === (param.pageBreak - 1) && i !== param.page) { break; }
				//
				if (i === param.page) {
					if (j === 0 && param.page !== 1) {
						str += '<a href="javascript:;" data-page="' + (i - 1) + '">' + (i - 1) + '</a>';
					} else { j--; }
					
					str += '<a href="javascript:;" class="' + css.active + '" data-page="' + i + '">' + i + '</a>';
				} else { str += '<a href="javascript:;" data-page="' + i + '">' + i + '</a>'; }
			}
			if (i !== (nmbOfPages + 1)) {
				str += '<a href="javascript:;" data-page="' + nmbOfPages + '">' + vv.next + '</a>';
			} else { str += '<a href="javascript:;" class="' + css.next + ' ' + css.disabled + '" data-page="' + nmbOfPages + '">' + vv.next + '</a>'; }
		} else {
			for (i = 0; i++ < nmbOfPages;) {
				if (i === param.page) {
					str += '<a href="javascript:;" class="' + css.active + '" data-page="' + i + '">' + i + '</a>';
				} else {
					str += '<a href="javascript:;" data-page="' + i + '">' + i + '</a>';
				}
			}
		}
		// show results
		if (param.nmbOfEntries === 0) {
			$("." + css.nav + "," + "." + css.info, param.pager).empty();
		} else {
			$("." + css.nav, param.pager).html(str);
			$("." + css.info, param.pager).text(vv.total + ": " + param.nmbOfEntries + ". " + vv.show + ": " + ((param.page - 1) * param.numberBreak + 1) + "-" + param.finNumber);
		}
							
		return true;
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
				 * active page (used in "extPrint")
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
				 * active selector (used to calculate the number of records one page)
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
				 * active template mode
				 * 
				 * @field
				 * @type Function
				 */
				templateModel: $.Collection.templateModels.simple,
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
				 * active empty result ("false" if disabled)
				 * 
				 * @field
				 * @type String|Boolean
				 */
				resultNull: false
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
				ac: true
			}
		}
	};
	// generate system fields
	(function (data) {
		var
			i,
			upperCase,
			sys = $.Collection.storage.dObj.sys;
	
		for (i = data.length; i--;) {
			upperCase = $.toUpperCase(data[i], 1);
			
			sys["active" + upperCase + "ID"] = null;
			sys["tmp" + upperCase] = {};
			sys[data[i] + "ChangeControl"] = null;
			sys[data[i] + "Back"] = [];
		}
	})($.Collection.fn.stack);	
	/////////////////////////////////
	//// public fields (view value)
	/////////////////////////////////
	
	$.Collection.storage.dObj.viewVal = {
		prev: "&lt;&lt;",
		next: "&gt;&gt;",
		total: "total",
		show: "show",
		from: "from",
		noResult: "nothing was found"
	};	
	/////////////////////////////////
	//// public fields (css)
	/////////////////////////////////
	
	$.Collection.storage.dObj.css = {
		prev: "prev",
		next: "next",
		disabled: "disabled",
		active: "active",
		nav: "nav",
		info: "info",
		noResult: "noResult"
	};	
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

		active[propName] = $.Collection.obj.expr(newProp, active[propName] || "");
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
		
		active[propName] = $.Collection.obj.expr(newProp, active[propName] || "");
		if (activeID) { sys["tmp" + upperCase][activeID] = active[propName]; }

		return this;
	};
	/**
	 * return property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.config.constants.active] - stack ID
	 * @return {mixed}
	 */
	$.Collection.fn._get = function (propName, id) {
		var dObj = this.dObj;
		
		if (id && id !== this.config.constants.active) {
			return dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		}

		return dObj.active[propName];
	};
	
	/**
	 * add new value to stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Plain Object} objID - stack ID or object (ID: value)
	 * @param {mixed} [newProp=undefined] - value (overload)
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
					if (key === this.config.constants.active) {
						throw new Error("invalid property name!");
					} else {
						if (tmp[key] && activeID && activeID === key) {
							this._update(propName, objID[key]);
						} else { tmp[key] = objID[key]; }
						
					}
				}
			}
		} else {
			if (objID === this.config.constants.active) {
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
	 * @return {Colletion Object}
	 */
	$.Collection.fn._drop = function (propName, objID, deleteVal) {
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

		if (tmpArray[0] && tmpArray[0] !== this.config.constants.active) {
			for (key in tmpArray) {
				if (tmpArray.hasOwnProperty(key)) {
					if (!tmpArray[key] || tmpArray[key] === this.config.constants.active) {
						if (activeID) { delete sys[tmpTmpStr][activeID]; }
						sys[tmpActiveIDStr] = null;
						active[propName] = deleteVal;
					} else {
						delete sys[tmpTmpStr][tmpArray[key]];
						if (activeID && tmpArray[key] === activeID) {
							sys[tmpActiveIDStr] = null;
							active[propName] = deleteVal;
						}
					}
				}
			}
		} else {
			if (activeID) { delete sys[tmpTmpStr][activeID]; }
			sys[tmpActiveIDStr] = null;
			active[propName] = deleteVal;
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

		if (tmpArray[0] && tmpArray[0] !== this.config.constants.active) {
			for (key in tmpArray) {
				if (tmpArray.hasOwnProperty(key)) {
					if (!tmpArray[key] || tmpArray[key] === this.config.constants.active) {
						if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
						active[propName] = resetVal;
					} else {
						sys[tmpTmpStr][tmpArray[key]] = resetVal;
						if (activeID && tmpArray[key] === activeID) { active[propName] = resetVal; }
					}
				}
			}
		} else {
			if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
			active[propName] = resetVal;
		}

		return this;
	};
	/**
	 * reset property to another value
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array} [objID=active] - stack ID or array of IDs
	 * @param {String} [id=this.config.constants.active] - source ID (for merge)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._resetTo = function (propName, objID, id) {
		var
			dObj = this.dObj,
			mergeVal = !id || id === this.config.constants.active ? dObj.active[propName] : dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		
		return this._reset(propName, objID || "", mergeVal);
	};

	/**
	 * check the existence of property in the stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.config.constants.active] - stack ID
	 * @return {Boolean}
	 */
	$.Collection.fn._exist = function (propName, id) {
		var 
			dObj = this.dObj,
			upperCase = $.toUpperCase(propName, 1);
		
		if ((!id || id === this.config.constants.active) && dObj.sys["active" + upperCase + "ID"]) {
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
		for (var i = this.stack.length; i--;) { if (this._exist(this.stack[i], id)) { this._set(this.stack[i], id); } }
				
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
	 * @param {mixed} [value=undefined] - value (overload)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._prop = function (propName, objKey, value) {
		var active = this.dObj[propName];
			
		if (arguments.length !== 3) {
			if ($.isPlainObject(objKey)) {
				$.extend(active, objKey);
			} else { return active[objKey]; }
		} else { active[objKey] = value; }
			
		return this;
	};
		
	$.Collection.fn.active = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "active"));
	};
	$.Collection.fn.css = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "css"));
	};
	$.Collection.fn.viewVal = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "viewVal"));
	};	
	/////////////////////////////////
	//// stack methods (aliases)
	/////////////////////////////////
		
	// generate aliases
	(function (data) {
		var
			i, fn = $.Collection.fn,
			nm;
	
		for (i = data.length; i--;) {
			nm = data[i] !== "collection" ? $.toUpperCase(data[i], 1) : "";
			
			fn["$" + nm] = function (nm) {
				return function (newParam) { return this._$(nm, newParam); };
			}(data[i]);
			//
			fn["update" + nm] = function (nm) {
				return function (newParam) { return this._update(nm, newParam); };
			}(data[i]);
			//
			fn["reset" + nm + "To"] = function (nm) {
				return function (objID, id) { return this._resetTo(nm, objID, id); };
			}(data[i]);	
			//
			fn["push" + nm] = function (nm) {
				return function (objID, newParam) { return this._push.apply(this, $.unshiftArguments(arguments, nm)); }
			}(data[i]);
			//
			fn["set" + nm] = function (nm) {
				return function (id) { return this._set(nm, id); };
			}(data[i]);
			//
			fn["pushSet" + nm] = function (nm) {
				return function (id, newParam) { return this._push(nm, id, newParam)._set(nm, id); };
			}(data[i]);
			//
			fn["back" + nm] = function (nm) {
				return function (nmb) { return this._back(nm, nmb || ""); };
			}(data[i]);	
			//
			fn["back" + nm + "If"] = function (nm) {
				return function (nmb) { return this._backIf(nm, nmb || ""); };
			}(data[i]);	
			//
			if (data[i] === "filter" || data[i] === "parser") {
				fn["drop" + nm] = function (nm) {
					return function () { return this._drop(nm, arguments); };
				}(data[i]);	
			} else {
				fn["drop" + nm] = function (nm) {
					return function () { return this._drop(nm, arguments, null); };
				}(data[i]);	
			}
			//
			if (data[i] === "filter" || data[i] === "parser") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments); };
				}(data[i]);	
			} else if (data[i] === "page") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, 1); };
				}(data[i]);	
			} else if (data[i] === "context") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, ""); };
				}(data[i]);	
			}
			//
			fn["is" + nm] = function (nm) {
				return function (id) { return this._is(nm, id); };
			}(data[i]);	
			//
			fn["exist" + nm] = function (nm) {
				return function (id) { return this._exist(nm, id || ""); };
			}(data[i]);
			//
			fn["get" + nm] = function (nm) {
				return function (id) { return this._get(nm, id || ""); };
			}(data[i]);
		}
	})($.Collection.fn.stack);	
	/////////////////////////////////
	//// single methods (core)
	/////////////////////////////////
	
	/**
	 * set new value to element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {mixed} value - new value
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.setElement = function (context, value, id) {
		context = $.isExist(context) ? context.toString() : "";
		value = value === undefined ? "" : value;
	
		var
			constants = this.config.constants,
		
			dObj = this.dObj,	
			activeContext = this.getActiveContext();
		
		if (!context && !activeContext) {
			if (id && id !== constants.active) {
				return this._push("collection", id, value);
			} else {
				return this._update("collection", value);
			}
		}
		
		$.Collection.obj.setByLink(id && id !== constants.active ? dObj.sys.tmpCollection[id] : dObj.active.collection, activeContext + constants.contextSeparator + context, value);
	
		return this;
	};
	/**
	 * get element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {mixed}
	 */
	$.Collection.fn.getElement = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			constants = this.config.constants,
			dObj = this.dObj;
		
		return $.Collection.obj.getByLink(id && id !== constants.active ? dObj.sys.tmpCollection[id] : dObj.active.collection, this.getActiveContext() + constants.contextSeparator + context);
	};	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to object (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} cValue - new element или context for sourceID (sharp (#) char indicates the order)
	 * @param {String} [propType="push"] - add type (constants: "push", "unshift") or property name (can use "::unshift" - the result will be similar to work for an array "unshift")
	 * @param {String} [activeID=this.dObj.active.collectionID] - collection ID
	 * @param {String} [sourceID=undefined] - source ID (if move)
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.addElement = function (cValue, propType, activeID, sourceID, deleteType) {
		cValue = cValue !== undefined ? cValue : "";
		propType = propType || "push";
		deleteType = deleteType === true ? true : false;
	
		var
			constants = this.config.constants,
			statObj = $.Collection.obj,
		
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
	
			cObj, sObj,
	
			collectionID = sys.collectionID,
	
			oCheck, lCheck;
		
		cObj = statObj.getByLink(activeID && activeID !== constants.active ? sys.tmpCollection[activeID] : active.collection, this.getActiveContext());
		
		if (typeof cObj === "object") {
			oCheck = $.isPlainObject(cObj);
	
			// simple add
			if (!sourceID) {
				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + constants.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), cValue);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(cValue);
					} else if (propType === "unshift") {
						cObj.unshift(cValue);
					}
				}
			// move
			} else {
				cValue = $.isExist(cValue) ? cValue.toString() : "";
				sObj = statObj.getByLink(sourceID === constants.active ? active.collection : sys.tmpCollection[sourceID], cValue);

				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + constants.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), sObj);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(sObj);
					} else if (propType === "unshift") {
						cObj.unshift(sObj);
					}
				}
				
				// delete element
				if (deleteType === true) {
					this.config.flags.use.ac = false;
					this.deleteElementByLink(cValue, sourceID);
					this.config.flags.use.ac = true;
				}
			}
	
			// rewrites links (if used for an object "unshift")
			if (lCheck !== true) { this.setElement("", lCheck, activeID || ""); }
		} else { throw new Error("unable to set property!"); }
	
		return this;
	};	
	/////////////////////////////////
	//// single methods (delete)
	/////////////////////////////////
		
	/**
	 * delete element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - link (sharp (#) char indicates the order)
	 * @param {String} [id=constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementByLink = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			constants = this.config.constants,
		
			dObj = this.dObj,
			
			key, i = 0,
			pos, n = 0,
			
			objLength,
			cObj,
			
			activeContext = this.getActiveContext();
		
		if (!context && !activeContext) {
			this.setElement("", null);
		} else {
			// prepare context
			context = (activeContext + constants.contextSeparator + context).split(constants.contextSeparator);
			// remove "dead" elements
			for (i = context.length; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === constants.subcontextSeparator) { context.splice(i, 1); }
			}
			context = context.join(constants.contextSeparator);

			// choice of the parent element to check the type
			cObj = $.Collection.obj.getByLink(id && id !== constants.active ?
						dObj.sys.tmpCollection[id] : dObj.active.collection,
						context.replace(new RegExp("[^" + constants.contextSeparator + "]+$"), ""));
			// choice link
			context = context.replace(new RegExp(".*?([^" + constants.contextSeparator + "]+$)"), "$1");

			if ($.isArray(cObj)) {
				context = +context.replace(constants.subcontextSeparator, "");
				if (context >= 0) {
					cObj.splice(context, 1);
				} else { cObj.splice(cObj.length + context, 1); }
			} else {
				if (context.search(constants.subcontextSeparator) === -1) {
					delete cObj[context];
				} else {
					pos = +context.replace(constants.subcontextSeparator, "");
					if (pos < 0) { 
						objLength = 0;
						// object length
						for (key in cObj) {
							if (cObj.hasOwnProperty(key)) { objLength++; }
						}
						// if reverse
						pos += objLength;
					}

					n = 0;
					for (key in cObj) {
						if (cObj.hasOwnProperty(key)) {
							if (pos === n) {
								delete cObj[key];
								break;
							}
							n++;
						}
					}
				}
			}
		}
	
		return this;
	};
	/**
	 * delete elements by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext - link (sharp (#) char indicates the order), array of links or object (collection ID: array of links)
	 * @param {String} [id=constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementsByLink = function (objContext, id) {
		var key, i;
	
		if ($.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if ($.isArray(objContext[key])) {
						for (i = objContext[key].length; i--;) {
							this.deleteElementByLink(objContext[key][i], key);
						}
					} else { this.deleteElementByLink(objContext[key], key); }
				}
			}
		} else if ($.isArray(objContext)) {
			for (i = objContext.length; i--;) {
				this.deleteElementByLink(objContext[i], id || "");
			}
		} else { this.deleteElementByLink(objContext, id || ""); }
	
		return this;
	};	
	/////////////////////////////////
	//// single methods (concatenation)
	/////////////////////////////////
	
	/**
	 * concatenation of collections (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj - collection
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {String} [id=this.config.constants.active] - collection ID, which is the concatenation
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.concat = function (obj, context, id) {
		context = $.isExist(context) ? context.toString() : "";
	
		var
			constants = this.config.constants,
		
			dObj = this.dObj,
			cObj;
		
		cObj = $.Collection.obj.getByLink(id && id !== constants.active ? dObj.sys.tmpCollection[id] : dObj.active.collection, this.getActiveContext() + constants.contextSeparator + context);	
		
		if (typeof cObj === "object") {
			if ($.isPlainObject(cObj)) {
				$.extend(true, cObj, obj)
			} else if ($.isArray(cObj)) {
				if ($.isArray(obj)) {
					cObj = Array.prototype.concat(cObj, obj);
					this.setElement(context, cObj, id || "");
				} else { this.addElement(obj, "push", id || ""); }
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
	 * @param {String|Collection} [id=this.config.constants.active] - collection ID
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.fn.length = function (filter, id) {
		filter = $.isExist(filter) ? filter : false;
		
		var
			dObj = this.dObj,
			cObj, cOLength, aCheck,
			key, countRecords;
		
		if (!$.isFunction(filter)) {
			if (($.isString(filter) && !$.isExist(id)) || $.isArray(filter) || $.isPlainObject(filter)) {
				id = filter;
				filter = false;
			}
		}
		
		if (!id || id === this.config.constants.active) {
			cObj = dObj.active.collection;
		} else if ($.isString(id)) {
			cObj = dObj.sys.tmpCollection[id];
		} else {
			aCheck = true;
			cObj = id;
		}
		//
		if (aCheck !== true) { cObj = $.Collection.obj.getByLink(cObj, this.getActiveContext()); }
		// if cObj is null
		if (cObj === null) { return 0; }

		cOLength = cObj.length;
		// if cObj is String
		if ($.isString(cObj)) { return cOLength; }
		
		if (typeof cObj === "object") {
			if (filter === false && cOLength !== undefined) {
				countRecords = cOLength;
			} else {
				countRecords = 0;
				for (key in cObj) {
					if (cObj.hasOwnProperty(key)) {
						if (filter === false || this.customFilter(filter, cObj, key, cOLength || null, this, id ? id : this.config.constants.active) === true) {
							countRecords++;
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
	 * @param {Function} callback - callback
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.each = function (callback, filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
	
			cObj, cOLength, tmpLength,
	
			i, j = 0;
		
		//
		cObj = $.Collection.obj.getByLink(id !== this.config.constants.active ? sys.tmpCollection[id] : active.collection, this.getActiveContext());
		cOLength = this.length(cObj);
		
		//
		if ($.isArray(cObj)) {
			tmpLength = cOLength - 1;
			for (i = indexOf !== false ? indexOf - 1 : -1; i++ < tmpLength;) {
				if (count !== false && j === count) { break; }
				if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
					if (from !== false && from !== 0) { from--; continue; }
					
					if (callback.call(callback, cObj, i, cOLength, this, id) === false) { break; }
					if (mult === false) { break; }
					j++;
				}
			}
		} else {
			for (i in cObj) {
				if (cObj.hasOwnProperty(i)) {
					if (count !== false && j === count) { break; }
					if (indexOf !== false && indexOf !== 0) { indexOf--; continue; }
					
					if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
						if (from !== false && from !== 0) { from--; continue; }
							
						if (callback.call(callback, cObj, i, cOLength, this, id) === false) { break; }
						if (mult === false) { break; }
						j++;
					}
				}
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
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Number|Array}
	 */
	$.Collection.fn.searchElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			result = [],
			action = function (data, i, aLength, self, id) {
				if (mult === true) {
					result.push(i);
				} else {
					result = i;
					return false;
				}
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * search element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
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
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {mixed}
	 */
	$.Collection.fn.returnElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			result = [],
			action = function (data, i, aLength, self, id) {
				if (mult === true) {
					result.push(data[i]);
				} else {
					result = data[i];
					return false;
				}
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * return element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
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
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElements = function (filter, replaceObj, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			replaceCheck = $.isFunction(replaceObj),
			action = function (data, i, aLength, self, id) {
				if (replaceCheck) {
					replaceObj.call(replaceObj, data, i, aLength, self, id);
				} else { data[i] = replaceObj; }
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return this;
	};
	/**
	 * replace element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.config.constants.active] - collection ID
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
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of transfers (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, deleteType) {
		moveFilter = moveFilter || false;
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
			constants = this.config.constants,
	
			deleteList = [],
			aCheckType = $.isArray($.Collection.obj.getByLink(this._get("collection", activeID), this.getActiveContext())),
	
			elements, eLength, i = -1;
	
		// search elements
		this.disable("ac");
		elements = this.searchElements(moveFilter, sourceID, mult, count, from, indexOf);
		this.enable("ac");
	
		// move
		if (mult === true) {
			eLength = elements.length - 1;
			for (; i++ < eLength;) {
				this.addElement(context + constants.contextSeparator + elements[i], aCheckType === true ? addType : elements[i] + constants.methodSeparator + addType, activeID, sourceID);
				deleteType === true && deleteList.push(elements[i]);
			}
		} else {
			this.addElement(context + constants.contextSeparator + elements, aCheckType === true ? addType : elements + constants.methodSeparator + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
	
		// delete element
		if (deleteType === true) { this.disable("ac").deleteElementsByLink(deleteList, sourceID).enable("ac"); }
	
		return this;
	},
	/**
	 * move element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
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
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
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
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
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
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of deletions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var elements = this.searchElements(filter, id, mult, count, from, indexOf), i;

		if (mult === false) {
			this.deleteElementByLink(elements, id);
		} else {
			for (i = elements.length; i--;) {
				this.deleteElementByLink(elements[i], id);
			}
		}
	
		return this;
	};
	/**
	 * delete element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
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
	$.Collection.fn.customFilter = function (filter, data, i, cOLength, self, id) {
		var
			tmpFilter,
			constants = this.config.constants,
			
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
			
			fLength,
			calFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			j = -1;
		
		// if filter is function
		if ($.isFunction(filter)) { return filter.call(filter, data, i, cOLength, self, id); }
		
		// if filter is not defined or filter is a string constant
		if (!filter || ($.isString(filter) && $.trim(filter) === constants.active)) {
			if (active.filter) { return active.filter.call(active.filter, data, i, cOLength, self, id); }
	
			return true;
		} else {
			// if filter is string
			if (!$.isArray(filter)) {
				// if simple filter
				if (filter.search(/\|\||&&|!|\(|\)/) === -1) {
					return sys.tmpFilter[filter].call(sys.tmpFilter[filter], data, i, cOLength, self, id);
				}
				
				filter = $.trim(
							filter
								.toString()
								.replace(/\s*(\(|\))\s*/g, " $1 ")
								.replace(/\s*(\|\||&&)\s*/g, " $1 ")
								.replace(/(!)\s*/g, "$1")
							)
						.split(" ");
			}
			// calculate deep filter
			calFilter = function (array, iter) {
				var
					i = -1,
					aLength = array.length - 1,
					pos = 0,
					result = [];
				
				for (; i++ < aLength;) {
					iter++;
					if (array[i] === "(") { pos++; }
					if (array[i] === ")") {
						if (pos === 0) {
							return {result: result, iter: iter};
						} else { pos--; }
					}
					result.push(array[i]);
				}
			};
			// calculate filter
			fLength = filter.length - 1;
			
			for (; j++ < fLength;) {
				// calculate atoms
				if (filter[j] === "(" || filter[j] === "!(") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = calFilter(filter.slice((j + 1)), j);
					j = tmpFilter.iter;
					//
					tmpResult = this.customFilter(tmpFilter.result, data, i, cOLength, self, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else {
						result = inverse === true ? !tmpResult : tmpResult || result;
					}
				// calculate outer filter
				} else if (filter[j] !== ")" && filter[j] !== "||" && filter[j] !== "&&") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = filter[j] === constants.active ? active.filter : sys.tmpFilter[filter[j]];
					tmpResult = tmpFilter.call(tmpFilter, data, i, cOLength, self, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else {
						result = inverse === true ? !tmpResult : tmpResult || result;
					}
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
	 * @param {Parser|String} parser - parser function or string expressions
	 * @param {String} str - source string
	 * @return {String}
	 */
	$.Collection.fn.customParser = function (parser, str) {
		var
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
			
			tmpParser,
			i;
		
		// if parser is function
		if ($.isFunction(parser)) { return parser.call(parser, str, this); }
		
		// if parser is not defined or parser is a string constant
		if (!parser || ($.isString(parser) && $.trim(parser) === this.config.constants.active)) {
			if (active.parser) { return active.parser.call(active.parser, str, this); }
	
			return str;
		} else {
			if ($.isString(parser)) {
				parser = $.trim(parser);
				// if simple parser
				if (parser.search("&&") === -1) { return sys.tmpParser[parser].call(sys.tmpParser[parser], str, this); }
				parser = parser.split("&&");
			}
			
			for (i = parser.length; i--;) {
				parser[i] = $.trim(parser[i]);
				tmpParser = parser[i] === this.config.constants.active ? active.parser : sys.tmpParser[parser[i]];
				
				str = tmpParser.call(tmpParser, str, this);
			}
	
			return str;
		}
	};
	
	/**
	 * calculate parent context
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level up
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {String}
	 */
	$.Collection.fn.parentContext = function (n, id) {
		n = n || 1;
	
		var
			dObj = this.dObj,
			context = "", i;
	
		context = (id && id !== this.config.constants.active ? dObj.sys.tmpContext[id] : dObj.active.context).split(this.config.constants.contextSeparator);
        for (i = n; i--;) { context.splice(-1, 1); }
	
		return context.join(this.config.constants.contextSeparator);
	};
	/**
	 * parent
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level up
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.parent = function (n, id) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			active = dObj.active,
	
			contextID = sys.contextID,
			context = this.parentContext.apply(this, arguments);
	
		if (!id || id === this.config.constants.active) {
			if (contextID) {
				sys.tmpContext[contextID] = context;
			}
			active.context = context;
		} else {
			sys.tmpContext[id] = context;
			if (contextID && id === contextID) {
				active.context = context;
			}
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
	 * @param {String} [id=this.config.constants.active] - collection ID
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
			statObj = $.Collection,
		
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
	
				for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
	
				sortedKeys.sort(statObj.sort.sortBy(field, rev, fn));
	
				for (key in sortedKeys) {
					if (sortedKeys.hasOwnProperty(key)) {
						sortedObj[sortedKeys[key]] = obj[sortedKeys[key]];
					}
				}
	
				return sortedObj;
			},
			// sort object by value
			sortObject = function (obj) {
				var
					sortedValues = [],
					sortedObj = {},
					key;
	
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						sortedValues.push({
							key: key,
							value: obj[key]
						});
					}
				}
	
				sortedValues.sort(statObj.sort.sortBy(field === true ? "value" : "value" + statObj.obj.contextSeparator + field, rev, fn));
	
				for (key in sortedValues) {
					if (sortedValues.hasOwnProperty(key)) {
						sortedObj[sortedValues[key].key] = sortedValues[key].value;
					}
				}
	
				return sortedObj;
			};
	
		cObj = statObj.obj.getByLink(id ? sys.tmpCollection[id] : dObj.active.collection, this.getActiveContext());
	
		if (typeof cObj === "object") {
			if ($.isArray(cObj)) {
				cObj.sort(statObj.sort.sortBy(field, rev, fn));
			} else {
				if (field) {
					cObj = sortObject.call(this, cObj);
				} else {
					cObj = sortObjectByKey.call(this, cObj);
				}
	
				this.setElement("", cObj, id || "");
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
	 * @param {String|Collection} [objID=this.config.constants.active] - collection ID or collection
	 * @param {Function|Array} [replacer=undefined] - an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space=undefined] - indentation of nested structures
	 * @return {String}
	 */
	$.Collection.fn.toString = function (objID, replacer, space) {
		var dObj = this.dObj, cObj;
		
		if (objID && ($.isArray(objID) || $.isPlainObject(objID))) {
			if (JSON && JSON.stringify) {
				return JSON.stringify(objID, replacer || "", space || "");
			}
			throw new Error("object JSON is not defined!");
		}
		
		cObj = objID && objID !== this.config.constants.active ? dObj.sys.tmpCollection[objID] : dObj.active.collection;
		cObj = $.Collection.obj.getByLink(cObj, this.getActiveContext());
		
		if (JSON && JSON.stringify) {
			return JSON.stringify(cObj, replacer || "", space || "");
		}
		throw new Error("object JSON is not defined!");
	};
	/**
	 * return collection length
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Number}
	 */
	$.Collection.fn.valueOf = function (id) {
		return this.length($.isExist(id) ? id : this.config.constants.active);
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
		var $this = this;
		
		if (arguments.length === 1) {
			$.when($this.active("defer")).always(function () { done.apply($this, arguments); });
		} else {
			$.when($this.active("defer")).then(
				function () { done().apply($this, arguments); },
				function () { fail().apply($this, arguments); }
			);
		}
			
		return this;
	};	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
	
	/**
	 * simple templating (in context)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Template} [param.template=this.dObj.active.template] - template
	 * @param {jQuery Object|Boolean} [param.target=this.dObj.active.target] - element to output the result ("false" - if you print a variable)
	 * @param {String} [param.variable=this.dObj.sys.variableID] - variable ID (if param.target === false)
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.active.parser] - parser function, string expressions or "false"
	 * @param {String} [param.appendType=this.dObj.active.appendType] - type additions to the DOM
	 * @param {String} [param.resultNull=this.dObj.active.resultNull] - text displayed if no results
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.print = function (param, mult, count, from, indexOf) {
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			dObj = this.dObj,
			opt = {},
	
			result = "", action;
		//
		$.extend(true, opt, dObj.active, param);
		action = function (data, i, cOLength, self, id) {
			// callback
			opt.callback && opt.callback.apply(this, arguments);
			//
			result += opt.template.call(opt.template, data, i, cOLength, self, id);
			if (mult !== true) { return false; }
			
			return true;
		};
		//
		this.each(action, opt.filter, this.config.constants.active, mult, count, from, indexOf);
		
		result = !result ? opt.resultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResult + '</div>' : opt.resultNull : result;
		result = opt.parser !== false ? this.customParser(opt.parser, result) : result;
		
		if (opt.target === false) {
			if (!opt.variable) {
				this.$_("variable", result);
			} else {
				this._push("variable", opt.variable, result);
			}
		} else { opt.target[opt.appendType](result); }
	
		return this;
	};	
	/////////////////////////////////
	//// design methods (extended print)
	/////////////////////////////////
		
	/**
	 * extended templating (in context) (with pager)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Number} [param.page=this.dObj.active.param.page] - page number
	 * @param {Template} [param.template=this.dObj.active.template] - template
	 * @param {Number|Boolean} [param.numberBreak=this.dObj.active.param.numberBreak] - number of entries on 1 page (if "false", returns all records)
	 * @param {Number} [param.pageBreak=this.dObj.active.param.pageBreak] - number of displayed pages (navigation)
	 * @param {jQuery Object} [param.target=this.dObj.active.target] - element to output the result
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.active.parser] - parser function, string expressions or "false"
	 * @param {Boolean} [param.cacheIteration=this.dObj.cache.iteration] - if "true", the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.dObj.active.calculator] - selector, on which is the number of records per page
	 * @param {Selector} [param.pager=this.dObj.active.param.pager] - selector to pager
	 * @param {String} [param.appendType=this.dObj.active.appendType] - type additions to the DOM
	 * @param {String} [param.resultNull=this.dObj.active.resultNull] - text displayed if no results
	 * @return {Colletion Object}
	 */
	$.Collection.fn.extPrint = function (param) {
		var
			dObj = this.dObj,
			active = dObj.active,
			opt = {},
			
			cObj, cOLength,
			start, inc = 0, checkPage, from = null,
			
			result = "", action;
			
		// easy implementation
		if ($.isString(param) || $.isNumeric(param)) { param = {page: param}; }
		//
		$.extend(true, opt, active, param);
		if (param) { opt.page = $.Collection.obj.expr(opt.page, active.page || ""); }
		//
		checkPage = active.page - opt.page;
		active.page = opt.page;
		action = function (data, i, cOLength, self, id) {
			// callback
			opt.callback && opt.callback.apply(this, arguments);
			//
			result += opt.template.call(opt.template, data, i, cOLength, self, id);
			inc = i;
				
			return true;
		};
		// get collection
		cObj = $.Collection.obj.getByLink(opt.collection, this.getActiveContext());
		cOLength = this.length();
		
		// number of records per page
		opt.numberBreak = opt.numberBreak === false ? cOLength : opt.numberBreak;
		
		if ($.isPlainObject(cObj) || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak;
			//
			this.each(action, opt.filter, this.config.constants.active, true, opt.numberBreak, start);
		} else if ($.isArray(cObj) && opt.cache.iteration === true) {
			// calculate the starting position
			start = opt.filter === false ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak : opt.cache.iteration === true ?
							checkPage > 0 ? opt.cache.firstIteration : opt.cache.lastIteration : i;
			
			// rewind cached step back
			if (checkPage > 0 && opt.filter !== false) {
				checkPage = opt.numberBreak * checkPage;
				for (; start--;) {
					if (this.customFilter(opt.filter, cObj, start, cOLength, this, this.config.constants.active) === true) {
						if (inc === checkPage) {
							break;
						} else { inc++; }
					}
				}
				start++;
				opt.cache.lastIteration = start;
				from = null;
			} else if (checkPage < 0 && opt.filter !== false) {
				from = Math.abs(checkPage) * opt.numberBreak - opt.numberBreak || null;
			}
			//
			this.each(action, opt.filter, this.config.constants.active, true, opt.numberBreak, from, start);
		}
		// cache
		active.cache.firstIteration = opt.cache.lastIteration;
		active.cache.lastIteration = inc + 1;
		if (opt.cache.autoIteration === true) { active.cache.iteration = true; }
		//
		result = !result ? opt.resultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResult + '</div>' : opt.resultNull : result;
		result = opt.parser !== false ? this.customParser(opt.parser, result) : result;
		// append to DOM
		opt.target[opt.appendType](result);
		//
		$.extend(true, opt, {
			nmbOfEntries: this.length(opt.filter),
			nmbOfEntriesInPage: $(opt.calculator, opt.target).length
		});
		opt.finNumber = opt.numberBreak * opt.page - (opt.numberBreak - opt.nmbOfEntriesInPage);
		// generate navigation bar
		if (opt.page !== 1 && opt.nmbOfEntriesInPage === 0) {
			opt.page = "-=1";
			this.extPrint(opt);
		} else { this.easyPage(opt); }
	
		return this;
	};
	/**
	 * activation of the model template
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param=undefined] - object settings (depends on the model template)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.easyPage = function (param) {
		this.dObj.active.templateModel.call(this.dObj.active.templateModel, param, this);
		
		return this;
	};	
	/////////////////////////////////
	//// design methods (table)
	/////////////////////////////////
		
	/**
	 * generating the table (if the template consisted of td)
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [count=4] - td number to a string
	 * @return {Colletion Object}
	 */
	$.Collection.fn.genTable = function (count) {
		count = count || 4;
	
		var
			i = 1, j,
	
			target = this.dObj.active.target,
			tdLength = target.children("td").length - 1,
	
			countDec = count - 1,
			queryString = "";
	
		target.children("td").each(function (n) {
			if (i === count) {
				queryString = "";
	
				for (j = -1; j++ < countDec;) {
					queryString += "td:eq(" + (n - j) + ")";
					if (j !== countDec) { queryString += ","; }
				}
	
				target.children(queryString).wrapAll("<tr></tr>");
				i = 0;
			} else if (n === tdLength && i !== count) {
				queryString = "";
	
				for (j = 0, i; j < i; j++) {
					queryString += "td:eq(" + j + ")";
					if (j !== (i - 1)) { queryString += ","; }
				}
	
				target.children(queryString).wrapAll("<tr></tr>");	
				queryString = "";
	
				for (; i < count; i++) { queryString += "<td></td>"; }	
				target.children("tr:last").append(queryString);
			}
			i++;
		});
	
		target.children("tr").wrapAll("<table></table>");
	
		return this;
	};
})(jQuery); //