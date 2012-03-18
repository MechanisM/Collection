	
	/////////////////////////////////
	//// mult methods (core)
	/////////////////////////////////
	
	/**
	 * returns the length of the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Collection|Boolean} [filter=this.ACTIVE] — filter function, string expression, collection or true (if disabled)
	 * @param {String|Collection} [id=this.ACTIVE] — collection ID or collection
	 * @throw {Error}
	 * @return {Number}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.length();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.length(':i % 3 === 0');
	 */
	Collection.prototype.length = function (filter, id) {
		filter = filter || '';
		var tmpObj = {},
			data, isCollection, key, i = 0, length;
		
		// overload
		// if the filter is a collection
		if (!Collection.isFunction(filter)) {
			if ((Collection.isString(filter) && !this._filterTest(filter) && !Collection.isExists(id)) || Collection.isCollection(filter)) {
				id = filter;
				filter = false;
			}
		}
		
		// overloads
		// if the ID is not specified, it is taken active collection
		if (!id) {
			data = this._get('collection');
		} else if (Collection.isString(id)) {
			data = this._get('collection', id);
		} else {
			isCollection = true;
			data = id;
		}
		
		if (data === null) { return 0; }
		if (isCollection !== true) { data = Collection.byLink(data, this._getActiveParam('context')); }
		if (Collection.isString(data)) { return data.length; }
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object') { throw new Error('incorrect data type!'); }
		
		// if no filter and the original object is an array
		if ((filter === true || !filter) && typeof data.length !== 'undefined') {
			length = data.length;
		} else {
			length = 0;
			
			// if array
			if (typeof data.length !== 'undefined') {
				data.forEach(function (el, key, obj) {
					if (this._customFilter(filter, el, key, data, i, null, this, id ? id : this.ACTIVE, tmpObj) === true) {
						length += 1;
					}
					i += 1;
				}, this);
			// if plain object
			} else {
				for (key in data) {
					if (!data.hasOwnProperty(key)) { continue; }
					
					if (this._customFilter(filter, data[key], key, data, i, null, this, id ? id : this.ACTIVE, tmpObj) === true) {
						length += 1;
					}
				}
				i += 1;
			}
		}
		
		// remove the temporary filter
		tmpObj.name && this._drop('filter', '__tmp:' + tmpObj.name);
		
		return length;
	};
	/**
	 * forEach method (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback — function to test each element of the collection
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String|Boolean} [id=this.ACTIVE] — collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: 0)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: 0)
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {a: 2}, {a: 3}, {a: 1}, {a: 2}, {a: 3}]);
	 * // increase on 1 all elements of multiples of three //
	 * db.forEach(function (el, key, data, i) {
	 *		data[key].a += 1;
	 *	}, ':i % 3 === 0');
	 * console.log(db.get());
	 */
	Collection.prototype.forEach = function (callback, filter, id, mult, count, from, indexOf) {
		filter = filter || '';
		
		// if id is Boolean
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
	
		var self = this,
			tmpObj = {},
			
			data, length, fLength,
			cloneObj,
			
			key, i = 0, j = 0, res = false;
		
		// get by link
		data = Collection.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object') { throw new Error('incorrect data type!'); }
		
		// length
		/** @private */
		length = function () {
			if (!length.val) {
				length.val = self.length(filter, id);
			}
			
			return length.val;
		};
		// filter length
		/** @private */
		fLength = function (filter, id) {
			if (!fLength.val) {
				fLength.val = self.length(filter, id);
			}
			
			return fLength.val;
		};
		
		if (Collection.isArray(data)) {
			// cut off the array to indicate the start
			if (indexOf !== false) {
				cloneObj = data.slice(indexOf);
			} else { cloneObj = data; }
			
			cloneObj.some(function (el, key, obj) {
				key += indexOf;
				if (count !== false && j === count) { return true; }
				
				if (this._customFilter(filter, el, key, data, i, fLength, this, id, tmpObj) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {
						res = callback.call(callback, el, key, data, i, length, this, id) === false;
						if (mult === false) { res = true; }
						j += 1;
					}
				}
				
				i += 1;
				if (res === true) { return true; }
			}, this);
		} else {
			for (key in data) {
				if (!data.hasOwnProperty(key)) { continue; }
					
				if (count !== false && j === count) { break; }
				if (indexOf !== false && indexOf !== 0) { indexOf -= 1; continue; }
				
				if (this._customFilter(filter, data[key], key, data, i, fLength, this, id, tmpObj) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {	
						res = callback.call(callback, data[key], key, data, i, length, this, id) === false;
						if (mult === false) { res = true; }
						j += 1;
					}
				}
				
				i += 1;
				if (res === true) { break; }
			}
		}
		
		// remove the temporary filter
		tmpObj.name && this._drop('filter', '__tmp:' + tmpObj.name);
		length = null;
		
		return this;
	};
	/**
	 * performs an action only for one element of the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback — function to test each element of the collection
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([{a: 1}, {a: 2}, {a: 3}, {a: 1}, {a: 2}, {a: 3}]);
	 * // increase on 1 one element of multiples of three //
	 * db.some(function (el, key, data, i) {
	 *		data[key].a += 1;
	 *	}, ':i % 3 === 0');
	 * console.log(db.get());
	 */
	Collection.prototype.some = function (callback, filter, id) {
		return this.forEach(callback, filter || '', id || '', false);
	};