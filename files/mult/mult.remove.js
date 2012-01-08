	
	/////////////////////////////////
	//// mult methods (remove)
	/////////////////////////////////
	
	/**
	 * delete elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context|Array|Plain Object|Null} [filter=false] - filter function, string expressions or "false" or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of deletions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.remove = function (filter, id, mult, count, from, indexOf) {
		if ((arguments.length < 2 && $.isString(filter)
			&& !this.filterTest(filter)) || arguments.length === 0 || (arguments.length < 2 && filter === null)) {
				return this._removeOne(filter, id || "");
			} else if ($.isArray(filter) || $.isPlainObject(filter)) { return this._remove(filter, id || ""); }
		//
		filter = $.isExist(filter) && filter !== true ? filter : this.getActiveParam("filter");
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
		
		var elements = this.search(filter, id, mult, count, from, indexOf), i;
		if (mult === false) {
			this._removeOne(elements, id);
		} else { for (i = elements.length; (i -= 1) > -1;) { this._removeOne(elements[i], id); } }
	
		return this;
	};
	/**
	 * delete element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=false] - filter function, string expressions or "false" or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.removeOne = function (filter, id) {
		return this.remove($.isExist(filter) ? filter : "", id || "", false);
	};