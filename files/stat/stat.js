	
	/////////////////////////////////
	//// statistic methods
	/////////////////////////////////
	
	/**
	 * get statistic information
	 *  
	 * @this {Colletion Object}
	 * @param {String|Function|String Expression} [oper='count'] — operation type ('count', 'avg', 'summ', 'max', 'min', 'first', 'last'), string operator (+, -, *, /) or callback function (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Context|String Expression} [field] — field name or callback function (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @return {Colletion}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).stat('count');
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).stat('min');
	 */
	Collection.prototype.stat = function (oper, field, filter, id, count, from, indexOf) {
		oper = (oper = oper || 'count') && this._isStringExpression(oper) ? this._compileFilter(oper) : oper;
		field = (field = field || '') && this._isStringExpression(field) ? this._compileFilter(field) : field;
		id = id || '';
	
		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var operType = Collection.isString(oper),
			result = 0, tmp = 0, key,
			
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				var param = Collection.isString(field) ? Collection.byLink(el, field) : field(el, key, data, i, length, cObj, id);
				
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