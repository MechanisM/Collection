	
	/////////////////////////////////
	//// mult methods (remove)
	/////////////////////////////////
	
	/**
	 * remove an elements from the collection using filter or by link (in context)<br/>
	 * events: onRemove
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of deletions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.remove('eq(-1) > c').get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.remove(':i == 2').get();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.remove(function (el, key, data, i) { return i == 1; }).get();
	 */
	Collection.prototype.remove = function (filter, id, mult, count, from, indexOf) {
		// overload
		if (Collection.isNumber(filter) || (arguments.length <= 2  && !Collection.isBoolean(id) && Collection.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || filter === false) {
				return this._removeOne(filter, id || '');
			} else if (Collection.isArray(filter) || Collection.isPlainObject(filter)) { return this._remove(filter, id || ''); }
		
		var elements = this.search.apply(this, arguments), i = elements.length;
		
		if (!Collection.isArray(elements)) {
			this._removeOne(elements, id);
		} else {
			while ((i -= 1) > -1) { this._removeOne(elements[i], id); }
		}
	
		return this;
	};
	/**
	 * remove an one element from the collection using filter or by link (in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] — filter function, string expression or context (overload)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.removeOne(':i % 2 !== 0').get();
	 * $C([{a: 1}, {b: 2}, {c: 3}])
	 *	.removeOne(function (el, key, data, i) {
	 *		return i % 2 !== 0;
	 *	}).get();
	 */
	Collection.prototype.removeOne = function (filter, id) {
		return this.remove(filter || '', id || '', false);
	};