	
	/////////////////////////////////
	//// mult methods (get)
	/////////////////////////////////
	
	/**
	 * get the items using a filter or a link (in context)
	 * <i class="mult get"></i> 
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] - filter function, string expression, context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID, if the id is a Boolean, it is considered as mult
	 * @param {Boolean} [mult=true] - if "false", then there will only be one iteration
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {mixed}
	 */
	C.prototype.get = function (filter, id, mult, count, from, indexOf) {
		if (C.isNumber(filter) || (arguments.length < 2 && C.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 2 && filter === false)) {
				return this._getOne(filter, id || "");
			}
	
		// if id is Boolean
		if (C.isBoolean(id)) {
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
					result.push(data[i]);
				} else { result = data[i]; }
	
				return true;
			};
		//
		this.forEach(action, filter || "", id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * get the item using a filter or a link (in context)
	 * <i class="mult get"></i> 
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] - filter function, string expression or context (overload)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {mixed}
	 */
	C.prototype.getOne = function (filter, id) {
		return this.get(filter || "", id || "", false);
	};