	
	/////////////////////////////////
	//// single methods (concatenation)
	/////////////////////////////////
	
	/**
	 * concatenation of collections (in context)<br/>
	 * events: onConcat
	 * <i class="single"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj - collection
	 * @param {Context} [context] - additional context
	 * @param {String} [id=this.ACTIVE] - collection ID, which is the concatenation
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.concat = function (obj, context, id) {
		context = $.isExists(context) ? context.toString() : "";
		id = id || "";
		//
		var cObj, e = null;	
		
		// events
		this.onConcat && (e = this.onConcat.apply(this, arguments));
		if (e === false) { return this; }
		
		//
		cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context") + nimble.CHILDREN + context);
		
		//
		if (typeof cObj !== "object") { throw new Error("incorrect data type!") }
		
		if ($.isPlainObject(cObj)) {
			$.extend(true, cObj, obj)
		} else if ($.isArray(cObj)) {
			if ($.isArray(obj)) {
				cObj = Array.prototype.concat(cObj, obj);
				this._setOne(context, cObj, id);
			} else { this.add(obj, "push", id); }
		}
	
		return this;
	};