	
	/////////////////////////////////
	//// statistic methods (group)
	/////////////////////////////////
	
	/**
	 * get statistic information for group
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
	 * var db = $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.pushSetCollection('test', db.group(':el % 2 === 0'));
	 * console.log(db.groupStat('count'));
	 * @example
	 * var db = $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.pushSetCollection('test', db.group(':el % 2 === 0'));
	 * console.log(db.groupStat('min'));
	 */
	Collection.prototype.groupStat = function (oper, field, filter, id, count, from, indexOf) {
		oper = oper || 'count';
		id = id || '';

		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var operType = Collection.isString(oper),
			result = {}, tmp = {}, key,
			
			/** @private */
			deepAction = function (el, key, data, i, length, cObj, id) {
				var param = Collection.byLink(el, field || '');
				
				switch (oper) {
					case 'count' : {
						result[this.key] += 1;
					} break;
					case 'summ' : {
						result[this.key] += param;
					} break;
					case 'avg' : {
						tmp[this.key] += 1;
						result[this.key] += param;
					} break;
					case 'max' : {
						if (param > result[this.key]) { result[this.key] = param; }
					} break;
					case 'min' : {
						if (tmp[this.key] === 0) {
							result[this.key] = param;
							tmp[this.key] = 1;
						} else if (param < result[this.key]) { result[this.key] = param; }
					} break;
					default : {
						if (!operType) {
							result[this.key] = oper(param, result[this.key]);
						} else {
							if (tmp[this.key] === 0) {
								result[this.key] = param;
								tmp[this.key] = 1;
							} else { result[this.key] = Collection.expr(oper + '=' + param, result[this.key]); }
						}
					}
				}
					
				return true;
			},
			
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (!result[key]) { result[key] = tmp[key] = 0; };
				
				if (oper !== 'first' && oper !== 'last') {
					cObj
						._update('context', '+=' + Collection.CHILDREN + (deepAction.key = key))
						.forEach(deepAction, filter || '', id, '', count, from, indexOf)
						.parent();
				} else if (oper === 'first') {
					result[key] = Collection.byLink(el, Collection.ORDER[0] + '0' + Collection.ORDER[1]);
				} else { result[key] = Collection.byLink(el, Collection.ORDER[0] + '-1' + Collection.ORDER[1]); }
					
				return true;
			};
		
		this.forEach(action, '', id);
		
		if (oper === 'avg') {
			for (key in result) {
				if (!result.hasOwnProperty(key)) { continue; }
				result[key] /= tmp[key];
			}
		}
	
		return result;
	};	