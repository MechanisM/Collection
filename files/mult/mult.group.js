	
	/////////////////////////////////
	//// mult methods (group)
	/////////////////////////////////
	
	/**
	 * group the elements on the field or condition (the method returns a new collection) (in context)
	 *  
	 * @this {Colletion Object}
	 * @param {Context|Function|String Expression} [field] — field name, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration (for group)
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @param {Boolean} [link=false] — save link
	 * @return {Colletion}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5])
	 * .group();
	 * @example
	 * // group all the even-numbered elements //
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]).group(':el % 2 === 0');
	 */
	Collection.prototype.group = function (field, filter, id, mult, count, from, indexOf, lastIndexOf, rev, link) {
		field = this._isStringExpression((field = field || '')) ? this._compileFilter(field) : field;
		id = id || '';
		mult = mult === false ? false : true;
		link = link || false;
		
		var isString = C.isString(field),
			res = {}, arg, action;
		
		if (isString) {
			if (link) {
				/** @private */
				action = function (el, key) {
					var param = C.byLink(el, field);
					
					if (!res[param]) {
						res[param] = [key];
					} else { res[param].push(key); }
				};
			} else {
				/** @private */
				action = function (el, key) {
					var param = C.byLink(el, field);
					
					if (!res[param]) {
						res[param] = [el];
					} else { res[param].push(el); }
				};
			}
		} else {
			if (link) {
				/** @private */
				action = function (el, key) {
					var param = field.apply(field, arguments);
					
					if (!res[param]) {
						res[param] = [key];
					} else { res[param].push(key); }
				};
			} else {
				/** @private */
				action = function (el, key) {
					var param = field.apply(field, arguments);
					
					if (!res[param]) {
						res[param] = [el];
					} else { res[param].push(el); }
				};
			}
		}
		
		// overload ID
		if (id.search(this.SPLITTER) !== -1) {
			id = id.split(this.SPLITTER);
			set = true;
		} else { id = id.split(this.SHORT_SPLITTER); }
		
		arg = C.unshiftArguments(arguments, action);
		arg.splice(1, 1);
		this.forEach.apply(this, arg);
	
		return res;
	};
	/**
	 * group the elements on the field or condition (the method returns a new collection of references to elements in the original collection) (in context)
	 *  
	 * @this {Colletion Object}
	 * @param {Context|Function|String Expression} [field] — field name, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5])
	 *	.groupLinks();
	 * @example
	 * // group all the even-numbered elements //
	 * $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5])
	 *	.groupLinks(':el % 2 === 0');
	 */
	Collection.prototype.groupLinks = function (field, filter, id, count, from, indexOf, lastIndexOf, rev) {
		var arg = Collection.unshiftArguments(arguments, action);
		arg.push(true);
		
		return this.group.apply(this, arg);
	};	