	
	/////////////////////////////////
	//// statistic methods (group)
	/////////////////////////////////
	
	/**
	 * get statistic information for group
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
	 * var db = $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.pushSetCollection('test', db.group(':el % 2 === 0'));
	 * console.log(db.groupStat('count'));
	 * @example
	 * var db = $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.pushSetCollection('test', db.group(':el % 2 === 0'));
	 * console.log(db.groupStat('min'));
	 */
	Collection.prototype.groupStat = function (oper, field, filter, id, count, from, indexOf, lastIndexOf, rev) {
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
			
			res = {},
			tmp = {},
			
			to = id.to,
			set = id.set,
			
			key,
			deepAction, action;
		
		id = id.id;
		
		if (oper !== 'first' && oper !== 'last') {
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (!res[key]) { res[key] = tmp[key] = 0; };
				
				if (oper !== 'first' && oper !== 'last') {
					cObj
						._update('context', '+=' + C.CHILDREN + (deepAction.key = key))
						.forEach(deepAction, filter || '', id, '', count, from, indexOf, lastIndexOf, rev)
						.parent();
				}
					
				return true;
			};
		} else if (oper === 'first') {
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (!res[key]) { res[key] = tmp[key] = 0; };
				res[key] = C.byLink(el, C.ORDER[0] + '0' + C.ORDER[1]);
					
				return true;
			};
		} else {
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (!res[key]) { res[key] = tmp[key] = 0; };
				res[key] = C.byLink(el, C.ORDER[0] + '-1' + C.ORDER[1]);
					
				return true;
			};
		}
		
		switch (oper) {
			case 'count' : {
				/** @private */
				deepAction = function () { res[this.key] += 1; };				
			} break;
			
			case 'summ' : {
				if (fieldIsString) {
					/** @private */
					deepAction = function (el) {
						var param = C.byLink(el, field);
						res[this.key] += param;
						
						return true;
					};
				} else {
					/** @private */
					deepAction = function () {
						var param = field.apply(this, arguments);
						res[this.key] += param;
						
						return true;
					};
				}
			} break;
			
			case 'avg' : {
				if (fieldIsString) {
					/** @private */
					deepAction = function (el) {
						var param = C.byLink(el, field);
						
						tmp[this.key] += 1;
						res[this.key] += param;
						
						return true;
					};
				} else {
					/** @private */
					deepAction = function () {
						var param = field.apply(this, arguments);
						
						tmp[this.key] += 1;
						res[this.key] += param;
						
						return true;
					};
				}
			} break;
			
			case 'max' : {
				if (fieldIsString) {
					/** @private */
					deepAction = function (el) {
						var param = C.byLink(el, field);
						if (param > res[this.key]) { res[this.key] = param; }
						
						return true;
					};
				} else {
					/** @private */
					deepAction = function () {
						var param = field.apply(this, arguments);
						if (param > res[this.key]) { res[this.key] = param; }
						
						return true;
					};
				}
			} break;
			
			case 'min' : {
				if (fieldIsString) {
					/** @private */
					deepAction = function (el) {
						var param = C.byLink(el, field);
						
						if (tmp[this.key] === 0) {
							res[this.key] = param;
							tmp[this.key] = 1;
						} else if (param < res[this.key]) { res[this.key] = param; }
						
						return true;
					};
				} else {
					/** @private */
					deepAction = function () {
						var param = field.apply(this, arguments);
						
						if (tmp[this.key] === 0) {
							res[this.key] = param;
							tmp[this.key] = 1;
						} else if (param < res[this.key]) { res[this.key] = param; }
						
						return true;
					};
				}
			} break;
			
			default : {
				if (!operIsString) {
					if (fieldIsString) {
						/** @private */
						deepAction = function (el) {
							var param = C.byLink(el, field);
							res[this.key] = oper(param, res[this.key]);
							
							return true;
						};
					} else {
						/** @private */
						deepAction = function () {
							var param = field.apply(this, arguments);
							res[this.key] = oper(param, res[this.key]);
							
							return true;
						};
					}
					
				} else {
					if (fieldIsString) {
						/** @private */
						deepAction = function (el) {
							var param = C.byLink(el, field);
							
							if (tmp[this.key] === 0) {
								res[this.key] = param;
								tmp[this.key] = 1;
							} else { res[this.key] = C.expr(oper + '=' + param, res[this.key]); }
							
							return true;
						};
					} else {
						/** @private */
						deepAction = function () {
							var param = field.apply(this, arguments);
							
							if (tmp[this.key] === 0) {
								res[this.key] = param;
								tmp[this.key] = 1;
							} else { res[this.key] = C.expr(oper + '=' + param, res[this.key]); }
							
							return true;
						};
					}
				}
			}
		}
		
		this.forEach(action, '', id);
		
		if (oper === 'avg') {
			for (key in res) {
				if (!res.hasOwnProperty(key)) { continue; }
				res[key] /= tmp[key];
			}
		}
		
		// save result if need
		if (to) { return this._saveResult(to, set, res); }
		
		return res;
	};	