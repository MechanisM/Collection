	
	/////////////////////////////////
	//// statistic methods
	/////////////////////////////////
	
	/**
	 * get statistic information
	 *  
	 * @this {Colletion Object}
	 * @param {String|Function} [oper='count'] — operation type ('count', 'avg', 'summ', 'max', 'min', 'first', 'last'), string operator (+, -, *, /) or callback function
	 * @param {Context} [field] — field name
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).stat('count');
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).stat('min');
	 */
	Collection.prototype.stat = function (oper, field, filter, id, count, from, indexOf) {
		oper = oper || 'count';
		id = id || '';
	
		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var operType = Collection.isString(oper),
			result = 0, tmp = 0, key,
			
			/** @private */
			action = function (el, i, data, cOLength, self, id) {
				var param = Collection.byLink(el, field || '');
				
				switch (oper) {
					case 'count' : {
						result += 1;
					} break;
					case 'summ' : {
						result += param;
					} break;
					case 'avg' : {
						tmp += 1;
						result += param;
					} break;
					case 'max' : {
						if (param > result) { result = param; }
					} break;
					case 'min' : {
						if (tmp === 0) {
							result = param;
							tmp = 1;
						} else if (param < result) { result = param; }
					} break;
					default : {
						if (!operType) {
							result = oper(param, result);
						} else {
							if (tmp === 0) {
								result = param;
								tmp = 1;
							} else { result = Collection.expr(oper + '=' + param, result); }
						}
					}
				}
					
				return true;
			};
		
		if (oper !== 'first' && oper !== 'last') {
			this.forEach(action, filter || '', id, '', count, from, indexOf);
			
			if (oper === 'avg') { result /= tmp; }
		} else if (oper === 'first') {
			result = this._getOne(Collection.ORDER[0] + '0' + Collection.ORDER[1]);
		} else { result = this._getOne(Collection.ORDER[0] + '-1' + Collection.ORDER[1]); }
	
		return result;
	};