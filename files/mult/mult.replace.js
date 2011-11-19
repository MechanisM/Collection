
	/////////////////////////////////
	//// mult methods (replace)
	/////////////////////////////////
	
	/**
	 * replace elements (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElements = function (filter, replaceObj, id, mult, count, from, indexOf) {
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
			replaceCheck = $.isFunction(replaceObj),
			action = function (data, i, aLength, $this, id) {
				if (replaceCheck) {
					replaceObj(data, i, aLength, $this, id);
				} else { data[i] = replaceObj; }
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return this;
	};
	/**
	 * replace element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElement = function (filter, replaceObj, id) {
		return this.replaceElements(filter || "", replaceObj, id || "", false);
	};