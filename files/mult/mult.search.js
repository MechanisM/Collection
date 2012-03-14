	
	/////////////////////////////////
	//// mult methods (search)
	/////////////////////////////////
	
	/**
	 * search for elements using filter (returns a reference to elements)(in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Number|Array}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.search(':i % 3 === 0');
	 * db.search(function (el, i, data) { return i % 3 === 0; });
	 */
	C.prototype.search = function (filter, id, mult, count, from, indexOf) {
		// if id is Boolean (overload)
		if (C.isBoolean(id)) {
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
			action = function (el, i, data, aLength, self, id) {
				if (mult === true) {
					result.push(i);
				} else { result = i; }
				
				return true;
			};
		
		this.forEach(action, filter || '', id, mult, count, from, indexOf);
		
		return result;
	};
	/**
	 * search for one element using filter (returns a reference to element)(in context)
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Number|Array}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.searchOne(':i % 3 === 0');
	 * db.searchOne(function (el, i, data) { return i % 3 === 0; });
	 */
	C.prototype.searchOne = function (filter, id) {
		return this.search(filter || '', id || '', false);
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
	 * var db = new $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
	 * db.indexOf(1); // returns 0
	 * db.indexOf(1, 2); // returns 6
	 */
	C.prototype.indexOf = function (searchElement, fromIndex, id) {
		id = id || '';
		fromIndex = fromIndex || '';
		
		var cObj = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		if (C.isArray(cObj) && cObj.indexOf) {
			if (fromIndex) { return cObj.indexOf(searchElement, fromIndex); }
			
			return cObj.indexOf(searchElement);
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
	 * var db = new $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
	 * db.lastIndexOf(1); // returns 6
	 * db.lastIndexOf(1, 2); // returns -1
	 */
	C.prototype.lastIndexOf = function (searchElement, fromIndex, id) {
		id = id || '';
		fromIndex = fromIndex || '';
		
		var el, cObj = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		if (C.isArray(cObj) && cObj.lastIndexOf) {
			if (fromIndex) { return cObj.lastIndexOf(searchElement, fromIndex); }
			
			return cObj.lastIndexOf(searchElement);
		} else {
			el = this.search(function (el) { return el === searchElement; }, id, '', '', '', fromIndex);
			
			return typeof el[el.length - 1] !== 'undefined' ? el[el.length - 1] : -1;
		}
	};