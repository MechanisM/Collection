			/////////////////////////////////	//// string methods	/////////////////////////////////		/**	 * removes all leading and trailing whitespace characters	 *	 * @param {String} str — the source string	 * @return {String}	 *	 * @example	 * $Collection.trim(' test'); // returns 'test'	 * $Collection.trim(' test '); // returns 'test'	 */	Collection.trim = function (str) {		var str = str.replace(/^\s\s*/, ''),			ws = /\s/,			i = str.length;				while (ws.test(str.charAt((i -= 1)))) {};		return str.substring(0, i + 1);	};		/**	 * toUpperCase function	 * 	 * @param {String} str — some str	 * @param {Number} [max=str.length] — the maximum number of characters	 * @param {Number} [from=0] — start position	 * @return {String}	 *	 * @example	 * $Collection.toUpperCase('test'); // returns 'TEST'	 * $Collection.toUpperCase('test', 2); // returns 'TEst'	 * $Collection.toUpperCase('test', 2, 1); // returns tESt'	 */	Collection.toUpperCase = function (str, max, from) {		from = from || 0;		max = Collection.isExists(max) ? from + max : str.length;				return str.substring(0, from) + str.substring(from, max).toUpperCase() + str.substring(max);	};	/**	 * toLowerCase function	 * 	 * @param {String} str — some str	 * @param {Number} [max=str.length] — the maximum number of characters	 * @param {Number} [from=0] — start position	 * @return {String}	 *	 * @example	 * $Collection.toLowerCase('TEST'); // returns 'test'	 * $Collection.toLowerCase('TEST', 2); // returns 'teST'	 * $Collection.toLowerCase('TEST', 2, 1); // returns TesT'	 */	Collection.toLowerCase = function (str, max, from) {		from = from || 0;		max = Collection.isExists(max) ? from + max : str.length;				return str.substring(0, from) + str.substring(from, max).toLowerCase() + str.substring(max);	};