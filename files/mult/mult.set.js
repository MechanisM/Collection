
	/////////////////////////////////
	//// mult methods (set)
	/////////////////////////////////
	
	/**
	 * set new value of the element (in context)<br/>
	 * events: onSet
	 * <i class="mult set"></i>
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] - filter function, string expression, context (overload) or true (if disabled)
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.ACTIVE] - collection ID, if the id is a Boolean, it is considered as mult.
	 * @param {Boolean} [mult=true] - if "false", then there will only be one iteration
	 * @param {Number|Boolean} [count=false] - maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	C.prototype.set = function (filter, replaceObj, id, mult, count, from, indexOf) {
		if ($.isNumeric(filter) || (arguments.length < 3 && C.isString(filter)
			&& !this._filterTest(filter)) || arguments.length === 0 || (arguments.length < 3 && filter === null)) {
				return this._setOne(filter, replaceObj, id || "");
			}
		//
		var
			e = null, arg, replaceCheck = $.isFunction(replaceObj),
			/** @private */
			action = function (el, i, data, cOLength, cObj, id) {
				if (replaceCheck) {
					data[i] = replaceObj.call(replaceObj, el, i, data, cOLength, cObj, id);
				} else { data[i] = C.expr(replaceObj, data[i]); }
	
				return true;
			};
		//
		arg = C.unshiftArguments(arguments, action);
		arg.splice(2, 1);
		
		// events
		this.onSet && (e = this.onSet.apply(this, arguments));
		if (e === false) { return this; }
		
		return this.forEach.apply(this, arg);
	};
	/**
	 * set new value of the one element (in context)<br/>
	 * events: onSet
	 * <i class="mult set"></i>
	 *
	 * @this {Colletion Object}
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] - filter function, string expression, context (overload) or true (if disabled)
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype.setOne = function (filter, replaceObj, id) {
		return this.set(filter || "", replaceObj, id || "", false);
	};
	
	/**
	 * map (in context)<br/>
	 * events: onSet
	 * <i class="mult set"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {Filter|Context|Boolean} [filter=this.ACTIVE] - filter function, string expression, context (overload) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype.map = function (replaceObj, filter, id) {
		return this.set(filter || "", replaceObj, id || "");
	};