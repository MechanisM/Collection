	
	/////////////////////////////////
	//// single methods (core)
	/////////////////////////////////
	
	/**
	 * set new value to element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] - additional context
	 * @param {mixed} value - new value
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._setOne = function (context, value, id) {
		context = $.isExist(context) ? context.toString() : "";
		value = value === undefined ? "" : value;
		id = id || "";
		//
		var activeContext = this._getActiveParam("context");
		//
		if (!context && !activeContext) {
			if (id && id !== this.ACTIVE) {
				return this._push("collection", id, value);
			} else { return this._update("collection", value); }
		}
		nimble.byLink(this._get("collection", id), activeContext + nimble.CHILDREN + context, value);
	
		return this;
	};
	/**
	 * get element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] - additional context
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {mixed}
	 */
	$.Collection.prototype._getOne = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		//
		return nimble.byLink(this._get("collection", id || ""), this._getActiveParam("context") + nimble.CHILDREN + context);
	};