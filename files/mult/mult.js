	
	/////////////////////////////////
	//// mult methods (core)
	/////////////////////////////////
	
	/**
	 * returns the length of the collection (in context)
	 * <i class="mult"></i> 
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|C|Boolean} [filter=this.ACTIVE] - filter function, string expression, collection or true (if disabled)
	 * @param {String|C} [id=this.ACTIVE] - collection ID or collection
	 * @throw {Error}
	 * @return {Number}
	 */
	C.prototype.length = function (filter, id) {
		filter = filter || "";
		//
		var
			tmpObj = {},
			cObj, aCheck, key, cOLength;
		
		//
		if (!$.isFunction(filter)) {
			if (($.isString(filter) && !this._filterTest(filter) && !$.isExists(id)) || $.isArray(filter) || $.isPlainObject(filter)) {
				id = filter;
				filter = false;
			}
		}
		
		//
		if (!id) {
			cObj = this._get("collection");
		} else if ($.isString(id)) {
			cObj = this._get("collection", id);
		} else {
			aCheck = true;
			cObj = id;
		}
		
		// if cObj is null
		if (cObj === null) { return 0; }
		// if cObj is collection
		if (aCheck !== true) { cObj = nimble.byLink(cObj, this._getActiveParam("context")); }
		
		// if cObj is String
		if ($.isString(cObj)) { return cObj.length; }
		
		// throw error
		if (typeof cObj !== "object") { throw new Error("incorrect data type!"); }
		
		//
		if (filter === false && cObj.length !== undefined) {
			cOLength = cObj.length;
		} else {
			cOLength = 0;
			if (cObj.length !== undefined) {
				cObj.forEach(function (el, i, obj) {
					if (this._customFilter(filter, el, i, cObj, cOLength || null, this, id ? id : this.ACTIVE, tmpObj) === true) {
						cOLength += 1;
					}
				}, this);
			} else {
				for (key in cObj) {
					if (!cObj.hasOwnProperty(key)) { continue; }
					//
					if (this._customFilter(filter, cObj[key], key, cObj, cOLength || null, this, id ? id : this.ACTIVE, tmpObj) === true) {
						cOLength += 1;
					}
				}
			}
		}
		//
		tmpObj.name && this._drop("filter", "__tmp:" + tmpObj.name);
		
		return cOLength;
	};
	/**
	 * forEach method (in context)
	 * <i class="mult"></i> 
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] - filter function, string expression or true (if disabled)
	 * @param {String|Boolean} [id=this.ACTIVE] - collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] - if "false", then there will only be one iteration
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: 0)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: 0)
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	C.prototype.forEach = function (callback, filter, id, mult, count, from, indexOf) {
		filter = filter || "";
		
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		} else { id = id || ""; }
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			self = this,
			tmpObj = {},
		
			cObj, cOLength,
			cloneObj,
	
			i, j = 0, res = false;
		
		//
		cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		if (typeof cObj !== "object") { throw new Error("incorrect data type!"); }
		
		// length function
		/** @private */
		cOLength = function () {
			if (!cOLength.val) { cOLength.val = self.length(filter, id); }
			
			return cOLength.val;
		}
		
		//
		if ($.isArray(cObj)) {
			//
			if (indexOf !== false) {
				cloneObj = cObj.slice(indexOf);
			} else { cloneObj = cObj; }
			
			//
			cloneObj.some(function (el, i, obj) {
				i += indexOf;
				if (count !== false && j === count) { return true; }
					
				if (this._customFilter(filter, el, i, cObj, cOLength, this, id, tmpObj) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {
						res = callback.call(callback, el, i, cObj, cOLength, this, id) === false;
						if (mult === false) { res = true; }
						j += 1;
					}
				}
				//
				if (res === true) { return true; }
			}, this);
		} else {
			for (i in cObj) {
				if (!cObj.hasOwnProperty(i)) { continue; }
				//	
				if (count !== false && j === count) { break; }
				if (indexOf !== false && indexOf !== 0) { indexOf -= 1; continue; }
				//
				if (this._customFilter(filter, cObj[i], i, cObj, cOLength, this, id, tmpObj) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {	
						res = callback.call(callback, cObj[i], i, cObj, cOLength, this, id) === false;
						if (mult === false) { res = true; }
						j += 1;
					}
				}
				//
				if (res === true) { break; }
			}
		}
		//
		tmpObj.name && this._drop("filter", "__tmp:" + tmpObj.name);
		//
		cOLength = null;
		
		return this;
	};
	/**
	 * some (in context)
	 * <i class="mult"></i> 
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] - filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype.some = function (callback, filter, id) {
		return this.forEach(callback, filter || "", id || "", false);
	};