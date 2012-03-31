	
	/////////////////////////////////
	//// mult methods (search)
	/////////////////////////////////
	
	/**
	 * search for elements using filter (returns a reference to elements) (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID or string expression (ID + >> + ID to be stored in the stack (if >>> ID will become active))
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number} [count] — maximum number of results (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Number|Array}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.search(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.search(function (el, key, data, i) { return i % 3 === 0; });
	 */
	Collection.prototype.search = function (filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		id = id || '';
		mult = mult === false ? false : true;
		var res = mult === true ? [] : -1,
			to, set = false,
			arg = Collection.toArray(arguments),
			action;
		
		// overload ID
		if (id.search(this.SPLITTER) !== -1) {
			id = id.split(this.SPLITTER);
			set = true;
		} else { id = id.split(this.SHORT_SPLITTER); }
		id[1] && (to = Collection.trim(id[1]));
		id = arg[1] = Collection.trim(id[0]);
		
		if (mult === true) {
			/** @private */
			action = function (el, key) { res.push(key); };
		} else {
			/** @private */
			action = function (el, key) { res = key; };
		}
		
		arg.unshift(action);
		this.forEach.apply(this, arg);
		
		// save result
		if (to) {
			this._push('collection', to, res);
			
			if (set == true) { return this._set('collection', to); }
			return this;
		}
		
		return res;
	};
	/**
	 * search for one element using filter (returns a reference to element) (in context)
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID or string expression (ID + >> + ID to be stored in the stack (if >>> ID will become active))
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Number|Array}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.searchOne(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.searchOne(function (el, key, data, i) { return i % 3 === 0; });
	 */
	Collection.prototype.searchOne = function (filter, id, from, indexOf, lastIndexOf, rev) {
		return this.search(filter || '', id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
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
		
		return this.searchOne(function (el) { return el === searchElement; }, id, '', fromIndex);
	};
	/**
	 * returns the last index/key at which a given element can be found in the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement — element to locate in the array
	 * @param {fromIndex} [fromIndex=Collection Length] — the index at which to start searching backwards
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
		var data = Collection.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		return this.searchOne(function (el) { return el === searchElement; }, id, '', fromIndex, '', true);
	};