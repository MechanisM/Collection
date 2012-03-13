/**
 * <p>Collection — JS (JavaScript) framework for working with collections of data (using jQuery).</p>
 *
 * <strong>Glossary:</strong>
 * <ul>
 * <li><b>Collection</b> — data object the JS, can be implemented as an array, and as a hash table (you can combine arrays with the hash, for example: [{...},{...},...]);</li>
 * <li><b>Filter</b> — is a special function, which returns a Boolean value for each "row" of the collection;</li>
 * <li><b>Parser</b> — is a special function which makes the post—processing of the template;</li>
 * <li><b>Context</b> — a string which specifies a link to the context of the collection (for example: "Name > 1" indicates the obj.Name[1], where obj is the instance of collection);</li>
 * <li><b>Template</b> — is a special function, which converts the collection in the text, in accordance with special regulations.</li>
 * </ul>
 *
 * <strong>Addition:</strong>
 * <p>The code is documented in accordance with the standard <a href="http://en.wikipedia.org/wiki/JSDoc" target="_blank">jsDoc</a>.<br />
 * Specific data types:</p>
 * <ul>
 * <li><b>[Collection Object]</b> is a reduced form of the <b>[Object]</b> and means an instance of C;</li>
 * <li><b>[Colletion]</b> is a reduced form of the <b>[Object|Array]</b> and means an collection of data;</li>
 * <li><b>[Selector]</b> is a reduced form of the <b>[String]</b>, and means the css selector (Sizzle syntax);</li>
 * <li><b>[Context]</b> is the reduced form of the <b>[String]</b>, and means the context of the collection (Nimble syntax);</li>
 * <li><b>[Template]</b> is a reduced form of the <b>[Function]</b> and means function—template;</li>
 * <li><b>[Filter]</b> is a reduced form of the <b>[Filter|String]</b> and means the function—filter or string expression;</li>
 * <li><b>[Parser]</b> is a reduced form of the <b>[Parser|String]</b> and means function—parser or string expression;</li>
 * <li><b>[Plain Object]</b> is a reduced form of the <b>[Object]</b> and means hash table;</li>
 * <li><b>[jQuery Object]</b> is a reduced form of the <b>[Object]</b> and means an instance of jQuery;</li>
 * <li><b>[jQuery Deferred]</b> is the reduced form of the <b>[Object]</b> and means an instance of jQuery.Deferred.</li>
 * </ul>
 *
 * <p>For comfortable work it is recommended to use the latest stable version of jQuery.</p>
 *
 * <p>Enjoy!</p>
 *
 * <p>Copyright 2012, Andrey Kobets (Kobezzza)<br />
 * Dual licensed under the MIT or GPL Version 2 licenses.</p>
 *
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @date: 04.03.2012 11:34:56
 * @version 3.6
 *
 * @constructor
 * @example http://jsfiddle.net/kobezzza/ZEcaB/
 * @this {Colletion Object}
 * @param {C|Selector} [collection=null] — collection or selector for field "target"
 * @param {Plain Object} [uProp=C.fields.dObj.active] — additional properties
 */
var Collection = (function () {
	'use strict';
	
	var C;	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	C = function (collection, prop) {
		collection = collection || null;
		prop = prop || '';
		
		// create factory function if need
		if (!this || (!this.name || this.name !== 'Collection')) { return new C(collection, prop); }
		
		// mixin public fields
		C.extend(true, this, C.fields);
		var active = this.dObj.active;
		
		// extend public fields by additional properties if need
		if (prop) { C.extend(true, active, prop); }
		
		// compile (if need)
		if (this._exprTest(active.filter)) { active.filter = this._compileFilter(active.filter); }
		if (this._exprTest(active.parser)) { active.parser = this._compileParser(active.parser); }
		
		// search the DOM
		if (C.isString(active.target)) { active.target = this.drivers.dom.find(active.target); }
		if (C.isString(active.pager)) { active.pager = this.drivers.dom.find(active.pager); }
		
		active.collection = collection;
	};	
	/**
	 * set new value of the object by the link, get/remove an element by the link, or return a fragment of the context (overload)
	 * 
	 * @this {Collection}
	 * @param {Object|Number|Boolean} obj — some object
	 * @param {Context} context — link
	 * @param {mixed} [value] — some value
	 * @param {Boolean} [del=false] — if true, remove element
	 * @return {Collection|mixed}
	 *
	 * @example
	 * $C.byLink({a: {b: 1, c: 2}}, 'a > b', 2); // a.b = 2
	 * $C.byLink({a: {b: 1, c: 2}}, 'a > eq(-1)', 1); // a.c = 1
	 * $C.byLink({a: {b: 1, c: 2}}, 'a > eq(-1)', '', true); // delete a.c
	 * $C.byLink(false, 'a > b > eq(5) > 1'); // returns 'a > b > eq(5) > 1'
	 * $C.byLink(2, 'a > b > eq(5) > 1'); // returns 'a>b'
	 * $C.byLink(-1, 'a > b > eq(5) > 1'); // returns 'a>b>eq(5)'
	 */
	C.byLink = function (obj, context, value, del) {
		context = context
					.toString()
					.replace(new RegExp('\\s*' + C.CHILDREN + '\\s*', 'g'), C.CONTEXT_SEPARATOR + C.CHILDREN + C.CONTEXT_SEPARATOR)
					.split(C.CONTEXT_SEPARATOR);
		
		del = del || false;
		
		var
			type = C.CHILDREN,
			last = 0, total = 0,
			
			key, i = context.length,
			pos, n,
			
			objLength, cLength;
	
		// remove dead elements
		while ((i -= 1) > -1) {
			context[i] = C.trim(context[i]);
			if (context[i] === '') {
				context.splice(i, 1);
				last -= 1;
			} else if (context[i] !== C.CHILDREN) {
				if (i > last) { last = i; }
				total += 1;
			}
		}
		// recalculate length
		cLength = context.length;
		
		// overload
		// returns the fragment of the context
		if (obj === false) {
			return context.join('');
		} else if (C.isNumber(obj)) {
			if ((obj = +obj) < 0) { obj += total; }
			
			if (typeof value === 'undefined') { 
				for (i = -1, n = 0; (i += 1) < cLength;) {
					if (context[i] !== C.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(i + 1, cLength);
							return context.join('');
						}
					}
				}
			} else {
				for (i = cLength, n = 0; (i -= 1) > -1;) {
					if (context[i] !== C.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(0, i);
							return context.join('');
						}
					}
				}
			}
		}
		
		for (i = -1; (i += 1) < cLength;) {
			switch (context[i]) {
				case C.CHILDREN : { type = context[i]; } break;
				
				default : {
					// children (>)
					if (type === C.CHILDREN && context[i].substring(0, C.ORDER[0].length) !== C.ORDER[0]) {
						if (i === last && typeof value !== 'undefined') {
							// set new value
							if (del === false) {
								obj[context[i]] = C.expr(value, obj[context[i]]);
							
							// remove from object
							} else {
								if (C.isArray(obj)) {
									obj.splice(context[i], 1);
								} else { delete obj[context[i]]; }
							}
						
						// next
						} else { obj = obj[context[i]]; }
					
					// order (eq)
					} else {
						pos = context[i].substring(C.ORDER[0].length);
						pos = pos.substring(0, (pos.length - 1));
						pos = +pos;
						
						// if array
						if (C.isArray(obj)) {
							if (i === last && typeof value !== 'undefined') {
								// if eq >= 0
								if (pos >= 0) {
									// set new value
									if (del === false) {
										obj[pos] = C.expr(value, obj[pos]);
									
									// remove from object
									} else { obj.splice(pos, 1); }
								
								// if eq < 0
								} else {
									// set new value
									if (del === false) {
										obj[obj.length + pos] = C.expr(value, obj[obj.length + pos]);
									
									// remove from object
									} else { obj.splice(obj.length + pos, 1); }
								}
							} else {
								// next
								if (pos >= 0) {
									obj = obj[pos];
								} else { obj = obj[obj.length + pos]; }
							}
						
						// if object
						} else {
							// calculate position
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
										if (i === last && typeof value !== 'undefined') {
											// set new value
											if (del === false) {
												obj[key] = C.expr(value, obj[key]);
											
											// remove from object
											} else { delete obj[key]; }
										
										// next
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
		
		if (typeof value !== 'undefined') { return C; }
		return obj;
	};
		
	/**
	 * execute event
	 * 
	 * @this {Collection}
	 * @param {String} query — query string
	 * @param {Object} event — event object
	 * @param {mixed} [param] — input parameters
	 * @param {mixed} [thisObject=event] — object to use as this
	 * @return {mixed}
	 */
	C.execEvent = function (query, event, param, thisObject) {
		query = query.split(C.QUERY_SEPARATOR);
		param = C.isExists(param) ? param : [];
		param = C.isArray(param) ? param : [param];
		
		var 
			i = -1,
			qLength = query.length - 1,
			spliter;
		
		while ((i += 1) < qLength) { event = event[query[i]]; }
		thisObject = thisObject || event;
		
		if (query[i].search(C.SUBQUERY_SEPARATOR) !== -1) {
			spliter = query[i].split(C.SUBQUERY_SEPARATOR);
			event = event[spliter[0]];
			spliter.splice(0, 1);
			param = param.concat(spliter);
			
			return event.apply(thisObject, param);
		} else { return event[query[i]].apply(thisObject, param); }
	};		
	/////////////////////////////////
	//// constants
	/////////////////////////////////
	
	C.CONTEXT_SEPARATOR =  '__context__';
	C.QUERY_SEPARATOR = '/';
	C.SUBQUERY_SEPARATOR = '{';
	C.METHOD_SEPARATOR = '->';
		
	C.CHILDREN = '>';
	C.ORDER = ['eq(', ')'];		
	/////////////////////////////////
	//// data types
	/////////////////////////////////
	
	/**
	 * returns the value of the hidden properties of [[CLASS]]
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 *
	 * @example
	 * $C.class('test'); // returns '[object String]'
	 * $C.class(2); // returns '[object Number]'
	 */
	C.toString = function (obj) {
		if (typeof obj === 'undefined') { return C.prototype.collection(); }
		return Object.prototype.toString.call(obj);
	};
	
	/**
	 * returns a Boolean indicating whether the object is a string
	 *
	 * @param {mixed} obj — object to test whether or not it is a string
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isString('test'); // returns true
	 * $C.isString(2); // returns false
	 */
	C.isString = function (obj) { return C.toString(obj) === '[object String]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a number
	 *
	 * @param {mixed} obj — object to test whether or not it is a number
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isNumber('test'); // returns false
	 * $C.isNumber(2); // returns true
	 */
	C.isNumber = function (obj) { return C.toString(obj) === '[object Number]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a boolean
	 *
	 * @param {mixed} obj — object to test whether or not it is a boolean
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isNumber('test'); // returns false
	 * $C.isNumber(false); // returns true
	 */
	C.isBoolean = function (obj) { return C.toString(obj) === '[object Boolean]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a function
	 *
	 * @param {mixed} obj — object to test whether or not it is a function
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isFunction('test'); // returns false
	 * $C.isFunction(function () {}); // returns true
	 */
	C.isFunction = function (obj) { return C.toString(obj) === '[object Function]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a array (not an array-like object)
	 *
	 * @param {mixed} obj — object to test whether or not it is a array
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isArray({'0': 1, '1': 2, '2': 3, 'length': 3}); // returns false
	 * $C.isArray([1, 2, 3]); // returns true
	 */
	C.isArray = function (obj) { return C.toString(obj) === '[object Array]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a plain object
	 *
	 * @param {mixed} obj — object to test whether or not it is a plain object
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isPlainObject({'0': 1, '1': 2, '2': 3, 'length': 3}); // returns true
	 * $C.isPlainObject(new Date); // returns false
	 * $C.isPlainObject(Date); // returns false
	 */
	C.isPlainObject = function (obj) { return C.toString(obj) === '[object Object]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a collection
	 *
	 * @param {mixed} obj — object to test whether or not it is a collection
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isCollection({'0': 1, '1': 2, '2': 3, 'length': 3}); // returns true
	 * $C.isCollection([1, 2, 3]); // returns true
	 */
	C.isCollection = function (obj) { return C.isArray(obj) || C.isPlainObject(obj); };
	
	/**
	 * returns a Boolean value indicating that the object is not equal to: undefined, null, or '' (empty string)
	 *
	 * @param {mixed} obj — the object, to test its existence
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isExists(''); // returns false
	 * $C.isExists(null); // returns false
	 * $C.isExists(false); // returns true
	 */
	C.isExists = function (obj) { return typeof obj !== 'undefined' && obj !== null && obj !== ''; };		
	/////////////////////////////////
	//// string methods
	/////////////////////////////////
	
	/**
	 * removes all leading and trailing whitespace characters
	 *
	 * @param {String} str — the source string
	 * @return {String}
	 *
	 * @example
	 * $C.trim(' test'); // returns 'test'
	 * $C.trim(' test '); // returns 'test'
	 */
	C.trim = function (str) {
		var
			str = str.replace(/^\s\s*/, ''),
			ws = /\s/,
			i = str.length;
		
		while (ws.test(str.charAt((i -= 1)))) {};
		return str.substring(0, i + 1);
	};
	
	/**
	 * toUpperCase function
	 * 
	 * @param {String} str — some str
	 * @param {Number} [max=str.length] — the maximum number of characters
	 * @param {Number} [from=0] — start position
	 * @return {String}
	 *
	 * @example
	 * $C.toUpperCase('test'); // returns 'TEST'
	 * $C.toUpperCase('test', 2); // returns 'TEst'
	 * $C.toUpperCase('test', 2, 1); // returns tESt'
	 */
	C.toUpperCase = function (str, max, from) {
		from = from || 0;
		max = C.isExists(max) ? from + max : str.length;
		
		return str.substring(0, from) + str.substring(from, max).toUpperCase() + str.substring(max);
	};
	/**
	 * toLowerCase function
	 * 
	 * @param {String} str — some str
	 * @param {Number} [max=str.length] — the maximum number of characters
	 * @param {Number} [from=0] — start position
	 * @return {String}
	 *
	 * @example
	 * $C.toLowerCase('TEST'); // returns 'test'
	 * $C.toLowerCase('TEST', 2); // returns 'teST'
	 * $C.toLowerCase('TEST', 2, 1); // returns TesT'
	 */
	C.toLowerCase = function (str, max, from) {
		from = from || 0;
		max = C.isExists(max) ? from + max : str.length;
		
		return str.substring(0, from) + str.substring(from, max).toLowerCase() + str.substring(max);
	};		
	/////////////////////////////////
	//// expressions
	/////////////////////////////////
	
	/**
	 * calculate math expression for string
	 * 
	 * @param {mixed} val — new value
	 * @param {mixed} old — old value
	 * @return {Number|String}
	 *
	 * @example
	 * $C.expr('+=1', 2); // returns 3
	 * $C.expr('*=2', 2); // returns 4
	 * $C.expr('+=2', 'test'); // returns '2test'
	 */
	C.expr = function (val, old) {
		old = C.isExists(old) ? old : '';
		
		if (C.isString(val) && val.search(/^[+-\\*\/]{1}=/) !== -1) {
			val = val.split('=');
			if (!isNaN(val[1])) { val[1] = +val[1]; }
			
			// simple math
			switch (val[0]) {
				case '+': { val = old + val[1]; } break;
				case '-': { val = old - val[1]; } break;
				case '*': { val = old * val[1]; } break;
				case '/': { val = old / val[1]; } break;
			}
		}
	
		return val;
	};
	
	/**
	 * get random integer number
	 * 
	 * @param {Number} [min=0] — min number
	 * @param {Number} [max=10] — max number
	 * @return {Number}
	 *
	 * @example
	 * $C.getRandomInt(1, 15);
	 */
	C.getRandomInt = function (min, max) {
		min = min || 0;
		max = max || 10;
		
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
		
	/////////////////////////////////
	//// methods of arrays and objects
	/////////////////////////////////
	
	/**
	 * returns the index or key that indicates whether there is an array or object element equal to a specified or false
	 *
	 * @param {mixed} val — some value to be searched
	 * @param {Array} obj — an object or an array to search
	 * @return {Number|String|Boolean}
	 *
	 * @example
	 * $C.find('test', [1, 2, 'test']); // returns true
	 * $C.find('test', {a: 1, b: 2, test: 3}); // returns false
	 */
	C.find = function (val, obj) {
		var key, res;
		
		if (C.isArray(obj)) {
			obj.some(function (el, i) {
				if (val === el) {
					res = true;
					
					return true;
				}
			});
			if (res) { return res; }
		} else {
			for (key in obj) {
				if (!obj.hasOwnProperty(key)) { continue; }
				if (val === obj[key]) { return key; }
			}
		}
		
		return false;
	};
	
	/**
	 * merge the contents of two or more objects together into the first object
	 *
	 * @param {Boolean|Object} [deep=target] — if true, the merge becomes recursive (overload) or the object to extend
	 * @param {Object} [target] — the object to extend
	 * @param {Object} [objectN] — additional objects containing properties to merge in
	 * @return {Object}
	 *
	 * @example
	 * $C.extend({a: 1}, {a: 2}, {a: 3}); // returns {a: 3}
	 * $C.extend(true, {a: {c: 1, b: 2}}, {a: {c: 2}}, {a: {c: 3}}); // returns {a: {c: 3, b: 2}}
	 */
	C.extend = function () {
		var
			options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			
			i = 0, aLength = arguments.length,
			
			deep = false;
	
		// handle a deep copy situation
		if (C.isBoolean(target)) {
			deep = target;
			target = arguments[1] || {};
			i = 1;
		}
	
		// handle case when target is a string or something (possible in deep copy)
		if (typeof target !== 'object' && !C.isFunction(target)) { target = {}; }
	
		// extend Collection itself if only one argument is passed
		if (aLength === i) {
			target = C;
			i -= 1;
		}
	
		while ((i += 1) < aLength) {
			// only deal with non-null/undefined values
			if (C.isExists(options = arguments[i])) {
				// extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];
	
					// prevent never-ending loop
					if (target === copy) { continue; }
	
					// recurse if we're merging plain objects or arrays
					if (deep && copy && (C.isPlainObject(copy) || (copyIsArray = C.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && C.isArray(src) ? src : [];
						} else { clone = src && C.isPlainObject(src) ? src : {}; }
	
						// never move original objects, clone them
						target[name] = C.extend(deep, clone, copy);
					
					// don't bring in undefined values
					} else if (typeof copy !== 'undefined') { target[name] = copy; }
				}
			}
		}
		
		return target;
	};
		
	/**
	 * add a new element to an object (returns true when an element is added at the end and a new object, if the element is added to the beginning)
	 *
	 * @this {Collection}
	 * @param {Plain Object} obj — the object to extend
	 * @param {String} keyName — key name (can use '->unshift' — the result will be similar to work for an array unshift)
	 * @param {mixed} value — some value
	 * @return {Plain Object|Boolean}
	 *
	 * @example
	 * $C.addElementToObject({a: 1}, 'b', 2); // returns true ({a: 1, b: 2})
	 * $C.addElementToObject({a: 1}, 'b->unshift', 2); // returns {b: 2, a: 1}
	 */
	C.addElementToObject = function (obj, keyName, value) {
		keyName = keyName.split(C.METHOD_SEPARATOR);
		var key, newObj = {};
	
		if (keyName[1] && keyName[1] === 'unshift') {
			newObj[!isNaN(Number(keyName[0])) ? 0 : keyName[0]] = value;
			
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					newObj[!isNaN(Number(key)) ? +key + 1 : key] = obj[key];
				}
			}
			obj = newObj;
	
			return obj;
		} else if (!keyName[1] || keyName[1] === 'push') { obj[keyName[0]] = value; }
	
		return true;
	};
	
	/**
	 * unshift for arguments (object)
	 * 
	 * @param {Object} obj — some object
	 * @param {mixed} val — new value
	 * @return {Array}
	 *
	 * @example
	 * $C.unshiftArguments({'0': 1}, 2); // returns [2, 1]
	 */
	C.unshiftArguments = function (obj, val) {
		var newObj = [val], i = -1, oLength = obj.length;
		while ((i += 1) < oLength) { newObj.push(obj[i]); }
		
		return newObj;
	};	
	/////////////////////////////////
	//// array prototype
	/////////////////////////////////

	if (!Array.prototype.forEach) {
		/**
		 * calls a function for each element in the array
		 *
		 * @this {Array}
		 * @param {Function} callback — function to test each element of the array
		 * @param {mixed} [thisObject] — object to use as this when executing callback
		 * @return {undefined}
		 */
		Array.prototype.forEach = function (callback, thisObject) {
			var i = -1, aLength = this.length;
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					callback(this[i], i, this);
				} else { callback.call(thisObject, this[i], i, this); }
			}
		}
	}
	
	if (!Array.prototype.some) {
		/**
		 * tests whether some element in the array passes the test implemented by the provided function
		 *
		 * @this {Array}
		 * @param {Function} callback — function to test each element of the array
		 * @param {mixed} [thisObject] — object to use as this when executing callback
		 * @return {undefined}
		 */
		Array.prototype.some = function (callback, thisObject) {
			var i = -1, aLength = this.length, res;
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					res = callback(this[i], i, this);
				} else { res = callback.call(thisObject, this[i], i, this); }
				if (res === true) { break; }
			}
		}
	}	
	/////////////////////////////////
	//// prototype
	/////////////////////////////////
	
	C.prototype = {
		/**
		 * framework name
		 * 
		 * @constant
		 * @type String
		 */
		name: 'Collection',
		/**
		 * framework version
		 * 
		 * @constant
		 * @type String
		 */
		version: '3.6',
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Object}
		 * @return {String}
		 */
		collection: function () { return this.name + ' ' + this.version; },
		
		// const
		ACTIVE: 'active',
		SHUFFLE: 'shuffle',
		NAMESPACE_SEPARATOR: '.',
		
		/**
		 * stack parameters
		 * 
		 * @private
		 * @field
		 * @type Array
		*/
		stack: [
			'namespace',
			
			'collection',
			'filter',
			'context',
			'cache',
			'variable',
			'defer',
	
			'page',
			'parser',
			'appendType',
			'target',
			'calculator',
			'pager',
			'template',
			'numberBreak',
			'pageBreak',
			'resultNull'
		]
	};	
	/////////////////////////////////
	//// drivers for additional functions
	/////////////////////////////////
	
	C.prototype.drivers = C.drivers = {};	
	/////////////////////////////////
	//// DOM methods
	/////////////////////////////////
	
	C.drivers.dom = {
		/**
		 * returns a list of the elements within the document
		 * 
		 * @this {Collection DOM Driver}
		 * @param {String} selector — is a string containing one or more CSS selectors separated by commas
		 * @param {DOM node} [context] — context
		 * @throw {Error}
		 * @return {mixin}
		 */
		find: function (selector, context) {
			if (!this.lib) { throw new Error('DOM driver is not defined!'); }
			
			return this.engines[this.lib].find(selector || '', context || '');
		},
		
		/**
		 * returns all direct child elements
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} [attr] — the properties of a node
		 * @return {Array}
		 */
		children: function (el, prop) {
			var res = [];
			Array.prototype.forEach.call(el.childNodes, function (el) {
				if (el.nodeType === 1) {
					if (!prop) {
						res.push(el);
					} else if (el[prop]) { res.push(el); }
				}
			});
			
			return res;
		},
		
		/**
		 * returns the data attributes of the node
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} [name] — data name
		 * @return {Collection DOM Driver}
		 */
		data: function (el, name) {
			var attr = el.attributes, data = {};
	
			if (attr && attr.length > 0) {
				Array.prototype.forEach.call(attr, function (el) {
					if (el.name.substring(0, 5) === 'data-') {
						data[el.name.replace('data-', '')] = C.isString(el.value) && el.value.search(/^\{|\[/) !== -1 ? JSON.parse(el.value) : el.value;
					}
				});
			}
			
			if (name) { return data[name]; }
			return data;
		},
		
		/**
		 * returns the text content of the node
		 * 
		 * @this {Collection}
		 * @param {DOM Node} el — DOM node
		 * @return {String|Boolean}
		 */
		text: function (el) {
			el = el.childNodes;		
			var str = '';
			
			Array.prototype.forEach.call(el, function (el) {
				if (el.nodeType === 3 && C.trim(el.textContent)) { str += el.textContent; }
			});
			
			if (str) { return str; }
			
			return false;
		},
		
		/**
		 * attach event
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} eventType — event type
		 * @param {Function} callback — callback function
		 * @return {Collection DOM Driver}
		 */
		bind: function (el, eventType, callback) {
			if (this.engines[this.lib][eventType]) {
				this.engines[this.lib][eventType](el, callback);
				
				return this;
			}
			
			// if old IE
			if (document.attachEvent) {
				el.attachEvent('on' + eventType, callback);
			} else { el.addEventListener(eventType, callback); }
			
			return this;
		},
		
		/**
		 * adds the specified class to the element
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} className — class name
		 * @return {Collection DOM Driver}
		 */
		addClass: function (el, className) {
			var classes = el.className;
			if (classes.search(className) === -1) { el.className += ' ' + className; }
			
			return this;
		},
		/**
		 * determine whether or not the specified item is needed class
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} className — class name
		 * @return {Boolean}
		 */
		hasClass: function (el, className) {
			return el.className.search(className) === -1 ? false : true;
		},
		/**
		 * remove a single class
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} className — class name
		 * @return {Collection DOM Driver}
		 */
		removeClass: function (el, className) {
			var classes = el.className;
			el.className = classes.replace(className, '');
			
			return this;
		},
		
		// search frameworks
		engines: {
			// qsa css selector engine
			qsa: {
				/** @private */
				is: function () {
					if (typeof qsa !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					return qsa.querySelectorAll(selector, context);
				}
			},
			// sizzle 
			sizzle: {
				/** @private */
				is: function () {
					if (typeof Sizzle !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					return Sizzle(selector, context);
				}
			},
			// jQuery 
			jQuery: {
				/** @private */
				is: function () {
					if (typeof jQuery !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					return jQuery(selector, context);
				},
				/** @private */
				click: function (el, callback) { $(el).click(callback); },
				/** @private */
				change: function (el, callback) { $(el).change(callback); }
			},
			// dojo 
			dojo: {
				/** @private */
				is: function () {
					if (typeof dojo !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					return dojo.query(selector, context);
				},
				/** @private */
				click: function (el, callback) { dojo.connect(el, 'onclick', callback); }
			},
			// mootools 
			mootools: {
				/** @private */
				is: function () {
					if (typeof Element.getElements !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					var res;
					
					if (context) {
						res = [];
						
						$$(context).getElements(selector).forEach(function (el) {
							el.forEach(function (el) { res.push(el); });
						});
					} else { res = $$(selector); }
					
					return res;
				}
			}
		}
	};
	
	// definition of DOM driver
	(function () {
		var key, engines = C.drivers.dom.engines;
		
		for (key in engines) {
			if (!engines.hasOwnProperty(key)) { continue; }
					
			if (engines[key].is()) {
				C.drivers.dom.lib = key;
				
				return true;
			}
		}
	})();	
	/////////////////////////////////
	//// DOM methods (core)
	/////////////////////////////////
	
	/**
	 * converts one level nodes in the collection
	 * 
	 * @this {Collection}
	 * @param {DOM Nodes} el — DOM node
	 * @return {Array}
	 */
	C._inObj = function (el) {
		var
			array = [],
			stat = C.fromNodes.stat,
			
			dom = C.drivers.dom;
				
		// each node
		Array.prototype.forEach.call(el, function (el) {
			// not for text nodes
			if (el.nodeType === 1) {
				var
					data = dom.data(el),
					classes = el.hasAttribute('class') ? el.getAttribute('class').split(' ') : '',
					
					txt = dom.text(el),
					key,
					
					i = array.length;
				
				// data
				array.push({});
				for (key in data) { if (data.hasOwnProperty(key)) { array[i][key] = data[key]; } }
				
				// classes
				if (classes) {
					array[i][stat.classes] = {};
					classes.forEach(function (el) {
						array[i][stat.classes][el] = el;
					});
				}
				
				if (el.childNodes.length !== 0) { array[i][stat.childNodes] = C._inObj(el.childNodes); }
				if (txt !== false) { array[i][stat.val] = txt.replace(/[\r\t\n]/g, ' '); }
			}
		});

		return array;
	};
	
	/**
	 * create an instance of the Collection on the basis of the DOM node
	 * 
	 * @this {Collection}
	 * @param {String} selector — CSS selector
	 * @param {Object} prop — user's preferences
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	C.fromNodes = function (selector, prop) {
		if (!JSON || !JSON.parse) { throw new Error('object JSON is not defined!'); }
		
		var data = C._inObj(C.drivers.dom.find(selector));
		
		if (prop) { return new C(data, prop); }
		return new C(data);
	};
	
	// values by default
	if (!C.fromNodes.stat) {
		C.fromNodes.stat = {
			val: 'val',
			childNodes: 'childNodes',
			classes: 'classes'
		};
	};
	/////////////////////////////////
	//// DOM methods (compiler templates)
	/////////////////////////////////
	
	/**
	 * compile the template
	 * 
	 * @this {Collection}
	 * @param {String|DOM nodes} selector — CSS selector or DOM nodes
	 * @throw {Error}
	 * @return {Function}
	 */
	C.ctplCompile = function (selector) {
		C.isString(selector) && (selector = C.drivers.dom.find(selector));
		if (selector.length === 0) { throw new Error('DOM element does\'t exist!'); }
		
		var
			html = selector[0] ? selector[0].innerHTML : selector.innerHTML,
			elem = html
				.replace(/\/\*.*?\*\//g, '')
				.split('?>')
				.join('<?js')
				.replace(/[\r\t\n]/g, ' ')
				.split('<?js'),
			
			resStr = 'var key = i, result = ""; ';
		
		elem.forEach(function (el, i) {
			if (i === 0 || i % 2 === 0) {
				resStr += 'result +="' + el + '";';
			} else { resStr += el.split('echo').join('result +='); }
		});
		
		return new Function('el', 'i', 'data', 'cOLength', 'cObj', 'id', resStr + ' return result;');
	};
	
	/**
	 * make templates
	 * 
	 * @this {Collection Object}
	 * @param {String|DOM nodes} selector — CSS selector or DOM nodes
	 * @return {Collection Object}
	 */
	C.prototype.ctplMake = function (selector) {	
		var dom = C.drivers.dom;
		C.isString(selector) && (selector = dom.find(selector));
		
		Array.prototype.forEach.call(selector, function (el) {
			var
				data = dom.data(el, 'ctpl'), key,
				prefix = data.prefix ? data.prefix + '_' : '';
			
			// compile template
			this._push('template', prefix + data.name, C.ctplCompile(el));
			if (data.set && data.set === true) { this._set('template', prefix + data.name); }
			
			// compile
			for (key in data) {
				if (!data.hasOwnProperty(key)){ continue; }
				
				if (C.find(key, ['prefix', 'set', 'print', 'name', 'collection'])) { continue; }
				if (C.find(key, ['target', 'pager'])) { data[key] = dom.find(data[key]); }
				
				this._push(key, prefix + data.name, data[key]);
				if (data.set && data.set === true) { this._set(key, prefix + data.name); }
				
				if (C.find(key, ['filter', 'parser'])) { data[key] = prefix + data.name; }
			}
			
			// print template (if need)
			if (data.print && data.print === true) {
				data.template = data.name;
				if (!data.target) {
					this._push('target', prefix + data.name, [el.parentNode]);
					if (data.set && data.set === true) { this._set('target', prefix + data.name); }
				}
				
				this.print(data);
			}
		}, this);
		
		return this;
	};	
	/////////////////////////////////
	//// public fields (active)
	/////////////////////////////////
	
	C.fields = {
		// root
		dObj: {
			/**
			 * active properties
			 * 
			 * @namespace
			 */
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
				namespace: 'nm',
				
				/**
				 * collection
				 * 
				 * @field
				 * @type collection|Null
				 */
				collection: null,
				/**
				 * filter (false if disabled)
				 * 
				 * @field
				 * @type Filter|Boolean
				 */
				filter: false,
				/**
				 * context
				 * 
				 * @field
				 * @type Context
				 */
				context: '',
				
				/**
				 * cache object
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
				 * temporary variables
				 * 
				 * @field
				 * @type mixed
				 */
				variable: null,
				
				/**
				 * deferred object
				 * 
				 * @field
				 * @type Deferred Object
				 */
				defer: '',
				
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
				 * parser (false if disabled)
				 * 
				 * @field
				 * @type Parser|Boolean
				 */
				parser: false,
				/**
				 * DOM insert mode ('html', 'append', 'prepend')
				 * 
				 * @field
				 * @param String
				 */
				appendType: 'html',
				/**
				 * target (target to insert the result templating)
				 * 
				 * @field
				 * @type Selector|DOM nodes
				 */
				target: null,
				/**
				 * selector (used to calculate the number of records per page, by default, are all the children of the element)
				 * 
				 * @field
				 * @type Selector
				 */
				calculator: null,
				/**
				 * pager (an interface element to display the navigation through the pages of)
				 * 
				 * @field
				 * @type Selector|DOM nodes
				 */
				pager: null,
				/**
				 * template
				 * 
				 * @field
				 * @type Function
				 */
				template: null,
				/**
				 * the number of entries on one page
				 * 
				 * @field
				 * @type Number
				 */
				numberBreak: null,
				/**
				 * the number of pages in the navigation menu
				 * 
				 * @field
				 * @type Number
				 */
				pageBreak: 5,
				/**
				 * empty result (in case if the search nothing is returned)
				 * 
				 * @field
				 * @type String
				 */
				resultNull: ''
			}
		}
	};	
	/////////////////////////////////
	//// public fields (system)
	/////////////////////////////////
	
	C.fields.dObj.sys = {
		// the state of the system flags
		flags: {
			// the use of the active system flags
			use: {
				/**
				 * use active context in methods
				 * 
				 * @private
				 * @field
				 * @type Boolean
				 */
				context: true,
				/**
				 * use active filter in methods
				 * 
				 * @private
				 * @field
				 * @type Boolean
				 */
				filter: true,
				/**
				 * use active parser in methods
				 * 
				 * @private
				 * @field
				 * @type Boolean
				 */
				parser: true,
				
				/**
				 * use cache
				 * 
				 * @private
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
			sys = C.fields.dObj.sys;
		
		data.forEach(function (el) {
			upperCase = C.toUpperCase(el, 1);
			
			sys["active" + upperCase + "ID"] = null;
			sys["tmp" + upperCase] = {};
			sys[el + "ChangeControl"] = null;
			sys[el + "Back"] = [];
		});
	})(C.prototype.stack);	
	/////////////////////////////////
	//// stack methods
	/////////////////////////////////
	
	/**
	 * set new value of the parameter on the stack (no impact on the history of the stack)(has aliases, format: new + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {mixed} newVal — new value
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5]);
	 * // new collection
	 * db.newCollection([1, 2]);
	 */
	C.prototype._new = function (stackName, newVal) {
		var
			active = this.dObj.active,
			upperCase = C.toUpperCase(stackName, 1);
		
		// compile string if need
		if (C.find(stackName, ['filter', 'parser']) && this._exprTest(newVal)) {
			active[stackName] = this['_compile' + C.toUpperCase(stackName, 1)](newVal);
		
		// search the DOM (can take a string selector or an array of nodes)
		} else if (C.find(stackName, ['target', 'pager']) && C.isString(newVal)) {
			active[stackName] = this.drivers.dom.find.apply(this.drivers.dom, C.isArray(newVal) ? newVal : [newVal]);
		} else { active[stackName] = C.expr(newVal, active[stackName] || ''); }
		
		// break the link with a stack
		this.dObj.sys['active' + upperCase + 'ID'] = null;
		
		return this;
	};
	/**
	 * update the active parameter (if the parameter is in the stack, it will be updated too)(has aliases, format: update + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {mixed} newVal — new value
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5]);
	 * // update collection
	 * db.updateCollection([1, 2]);
	 */
	C.prototype._update = function (stackName, newVal) {
		var
			active = this.dObj.active,
			sys = this.dObj.sys,
			
			activeID = this._getActiveID(stackName);
		
		// compile string if need
		if (C.find(stackName, ['filter', 'parser']) && this._exprTest(newVal)) {
			active[stackName] = this['_compile' + C.toUpperCase(stackName, 1)](newVal);
		
		// search the DOM (can take a string selector or an array of nodes)
		} else if (C.find(stackName, ['target', 'pager']) && C.isString(newVal)) {
			active[stackName] = this.drivers.dom.find.apply(this.drivers.dom, C.isArray(newVal) ? newVal : [newVal]);
		} else { active[stackName] = C.expr(newVal, active[stackName] || ''); }
		
		// update the parameter stack
		if (activeID) { sys['tmp' + C.toUpperCase(stackName, 1)][activeID] = active[stackName]; }

		return this;
	};
	/**
	 * get the parameter from the stack (if you specify a constant to 'active ', then returns the active parameter)(has aliases, format: get + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} [id=this.ACTIVE] — stack ID
	 * @throw {Error}
	 * @return {mixed}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5]);
	 *
	 * // get collection
	 * db.getCollection();
	 *
	 * db.pushCollection('test', [1, 2]);
	 * // get from stack
	 * db.getCollection('test');
	 */
	C.prototype._get = function (stackName, id) {
		if (id && id !== this.ACTIVE) {
			// throw an exception if the requested parameter does not exist
			if (!this._exists(stackName, id)) { throw new Error('the object "' + id + '" -> "' + stackName + '" doesn\'t exist in the stack!'); }
			
			return this.dObj.sys['tmp' + C.toUpperCase(stackName, 1)][id];
		}

		return this.dObj.active[stackName];
	};
	
	/**
	 * add one or more new parameters in the stack (if you specify as a parameter ID constant 'active ', it will apply the update method)(if the parameter already exists in the stack, it will be updated)(has aliases, format: push + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Plain Object} objID — stack ID or object (ID: value)
	 * @param {mixed} [newVal] — value (overload)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * // push collection
	 * db.pushCollection('test', [1, 2, 3]);
	 * db.pushCollection({
	 *	test1: [1, 2],
	 *	test2: [1, 2, 3, 4]
	 * });
	 */
	C.prototype._push = function (stackName, objID, newVal) {
		var
			tmp = this.dObj.sys['tmp' + C.toUpperCase(stackName, 1)],
			activeID = this._getActiveID(stackName),

			key;
		
		if (C.isPlainObject(objID)) {
			for (key in objID) {
				if (objID.hasOwnProperty(key)) {
					// update, if the ID is 'active'
					if (key === this.ACTIVE) {
						this._update(stackName, objID[key]);
					} else {
						
						// update the stack
						if (tmp[key] && activeID && activeID === key) {
							this._update(stackName, objID[key]);
						} else {
							
							// compile string if need
							if (C.find(stackName, ['filter', 'parser']) && this._exprTest(objID[key])) {
								tmp[key] = this['_compile' + C.toUpperCase(stackName, 1)](objID[key]);
							
							// search the DOM (can take a string selector or an array of nodes)
							} else if (C.find(stackName, ['target', 'pager']) && C.isString(objID[key])) {
								tmp[key] = this.drivers.dom.find.apply(this.drivers.dom, C.isArray(objID[key]) ? objID[key] : [objID[key]]);
							} else { tmp[key] = objID[key]; }
						}
						
					}
				}
			}
		} else {
			// update, if the ID is 'active'
			if (objID === this.ACTIVE) {
				this._update(stackName, newVal);
			} else {
				
				// update the stack
				if (tmp[objID] && activeID && activeID === objID) {
					this._update(stackName, newVal);
				} else {
					
					// compile string if need
					if (C.find(stackName, ['filter', 'parser']) && this._exprTest(newVal)) {
						tmp[objID] = this['_compile' + C.toUpperCase(stackName, 1)](newVal);
					
					// search the DOM (can take a string selector or an array of nodes)
					} else if (C.find(stackName, ['target', 'pager']) && C.isString(newVal)) {
						tmp[objID] = this.drivers.dom.find.apply(this.drivers.dom, C.isArray(newVal) ? newVal : [newVal]);
					} else { tmp[objID] = newVal; }
				}
			}
		}

		return this;
	};
	/**
	 * set the parameter stack active (affect the story)(has aliases, format: set + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} id — stack ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.pushCollection('test', [1, 2, 3]);
	 *
	 * // set collection
	 * db.setCollection('test');
	 */
	C.prototype._set = function (stackName, id) {
		var
			sys = this.dObj.sys,

			upperCase = C.toUpperCase(stackName, 1),
			tmpChangeControlStr = stackName + 'ChangeControl',
			tmpActiveIDStr = 'active' + upperCase + 'ID';
		
		// throw an exception if the requested parameter does not exist
		if (!this._exists(stackName, id)) { throw new Error('the object "' + id + '" -> "' + stackName + '" doesn\'t exist in the stack!'); }
		
		// change the story, if there were changes
		if (sys[tmpActiveIDStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIDStr] = id;
		} else { sys[tmpChangeControlStr] = false; }
		
		sys[stackName + 'Back'].push(id);
		this.dObj.active[stackName] = sys['tmp' + upperCase][id];

		return this;
	};
	/**
	 * back on the history of the stack (has aliases, format: back + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {Number} [nmb=1] — number of steps
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.setCollection('test')
	 *	.setCollection('test2')
	 *	.setCollection('test');
	 *
	 * db.backCollection(2); // 'test' is active
	 */
	C.prototype._back = function (stackName, nmb) {
		var
			sys = this.dObj.sys,

			upperCase = C.toUpperCase(stackName, 1),
			propBack = sys[stackName + 'Back'],

			pos = propBack.length - (nmb || 1) - 1;
		
		if (pos >= 0 && propBack[pos]) {
			if (sys['tmp' + upperCase][propBack[pos]]) {
				this._set(stackName, propBack[pos]);
				sys[stackName + 'ChangeControl'] = false;
				propBack.splice(pos + 1, propBack.length);
			}
		}

		return this;
	};
	/**
	 * back on the history of the stack, if there were changes (changes are set methods and pushSet)(has aliases, format: back + StackName + If)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {Number} [nmb=1] — number of steps
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.setCollection('test')
	 *	.setCollection('test2')
	 *	.setCollection('test');
	 *
	 * db.backCollectionIf().backCollectionIf(); // 'test2' is active, because the method of 'back' does not affect the story
	 */
	C.prototype._backIf = function (stackName, nmb) {
		if (this.dObj.sys[stackName + 'ChangeControl'] === true) { return this._back.apply(this, arguments); }

		return this;
	};
	/**
	 * remove the parameter from the stack (can use a constant 'active')(if the parameter is active, then it would still be removed)(has aliases, format: drop + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array|Plain Object} [objID=active] — stack ID or array of IDs
	 * @param {mixed} [deleteVal=false] — default value (for active properties)
	 * @param {mixed} [resetVal] — reset value (overload)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3]);
	 *
	 * db.dropCollection('test', 'active'); // removed the 'test' and' test2'
	 */
	C.prototype._drop = function (stackName, objID, deleteVal, resetVal) {
		deleteVal = typeof deleteVal === 'undefined' ? false : deleteVal;
		
		var
			active = this.dObj.active,
			sys = this.dObj.sys,
			
			upperCase = C.toUpperCase(stackName, 1),
			tmpActiveIDStr = 'active' + upperCase + 'ID',
			tmpTmpStr = 'tmp' + upperCase,

			activeID = this._getActiveID(stackName),
			tmpArray = !objID ? activeID ? [activeID] : [] : C.isArray(objID) || C.isPlainObject(objID) ? objID : [objID],
			
			key;
		
		if (tmpArray[0] && tmpArray[0] !== this.ACTIVE) {
			for (key in tmpArray) {
				if (tmpArray.hasOwnProperty(key)) {
					if (!tmpArray[key] || tmpArray[key] === this.ACTIVE) {
						if (typeof resetVal === 'undefined') {
							// if the parameter is on the stack, then remove it too
							if (activeID) { delete sys[tmpTmpStr][activeID]; }
							
							// active parameters are set to null
							sys[tmpActiveIDStr] = null;
							active[stackName] = deleteVal;
						
						// reset (overload)
						} else {
							if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
							active[stackName] = resetVal;
						}
					} else {
						if (typeof resetVal === 'undefined') {
							delete sys[tmpTmpStr][tmpArray[key]];
							
							// if the parameter stack is active, it will still be removed
							if (activeID && tmpArray[key] === activeID) {
								sys[tmpActiveIDStr] = null;
								active[stackName] = deleteVal;
							}
						
						// reset (overload)
						} else {
							sys[tmpTmpStr][tmpArray[key]] = resetVal;
							if (activeID && tmpArray[key] === activeID) { active[stackName] = resetVal; }
						}
					}
				}
			}
		} else {
			if (typeof resetVal === 'undefined') {
				// if the parameter is on the stack, then remove it too
				if (activeID) { delete sys[tmpTmpStr][activeID]; }
				
				// active parameters are set to null
				sys[tmpActiveIDStr] = null;
				active[stackName] = deleteVal;
			
			// reset (overload)
			} else {
				if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
				active[stackName] = resetVal;
			}
		}

		return this;
	};
	/**
	 * reset the parameter stack (can use a constant 'active')(has aliases, format: reset + StackName, only for: filter, parser and context)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array|Plain Object} [objID=active] — stack ID or array of IDs
	 * @param {mixed} [resetVal=false] — reset value
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.newContext('a > 2')
	 *
	 * // reset context
	 * db.resetContext();
	 */
	C.prototype._reset = function (stackName, objID, resetVal) {
		resetVal = typeof resetVal === 'undefined' ? false : resetVal;

		return this._drop(stackName, objID || '', '', resetVal);
	};
	/**
	 * reset the value of the parameter stack to another (can use a constant 'active')(has aliases, format: reset + StackName + To)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array} [objID=active] — stack ID or array of IDs
	 * @param {String} [id=this.ACTIVE] — source stack ID (for merge)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.pushCollection({test: [1, 2], test2: [1, 2, 3, 4]});
	 *
	 * // reset collection 'test' to 'test2'
	 * db.resetCollectionTo('test', 'test2');
	 */
	C.prototype._resetTo = function (stackName, objID, id) {
		var mergeVal = !id || id === this.ACTIVE ? this.dObj.active[stackName] : this.dObj.sys['tmp' + C.toUpperCase(stackName, 1)][id];
		
		return this._reset(stackName, objID || '', mergeVal);
	};

	/**
	 * verify the existence of a parameter on the stack (has aliases, format: exists + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} [id=this.ACTIVE] — stack ID
	 * @return {Boolean}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * db.existsCollection('test'); // returns false
	 */
	C.prototype._exists = function (stackName, id) {
		var upperCase = C.toUpperCase(stackName, 1);
		
		if ((!id || id === this.ACTIVE) && this._getActiveID(stackName)) { return true; }
		if (typeof this.dObj.sys['tmp' + upperCase][id] !== 'undefined') { return true; }

		return false;
	};
	/**
	 * return the ID of the active parameter or false (has aliases, format: get + StackName + ActiveID)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @return {String|Null}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * db.getCollectionActiveID(); // returns false
	 */
	C.prototype._getActiveID = function (stackName) {
		return this.dObj.sys['active' + C.toUpperCase(stackName, 1) + 'ID'];
	};
	/**
	 * check the parameter on the activity (has aliases, format: active + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} id — stack ID
	 * @return {Boolean}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * db.activeCollection('test'); // returns false
	 */
	C.prototype._active = function (stackName, id) {
		// overload, returns active ID
		if (!id) { return this._getActiveID(stackName); }
		if (id === this._getActiveID(stackName)) { return true; }

		return false;
	};
	
	/////////////////////////////////
	//// assembly
	/////////////////////////////////
			
	/**
	 * use the assembly (makes active the stacking options, if such exist (supports namespaces))
	 * 
	 * @this {Colletion Object}
	 * @param {String} stack ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * db.use('test');
	 * db.use('test.a');
	 * db.use('testa.a.b');
	 */
	C.prototype.use = function (id) {
		this.stack.forEach(function (el) {
			var nm, tmpNm, i;
			
			if (this._exists(el, id)) {
				this._set(el, id);
			} else {
				nm = id.split(this.NAMESPACE_SEPARATOR);
				
				for (i = nm.length; (i -= 1) > -1;) {
					nm.splice(i, 1);
					tmpNm = nm.join(this.NAMESPACE_SEPARATOR);
					
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
	//// stack methods (aliases)
	/////////////////////////////////
		
	// generate aliases
	(function (data) {
		var fn = C.prototype, nm;
		
		data.forEach(function (el) {
			nm = C.toUpperCase(el, 1);
			
			fn['new' + nm] = function (nm) {
				return function (newParam) { return this._new(nm, newParam); };
			}(el);
			//
			fn['update' + nm] = function (nm) {
				return function (newParam) { return this._update(nm, newParam); };
			}(el);
			//
			fn['reset' + nm + 'To'] = function (nm) {
				return function (objID, id) { return this._resetTo(nm, objID, id); };
			}(el);	
			//
			fn['push' + nm] = function (nm) {
				return function (objID, newParam) { return this._push.apply(this, C.unshiftArguments(arguments, nm)); }
			}(el);
			//
			fn['set' + nm] = function (nm) {
				return function (id) { return this._set(nm, id); };
			}(el);
			//
			fn['pushSet' + nm] = function (nm) {
				return function (id, newParam) { return this._push(nm, id, newParam)._set(nm, id); };
			}(el);
			//
			fn['back' + nm] = function (nm) {
				return function (nmb) { return this._back(nm, nmb || ''); };
			}(el);	
			//
			fn['back' + nm + 'If'] = function (nm) {
				return function (nmb) { return this._backIf(nm, nmb || ''); };
			}(el);	
			//
			if (el === 'filter' || el === 'parser') {
				fn['drop' + nm] = function (nm) {
					return function () { return this._drop(nm, arguments); };
				}(el);	
			} else {
				fn['drop' + nm] = function (nm) {
					return function () { return this._drop(nm, arguments, null); };
				}(el);	
			}
			//
			if (el === 'filter' || el === 'parser') {
				fn['reset' + nm] = function (nm) {
					return function () { return this._reset(nm, arguments); };
				}(el);	
			} else if (el === 'page') {
				fn['reset' + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, 1); };
				}(el);	
			} else if (el === 'context') {
				fn['reset' + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, ''); };
				}(el);	
			}
			//
			fn['active' + nm] = function (nm) {
				return function (id) { return this._active(nm, id); };
			}(el);	
			//
			fn['exists' + nm] = function (nm) {
				return function (id) { return this._exists(nm, id || ''); };
			}(el);
			//
			fn['get' + nm + 'ActiveID'] = function (nm) {
				return function (id) { return this._getActiveID(nm); };
			}(el);
			//
			fn['get' + nm] = function (nm) {
				return function (id) { return this._get(nm, id || ''); };
			}(el);
		});
	})(C.prototype.stack);	
	/////////////////////////////////
	//// single methods (core)
	/////////////////////////////////
	
	/**
	 * set new value to element by link (in context)<br/>
	 * events: onSet
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] — additional context
	 * @param {mixed} value — new value
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 */
	C.prototype._setOne = function (context, value, id) {
		context = C.isExists(context) ? context.toString() : '';
		value = typeof value === 'undefined' ? '' : value;
		id = id || '';

		var activeContext = this._getActiveParam('context'), e;
		
		// events
		this.onSet && (e = this.onSet.apply(this, arguments));
		if (e === false) { return this; }
		
		// if no context
		if (!context && !activeContext) {
			if (id && id !== this.ACTIVE) {
				return this._push('collection', id, value);
			} else { return this._update('collection', value); }
		}
		C.byLink(this._get('collection', id), activeContext + C.CHILDREN + context, value);
	
		return this;
	};
	/**
	 * get element by link (in context)<br/>
	 * events: onSet
	 *
	 * @this {Colletion Object}
	 * @param {Context} [context] — additional context
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {mixed}
	 */
	C.prototype._getOne = function (context, id) {
		context = C.isExists(context) ? context.toString() : '';
		return C.byLink(this._get('collection', id || ''), this._getActiveParam('context') + C.CHILDREN + context);
	};	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to the collection (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} [cValue] — new element or context for sourceID
	 * @param {String} [propType='push'] — add type (constants: 'push', 'unshift') or property name (can use '->unshift' - the result will be similar to work for an array unshift)
	 * @param {String} [activeID=this.ACTIVE] — collection ID
	 * @param {String} [sourceID] — source ID (if move)
	 * @param {Boolean} [del=false] — if true, remove source element
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([]).pushCollection('test', {});
	 *
	 * // add a new element to the active collection
	 * db.add(1);
	 * // unshift
	 * db.add(2, 'unshift');
	 *
	 * // add a new element to the 'test'
	 * db.add(1, 'b', 'test');
	 * // unshift
	 * db.add(2, 'a->unshift', 'test');
	 * // without specifying the key name
	 * db.add(3, '', 'test'); // key == collection length
	 * db.add(4, 'unshift', 'test');
	 */
	C.prototype.add = function (cValue, propType, activeID, sourceID, del) {
		cValue = typeof cValue !== 'undefined' ? cValue : '';
		propType = propType || 'push';
		activeID = activeID || '';
		del = del || false;
		
		var cObj, sObj, lCheck, e;
		
		// events
		this.onAdd && (e = this.onAdd.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		cObj = C.byLink(this._get('collection', activeID), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object')  { throw new Error('unable to set property!'); }
		
		// simple add
		if (!sourceID) {
			// add type
			if (C.isPlainObject(cObj)) {
				propType = propType === 'push' ? this.length(cObj) : propType === 'unshift' ? this.length(cObj) + C.METHOD_SEPARATOR + 'unshift' : propType;
				lCheck = C.addElementToObject(cObj, propType.toString(), cValue);
			} else {
				lCheck = true;
				cObj[propType](cValue);
			}
		
		// move
		} else {
			cValue = C.isExists(cValue) ? cValue.toString() : '';
			sObj = C.byLink(this._get('collection', sourceID || ''), cValue);
			
			// add type
			if (C.isPlainObject(cObj)) {
				propType = propType === 'push' ? this.length(cObj) : propType === 'unshift' ? this.length(cObj) + C.METHOD_SEPARATOR + 'unshift' : propType;
				lCheck = C.addElementToObject(cObj, propType.toString(), sObj);
			} else {
				lCheck = true;
				cObj[propType](sObj);
			}
			
			// delete element
			if (del === true) { this.disable('context')._removeOne(cValue, sourceID).enable('context'); }
		}
		
		// rewrites links (if used for an object 'unshift')
		if (lCheck !== true) { this._setOne('', lCheck, activeID); }
	
		return this;
	};
	
	/**
	 * add new element to the collection (push)(in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj — new element
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([]).pushCollection('test', {});
	 * db.push(1);
	 * db.push(1, 'test'); // the key is always equal to the length of the collection
	 */
	C.prototype.push = function (obj, id) {
		return this.add(obj, '', id || '');
	};
	/**
	 * add new element to the collection (unshift)(in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj — new element
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([]).pushCollection('test', {});
	 * db.unshift(1);
	 * db.unshift(1, 'test'); // the key is always equal to the length of the collection
	 */
	C.prototype.unshift = function (obj, id) {
		return this.add(obj, 'unshift', id || '');
	};	
	/////////////////////////////////
	//// single methods (remove)
	/////////////////////////////////
		
	/**
	 * remove an one element from the collection by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] — link
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 */
	C.prototype._removeOne = function (context, id) {
		context = C.isExists(context) ? context.toString() : '';
		var activeContext = this._getActiveParam('context'), e;
		
		// events
		this.onRemove && (e = this.onRemove.apply(this, arguments));
		if (e === false) { return this; }
		
		// if no context
		if (!context && !activeContext) {
			this._setOne('', null);
		} else { C.byLink(this._get('collection', id || ''), activeContext + C.CHILDREN + context, '', true); }
	
		return this;
	};
	/**
	 * remove an elements from the collection by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext — link, array of links or object (collection ID: array of links)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 */
	C.prototype._remove = function (objContext, id) {
		id = id || '';
		var key, i;
		
		if (C.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if (C.isArray(objContext[key])) {
						for (i = objContext[key].length; (i -= 1) > -1;) {
							this._removeOne(objContext[key][i], key);
						}
					} else { this._removeOne(objContext[key], key); }
				}
			}
		} else if (C.isArray(objContext)) {
			for (i = objContext.length; (i -= 1) > -1;) { this._removeOne(objContext[i], id); }
		} else { this._removeOne(objContext, id); }
	
		return this;
	};
	
	/**
	 * remove an element from the collection (pop)(in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3]).pushCollection('test', {a: 1, b: 2});
	 * db.pop();
	 * db.pop('test');
	 */
	C.prototype.pop = function (id) { return this._removeOne('eq(-1)', id || ''); };
	/**
	 * remove an element from the collection (shift)(in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3]).pushCollection('test', {a: 1, b: 2});
	 * db.shift();
	 * db.shift('test');
	 */
	C.prototype.shift = function (id) { return this._removeOne('eq(0)', id || ''); };	
	/////////////////////////////////
	//// single methods (concatenation)
	/////////////////////////////////
	
	/**
	 * concatenation of collections (in context)<br/>
	 * events: onConcat
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj — collection
	 * @param {Context} [context] — additional context
	 * @param {String} [id=this.ACTIVE] — collection ID, which is the concatenation
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3]).pushCollection('test', {a: 1, b: 2});
	 * db.concat([4, 5, 6]); // [1, 2, 3, 4, 5, 6]
	 * db.concat({c: 3, d: 4}, '', 'test'); // {a: b, b: 2, c: 3, d: 4}
	 */
	C.prototype.concat = function (obj, context, id) {
		context = C.isExists(context) ? context.toString() : '';
		id = id || '';
		
		var cObj, e;	
		
		// events
		this.onConcat && (e = this.onConcat.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		cObj = C.byLink(this._get('collection', id), this._getActiveParam('context') + C.CHILDREN + context);
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!') }
		
		if (C.isPlainObject(cObj)) {
			C.extend(true, cObj, obj)
		} else if (C.isArray(cObj)) {
			if (C.isArray(obj)) {
				cObj = Array.prototype.concat(cObj, obj);
				this._setOne(context, cObj, id);
			} else { this.add(obj, 'push', id); }
		}
	
		return this;
	};	
	/////////////////////////////////
	//// mult methods (core)
	/////////////////////////////////
	
	/**
	 * returns the length of the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Collection|Boolean} [filter=this.ACTIVE] — filter function, string expression, collection or true (if disabled)
	 * @param {String|Collection} [id=this.ACTIVE] — collection ID or collection
	 * @throw {Error}
	 * @return {Number}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.length(); // returns 6
	 * db.length(':i % 3 === 0'); // returns 2
	 */
	C.prototype.length = function (filter, id) {
		filter = filter || '';
		var
			tmpObj = {},
			cObj, aCheck, key, cOLength;
		
		// overload
		// if the filter is a collection
		if (!C.isFunction(filter)) {
			if ((C.isString(filter) && !this._filterTest(filter) && !C.isExists(id)) || C.isCollection(filter)) {
				id = filter;
				filter = false;
			}
		}
		
		// overloads
		// if the ID is not specified, it is taken active collection
		if (!id) {
			cObj = this._get('collection');
		} else if (C.isString(id)) {
			cObj = this._get('collection', id);
		} else {
			aCheck = true;
			cObj = id;
		}
		
		// if cObj is null
		if (cObj === null) { return 0; }
		// if cObj is collection
		if (aCheck !== true) { cObj = C.byLink(cObj, this._getActiveParam('context')); }
		
		// if cObj is String
		if (C.isString(cObj)) { return cObj.length; }
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!'); }
		
		// if no filter and the original object is an array
		if (filter === false && typeof cObj.length !== 'undefined') {
			cOLength = cObj.length;
		} else {
			// calclate length
			cOLength = 0;
			// if array
			if (typeof cObj.length !== 'undefined') {
				cObj.forEach(function (el, i, obj) {
					if (this._customFilter(filter, el, i, cObj, cOLength || null, this, id ? id : this.ACTIVE, tmpObj) === true) {
						cOLength += 1;
					}
				}, this);
			// if plain object
			} else {
				for (key in cObj) {
					if (!cObj.hasOwnProperty(key)) { continue; }
					
					if (this._customFilter(filter, cObj[key], key, cObj, cOLength || null, this, id ? id : this.ACTIVE, tmpObj) === true) {
						cOLength += 1;
					}
				}
			}
		}
		
		// remove the temporary filter
		tmpObj.name && this._drop('filter', '__tmp:' + tmpObj.name);
		
		return cOLength;
	};
	/**
	 * forEach method (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback — function to test each element of the collection
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String|Boolean} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: 0)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: 0)
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * // increase on 1 all elements of multiples of three
	 * db.forEach(function (el, i, data) { data[i] += 1; }, ':i % 3 === 0');
	 */
	C.prototype.forEach = function (callback, filter, id, mult, count, from, indexOf) {
		filter = filter || '';
		
		// if id is Boolean
		if (C.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		} else { id = id || ''; }
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			self = this,
			tmpObj = {},
		
			cObj, cOLength,
			cloneObj,
	
			i, j = 0, res = false;
		
		// get by link
		cObj = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!'); }
		
		// length function
		/** @private */
		cOLength = function () {
			if (!cOLength.val) { cOLength.val = self.length(filter, id); }
			
			return cOLength.val;
		};
		
		
		if (C.isArray(cObj)) {
			// cut off the array to indicate the start
			if (indexOf !== false) {
				cloneObj = cObj.slice(indexOf);
			} else { cloneObj = cObj; }
			
			cloneObj.some(function (el, i, obj) {
				i += indexOf;
				if (count !== false && j === count) { return true; }
					
				if (this._customFilter(filter, el, i, cObj, cOLength, this, id, tmpObj) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {
						res = callback.call(callback, el, i, cObj, cOLength, this, id) === false;
						if (mult === false) { res = true; }
						j += 1;
					}
				}
				
				if (res === true) { return true; }
			}, this);
		} else {
			for (i in cObj) {
				if (!cObj.hasOwnProperty(i)) { continue; }
					
				if (count !== false && j === count) { break; }
				if (indexOf !== false && indexOf !== 0) { indexOf -= 1; continue; }
				
				if (this._customFilter(filter, cObj[i], i, cObj, cOLength, this, id, tmpObj) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {	
						res = callback.call(callback, cObj[i], i, cObj, cOLength, this, id) === false;
						if (mult === false) { res = true; }
						j += 1;
					}
				}
				
				if (res === true) { break; }
			}
		}
		
		// remove the temporary filter
		tmpObj.name && this._drop('filter', '__tmp:' + tmpObj.name);
		
		cOLength = null;
		
		return this;
	};
	/**
	 * performs an action only for one element of the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback — function to test each element of the collection
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * // increase on 1 one element of multiples of three
	 * db.some(function (el, i, data) { data[i] += 1; }, ':i % 3 === 0');
	 */
	C.prototype.some = function (callback, filter, id) {
		return this.forEach(callback, filter || '', id || '', false);
	};	
	/////////////////////////////////
	//// mult methods (search)
	/////////////////////////////////
	
	/**
	 * search for elements using filter (returns a reference to elements)(in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Number|Array}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.search(':i % 3 === 0');
	 * db.search(function (el, i, data) { return i % 3 === 0; });
	 */
	C.prototype.search = function (filter, id, mult, count, from, indexOf) {
		// if id is Boolean (overload)
		if (C.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		} else { id = id || ''; }
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			result = mult === true ? [] : -1,
			
			/** @private */
			action = function (el, i, data, aLength, self, id) {
				if (mult === true) {
					result.push(i);
				} else { result = i; }
				
				return true;
			};
		
		this.forEach(action, filter || '', id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * search for one element using filter (returns a reference to element)(in context)
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Number|Array}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.searchOne(':i % 3 === 0');
	 * db.searchOne(function (el, i, data) { return i % 3 === 0; });
	 */
	C.prototype.searchOne = function (filter, id) {
		return this.search(filter || '', id || '', false);
	};
	
	/**
	 * returns the first index/key at which a given element can be found in the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement — element to locate in the array
	 * @param {fromIndex} [fromIndex=0] — the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Number|String}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
	 * db.indexOf(1); // returns 0
	 * db.indexOf(1, 2); // returns 6
	 */
	C.prototype.indexOf = function (searchElement, fromIndex, id) {
		id = id || '';
		fromIndex = fromIndex || '';
		
		var cObj = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		if (C.isArray(cObj) && cObj.indexOf) {
			if (fromIndex) { return cObj.indexOf(searchElement, fromIndex); }
			
			return cObj.indexOf(searchElement);
		} else { return this.search(function (el) { return el === searchElement; }, id, false, '', '', fromIndex); }
	};
	/**
	 * returns the last index/key at which a given element can be found in the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement — element to locate in the array
	 * @param {fromIndex} [fromIndex=0] — the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Number|String}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
	 * db.lastIndexOf(1); // returns 6
	 * db.lastIndexOf(1, 2); // returns -1
	 */
	C.prototype.lastIndexOf = function (searchElement, fromIndex, id) {
		id = id || '';
		fromIndex = fromIndex || '';
		
		var el, cObj = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		if (C.isArray(cObj) && cObj.lastIndexOf) {
			if (fromIndex) { return cObj.lastIndexOf(searchElement, fromIndex); }
			
			return cObj.lastIndexOf(searchElement);
		} else {
			el = this.search(function (el) { return el === searchElement; }, id, '', '', '', fromIndex);
			
			return typeof el[el.length - 1] !== 'undefined' ? el[el.length - 1] : -1;
		}
	};	
	/////////////////////////////////
	//// mult methods (get)
	/////////////////////////////////
	
	/**
	 * get the elements using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {mixed}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.get('eq(-1) > c');
	 * db.get(':i % 3 === 0');
	 * db.get(function (el, i, data) { return i % 3 === 0; });
	 */
	C.prototype.get = function (filter, id, mult, count, from, indexOf) {
		// overload
		if (C.isNumber(filter) || (arguments.length < 2 && C.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 2 && filter === false)) {
				return this._getOne(filter, id || '');
			}
	
		// if id is Boolean (overload)
		if (C.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		} else { id = id || ''; }
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			result = mult === true ? [] : -1,
			
			/** @private */
			action = function (el, i, data, aLength, self, id) {
				if (mult === true) {
					result.push(data[i]);
				} else { result = data[i]; }
	
				return true;
			};
		
		this.forEach(action, filter || '', id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * get the one element using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] — filter function, string expression or context (overload)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {mixed}
	 	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.getOne('eq(-1) > c');
	 * db.getOne(':i % 3 === 0');
	 * db.getOne(function (el, i, data) { return i % 3 === 0; });
	 */
	C.prototype.getOne = function (filter, id) {
		return this.get(filter || '', id || '', false);
	};
	/////////////////////////////////
	//// mult methods (set)
	/////////////////////////////////
	
	/**
	 * set new value of the elements (in context)<br/>
	 * events: onSet
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {mixed} replaceObj — replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}]);
	 * db.set('eq(-1) > c', 4);
	 * db.set(':i == 3', {c: 5});
	 * db.set(function (el, i, data) { return i == 3; }, {c: 6});
	 * db.set(function (el, i, data) { return i == 3; }, function (el) { el.c = 7; });
	 */
	C.prototype.set = function (filter, replaceObj, id, mult, count, from, indexOf) {
		// overload
		if (C.isNumber(filter) || (arguments.length < 3 && C.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 3 && filter === false)) {
				return this._setOne(filter, replaceObj, id || '');
			}
		
		var
			e, arg, replaceCheck = C.isFunction(replaceObj),
			
			/** @private */
			action = function (el, i, data, cOLength, cObj, id) {
				if (replaceCheck) {
					data[i] = replaceObj.call(replaceObj, el, i, data, cOLength, cObj, id);
				} else { data[i] = C.expr(replaceObj, data[i]); }
	
				return true;
			};
		
		arg = C.unshiftArguments(arguments, action);
		arg.splice(2, 1);
		
		// events
		this.onSet && (e = this.onSet.apply(this, arguments));
		if (e === false) { return this; }
		
		return this.forEach.apply(this, arg);
	};
	/**
	 * set new value of the one element (in context)<br/>
	 * events: onSet
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {mixed} replaceObj — replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.setOne('eq(-1) > c', 4);
	 * db.setOne(':i % 3 === 0', {c: 5});
	 * db.setOne(function (el, i, data) { return i % 3 === 0; }, {c: 6});
	 * db.setOne(function (el, i, data) { return i % 3 === 0; }, function (el) { el.c = 7; });
	 */
	C.prototype.setOne = function (filter, replaceObj, id) {
		return this.set(filter || '', replaceObj, id || '', false);
	};
	
	/**
	 * pass each element in the current matched set through a function (in context)<br/>
	 * events: onSet
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} replaceObj — a function that will be invoked for each element in the current set
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6]);
	 * //replace each even-numbered element on the value of the sine
	 * db.map(Math.sin, ':el % 2 === 0');
	 */
	C.prototype.map = function (replaceObj, filter, id) {
		return this.set(filter || '', replaceObj, id || '');
	};
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String} [moveFilter] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {Context} [context] — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of transfers (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @param {Boolean} [deleteType=true] — if true, remove source element
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}]).pushCollection('test', []);
	 * db.move(':i % 2 !== 0', '', 'active', 'test');
	 */
	C.prototype.move = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, deleteType) {
		moveFilter = moveFilter || '';
		deleteType = deleteType === false ? false : true;
		context = C.isExists(context) ? context.toString() : '';
		
		sourceID = sourceID || '';
		activeID = activeID || '';
		
		addType = addType || 'push';
		
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			deleteList = [],
			aCheckType = C.isArray(C.byLink(this._get('collection', activeID), this._getActiveParam('context'))),
	
			elements, e = null;
		
		// events
		deleteType && this.onMove && (e = this.onMove.apply(this, arguments));
		!deleteType  && this.onCopy && (e = this.onCopy.apply(this, arguments));
		if (e === false) { return this; }
		
		// search elements
		this.disable('context');
		
		if (C.isNumber(moveFilter) || (C.isString(moveFilter) && !this._filterTest(moveFilter))) {
			elements = moveFilter;
		} else { elements = this.search(moveFilter, sourceID, mult, count, from, indexOf); }
		
		this.enable('context');
		
		// move
		if (mult === true && C.isArray(elements)) {
			elements.forEach(function (el) {
				this.add(context + C.CHILDREN + el, aCheckType === true ? addType : el + C.METHOD_SEPARATOR + addType, activeID, sourceID);
				deleteType === true && deleteList.push(el);
			}, this);
		} else {
			this.add(context + C.CHILDREN + elements, aCheckType === true ? addType : elements + C.METHOD_SEPARATOR + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
		
		// delete element
		if (deleteType === true) { this.disable('context')._remove(deleteList, sourceID).enable('context'); }
	
		return this;
	},
	/**
	 * move one element from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String} [moveFilter] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}]).pushCollection('test', []);
	 * db.moveOne(':i % 2 !== 0', '', 'active', 'test');
	 */
	C.prototype.moveOne = function (moveFilter, context, sourceID, activeID, addType) {
		return this.move(moveFilter || '', C.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || '', false);
	};
	/**
	 * copy elements from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String} [moveFilter] — filter function, string expression or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of copies (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}]).pushCollection('test', []);
	 * db.copy(':i % 2 !== 0', '', 'active', 'test');
	 */
	C.prototype.copy = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf) {
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		return this.move(moveFilter || '', C.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || 'push', mult, count, from, indexOf, false);
	};
	/**
	 * copy one element from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String} [moveFilter] — filter function, string expression or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}]).pushCollection('test', []);
	 * db.copyOne(':i % 2 !== 0', '', 'active', 'test');
	 */
	C.prototype.copyOne = function (moveFilter, context, sourceID, activeID, addType) {
		return this.move(moveFilter || '', C.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || '', false, '', '', '', false);
	};	
	/////////////////////////////////
	//// mult methods (remove)
	/////////////////////////////////
	
	/**
	 * remove an elements from the collection using filter or by link (in context)<br/>
	 * events: onRemove
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of deletions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}]);
	 * db.remove('eq(-1) > c');
	 * db.remove(':i == 2');
	 * db.remove(function (el, i, data) { return i == 1; });
	 */
	C.prototype.remove = function (filter, id, mult, count, from, indexOf) {
		// overload
		if (C.isNumber(filter) || (arguments.length < 2 && C.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 2 && filter === false)) {
				return this._removeOne(filter, id || '');
			} else if (C.isArray(filter) || C.isPlainObject(filter)) { return this._remove(filter, id || ''); }
		
		var elements = this.search.apply(this, arguments), i = elements.length;
		
		if (!C.isArray(elements)) {
			this._removeOne(elements, id);
		} else {
			while ((i -= 1) > -1) { this._removeOne(elements[i], id); }
		}
	
		return this;
	};
	/**
	 * remove an one element from the collection using filter or by link (in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] — filter function, string expression or context (overload)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}]);
	 * db.removeOne(':i % 2 !== 0');
	 * db.removeOne(function (el, i, data) { return i % 2 !== 0; });
	 */
	C.prototype.removeOne = function (filter, id) {
		return this.remove(filter || '', id || '', false);
	};	
	/////////////////////////////////
	//// mult methods (group)
	/////////////////////////////////
	
	/**
	 * group the elements on the field or condition (the method returns a new collection) (in context)
	 *  
	 * @this {Colletion Object}
	 * @param {Context|Expression|Function} [field] — field name, string expression or callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @param {Boolean} [link=false] — save link
	 * @return {Colletion}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
	 * db.group();
	 * // group all the even-numbered elements
	 * db.group(':el % 2 === 0');
	 */
	C.prototype.group = function (field, filter, id, count, from, indexOf, link) {
		field = this._exprTest((field = field || '')) ? this._compileFilter(field) : field;
		id = id || '';
		link = link || false;
	
		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			fieldType = C.isString(field),
			result = {},
			
			/** @private */
			action = function (el, i, data, aLength, self, id) {
				var param = fieldType ? C.byLink(el, field) : field.apply(field, arguments);
				
				if (!result[param]) {
					result[param] = [!link ? el : i];
				} else { result[param].push(!link ? el : i); }
	
				return true;
			};
		
		this.forEach(action, filter, id, '', count, from, indexOf);
	
		return result;
	};
	/**
	 * group the elements on the field or condition (the method returns a new collection of references to elements in the original collection)(in context)
	 *  
	 * @this {Colletion Object}
	 * @param {Context|Expression|Function} [field] — field name, string expression or callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
	 * db.group();
	 * // group all the even-numbered elements
	 * db.group(':el % 2 === 0');
	 */
	C.prototype.groupLinks = function (field, filter, id, count, from, indexOf) {
		return this.group(field || '', filter || '', id || '', count || '', from || '', indexOf || '', true);
	};		
	/////////////////////////////////
	//// statistic methods
	/////////////////////////////////
	
	/**
	 * get statistic information
	 *  
	 * @this {Colletion Object}
	 * @param {String|Function} [oper='count'] — operation type ('count', 'avg', 'summ', 'max', 'min', 'first', 'last'), string operator (+, -, *, /) or callback function
	 * @param {Context} [field] — field name
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.stat('count');
	 * db.stat('min');
	 */
	C.prototype.stat = function (oper, field, filter, id, count, from, indexOf) {
		oper = oper || 'count';
		id = id || '';
	
		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			operType = C.isString(oper),
			result = 0, tmp = 0, key,
			
			/** @private */
			action = function (el, i, data, aLength, self, id) {
				var param = C.byLink(el, field || '');
				
				switch (oper) {
					case 'count' : {
						result += 1;
					} break;
					case 'summ' : {
						result += param;
					} break;
					case 'avg' : {
						tmp += 1;
						result += param;
					} break;
					case 'max' : {
						if (param > result) { result = param; }
					} break;
					case 'min' : {
						if (tmp === 0) {
							result = param;
							tmp = 1;
						} else if (param < result) { result = param; }
					} break;
					default : {
						if (!operType) {
							result = oper(param, result);
						} else {
							if (tmp === 0) {
								result = param;
								tmp = 1;
							} else { result = C.expr(oper + '=' + param, result); }
						}
					}
				}
					
				return true;
			};
		
		if (oper !== 'first' && oper !== 'last') {
			this.forEach(action, filter || '', id, '', count, from, indexOf);
			
			if (oper === 'avg') { result /= tmp; }
		} else if (oper === 'first') {
			result = this._getOne(C.ORDER[0] + '0' + C.ORDER[1]);
		} else { result = this._getOne(C.ORDER[0] + '-1' + C.ORDER[1]); }
	
		return result;
	};	
	/////////////////////////////////
	//// statistic methods (group)
	/////////////////////////////////
	
	/**
	 * get statistic information for group
	 *  
	 * @this {Colletion Object}
	 * @param {String|Function} [oper='count'] — operation type ('count', 'avg', 'summ', 'max', 'min', 'first', 'last'), string operator (+, -, *, /) or callback function
	 * @param {Context} [field] — field name
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.pushSetCollection('test', db.group(':el % 2 === 0'));
	 * db.groupStat('count');
	 * db.groupStat('min');
	 */
	C.prototype.groupStat = function (oper, field, filter, id, count, from, indexOf) {
		oper = oper || 'count';
		id = id || '';

		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			operType = C.isString(oper),
			result = {}, tmp = {}, key,
			
			/** @private */
			deepAction = function (el, i, data, aLength, self, id) {
				var param = C.byLink(el, field || '');
				
				switch (oper) {
					case 'count' : {
						result[this.i] += 1;
					} break;
					case 'summ' : {
						result[this.i] += param;
					} break;
					case 'avg' : {
						tmp[this.i] += 1;
						result[this.i] += param;
					} break;
					case 'max' : {
						if (param > result[this.i]) { result[this.i] = param; }
					} break;
					case 'min' : {
						if (tmp[this.i] === 0) {
							result[this.i] = param;
							tmp[this.i] = 1;
						} else if (param < result[this.i]) { result[this.i] = param; }
					} break;
					default : {
						if (!operType) {
							result[this.i] = oper(param, result[this.i]);
						} else {
							if (tmp[this.i] === 0) {
								result[this.i] = param;
								tmp[this.i] = 1;
							} else { result[this.i] = C.expr(oper + '=' + param, result[this.i]); }
						}
					}
				}
					
				return true;
			},
			
			/** @private */
			action = function (el, i, data, aLength, self, id) {
				if (!result[i]) { result[i] = tmp[i] = 0; };
				
				if (oper !== 'first' && oper !== 'last') {
					self
						._update('context', '+=' + C.CHILDREN + (deepAction.i = i))
						.forEach(deepAction, filter || '', id, '', count, from, indexOf)
						.parent();
				} else if (oper === 'first') {
					result[i] = C.byLink(el, C.ORDER[0] + '0' + C.ORDER[1]);
				} else { result[i] = C.byLink(el, C.ORDER[0] + '-1' + C.ORDER[1]); }
					
				return true;
			};
		
		this.forEach(action, '', id);
		
		if (oper === 'avg') {
			for (key in result) {
				if (!result.hasOwnProperty(key)) { continue; }
				result[key] /= tmp[key];
			}
		}
	
		return result;
	};		
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * sort object
	 * 
	 * @this {Collection}
	 * @param {Object} obj — some object
	 * @param {Context} field — field name
	 * @param {Function} sort — sort function
	 * @return {Object}
	 */
	C._sortObject = function (obj, field, sort) {
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
		sortedValues.sort(sort);
		
		for (key in sortedValues) {
			if (sortedValues.hasOwnProperty(key)) { sortedObj[sortedValues[key].key] = sortedValues[key].value; }
		}
		
		return sortedObj;
	};
	
	/**
	 * sort the object by the key
	 * 
	 * @this {Collection}
	 * @param {Object} obj — some object
	 * @param {Function} sort — sort function
	 * @return {Object}
	 */
	C._sortObjectByKey = function (obj, sort) {
		var
			sortedKeys = [],
			sortedObj = {},
			key;
		
		for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
		sortedKeys.sort(sort);
		
		for (key in sortedKeys) {
			if (sortedKeys.hasOwnProperty(key)) { sortedObj[sortedKeys[key]] = obj[sortedKeys[key]]; }
		}

		return sortedObj;
	};
	
	/**
	 * sort collection (in context)<br />
	 * events: onSort
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [field] — field name
	 * @param {Boolean} [rev=false] — reverce (contstants: 'shuffle' — random order)
	 * @param {Function|Boolean} [fn=toUpperCase] — callback function (false if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([
	 *	{name: 'Andrey', age: 22},
	 *	{name: 'John', age: 19},
	 *	{name: 'Bon', age: 25},
	 *	{name: 'Bill', age: 15}
	 * ]);
	 * // sort by name
	 * db.sort('name');
	 * // sort by age (reverse)
	 * db.sort('age', true);
	 */
	C.prototype.sort = function (field, rev, fn, id) {
		field = field || '';
		rev = rev || false;
		fn = fn && fn !== true ? fn === false ? '' : fn : function (a) {
			if (C.isString(a)) { return a.toUpperCase(); }
			
			return a;
		};
		id = id || '';
		
		var
			self = this,
			cObj,
			
			/** @private */
			sort = function (a, b) {
				var r = rev ? -1 : 1;
				
				// sort by field
				if (field) {
					a = C.byLink(a, field);
					b = C.byLink(b, field);
				}
				// callback function
				if (fn) {
					a = fn(a);
					b = fn(b);
				}
				
				if (rev !== self.SHUFFLE) {	
					if (a < b) { return r * -1; }
					if (a > b) { return r; }
					
					return 0;
				
				// random sort
				} else { return Math.round(Math.random() * 2  - 1); }
			}, e;
		
		// events
		this.onSort && (e = this.onSort.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		cObj = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!'); }

		if (C.isArray(cObj)) {
			cObj.sort(sort);
		} else {
			if (field) {
				// change the field to sort the object
				field = field === true ? 'value' : 'value' + C.CHILDREN + field;
				cObj = C._sortObject(cObj, field, sort);
			} else { cObj = C._sortObjectByKey(cObj, sort); }
			
			this._setOne('', cObj, id);
		}
		
		return this;
	};	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * reverse object
	 * 
	 * @this {Collection}
	 * @param {Object} obj — some object
	 * @return {Object}
	 */
	C._reverseObject = function (obj) {
		var
			sortedKeys = [],
			sortedObj = {},
			key;
		
		for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
		sortedKeys.reverse();
		
		for (key in sortedKeys) {
			if (sortedKeys.hasOwnProperty(key)) { sortedObj[sortedKeys[key]] = obj[sortedKeys[key]]; }
		}

		return sortedObj;
	};
	
	/**
	 * reverse collection (in context)<br />
	 * events: onReverse
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.reverse();
	 */
	C.prototype.reverse = function (id) {
		id = id || '';
		
		var cObj, e;
		
		// events
		this.onReverse && (e = this.onReverse.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		cObj = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!'); }
		
		if (C.isArray(cObj)) {
			cObj.reverse();
		} else { this._setOne('', C._reverseObject(cObj), id); }
		
		return this;
	};	
	/////////////////////////////////
	//// local storage
	/////////////////////////////////
	
	/**
	 * save collection in the DOM storage<br/>
	 * events: onSave
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.save();
	 */
	C.prototype.save = function (id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id || this.ACTIVE;
		var
			name = '__' + this.name + '__' + this._get('namespace'),
			
			active = id === this.ACTIVE ? this._exists('collection') ? this._getActiveID('collection') : '' : this._active('collection', id) ? 'active' : '',
			storage = local === false ? sessionStorage : localStorage,
			e = null;
		
		// events
		this.onSave && (e = this.onSave.apply(this, arguments));
		if (e === false) { return this; }
		
		storage.setItem(name + ':' + id, this.toString(id));
		storage.setItem(name + '__date:' + id, new Date().toString());
		storage.setItem(name + '__active:' + id, active);
		
		storage.setItem(name + '__date', new Date().toString());
		
		return this;
	};
	/**
	 * save all collections in the DOM storage<br/>
	 * events: onSave
	 * 
	 * @this {Colletion Object}
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 7, 0]).pushCollection('test', [1, 2, 3]);
	 * db.saveAll();
	 */
	C.prototype.saveAll = function (local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		local = local === false ? local : true;
		var
			key,
			tmp = this.dObj.sys.tmpCollection,
			active = false;
		
		for (key in tmp) {
			this._active('C', key) && (active = true);
			if (tmp.hasOwnProperty(key)) { this.save(key, local); }
		}
		active === false && this.save('', local);
		
		return this;
	};
	
	/**
	 * load collection from the DOM storage<br/>
	 * events: onLoad
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {String} [local=true] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C().load();
	 */
	C.prototype.load = function (id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id || this.ACTIVE;
		var
			name = '__' + this.name + '__' + this._get('namespace'),
			
			active,
			storage = local === false ? sessionStorage : localStorage,
			e = null;
		
		// events
		this.onLoad && (e = this.onLoad.apply(this, arguments));
		if (e === false) { return this; }
		
		if (id === this.ACTIVE) {
			this._new('collection', JSON.parse(storage.getItem(name + ':' + id)));
		} else { this._push('collection', id, JSON.parse(storage.getItem(name + ':' + id))); }
		
		active = storage.getItem(name + '__active:' + id);
		if (active === this.ACTIVE) {
			this._set('collection', id);
		} else if (active) {
			this
				._push('collection', active, this._get('collection'))
				._set('collection', active);
		}
		
		return this;
	};
	/**
	 * load all collections from the DOM storage<br/>
	 * events: onLoad
	 * 
	 * @this {Colletion Object}
	 * @param {String} [local] — if false, used session storage
	 * @param {String} [type='load'] — operation type
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C().loadAll();
	 */
	C.prototype.loadAll = function (local, type) {
		type = type ? 'drop' : 'load';
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		local = local === false ? local : true;
		var
			name = '__' + this.name + '__' + this._get('namespace'),
			
			storage = local === false ? sessionStorage : localStorage,
			sLength = storage.length,
			key, id;
		
		// bug fix
		try {
			for (key in storage) {
				if (storage.hasOwnProperty(key)) {
					if ((id = key.split(':'))[0] === name) { this[type](id[1], local); }
				}
			}
		} catch (e) {
			while ((sLength -= 1) > -1) {
				if ((id = storage[sLength].split(':'))[0] === name) { this[type](id[1], local); }
			}
		}
		
		return this;
	};
	/**
	 * get the time of the conservation of collections
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id] — collection ID
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Date}
	 *
	 * @example
	 * var db = new $C();
	 * db.loadDate();
	 */
	C.prototype.loadDate = function (id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id ? ':' + id : '';
		var storage = local === false ? sessionStorage : localStorage;
		
		return new Date(storage.getItem('__' + this.name + '__' + this._get('namespace') + '__date' + id));
	};
	/**
	 * checking the life of the collection
	 * 
	 * @this {Colletion Object}
	 * @param {Number} time — milliseconds
	 * @param {String} [id] — collection ID
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Boolean}
	 *
	 * @example
	 * var db = new $C();
	 * db.isExpired();
	 */
	C.prototype.isExpired = function (time, id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		return new Date(new Date() - new Date(this.loadDate(id || '', local || ''))) > time;
	};
	
	/**
	 * remove collection from the DOM storage<br/>
	 * events: onDrop
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.drop('test');
	 */
	C.prototype.drop = function (id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id || this.ACTIVE;
		var
			name = '__' + this.name + '__' + this._get('namespace'),
			storage = local === false ? sessionStorage : localStorage,
			e = null;
		
		// events
		this.onDrop && (e = this.onDrop.apply(this, arguments));
		if (e === false) { return this; }
		
		
		storage.removeItem(name + ':' + id);
		storage.removeItem(name + '__date:' + id);
		storage.removeItem(name + '__active:' + id);
		
		return this;
	};
	/**
	 * remove all collections from the DOM storage<br/>
	 * events: onDrop
	 * 
	 * @this {Colletion Object}
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.dropAll();
	 */
	C.prototype.dropAll = function (local) {
		(local === false ? sessionStorage : localStorage).removeItem( '__' + this.name + '__' + this._get('namespace') + '__date');
		return this.loadAll(local || '', true);
	};	
	/////////////////////////////////
	//// compile (filter)
	/////////////////////////////////
	
	/**
	 * calculate custom filter
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {mixed} el — current element
	 * @param {Number|String} i — iteration (key)
	 * @param {C} data — link to collection
	 * @param {Function} cOLength — collection length
	 * @param {Collection Object} self — link to collection object
	 * @param {String} id — collection ID
	 * @return {Boolean}
	 */
	C.prototype._customFilter = function (filter, el, i, data, cOLength, self, id, _tmpFilter) {
		var
			fLength,
			calFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			i;
		
		// if filter is undefined
		if (!filter || filter === true) {
			if (!this._getActiveParam('filter')) { return true; }
			
			if (this._get('filter')) {
				return this._customFilter(this._get('filter'), el, i, data, cOLength, self, id, _tmpFilter);
			}
			
			return true;
		}

		// if filter is function
		if (C.isFunction(filter)) {
			if (!this._getActiveParam('filter') || !_tmpFilter) {
				return filter.call(filter, el, i, data, cOLength, self, id);
			} else {
				if (!_tmpFilter.name) {
					while (this._exists('filter', '__tmp:' + (_tmpFilter.name = C.getRandomInt(0, 10000)))) {
						_tmpFilter.name = C.getRandomInt(0, 10000);
					}
					this._push('filter', '__tmp:' + _tmpFilter.name, filter);
				}
				
				return this._customFilter(this.ACTIVE + ' && ' + '__tmp:' + _tmpFilter.name, el, i, data, cOLength, self, id, _tmpFilter);
			}
		}
		
		// if filter is string
		if (!C.isArray(filter)) {
			if (this._getActiveParam('filter') && _tmpFilter) {
				filter = this.ACTIVE + ' && (' + filter + ')';
			}
			
			// if simple filter
			if (filter.search(/\|\||&&|!/) === -1) {
				if ((filter = C.trim(filter)).search(/^(?:\(|)*:/) !== -1) {
					if (!this._exists('filter', '__tmp:' + filter)) {
						this._push('filter', '__tmp:' + filter, this._compileFilter(filter));
					}
					
					return (filter = this._get('filter', '__tmp:' + filter)).call(filter, el, i, data, cOLength, self, id);
				}
				
				return this._customFilter(this._get('filter', filter), el, i, data, cOLength, self, id, _tmpFilter);
			}
			
			// prepare string
			filter = C.trim(
						filter
							.toString()
							.replace(/\s*(\(|\))\s*/g, ' $1 ')
							.replace(/\s*(\|\||&&)\s*/g, ' $1 ')
							.replace(/(!)\s*/g, '$1')
					).split(' ');
			
			// remove 'dead' elements		
			for (i = filter.length; (i -= 1) > -1;) {
				if (filter[i] === '') { filter.splice(i, 1); }
			}
		}
		
		// calculate deep filter
		/** @private */
		calFilter = function (array, iter) {
			var
				i = -1,
				aLength = array.length,
				pos = 0,
				result = [];
			
			while ((i += 1) < aLength) {
				iter += 1;
				if (array[i] === '(' || array[i] === '!(') { pos += 1; }
				if (array[i] === ')') {
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
			if (filter[i] === '(' || filter[i] === '!(') {
				if (filter[i].substring(0, 1) === '!') {
					inverse = true;
					filter[i] = filter[i].substring(1);
				} else { inverse = false; }
				
				i = (tmpResult = calFilter(filter.slice((i + 1)), i)).iter;
				tmpResult = tmpResult.result.join(' ');
				
				tmpResult = this._customFilter(tmpResult, el, i, data, cOLength, self, id);
				
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// calculate outer filter
			} else if (filter[i] !== ')' && filter[i] !== '||' && filter[i] !== '&&') {
				if (filter[i].substring(0, 1) === '!') {
					inverse = true;
					filter[i] = filter[i].substring(1);
				} else { inverse = false; }
				
				tmpResult = this._customFilter(this._get('filter', filter[i]), el, i, data, cOLength, self, id);
				
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// 'and' or 'or'
			} else if (filter[i] === '||') {
				and = false;
				or = true;
			} else if (filter[i] === '&&') {
				or = false;
				and = true;
			}
		}
		
		return result;
	};
	/**
	 * compile filter
	 * 
	 * @param {String} str — some string
	 * @return {Function}
	 */
	C.prototype._compileFilter = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split('<:').join('self.getVariable("').split(':>').join('")');
		
		return new Function('el', 'i', 'data', 'cOLength', 'cObj', 'id', 'var key = i; return ' + str.replace(/^\s*:/, '') + ';');
	}	
	/////////////////////////////////
	//// compile (parser)
	/////////////////////////////////
	
	/**
	 * calculate custom parser
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|String|Boolean} parser — parser function or string expression or 'false'
	 * @param {String} str — source string
	 * @return {String}
	 */
	C.prototype._customParser = function (parser, str, _tmpParser) {
		// if parser is undefined
		if (!parser || parser === true) {
			if (!this._getActiveParam('parser')) { return str; }
			
			if (this._get('parser')) {
				return this._customParser(this._get('parser'), str, _tmpParser);
			}
			
			return str;
		}
		
		// if parser is function
		if (C.isFunction(parser)) {
			if (!this._getActiveParam('parser') || !_tmpParser) {
				return parser.call(parser, str, this);
			} else {
				if (!_tmpParser.name) {
					while (this._exists('parser', '__tmp:' + (_tmpParser.name = C.getRandomInt(0, 10000)))) {
						_tmpParser.name = C.getRandomInt(0, 10000);
					}
					this._push('parser', '__tmp:' + _tmpParser.name, parser);
				}
				
				return this._customParser(this.ACTIVE + ' && ' + '__tmp:' + _tmpParser.name, str, _tmpParser);
			}
		}
		
		// if parser is string
		if (C.isString(parser)) {
			//
			if (this._getActiveParam('parser') && _tmpParser) {
				parser = this.ACTIVE + ' && ' + parser;
			}
			
			// if simple parser
			if ((parser = C.trim(parser)).search('&&') === -1) {
				// if need to compile parser
				if (parser.search(/^(?:\(|)*:/) !== -1) {
					if (!this._exists('parser', '__tmp:' + parser)) {
						this._push('parser', '__tmp:' + parser, this._compileParser(parser));
					}
					
					return (parser = this._get('parser', '__tmp:' + parser)).call(parser, str, this);
				}
				
				return this._customParser(this._get('parser', parser), str);
			}
			
			// split parser
			parser = parser.split('&&');
		}
		
		// calculate
		parser.forEach(function (el) {
			str = this._customParser((el = C.trim(el)), str);
		}, this);

		return str;
	};
	/**
	 * compile parser
	 * 
	 * @param {String} str — some string
	 * @return {Function}
	 */
	C.prototype._compileParser = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split('<:').join('self.getVariable("').split(':>').join('")');
		
		return new Function('str', 'cObj', 'return ' + str.replace(/^\s*:/, '') + ';');
	};	
	/////////////////////////////////
	// context methods
	/////////////////////////////////
	
	/**
	 * calculate parent context
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] — level
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {String}
	 *
	 * @example
	 * var db = new $C().newContext('a > b > c');
	 * db.parentContext(); // 'a > b'
	 * db.parentContext(2); // 'a'
	 */
	C.prototype.parentContext = function (n, id) {
		var
			context = this._get('context', id || '').split(C.CHILDREN),
			i = n || 1;
		
		while ((i -= 1) > -1) { context.splice(-1, 1); }
		
		return context.join(C.CHILDREN);
	};
	/**
	 * change the context (the parent element)
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] — level
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	  *
	 * @example
	 * var db = new $C().newContext('a > b > c');
	 * db.parent(); // 'a > b'
	 * db.parent(2); // ''
	 */
	C.prototype.parent = function (n, id) {
		if (!id) { return this._update('context', this.parentContext(n)); }
		return this._push('context', id, this.parentContext(n, id));
	};	
	/////////////////////////////////
	// additional methods
	/////////////////////////////////
	
	/**
	 * return to active parameter stack (flags included)
	 * 
	 * @this {Collection Object}
	 * @param {String} name — property name
	 * @return {mixed}
	 */
	C.prototype._getActiveParam = function (name) {
		var param = typeof this.dObj.sys.flags.use[name] === 'undefined' || this.dObj.sys.flags.use[name] === true? this.dObj.active[name] : false;
		
		if (name === 'context') { return param ? param.toString() : ''; }
		return param;
	};
		
	/**
	 * filter test
	 * 
	 * @this {Collection Object}
	 * @param {String} str — some string
	 * @return {Boolean}
	 */
	C.prototype._filterTest = function (str) {
		return str === this.ACTIVE || this._exists('filter', str) || str.search(/&&|\|\||:/) !== -1;
	};
	/**
	 * expression test
	 * 
	 * @this {Collection Object}
	 * @param {mixed} str — some object
	 * @return {Boolean}
	 */
	C.prototype._exprTest = function (str) {
		return C.isString(str) && str.search(/^:/) !== -1;
	};
	
		
	/**
	 * enable flag
	 * 
	 * @this {Collection Object}
	 * @param {String} 0...n — flag name
	 * @return {Collection Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.enable('cache', 'filter');
	 */
	C.prototype.enable = function () {
		for (var key in arguments) {
			if (!arguments.hasOwnProperty(key)) { continue; }
			this.dObj.sys.flags.use[arguments[key]] = true;
		}
		
		return this;
	};
	/**
	 * disable flag
	 * 
	 * @this {Collection Object}
	 * @param {String} 0...n — flag name
	 * @return {Collection Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.disable('cache', 'filter');
	 */
	C.prototype.disable = function () {
		for (var key in arguments) {
			if (!arguments.hasOwnProperty(key)) { continue; }
			this.dObj.sys.flags.use[arguments[key]] = false;
		}
		
		return this;
	};
	/**
	 * toggle flag
	 * 
	 * @this {Collection Object}
	 * @param {String} 0...n — flag name
	 * @return {Collection Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.toggle('cache', 'filter');
	 */
	C.prototype.toggle = function () {
		for (var key in arguments) {
			if (!arguments.hasOwnProperty(key)) { continue; }
			if (this.dObj.sys.flags.use[arguments[key]] === true) { return this.disable(arguments[key]); }
			
			return this.enable(arguments[key]);
		}
	};
	
	// native
	
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|C} [objID=this.ACTIVE] — collection ID or collection
	 * @param {Function|Array} [replacer] — an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space] — indentation of nested structures
	 * @return {String}
	 */
	C.prototype.toString = function (objID, replacer, space) {
		if (!JSON || !JSON.stringify) { throw new Error('object JSON is not defined!'); }
		
		replacer = replacer || '';
		space = space || '';
		
		if (objID && C.isCollection(objID)) { return JSON.stringify(objID, replacer, space); }
		
		return JSON.stringify(C.byLink(this._get('collection', objID || ''), this._getActiveParam('context')), replacer, space);
	};
	/**
	 * return collection length (only active)
	 * 
	 * @this {Colletion Object}
	 * @return {Number}
	 */
	C.prototype.valueOf = function () { return this.length(this.ACTIVE); };	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
		
	/**
	 * templating (in context)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {C|String} [param.collection=this.ACTIVE] — collection or collection ID
	 * @param {String} [param.context] — additional context
	 * @param {Number} [param.page=this.ACTIVE] — page number
	 * @param {Template} [param.template=this.ACTIVE] — template
	 * @param {Number|Boolean} [param.numberBreak=this.ACTIVE] — number of entries on per page (if 'false', returns all records)
	 * @param {Number} [param.pageBreak=this.ACTIVE] — number of displayed pages (navigation, > 2)
	 * @param {jQuery Object|Boolean} [param.target=this.ACTIVE] — element to output the result ('false' - if you print a variable)
	 * @param {String} [param.variable=this.ACTIVE] — variable ID (if param.target === false)
	 * @param {Filter|Boolean} [param.filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {Parser} [param.parser=this.ACTIVE] — parser function or string expression
	 * @param {Boolean} [param.cacheIteration=this.ACTIVE] — if 'true', the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.ACTIVE] — the selector for the calculation of the number of records
	 * @param {Selector} [param.pager=this.ACTIVE] — selector to pager (navigation)
	 * @param {String} [param.appendType=this.ACTIVE] — type additions to the DOM
	 * @param {String} [param.resultNull=this.ACTIVE] — text displayed if no results
	 * @param {Boolean} [clear=false] — clear the cache
	 * @return {Colletion Object}
	 */
	C.prototype.print = function (param, clear) {
		clear = clear || false;
		
		var
			tmpParser = {}, tmpFilter = {},
			opt = {},
			
			cObj, cOLength,
			start, inc = 0, checkPage, from = null,
			first = false,
			
			numberBreak,
			
			result = '', action, e,
			
			dom = this.drivers.dom;
			
		// easy implementation
		if (C.isExists(param) && (C.isString(param) || C.isNumber(param))) {
			param = {page: param};
		} else if (!C.isExists(param)) { param = {page: this._get('page')}; }
		
		C.extend(true, opt, this.dObj.active, param);
		if (param) { opt.page = C.expr(opt.page, this._get('page')); }
		if (opt.page < 1) { opt.page = 1; }
		
		opt.collection = C.isString(opt.collection) ? this._get('collection', opt.collection) : opt.collection;
		opt.template = C.isString(opt.template) ? this._get('template', opt.template) : opt.template;
		opt.cache = C.isExists(param.cache) ? param.cache : this._getActiveParam('cache');
		
		opt.target = C.isString(opt.target) ? dom.find(opt.target) : opt.target;
		opt.pager = C.isExists(opt.pager) ? dom.find(opt.pager) : opt.pager;
		
		if (clear === true) { opt.cache.iteration = false; }
		
		checkPage = this._get('page') - opt.page;
		this._update('page', opt.page);
		
		// template function 
		/** @private */
		action = function (el, i, data, cOLength, self, id) {
			// callback
			opt.callback && opt.callback.apply(opt.callback, arguments);
			result += opt.template.apply(opt.template, arguments);
			inc = i;
			
			// cache
 			if (first === false) { first = i; }
				
			return true;
		};
		
		// get collection
		cObj = C.byLink(opt.collection, this._getActiveParam('context') + C.CHILDREN + ((param && param.context) || ''));
		cOLength = this.length();
		
		// number of records per page
		numberBreak = Boolean(opt.numberBreak && (opt.filter || this._getActiveParam('filter')));
		opt.numberBreak = opt.numberBreak || cOLength;
		
		// without cache
		if (C.isPlainObject(cObj) || !opt.cache || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = !opt.numberBreak || opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak;
			
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.numberBreak, start);
			if (opt.cache && opt.cache.iteration === false) { opt.cache.lastIteration = false; }
		
		// with cache
		} else if (C.isArray(cObj) && opt.cache.iteration === true) {
			// calculate the starting position
			start = !numberBreak ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak :
							checkPage >= 0 ? opt.cache.firstIteration : opt.cache.lastIteration;
			
			if (numberBreak) {
				// rewind cached step back
				if (checkPage > 0) {
					checkPage = opt.numberBreak * checkPage;
					while ((start -= 1) > -1) {
						if (this._customFilter(opt.filter, cObj[start], cObj, start, cOLength, this, this.ACTIVE, tmpFilter) === true) {
							if (inc === checkPage) {
								break;
							} else { inc += 1; }
						}
					}
					opt.cache.lastIteration = (start += 1);
					from = null;
				} else if (checkPage < 0) { from = -checkPage * opt.numberBreak - opt.numberBreak; }
			}
			
			tmpFilter.name && this._drop('filter', '__tmp:' + tmpFilter.name);
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.numberBreak, from, start);
		}
		
		if (opt.cache) {
			if (checkPage !== 0 && opt.cache.iteration !== false) {
				// cache
				this._get('cache').firstIteration = first;
				this._get('cache').lastIteration = inc + 1;
			}
			if (opt.cache.autoIteration === true) { this._get('cache').iteration = true; }
		}
		
		// parser
		result = !result ? opt.resultNull : this._customParser(opt.parser, result, tmpParser);
		tmpParser.name && this._drop('parser', '__tmp:' + tmpParser.name);
		
		// append to DOM
		if (opt.target === false) {
			if (!opt.variable) {
				this._new('variable', result);
			} else { this._push('variable', opt.variable, result); }
			
			return this;
		} else {
			Array.prototype.forEach.call(opt.target, function (el) {
				// innerHTML
				if (opt.appendType === 'html') {
					el.innerHTML = result;
				
				// append
				} else if (opt.appendType === 'append') {
					el.innerHTML = el.innerHTML + result;
				
				// prepend
				} else { el.innerHTML = result + el.innerHTML; }
			}, this);
		}
		
		if (!opt.pager) { return this; }
		
		opt.nmbOfEntries = opt.filter !== false ? this.length(opt.filter) : cOLength;
		
		opt.nmbOfEntriesInPage = opt.calculator ? dom.find(opt.calculator, opt.target[0]).length : dom.children(opt.target[0]).length;
		opt.finNumber = opt.numberBreak * opt.page - (opt.numberBreak - opt.nmbOfEntriesInPage);

		// generate navigation bar
		if (opt.page !== 1 && opt.nmbOfEntriesInPage === 0) {
			// events
			this.onIPage && (e = this.onIPage.apply(this, arguments));
			if (e === false) { return this; }
			
			this._update('page', (opt.page -= 1)).print(opt, true, true);
		} else { this.easyPage(opt); }
		
		return this;
	};
	
	/**
	 * activation of the navigation<br />
	 * info: page, total, from, to, inPage, nmbOfPages<br />
	 * nav: first, prev, next, last, numberSwitch, pageList
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param] — object settings
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	C.prototype.easyPage = function (param) {
		var
			self = this,
			str = '',
			
			// number of pages
			nmbOfPages = param.nmbOfPages || (param.nmbOfEntries % param.numberBreak !== 0 ? ~~(param.nmbOfEntries / param.numberBreak) + 1 : param.nmbOfEntries / param.numberBreak),
			
			/** @private */
			genPage = function (data, classes, i, nSwitch) {
				nSwitch = nSwitch || false;
				var key, str = '<' + (data.tag || 'span') + ' ' + (!nSwitch ? 'data-page="' : 'data-number-break="') + i + '"';
				
				if (data.attr) {
					for (key in data.attr) {
						if (!data.attr.hasOwnProperty(key)) { continue; }
						str += ' ' + key + '="' + data.attr[key] + '"';
					}
				}
				
				if ((!nSwitch && i === param.page) || (nSwitch && i === param.numberBreak)) { str += ' class="' + (classes && classes.active || 'active') + '"'; }
				return str += '>' + i + '</' + (data.tag || 'span') + '>';
			},
			
			/** @private */
			wrap = function (val, tag) {
				if (tag === 'select') {
					return '<option value="' + val + '">' + val + '</option>';
				}
				
				return val;
			},
			
			
			i, j = 0, from, to, dom = this.drivers.dom;
		
		// for each node
		Array.prototype.forEach.call(dom.find('.ctm', param.pager), function (el) {
			if (param.pageBreak <= 2) { throw new Error('parameter "pageBreak" must be more than 2'); }
			str = '';
			
			var
				tag = el.tagName.toLowerCase(),
				
				data = dom.data(el),
				ctm = data.ctm,
				classes = ctm.classes;
			
			if (ctm.nav) {
				// attach event
				if (C.find(ctm.nav, ['first', 'prev', 'next', 'last']) && !data['ctm-delegated']) {
					dom.bind(el, 'click', function () {
						if (!dom.hasClass(this, ctm.classes && ctm.classes.disabled || 'disabled')) {
							ctm.nav === 'first' && (param.page = 1);
							ctm.nav === 'prev' && (param.page = '-=1');
							ctm.nav === 'next' && (param.page = '+=1');
							ctm.nav === 'last' && (param.page = nmbOfPages);
							
							self.print(param);
						}
					});
					el.setAttribute('data-ctm-delegated', true);
				}
				
				// adding classes status
				if ((C.find(ctm.nav, ['first', 'prev']) && param.page === 1) || (C.find(ctm.nav, ['next', 'last']) && param.finNumber === param.nmbOfEntries)) {
					dom.addClass(el, classes && classes.disabled || 'disabled');
				} else if (C.find(ctm.nav, ['first', 'prev', 'next', 'last'])) {
					dom.removeClass(el, classes && classes.disabled || 'disabled');
				}
				
				// numberBreak switch
				if (ctm.nav === 'numberSwitch') {
					ctm.val.forEach(function (el) {
						if (tag === 'select') {
							str += '<option vale="' + el + '" ' + (el === param.numberBreak ? 'selected="selected"' : '') + '>' + el + '</option>';
						} else { str += genPage(data, classes || '', el, true); }
					});
				}
				
				// page navigation
				if (ctm.nav === 'pageList') {
					if (tag === 'select') {
						for (i = 0; (i += 1) <= nmbOfPages;) {
							str += '<option vale="' + i + '" ' + (i === param.page ? 'selected="selected"' : '') + '>' + i + '</option>';
						} 
					} else {
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
								str += genPage(data, classes || '', i);
							}
						} else { for (i = 0; (i += 1) <= nmbOfPages;) { str += genPage(data, classes || '', i); } }
					}
				}
				
				if (ctm.nav === 'numberSwitch' || ctm.nav === 'pageList') {	
					// to html
					el.innerHTML = str;
					
					// delegate event
					if (!data['ctm-delegated']) {
						if (tag !== 'select') {
							dom.bind(el, 'click', function () {
								var $this = $(this);
								
								if (param.page !== $this.data('page')) {
									if (data.nav === 'pageList') {
										param.page = +$this.data('page');
									} else {
										self._push('numberBreak', param.name || '', +$this.data('number-break'));
										delete param.numberBreak;
									}

									self.print(param);
								}
							});
						
						// if select
						} else {
							dom.bind(el, 'change', function () {
								var option = dom.children(this, 'selected')[0];
								
								if (param.page !== option.value) {
									if (data.nav === 'pageList') {
										param.page = +option.value;
									} else {
										self._push('numberBreak', param.name || '', +option.value);
										delete param.numberBreak;
									}
									
									self.print(param);
								}
							});
						}
						
						el.setAttribute('data-ctm-delegated', true);
					}
				}
			
			// info
			} else if (ctm.info) {
				if (param.nmbOfEntriesInPage === 0) {
					dom.addClass(el, classes && classes.noData || 'no-data');
				} else { dom.removeClass(el, classes && classes.noData || 'no-data'); }
				
				switch (ctm.info) {
					case 'page' : {
						if (tag === 'input') {
							el.value = wrap(param.page, tag);
						} else { el.innerHTML = wrap(param.page, tag); }
					} break;
					case 'total' : {
						if (tag === 'input') {
							el.value = wrap(param.nmbOfEntries, tag);
						} else { el.innerHTML = wrap(param.nmbOfEntries, tag); }
					} break;
					case 'from' : {
						if (tag === 'input') {
							el.value = wrap((param.page - 1) * param.numberBreak + 1, tag);
						} else { el.innerHTML = wrap((param.page - 1) * param.numberBreak + 1, tag); }
					} break;
					case 'to' : {
						if (tag === 'input') {
							el.value = wrap(param.finNumber, tag);
						} else { el.innerHTML = wrap(param.finNumber, tag); }
					} break;
					case 'inPage' : {
						if (tag === 'input') {
							el.value = wrap(param.nmbOfEntriesInPage, tag);
						} else { el.innerHTML = wrap(param.nmbOfEntriesInPage, tag); }
					} break;
					case 'nmbOfPages' : {
						if (tag === 'input') {
							el.value = wrap(nmbOfPages, tag);
						} else { el.innerHTML = wrap(nmbOfPages, tag); }
					} break;
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
	 * @param {Number} [count=4] — td number to a string
	 * @param {String|DOM nodes} [selector='div'] — CSS selector or DOM nodes
	 * @param {Boolean} [empty=true] — display empty cells
	 * @return {Colletion Object}
	 */
	C.prototype.genTable = function (target, count, selector, empty) {
		// overload
		if (C.isNumber(target)) {
			empty = selector;
			selector = count;
			count = target;
			target = '';
		}

		count = count || 4;
		selector = selector || 'div';
		empty = empty === false ? false : true;
		
		var i, table, tr, td, dom = this.drivers.dom;
		
		target = target ? C.isString(target) ? dom.find(target) : target : this._get('target');
		
		// for each node
		Array.prototype.forEach.call(target, function (el) {
			table = document.createElement('table');
			i = 0;
			
			Array.prototype.forEach.call(dom.find(selector, el), function (el) {
				if (i === 0) {
					tr = document.createElement('tr');
					table.appendChild(tr);
				}
				td = document.createElement('td');
				td.appendChild(el);
				tr.appendChild(td);
				
				i += 1;
				if (i === count) { i = 0; }
			});
			
			// add empty cells
			if (empty === true) {
				i = count - tr.childNodes.length;
				while ((i -= 1) > -1) {
					tr.appendChild(document.createElement('td'));
				}
			}
			
			el.appendChild(table);
		}, this);
		
		return this;
	};	return C;
})();
if (typeof $C === 'undefined') { var $C = Collection; }//