		
	/////////////////////////////////
	//// expressions
	/////////////////////////////////
	
	/**
	 * calculate math expression for string
	 * 
	 * @param {mixed} val — new value
	 * @param {mixed} old — old value
	 * @return {Number|String}
	 *
	 * @example
	 * $C.expr('+=1', 2);
	 * @example
	 * $C.expr('*=2', 2);
	 * @example
	 * $C.expr('+=2', 'test');
	 */
	Collection.expr = function (val, old) {
		old = C.isExists(old) ? old : '';
		
		if (C.isString(val) && val.search(/^[+-\\*\/]{1}=/) !== -1) {
			val = val.split('=');
			if (!isNaN(val[1])) { val[1] = +val[1]; }
			
			// simple math
			switch (val[0]) {
				case '+': { val = old + val[1]; } break;
				case '-': { val = old - val[1]; } break;
				case '*': { val = old * val[1]; } break;
				case '/': { val = old / val[1]; } break;
			}
		}
	
		return val;
	};
	
	/**
	 * get random integer number
	 * 
	 * @param {Number} [min=0] — min number
	 * @param {Number} [max=10] — max number
	 * @return {Number}
	 *
	 * @example
	 * $C.getRandomInt(1, 15);
	 */
	Collection.getRandomInt = function (min, max) {
		min = min || 0;
		max = max || 10;
		
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
