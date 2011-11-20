	
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