	
	/////////////////////////////////
	//// mult methods (search)
	/////////////////////////////////
	
	/**
	 * search for elements using filter (returns a reference to elements)(in context)
	 * <i class="mult search"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] - filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] - if "false", then there will only be one iteration
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Number|Array}
	 */
	C.prototype.search = function (filter, id, mult, count, from, indexOf) {
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
		//
		var
			result = mult === true ? [] : -1,
			/** @private */
			action = function (el, i, data, aLength, self, id) {
				if (mult === true) {
					result.push(i);
				} else { result = i; }
				
				return true;
			};
		//
		this.forEach(action, filter || "", id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * search for element using filter (returns a reference to element)(in context)
	 * <i class="mult search"></i>
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] - filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|Array}
	 */
	C.prototype.searchOne = function (filter, id) {
		return this.search(filter || "", id || "", false);
	};
	
	/**
	 * indexOf (in context)<br/>
	 * <i class="mult search"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement - element to locate in the array
	 * @param {fromIndex} [fromIndex=0] - the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|String}
	 */
	C.prototype.indexOf = function (searchElement, fromIndex, id) {
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
	};
	/**
	 * lastIndexOf (in context)
	 * <i class="mult search"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} searchElement - element to locate in the array
	 * @param {fromIndex} [fromIndex=0] - the index at which to start searching backwards
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Number|String}
	 */
	C.prototype.lastIndexOf = function (searchElement, fromIndex, id) {
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
	};