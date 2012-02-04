	
	/////////////////////////////////
	//// single methods (concatenation)
	/////////////////////////////////
	
	/**
	 * concatenation of collections (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj - collection
	 * @param {Context} [context] - additional context
	 * @param {String} [id=this.ACTIVE] - collection ID, which is the concatenation
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.concat = function (obj, context, id) {
		context = $.isExist(context) ? context.toString() : "";
		id = id || "";
		//
		var cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context") + nimble.CHILDREN + context);	
		//
		if (typeof cObj === "object") {
			if ($.isPlainObject(cObj)) {
				$.extend(true, cObj, obj)
			} else if ($.isArray(cObj)) {
				if ($.isArray(obj)) {
					cObj = Array.prototype.concat(cObj, obj);
					this._setOne(context, cObj, id);
				} else { this.add(obj, "push", id); }
			}
		} else { throw new Error("incorrect data type!"); }
	
		return this;
	};