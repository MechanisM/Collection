	
	/////////////////////////////////
	//// mult methods (remove)
	/////////////////////////////////
	
	/**
	 * remove an elements from the collection using filter or by link (in context)<br/>
	 * events: onRemove
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of deletions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
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
	Collection.prototype.remove = function (filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		// overloads
		if (C.isNumber(filter) || (C.isString(filter) && !this._isFilter(filter)) || arguments.length === 0 || filter === false) {
			return this._removeOne(filter, id || '');
		} else if (C.isArray(filter) || C.isPlainObject(filter)) { return this._remove(filter, id || ''); }
		
		var elements = this.search.apply(this, arguments), i = elements.length;
		
		if (!C.isArray(elements)) {
			this._removeOne(elements, id);
		} else {
			if (rev === true) {
				elements.forEach(function (el) {
					this._removeOne(el, id);
				}, this);
			} else { this._remove(elements, id); }
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
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
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
	Collection.prototype.removeOne = function (filter, id, from, indexOf, lastIndexOf, rev) {
		return this.remove(filter || '', id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};
	
	/**
	 * remove an element from the collection (pop) (in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3]).pop().getCollection();
	 */
	Collection.prototype.pop = function (id, filter, from, indexOf, lastIndexOf) {
		id = id || '';
		
		if (C.isNumber(filter) || (C.isString(filter) && !this._isFilter(filter)) || arguments.length < 2 || filter === false) {
			return this._removeOne('eq(-1)', id);
		}
		
		return this.removeOne(filter || '', id, from || '', indexOf || '', lastIndexOf || '', true);	
	};
	/**
	 * remove an element from the collection (shift) (in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3]).shift().getCollection();
	 */
	Collection.prototype.shift = function (id, filter, from, indexOf, lastIndexOf) {
		id = id || '';
		
		if (C.isNumber(filter) || (C.isString(filter) && !this._isFilter(filter)) || arguments.length < 2 || filter === false) {
			return this._removeOne('eq(0)', id);
		}
		
		return this.removeOne(filter || '', id, from || '', indexOf || '', lastIndexOf || '');	
	};