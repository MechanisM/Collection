		
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
	Collection.toString = function (obj) {
		if (typeof obj === 'undefined') { return Collection.prototype.collection(); }
		return Object.prototype.toString.call(obj);
	};
	
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
	Collection.type = function (obj) {
		return obj == null ? String(obj) : Collection.types[Collection.toString(obj)] || 'object';
	}
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
	 * $C.isString('test'); // returns true
	 * $C.isString(2); // returns false
	 */
	Collection.isString = function (obj) { return Collection.type(obj) === 'string'; };
	
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
	Collection.isNumber = function (obj) { return Collection.type(obj) === 'number';  };
	
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
	Collection.isBoolean = function (obj) { return Collection.type(obj) === 'boolean'; };
	
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
	Collection.isFunction = function (obj) { return Collection.type(obj) === 'function';  };
	
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
	Collection.isArray = function (obj) { return Collection.type(obj) === 'array';  };
	
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
	 * $C.isCollection({'0': 1, '1': 2, '2': 3, 'length': 3}); // returns true
	 * $C.isCollection([1, 2, 3]); // returns true
	 */
	Collection.isCollection = function (obj) { return Collection.isArray(obj) || Collection.isPlainObject(obj); };
	
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
	Collection.isExists = function (obj) { return typeof obj !== 'undefined' && obj !== null && obj !== ''; };