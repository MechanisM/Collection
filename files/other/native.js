	
	/////////////////////////////////
	// native
	/////////////////////////////////
		
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Collection} [objID=this.ACTIVE] - collection ID or collection
	 * @param {Function|Array} [replacer] - an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space] - indentation of nested structures
	 * @return {String}
	 */
	$.Collection.fn.toString = function (objID, replacer, space) {
		var dObj = this.dObj, cObj;
		
		if (objID && ($.isArray(objID) || $.isPlainObject(objID))) {
			if (JSON && JSON.stringify) { return JSON.stringify(objID, replacer || "", space || ""); }
			throw new Error("object JSON is not defined!");
		}
		//
		cObj = nimble.byLink(this._get("collection", objID || ""), this.getActiveParam("context").toString());
		//
		if (JSON && JSON.stringify) { return JSON.stringify(cObj, replacer || "", space || ""); }
		throw new Error("object JSON is not defined!");
	};
	/**
	 * return collection length (only active)
	 * 
	 * @this {Colletion Object}
	 * @return {Number}
	 */
	$.Collection.fn.valueOf = function () { return this.length(this.ACTIVE); };