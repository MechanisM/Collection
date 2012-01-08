
	/////////////////////////////////
	//// mult methods (set)
	/////////////////////////////////
	
	/**
	 * set elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 *  
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.set = function (filter, replaceObj, id, mult, count, from, indexOf) {
		if ((arguments.length < 3 && $.isString(filter)
			&& !this.filterTest(filter)) || arguments.length === 0 || (arguments.length < 3 && filter === null)) {
				return this._setOne(filter, replaceObj, id || "");
			}
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
	
		var
			replaceCheck = $.isFunction(replaceObj),
			action = function (el, data, i, aLength, self, id) {
				if (replaceCheck) {
					data[i] = replaceObj.call(replaceObj, el, data, i, aLength, self, id);
				} else { data[i] = nimble.expr(replaceObj, data[i]); }
	
				return true;
			};
	
		this.forEach(action, filter, id, mult, count, from, indexOf);
	
		return this;
	};
	/**
	 * replace element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.setOne = function (filter, replaceObj, id) {
		return this.set($.isExist(filter) ? filter : "", replaceObj, id || "", false);
	};
	
	/**
	 * map (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.map = function (replaceObj, id) {
		return this.set(false, replaceObj, id || "");
	};