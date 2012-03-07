		
	/////////////////////////////////
	//// string methods
	/////////////////////////////////
	
	/**
	 * removes all leading and trailing whitespace characters
	 *
	 * @param {String} str — some string
	 * @return {String}
	 */
	C.trim = function (str) {
		var
			str = str.replace(/^\s\s*/, ''),
			ws = /\s/,
			i = str.length;
		
		while (ws.test(str.charAt((i -= 1)))) {};
		return str.substring(0, i + 1);
	};