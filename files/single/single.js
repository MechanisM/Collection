	
	/////////////////////////////////
	//// single methods (core)
	/////////////////////////////////
	
	/**
	 * set new value to element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {mixed} value - new value
	 * @param {String} [id=this.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.setElement = function (context, value, id) {
		context = $.isExist(context) ? context.toString() : "";
		value = value === undefined ? "" : value;
	
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,	
			activeContext = this.getActiveContext();
		
		if (!context && !activeContext) {
			if (id && id !== this.active) {
				return this._push("Collection", id, value);
			} else {
				return this._update("Collection", value);
			}
		}
		
		statObj.setByLink(id && id !== this.active ? dObj.sys.tmpCollection[id] : dObj.prop.activeCollection, activeContext + statObj.contextSeparator + context, value);
	
		return this;
	};
	/**
	 * get element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {String} [id=this.active] - collection ID
	 * @return {mixed}
	 */
	$.Collection.fn.getElement = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			statObj = $.Collection.stat.obj,
			dObj = this.dObj;
	
		return statObj.getByLink(id && id !== this.active ? dObj.sys.tmpCollection[id] : dObj.prop.activeCollection, this.getActiveContext() + statObj.contextSeparator + context);
	};