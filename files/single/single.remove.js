	
	/////////////////////////////////
	//// single methods (remove)
	/////////////////////////////////
		
	/**
	 * delete element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] - link
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype._removeOne = function (context, id) {
		context = $.isExists(context) ? context.toString() : "";
		var activeContext = this._getActiveParam("context"), e = null;
		
		// events
		this.onRemove && (e = this.onRemove.apply(this, arguments));
		if (e === false) { return this; }
		
		if (!context && !activeContext) {
			this._setOne("", null);
		} else { C.byLink(this._get("collection", id || ""), activeContext + C.CHILDREN + context, "", true); }
	
		return this;
	};
	/**
	 * delete elements by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext - link, array of links or object (collection ID: array of links)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype._remove = function (objContext, id) {
		id = id || "";
		var key, i;
		//
		if ($.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if ($.isArray(objContext[key])) {
						for (i = objContext[key].length; (i -= 1) > -1;) {
							this._removeOne(objContext[key][i], key);
						}
					} else { this._removeOne(objContext[key], key); }
				}
			}
		} else if ($.isArray(objContext)) {
			for (i = objContext.length; (i -= 1) > -1;) { this._removeOne(objContext[i], id); }
		} else { this._removeOne(objContext, id); }
	
		return this;
	};
	
	/**
	 * remove an element from the collection (pop)(in context)<br/>
	 * events: onRemove
	 * <i class="single"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype.pop = function (id) { return this._removeOne("eq(-1)", id || ""); };
	/**
	 * remove an element from the collection (shift)(in context)<br/>
	 * events: onRemove
	 * <i class="single"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype.shift = function (id) { return this._removeOne("eq(0)", id || ""); };