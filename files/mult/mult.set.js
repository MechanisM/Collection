
	/////////////////////////////////
	//// mult methods (set)
	/////////////////////////////////
	
	/**
	 * set new value of the elements (in context)<br/>
	 * events: onSet
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {mixed} replaceObj — replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
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
	 *	.set(function (el, i, data) {
	 *		return i == 2;
	 *	}, {c: 6}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.set(function (el, i, data) {
	 *		return i == 2;
	 *	}, function (el) {
	 *		el.c = 7;
	 *	}).get();
	 */
	Collection.prototype.set = function (filter, replaceObj, id, mult, count, from, indexOf) {
		// overload
		if (Collection.isNumber(filter) || (arguments.length <= 3 && !Collection.isBoolean(id) && Collection.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || filter === false) {
				return this._setOne(filter, replaceObj, id || '');
			}
		
		var e, arg, replaceCheck = Collection.isFunction(replaceObj),
			
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (replaceCheck) {
					data[key] = replaceObj.call(replaceObj, el, key, data, i, length, cObj, id);
				} else { data[key] = Collection.expr(replaceObj, data[key]); }
	
				return true;
			};
		
		arg = Collection.unshiftArguments(arguments, action);
		arg.splice(2, 1);
		
		// events
		this.onSet && (e = this.onSet.apply(this, arguments));
		if (e === false) { return this; }
		
		return this.forEach.apply(this, arg);
	};
	/**
	 * set new value of the one element (in context)<br/>
	 * events: onSet
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {mixed} replaceObj — replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.setOne(':i == 3', {c: 5}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.setOne(function (el, i, data) {
	 *		return i == 3;
	 *	}, {c: 6}).get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.setOne(function (el, i, data) {
	 *		return i == 3;
	 *	}, function (el) {
	 *		el.c = 7;
	 *	}).get();
	 */
	Collection.prototype.setOne = function (filter, replaceObj, id) {
		return this.set(filter || '', replaceObj, id || '', false);
	};
	
	/**
	 * pass each element in the current matched set through a function (in context)<br/>
	 * events: onSet
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} replaceObj — a function that will be invoked for each element in the current set
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * // replace each even-numbered element on the value of the sine //
	 * $C([1, 2, 3, 4, 5, 6]).map(Math.sin, ':el % 2 === 0').get();
	 */
	Collection.prototype.map = function (replaceObj, filter, id) {
		return this.set(filter || '', replaceObj, id || '');
	};