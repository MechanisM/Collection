
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
	 * @param {Filter|Context|Null} [filter=this.ACTIVE] - filter function, string expression or context (overload)
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.set = function (filter, replaceObj, id, mult, count, from, indexOf) {
		if ($.isNumeric(filter) || (arguments.length < 3 && $.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 3 && filter === null)) {
				return this._setOne(filter, replaceObj, id || "");
			}
		//
		var
			arg, replaceCheck = $.isFunction(replaceObj),
			/** @private */
			action = function (el, i, data, cOLength, cObj, id) {
				if (replaceCheck) {
					data[i] = replaceObj.call(replaceObj, el, i, data, cOLength, cObj, id);
				} else { data[i] = nimble.expr(replaceObj, data[i]); }
	
				return true;
			};
		//
		arg = $.unshiftArguments(arguments, action);
		arg.splice(2, 1);
		return this.forEach.apply(this, arg);
	};
	/**
	 * replace element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter} [filter=this.ACTIVE] - filter function or string expression
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.setOne = function (filter, replaceObj, id) {
		return this.set(filter || "", replaceObj, id || "", false);
	};
	
	/**
	 * map (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {Filter} [filter=this.ACTIVE] - filter function or string expression
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.map = function (replaceObj, filter, id) {
		return this.set(filter || "", replaceObj, id || "");
	};
		/**
	 * some (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - callback function
	 * @param {Filter} [filter=this.ACTIVE] - filter function or string expression
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.some = function (callback, filter, id) {
		return this.forEach(callback, filter || "", id || "", false);
	};