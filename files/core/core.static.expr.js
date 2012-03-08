		
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
	 * $C.expr('+=1', 2); // returns 3
	 * $C.expr('*=2', 2); // returns 4
	 * $C.expr('+=2', 'test'); // returns '2test'
	 */
	C.expr = function (val, old) {
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
	
