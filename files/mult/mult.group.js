	
	/////////////////////////////////
	//// mult methods (group)
	/////////////////////////////////
	
	/**
	 * group the elements on the field or condition (the method returns a new collection) (in context)
	 *  
	 * @this {Colletion Object}
	 * @param {Context|Expression|Function} [field] — field name, string expression or callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @param {Boolean} [link=false] — save link
	 * @return {Colletion}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
	 * db.group();
	 * // group all the even-numbered elements
	 * db.group(':el % 2 === 0');
	 */
	C.prototype.group = function (field, filter, id, count, from, indexOf, link) {
		field = this._exprTest((field = field || '')) ? this._compileFilter(field) : field;
		id = id || '';
		link = link || false;
	
		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var fieldType = C.isString(field),
			result = {},
			
			/** @private */
			action = function (el, i, data, aLength, self, id) {
				var param = fieldType ? C.byLink(el, field) : field.apply(field, arguments);
				
				if (!result[param]) {
					result[param] = [!link ? el : i];
				} else { result[param].push(!link ? el : i); }
	
				return true;
			};
		
		this.forEach(action, filter, id, '', count, from, indexOf);
	
		return result;
	};
	/**
	 * group the elements on the field or condition (the method returns a new collection of references to elements in the original collection)(in context)
	 *  
	 * @this {Colletion Object}
	 * @param {Context|Expression|Function} [field] — field name, string expression or callback function
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {Number|Boolean} [count=false] — maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
	 * db.group();
	 * // group all the even-numbered elements
	 * db.group(':el % 2 === 0');
	 */
	C.prototype.groupLinks = function (field, filter, id, count, from, indexOf) {
		return this.group(field || '', filter || '', id || '', count || '', from || '', indexOf || '', true);
	};	