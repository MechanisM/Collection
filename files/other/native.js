	
	/////////////////////////////////
	// native
	/////////////////////////////////
		
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Collection} [objID=this.config.constants.active] - collection ID or collection
	 * @param {Function|Array} [replacer=undefined] - an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space=undefined] - indentation of nested structures
	 * @return {String}
	 */
	$.Collection.fn.toString = function (objID, replacer, space) {
		var dObj = this.dObj, cObj;
		
		if (objID && ($.isArray(objID) || $.isPlainObject(objID))) {
			if (JSON && JSON.stringify) {
				return JSON.stringify(objID, replacer || "", space || "");
			}
			throw new Error("object JSON is not defined!");
		}
		
		cObj = objID && objID !== this.config.constants.active ? dObj.sys.tmpCollection[objID] : dObj.active.collection;
		cObj = $.Collection.obj.getByLink(cObj, this.getActiveContext());
		
		if (JSON && JSON.stringify) {
			return JSON.stringify(cObj, replacer || "", space || "");
		}
		throw new Error("object JSON is not defined!");
	};
	/**
	 * return collection length
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Number}
	 */
	$.Collection.fn.valueOf = function (id) {
		return this.length($.isExist(id) ? id : this.config.constants.active);
	};