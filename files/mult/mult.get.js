	
	/////////////////////////////////
	//// mult methods (get)
	/////////////////////////////////
	
	/**
	 * get the elements using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Context|Array|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), context (overload), array of references (for example: ['eq(-1)', '0 > 1', '0 >>> :el % 2 === 0']) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number} [count] — maximum number of results (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Array|mixed}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get('eq(-1) > c');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get(function (el, key, data, i) { return i % 3 === 0; });
	 */
	Collection.prototype.get = function (filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		id = id || '';
		
		// overload
		if (Collection.isNumber(filter) || (Collection.isString(filter) && !this._isFilter(filter)) || arguments.length === 0 || filter === false) {
			return this._getOne(filter, id);
		}
		
		mult = mult === false ? false : true;
		var res = mult === true || Collection.isArray(filter) ? [] : -1,
			action, to;
		
		// overload
		if (Collection.isArray(filter)) {
			filter.forEach(function (el) {
				res.push(this.get(el, id, mult || '', count || '', from || '', indexOf || '', lastIndexOf || '', rev || ''));
			}, this);
			
			return res;
		}
		
		if (id.split(this.SPLITTER)) {
			id[1] && (to = id[0]);
			id = id[0];
		}
		
		if (mult === true) {
			/** @private */
			action = function (el, key, data) { res.push(data[key]); };
		} else {
			/** @private */
			action = function (el, key, data) { res = data[key]; };
		}
		
		this.forEach.apply(this, Collection.unshiftArguments(arguments, action));
		//if (to) { return this.push }
		
		return res;
	};
	/**
	 * get the one element using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] — filter function, string expression (context + >>> + filter (the record is equivalent to: return + string expression)), array of references (for example: ['eq(-1)', '0 > 1', '0 >>> :el % 2 === 0']) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {mixed}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.getOne(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.getOne(function (el, key, data, i) {
	 *		return i % 3 === 0;
	 *	});
	 */
	Collection.prototype.getOne = function (filter, id, from, indexOf, lastIndexOf, rev) {
		return this.get(filter || '', id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};