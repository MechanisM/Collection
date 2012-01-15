	
	/////////////////////////////////
	//// compile (filter)
	/////////////////////////////////
	
	/**
	 * calculate custom filter
	 * 
	 * @this {Colletion Object}
	 * @param {Filter} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {Collection} data - link to collection
	 * @param {Number|String} i - iteration (key)
	 * @param {Number} cOLength - collection length
	 * @param {Collection Object} self - link to collection object
	 * @param {String} id - collection ID
	 * @throw {Error}
	 * @return {Boolean}
	 */
	$.Collection.prototype._customFilter = function (filter, el, i, data, cOLength, self, id) {
		var
			fLength,
			calFilter, tmpFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			i;
		
		// if filter is disabled
		if (filter === false) { return true; }
		// if filter is function
		if ($.isFunction(filter)) { return filter.call(filter, el, i, data, cOLength, self, id); }
		
		// if filter is not defined or filter is a string constant
		if (!filter || ($.isString(filter) && $.trim(filter) === this.ACTIVE)) {
			if (this._get("filter")) {
				if ($.isFunction(this._get("filter"))) {
					return this._get("filter").call(this._get("filter"), el, i, data, cOLength, self, id);
				}
				//
				return this._customFilter(this._get("filter"), el, i, data, cOLength, self, id);
			}
			
			return true;
		} else {
			// if filter is string
			if (!$.isArray(filter)) {
				// if simple filter
				if (filter.search(/\|\||&&|!/) === -1) {
					filter = $.trim(filter);
					if (filter.search(/^(?:\(|)*:/) !== -1) {
						tmpFilter = this._compileFilter(filter);
						return tmpFilter.call(tmpFilter, el, i, data, cOLength, self, id);
					}
					//
					return this._customFilter(this._get("filter", filter), el, i, data, cOLength, self, id);
				}
				filter = $.trim(
							filter
								.toString()
								.replace(/\s*(\(|\))\s*/g, " $1 ")
								.replace(/\s*(\|\||&&)\s*/g, " $1 ")
								.replace(/(!)\s*/g, "$1")
						).split(" ");
				
				// remove "dead" elements		
				for (i = filter.length; (i -= 1) > -1;) {
					if (filter[i] === "") { filter.splice(i, 1); }
				}
			}
			// calculate deep filter
			calFilter = function (array, iter) {
				var
					i = -1,
					aLength = array.length,
					pos = 0,
					result = [];
				
				while ((i += 1) < aLength) {
					iter += 1;
					if (array[i] === "(") { pos += 1; }
					if (array[i] === ")") {
						if (pos === 0) {
							return {result: result, iter: iter};
						} else { pos -= 1; }
					}
					result.push(array[i]);
				}
			};
			
			// calculate filter
			fLength = filter.length;
			for (i = -1; (i += 1) < fLength;) {
				// calculate atoms
				if (filter[i] === "(" || filter[i] === "!(") {
					if (filter[i].substring(0, 1) === "!") {
						inverse = true;
						filter[i] = filter[i].substring(1);
					} else { inverse = false; }
					//
					tmpFilter = calFilter(filter.slice((i + 1)), i);
					tmpResult = tmpFilter.result.join(" ");
					i = tmpFilter.iter;
					//
					if (tmpResult.search(/^:/) !== -1) {
						if (!this._exist("filter", "__tmp:" + tmpResult)) {
							this._push("filter", "__tmp:" + tmpResult, this._compileFilter(tmpResult));
							tmpFilter.result = this._compileFilter(tmpResult);
						}
						tmpFilter.result = this._get("filter", "__tmp:" + tmpResult);
					}
					//
					tmpResult = this._customFilter(tmpFilter.result, el, i, data, cOLength, self, id);
					
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else { result = inverse === true ? !tmpResult : tmpResult || result; }
				// calculate outer filter
				} else if (filter[i] !== ")" && filter[i] !== "||" && filter[i] !== "&&") {
					if (filter[i].substring(0, 1) === "!") {
						inverse = true;
						filter[i] = filter[i].substring(1);
					} else { inverse = false; }
					//
					tmpResult = this._get("filter", filter[i]).call(this._get("filter", filter[i]), el, i, data, cOLength, self, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else { result = inverse === true ? !tmpResult : tmpResult || result; }
				// "and" or "or"
				} else if (filter[i] === "||") {
					and = false;
					or = true;
				} else if (filter[i] === "&&") {
					or = false;
					and = true;
				}
			}
			
			return result;
		}
	};
	/**
	 * compile filter
	 * 
	 * @param {String} str - some string
	 * @return {Function}
	 */
	$.Collection.prototype._compileFilter = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split("<:").join('self.getVariable("').split(":>").join('")');
		//
		return new Function("el", "i", "data", "cOLength", "cObj", "id", "var key = i; return " + str.replace(/^\s*:/, "") + ";");
	}