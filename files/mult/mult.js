	
	/////////////////////////////////
	//// mult methods (core)
	/////////////////////////////////
	
	/**
	 * collection length (in context)
	 * 
	 * // overloads:
	 * 1) if no input parameters, then the ID is equal to the active collection, and the filter is disabled.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String|Collection} [id=this.active] - collection ID
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.fn.length = function (filter, id) {
		filter = $.isExist(filter) ? filter : false;
		
		var
			dObj = this.dObj,
			cObj, cOLength,
			key, countRecords;
		
		// if filter isn't function
		if ($.isString(filter) && !$.isExist(id)) {
			id = filter;
			filter = false;
		}

		if (!id || id === this.active) {
			cObj = dObj.prop.activeCollection;
		} else { cObj = dObj.sys.tmpCollection[id]; }
		//
		cObj = $.Collection.stat.obj.getByLink(cObj, this.getActiveContext());
		// if cObj is null
		if (cObj === null) { return 0; }
		
		cOLength = cObj.length;
		if (typeof cObj === "object") {
			if (filter === false && cOLength !== undefined) {
				countRecords = cOLength;
			} else {
				countRecords = 0;
				for (key in cObj) {
					if (cObj.hasOwnProperty(key)) {
						if (filter === false || this.customFilter(filter, cObj, key, cOLength || null, this, id ? id : this.active) === true) {
							countRecords++;
						}
					}
				}
			}
		} else { throw new Error("incorrect data type!"); }
	
		return countRecords;
	};
	/**
	 * forEach method (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - callback
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.each = function (callback, filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.active;
		}
	
		// values by default
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
	
			cObj, cOLength, tmpLength,
	
			i, j = 0;
		
		// "callee" link
		dObj.sys.callbackCallee = callback;
		//
		cObj = $.Collection.stat.obj.getByLink(id !== this.active ? sys.tmpCollection[id] : prop.activeCollection, this.getActiveContext());
		cOLength = this.length(cObj);
		//
		if ($.isArray(cObj)) {
			tmpLength = cOLength - 1;
			for (i = indexOf !== false ? indexOf - 1 : -1; i++ < tmpLength;) {
				if (count !== false && j === count) { break; }
				if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
					if (from !== false && from !== 0) { from--; continue; }
					
					if (callback.call(this, cObj, i, cOLength, this, id) === false) { break; }
					if (mult === false) { break; }
					j++;
				}
			}
		} else {
			for (i in cObj) {
				if (cObj.hasOwnProperty(i)) {
					if (count !== false && j === count) { break; }
					if (indexOf !== false && indexOf !== 0) { indexOf--; continue; }
					
					if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
						if (from !== false && from !== 0) { from--; continue; }
							
						if (callback.call(this, cObj, i, cOLength, this, id) === false) { break; }
						if (mult === false) { break; }
						j++;
					}
				}
			}
		}
	
		return this;
	};