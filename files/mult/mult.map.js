
	/////////////////////////////////
	//// mult methods (map)
	/////////////////////////////////
	
	/**
	 * pass each element in the current matched set through a function and return new object (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} replaceObj — a function that will be invoked for each element in the current set
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (the record is equivalent to: return + string expression), context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {mixed}
	 *
	 * @example
	 * // replace each even-numbered element on the value of the sine //
	 * $C([1, 2, 3, 4, 5, 6]).map(Math.sin, ':el % 2 === 0');
	 */
	Collection.prototype.map = function (replaceObj, filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		// compile replace object if need
		replaceObj = this._isStringExpression(replaceObj) ? this._compileFilter(replaceObj) : replaceObj;
		var e, arg, res,
			isExists = Collection.isExists(replaceObj),
			isFunc = Collection.isFunction(replaceObj),
			
			isArray = null,

			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (isArray === null) {
					isArray = Collection.isArray(data);
					if (isArray) {
						res = [];
					} else { res = {}; }
				}
				
				if (isFunc) {
					if (isArray) {
						res.push(replaceObj.apply(replaceObj, arguments));
					} else {
						res[key] = replaceObj.apply(replaceObj, arguments);
					}
				} else {
					if (isExists) {
						if (isArray) {
							res.push(Collection.expr(replaceObj, data[key]));
						} else {
							res[key] = Collection.expr(replaceObj, data[key]);
						}
					} else {
						if (isArray) {
							res.push(data[key]);
						} else {
							res[key] = data[key];
						}
					}
				}
	
				return true;
			};
		
		arg = Collection.unshiftArguments(arguments, action);
		arg.splice(1, 1);
		
		this.forEach.apply(this, arg);
		return res;
	};