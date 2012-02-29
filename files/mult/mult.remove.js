	
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
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] - filter function, string expression or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of deletions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.remove = function (filter, id, mult, count, from, indexOf) {
		if ($.isNumeric(filter) || (arguments.length < 2 && $.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 2 && filter === null)) {
				return this._removeOne(filter, id || "");
			} else if ($.isArray(filter) || $.isPlainObject(filter)) { return this._remove(filter, id || ""); }
		//
		var elements = this.search.apply(this, arguments), i;
		if (!$.isArray(elements)) {
			this._removeOne(elements, id);
		} else { for (i = elements.length; (i -= 1) > -1;) { this._removeOne(elements[i], id); } }
	
		return this;
	};
	/**
	 * delete element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] - filter function, string expression or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.removeOne = function (filter, id) {
		return this.remove(filter || "", id || "", false);
	};