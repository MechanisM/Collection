	
	/////////////////////////////////
	//// static methods (object && template mode)
	/////////////////////////////////
	
	// static template models
	$.Collection.templateModels = {};
	
	// static methods for object
	$.Collection.obj = {
		// link to constants
		constants: $.Collection.fn.config.constants,
		
		/**
		 * calculate math expression
		 * 
		 * @this {Colletion Object}
		 * @param {mixed} nw - new value
		 * @param {mixed} old - old value
		 * @return {mixed}
		 */
		expr: function (nw, old) {
			old = old !== undefined || old !== null ? old : "";
			
			if ($.isString(nw) && nw.search(/^[+-\\*/]{1}=/) !== -1) {
				nw = nw.split("=");
				if (!isNaN(nw[1])) { nw[1] = +nw[1]; }
				// simple math
				switch (nw[0]) {
					case "+" : { nw = old + nw[1]; } break;
					case "-" : { nw = old - nw[1]; } break;
					case "*" : { nw = old * nw[1]; } break;
					case "/" : { nw = old / nw[1]; } break;
				}
			}
			
			return nw;
		},
		
		/**
		* get object by link
		* 
		* @param {Object} obj - some object
		* @param {Context} context - link (sharp (#) char indicates the order)
		* @return {Object}
		*/
		getByLink: function (obj, context) {
			context = context.toString().split(this.constants.contextSeparator);
			
			var
				key, i = -1,
				pos, n = 0,
				
				objLength,
				cLength = context.length - 1;
			
			for (; i++ < cLength;) {
				context[i] = $.trim(context[i]);
				//
				if (context[i] && context[i] !== this.constants.subcontextSeparator) {
					if (context[i].search(this.constants.subcontextSeparator) === -1) {
						obj = obj[context[i]];
					} else {
						pos = +context[i].replace(this.constants.subcontextSeparator, "");
						
						if ($.isArray(obj)) {
							if (pos >= 0) {
								obj = obj[pos];
							} else {
								obj = obj[obj.length + pos];
							}
						} else {
							if (pos < 0) { 
								objLength = 0;
								for (key in obj) {
									if (obj.hasOwnProperty(key)) { objLength++; }
								}
								//
								pos += objLength;
							}
							
							n = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) {
									if (pos === n) {
										obj = obj[key];
										break;
									}
									n++;
								}
							}
						}
					}
				}
			}
			
			return obj;
		},
		/**
		* set new value to object by link
		* 
		* @param {Object} obj - some object
		* @param {Context} context - link (sharp (#) char indicates the order)
		* @param {mixed} value - some value
		* @return {Boolean}
		*/
		setByLink: function (obj, context, value) {
			context = context.toString().split(this.constants.contextSeparator);
			
			var
				key, i = 0,
				pos, n = 0,
				
				objLength,
				cLength = context.length;
			
			// remove "dead" elements
			for (i = cLength; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === this.constants.subcontextSeparator) { context.splice(i, 1); }
			}
			// recalculate length
			cLength = context.length - 1;
			i = -1;
			
			for (; i++ < cLength;) {
				if (context[i].search(this.constants.subcontextSeparator) === -1) {
					if (i === cLength) {
						obj[context[i]] = this.expr(value, obj[context[i]]);
					} else {
						obj = obj[context[i]];
					}
				} else {
					pos = +context[i].replace(this.constants.subcontextSeparator, "");
						
					if ($.isArray(obj)) {
						if (i === cLength) {
							if (pos >= 0) {
								obj[pos] = this.expr(value, obj[pos]);
							} else {
								obj[obj.length + pos] = value;
							}
						} else {
							if (pos >= 0) {
								obj = obj[pos];
							} else {
								obj = this.expr(value, obj[obj.length + pos]);
							}
						}
					} else {
						if (pos < 0) { 
							objLength = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) { objLength++; }
							}
							//
							pos += objLength;
						}
						
						n = 0;
						for (key in obj) {
							if (obj.hasOwnProperty(key)) {
								if (pos === n) {
									if (i === cLength) {
										obj[key] = this.expr(value, obj[key]);
									} else {
										obj = obj[key];
									}
									break;
								}
								n++;
							}
						}
					}
				}
			}
			
			return true;
		},
		/**
		 * add new element to object
		 * 
		 * @param {Plain Object} obj - some object
		 * @param {String} active - property name (can use "::unshift" - the result will be similar to work for an array "unshift")
		 * @param {mixed} value - some value
		 * @return {Plain Object|Boolean}
		 */
		addElementToObject: function (obj, active, value) {
			active = active.split(this.constants.methodSeparator);
			
			var key, newObj = {};
			
			if (active[1] && active[1] == "unshift") {
				newObj[active[0]] = value;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
				obj = newObj;
					
				return obj;
			} else if (!active[1] || active[1] == "push") {
				obj[active[0]] = value;
			}
				
			return true;
		}
	};