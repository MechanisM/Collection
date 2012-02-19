	
	/////////////////////////////////
	//// jQuery methods (other)
	/////////////////////////////////
	
	/**
	 * <i lang="en">returns a Boolean indicating whether the object is a string</i>
	 * <i lang="ru">проверить, является ли объект строкой</i>
	 *
	 * @param {mixed} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
	 * @return {Boolean}
	 */
	$.isString = function (val) { return nimble.isString(val); };
	/**
	 * <i lang="en">returns a Boolean indicating whether the object is a string</i>
	 * <i lang="ru">проверить, является ли объект логическим значением</i>
	 *
	 * @param {mixed} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
	 * @return {Boolean}
	 */
	$.isBoolean = function (val) {
		return Object.prototype.toString.call(val) === "[object Boolean]";
	};
	/**
	 * <i lang="en">returns a Boolean value indicating that the object is not equal to: undefined, null, or "" (empty string)</i>
	 * <i lang="ru">проверить, существует ли объект (проверка типов undefined, null, "")</i>
	 *
	 * @param {mixed} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
	 * @return {Boolean}
	 */
	$.isExists = function (val) { return nimble.isExists(val); };
	/**
	 * <i lang="en">unshift for arguments (object)</i>
	 * <i lang="ru">использовать "unshift" для объекта</i>
	 * 
	 * @param {Object} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
	 * @param {mixed} pushVal — <i lang="en">new value</i><i lang="ru">новое значение</i>
	 * @return {Array}
	 */
	$.unshiftArguments = function (obj, pushVal) {
		var newObj = [pushVal], i = -1, oLength = obj.length;
		while ((i += 1) < oLength) { newObj.push(obj[i]); }
		
		return newObj;
	};
	/**
	 * <i lang="en">toUpperCase function</i>
	 * <i lang="ru">перевести строку в верхний регистр</i>
	 * 
	 * @param {String} str — <i lang="en">some str</i><i lang="ru">исходная строка</i>
	 * @param {Number} [max=str.length] — <i lang="en">the maximum number of characters</i><i lang="ru">максимальное количество символов</i>
	 * @param {Number} [from=0] — <i lang="en">start position</i><i lang="ru">начальная позиция</i>
	 * @return {String}
	 */
	$.toUpperCase = function (str, max, from) {
		from = from || 0;
		max = $.isExists(max) ? from + max : str.length;
		
		return str.substring(0, from) + str.substring(from, max).toUpperCase() + str.substring(max);
	};
	/**
	 * <i lang="en">toLowerCase function</i>
	 * <i lang="ru">перевести строку в нижний регистр</i>
	 * 
	 * @param {String} str — <i lang="en">some str</i><i lang="ru">исходная строка</i>
	 * @param {Number} [max=str.length] — <i lang="en">the maximum number of characters</i><i lang="ru">максимальное количество символов</i>
	 * @param {Number} [from=0] — <i lang="en">start position</i><i lang="ru"><i lang="ru">начальная позиция</i>
	 * @return {String}
	 */
	$.toLowerCase = function (str, max, from) {
		from = from || 0;
		max = $.isExists(max) ? from + max : str.length;
		
		return str.substring(0, from) + str.substring(from, max).toLowerCase() + str.substring(max);
	};
	
	/**
	 * <i lang="en">get random integer number</i>
	 * <i lang="ru">получить случайное число в интервале</i>
	 * 
	 * @param {Number} min — <i lang="en">min number</i><i lang="ru">левая граница</i>
	 * @param {Number} max — <i lang="en">max number</i><i lang="ru">правая граница</i>
	 * @return {Number}
	 */
	$.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
