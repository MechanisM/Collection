	
	/**
	 * Конкатенация коллекций (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj - коллекция
	 * @param {Context} context - дополнительный контекст (знак # указывает порядок)
	 * @param {String} [id=this.active] - ИД коллекции, с которой происходит конкатенация
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.concat = function (obj, context, id) {
		context = $.isExist(context) ? context.toString() : "";
	
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
	
			cObj;
		
		cObj = statObj.getByLink(id && id !== this.active ? dObj.sys.tmpCollection[id] : prop.activeCollection, prop.activeContext + statObj.contextSeparator + context);	
		
		if (typeof cObj === "object") {
			if ($.isPlainObject(cObj)) {
				$.extend(true, cObj, obj)
			} else if ($.isArray(cObj)) {
				if ($.isArray(obj)) {
					cObj = Array.prototype.concat(cObj, obj);
					this.setElement(context, cObj, id || "");
				} else { this.addElement(obj, "push", id || ""); }
			}
		} else { throw new Error("Incorrect data type!"); }
	
		return this;
	};