	
	/**
	 * set new value of the object by the link, get/remove an element by the link, or return a fragment of the context (overload)
	 * 
	 * @this {Collection}
	 * @param {Object|Number|Boolean} obj — some object
	 * @param {Context} context — link
	 * @param {mixed} [value] — some value
	 * @param {Boolean} [del=false] — if true, remove element
	 * @return {mixed}
	 *
	 * @example
	 * $C.byLink({a: {b: 1, c: 2}}, 'a > b', 2);
	 * @example
	 * $C.byLink({a: {b: 1, c: 2}}, 'a > eq(-1)', 1);
	 * @example
	 * $C.byLink({a: {b: 1, c: 2}}, 'a > eq(-1)', '', true);
	 * @example
	 * $C.byLink(false, 'a > b > eq(5) > 1');
	 * @example
	 * $C.byLink(2, 'a > b > eq(5) > 1');
	 * @example
	 * $C.byLink(-1, 'a > b > eq(5) > 1');
	 */
	Collection.byLink = function (obj, context, value, del) {
		// prepare context
		context = context
					.toString()
					.replace(new RegExp('\\s*' + C.CHILDREN + '\\s*', 'g'), C.CONTEXT + C.CHILDREN + C.CONTEXT)
					.split(C.CONTEXT);
		
		del = del || false;
		
		var	clone = obj,
			type = C.CHILDREN,
			last = 0, total = 0,
			
			key, i = context.length,
			pos, n,
			
			objLength, cLength;
		
		// remove dead elements
		while ((i -= 1) > -1) {
			context[i] = context[i].trim();
			if (context[i] === '') {
				context.splice(i, 1);
				last -= 1;
			} else if (context[i] !== C.CHILDREN) {
				if (i > last) { last = i; }
				total += 1;
			}
		}
		// recalculate length
		cLength = context.length;
		
		// overload
		// returns the fragment of the context
		if (obj === false) {
			return context.join('');
		} else if (C.isNumber(obj)) {
			if ((obj = +obj) < 0) { obj += total; }
			
			if (typeof value === 'undefined') { 
				for (i = -1, n = 0; (i += 1) < cLength;) {
					if (context[i] !== C.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(i + 1, cLength);
							return context.join('');
						}
					}
				}
			} else {
				for (i = cLength, n = 0; (i -= 1) > -1;) {
					if (context[i] !== C.CHILDREN) {
						if ((n += 1) === obj) {
							context.splice(0, i);
							return context.join('');
						}
					}
				}
			}
		}
		
		for (i = -1; (i += 1) < cLength;) {
			switch (context[i]) {
				case C.CHILDREN : { type = context[i]; } break;
				
				default : {
					// children (>)
					if (type === C.CHILDREN && context[i].substring(0, C.ORDER[0].length) !== C.ORDER[0]) {
						if (i === last && typeof value !== 'undefined') {
							// set new value
							if (del === false) {
								obj[context[i]] = C.expr(value, obj[context[i]]);
							
							// remove from object
							} else {
								if (C.isArray(obj)) {
									obj.splice(context[i], 1);
								} else { delete obj[context[i]]; }
							}
						
						// next
						} else { obj = obj[context[i]]; }
					
					// order (eq)
					} else {
						pos = context[i].substring(C.ORDER[0].length);
						pos = pos.substring(0, (pos.length - 1));
						pos = +pos;
						
						// if array
						if (C.isArray(obj)) {
							if (i === last && typeof value !== 'undefined') {
								// if eq >= 0
								if (pos >= 0) {
									// set new value
									if (del === false) {
										obj[pos] = C.expr(value, obj[pos]);
									
									// remove from object
									} else { obj.splice(pos, 1); }
								
								// if eq < 0
								} else {
									// set new value
									if (del === false) {
										obj[obj.length + pos] = C.expr(value, obj[obj.length + pos]);
									
									// remove from object
									} else { obj.splice(obj.length + pos, 1); }
								}
							} else {
								// next
								if (pos >= 0) {
									obj = obj[pos];
								} else { obj = obj[obj.length + pos]; }
							}
						
						// if object
						} else {
							// calculate position
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
										if (i === last && typeof value !== 'undefined') {
											// set new value
											if (del === false) {
												obj[key] = C.expr(value, obj[key]);
											
											// remove from object
											} else { delete obj[key]; }
										
										// next
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
		
		if (typeof value !== 'undefined') { return clone; }
		return obj;
	};
		
	/**
	 * execute event
	 * 
	 * @this {Collection}
	 * @param {String} query — query string
	 * @param {Object} event — event object
	 * @param {mixed} [param] — input parameters
	 * @param {mixed} [thisObject=event] — object to use as this
	 * @return {mixed}
	 */
	Collection.execEvent = function (query, event, param, thisObject) {
		query = query.split(C.QUERY);
		param = C.isExists(param) ? param : [];
		param = C.isArray(param) ? param : [param];
		
		var i = -1,
			qLength = query.length - 1,
			spliter;
		
		while ((i += 1) < qLength) { event = event[query[i]]; }
		thisObject = thisObject || event;
		
		if (query[i].search(C.SUBQUERY) !== -1) {
			spliter = query[i].split(C.SUBQUERY);
			event = event[spliter[0]];
			spliter.splice(0, 1);
			param = param.concat(spliter);
			
			return event.apply(thisObject, param);
		} else { return event[query[i]].apply(thisObject, param); }
	};