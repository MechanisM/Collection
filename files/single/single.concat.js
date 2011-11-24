	
	/////////////////////////////////
	//// single methods (concatenation)
	/////////////////////////////////
	
	/**
	 * concatenation of collections (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj - collection
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {String} [id=this.config.constants.active] - collection ID, which is the concatenation
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.concat = function (obj, context, id) {
		context = $.isExist(context) ? context.toString() : "";
	
		var
			constants = this.config.constants,
		
			dObj = this.dObj,
			cObj;
		
		cObj = $.Collection.obj.getByLink(id && id !== constants.active ? dObj.sys.tmpCollection[id] : dObj.prop.collection, this.getActiveContext() + constants.contextSeparator + context);	
		
		if (typeof cObj === "object") {
			if ($.isPlainObject(cObj)) {
				$.extend(true, cObj, obj)
			} else if ($.isArray(cObj)) {
				if ($.isArray(obj)) {
					cObj = Array.prototype.concat(cObj, obj);
					this.setElement(context, cObj, id || "");
				} else { this.addElement(obj, "push", id || ""); }
			}
		} else { throw new Error("incorrect data type!"); }
	
		return this;
	};