	
	/////////////////////////////////
	//// mult methods (return)
	/////////////////////////////////
	
	/**
	 * return elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {mixed}
	 */
	$.Collection.fn.returnElements = function (filter, id, mult, count, from, indexOf) {
		filter = $.isExist(filter) ? filter : this.getActiveParam("filter");
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
			result = [],
			action = function (el, data, i, aLength, self, id) {
				if (mult === true) {
					result.push(data[i]);
				} else {
					result = data[i];
					return false;
				}
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * return element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {mixed}
	 */
	$.Collection.fn.returnElement = function (filter, id) {
		return this.returnElements(filter || "", id || "", false);
	};