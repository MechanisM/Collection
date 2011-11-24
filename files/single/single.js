	
	/////////////////////////////////
	//// single methods (core)
	/////////////////////////////////
	
	/**
	 * set new value to element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {mixed} value - new value
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.setElement = function (context, value, id) {
		context = $.isExist(context) ? context.toString() : "";
		value = value === undefined ? "" : value;
	
		var
			constants = this.config.constants,
		
			dObj = this.dObj,	
			activeContext = this.getActiveContext();
		
		if (!context && !activeContext) {
			if (id && id !== constants.active) {
				return this._push("collection", id, value);
			} else {
				return this._update("collection", value);
			}
		}
		
		$.Collection.obj.setByLink(id && id !== constants.active ? dObj.sys.tmpCollection[id] : dObj.prop.collection, activeContext + constants.contextSeparator + context, value);
	
		return this;
	};
	/**
	 * get element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {mixed}
	 */
	$.Collection.fn.getElement = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			constants = this.config.constants,
			dObj = this.dObj;
		
		return $.Collection.obj.getByLink(id && id !== constants.active ? dObj.sys.tmpCollection[id] : dObj.prop.collection, this.getActiveContext() + constants.contextSeparator + context);
	};