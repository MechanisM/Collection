	
	/////////////////////////////////
	//// mult methods (remove)
	/////////////////////////////////
	
	/**
	 * delete elements (in context)<br/>
	 * events: onRemove
	 * <i class="mult remove"></i> 
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] - filter function, string expression, context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] - if "false", then there will only be one iteration
	 * @param {Number|Boolean} [count=false] - maximum number of deletions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	C.prototype.remove = function (filter, id, mult, count, from, indexOf) {
		var elements, i, e = null;
		
		//
		if (C.isNumber(filter) || (arguments.length < 2 && C.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 2 && filter === null)) {
				return this._removeOne(filter, id || "");
			} else if (C.isArray(filter) || C.isPlainObject(filter)) { return this._remove(filter, id || ""); }
		
		//
		elements = this.search.apply(this, arguments);
		if (!C.isArray(elements)) {
			this._removeOne(elements, id);
		} else { for (i = elements.length; (i -= 1) > -1;) { this._removeOne(elements[i], id); } }
	
		return this;
	};
	/**
	 * delete element (in context)<br/>
	 * events: onRemove
	 * <i class="mult remove"></i> 
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] - filter function, string expression or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype.removeOne = function (filter, id) {
		return this.remove(filter || "", id || "", false);
	};