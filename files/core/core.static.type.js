		
	/////////////////////////////////
	//// data types
	/////////////////////////////////
	
	var toString = function (obj) { return Object.prototype.toString.call(obj); };
	
	/**
	 * returns a Boolean indicating whether the object is a string
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 */
	C.isString = function (obj) { return toString(obj) === '[object String]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a number
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 */
	C.isNumber = function (obj) { return toString(obj) === '[object Number]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a boolean
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 */
	C.isBoolean = function (obj) { return toString(obj) === '[object Boolean]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a function
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 */
	C.isFunction = function (obj) { return toString(obj) === '[object Function]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a array (not an array-like object)
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 */
	C.isArray = function (obj) { return toString(obj) === '[object Array]'; };
	
	/**
	 * returns a Boolean indicating whether the object is a simple object
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 */
	C.isObject = function (obj) { return toString(obj) === '[object Object]'; };
	
	/**
	 * returns a Boolean value indicating that the object is not equal to: undefined, null, or '' (empty string)
	 *
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 */
	C.isExists = function (obj) { return typeof obj !== "undefined" && obj !== null && obj !== ''; };