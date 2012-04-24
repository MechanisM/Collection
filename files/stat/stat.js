	
	/////////////////////////////////
	//// statistic methods
	/////////////////////////////////
	
	/**
	 * get statistic information
	 *  
	 * @this {Colletion Object}
	 * @param {String|Function|String Expression} [oper='count'] — operation type ('count', 'avg', 'summ', 'max', 'min', 'first', 'last'), string operator (+, -, *, /) or callback function (can be used string expression, the record is equivalent to: return + string expression)
	  * @param {Context|String Expression} [field] — field name or callback function (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Filter|String Expression|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String|String Expression} [id=this.ACTIVE] — collection ID or string expression (ID + >> + [+] (optional, if the collection already exists, the data will be modified) + ID (to be stored in the stack (if >>> ID will become active)) + :context (optional), example: test>>>+test2:a>eq(-1))
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).stat('count');
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 7, 0]).stat('min');
	 */
	Collection.prototype.stat = function (oper, field, filter, id, count, from, indexOf, lastIndexOf, rev) {
		oper = (oper = oper || 'count') && this._isStringExpression(oper) ? this._compileFilter(oper) : oper;
		field = (field = field || '') && this._isStringExpression(field) ? this._compileFilter(field) : field;
		id = this._splitId(id);
	
		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		lastIndexOf = parseInt(lastIndexOf) || false;
		rev = rev || false;
		
		var operIsString = C.isString(oper),
			fieldIsString = C.isString(field),
			
			res = 0,
			tmp = 0,
			
			to = id.to,
			set = id.set,
			
			action;
		
		id = id.id;
		
		switch (oper) {
			case 'count' : {
				/** @private */
				action = function () { res += 1; };
			} break;
			
			case 'summ' : {
				if (fieldIsString) {
					/** @private */
					action = function (el) {
						var param = C.byLink(el, field);
						res += param;
						
						return true;
					};
				} else {
					/** @private */
					action = function () {
						var param = field.apply(this, arguments);
						res += param;
						
						return true;
					};
				}
			} break;
			
			case 'avg' : {
				if (fieldIsString) {
					/** @private */
					action = function (el) {
						var param = C.byLink(el, field);
						
						tmp += 1;
						res += param;
						
						return true;
					};
				} else {
					/** @private */
					action = function () {
						var param = field.apply(this, arguments);
						
						tmp += 1;
						res += param;
						
						return true;
					};
				}
			} break;
			
			case 'max' : {
				if (fieldIsString) {
					/** @private */
					action = function (el) {
						var param = C.byLink(el, field);
						if (param > res) { res = param; }
						
						return true;
					};
				} else {
					/** @private */
					action = function () {
						var param = field.apply(this, arguments);
						if (param > res) { res = param; }
						
						return true;
					};
				}
			} break;
			
			case 'min' : {
				if (fieldIsString) {
					/** @private */
					action = function (el) {
						var param = C.byLink(el, field);
						
						if (tmp === 0) {
							res = param;
							tmp = 1;
						} else if (param < res) { res = param; }
						
						return true;
					};
				} else {
					/** @private */
					action = function () {
						var param = field.apply(this, arguments);
						
						if (tmp === 0) {
							res = param;
							tmp = 1;
						} else if (param < res) { res = param; }
						
						return true;
					};
				}
			} break;
			
			default : {
				if (!operIsString) {
					if (fieldIsString) {
						/** @private */
						action = function (el) {
							var param = C.byLink(el, field);
							res = oper(param, res);
							
							return true;
						};
					} else {
						/** @private */
						action = function () {
							var param = field.apply(this, arguments);
							res = oper(param, res);
							
							return true;
						};
					}
					
				} else {
					if (fieldIsString) {
						/** @private */
						action = function (el) {
							var param = C.byLink(el, field);
							
							if (tmp === 0) {
								res = param;
								tmp = 1;
							} else { res = C.expr(oper + '=' + param, res); }
							
							return true;
						};
					} else {
						/** @private */
						action = function () {
							var param = field.apply(this, arguments);
							
							if (tmp === 0) {
								res = param;
								tmp = 1;
							} else { res = C.expr(oper + '=' + param, res); }
							
							return true;
						};
					}
				}
			}
		}
		
		if (oper !== 'first' && oper !== 'last') {
			this.forEach(action, filter || '', id, '', count, from, indexOf, lastIndexOf, rev);
			
			if (oper === 'avg') { res /= tmp; }
		} else if (oper === 'first') {
			res = this._getOne(C.ORDER[0] + '0' + C.ORDER[1]);
		} else { res = this._getOne(C.ORDER[0] + '-1' + C.ORDER[1]); }
		
		// save result if need
		if (to) { return this._saveResult(to, set, res); }
		
		return res;
	};