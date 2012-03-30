/**
 * <p>Collection — JS (JavaScript) framework for working with collections of data.<br />
 * http://collection-js.com
 * </p>
 *
 * <strong>Glossary:</strong>
 * <ul>
 * <li><b>Collection</b> — data object the JS, can be implemented as an array, and as a hash table (you can combine arrays with the hash, for example: [{...},{...},...]);</li>
 * <li><b>Filter</b> — is a special function, which returns a Boolean value for each row of the collection;</li>
 * <li><b>Parser</b> — is a special function which makes the post—processing of the template;</li>
 * <li><b>Context</b> — a string which specifies a link to the context of the collection (for example: 'Name > 1' indicates the obj.Name[1], where obj is the instance of collection);</li>
 * <li><b>Template</b> — is a special function, which converts the collection in the text, in accordance with special regulations.</li>
 * </ul>
 *
 * <strong>Addition:</strong>
 * <p>The code is documented in accordance with the standard <a href='http://en.wikipedia.org/wiki/JSDoc' target='_blank'>jsDoc</a>.<br />
 * Specific data types:</p>
 * <ul>
 * <li><b>[Collection Object]</b> is a reduced form of the <b>[Object]</b> and means an instance of Collection;</li>
 * <li><b>[Colletion]</b> is a reduced form of the <b>[Object|Array]</b> and means an collection of data;</li>
 * <li><b>[Selector]</b> is a reduced form of the <b>[String]</b>, and means the css selector (CSS3 syntax);</li>
 * <li><b>[Context]</b> is the reduced form of the <b>[String]</b>, and means the context of the collection (Nimble syntax);</li>
 * <li><b>[Template]</b> is a reduced form of the <b>[Function]</b> and means function—template;</li>
 * <li><b>[String Expression]</b> is a reduced form of the <b>[String]</b> and means the abbreviated syntax recording function;</li>
 * <li><b>[Filter]</b> is a reduced form of the <b>[Filter|String Expression]</b> and means the function or string expression;</li>
 * <li><b>[Parser]</b> is a reduced form of the <b>[Parser|String]</b> and means function or string expression;</li>
 * <li><b>[Plain Object]</b> is a reduced form of the <b>[Object]</b> and means hash table;</li>
 * </ul>
 *
 * <p>Enjoy!</p>
 *
 * <p>Copyright 2012, Andrey Kobets (Kobezzza)<br />
 * Dual licensed under the MIT or GPL Version 2 licenses.</p>
 *
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @date: 19.03.2012 6:57:58
 * @version 3.6.2
 *
 * @constructor
 * @this {Colletion Object}
 * @param {Collection} [collection=null] — collection
 * @param {Plain Object} [uProp=Collection.fields.dObj.active] — additional properties
 */
var Collection;
(function () {
	'use strict';
		
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	Collection = function (collection, prop) {
		collection = collection || null;
		prop = prop || '';
		
		// create factory function if need
		if (!this || (!this.name || this.name !== 'Collection')) { return new Collection(collection, prop); }
		
		// mixin public fields
		Collection.extend(true, this, Collection.fields);
		
		var active = this.dObj.active;
		
		// extend public fields by additional properties if need
		if (prop) { Collection.extend(true, active, prop); }
		
		// compile (if need)
		if (this._isStringExpression(active.filter)) { active.filter = this._compileFilter(active.filter); }
		if (this._isStringExpression(active.parser)) { active.parser = this._compileParser(active.parser); }
		
		// search the DOM
		if (Collection.isString(active.target)) { active.target = this.drivers.dom.find(active.target); }
		if (Collection.isString(active.pager)) { active.pager = this.drivers.dom.find(active.pager); }
		
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
	 * @return {mixed}
	 *
	 * @example
	 * $C.byLink({a: {b: 1, c: 2}}, 'a > b', 2);
	 * @example
	 * $C.byLink({a: {b: 1, c: 2}}, 'a > eq(-1)', 1);
	 * @example
	 * $C.byLink({a: {b: 1, c: 2}}, 'a > eq(-1)', '', true);
	 * @example
	 * $C.byLink(false, 'a > b > eq(5) > 1');
	 * @example
	 * $C.byLink(2, 'a > b > eq(5) > 1');
	 * @example
	 * $C.byLink(-1, 'a > b > eq(5) > 1');
	 */
	Collection.byLink = function (obj, context, value, del) {
		context = context
					.toString()
					.replace(new RegExp('\\s*' + Collection.CHILDREN + '\\s*', 'g'), Collection.CONTEXT_SEPARATOR + Collection.CHILDREN + Collection.CONTEXT_SEPARATOR)
					.split(Collection.CONTEXT_SEPARATOR);
		
		del = del || false;
		
		var	clone = obj,
			type = Collection.CHILDREN,
			last = 0, total = 0,
			
			key, i = context.length,
			pos, n,
			
			objLength, cLength;
		
		// remove dead elements
		while ((i -= 1) > -1) {
			context[i] = Collection.trim(context[i]);
			if (context[i] === '') {
				context.splice(i, 1);
				last -= 1;
			} else if (context[i] !== Collection.CHILDREN) {
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
		} else if (Collection.isNumber(obj)) {
			if ((obj = +obj) < 0) { obj += total; }
			
			if (typeof value === 'undefined') { 
				for (i = -1, n = 0; (i += 1) < cLength;) {
					if (context[i] !== Collection.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(i + 1, cLength);
							return context.join('');
						}
					}
				}
			} else {
				for (i = cLength, n = 0; (i -= 1) > -1;) {
					if (context[i] !== Collection.CHILDREN) {
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
				case Collection.CHILDREN : { type = context[i]; } break;
				
				default : {
					// children (>)
					if (type === Collection.CHILDREN && context[i].substring(0, Collection.ORDER[0].length) !== Collection.ORDER[0]) {
						if (i === last && typeof value !== 'undefined') {
							// set new value
							if (del === false) {
								obj[context[i]] = Collection.expr(value, obj[context[i]]);
							
							// remove from object
							} else {
								if (Collection.isArray(obj)) {
									obj.splice(context[i], 1);
								} else { delete obj[context[i]]; }
							}
						
						// next
						} else { obj = obj[context[i]]; }
					
					// order (eq)
					} else {
						pos = context[i].substring(Collection.ORDER[0].length);
						pos = pos.substring(0, (pos.length - 1));
						pos = +pos;
						
						// if array
						if (Collection.isArray(obj)) {
							if (i === last && typeof value !== 'undefined') {
								// if eq >= 0
								if (pos >= 0) {
									// set new value
									if (del === false) {
										obj[pos] = Collection.expr(value, obj[pos]);
									
									// remove from object
									} else { obj.splice(pos, 1); }
								
								// if eq < 0
								} else {
									// set new value
									if (del === false) {
										obj[obj.length + pos] = Collection.expr(value, obj[obj.length + pos]);
									
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
												obj[key] = Collection.expr(value, obj[key]);
											
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
		
		if (typeof value !== 'undefined') { return clone; }
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
	Collection.execEvent = function (query, event, param, thisObject) {
		query = query.split(Collection.QUERY_SEPARATOR);
		param = Collection.isExists(param) ? param : [];
		param = Collection.isArray(param) ? param : [param];
		
		var i = -1,
			qLength = query.length - 1,
			spliter;
		
		while ((i += 1) < qLength) { event = event[query[i]]; }
		thisObject = thisObject || event;
		
		if (query[i].search(Collection.SUBQUERY_SEPARATOR) !== -1) {
			spliter = query[i].split(Collection.SUBQUERY_SEPARATOR);
			event = event[spliter[0]];
			spliter.splice(0, 1);
			param = param.concat(spliter);
			
			return event.apply(thisObject, param);
		} else { return event[query[i]].apply(thisObject, param); }
	};		
	/////////////////////////////////
	//// constants
	/////////////////////////////////
	
	Collection.CONTEXT_SEPARATOR =  '__context__';
	Collection.QUERY_SEPARATOR = '/';
	Collection.SUBQUERY_SEPARATOR = '{';
	Collection.METHOD_SEPARATOR = '->';
		
	Collection.CHILDREN = '>';
	Collection.ORDER = ['eq(', ')'];		
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
	 * $C.toString('test');
	 * @example
	 * $C.toString(2);
	 */
	Collection.objToString = function (obj) {
		if (typeof obj === 'undefined') { return Collection.prototype.collection(); }
		return Object.prototype.toString.call(obj);
	};
	
	// the hash-table of types of data
	Collection.types = {
		'[object Boolean]': 'boolean',
		'[object Number]': 'number',
		'[object String]': 'string',
		'[object Function]': 'function',
		'[object Array]': 'array',
		'[object Date]': 'date',
		'[object RegExp]': 'regexp',
		'[object Object]': 'object'
	};
	
	/**
	 * returns the type of the specified element
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 *
	 * @example
	 * $C.type('test');
	 * @example
	 * $C.type(2);
	 */
	Collection.type = function (obj) {
		return obj == null ? String(obj) : Collection.types[Collection.objToString(obj)] || 'object';
	};
	
	/**
	 * returns true if the specified object is window
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isWindow(window);
	 * @example
	 * $C.isWindow(2);
	 */
	Collection.isWindow = function (obj) {
		return obj && typeof obj === 'object' && 'setInterval' in obj;
	};

	/**
	 * returns a Boolean indicating whether the object is a string
	 *
	 * @param {mixed} obj — object to test whether or not it is a string
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isString('test');
	 * @example
	 * $C.isString(2);
	 */
	Collection.isString = function (obj) { return Collection.type(obj) === 'string'; };
	
	/**
	 * returns a Boolean indicating whether the object is a number
	 *
	 * @param {mixed} obj — object to test whether or not it is a number
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isNumber('test');
	 * @example
	 * $C.isNumber(2);
	 */
	Collection.isNumber = function (obj) { return Collection.type(obj) === 'number';  };
	
	/**
	 * returns a Boolean indicating whether the object is a boolean
	 *
	 * @param {mixed} obj — object to test whether or not it is a boolean
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isNumber('test');
	 * @example
	 * $C.isNumber(false);
	 */
	Collection.isBoolean = function (obj) { return Collection.type(obj) === 'boolean'; };
	
	/**
	 * returns a Boolean indicating whether the object is a function
	 *
	 * @param {mixed} obj — object to test whether or not it is a function
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isFunction('test');
	 * @example
	 * $C.isFunction(function () {});
	 */
	Collection.isFunction = function (obj) { return Collection.type(obj) === 'function';  };
	
	/**
	 * returns a Boolean indicating whether the object is a array (not an array-like object)
	 *
	 * @param {mixed} obj — object to test whether or not it is a array
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isArray({'0': 1, '1': 2, '2': 3, 'length': 3});
	 * @example
	 * $C.isArray([1, 2, 3]);
	 */
	Collection.isArray = function (obj) { return Collection.type(obj) === 'array';  };
	
	/**
	 * returns a Boolean indicating whether the object is a plain object
	 *
	 * @param {mixed} obj — object to test whether or not it is a plain object
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isPlainObject({'0': 1, '1': 2, '2': 3, 'length': 3});
	 * @example
	 * $C.isPlainObject(new Date);
	 * @example
	 * $C.isPlainObject(Date);
	 */
	Collection.isPlainObject = function (obj) {
		if (!obj || Collection.type(obj) !== 'object' || obj.nodeType || Collection.isWindow(obj)) {
			return false;
		}
		
		try {
			// not own constructor property must be Object
			if (obj.constructor &&
				!obj.hasOwnProperty('constructor') &&
				!obj.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
					return false;
				}
		} catch (e) {
			// IE8,9 will throw exceptions on certain host objects #9897
			return false;
		}

		// own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {}

		return key === undefined || obj.hasOwnProperty(key);
	};
	
	/**
	 * returns a Boolean indicating whether the object is a collection
	 *
	 * @param {mixed} obj — object to test whether or not it is a collection
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isCollection({'0': 1, '1': 2, '2': 3, 'length': 3});
	 * @example
	 * $C.isCollection([1, 2, 3]);
	 */
	Collection.isCollection = function (obj) { return Collection.isArray(obj) || Collection.isPlainObject(obj); };
	
	/**
	 * returns a Boolean value indicating that the object is not equal to: undefined, null, or '' (empty string)
	 *
	 * @param {mixed} obj — the object, to test its existence
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isExists('');
	 * @example
	 * $C.isExists(null);
	 * @example
	 * $C.isExists(false);
	 */
	Collection.isExists = function (obj) { return typeof obj !== 'undefined' && obj !== null && obj !== ''; };		
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
	 * $C.trim(' test');
	 * @example
	 * $C.trim(' test ');
	 */
	Collection.trim = function (str) {
		var str = str.replace(/^\s\s*/, ''),
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
	 * $C.toUpperCase('test');
	 * @example
	 * $C.toUpperCase('test', 2);
	 * @example
	 * $C.toUpperCase('test', 2, 1);
	 */
	Collection.toUpperCase = function (str, max, from) {
		from = from || 0;
		max = Collection.isExists(max) ? from + max : str.length;
		
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
	 * $C.toLowerCase('TEST');
	 * @example
	 * $C.toLowerCase('TEST', 2);
	 * @example
	 * $C.toLowerCase('TEST', 2, 1);
	 */
	Collection.toLowerCase = function (str, max, from) {
		from = from || 0;
		max = Collection.isExists(max) ? from + max : str.length;
		
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
	 * $C.expr('+=1', 2);
	 * @example
	 * $C.expr('*=2', 2);
	 * @example
	 * $C.expr('+=2', 'test');
	 */
	Collection.expr = function (val, old) {
		old = Collection.isExists(old) ? old : '';
		
		if (Collection.isString(val) && val.search(/^[+-\\*\/]{1}=/) !== -1) {
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
	Collection.getRandomInt = function (min, max) {
		min = min || 0;
		max = max || 10;
		
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
		
	/////////////////////////////////
	//// methods of arrays and objects
	/////////////////////////////////
	
	/**
	 * merge the contents of two or more objects together into the first object
	 *
	 * @param {Boolean|Object} [deep=target] — if true, the merge becomes recursive (overload) or the object to extend
	 * @param {Object} [target] — the object to extend
	 * @param {Object} [objectN] — additional objects containing properties to merge in
	 * @return {Object}
	 *
	 * @example
	 * $C.extend({a: 1}, {a: 2}, {a: 3});
	 * @example
	 * $C.extend(true, {a: {c: 1, b: 2}}, {a: {c: 2}}, {a: {c: 3}});
	 */
	Collection.extend = function () {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			
			i = 0, aLength = arguments.length,
			
			deep = false;
		
		// handle a deep copy situation
		if (Collection.isBoolean(target)) {
			deep = target;
			target = arguments[1] || {};
			i = 1;
		}
	
		// handle case when target is a string or something (possible in deep copy)
		if (typeof target !== 'object' && !Collection.isFunction(target)) { target = {}; }
	
		// extend Collection itself if only one argument is passed
		if (aLength === i) {
			target = Collection;
			i -= 1;
		}
	
		while ((i += 1) < aLength) {
			// only deal with non-null/undefined values
			if (Collection.isExists(options = arguments[i])) {
				// extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];
	
					// prevent never-ending loop
					if (target === copy) { continue; }
					
					// recurse if we're merging plain objects or arrays
					if (deep && copy && (Collection.isPlainObject(copy) || (copyIsArray = Collection.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && Collection.isArray(src) ? src : [];
						} else { clone = src && Collection.isPlainObject(src) ? src : {}; }
	
						// never move original objects, clone them
						target[name] = Collection.extend(deep, clone, copy);
					
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
	 * $C.addElementToObject({a: 1}, 'b', 2);
	 * @example
	 * $C.addElementToObject({a: 1}, 'b->unshift', 2);
	 */
	Collection.addElementToObject = function (obj, keyName, value) {
		keyName = keyName.split(Collection.METHOD_SEPARATOR);
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
	 * $C.unshiftArguments({'0': 1, length: 1}, 2);
	 */
	Collection.unshiftArguments = function (obj, val) {
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
		 * @return {Boolean}
		 */
		Array.prototype.some = function (callback, thisObject) {
			var i = -1, aLength = this.length, res;
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					res = callback(this[i], i, this);
				} else { res = callback.call(thisObject, this[i], i, this); }
				if (res) { return true; }
			}
			
			return false;
		}
	}
	
	if (!Array.prototype.every) {
		/**
		 * метод возвращает false, если ли хотя бы один элемент массива не удовлетворит фильтр
		 *
		 * @this {Array}
		 * @param {Function} callback — функция обратного вызова, которая выполняется на каждой итерации, должна возвращать логическое значение
		 * @param {Object} [thisObject] — объект, используемый в качестве this для callback
		 * @return {Boolean}
		 *
		 * @example
		 * [1, 2, 3, 4, 5].every(function (el, i, data) {
		 *	el — элемент массива
		 *	i — итерация
		 *	data — исходный массив
		 * });
		 */
		Array.prototype.every = function (callback, thisObject) {
			var i = -1, aLength = this.length,
				res, fRes = true;
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					res = callback(this[i], i, this);
				} else { res = callback.call(thisObject, this[i], i, this); }
				
				if (fRes === true && !res) { fRes = false; }
			}
			
			return fRes;
		};
	}
	
	if (!Array.prototype.filter) {
		/**
		 * метод возвращает новый массив, из элементов исходного, которые удовлетворили фильтр
		 *
		 * @this {Array}
		 * @param {Function} callback — функция обратного вызова, которая выполняется на каждой итерации, должна возвращать логическое значение для каждого элемента массива
		 * @param {Object} [thisObject] — объект, используемый в качестве this для callback
		 * @return {Array}
		 *
		 * @example
		 * [1, 2, 3, 4, 5].filter(function (el, i, data) {
		 *	el — элемент массива
		 *	i — итерация
		 *	data — исходный массив
		 * });
		 */
		Array.prototype.filter = function (callback, thisObject) {
			var i = -1, aLength = this.length, res = [];
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					if (callback(this[i], i, this)) {
						res.push(this[i]);
					}
				} else {
					if (callback.call(thisObject, this[i], i, this)) {
						res.push(this[i]);
					}
				}
			}
			
			return res;
		};
	}
	
	if (!Array.prototype.map) {
		/**
		 * метод возвращает новый массив, из элементов исходного, которые прошли через функцию callback
		 *
		 * @this {Array}
		 * @param {Function} callback — функция обратного вызова, которая выполняется на каждой итерации, должна возвращать новое значение элемента
		 * @param {Object} [thisObject] — объект, используемый в качестве this для callback
		 * @return {Array}
		 *
		 * @example
		 * [1, 2, 3, 4, 5].map(function (el, i, data) {
		 *	el — элемент массива
		 *	i — итерация
		 *	data — исходный массив
		 * });
		 */
		Array.prototype.map = function (callback, thisObject) {
			var i = -1, aLength = this.length, res = [];
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					res.push(callback(this[i], i, this));
				} else {
					res.push(callback.call(thisObject, this[i], i, this));
				}
			}
			
			return res;
		};
	}
	
	if (!Array.prototype.indexOf) {
		/**
		 * метод обходит массив в поисках элемента, равного указанному, и возвращает его индекс (-1 если ничего не найдено)
		 * сравнение идёт строгое (1 != '1')
		 *
		 * @this {Array}
		 * @param {Function} searchElement — искомый элемент
		 * @param {Number} [fromIndex=0] — начальная позиция
		 * @return {Number}
		 *
		 * @example
		 * [1, 2, 3, 4, 5].indexOf(4); // 3
		 * [1, 2, 3, 4, 5].indexOf(4, 4); // -1
		 */
		Array.prototype.indexOf = function (searchElement, fromIndex) {
			var i = (fromIndex || 0) - 1,
				aLength = this.length;
			
			while ((i += 1) < aLength) {
				if (this[i] === searchElement) {
					return i;
				}
			}
			
			return -1;
		};
	}
	
	if (!Array.prototype.lastIndexOf) {
		/**
		 * метод обходит массив в поисках элемента, равного указанному, и возвращает индекс последнего совпадения (-1 если ничего не найдено)
		 * сравнение идёт строгое (1 != '1')
		 *
		 * @this {Array}
		 * @param {Function} searchElement — искомый элемент
		 * @param {Number} [fromIndex=Array.length] — начальная позиция
		 * @return {Number}
		 *
		 * @example
		 * [1, 2, 3, 4, 5, 4].lastIndexOf(4); // 5
		 * [1, 2, 3, 4, 5, 4].lastIndexOf(4, 3); // 3
		 */
		Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
			var i = fromIndex || this.length;
			
			while ((i -= 1) > -1) {
				if (this[i] === searchElement) {
					return i;
				}
			}
			
			return -1;
		};
	}
	
	if (!Array.prototype.reduce) {
		/**
		 * метод итеративно применяет 2 значения (значение, возвращемое функцией обратного вызова и элемент массива, слева-направо), для того, чтобы свести массив к одному значению
		 *
		 * @this {Array}
		 * @param {Function} callback — искомый элемент
		 * @param {mixed} [initialValue=Array[0]] — значение первого параметра callback при первой итерации (по умолчанию: первый элемент массива)
		 * @return {mixed}
		 *
		 * @example
		 * [1, 2, 3, 4, 5].reduce(function (a, b, i, data) {
		 *	a — для первой итерации, если указан, то initialValue, иначе первый элемент массива, для последующих итераций равна возвращаемому значению прошлого callback
		 *	b — элемент массива
		 *	i — итерация (начиная с 1)
		 *	data - исходный массив
		 * });
		 */
		Array.prototype.reduce = function (callback, initialValue) {
			var i = 0, aLength = this.length, res;
			
			if (aLength === 1) { return this[0]; } 
			
			if (initialValue) {
				res = initialValue;
			} else { res = this[0]; }
			
			while ((i += 1) < aLength) {
				res = callback(res, this[i], i, this);
			}
			
			return res;
		};
	}
	
	if (!Array.prototype.reduceRight) {
		/**
		 * метод итеративно применяет 2 значения (значение, возвращемое функцией обратного вызова и элемент массива, справа-налево), для того, чтобы свести массив к одному значению
		 *
		 * @this {Array}
		 * @param {Function} callback — искомый элемент
		 * @param {mixed} [initialValue=Array[Array.length - 1]] — значение первого параметра callback при первой итерации (по умолчанию: последний элемент массива)
		 * @return {mixed}
		 *
		 * @example
		 * [1, 2, 3, 4, 5].reduceRight(function (a, b, i, data) {
		 *	a — для первой итерации, если указан, то initialValue, иначе последний элемент массива, для последующих итераций равна возвращаемому значению прошлого callback
		 *	b — элемент массива
		 *	i — итерация (начиная с 1)
		 *	data - исходный массив
		 * });
		 */
		Array.prototype.reduceRight = function (callback, initialValue) {
			var i = this.length - 1, res;
			
			if (this.length === 1) { return this[0]; } 
			
			if (initialValue) {
				res = initialValue;
			} else { res = this[i]; }
			
			while ((i -= 1) > -1) {
				res = callback(res, this[i], i, this);
			}
			
			return res;
		};
	}	
	/////////////////////////////////
	//// prototype
	/////////////////////////////////
	
	Collection.prototype = {
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
		version: '3.7',
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
		SPLITTER: '>>>',
		
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
			
			'toHTML',
			
			'target',
			'calculator',
			'pager',
			
			'template',
			
			'breaker',
			'navBreaker',
			
			'resultNull'
		]
	};	
	/////////////////////////////////
	//// drivers for additional functions
	/////////////////////////////////
	
	Collection.prototype.drivers = Collection.drivers = {};	
	/////////////////////////////////
	//// DOM methods
	/////////////////////////////////
	
	/** @private */
	Collection.drivers.dom = {
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
						data[el.name.replace('data-', '')] = Collection.isString(el.value) && el.value.search(/^\{|\[/) !== -1 ? JSON.parse(el.value) : el.value;
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
				if (el.nodeType === 3 && Collection.trim(el.textContent)) { str += el.textContent; }
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
			if (el.className.split(' ').indexOf(className) === -1) { el.className += ' ' + className; }
			
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
			return el.className.split(' ').indexOf(className) !== -1;
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
			var classes = el.className.split(' '),
				newClass = [];
			
			classes.forEach(function (el) {
				if (el !== className) { newClass.push(el); }
			});
			
			el.className = newClass.join(' ');
			
			return this;
		},
		
		// search frameworks
		engines: {
			// qsa css selector engine
			qsa: {
				is: function () {
					if (typeof qsa !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					return qsa.querySelectorAll(selector, context);
				}
			},
			// sizzle 
			sizzle: {
				is: function () {
					if (typeof Sizzle !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					return Sizzle(selector, context);
				}
			},
			// jQuery 
			jQuery: {
				is: function () {
					if (typeof jQuery !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					return jQuery(selector, context);
				},
				click: function (el, callback) { $(el).click(callback); },
				change: function (el, callback) { $(el).change(callback); }
			},
			// dojo 
			dojo: {
				is: function () {
					if (typeof dojo !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					if (context) {
						return dojo.query(selector, context);
					} else { return dojo.query(selector); }
				},
				click: function (el, callback) { dojo.connect(el, 'onclick', callback); }
			},
			// mootools 
			mootools: {
				is: function () {
					if (typeof MooTools !== 'undefined') { return true; }
				},
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
			},
			// prototype 
			prototype: {
				is: function () {
					if (typeof Prototype !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					if (context) {
						return context.getElementsBySelector(selector);
					} else { return $$(selector); }
				}
			}
		}
	};
	
	// definition of DOM driver
	(function () {
		var key, engines = Collection.drivers.dom.engines;
		for (key in engines) {
			if (!engines.hasOwnProperty(key)) { continue; }
					
			if (engines[key].is()) {
				Collection.drivers.dom.lib = key;
				
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
	Collection._inObj = function (el) {
		var array = [],
			stat = Collection.fromNode.stat,
			
			dom = Collection.drivers.dom;
				
		// each node
		Array.prototype.forEach.call(el, function (el) {
			// not for text nodes
			if (el.nodeType === 1) {
				var data = dom.data(el),
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
				
				if (el.childNodes.length !== 0) { array[i][stat.childNodes] = Collection._inObj(el.childNodes); }
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
	Collection.fromNode = function (selector, prop) {
		if (typeof JSON === 'undefined' || !JSON.parse) { throw new Error('object JSON is not defined!'); }
		
		var data = Collection._inObj(Collection.drivers.dom.find(selector));
		
		if (prop) { return new Collection(data, prop); }
		return new Collection(data);
	};
	
	// values by default
	if (!Collection.fromNode.stat) {
		Collection.fromNode.stat = {
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
	Collection.ctplCompile = function (selector) {
		Collection.isString(selector) && (selector = Collection.drivers.dom.find(selector));
		if (selector.length === 0) { throw new Error('DOM element does\'t exist!'); }
		
		var html = selector[0] ? selector[0][0] ? selector[0][0].innerHTML : selector[0].innerHTML : selector.innerHTML,
			elem = html
				.replace(/\/\*.*?\*\//g, '')
				.split('?>')
				.join('<?js')
				.replace(/[\r\t\n]/g, ' ')
				.split('<?js'),
			
			resStr = 'var result = ""; ';
		
		elem.forEach(function (el, i) {
			if (i === 0 || i % 2 === 0) {
				resStr += 'result +="' + el.split('"').join('\\"') + '";';
			} else { resStr += el.split('echo').join('result +='); }
		});
		
		return new Function('el', 'key', 'data', 'i', 'length', 'cObj', 'id', resStr + ' return result;');
	};
	
	/**
	 * make templates
	 * 
	 * @this {Collection Object}
	 * @param {String|DOM nodes} selector — CSS selector or DOM nodes
	 * @return {Collection Object}
	 */
	Collection.prototype.ctplMake = function (selector) {	
		var dom = Collection.drivers.dom;
		Collection.isString(selector) && (selector = dom.find(selector));
		
		Array.prototype.forEach.call(selector, function (el) {
			var data = dom.data(el, 'ctpl'), key,
				prefix = data.prefix ? data.prefix + '_' : '';
			
			// compile template
			this._push('template', prefix + data.name, Collection.ctplCompile(el));
			if (data.set && data.set === true) { this._set('template', prefix + data.name); }
			
			// compile
			for (key in data) {
				if (!data.hasOwnProperty(key)){ continue; }
				
				if (['prefix', 'set', 'print', 'name', 'collection'].indexOf(key) !== -1) { continue; }
				if (['target', 'pager'].indexOf(key) !== -1) { data[key] = dom.find(data[key]); }
				
				this._push(key, prefix + data.name, data[key]);
				if (data.set && data.set === true) { this._set(key, prefix + data.name); }
				
				if (['filter', 'parser'].indexOf(key) !== -1) { data[key] = prefix + data.name; }
			}
			
			// if the target is not defined, then take the parent node
			if (!data.target) {
				this._push('target', prefix + data.name, [el.parentNode]);
				if (data.set && data.set === true) { this._set('target', prefix + data.name); }
			}
			
			// print template (if need)
			if (data.print && data.print === true) {
				data.template = data.name;
				
				this.print(data);
			}
		}, this);
		
		return this;
	};	
	/////////////////////////////////
	//// public fields (active)
	/////////////////////////////////
	
	Collection.fields = {
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
				 * DOM insert mode ('replace', 'append', 'prepend')
				 * 
				 * @field
				 * @param String
				 */
				toHTML: 'replace',
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
				breaker: null,
				/**
				 * the number of pages in the navigation menu
				 * 
				 * @field
				 * @type Number
				 */
				navBreaker: 5,
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
	
	Collection.fields.dObj.sys = {
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
		var upperCase,
			sys = Collection.fields.dObj.sys;
		
		data.forEach(function (el) {
			upperCase = Collection.toUpperCase(el, 1);
			
			sys["active" + upperCase + "ID"] = null;
			sys["tmp" + upperCase] = {};
			sys[el + "ChangeControl"] = null;
			sys[el + "Back"] = [];
		});
	}) (Collection.prototype.stack);	
	/////////////////////////////////
	//// stack methods
	/////////////////////////////////
	
	/**
	 * set new value of the parameter on the stack (no impact on the history of the stack) (has aliases, format: new + StackName)<br/>
	 * events: onNew + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {mixed} newVal — new value
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5]).newCollection([1, 2]).getCollection();
	 */
	Collection.prototype._new = function (stackName, newVal) {
		var active = this.dObj.active,
			upperCase = Collection.toUpperCase(stackName, 1), e;
		
		// events
		this['onNew' + upperCase] && (e = this['onNew' + upperCase](newVal));
		if (e === false) { return this; }
		
		// compile string if need
		if (['filter', 'parser'].indexOf(stackName) !== -1 && this._isStringExpression(newVal)) {
			active[stackName] = this['_compile' + Collection.toUpperCase(stackName, 1)](newVal);
		
		// search the DOM (can take a string selector or an array of nodes)
		} else if (['target', 'pager'].indexOf(stackName) !== -1 && Collection.isString(newVal)) {
			active[stackName] = this.drivers.dom.find.apply(this.drivers.dom, Collection.isArray(newVal) ? newVal : [newVal]);
		} else { active[stackName] = Collection.expr(newVal, active[stackName] || ''); }
		
		// break the link with a stack
		this.dObj.sys['active' + upperCase + 'ID'] = null;
		
		return this;
	};
	/**
	 * update the active parameter (if the parameter is in the stack, it will be updated too) (has aliases, format: update + StackName)<br/>
	 * events: onUpdate + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {mixed} newVal — new value
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5]).updateCollection([1, 2]).getCollection();
	 * @example
	 * $C()
	 *	.pushSetCollection('test', [1, 2, 3, 4, 5])
	 *	.updateCollection([1, 2])
	 *	.getCollection('test');
	 */
	Collection.prototype._update = function (stackName, newVal) {
		var active = this.dObj.active,
			
			upperCase = Collection.toUpperCase(stackName, 1), e,
			activeID = this._getActiveID(stackName);
		
		// events
		this['onUpdate' + upperCase] && (e = this['onUpdate' + upperCase](newVal));
		if (e === false) { return this; }
		
		// compile string if need
		if (['filter', 'parser'].indexOf(stackName) !== -1 && this._isStringExpression(newVal)) {
			active[stackName] = this['_compile' + upperCase](newVal);
		
		// search the DOM (can take a string selector or an array of nodes)
		} else if (['target', 'pager'].indexOf(stackName) !== -1 && Collection.isString(newVal)) {
			active[stackName] = this.drivers.dom.find.apply(this.drivers.dom, Collection.isArray(newVal) ? newVal : [newVal]);
		} else { active[stackName] = Collection.expr(newVal, active[stackName] || ''); }
		
		// update the parameter stack
		if (activeID) { this.dObj.sys['tmp' + upperCase][activeID] = active[stackName]; }

		return this;
	};
	/**
	 * get the parameter from the stack (if you specify a constant to 'active ', then returns the active parameter) (has aliases, format: get + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} [id=this.ACTIVE] — stack ID
	 * @throw {Error}
	 * @return {mixed}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5]).getCollection();
	 * @example
	 * $C().pushCollection('test', [1, 2]).getCollection('test');
	 */
	Collection.prototype._get = function (stackName, id) {
		if (id && id !== this.ACTIVE) {
			// throw an exception if the requested parameter does not exist
			if (!this._exists(stackName, id)) { throw new Error('the object "' + id + '" -> "' + stackName + '" doesn\'t exist in the stack!'); }
			
			return this.dObj.sys['tmp' + Collection.toUpperCase(stackName, 1)][id];
		}
		
		return this.dObj.active[stackName];
	};
	
	/**
	 * add one or more new parameters in the stack (if you specify as a parameter ID constant 'active ', it will apply the update method) (if the parameter already exists in the stack, it will be updated) (has aliases, format: push + StackName)<br/>
	 * events: onPush + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Plain Object} objID — stack ID or object (ID: value)
	 * @param {mixed} [newVal] — value (overload)
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C().pushCollection('test', [1, 2, 3]).getCollection('test');
	 * @example
	 * $C().pushCollection({
	 *	test1: [1, 2],
	 *	test2: [1, 2, 3, 4]
	 * }).getCollection('test2');
	 */
	Collection.prototype._push = function (stackName, objID, newVal) {
		var	upperCase = Collection.toUpperCase(stackName, 1), e,
			tmp = this.dObj.sys['tmp' + upperCase],
			activeID = this._getActiveID(stackName),

			key;
		
		// events
		this['onPush' + upperCase] && (e = this['onPush' + upperCase](objID, newVal || ''));
		if (e === false) { return this; }
		
		if (Collection.isPlainObject(objID)) {
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
							if (['filter', 'parser'].indexOf(stackName) !== -1 && this._isStringExpression(objID[key])) {
								tmp[key] = this['_compile' + upperCase](objID[key]);
							
							// search the DOM (can take a string selector or an array of nodes)
							} else if (['target', 'pager'].indexOf(stackName) !== -1 && Collection.isString(objID[key])) {
								tmp[key] = this.drivers.dom.find.apply(this.drivers.dom, Collection.isArray(objID[key]) ? objID[key] : [objID[key]]);
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
					if (['filter', 'parser'].indexOf(stackName) !== -1 && this._isStringExpression(newVal)) {
						tmp[objID] = this['_compile' + upperCase](newVal);
					
					// search the DOM (can take a string selector or an array of nodes)
					} else if (['target', 'pager'].indexOf(stackName) !== -1 && Collection.isString(newVal)) {
						tmp[objID] = this.drivers.dom.find.apply(this.drivers.dom, Collection.isArray(newVal) ? newVal : [newVal]);
					} else { tmp[objID] = newVal; }
				}
			}
		}

		return this;
	};
	/**
	 * set the parameter stack active (affect the story) (has aliases, format: set + StackName)<br/>
	 * events: onSet + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} id — stack ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection('test', [1, 2, 3])
	 *	.setCollection('test')
	 *	.getCollection();
	 */
	Collection.prototype._set = function (stackName, id) {
		var sys = this.dObj.sys,

			upperCase = Collection.toUpperCase(stackName, 1), e,
			tmpChangeControlStr = stackName + 'ChangeControl',
			tmpActiveIDStr = 'active' + upperCase + 'ID';
		
		// throw an exception if the requested parameter does not exist
		if (!this._exists(stackName, id)) { throw new Error('the object "' + id + '" -> "' + stackName + '" doesn\'t exist in the stack!'); }
		
		// events
		this['onSet' + upperCase] && (e = this['onSet' + upperCase](id));
		if (e === false) { return this; }
		
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
	 * back on the history of the stack (has aliases, format: back + StackName)<br/>
	 * events: onBack + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {Number} [nmb=1] — number of steps
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.setCollection('test')
	 *	.setCollection('test2')
	 *	.setCollection('test')
	 *	.backCollection(2)
	 *	.activeCollection();
	 */
	Collection.prototype._back = function (stackName, nmb) {
		nmb = nmb || 1;
		var sys = this.dObj.sys,
			
			upperCase = Collection.toUpperCase(stackName, 1), e,
			propBack = sys[stackName + 'Back'],
			
			pos = propBack.length - (nmb) - 1;
		
		// events
		this['onBack' + upperCase] && (e = this['onBack' + upperCase](nmb));
		if (e === false) { return this; }
		
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
	 * back on the history of the stack, if there were changes (changes are set methods and pushSet) (has aliases, format: back + StackName + If)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {Number} [nmb=1] — number of steps
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.setCollection('test')
	 *	.setCollection('test2')
	 *	.setCollection('test')
	 *	.backCollectionIf()
	 *	.backCollectionIf()
	 *	.activeCollection();
	 * // 'test2' is active, because the method of 'back' does not affect the story //
	 */
	Collection.prototype._backIf = function (stackName, nmb) {
		if (this.dObj.sys[stackName + 'ChangeControl'] === true) { return this._back.apply(this, arguments); }

		return this;
	};
	/**
	 * remove the parameter from the stack (can use a constant 'active') (if the parameter is active, then it would still be removed) (has aliases, format: drop + StackName)<br/>
	 * events: onDrop + stackName
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
	 * $C()
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.dropCollection('test', 'active')
	 *	.existsCollection('test2'); // removed the 'test' and' test2' //
	 */
	Collection.prototype._drop = function (stackName, objID, deleteVal, resetVal) {
		deleteVal = typeof deleteVal === 'undefined' ? false : deleteVal;
		
		var active = this.dObj.active,
			sys = this.dObj.sys,
			
			upperCase = Collection.toUpperCase(stackName, 1), e,
			tmpActiveIDStr = 'active' + upperCase + 'ID',
			tmpTmpStr = 'tmp' + upperCase,

			activeID = this._getActiveID(stackName),
			tmpArray = !objID ? activeID ? [activeID] : [] : Collection.isArray(objID) || Collection.isPlainObject(objID) ? objID : [objID],
			
			key;
		
		// events
		if (typeof resetVal === 'undefined') {
			this['onDrop' + upperCase] && (e = this['onDrop' + upperCase](objID, deleteVal));
			if (e === false) { return this; }
		} else {
			this['onReset' + upperCase] && (e = this['onReset' + upperCase](objID, resetVal));
			if (e === false) { return this; }
		}
		
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
	 * reset the parameter stack (can use a constant 'active') (has aliases, format: reset + StackName, only for: filter, parser and context)<br/>
	 * events: onReset + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array|Plain Object} [objID=active] — stack ID or array of IDs
	 * @param {mixed} [resetVal=false] — reset value
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C().newContext('a > 2').resetContext().getContext();
	 */
	Collection.prototype._reset = function (stackName, objID, resetVal) {
		resetVal = typeof resetVal === 'undefined' ? false : resetVal;

		return this._drop(stackName, objID || '', '', resetVal);
	};
	/**
	 * reset the value of the parameter stack to another (can use a constant 'active') (has aliases, format: reset + StackName + To)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array} [objID=active] — stack ID or array of IDs
	 * @param {String} [id=this.ACTIVE] — source stack ID (for merge)
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection({test: [1, 2], test2: [1, 2, 3, 4]})
	 *	.resetCollectionTo('test', 'test2')
	 *	.getCollection('test');
	 */
	Collection.prototype._resetTo = function (stackName, objID, id) {
		var mergeVal = !id || id === this.ACTIVE ? this.dObj.active[stackName] : this.dObj.sys['tmp' + Collection.toUpperCase(stackName, 1)][id];
		
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
	 * $C().existsCollection('test');
	 */
	Collection.prototype._exists = function (stackName, id) {
		var upperCase = Collection.toUpperCase(stackName, 1);
		
		if ((!id || id === this.ACTIVE) && this._getActiveID(stackName)) { return true; }
		if (typeof this.dObj.sys['tmp' + upperCase][id] !== 'undefined') { return true; }

		return false;
	};
	/**
	 * return the ID of the active parameter (has aliases, format: get + StackName + ActiveID)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @return {String|Null}
	 *
	 * @example
	 * $C().getCollectionActiveID();
	 */
	Collection.prototype._getActiveID = function (stackName) {
		return this.dObj.sys['active' + Collection.toUpperCase(stackName, 1) + 'ID'];
	};
	/**
	 * check the parameter on the activity (has aliases, format: active + StackName) or return the ID of the active parameter (if don't specify input parameters)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} id — stack ID
	 * @return {Boolean}
	 *
	 * @example
	 * $C().activeCollection('test');
	 * @example
	 * $C().pushSetCollection('test', [1, 2]).activeCollection();
	 */
	Collection.prototype._active = function (stackName, id) {
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
	 * $C()
	 *	.pushCollection({
	 *		'test': [1, 2],
	 *		'test.a': [1, 2, 3]
	 *	})
	 *	 .pushContext({
	 *		'test': '',
	 *		'test.a.b': 'eq(-1)'
	 *	})
	 *	.use('test.a.b').getCollection();
	 */
	Collection.prototype.use = function (id) {
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
		var fn = Collection.prototype, nm;
		
		data.forEach(function (el) {
			nm = Collection.toUpperCase(el, 1);
			
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
				return function (objID, newParam) { return this._push.apply(this, Collection.unshiftArguments(arguments, nm)); }
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
	}) (Collection.prototype.stack);	
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
	Collection.prototype._setOne = function (context, value, id) {
		context = Collection.isExists(context) ? context.toString() : '';
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
		
		Collection.byLink(this._get('collection', id), activeContext + Collection.CHILDREN + context, value);
	
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
	Collection.prototype._getOne = function (context, id) {
		context = Collection.isExists(context) ? context.toString() : '';
		return Collection.byLink(this._get('collection', id || ''), this._getActiveParam('context') + Collection.CHILDREN + context);
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
	 * var db = $C([]);
	 * // add a new element to the active collection //
	 * db.add(1);
	 * // unshift //
	 * db.add(2, 'unshift');
	 *
	 * console.log(db.getCollection());
	 * @example
	 * var db = $C().pushSetCollection('test', []);
	 * // add a new element to the 'test' //
	 * db.add(1, 'b', 'test');
	 * // unshift //
	 * db.add(2, 'a->unshift', 'test');
	 * // without specifying the key name //
	 * db.add(3, '', 'test');
	 * db.add(4, 'unshift', 'test');
	 *
	 * console.log(db.getCollection());
	 */
	Collection.prototype.add = function (cValue, propType, activeID, sourceID, del) {
		cValue = typeof cValue !== 'undefined' ? cValue : '';
		propType = propType || 'push';
		activeID = activeID || '';
		del = del || false;
		
		var data, sObj, lCheck, e;
		
		// events
		this.onAdd && (e = this.onAdd.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		data = Collection.byLink(this._get('collection', activeID), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object')  { throw new Error('unable to set property!'); }
		
		// simple add
		if (!sourceID) {
			// add type
			if (Collection.isPlainObject(data)) {
				propType = propType === 'push' ? this.length(data) : propType === 'unshift' ? this.length(data) + Collection.METHOD_SEPARATOR + 'unshift' : propType;
				lCheck = Collection.addElementToObject(data, propType.toString(), cValue);
			} else {
				lCheck = true;
				data[propType](cValue);
			}
		
		// move
		} else {
			cValue = Collection.isExists(cValue) ? cValue.toString() : '';
			sObj = Collection.byLink(this._get('collection', sourceID || ''), cValue);
			
			// add type
			if (Collection.isPlainObject(data)) {
				propType = propType === 'push' ? this.length(data) : propType === 'unshift' ? this.length(data) + Collection.METHOD_SEPARATOR + 'unshift' : propType;
				lCheck = Collection.addElementToObject(data, propType.toString(), sObj);
			} else {
				lCheck = true;
				data[propType](sObj);
			}
			
			// delete element
			if (del === true) { this.disable('context')._removeOne(cValue, sourceID).enable('context'); }
		}
		
		// rewrites links (if used for an object 'unshift')
		if (lCheck !== true) { this._setOne('', lCheck, activeID); }
	
		return this;
	};
	
	/**
	 * add new element to the collection (push) (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj — new element
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([12]).push(1).getCollection();
	 */
	Collection.prototype.push = function (obj, id) {
		return this.add(obj, '', id || '');
	};
	/**
	 * add new element to the collection (unshift) (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj — new element
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1]).unshift(2).getCollection();
	 */
	Collection.prototype.unshift = function (obj, id) {
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
	Collection.prototype._removeOne = function (context, id) {
		context = Collection.isExists(context) ? context.toString() : '';
		var activeContext = this._getActiveParam('context'), e;
		
		// events
		this.onRemove && (e = this.onRemove.apply(this, arguments));
		if (e === false) { return this; }
		
		// if no context
		if (!context && !activeContext) {
			this._setOne('', null);
		} else { Collection.byLink(this._get('collection', id || ''), activeContext + Collection.CHILDREN + context, '', true); }
	
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
	Collection.prototype._remove = function (objContext, id) {
		id = id || '';
		var key, i;
		
		if (Collection.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if (Collection.isArray(objContext[key])) {
						for (i = objContext[key].length; (i -= 1) > -1;) {
							this._removeOne(objContext[key][i], key);
						}
					} else { this._removeOne(objContext[key], key); }
				}
			}
		} else if (Collection.isArray(objContext)) {
			for (i = objContext.length; (i -= 1) > -1;) { this._removeOne(objContext[i], id); }
		} else { this._removeOne(objContext, id); }
	
		return this;
	};	
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
	 * $C([1, 2, 3]).concat([4, 5, 6]).getCollection();
	 */
	Collection.prototype.concat = function (obj, context, id) {
		context = Collection.isExists(context) ? context.toString() : '';
		id = id || '';
		
		var data, e;	
		
		// events
		this.onConcat && (e = this.onConcat.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		data = Collection.byLink(this._get('collection', id), this._getActiveParam('context') + Collection.CHILDREN + context);
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object') { throw new Error('incorrect data type!') }
		
		if (Collection.isPlainObject(data)) {
			Collection.extend(true, data, obj)
		} else if (Collection.isArray(data)) {
			if (Collection.isArray(obj)) {
				data = Array.prototype.concat(data, obj);
				this._setOne(context, data, id);
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
	 * @param {Filter|Collection|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), collection or true (if disabled)
	 * @param {String|Collection} [id=this.ACTIVE] — collection ID or collection
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number} [count] — maximum number of results (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Number}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.length();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.length(':i % 3 === 0');
	 */
	Collection.prototype.length = function (filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		mult = mult === false ? false : true;
		var data, length;
		
		// overload
		// if the filter is a collection
		if (!Collection.isFunction(filter)) {
			if ((Collection.isString(filter) && !this._isFilter(filter) && !Collection.isExists(id)) || Collection.isCollection(filter)) {
				id = filter;
				filter = false;
			}
		}
		
		// overloads
		// if the ID is not specified, it is taken active collection
		if (!id) {
			data = this._get('collection');
		} else if (Collection.isString(id)) {
			data = this._get('collection', id);
		} else { data = id; }
		
		if (data === null) { return 0; }
		if (Collection.isString(data)) { return data.length; }
		
		// if no filter and the original object is an array
		if ((filter === true || !filter) && !this._getActiveParam('filter') && typeof data.length !== 'undefined') {
			length = data.length;
		} else {
			length = 0;
			this.forEach(function () { length += 1; }, filter, data, mult, count || '', from || '', indexOf || '', lastIndexOf || '', rev || '');
		}
		
		return length;
	};
	/**
	 * forEach method (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function|String Expression} callback — function (or string expression) to test each element of the collection (return false stops the cycle, for a string expression need to write clearly, for example: 'el.age += 2; return false')
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String|Collection} [id=this.ACTIVE] — collection ID or collection
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number} [count] — maximum number of results (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([[1, 2, 3, 4, 5, 6, 7, 8], 2, 3, 4]);
	 * db.forEach(':data[key] += 1', '0 >>> :el % 2 === 0');
	 * console.log(db.get());
	 * @example
	 * var db = new $C([{a: 1}, {a: 2}, {a: 3}, {a: 1}, {a: 2}, {a: 3}]);
	 * // increase on 1 all elements of multiples of three //
	 * db.forEach(function (el, key, data, i) {
	 *		el.a += 1;
	 *	}, ':i % 3 === 0');
	 * console.log(db.get());
	 * @example
	 * var db = new $C([{a: 1}, {a: 2}, {a: 3}, {a: 1}, {a: 2}, {a: 3}]);
	 * db.forEach(':el.a += 1', ':i % 3 === 0');
	 * console.log(db.get());
	 */
	Collection.prototype.forEach = function (callback, filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		// values by default
		callback = this._isStringExpression(callback) ? this._compileFunc(callback) : callback;
		filter = Collection.isString((filter = filter || '')) ? filter.split(this.SPLITTER) : filter;
		
		id = id || '';

		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		lastIndexOf = parseInt(lastIndexOf) || false;
		rev = rev || false;
		
		var self = this,
			tmpObj = {},
			tmpArray = [],
			
			context = filter.length === 2 ? filter[0] : '',
			
			data, length, fLength,
			cloneObj,
			
			key, i = 0, j = 0,
			res = false;
		
		if (Collection.isArray(filter)) {
			if (filter.length === 2) {
				filter = Collection.trim(filter[1]);
			} else { filter = Collection.trim(filter[0]); }
		}
		
		// get by link
		data = !Collection.isCollection(id)
					? Collection.byLink(this._get('collection', id), this._getActiveParam('context') + Collection.CHILDREN + context)
						: id;
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object') { throw new Error('incorrect data type!'); }
		
		// length
		/** @private */
		length = function () {
			if (!length.val) {
				length.val = self.length(filter, id);
			}
			
			return length.val;
		};
		// filter length
		/** @private */
		fLength = function (filter, id) {
			if (!fLength.val) {
				fLength.val = self.length(filter || '', id || '');
			}
			
			return fLength.val;
		};
		
		if (Collection.isArray(data)) {
			// cut off the array to indicate the start
			if (indexOf !== false && !rev) {
				cloneObj = data.slice(indexOf);
			} else { cloneObj = data; }
			
			// bypassing the array in ascending order
			if (!rev) {
				cloneObj.some(function (el, key, obj) {
					key += indexOf;
					
					if (lastIndexOf && key === lastIndexOf) { return true; }
					if (count !== false && j === count) { return true; }
					
					if (this._customFilter(filter, el, key, data, i, fLength, this, id, tmpObj) === true) {
						if (from !== false && from !== 0) {
							from -= 1;
						} else {
							res = callback.call(callback, el, key, data, i, length, this, id) === false;
							if (mult === false) { res = true; }
							j += 1;
						}
					}
					
					i += 1;
					if (res === true) { return true; }
				}, this);
			
			// bypassing the array in descending order
			} else {
				lastIndexOf && (cloneObj.length - lastIndexOf);
				for (key = cloneObj.length - indexOf; (key -= 1) > -1;) {
					if (lastIndexOf && key === lastIndexOf) { break; }
					if (count !== false && j === count) { break; }
					
					if (this._customFilter(filter, cloneObj[key], key, data, i, fLength, this, id, tmpObj) === true) {
						if (from !== false && from !== 0) {
							from -= 1;
						} else {
							res = callback.call(callback, cloneObj[key], key, data, i, length, this, id) === false;
							if (mult === false) { res = true; }
							j += 1;
						}
					}
					
					i += 1;
					if (res === true) { break; }
				}
			}
		} else {
			// bypassing the object in ascending order
			if (!rev) {
				for (key in data) {
					if (!data.hasOwnProperty(key)) { continue; }
					
					if (lastIndexOf && i === lastIndexOf) { break; }
					if (count !== false && j === count) { break; }
					if (indexOf !== false && indexOf !== 0) { indexOf -= 1; continue; }
					
					if (this._customFilter(filter, data[key], key, data, i, fLength, this, id, tmpObj) === true) {
						if (from !== false && from !== 0) {
							from -= 1;
						} else {	
							res = callback.call(callback, data[key], key, data, i, length, this, id) === false;
							if (mult === false) { res = true; }
							j += 1;
						}
					}
					
					i += 1;
					if (res === true) { break; }
				}
			
			// bypassing the object in descending order
			} else {
				for (key in data) {
					if (!data.hasOwnProperty(key)) { continue; }
					tmpArray.push(key);
				}
				
				lastIndexOf && (tmpArray.length - lastIndexOf);
				for (key = tmpArray.length - indexOf; (key -= 1) > -1;) {
					if (lastIndexOf && key === lastIndexOf) { break; }
					if (count !== false && j === count) { break; }
					
					if (this._customFilter(filter, data[tmpArray[key]], tmpArray[key], data, i, fLength, this, id, tmpObj) === true) {
						if (from !== false && from !== 0) {
							from -= 1;
						} else {
							res = callback.call(callback, data[tmpArray[key]], tmpArray[key], data, i, length, this, id) === false;
							if (mult === false) { res = true; }
							j += 1;
						}
					}
					
					i += 1;
					if (res === true) { break; }
				}
			}
		}
		
		// remove the temporary filter
		tmpObj.name && this._drop('filter', '__tmp:' + tmpObj.name);
		length = null;
		fLength = null;
		
		return this;
	};
	/**
	 * performs an action only for one element of the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function|String Expression} callback — function (or string expression) to test each element of the collection
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {a: 2}, {a: 3}, {a: 1}, {a: 2}, {a: 3}]);
	 * // increase on 1 one element of multiples of three //
	 * db.some(function (el, key, data, i) {
	 *		data[key].a += 1;
	 *	}, ':i % 3 === 0');
	 * console.log(db.get());
	 */
	Collection.prototype.some = function (callback, filter, id, from, indexOf, lastIndexOf, rev) {
		return this.forEach(callback, filter || '', id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};	
	/////////////////////////////////
	//// mult methods (search)
	/////////////////////////////////
	
	/**
	 * search for elements using filter (returns a reference to elements) (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number} [count] — maximum number of results (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Number|Array}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.search(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.search(function (el, key, data, i) { return i % 3 === 0; });
	 */
	Collection.prototype.search = function (filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		mult = mult === false ? false : true;
		var res = mult === true ? [] : -1,
			
			/** @private */
			action = function (el, key) {
				if (mult === true) {
					res.push(key);
				} else { res = key; }
				
				return true;
			};
		
		this.forEach.apply(this, Collection.unshiftArguments(arguments, action));
		
		return res;
	};
	/**
	 * search for one element using filter (returns a reference to element) (in context)
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Number|Array}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.searchOne(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.searchOne(function (el, key, data, i) { return i % 3 === 0; });
	 */
	Collection.prototype.searchOne = function (filter, id, from, indexOf, lastIndexOf, rev) {
		return this.search(filter || '', id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
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
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).indexOf(1);
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).indexOf(1, 2);
	 */
	Collection.prototype.indexOf = function (searchElement, fromIndex, id) {
		id = id || '';
		fromIndex = fromIndex || '';
		var data = Collection.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		return this.searchOne(function (el) { return el === searchElement; }, id, '', fromIndex);
	};
	/**
	 * returns the last index/key at which a given element can be found in the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement — element to locate in the array
	 * @param {fromIndex} [fromIndex=Collection Length] — the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Number|String}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).lastIndexOf(1);
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).lastIndexOf(1, 2);
	 */
	Collection.prototype.lastIndexOf = function (searchElement, fromIndex, id) {
		id = id || '';
		fromIndex = fromIndex || '';
		var data = Collection.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		return this.searchOne(function (el) { return el === searchElement; }, id, '', fromIndex, '', true);
	};	
	/////////////////////////////////
	//// mult methods (get)
	/////////////////////////////////
	
	/**
	 * get the elements using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Context|Array|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload), array of references (for example: ['eq(-1)', '0 > 1', '0 >>> :el % 2 === 0']) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number} [count] — maximum number of results (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Array|mixed}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get('eq(-1) > c');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get(function (el, key, data, i) { return i % 3 === 0; });
	 */
	Collection.prototype.get = function (filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		id = id || '';
		
		// overload
		if (Collection.isNumber(filter) || (Collection.isString(filter) && !this._isFilter(filter)) || arguments.length === 0 || filter === false) {
			return this._getOne(filter, id);
		}
		
		mult = mult === false ? false : true;
		var res = mult === true || Collection.isArray(filter) ? [] : -1, action;
		
		// overload
		if (Collection.isArray(filter)) {
			filter.forEach(function (el) {
				res.push(this.get(el, id, mult || '', count || '', from || '', indexOf || '', lastIndexOf || '', rev || ''));
			}, this);
			
			return res;
		}
			
		/** @private */
		action = function (el, key, data) {
			if (mult === true) {
				res.push(data[key]);
			} else { res = data[key]; }
	
			return true;
		};
		
		this.forEach.apply(this, Collection.unshiftArguments(arguments, action));
	
		return res;
	};
	/**
	 * get the one element using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), array of references (for example: ['eq(-1)', '0 > 1', '0 >>> :el % 2 === 0']) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {mixed}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.getOne(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.getOne(function (el, key, data, i) {
	 *		return i % 3 === 0;
	 *	});
	 */
	Collection.prototype.getOne = function (filter, id, from, indexOf, lastIndexOf, rev) {
		return this.get(filter || '', id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};
	/////////////////////////////////
	//// mult methods (set)
	/////////////////////////////////
	
	/**
	 * set new value of the elements (in context)<br/>
	 * events: onSet
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {mixed} replaceObj — replace object (if is Function, then executed as a callback, can be used string expression) 
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set('eq(-1) > c', 4).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(':i == 2', {c: 5}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(':i == 2', ':el.c = 6').get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(function (el, key, data, i) {
	 *		return i == 2;
	 *	}, {c: 6}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(function (el, key, data, i) {
	 *		return i == 2;
	 *	}, function (el) {
	 *		return {c: 7};
	 *	}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(function (el, key, data, i) {
	 *		return i == 2;
	 *	}, function (el) {
	 *		el.c = 7;
	 *	}).get();
	 */
	Collection.prototype.set = function (filter, replaceObj, id, mult, count, from, indexOf, lastIndexOf, rev) {
		// overload
		if (Collection.isNumber(filter) || (Collection.isString(filter) && !this._isFilter(filter)) || arguments.length === 0 || filter === false) {
			return this._setOne(filter, replaceObj, id || '');
		}
		
		// compile replace object if need
		replaceObj = this._isStringExpression(replaceObj) ? this._compileFunc(replaceObj) : replaceObj;
		var e, arg, res,
			isFunc = Collection.isFunction(replaceObj),

			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (isFunc) {
					res = replaceObj.apply(replaceObj, arguments);
					if (typeof res !== 'undefined') { data[key] = res; }
				} else {
					data[key] = Collection.expr(replaceObj, data[key]);
				}
	
				return true;
			};
		
		arg = Collection.unshiftArguments(arguments, action);
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
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {mixed} replaceObj — replace object (if is Function, then executed as a callback, can be used string expression)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.setOne(':i == 3', {c: 5}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.setOne(function (el, key, data, i) {
	 *		return i == 3;
	 *	}, {c: 6}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.setOne(function (el, key, data, i) {
	 *		return i == 3;
	 *	}, function (el) {
	 *		el.c = 7;
	 *	}).get();
	 */
	Collection.prototype.setOne = function (filter, replaceObj, id, from, indexOf, lastIndexOf, rev) {
		return this.set(filter || '', replaceObj, id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};
	/////////////////////////////////
	//// mult methods (map)
	/////////////////////////////////
	
	/**
	 * pass each element in the current matched set through a function and return new object (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} replaceObj — a function that will be invoked for each element in the current set
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {mixed}
	 *
	 * @example
	 * // replace each even-numbered element on the value of the sine //
	 * $C([1, 2, 3, 4, 5, 6]).map(Math.sin, ':el % 2 === 0');
	 */
	Collection.prototype.map = function (replaceObj, filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		// compile replace object if need
		replaceObj = this._isStringExpression(replaceObj) ? this._compileFilter(replaceObj) : replaceObj;
		var e, arg, res,
			isExists = Collection.isExists(replaceObj),
			isFunc = Collection.isFunction(replaceObj),
			
			isArray = null,

			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (isArray === null) {
					isArray = Collection.isArray(data);
					if (isArray) {
						res = [];
					} else { res = {}; }
				}
				
				if (isFunc) {
					if (isArray) {
						res.push(replaceObj.apply(replaceObj, arguments));
					} else {
						res[key] = replaceObj.apply(replaceObj, arguments);
					}
				} else {
					if (isExists) {
						if (isArray) {
							res.push(Collection.expr(replaceObj, data[key]));
						} else {
							res[key] = Collection.expr(replaceObj, data[key]);
						}
					} else {
						if (isArray) {
							res.push(data[key]);
						} else {
							res[key] = data[key];
						}
					}
				}
	
				return true;
			};
		
		arg = Collection.unshiftArguments(arguments, action);
		arg.splice(1, 1);
		
		this.forEach.apply(this, arg);
		return res;
	};
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} [context] — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of transfers (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @param {Boolean} [deleteType=true] — if true, remove source element
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.move(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.get());
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.move('eq(-1)', '', 'active', 'test');
	 * console.log(db.get());
	 */
	Collection.prototype.move = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, lastIndexOf, rev, deleteType) {
		moveFilter = moveFilter || '';
		context = Collection.isExists(context) ? context.toString() : '';
		
		sourceID = sourceID || '';
		activeID = activeID || '';
		
		addType = addType || 'push';
		
		mult = mult === false ? false : true;
		deleteType = deleteType === false ? false : true;
		
		var deleteList = [],
			isArray = Collection.isArray(Collection.byLink(this._get('collection', activeID), this._getActiveParam('context'))),
	
			elements, e = null;
		
		// events
		deleteType && this.onMove && (e = this.onMove.apply(this, arguments));
		!deleteType  && this.onCopy && (e = this.onCopy.apply(this, arguments));
		if (e === false) { return this; }
		
		// search elements
		this.disable('context');
		
		if (Collection.isNumber(moveFilter) || (Collection.isString(moveFilter) && !this._isFilter(moveFilter)) || arguments.length === 0 || moveFilter === false) {
			elements = moveFilter;
		} else { elements = this.search(moveFilter, sourceID, mult, count || '', from || '', indexOf || '', lastIndexOf || '', rev || ''); }
		
		this.enable('context');
		
		console.log(elements);
		
		// move
		if (mult === true && Collection.isArray(elements)) {
			elements.forEach(function (el) {
				this.add(context + Collection.CHILDREN + el, isArray === true ? addType : el + Collection.METHOD_SEPARATOR + addType, activeID, sourceID);
				deleteType === true && deleteList.push(el);
			}, this);
		} else {
			this.add(context + Collection.CHILDREN + elements, isArray === true ? addType : elements + Collection.METHOD_SEPARATOR + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
		
		// delete element
		if (deleteType === true) {
			this.disable('context');
			
			if (rev === true) {
				deleteList.forEach(function (el) {
					this._removeOne(el, sourceID);
				}, this);
			} else { this._remove(deleteList, sourceID); }
			
			this.enable('context');
		}
	
		return this;
	},
	/**
	 * move one element from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.moveOne(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.get());
	 */
	Collection.prototype.moveOne = function (moveFilter, context, sourceID, activeID, addType, from, indexOf, lastIndexOf, rev) {
		return this.move(moveFilter || '', Collection.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};
	/**
	 * copy elements from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of copies (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.copy(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.getCollection('test'));
	 */
	Collection.prototype.copy = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, lastIndexOf, rev) {
		mult = mult === false ? false : true;
		return this.move(moveFilter || '', Collection.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || 'push', mult, count || '', from || '', indexOf || '', false);
	};
	/**
	 * copy one element from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.copyOne(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.getCollection('test'));
	 */
	Collection.prototype.copyOne = function (moveFilter, context, sourceID, activeID, addType, from, indexOf, lastIndexOf, rev) {
		return this.move(moveFilter || '', Collection.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '', false);
	};	
	/////////////////////////////////
	//// mult methods (remove)
	/////////////////////////////////
	
	/**
	 * remove an elements from the collection using filter or by link (in context)<br/>
	 * events: onRemove
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of deletions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.remove('eq(-1) > c').get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.remove(':i == 2').get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.remove(function (el, key, data, i) { return i == 1; }).get();
	 */
	Collection.prototype.remove = function (filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		// overloads
		if (Collection.isNumber(filter) || (Collection.isString(filter) && !this._isFilter(filter)) || arguments.length === 0 || filter === false) {
			return this._removeOne(filter, id || '');
		} else if (Collection.isArray(filter) || Collection.isPlainObject(filter)) { return this._remove(filter, id || ''); }
		
		var elements = this.search.apply(this, arguments), i = elements.length;
		
		if (!Collection.isArray(elements)) {
			this._removeOne(elements, id);
		} else {
			if (rev === true) {
				elements.forEach(function (el) {
					this._removeOne(el, id);
				}, this);
			} else { this._remove(elements, id); }
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
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.removeOne(':i % 2 !== 0').get();
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.removeOne(function (el, key, data, i) {
	 *		return i % 2 !== 0;
	 *	}).get();
	 */
	Collection.prototype.removeOne = function (filter, id, from, indexOf, lastIndexOf, rev) {
		return this.remove(filter || '', id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};
	
	/**
	 * remove an element from the collection (pop) (in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3]).pop().getCollection();
	 */
	Collection.prototype.pop = function (id, filter, from, indexOf, lastIndexOf) {
		id = id || '';
		
		if (Collection.isNumber(filter) || (Collection.isString(filter) && !this._isFilter(filter)) || arguments.length < 2 || filter === false) {
			return this._removeOne('eq(-1)', id);
		}
		
		return this.removeOne(filter || '', id, from || '', indexOf || '', lastIndexOf || '', true);	
	};
	/**
	 * remove an element from the collection (shift) (in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3]).shift().getCollection();
	 */
	Collection.prototype.shift = function (id, filter, from, indexOf, lastIndexOf) {
		id = id || '';
		
		if (Collection.isNumber(filter) || (Collection.isString(filter) && !this._isFilter(filter)) || arguments.length < 2 || filter === false) {
			return this._removeOne('eq(0)', id);
		}
		
		return this.removeOne(filter || '', id, from || '', indexOf || '', lastIndexOf || '');	
	};	
	/////////////////////////////////
	//// mult methods (group)
	/////////////////////////////////
	
	/**
	 * group the elements on the field or condition (the method returns a new collection) (in context)
	 *  
	 * @this {Colletion Object}
	 * @param {Context|Function|String Expression} [field] — field name, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration (for group)
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @param {Boolean} [link=false] — save link
	 * @return {Colletion}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5])
	 * .group();
	 * @example
	 * // group all the even-numbered elements //
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).group(':el % 2 === 0');
	 */
	Collection.prototype.group = function (field, filter, id, mult, count, from, indexOf, lastIndexOf, rev, link) {
		field = this._isStringExpression((field = field || '')) ? this._compileFilter(field) : field;
		mult = mult === false ? false : true;
		link = link || false;
		
		var isString = Collection.isString(field),
			res = {}, arg,
			
			/** @private */
			action = function (el, key, data, i) {
				var param = isString ? Collection.byLink(el, field) : field.apply(field, arguments);
				
				if (!res[param]) {
					res[param] = [!link ? el : key];
				} else { res[param].push(!link ? el : key); }
	
				return true;
			};
		
		arg = Collection.unshiftArguments(arguments, action);
		arg.splice(1, 1);
		this.forEach.apply(this, arg);
	
		return res;
	};
	/**
	 * group the elements on the field or condition (the method returns a new collection of references to elements in the original collection) (in context)
	 *  
	 * @this {Colletion Object}
	 * @param {Context|Function|String Expression} [field] — field name, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5])
	 *	.groupLinks();
	 * @example
	 * // group all the even-numbered elements //
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5])
	 *	.groupLinks(':el % 2 === 0');
	 */
	Collection.prototype.groupLinks = function (field, filter, id, count, from, indexOf, lastIndexOf, rev) {
		var arg = Collection.unshiftArguments(arguments, action);
		arg.push(true);
		
		return this.group.apply(this, arg);
	};		
	/////////////////////////////////
	//// statistic methods
	/////////////////////////////////
	
	/**
	 * get statistic information
	 *  
	 * @this {Colletion Object}
	 * @param {String|Function|String Expression} [oper='count'] — operation type ('count', 'avg', 'summ', 'max', 'min', 'first', 'last'), string operator (+, -, *, /) or callback function (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Context|String Expression} [field] — field name or callback function (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @return {Colletion}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).stat('count');
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).stat('min');
	 */
	Collection.prototype.stat = function (oper, field, filter, id, count, from, indexOf) {
		oper = (oper = oper || 'count') && this._isStringExpression(oper) ? this._compileFilter(oper) : oper;
		field = (field = field || '') && this._isStringExpression(field) ? this._compileFilter(field) : field;
		id = id || '';
	
		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var operType = Collection.isString(oper),
			result = 0, tmp = 0, key,
			
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				var param = Collection.isString(field) ? Collection.byLink(el, field) : field(el, key, data, i, length, cObj, id);
				
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
							} else { result = Collection.expr(oper + '=' + param, result); }
						}
					}
				}
					
				return true;
			};
		
		if (oper !== 'first' && oper !== 'last') {
			this.forEach(action, filter || '', id, '', count, from, indexOf);
			
			if (oper === 'avg') { result /= tmp; }
		} else if (oper === 'first') {
			result = this._getOne(Collection.ORDER[0] + '0' + Collection.ORDER[1]);
		} else { result = this._getOne(Collection.ORDER[0] + '-1' + Collection.ORDER[1]); }
	
		return result;
	};	
	/////////////////////////////////
	//// statistic methods (group)
	/////////////////////////////////
	
	/**
	 * get statistic information for group
	 *  
	 * @this {Colletion Object}
	 * @param {String|Function|String Expression} [oper='count'] — operation type ('count', 'avg', 'summ', 'max', 'min', 'first', 'last'), string operator (+, -, *, /) or callback function (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Context|String Expression} [field] — field name or callback function (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @return {Colletion}
	 *
	 * @example
	 * var db = $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.pushSetCollection('test', db.group(':el % 2 === 0'));
	 * console.log(db.groupStat('count'));
	 * @example
	 * var db = $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.pushSetCollection('test', db.group(':el % 2 === 0'));
	 * console.log(db.groupStat('min'));
	 */
	Collection.prototype.groupStat = function (oper, field, filter, id, count, from, indexOf) {
		oper = (oper = oper || 'count') && this._isStringExpression(oper) ? this._compileFilter(oper) : oper;
		field = (field = field || '') && this._isStringExpression(field) ? this._compileFilter(field) : field;
		id = id || '';

		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var operType = Collection.isString(oper),
			result = {}, tmp = {}, key,
			
			/** @private */
			deepAction = function (el, key, data, i, length, cObj, id) {
				var param = Collection.isString(field) ? Collection.byLink(el, field) : field(el, key, data, i, length, cObj, id);
				
				switch (oper) {
					case 'count' : {
						result[this.key] += 1;
					} break;
					case 'summ' : {
						result[this.key] += param;
					} break;
					case 'avg' : {
						tmp[this.key] += 1;
						result[this.key] += param;
					} break;
					case 'max' : {
						if (param > result[this.key]) { result[this.key] = param; }
					} break;
					case 'min' : {
						if (tmp[this.key] === 0) {
							result[this.key] = param;
							tmp[this.key] = 1;
						} else if (param < result[this.key]) { result[this.key] = param; }
					} break;
					default : {
						if (!operType) {
							result[this.key] = oper(param, result[this.key]);
						} else {
							if (tmp[this.key] === 0) {
								result[this.key] = param;
								tmp[this.key] = 1;
							} else { result[this.key] = Collection.expr(oper + '=' + param, result[this.key]); }
						}
					}
				}
					
				return true;
			},
			
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (!result[key]) { result[key] = tmp[key] = 0; };
				
				if (oper !== 'first' && oper !== 'last') {
					cObj
						._update('context', '+=' + Collection.CHILDREN + (deepAction.key = key))
						.forEach(deepAction, filter || '', id, '', count, from, indexOf)
						.parent();
				} else if (oper === 'first') {
					result[key] = Collection.byLink(el, Collection.ORDER[0] + '0' + Collection.ORDER[1]);
				} else { result[key] = Collection.byLink(el, Collection.ORDER[0] + '-1' + Collection.ORDER[1]); }
					
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
	Collection._sortObject = function (obj, field, sort) {
		var sortedValues = [],
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
	Collection._sortObjectByKey = function (obj, sort) {
		var sortedKeys = [],
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
	 * @param {Context|Function|String Expression} [field] — field name or callback function (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Boolean} [rev=false] — reverce (contstants: 'shuffle' — random order)
	 * @param {Function|Boolean} [fn=toUpperCase] — callback function (false if disabled, can be used string expression, the record is equivalent to: return + string expression)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([
	 *	{name: 'Andrey', age: 22},
	 *	{name: 'John', age: 19},
	 *	{name: 'Bon', age: 25},
	 *	{name: 'Bill', age: 15}
	 * ]).sort('name').getCollection();
	 * @example
	 * $C([
	 *	{name: 'Andrey', age: 22, lvl: 80},
	 *	{name: 'John', age: 19, lvl: 95},
	 *	{name: 'Bon', age: 25, lvl: 85},
	 *	{name: 'Bill', age: 15, lvl: 80}
	 * ]).sort(':el.age + el.lvl').getCollection();
	 */
	Collection.prototype.sort = function (field, rev, fn, id) {
		field = (field = field || '') && this._isStringExpression(field) ? this._compileFilter(field) : field;
		rev = rev || false;
		fn = fn && fn !== true ? fn === false ? '' : fn : function (a) {
			if (Collection.isString(a)) { return a.toUpperCase(); }
			
			return a;
		};
		fn = this._isStringExpression(fn) ? this._compileFilter(fn) : fn;
		id = id || '';
		
		var self = this,
			data,
			
			/** @private */
			sort = function (a, b) {
				var r = rev ? -1 : 1;
				
				// sort by field
				if (field) {
					if (!Collection.isFunction(field)) {
						a = Collection.byLink(a, field);
						b = Collection.byLink(b, field);
					} else {
						a = field(a, id);
						b = field(b, id);
					}
				}
				// callback function
				if (fn) {
					a = fn(a, id);
					b = fn(b, id);
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
		data = Collection.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object') { throw new Error('incorrect data type!'); }

		if (Collection.isArray(data)) {
			data.sort(sort);
		} else {
			if (field) {
				// change the field to sort the object
				field = field === true ? 'value' : 'value' + Collection.CHILDREN + field;
				data = Collection._sortObject(data, field, sort);
			} else { data = Collection._sortObjectByKey(data, sort); }
			
			this._setOne('', data, id);
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
	Collection._reverseObject = function (obj) {
		var sortedKeys = [],
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
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.reverse().getCollection();
	 */
	Collection.prototype.reverse = function (id) {
		id = id || '';
		var data, e;
		
		// events
		this.onReverse && (e = this.onReverse.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		data = Collection.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object') { throw new Error('incorrect data type!'); }
		
		if (Collection.isArray(data)) {
			data.reverse();
		} else { this._setOne('', Collection._reverseObject(data), id); }
		
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
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).save();
	 * console.log(localStorage);
	 */
	Collection.prototype.save = function (id, local) {
		if (typeof localStorage === 'undefined') { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id || this.ACTIVE;
		var name = '__' + this.name + '__' + this._get('namespace'),
			
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
	 * $C([1, 2, 3, 4, 5, 6, 7, 0])
	 *	.pushCollection('test', [1, 2, 3])
	 *	.saveAll();
	 *	console.log(localStorage);
	 */
	Collection.prototype.saveAll = function (local) {
		if (typeof localStorage === 'undefined') { throw new Error('your browser doesn\'t support web storage!'); }
		
		local = local === false ? local : true;
		var key,
			tmp = this.dObj.sys.tmpCollection,
			active = false;
		
		for (key in tmp) {
			this._active('Collection', key) && (active = true);
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
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).save();
	 * console.log($C().load().getCollection());
	 */
	Collection.prototype.load = function (id, local) {
		if (typeof localStorage === 'undefined') { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id || this.ACTIVE;
		var name = '__' + this.name + '__' + this._get('namespace'),
			
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
	 * $C([1, 2, 3, 4, 5, 6, 7, 0])
	 *	.pushCollection('test', [1, 2, 3])
	 *	.saveAll();
	 *	console.log($C().loadAll().getCollection('test'));
	 */
	Collection.prototype.loadAll = function (local, type) {
		type = type ? 'drop' : 'load';
		if (typeof localStorage === 'undefined') { throw new Error('your browser doesn\'t support web storage!'); }
		
		local = local === false ? local : true;
		var name = '__' + this.name + '__' + this._get('namespace'),
			
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
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).save();
	 * console.log($C().loadDate());
	 */
	Collection.prototype.loadDate = function (id, local) {
		if (typeof localStorage === 'undefined') { throw new Error('your browser doesn\'t support web storage!'); }
		
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
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).save();
	 * console.log($C().isExpired(3000));
	 */
	Collection.prototype.isExpired = function (time, id, local) {
		if (typeof localStorage === 'undefined') { throw new Error('your browser doesn\'t support web storage!'); }
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
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).save().drop();
	 * console.log(localStorage);
	 */
	Collection.prototype.drop = function (id, local) {
		if (typeof localStorage === 'undefined') { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id || this.ACTIVE;
		var name = '__' + this.name + '__' + this._get('namespace'),
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
	 * $C([1, 2, 3, 4, 5, 6, 7, 0])
	 *	.pushCollection('test', [1, 2, 3])
	 *	.saveAll().dropAll();
	 *	console.log(localStorage);
	 */
	Collection.prototype.dropAll = function (local) {
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
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {mixed} el — current element
	 * @param {Number|String} key — key
	 * @param {Collection} data — link to collection
	 * @param {Number|String} i — iteration
	 * @param {Function} length — collection length
	 * @param {Collection Object} cObj — link to collection object
	 * @param {String} id — collection ID
	 * @return {Boolean}
	 */
	Collection.prototype._customFilter = function (filter, el, key, data, i, length, cObj, id, _tmpFilter) {
		var fLength,
			calFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			j;
		
		// if filter is undefined
		if (!filter || filter === true) {
			if (!this._getActiveParam('filter')) { return true; }
			
			if (this._get('filter')) {
				return this._customFilter(this._get('filter'), el, key, data, i, length, cObj, id, _tmpFilter);
			}
			
			return true;
		}

		// if filter is function
		if (Collection.isFunction(filter)) {
			if (!this._getActiveParam('filter') || !_tmpFilter) {
				return filter.call(filter, el, key, data, i, length, cObj, id);
			} else {
				if (!_tmpFilter.name) {
					while (this._exists('filter', '__tmp:' + (_tmpFilter.name = Collection.getRandomInt(0, 10000)))) {
						_tmpFilter.name = Collection.getRandomInt(0, 10000);
					}
					this._push('filter', '__tmp:' + _tmpFilter.name, filter);
				}
				
				return this._customFilter(this.ACTIVE + ' && ' + '__tmp:' + _tmpFilter.name, el, key, data, i, length, cObj, id, _tmpFilter);
			}
		}
		
		// if filter is string
		if (!Collection.isArray(filter)) {
			if (this._getActiveParam('filter') && _tmpFilter) {
				filter = this.ACTIVE + ' && (' + filter + ')';
			}
			
			// if need to compile filter
			if (this._isStringExpression(filter = Collection.trim(filter))) {
				if (!this._exists('filter', '__tmp:' + filter)) {
					this._push('filter', '__tmp:' + filter, this._compileFilter(filter));
				}

				return (filter = this._get('filter', '__tmp:' + filter)).call(filter, el, key, data, i, length, cObj, id);
			}
			
			// prepare string
			filter = Collection.trim(
						filter
							.toString()
							.replace(/\s*(\(|\))\s*/g, ' $1 ')
							.replace(/\s*(\|\||&&)\s*/g, ' $1 ')
							.replace(/(!)\s*/g, '$1')
					).split(' ');
			
			// remove 'dead' elements		
			for (j = filter.length; (j -= 1) > -1;) {
				if (filter[j] === '') { filter.splice(j, 1); }
			}
		}
		
		// calculate deep filter
		/** @private */
		calFilter = function (array, iter) {
			var i = -1,
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
		for (j = -1; (j += 1) < fLength;) {
			// calculate atoms
			if (filter[j] === '(' || filter[j] === '!(') {
				if (filter[j].substring(0, 1) === '!') {
					inverse = true;
					filter[j] = filter[j].substring(1);
				} else { inverse = false; }
				
				j = (tmpResult = calFilter(filter.slice((j + 1)), j)).iter;
				tmpResult = tmpResult.result.join(' ');
				tmpResult = this._customFilter(tmpResult, el, key, data, i, length, cObj, id);
				
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// calculate outer filter
			} else if (filter[j] !== ')' && filter[j] !== '||' && filter[j] !== '&&') {
				if (filter[j].substring(0, 1) === '!') {
					inverse = true;
					filter[j] = filter[j].substring(1);
				} else { inverse = false; }
				
				tmpResult = this._customFilter(this._get('filter', filter[j]), el, key, data, i, length, cObj, id);
				
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// 'and' or 'or'
			} else if (filter[j] === '||') {
				and = false;
				or = true;
			} else if (filter[j] === '&&') {
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
	Collection.prototype._compileFilter = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split('<:').join('cObj.getVariable("').split(':>').join('")');
		
		return new Function('el', 'key', 'data', 'i', 'length', 'cObj', 'id', 'return ' + str.replace(/^\s*:/, '') + ';');
	};	
	/////////////////////////////////
	//// compile (parser)
	/////////////////////////////////
	
	/**
	 * calculate custom parser
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|String|Boolean} parser — parser function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} str — source string
	 * @return {String}
	 */
	Collection.prototype._customParser = function (parser, str, _tmpParser) {
		// if parser is undefined
		if (!parser || parser === true) {
			if (!this._getActiveParam('parser')) { return str; }
			
			if (this._get('parser')) {
				return this._customParser(this._get('parser'), str, _tmpParser);
			}
			
			return str;
		}
		
		// if parser is function
		if (Collection.isFunction(parser)) {
			if (!this._getActiveParam('parser') || !_tmpParser) {
				return parser.call(parser, str, this);
			} else {
				if (!_tmpParser.name) {
					while (this._exists('parser', '__tmp:' + (_tmpParser.name = Collection.getRandomInt(0, 10000)))) {
						_tmpParser.name = Collection.getRandomInt(0, 10000);
					}
					this._push('parser', '__tmp:' + _tmpParser.name, parser);
				}
				
				return this._customParser(this.ACTIVE + ' && ' + '__tmp:' + _tmpParser.name, str, _tmpParser);
			}
		}
		
		// if parser is string
		if (Collection.isString(parser)) {
			if (this._getActiveParam('parser') && _tmpParser) {
				parser = this.ACTIVE + ' && ' + parser;
			}
			
			// if need to compile parser
			if (this._isStringExpression(parser = Collection.trim(parser))) {
				if (!this._exists('parser', '__tmp:' + parser)) {
					this._push('parser', '__tmp:' + parser, this._compileParser(parser));
				}
				
				return (parser = this._get('parser', '__tmp:' + parser)).call(parser, str, this);
			}
			
			// split parser
			parser = parser.split('&&');
		}
		
		// calculate
		parser.forEach(function (el) {
			str = this._customParser((el = Collection.trim(el)), str);
		}, this);

		return str;
	};
	/**
	 * compile parser
	 * 
	 * @param {String} str — some string
	 * @return {Function}
	 */
	Collection.prototype._compileParser = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split('<:').join('cObj.getVariable("').split(':>').join('")');
		
		return new Function('str', 'cObj', 'return ' + str.replace(/^\s*:/, '') + ';');
	};	
	/////////////////////////////////
	//// compile (function)
	/////////////////////////////////
	
	/**
	 * compile function
	 * 
	 * @param {String} str — some string
	 * @return {Function}
	 */
	Collection.prototype._compileFunc = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split('<:').join('cObj.getVariable("').split(':>').join('")');
		
		return new Function('el', 'key', 'data', 'i', 'length', 'cObj', 'id', str.replace(/^\s*:/, '') + ';');
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
	 * $C('', {context: 'a > b > c'}).parentContext();
	 * @example
	 * $C('', {context: 'a > b > c'}).parentContext(2);
	 */
	Collection.prototype.parentContext = function (n, id) {
		var context = this._get('context', id || '').split(Collection.CHILDREN),
			i = n || 1;
		
		while ((i -= 1) > -1) { context.splice(-1, 1); }
		
		return context.join(Collection.CHILDREN);
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
	 * $C('', {context: 'a > b > c'}).parent().getContext();
	 * @example
	 * $C('', {context: 'a > b > c'}).parent(2).getContext();
	 */
	Collection.prototype.parent = function (n, id) {
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
	Collection.prototype._getActiveParam = function (name) {
		var param = typeof this.dObj.sys.flags.use[name] === 'undefined' || this.dObj.sys.flags.use[name] === true ? this.dObj.active[name] : false;
		
		if (name === 'context') { return param ? param.toString() : ''; }
		return param;
	};
	
	/**
	 * returns a Boolean indicating whether the string is a filter
	 * 
	 * @this {Collection Object}
	 * @param {String} str — some string
	 * @return {Boolean}
	 */
	Collection.prototype._isFilter = function (str) {
		return str === this.ACTIVE || this._exists('filter', str) || str.search(/&&|\|\||:|!/) !== -1;
	};
	/**
	 * returns a Boolean indicating whether the object is a string expression
	 * 
	 * @this {Collection Object}
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 */
	Collection.prototype._isStringExpression = function (obj) {
		return Collection.isString(obj) && obj.search(/^:/) !== -1;
	};
	
	/**
	 * enable flag
	 * 
	 * @this {Collection Object}
	 * @param {String} [objectN] — flag name
	 * @return {Collection Object}
	 */
	Collection.prototype.enable = function () {
		Array.prototype.forEach.call(arguments, function (el) {
			this.dObj.sys.flags.use[el] = true
		}, this);
		
		return this;
	};
	/**
	 * disable flag
	 * 
	 * @this {Collection Object}
	 * @param {String} [objectN] — flag name
	 * @return {Collection Object}
	 */
	Collection.prototype.disable = function () {
		Array.prototype.forEach.call(arguments, function (el) {
			this.dObj.sys.flags.use[el] = false
		}, this);
		
		return this;
	};
	/**
	 * toggle flag
	 * 
	 * @this {Collection Object}
	 * @param {String} [objectN] — flag name
	 * @return {Collection Object}
	 */
	Collection.prototype.toggle = function () {
		Array.prototype.forEach.call(arguments, function (el) {
			if (this.dObj.sys.flags.use[el] === true) {
				this.disable(arguments[key]);
			} else { this.enable(arguments[key]); }
		}, this);
	};
	
	// native
	
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Collection} [objID=this.ACTIVE] — collection ID or collection
	 * @param {Function|Array} [replacer] — an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space] — indentation of nested structures
	 * @return {String}
	 */
	Collection.prototype.toString = function (objID, replacer, space) {
		if (typeof JSON === 'undefined' || !JSON.stringify) { throw new Error('object JSON is not defined!'); }
		
		replacer = replacer || '';
		space = space || '';
		
		if (objID && Collection.isCollection(objID)) { return JSON.stringify(objID, replacer, space); }
		
		return JSON.stringify(Collection.byLink(this._get('collection', objID || ''), this._getActiveParam('context')), replacer, space);
	};
	/**
	 * return collection length (only active)
	 * 
	 * @this {Colletion Object}
	 * @return {Number}
	 */
	Collection.prototype.valueOf = function () {
		if (arguments[0] === 'object') { return this; }
		return this.length(this.ACTIVE);
	};	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
		
	/**
	 * templating (in context)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Collection|String} [param.collection=this.ACTIVE] — collection or collection ID
	 * @param {String} [param.context] — additional context
	 * @param {Number} [param.page=this.ACTIVE] — page number
	 * @param {Template} [param.template=this.ACTIVE] — template
	 * @param {Number|Boolean} [param.breaker=this.ACTIVE] — number of entries on per page (if false, returns all records)
	 * @param {Number} [param.navBreaker=this.ACTIVE] — number of displayed pages (navigation, > 2)
	 * @param {Selector|Boolean} [param.target=this.ACTIVE] — selector to element to output the result (false — if you print a variable)
	 * @param {String} [param.variable=this.ACTIVE] — variable ID (if param.target === false)
	 * @param {Filter} [param.filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression))
	 * @param {Filter} [param.filter=this.ACTIVE] — function, which is performed every iteration of the template (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Parser} [param.parser=this.ACTIVE] — parser function or string expression (context + >>> + filter (the record is equivalent to: return + string expression))
	 * @param {Boolean} [param.cacheIteration=this.ACTIVE] — if true, the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.ACTIVE] — the selector for the calculation of the number of records
	 * @param {Selector} [param.pager=this.ACTIVE] — selector to pager (navigation)
	 * @param {String} [param.toHTML=this.ACTIVE] — type additions to the DOM
	 * @param {String} [param.resultNull=this.ACTIVE] — text displayed if no results
	 * @param {Boolean} [clear=false] — clear the cache
	 * @return {Colletion Object}
	 */
	Collection.prototype.print = function (param, clear) {
		clear = clear || false;
		
		var self = this,
			tmpParser = {}, tmpFilter = {},
			opt = {},
			
			data, length, fLength,
			start, inc = 0, checkPage, from = null,
			first = false,
			
			breaker,
			
			result = '', action, e,
			
			dom = this.drivers.dom;
		
		// easy implementation
		if (Collection.isExists(param) && (Collection.isString(param) || Collection.isNumber(param))) {
			param = {page: param};
		} else if (!Collection.isExists(param)) { param = {page: this._get('page')}; }
		
		// the expansion of input parameters
		Collection.extend(true, opt, this.dObj.active, param);
		if (param) { opt.page = Collection.expr(opt.page, this._get('page')); }
		if (opt.page < 1) { opt.page = 1; }
		
		opt.collection = Collection.isString(opt.collection) ? this._get('collection', opt.collection) : opt.collection;
		opt.template = Collection.isString(opt.template) ? this._get('template', opt.template) : opt.template;
		opt.cache = Collection.isExists(param.cache) ? param.cache : this._getActiveParam('cache');
		
		opt.target = Collection.isString(opt.target) ? dom.find(opt.target) : opt.target;
		opt.pager = Collection.isString(opt.pager) ? dom.find(opt.pager) : opt.pager;
		
		opt.filter = this._isStringExpression(opt.filter) ? this._compileFilter(opt.filter) : opt.filter;
		opt.parser = this._isStringExpression(opt.parser) ? this._compileParser(opt.parser) : opt.parser;
		opt.callback = opt.callback && this._isStringExpression(opt.callback) ? this._compileFunc(opt.callback) : opt.callback;
		
		if (clear === true) { opt.cache.iteration = false; }
		
		checkPage = this._get('page') - opt.page;
		this._update('page', opt.page);
		
		// template function 
		/** @private */
		action = function (el, key, data, i, length, cObj, id) {
			// callback
			opt.callback && opt.callback.apply(opt.callback, arguments);
			result += opt.template.apply(opt.template, arguments);
			inc = key;
			
			// cache
 			if (first === false) { first = key; }
				
			return true;
		};
		
		// get collection
		data = Collection.byLink(opt.collection, this._getActiveParam('context') + Collection.CHILDREN + ((param && param.context) || ''));
		length = this.length(opt.collection);
		
		// filter length
		/** @private */
		fLength = function (filter, id) {
			if (!fLength.val) {
				fLength.val = self.length(filter, id);
			}
			
			return fLength.val;
		};
		
		// number of records per page
		breaker = Boolean(opt.breaker && (opt.filter || this._getActiveParam('filter')));
		opt.breaker = opt.breaker || length;
		
		// without cache
		if (Collection.isPlainObject(data) || !opt.cache || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = !opt.breaker || opt.page === 1 ? 0 : (opt.page - 1) * opt.breaker;
			
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.breaker, start);
			if (opt.cache && opt.cache.iteration === false) { opt.cache.lastIteration = false; }
		
		// with cache
		} else if (Collection.isArray(data) && opt.cache.iteration === true) {
			// calculate the starting position
			start = !breaker ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.breaker :
							checkPage >= 0 ? opt.cache.firstIteration : opt.cache.lastIteration;
			
			if (breaker) {
				// rewind cached step back
				if (checkPage > 0) {
					checkPage = opt.breaker * checkPage;
					while ((start -= 1) > -1) {
						if (this._customFilter(opt.filter, data[start], data, start, fLength, this, this.ACTIVE, tmpFilter) === true) {
							if (inc === checkPage) {
								break;
							} else { inc += 1; }
						}
					}
					opt.cache.lastIteration = (start += 1);
					from = null;
				} else if (checkPage < 0) { from = -checkPage * opt.breaker - opt.breaker; }
			}
			
			tmpFilter.name && this._drop('filter', '__tmp:' + tmpFilter.name);
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.breaker, from, start);
		}
		
		if (opt.cache) {
			if (checkPage !== 0 && opt.cache.iteration !== false) {
				// cache
				this._get('cache').firstIteration = first;
				this._get('cache').lastIteration = inc + 1;
			}
			if (opt.cache.autoIteration === true) { this._get('cache').iteration = true; }
		}
		
		// clear
		fLength = null;
		
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
				if (opt.toHTML === 'replace') {
					el.innerHTML = result;
				
				// append
				} else if (opt.toHTML === 'append') {
					el.innerHTML = el.innerHTML + result;
				
				// prepend
				} else { el.innerHTML = result + el.innerHTML; }
			}, this);
		}
		
		if (!opt.pager) { return this; }
		
		// navigation
		opt.nmbOfEntries = opt.filter !== false ? this.length(opt.filter, opt.collection) : length;
		opt.nmbOfEntriesInPage = opt.calculator ? dom.find(opt.calculator, opt.target[0]).length : dom.children(opt.target[0]).length;
		opt.finNumber = opt.breaker * opt.page - (opt.breaker - opt.nmbOfEntriesInPage);

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
	Collection.prototype.easyPage = function (param) {
		var self = this,
			str = '',
			
			// number of pages
			nmbOfPages = param.nmbOfPages || (param.nmbOfEntries % param.breaker !== 0 ? ~~(param.nmbOfEntries / param.breaker) + 1 : param.nmbOfEntries / param.breaker),
			
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
				
				if ((!nSwitch && i === param.page) || (nSwitch && i === param.breaker)) { str += ' class="' + (classes && classes.active || 'active') + '"'; }
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
		Array.prototype.forEach.call(param.pager, function (el) {
			Array.prototype.forEach.call(dom.find('.ctm', el), function (el) {
				if (param.navBreaker <= 2) { throw new Error('parameter "navBreaker" must be more than 2'); }
				str = '';
				
				var tag = el.tagName.toLowerCase(),
					
					data = dom.data(el),
					ctm = data.ctm,
					classes = ctm.classes;
				
				if (ctm.nav) {
					// attach event
					if (['first', 'prev', 'next', 'last'].indexOf(ctm.nav) !== -1 && !data['ctm-delegated']) {
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
					if ((['first', 'prev'].indexOf(ctm.nav) !== -1 && param.page === 1) || (['next', 'last'].indexOf(ctm.nav) !== -1 && param.finNumber === param.nmbOfEntries)) {
						dom.addClass(el, classes && classes.disabled || 'disabled');
					} else if (['first', 'prev', 'next', 'last'].indexOf(ctm.nav) !== -1) {
						dom.removeClass(el, classes && classes.disabled || 'disabled');
					}
					
					// breaker switch
					if (ctm.nav === 'numberSwitch') {
						ctm.val.forEach(function (el) {
							if (tag === 'select') {
								str += '<option vale="' + el + '" ' + (el === param.breaker ? 'selected="selected"' : '') + '>' + el + '</option>';
							} else { str += genPage(ctm, classes || '', el, true); }
						});
					}
					
					// page navigation
					if (ctm.nav === 'pageList') {
						if (tag === 'select') {
							for (i = 0; (i += 1) <= nmbOfPages;) {
								str += '<option vale="' + i + '" ' + (i === param.page ? 'selected="selected"' : '') + '>' + i + '</option>';
							} 
						} else {
							if (nmbOfPages > param.navBreaker) {	
								j = param.navBreaker % 2 !== 0 ? 1 : 0;
								from = (param.navBreaker - j) / 2;
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
									if (j === param.navBreaker && i !== param.page) { break; }
									str += genPage(ctm, classes || '', i);
								}
							} else { for (i = 0; (i += 1) <= nmbOfPages;) { str += genPage(ctm, classes || '', i); } }
						}
					}
					
					if (ctm.nav === 'numberSwitch' || ctm.nav === 'pageList') {	
						// to html
						el.innerHTML = str;
						
						// delegate event
						if (!data['ctm-delegated']) {
							if (tag !== 'select') {
								dom.bind(el, 'click', function (e) {
									e = e || window.event;
									var target = e.target || e.srcElement, data = dom.data(target);
									if (target.parentNode !== el) { return false; }
									
									if (ctm.nav === 'pageList') {
										param.page = +data.page;
									} else {
										self._push('breaker', param.name || '', +data['number-break']);
										delete param.breaker;
									}
	
									self.print(param);
								});
							
							// if select
							} else {
								dom.bind(el, 'change', function () {
									var option = dom.children(this, 'selected')[0];
									
									if (param.page !== option.value) {
										if (data.nav === 'pageList') {
											param.page = +option.value;
										} else {
											self._push('breaker', param.name || '', +option.value);
											delete param.breaker;
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
								el.value = wrap((param.page - 1) * param.breaker + 1, tag);
							} else { el.innerHTML = wrap((param.page - 1) * param.breaker + 1, tag); }
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
	Collection.prototype.genTable = function (target, count, selector, empty) {
		// overload
		if (Collection.isNumber(target)) {
			empty = selector;
			selector = count;
			count = target;
			target = '';
		}

		count = count || 4;
		selector = selector || 'div';
		empty = empty === false ? false : true;
		
		var i, table, tr, td, dom = this.drivers.dom;
		
		target = target ? Collection.isString(target) ? dom.find(target) : target : this._get('target');
		
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
	};	return Collection;
})();
if (typeof $C === 'undefined') { var $C = Collection; }//