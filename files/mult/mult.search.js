	
	/////////////////////////////////
	//// mult methods (search)
	/////////////////////////////////
	
	/**
	 * search elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Number|Array}
	 */
	$.Collection.prototype.search = function (filter, id, mult, count, from, indexOf) {
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
			result = mult === true ? [] : -1,
			action = function (el, i, data, aLength, self, id) {
				if (mult === true) {
					result.push(i);
				} else { result = i; }
				
				return true;
			};
	
		this.forEach(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * search element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|Array}
	 */
	$.Collection.prototype.searchOne = function (filter, id) {
		return this.search($.isExist(filter) ? filter : "", id || "", false);
	};
	
	/**
	 * indexOf (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement - element to locate in the array
	 * @param {fromIndex} [fromIndex=0] - the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|String}
	 */
	$.Collection.prototype.indexOf = function (searchElement, fromIndex, id) {
		id = id || "";
		fromIndex = fromIndex || "";
		//
		var cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		//
		if ($.isArray(cObj) && cObj.indexOf) {
			if (fromIndex) { return cObj.indexOf(searchElement, fromIndex); }
			//
			return cObj.indexOf(searchElement);
		} else { return this.search(function (el) { return el === searchElement; }, id, false, "", "", fromIndex); }
	}
	/**
	 * lastIndexOf (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement - element to locate in the array
	 * @param {fromIndex} [fromIndex=0] - the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|String}
	 */
	$.Collection.prototype.lastIndexOf = function (searchElement, fromIndex, id) {
		id = id || "";
		fromIndex = fromIndex || "";
		//
		var el, cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		//
		if ($.isArray(cObj) && cObj.lastIndexOf) {
			if (fromIndex) { return cObj.lastIndexOf(searchElement, fromIndex); }
			//
			return cObj.lastIndexOf(searchElement);
		} else {
			el = this.search(function (el) { return el === searchElement; }, id, "", "", "", fromIndex);
			//
			return el[el.length - 1] !== undefined ? el[el.length - 1] : -1;
		}
	}