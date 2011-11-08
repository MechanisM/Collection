	
	/////////////////////////////////
	// native
	/////////////////////////////////
		
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Object} [vID=this.active] - collection ID or some object
	 * @param {Function|Array} [replacer=undefined] - an optional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space=undefined] - indentation of nested structures
	 * @return {String}
	 */
	$.Collection.fn.toString = function (vID, replacer, space) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
	
			cObj,
			i;
	
		cObj = vID && $.isString(vID) && vID !== this.active ? dObj.sys.tmpCollection[vID] : typeof vID === "object" ? vID : prop.activeCollection;
		cObj = $.Collection.stat.obj.getByLink(cObj, this.getActiveContext());
		
		return JSON.stringify(cObj, replacer || "", space || "");
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