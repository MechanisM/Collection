	
	/////////////////////////////////
	//// compile (function)
	/////////////////////////////////
	
	/**
	 * compile function
	 * 
	 * @param {String} str — some string
	 * @return {Function}
	 */
	Collection.prototype._compileFunc = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split(this.VARIABLE[0]).join('cObj.getVariable("').split(this.VARIABLE[1]).join('")');
		
		return new Function('el', 'key', 'data', 'i', 'length', 'cObj', 'id', str.replace(this.DEF_REGEXP, '') + ';');
	};