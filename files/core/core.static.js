	
	/**
	 * set new value to object by link, remove element by link or get element by link
	 * 
	 * @this {nimble}
	 * @param {Object|Number|Boolean} obj — some object
	 * @param {Context} context — link
	 * @param {mixed} [value] — some value
	 * @param {Boolean} [del=false] — if 'true', remove source element
	 * @return {nimble|mixed}
	 */
	C.byLink = function (obj, context, value, del) {
		context = context
					.toString()
					.replace(new RegExp('\\s*' + this.CHILDREN + '\\s*', 'g'), this.CONTEXT_SEPARATOR + this.CHILDREN + this.CONTEXT_SEPARATOR)
					.split(this.CONTEXT_SEPARATOR);
		del = del || false;
		//
		var
			type = this.CHILDREN,
			last = 0, total = 0,
			
			key, i = context.length,
			pos, n,
	
			objLength, cLength;
	
		// remove 'dead' elements
		while ((i -= 1) > -1) {
			context[i] = this.trim(context[i]);
			if (context[i] === '') {
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
			return context.join('');
		} else if (this.isNumber(obj)) {
			if ((obj = +obj) < 0) { obj += total; }
			if (value === undefined) { 
				for (i = -1, n = 0; (i += 1) < cLength;) {
					if (context[i] !== this.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(i + 1, cLength);
							return context.join('');
						}
					}
				}
			} else {
				for (i = cLength, n = 0; (i -= 1) > -1;) {
					if (context[i] !== this.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(0, i);
							return context.join('');
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
							if (del === false) {
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
									if (del === false) {
										obj[pos] = this.expr(value, obj[pos]);
									} else { obj.splice(pos, 1); }
								} else {
									if (del === false) {
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
											if (del === false) {
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
	};
		
	/**
	 * execute event
	 * 
	 * @this {nimble}
	 * @param {String} query — query string
	 * @param {Object} event — event object
	 * @param {mixed} [param] — input parameters
	 * @param {mixed} [_this=event] — this object
	 * @return {mixed}
	 */
	C.execEvent = function (query, event, param, _this) {
		query = query.split(this.QUERY_SEPARATOR);
		param = this.isExists(param) ? param : [];
		param = this.isArray(param) ? param : [param];
		//
		var 
			i = -1,
			qLength = query.length - 1,
			spliter;
	
		while ((i += 1) < qLength) { event = event[query[i]]; }
		//
		if (query[i].search(this.SUBQUERY_SEPARATOR) !== -1) {
			spliter = query[i].split(this.SUBQUERY_SEPARATOR);
			event = event[spliter[0]];
			spliter.splice(0, 1);
			param = param.concat(spliter);
			return event.apply(_this || event, param);
		} else { return event[query[i]].apply(_this || event, param); }
	};