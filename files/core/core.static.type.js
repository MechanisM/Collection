	
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
		if (typeof obj === 'undefined') { return C.prototype.collection(); }
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
		return obj == null ? String(obj) : C.types[C.objToString(obj)] || 'object';
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
	Collection.isString = function (obj) { return C.type(obj) === 'string'; };
	
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
	Collection.isNumber = function (obj) { return C.type(obj) === 'number'; };
	
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
	Collection.isBoolean = function (obj) { return C.type(obj) === 'boolean'; };
	
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
	Collection.isFunction = function (obj) { return C.type(obj) === 'function'; };
	
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
	Collection.isArray = function (obj) { return C.type(obj) === 'array'; };
	
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
		if (!obj || C.type(obj) !== 'object' || obj.nodeType || C.isWindow(obj)) {
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
	 * returns a Boolean indicating whether the object is a collection (hash table or array)
	 *
	 * @param {mixed} obj — object to test whether or not it is a collection
	 * @return {Boolean}
	 *
	 * @example
	 * $C.isCollection({'0': 1, '1': 2, '2': 3, 'length': 3});
	 * @example
	 * $C.isCollection([1, 2, 3]);
	 */
	Collection.isCollection = function (obj) { return C.isArray(obj) || C.isPlainObject(obj); };
	
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