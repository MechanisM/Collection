	
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
	 * $C.addElementToObject({a: 1}, 'b', 2);
	 * @example
	 * $C.addElementToObject({a: 1}, 'b->unshift', 2);
	 */
	Collection.addElementToObject = function (obj, keyName, value) {
		keyName = keyName.split(C.METHOD);
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
	 * unshift for object
	 * 
	 * @param {Object} obj — some object
	 * @param {mixed} val — new value
	 * @return {Array}
	 *
	 * @example
	 * $C.unshift({0: 1, length: 1}, 2);
	 */
	Collection.unshift = function (obj, val) {
		var newArray = [val], key;
		
		for (key in obj) {
			if (!obj.hasOwnProperty(key)) { continue; }
			
			newArray.push(obj[key]);
		}
		
		return newArray;
	};
	
	/**
	 * convert the object into an array
	 * 
	 * @param {Object} obj — some object
	 * @return {Array}
	 *
	 * @example
	 * $C.toArray({0: 1, 1: 2});
	 */
	Collection.toArray = function (obj) {
		var newArray = [], key;
		
		for (key in obj) {
			if (!obj.hasOwnProperty(key)) { continue; }
			
			newArray.push(obj[key]);
		}
		
		return newArray;
	};