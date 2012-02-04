	
	/////////////////////////////////
	//// mult methods (core)
	/////////////////////////////////
	
	/**
	 * collection length (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Collection} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {String|Collection} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.prototype.length = function (filter, id) {
		filter = $.isExist(filter) && filter !== true ? filter : this._getActiveParam("filter");
		//
		var cObj, aCheck, key, cOLength;
		//
		if (!$.isFunction(filter)) {
			if (($.isString(filter) && !$.isExist(id)) || $.isArray(filter) || $.isPlainObject(filter)) {
				id = filter;
				filter = false;
			}
		}
		//
		if (!id || id === this.ACTIVE) {
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
		//
		if (typeof cObj === "object") {
			if (filter === false && cObj.length !== undefined) {
				cOLength = cObj.length;
			} else {
				cOLength = 0;
				if (cObj.length !== undefined) {
					cObj.forEach(function (el, i, obj) {
						if (this._customFilter(filter, el, i, cObj, cOLength || null, this, id ? id : this.ACTIVE) === true) {
							cOLength += 1;
						}
					}, this);
				} else {
					for (key in cObj) {
						if (!cObj.hasOwnProperty(key)) { continue; }
						//
						if (this._customFilter(filter, cObj[key], key, cObj, cOLength || null, this, id ? id : this.ACTIVE) === true) {
							cOLength += 1;
						}
					}
				}
			}
		} else { throw new Error("incorrect data type!"); }
	
		return cOLength;
	};
	/**
	 * forEach method (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - callback function
	 * @param {Filter} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: 0)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: 0)
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.forEach = function (callback, filter, id, mult, count, from, indexOf) {
		callback = $.isFunction(callback) ? {filter: callback} : callback;
		filter = $.isExist(filter) && filter !== true ? filter : this._getActiveParam("filter");
		id = $.isExist(id) ? id : this.ACTIVE;
		
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.ACTIVE;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			cObj, cOLength,
			cloneObj,
	
			i, j = 0, res = false, tmpRes;
		
		//
		cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		//
		if (typeof cObj !== "object") { throw new Error("incorrect data type!"); }
		//
		cOLength = this.length(cObj);
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
					
				if (this._customFilter(filter, el, i, cObj, cOLength, this, id) === true) {
					if (from !== false && from !== 0) {
						from -= 1;
					} else {
						if (callback.filter) { res = callback.filter.call(callback.filter, el, i, cObj, cOLength, this, id) === false; }
						if (mult === false) { res = true; }
						j += 1;
					}
				} else {
					if (callback.denial && (from === false || from === 0)) {
						tmpRes = callback.denial.call(callback.denial, el, i, cObj, cOLength, this, id);
						if (res === false && tmpRes === false) { res = true; }
					}
				}
				//
				if (callback.full && (from === false || from === 0)) {
					tmpRes = callback.full.call(callback.full, el, i, cObj, cOLength, this, id);
					if (res === false && tmpRes === false) { res = true; }
				}
				//
				if (res === true) { return true; }
				tmpRes = "";
			}, this);
		} else {
			for (i in cObj) {
				if (cObj.hasOwnProperty(i)) {
					if (count !== false && j === count) { break; }
					if (indexOf !== false && indexOf !== 0) { indexOf -= 1; continue; }
					
					if (this._customFilter(filter, cObj[i], i, cObj, cOLength, this, id) === true) {
						if (from !== false && from !== 0) {
							from -= 1;
						} else {	
							if (callback.filter) { res = callback.filter.call(callback.filter, cObj[i], i, cObj, cOLength, this, id) === false; }
							if (mult === false) { res = true; }
							j += 1;
						}
					}
				} else {
					if (callback.denial && (from === false || from === 0)) {
						tmpRes = callback.denial.call(callback.denial, cObj[i], i, cObj, cOLength, this, id);
						if (res === false && tmpRes === false) { res = true; }
					}
				}
				//
				if (callback.full && (from === false || from === 0)) {
					tmpRes = callback.full.call(callback.full, cObj[i], i, cObj, cOLength, this, id);
					if (res === false && tmpRes === false) { res = true; }
				}
				//
				if (res === true) { break; }
				tmpRes = "";
			}
		}
	
		return this;
	};