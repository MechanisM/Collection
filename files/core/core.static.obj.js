		
	/////////////////////////////////
	//// methods of arrays and objects
	/////////////////////////////////
	
	/**
	 * find the value in the array
	 *
	 * @param {mixed} val — some object
	 * @param {Array} array — some array
	 * @return {Boolean}
	 */
	C.find = function (val, array) {
		for (var i = array.length; (i -= 1) > -1;) {
			if (val === array[i]) { return true; }
		}
		
		return false;
	};
	
	/**
	 * merge the contents of two or more objects together into the first object
	 *
	 * @param {Boolean|Object} [deep=target] — if true, the merge becomes recursive (overload) or the object to extend
	 * @param {Object} [target] — the object to extend
	 * @param {Object} [objectN]  — additional objects containing properties to merge in
	 * @return {Boolean}
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
		if (typeof target !== "object" && !C.isFunction(target)) { target = {}; }
	
		// extend Collection itself if only one argument is passed
		if (length === i) {
			target = C;
			i -= 1;
		}
	
		while ((i += 1) < length) {
			// only deal with non-null/undefined values
			if (C.isExists(options = arguments[i])) {
				// extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];
	
					// prevent never-ending loop
					if (target === copy) { continue; }
	
					// recurse if we're merging plain objects or arrays
					if (deep && copy && (C.isObject(copy) || (copyIsArray = C.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && C.isArray(src) ? src : [];
						} else { clone = src && C.isObject(src) ? src : {}; }
	
						// never move original objects, clone them
						target[name] = C.extend(deep, clone, copy);
					
					// don't bring in undefined values
					} else if (typeof copy !== "undefined") { target[name] = copy; }
				}
			}
		}
	
		return target;
	};
		
	/**
	 * add new element to object
	 *
	 * @this {nimble}
	 * @param {Plain Object} obj — some object
	 * @param {String} active — property name (can use '->unshift' — the result will be similar to work for an array unshift)
	 * @param {mixed} value — some value
	 * @return {Plain Object|Boolean}
	 */
	C.addElementToObject = function (obj, active, value) {
		active = active.split(this.METHOD_SEPARATOR);
		var key, newObj = {};
	
		if (active[1] && active[1] === 'unshift') {
			newObj[!isNaN(Number(active[0])) ? 0 : active[0]] = value;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) { newObj[!isNaN(Number(key)) ? +key + 1 : key] = obj[key]; }
			}
			obj = newObj;
	
			return obj;
		} else if (!active[1] || active[1] === 'push') { obj[active[0]] = value; }
	
		return true;
	};