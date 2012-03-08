		
	/////////////////////////////////
	//// data types
	/////////////////////////////////
	
	var toString = function (obj) { return Object.prototype.toString.call(obj); };
	
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
	C.isString = function (obj) { return toString(obj) === '[object String]'; };
	
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
	C.isNumber = function (obj) { return toString(obj) === '[object Number]'; };
	
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
	C.isBoolean = function (obj) { return toString(obj) === '[object Boolean]'; };
	
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
	C.isFunction = function (obj) { return toString(obj) === '[object Function]'; };
	
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
	C.isArray = function (obj) { return toString(obj) === '[object Array]'; };
	
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
	C.isPlainObject = function (obj) { return toString(obj) === '[object Object]'; };
	
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