	
	/////////////////////////////////
	// additional methods
	/////////////////////////////////
	
	/**
	 * return to active parameter stack (flags included)
	 * 
	 * @this {Collection Object}
	 * @param {String} name — property name
	 * @return {mixed}
	 */
	C.prototype._getActiveParam = function (name) {
		var param = typeof this.dObj.sys.flags.use[name] === 'undefined' || this.dObj.sys.flags.use[name] === true ? this.dObj.active[name] : false;
		
		if (name === 'context') { return param ? param.toString() : ''; }
		return param;
	};
		
	/**
	 * filter test
	 * 
	 * @this {Collection Object}
	 * @param {String} str — some string
	 * @return {Boolean}
	 */
	C.prototype._filterTest = function (str) {
		return str === this.ACTIVE || this._exists('filter', str) || str.search(/&&|\|\||:/) !== -1;
	};
	/**
	 * expression test
	 * 
	 * @this {Collection Object}
	 * @param {mixed} str — some object
	 * @return {Boolean}
	 */
	C.prototype._exprTest = function (str) {
		return C.isString(str) && str.search(/^:/) !== -1;
	};
	
		
	/**
	 * enable flag
	 * 
	 * @this {Collection Object}
	 * @param {String} [objectN] — flag name
	 * @return {Collection Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.enable('cache', 'filter');
	 */
	C.prototype.enable = function () {
		Array.prototype.forEach.call(arguments, function (el) {
			this.dObj.sys.flags.use[el] = true
		}, this);
		
		return this;
	};
	/**
	 * disable flag
	 * 
	 * @this {Collection Object}
	 * @param {String} [objectN] — flag name
	 * @return {Collection Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.disable('cache', 'filter');
	 */
	C.prototype.disable = function () {
		Array.prototype.forEach.call(arguments, function (el) {
			this.dObj.sys.flags.use[el] = false
		}, this);
		
		return this;
	};
	/**
	 * toggle flag
	 * 
	 * @this {Collection Object}
	 * @param {String} [objectN] — flag name
	 * @return {Collection Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.toggle('cache', 'filter');
	 */
	C.prototype.toggle = function () {
		Array.prototype.forEach.call(arguments, function (el) {
			if (this.dObj.sys.flags.use[el] === true) {
				this.disable(arguments[key]);
			} else { this.enable(arguments[key]); }
		}, this);
	};
	
	// native
	
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Collection} [objID=this.ACTIVE] — collection ID or collection
	 * @param {Function|Array} [replacer] — an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space] — indentation of nested structures
	 * @return {String}
	 */
	C.prototype.toString = function (objID, replacer, space) {
		if (typeof JSON === 'undefined' || !JSON.stringify) { throw new Error('object JSON is not defined!'); }
		
		replacer = replacer || '';
		space = space || '';
		
		if (objID && C.isCollection(objID)) { return JSON.stringify(objID, replacer, space); }
		
		return JSON.stringify(C.byLink(this._get('collection', objID || ''), this._getActiveParam('context')), replacer, space);
	};
	/**
	 * return collection length (only active)
	 * 
	 * @this {Colletion Object}
	 * @return {Number}
	 */
	C.prototype.valueOf = function () { return this.length(this.ACTIVE); };