
	/////////////////////////////////
	//// mult methods (map)
	/////////////////////////////////
	
	/**
	 * pass each element in the current matched set through a function and return new object (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} replaceObj — a function that will be invoked for each element in the current set
	 * @param {Filter|String Expression|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {String|String Expression} [id=this.ACTIVE] — collection ID or string expression (ID + >> + [+] (optional, if the collection already exists, the data will be modified) + ID (to be stored in the stack (if >>> ID will become active)) + :context (optional), example: test>>>+test2:a>eq(-1))
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
	 * $C([1, 2, 3, 4, 5, 6]).map(Math.sin, ':el % 2 === 0', '>>>test').get();
	 */
	Collection.prototype.map = function (replaceObj, filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		// overload ID
		id = this._splitId(id);
		
		var res,
			to = id.to,
			set = id.set,
			
			arg = C.toArray(arguments),
			isFunc, isExists, isArray,
			action;
		
		id = arg[2] = id.id;
		
		// compile replace object if need
		replaceObj = this._isStringExpression(replaceObj) ? this._compileFilter(replaceObj) : replaceObj || '';
		
		isFunc = C.isFunction(replaceObj);
		isExists = !isFunc && C.isExists(replaceObj);
		isArray = C.isArray(this._getOne('', id));
		
		if (isArray) {
			res = [];
		} else { res = {}; }
		
		if (isFunc) {
			if (isArray) {
				/** @private */
				action = function () {
					res.push(replaceObj.apply(replaceObj, arguments));
				};
			} else {
				/** @private */
				action = function (el, key) {
					res[key] = replaceObj.apply(replaceObj, arguments);
				};
			}
		} else {
			if (isExists) {
				if (isArray) {
					/** @private */
					action = function (el, key, data) {
						res.push(C.expr(replaceObj, data[key]));
					};
				} else {
					/** @private */
					action = function (el, key, data) {
						res[key] = C.expr(replaceObj, data[key]);
					};
				}
			} else {
				if (isArray) {
					/** @private */
					action = function (el, key, data) {
						res.push(data[key]);
					};
				} else {
					/** @private */
					action = function (el, key, data) {
						res[key] = data[key];
					};
				}
			}
		}
		
		arg.unshift(action);
		arg.splice(1, 1);
		this.forEach.apply(this, arg);
		
		// save result if need
		if (to) { return this._saveResult(to, set, res); }
		
		return res;
	};