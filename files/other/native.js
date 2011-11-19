	
	/////////////////////////////////
	// native
	/////////////////////////////////
		
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Object} [id=this.active] - collection ID
	 * @param {Function|Array} [replacer=undefined] - an optional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space=undefined] - indentation of nested structures
	 * @return {String}
	 */
	$.Collection.fn.toString = function (id, replacer, space) {
		var dObj = this.dObj, cObj;
	
		cObj = id && id !== this.active ? dObj.sys.tmpCollection[id] : dObj.prop.activeCollection;
		cObj = $.Collection.stat.obj.getByLink(cObj, this.getActiveContext());
		
		if (JSON && JSON.stringify) {
			return JSON.stringify(cObj, replacer || "", space || "");
		}
		throw new Error("object JSON is not defined!");
	};
	/**
	 * return collection length
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.active] - collection ID
	 * @return {Number}
	 */
	$.Collection.fn.valueOf = function (id) {
		return this.length($.isExist(id) ? id : this.active);
	};