	
	/////////////////////////////////
	//// mult methods (core)
	/////////////////////////////////
	
	/**
	 * returns the length of the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String Expression|Collection|Boolean} [filter=this.ACTIVE] — filter function, string expression (context (optional) + >> + filter (optional, the record is equivalent to: return + string expression)), collection or true (if disabled)
	 * @param {String|Collection} [id=this.ACTIVE] — collection ID or collection
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number} [count] — maximum number of results (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Number}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.length();
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.length(':i % 3 === 0');
	 */
	Collection.prototype.length = function (filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		mult = mult === false ? false : true;
		var data, length;
		
		// overload
		// if the filter is a collection
		if (!C.isFunction(filter)) {
			if ((C.isString(filter) && !this._isFilter(filter) && !C.isExists(id)) || C.isCollection(filter)) {
				id = filter;
				filter = false;
			}
		}
		
		// overloads
		// if the Id is not specified, it is taken active collection
		if (!id) {
			data = this._get('collection');
		} else if (C.isString(id)) {
			data = this._get('collection', id);
		} else { data = id; }
		
		if (data === null) { return 0; }
		if (C.isString(data)) { return data.length; }
		
		// if no filter and the original object is an array
		if ((filter === true || !filter) && !this._getActiveParam('filter') && typeof data.length !== 'undefined') {
			length = data.length;
		} else {
			length = 0;
			this.forEach(function () { length += 1; }, filter, data, mult, count || '', from || '', indexOf || '', lastIndexOf || '', rev || '');
		}
		
		return length;
	};
	/**
	 * forEach method (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function|String Expression} callback — function (or string expression) to test each element of the collection (return false stops the cycle, for a string expression need to write clearly, for example: 'el.age += 2; return false')
	 * @param {Filter|String Expression|Boolean} [filter=this.ACTIVE] — filter function, string expression (context (optional) + >> + filter (optional, the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String|Collection} [id=this.ACTIVE] — collection ID or collection
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number} [count] — maximum number of results (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([[1, 2, 3, 4, 5, 6, 7, 8], 2, 3, 4]);
	 * db.forEach(':data[key] += 1', '0 >> :el % 2 === 0');
	 * console.log(db.get());
	 * @example
	 * var db = new $C([{a: 1}, {a: 2}, {a: 3}, {a: 1}, {a: 2}, {a: 3}]);
	 * // increase on 1 all elements of multiples of three //
	 * db.forEach(function (el, key, data, i) {
	 *		el.a += 1;
	 *	}, ':i % 3 === 0');
	 * console.log(db.get());
	 * @example
	 * var db = new $C([{a: 1}, {a: 2}, {a: 3}, {a: 1}, {a: 2}, {a: 3}]);
	 * db.forEach(':el.a += 1', ':i % 3 === 0');
	 * console.log(db.get());
	 */
	Collection.prototype.forEach = function (callback, filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		// values by default
		callback = this._isStringExpression(callback) ? this._compileFunc(callback) : callback;
		filter = C.isString((filter = filter || '')) ? filter.split(this.SHORT_SPLITTER) : filter;
		
		id = id || '';
		
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		lastIndexOf = parseInt(lastIndexOf) || false;
		rev = rev || false;
		
		var	self = this,
			tmpObj = {},
			tmpArray = [],
			
			context = '',
			
			data, length, fLength,
			cloneObj,
			
			key, i = 0, j = 0,
			res = false;
		
		if (C.isArray(filter)) {
			if (filter.length === 2) {
				context = filter[0].trim();
				filter = filter[1].trim();
			} else { filter = filter[0].trim(); }
		}
		
		// get by link
		data = !C.isCollection(id) ? this._getOne(context, id) : id;
		
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
				fLength.val = self.length(filter || '', id || '');
			}
			
			return fLength.val;
		};
		
		if (C.isArray(data)) {
			// cut off the array to indicate the start
			if (indexOf !== false && !rev) {
				cloneObj = data.slice(indexOf);
			} else { cloneObj = data; }
			
			// bypassing the array in ascending order
			if (!rev) {
				cloneObj.some(function (el, key, obj) {
					key += indexOf;
					
					if (lastIndexOf && key === lastIndexOf) { return true; }
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
			
			// bypassing the array in descending order
			} else {
				lastIndexOf && (cloneObj.length - lastIndexOf);
				for (key = cloneObj.length - indexOf; (key -= 1) > -1;) {
					if (lastIndexOf && key === lastIndexOf) { break; }
					if (count !== false && j === count) { break; }
					
					if (this._customFilter(filter, cloneObj[key], key, data, i, fLength, this, id, tmpObj) === true) {
						if (from !== false && from !== 0) {
							from -= 1;
						} else {
							res = callback.call(callback, cloneObj[key], key, data, i, length, this, id) === false;
							if (mult === false) { res = true; }
							j += 1;
						}
					}
					
					i += 1;
					if (res === true) { break; }
				}
			}
		} else {
			// bypassing the object in ascending order
			if (!rev) {
				for (key in data) {
					if (!data.hasOwnProperty(key)) { continue; }
					
					if (lastIndexOf && i === lastIndexOf) { break; }
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
			
			// bypassing the object in descending order
			} else {
				for (key in data) {
					if (!data.hasOwnProperty(key)) { continue; }
					tmpArray.push(key);
				}
				
				lastIndexOf && (tmpArray.length - lastIndexOf);
				for (key = tmpArray.length - indexOf; (key -= 1) > -1;) {
					if (lastIndexOf && key === lastIndexOf) { break; }
					if (count !== false && j === count) { break; }
					
					if (this._customFilter(filter, data[tmpArray[key]], tmpArray[key], data, i, fLength, this, id, tmpObj) === true) {
						if (from !== false && from !== 0) {
							from -= 1;
						} else {
							res = callback.call(callback, data[tmpArray[key]], tmpArray[key], data, i, length, this, id) === false;
							if (mult === false) { res = true; }
							j += 1;
						}
					}
					
					i += 1;
					if (res === true) { break; }
				}
			}
		}
		
		// remove the temporary filter
		tmpObj.name && this._drop('filter', '__tmp:' + tmpObj.name);
		length = null;
		fLength = null;
		
		return this;
	};
	/**
	 * performs an action only for one element of the collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function|String Expression} callback — function (or string expression) to test each element of the collection
	 * @param {Filter|String Expression|Boolean} [filter=this.ACTIVE] — filter function, string expression (context (optional) + >> + filter (optional, the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
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
	Collection.prototype.some = function (callback, filter, id, from, indexOf, lastIndexOf, rev) {
		return this.forEach(callback, filter || '', id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};