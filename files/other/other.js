	
	/////////////////////////////////
	// additional methods
	/////////////////////////////////
	
	/**
	 * return active property
	 * 
	 * @this {Collection Object}
	 * @param {String} name - property name
	 * @return {mixed}
	 */
	$.Collection.prototype._getActiveParam = function (name) {
		var param = this.dObj.sys.flags.use[name] === undefined || this.dObj.sys.flags.use[name] === true? this.dObj.active[name] : false;
		
		if (name === "context") { return param ? param.toString() : ""; }
		return param;
	};
		
	/**
	 * filter test
	 * 
	 * @this {Collection Object}
	 * @param {String} str - some string
	 * @return {Boolean}
	 */
	$.Collection.prototype._filterTest = function (str) {
		return str === this.ACTIVE || this._exists("filter", str) || str.search(/&&|\|\||:/) !== -1;
	};
		
	/**
	 * enable property
	 * 
	 * @this {Collection Object}
	 * @param {String} name - property name
	 * @return {Collection Object}
	 */
	$.Collection.prototype.enable = function (name) {
		this.dObj.sys.flags.use[name] = true;
		
		return this;
	};
	/**
	 * disable property
	 * 
	 * @this {Collection Object}
	 * @param {String} name - property name
	 * @return {Collection Object}
	 */
	$.Collection.prototype.disable = function (name) {
		this.dObj.sys.flags.use[name] = false;
		
		return this;
	};
	/**
	 * toggle property
	 * 
	 * @this {Collection Object}
	 * @param {String} name - property name
	 * @return {Collection Object}
	 */
	$.Collection.prototype.toggle = function (name) {
		if (this.dObj.sys.flags.use[name] === true) { return this.disable(name); }
		
		return this.enable(name);
	};
	
	// native
	
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Collection} [objID=this.ACTIVE] - collection ID or collection
	 * @param {Function|Array} [replacer] - an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space] - indentation of nested structures
	 * @return {String}
	 */
	$.Collection.prototype.toString = function (objID, replacer, space) {
		if (!JSON || !JSON.stringify) { throw new Error("object JSON is not defined!"); }
		//
		replacer = replacer || "";
		space = space || "";
		//
		if (objID && ($.isArray(objID) || $.isPlainObject(objID))) { return JSON.stringify(objID, replacer, space); }
		//
		return JSON.stringify(nimble.byLink(this._get("collection", objID || ""), this._getActiveParam("context")), replacer, space);
	};
	/**
	 * return collection length (only active)
	 * 
	 * @this {Colletion Object}
	 * @return {Number}
	 */
	$.Collection.prototype.valueOf = function () { return this.length(this.ACTIVE); };