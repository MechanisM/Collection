	
	/////////////////////////////////
	//// mult methods (get)
	/////////////////////////////////
	
	/**
	 * get the elements using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {mixed}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get('eq(-1) > c');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get(function (el, i, data) { return i % 3 === 0; });
	 */
	Collection.prototype.get = function (filter, id, mult, count, from, indexOf) {
		// overload
		if (Collection.isNumber(filter) || (arguments.length <= 2 && !Collection.isBoolean(id) && Collection.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || filter === false) {
				return this._getOne(filter, id || '');
			}
		
		// if id is Boolean (overload)
		if (Collection.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		} else { id = id || ''; }
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var result = mult === true ? [] : -1,
			
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (mult === true) {
					result.push(data[key]);
				} else { result = data[key]; }
	
				return true;
			};
		
		this.forEach(action, filter || '', id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * get the one element using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {mixed}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.getOne(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.getOne(function (el, i, data) {
	 *		return i % 3 === 0;
	 *	});
	 */
	Collection.prototype.getOne = function (filter, id) {
		return this.get(filter || '', id || '', false);
	};