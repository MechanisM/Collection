	
	/////////////////////////////////
	// additional methods
	/////////////////////////////////
	
	/**
	 * calculate multi filter
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Collection} data - link to collection
	 * @param {Number|String} i - iteration (key)
	 * @param {Number} cOLength - collection length
	 * @param {Collection Object} self - link to collection object
	 * @param {String} id - collection ID
	 * @return {Boolean}
	 */
	$.Collection.fn.customFilter = function (filter, data, i, cOLength, self, id) {
		var
			tmpFilter,
			constants = this.config.constants,
			
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
			
			fLength,
			calFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			j = -1;
		
		// if filter is function
		if ($.isFunction(filter)) { return filter.call(filter, data, i, cOLength, self, id); }
		
		// if filter is not defined or filter is a string constant
		if (!filter || ($.isString(filter) && $.trim(filter) === constants.active)) {
			if (active.filter) { return active.filter.call(active.filter, data, i, cOLength, self, id); }
	
			return true;
		} else {
			// if filter is string
			if (!$.isArray(filter)) {
				// if simple filter
				if (filter.search(/\|\||&&|!|\(|\)/) === -1) {
					return sys.tmpFilter[filter].call(sys.tmpFilter[filter], data, i, cOLength, self, id);
				}
				
				filter = $.trim(
							filter
								.toString()
								.replace(/\s*(\(|\))\s*/g, " $1 ")
								.replace(/\s*(\|\||&&)\s*/g, " $1 ")
								.replace(/(!)\s*/g, "$1")
							)
						.split(" ");
			}
			// calculate deep filter
			calFilter = function (array, iter) {
				var
					i = -1,
					aLength = array.length - 1,
					pos = 0,
					result = [];
				
				for (; i++ < aLength;) {
					iter++;
					if (array[i] === "(") { pos++; }
					if (array[i] === ")") {
						if (pos === 0) {
							return {result: result, iter: iter};
						} else { pos--; }
					}
					result.push(array[i]);
				}
			};
			// calculate filter
			fLength = filter.length - 1;
			
			for (; j++ < fLength;) {
				// calculate atoms
				if (filter[j] === "(" || filter[j] === "!(") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = calFilter(filter.slice((j + 1)), j);
					j = tmpFilter.iter;
					//
					tmpResult = this.customFilter(tmpFilter.result, data, i, cOLength, self, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else {
						result = inverse === true ? !tmpResult : tmpResult || result;
					}
				// calculate outer filter
				} else if (filter[j] !== ")" && filter[j] !== "||" && filter[j] !== "&&") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = filter[j] === constants.active ? active.filter : sys.tmpFilter[filter[j]];
					tmpResult = tmpFilter.call(tmpFilter, data, i, cOLength, self, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else {
						result = inverse === true ? !tmpResult : tmpResult || result;
					}
				// "and" or "or"
				} else if (filter[j] === "||") {
					and = false;
					or = true;
				} else if (filter[j] === "&&") {
					or = false;
					and = true;
				}
			}
			
			return result;
		}
	};
	/**
	 * calculate multi parser
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|String} parser - parser function or string expressions
	 * @param {String} str - source string
	 * @return {String}
	 */
	$.Collection.fn.customParser = function (parser, str) {
		var
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
			
			tmpParser,
			i;
		
		// if parser is function
		if ($.isFunction(parser)) { return parser.call(parser, str, this); }
		
		// if parser is not defined or parser is a string constant
		if (!parser || ($.isString(parser) && $.trim(parser) === this.config.constants.active)) {
			if (active.parser) { return active.parser.call(active.parser, str, this); }
	
			return str;
		} else {
			if ($.isString(parser)) {
				parser = $.trim(parser);
				// if simple parser
				if (parser.search("&&") === -1) { return sys.tmpParser[parser].call(sys.tmpParser[parser], str, this); }
				parser = parser.split("&&");
			}
			
			for (i = parser.length; i--;) {
				parser[i] = $.trim(parser[i]);
				tmpParser = parser[i] === this.config.constants.active ? active.parser : sys.tmpParser[parser[i]];
				
				str = tmpParser.call(tmpParser, str, this);
			}
	
			return str;
		}
	};
	
	/**
	 * calculate parent context
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level up
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {String}
	 */
	$.Collection.fn.parentContext = function (n, id) {
		n = n || 1;
	
		var
			dObj = this.dObj,
			context = "", i;
	
		context = (id && id !== this.config.constants.active ? dObj.sys.tmpContext[id] : dObj.active.context).split(this.config.constants.contextSeparator);
        for (i = n; i--;) { context.splice(-1, 1); }
	
		return context.join(this.config.constants.contextSeparator);
	};
	/**
	 * parent
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level up
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.parent = function (n, id) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			active = dObj.active,
	
			contextID = sys.contextID,
			context = this.parentContext.apply(this, arguments);
	
		if (!id || id === this.config.constants.active) {
			if (contextID) {
				sys.tmpContext[contextID] = context;
			}
			active.context = context;
		} else {
			sys.tmpContext[id] = context;
			if (contextID && id === contextID) {
				active.context = context;
			}
		}
	
		return this;
	};