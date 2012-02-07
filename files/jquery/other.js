	
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
