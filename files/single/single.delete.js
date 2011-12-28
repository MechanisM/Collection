	
	/////////////////////////////////
	//// single methods (delete)
	/////////////////////////////////
		
	/**
	 * delete element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - link (sharp (#) char indicates the order)
	 * @param {String} [id=constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementByLink = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			constants = this.config.constants,
		
			dObj = this.dObj,
			
			key, i,
			pos, n,
			
			objLength,
			cObj,
			
			activeContext = this.getActiveContext();
		
		if (!context && !activeContext) {
			this.setElement("", null);
		} else {
			// prepare context
			context = (activeContext + constants.contextSeparator + context).split(constants.contextSeparator);
			// remove "dead" elements
			for (i = context.length; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === constants.subcontextSeparator) { context.splice(i, 1); }
			}
			context = context.join(constants.contextSeparator);

			// choice of the parent element to check the type
			cObj = $.Collection.obj.getByLink(id && id !== constants.active ?
						dObj.sys.tmpCollection[id] : dObj.active.collection,
						context.replace(new RegExp("[^" + constants.contextSeparator + "]+$"), ""));
			// choice link
			context = context.replace(new RegExp(".*?([^" + constants.contextSeparator + "]+$)"), "$1");

			if ($.isArray(cObj)) {
				context = +context.replace(constants.subcontextSeparator, "");
				if (context >= 0) {
					cObj.splice(context, 1);
				} else { cObj.splice(cObj.length + context, 1); }
			} else {
				if (context.search(constants.subcontextSeparator) === -1) {
					delete cObj[context];
				} else {
					pos = +context.replace(constants.subcontextSeparator, "");
					if (pos < 0) { 
						objLength = 0;
						// object length
						for (key in cObj) {
							if (cObj.hasOwnProperty(key)) { objLength++; }
						}
						// if reverse
						pos += objLength;
					}

					n = 0;
					for (key in cObj) {
						if (cObj.hasOwnProperty(key)) {
							if (pos === n) {
								delete cObj[key];
								break;
							}
							n++;
						}
					}
				}
			}
		}
	
		return this;
	};
	/**
	 * delete elements by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext - link (sharp (#) char indicates the order), array of links or object (collection ID: array of links)
	 * @param {String} [id=constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementsByLink = function (objContext, id) {
		var key, i;
	
		if ($.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if ($.isArray(objContext[key])) {
						for (i = objContext[key].length; i--;) {
							this.deleteElementByLink(objContext[key][i], key);
						}
					} else { this.deleteElementByLink(objContext[key], key); }
				}
			}
		} else if ($.isArray(objContext)) {
			for (i = objContext.length; i--;) {
				this.deleteElementByLink(objContext[i], id || "");
			}
		} else { this.deleteElementByLink(objContext, id || ""); }
	
		return this;
	};