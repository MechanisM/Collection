	
	/////////////////////////////////
	//// mult methods (search)
	/////////////////////////////////
	
	/**
	 * search for elements using filter (returns a reference to elements) (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (the record is equivalent to: return + string expression) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult (overload)
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count] — maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=0] — skip a number of elements
	 * @param {Number|Boolean} [indexOf=0] — starting point
	 * @param {Number|Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Number|Array}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.search(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.search(function (el, key, data, i) { return i % 3 === 0; });
	 */
	Collection.prototype.search = function (filter, id, mult, count, from, indexOf, rev) {
		// if id is Boolean (overload)
		if (Collection.isBoolean(id)) {
			rev = indexOf;
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
		rev = rev || false;
		
		var result = mult === true ? [] : -1,
			
			/** @private */
			action = function (el, key, data, i, length, cObj, id) {
				if (mult === true) {
					result.push(key);
				} else { result = key; }
				
				return true;
			};
		
		this.forEach(action, filter || '', id, mult, count, from, indexOf, rev);
		
		return result;
	};
	/**
	 * search for one element using filter (returns a reference to element) (in context)
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (the record is equivalent to: return + string expression) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [from=0] — skip a number of elements
	 * @param {Number|Boolean} [indexOf=0] — starting point
	 * @param {Number|Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Number|Array}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.searchOne(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.searchOne(function (el, key, data, i) { return i % 3 === 0; });
	 */
	Collection.prototype.searchOne = function (filter, id, from, indexOf, rev) {
		return this.search(filter || '', id || '', false, '', from || '', indexOf || '', rev || '');
	};
	
	/**
	 * returns the first index/key at which a given element can be found in the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement — element to locate in the array
	 * @param {fromIndex} [fromIndex=0] — the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Number|String}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).indexOf(1);
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).indexOf(1, 2);
	 */
	Collection.prototype.indexOf = function (searchElement, fromIndex, id) {
		id = id || '';
		fromIndex = fromIndex || '';
		
		var data = Collection.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		if (Collection.isArray(data) && data.indexOf) {
			if (fromIndex) { return data.indexOf(searchElement, fromIndex); }
			
			return data.indexOf(searchElement);
		} else { return this.search(function (el) { return el === searchElement; }, id, false, '', '', fromIndex); }
	};
	/**
	 * returns the last index/key at which a given element can be found in the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement — element to locate in the array
	 * @param {fromIndex} [fromIndex=0] — the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Number|String}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).lastIndexOf(1);
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).lastIndexOf(1, 2);
	 */
	Collection.prototype.lastIndexOf = function (searchElement, fromIndex, id) {
		id = id || '';
		fromIndex = fromIndex || '';
		
		var el, data = Collection.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		if (Collection.isArray(data) && data.lastIndexOf) {
			if (fromIndex) { return data.lastIndexOf(searchElement, fromIndex); }
			
			return data.lastIndexOf(searchElement);
		} else {
			el = this.search(function (el) { return el === searchElement; }, id, '', '', '', fromIndex);
			
			return typeof el[el.length - 1] !== 'undefined' ? el[el.length - 1] : -1;
		}
	};