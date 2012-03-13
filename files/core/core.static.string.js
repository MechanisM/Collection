		
	/////////////////////////////////
	//// string methods
	/////////////////////////////////
	
	/**
	 * removes all leading and trailing whitespace characters
	 *
	 * @param {String} str — the source string
	 * @return {String}
	 *
	 * @example
	 * $C.trim(' test'); // returns 'test'
	 * $C.trim(' test '); // returns 'test'
	 */
	C.trim = function (str) {
		var str = str.replace(/^\s\s*/, ''),
			ws = /\s/,
			i = str.length;
		
		while (ws.test(str.charAt((i -= 1)))) {};
		return str.substring(0, i + 1);
	};
	
	/**
	 * toUpperCase function
	 * 
	 * @param {String} str — some str
	 * @param {Number} [max=str.length] — the maximum number of characters
	 * @param {Number} [from=0] — start position
	 * @return {String}
	 *
	 * @example
	 * $C.toUpperCase('test'); // returns 'TEST'
	 * $C.toUpperCase('test', 2); // returns 'TEst'
	 * $C.toUpperCase('test', 2, 1); // returns tESt'
	 */
	C.toUpperCase = function (str, max, from) {
		from = from || 0;
		max = C.isExists(max) ? from + max : str.length;
		
		return str.substring(0, from) + str.substring(from, max).toUpperCase() + str.substring(max);
	};
	/**
	 * toLowerCase function
	 * 
	 * @param {String} str — some str
	 * @param {Number} [max=str.length] — the maximum number of characters
	 * @param {Number} [from=0] — start position
	 * @return {String}
	 *
	 * @example
	 * $C.toLowerCase('TEST'); // returns 'test'
	 * $C.toLowerCase('TEST', 2); // returns 'teST'
	 * $C.toLowerCase('TEST', 2, 1); // returns TesT'
	 */
	C.toLowerCase = function (str, max, from) {
		from = from || 0;
		max = C.isExists(max) ? from + max : str.length;
		
		return str.substring(0, from) + str.substring(from, max).toLowerCase() + str.substring(max);
	};