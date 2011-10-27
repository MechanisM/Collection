	
	/**
	 * Проверить на строку 
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isString = function (val) {
		return Object.prototype.toString.call(val) === "[object String]";
	};
	/**
	 * Проверить на логическое значение 
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isBoolean = function (val) {
		return Object.prototype.toString.call(val) === "[object Boolean]";
	};
	/**
	 * Проверить на число 
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isNumber = function (val) {
		return Object.prototype.toString.call(val) === "[object Number]";
	};
	/**
	 * Проверить на null и undefined
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isExist = function (val) {
		return val !== undefined && val !== "undefined" && val !== null && val !== "";
	};
	/**
	 * Метод unshift для объекта arguments
	 * 
	 * @param {Object} obj - исходный объект
	 * @param {mixed} pushVal - новое свойство
	 * @param {String|Number} [pushName=0] - имя свойства
	 * @return {Object}
	 */
	$.unshiftArguments = function (obj, pushVal) {
		var newObj = [pushVal], i = 0, oLength = obj.length;
		
		for (; i < oLength; i++) {
			newObj.push(obj[i]);
		}
		
		return newObj;
	};