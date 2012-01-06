
var nimble = {
	/**
	 * framework name
	 * 
	 * @constant
	 * @type String
	 */
	name: "nimble",
	/**
	 * framework version
	 * 
	 * @constant
	 * @type String
	 */
	version: "1.0.1",
	/**
	 * return string: framework name + framework version
	 *
	 * @this {nimble}
	 * @return {String}
	 */
	nimble: function () { return this.name + " " + this.version; },
	
	// constants
	CONTEXT_SEPARATOR: " ",
	QUERY_SEPARATOR: "/",
	SUBQUERY_SEPARATOR: "{",
	METHOD_SEPARATOR: "->",
	
	CHILDREN: ">",
	ORDER: ["eq(", ")"],
	//
	
	/**
	 * trim
	 *
	 * @param {String} str
	 * @return {String}
	 */
	trim: function (str) {
		var
			str = str.replace(/^\s\s*/, ''),
			ws = /\s/,
			i = str.length;
		//
		while (ws.test(str.charAt((i -= 1))));
		return str.substring(0, i + 1);
	},
	/**
	 * string test
	 *
	 * @param {mixed} obj
	 * @return {Boolean}
	 */
	isString: function (obj) { return Object.prototype.toString.call(obj) === "[object String]"; },
	/**
	 * number test
	 *
	 * @param {mixed} obj
	 * @return {Boolean}
	 */
	isNumber: function (obj) { return Object.prototype.toString.call(obj) === "[object Number]"; },
	/**
	 * boolean test
	 *
	 * @param {mixed} obj
	 * @return {Boolean}
	 */
	isArray: function (obj) { return Object.prototype.toString.call(obj) === "[object Array]"; },
	/**
	 * null && undefined && empty string test
	 *
	 * @param {mixed} obj
	 * @return {Boolean}
	 */
	isExist: function (obj) { return obj !== undefined && obj !== "undefined" && obj !== null && obj !== ""; },
	
	/**
	 * calculate math expression
	 * 
	 * @param {mixed} nw - new value
	 * @param {mixed} old - old value
	 * @return {mixed}
	 */
	expr: function (nw, old) {
		old = old !== undefined || old !== null ? old : "";
		if (this.isString(nw) && nw.search(/^[+-\\*/]{1}=/) !== -1) {
			nw = nw.split("=");
			if (!isNaN(nw[1])) { nw[1] = +nw[1]; }
			// simple math
			switch (nw[0]) {
				case "+": { nw = old + nw[1]; } break;
				case "-": { nw = old - nw[1]; } break;
				case "*": { nw = old * nw[1]; } break;
				case "/": { nw = old / nw[1]; } break;
			}
		}
	
		return nw;
	},
	
	/**
	 * set new value to object by link or get object by link
	 * 
	 * @this {nimble}
	 * @param {Object|Number|Boolean} obj - some object
	 * @param {Context} context - link
	 * @param {mixed} [value] - some value
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @return {nimble|mixed}
	 */
	byLink: function (obj, context, value, deleteType) {
		context = context
					.toString()
					.replace(new RegExp("\\s*" + this.CHILDREN + "\\s*", "g"), " " + this.CHILDREN + " ")
					.split(this.CONTEXT_SEPARATOR);
		deleteType = deleteType || false;
		//
		var
			type = this.CHILDREN,
			last = 0, total = 0,
			
			key, i,
			pos, n,
	
			objLength, cLength = context.length;
	
		// remove "dead" elements
		for (i = cLength; (i -= 1) > -1;) {
			context[i] = this.trim(context[i]);
			if (context[i] === "") {
				context.splice(i, 1);
				last -= 1;
			} else if (context[i] !== this.CHILDREN) {
				if (i > last) { last = i; }
				total += 1;
			}
		}
		// recalculate length
		cLength = context.length;
		
		// overload
		if (obj === false) {
			return context.join("");
		} else if (this.isNumber(obj)) {
			if ((obj = +obj) < 0) { obj += total; }
			if (value === undefined) { 
				for (i = -1, n = 0; (i += 1) < cLength;) {
					if (context[i] !== this.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(i + 1, cLength);
							return context.join("");
						}
					}
				}
			} else {
				for (i = cLength, n = 0; (i -= 1) > -1;) {
					if (context[i] !== this.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(0, i);
							return context.join("");
						}
					}
				}
			}
		}
		//
		for (i = -1; (i += 1) < cLength;) {
			switch (context[i]) {
				case this.CHILDREN : { type = context[i]; } break;
				default : {
					if (type === this.CHILDREN && context[i].substring(0, this.ORDER[0].length) !== this.ORDER[0]) {
						if (i === last && value !== undefined) {
							if (deleteType === false) {
								obj[context[i]] = this.expr(value, obj[context[i]]);
							} else {
								if (nimble.isArray(obj)) {
									obj.splice(context[i], 1);
								} else { delete obj[context[i]]; }
							}
						} else { obj = obj[context[i]]; }
					} else {
						pos = context[i].substring(this.ORDER[0].length);
						pos = pos.substring(0, (pos.length - 1));
						pos = +pos;
						//
						if (this.isArray(obj)) {
							if (i === last && value !== undefined) {
								if (pos >= 0) {
									if (deleteType === false) {
										obj[pos] = this.expr(value, obj[pos]);
									} else { obj.splice(pos, 1); }
								} else {
									if (deleteType === false) {
										obj[obj.length + pos] = this.expr(value, obj[obj.length + pos]);
									} else { obj.splice(obj.length + pos, 1); }
								}
							} else {
								if (pos >= 0) {
									obj = obj[pos];
								} else { obj = obj[obj.length + pos]; }
							}
						} else {
							if (pos < 0) {
								objLength = 0;
								for (key in obj) {
									if (obj.hasOwnProperty(key)) { objLength += 1; }
								}
								//
								pos += objLength;
							}
			
							n = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) {
									if (pos === n) {
										if (i === last && value !== undefined) {
											if (deleteType === false) {
												obj[key] = this.expr(value, obj[key]);
											} else { delete obj[key]; }
										} else { obj = obj[key]; }
										break;
									}
									n += 1;
								}
							}
						}
					}
				}
			}
		}
		
		if (value !== undefined) { return this; }
		return obj;
	},
	
	/**
	 * execute event
	 * 
	 * @this {nimble}
	 * @param {String} query - query string
	 * @param {Object} event - event request
	 * @param {mixed} [param] - input parameters
	 * @param {mixed} [_this=event] - this
	 * @return {mixed}
	 */
	execEvent: function (query, event, param, _this) {
		query = query.split(this.QUERY_SEPARATOR);
		param = this.isExist(param) ? param : [];
		param = this.isArray(param) ? param : [param];
		//
		var 
			i = -1,
			qLength = query.length - 1,
			spliter;
	
		for (; (i += 1) < qLength;) { event = event[query[i]]; }
		//
		if (query[i].search(this.SUBQUERY_SEPARATOR) !== -1) {
			spliter = query[i].split(this.SUBQUERY_SEPARATOR);
			event = event[spliter[0]];
			spliter.splice(0, 1);
			param = param.concat(spliter);
			return event.apply(_this || event, param);
		} else { return event[query[i]].apply(_this || event, param); }
	},
	
	/**
	 * add new element to object
	 *
	 * @this {nimble}
	 * @param {Plain Object} obj - some object
	 * @param {String} active - property name (can use "->unshift" - the result will be similar to work for an array "unshift")
	 * @param {mixed} value - some value
	 * @return {Plain Object|Boolean}
	 */
	addElementToObject: function (obj, active, value) {
		active = active.split(this.METHOD_SEPARATOR);
		var key, newObj = {};
	
		if (active[1] && active[1] == "unshift") {
			newObj[!isNaN(Number(active[0])) ? 0 : active[0]] = value;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) { newObj[!isNaN(Number(key)) ? +key + 1 : key] = obj[key]; }
			}
			obj = newObj;
	
			return obj;
		} else if (!active[1] || active[1] == "push") { obj[active[0]] = value; }
	
		return true;
	}
};
