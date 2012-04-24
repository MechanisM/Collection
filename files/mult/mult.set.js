	
	/////////////////////////////////
	//// mult methods (set)
	/////////////////////////////////
	
	/**
	 * set new value of the elements (in context)<br/>
	 * events: onSet
	 *
	 * @this {Colletion Object}
	 * @param {Filter|String Expression|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {mixed} replaceObj — replace object (if is Function, then executed as a callback, can be used string expression) 
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set('eq(-1) > c', 4).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(':i == 2', {c: 5}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(':i == 2', ':el.c = 6').get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(function (el, key, data, i) {
	 *		return i == 2;
	 *	}, {c: 6}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(function (el, key, data, i) {
	 *		return i == 2;
	 *	}, function (el) {
	 *		return {c: 7};
	 *	}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(function (el, key, data, i) {
	 *		return i == 2;
	 *	}, function (el) {
	 *		el.c = 7;
	 *	}).get();
	 */
	Collection.prototype.set = function (filter, replaceObj, id, mult, count, from, indexOf, lastIndexOf, rev) {
		// overload
		if (C.isNumber(filter) || (C.isString(filter) && !this._isFilter(filter)) || arguments.length === 0 || filter === false) {
			return this._setOne(filter, replaceObj, id || '');
		}
		
		// events
		var e;
		this.onSet && (e = this.onSet.apply(this, arguments));
		if (e === false) { return this; }
		
		// compile replace object if need
		replaceObj = this._isStringExpression(replaceObj) ? this._compileFunc(replaceObj) : replaceObj;
		var arg, res, action,
			isFunc = C.isFunction(replaceObj);
		
		if (isFunc) {
			/** @private */
			action = function (el, key, data) {
				var res = replaceObj.apply(replaceObj, arguments);
				if (typeof res !== 'undefined') { data[key] = res; }
			};
		} else {
			/** @private */
			action = function (el, key, data) { data[key] = C.expr(replaceObj, data[key]); };
		}
		
		arg = C.unshift(arguments, action);
		arg.splice(2, 1);
		
		return this.forEach.apply(this, arg);
	};
	/**
	 * set new value of the one element (in context)<br/>
	 * events: onSet
	 *
	 * @this {Colletion Object}
	 * @param {Filter|String Expression|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {mixed} replaceObj — replace object (if is Function, then executed as a callback, can be used string expression)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.setOne(':i == 3', {c: 5}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.setOne(function (el, key, data, i) {
	 *		return i == 3;
	 *	}, {c: 6}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.setOne(function (el, key, data, i) {
	 *		return i == 3;
	 *	}, function (el) {
	 *		el.c = 7;
	 *	}).get();
	 */
	Collection.prototype.setOne = function (filter, replaceObj, id, from, indexOf, lastIndexOf, rev) {
		return this.set(filter || '', replaceObj, id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};