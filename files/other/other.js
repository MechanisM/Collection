	
	/////////////////////////////////
	// additional methods
	/////////////////////////////////
	
	/**
	 * returns the active parameter stack (flags included)
	 * 
	 * @this {Collection Object}
	 * @param {String} name — property name
	 * @return {mixed}
	 */
	Collection.prototype._getActiveParam = function (name) {
		var param = typeof this.dObj.sys.flags.use[name] === 'undefined' || this.dObj.sys.flags.use[name] === true ? this.dObj.active[name] : false;
		
		if (name === 'context') { return param ? param.toString() : ''; }
		return param;
	};
	
	/**
	 * returns a Boolean indicating whether the string is a filter
	 * 
	 * @this {Collection Object}
	 * @param {String} str — some string
	 * @return {Boolean}
	 */
	Collection.prototype._isFilter = function (str) {
		return str === this.ACTIVE || this._exists('filter', str) || str.search(this.FILTER_REGEXP) !== -1;
	};
	/**
	 * returns a Boolean indicating whether the object is a string expression
	 * 
	 * @this {Collection Object}
	 * @param {mixed} obj — some object
	 * @return {Boolean}
	 */
	Collection.prototype._isStringExpression = function (obj) {
		return C.isString(obj) && obj.search(this.DEF_REGEXP) !== -1;
	};
	
	/**
	 * splits ID on atoms
	 * 
	 * @this {Collection Object}
	 * @param {String} id — collection ID
	 * @return {Plain Object}
	 */
	Collection.prototype._splitId = function (id) {
		id = id || '';
		var res = {};
		
		if (id.search(this.SPLITTER) !== -1) {
			res.id = id.split(this.SPLITTER);
			res.set = true;
		} else {
			res.id = id.split(this.SHORT_SPLITTER);
			res.set = false;
		}
		
		if (res.id[1]) {
			res.to = res.id[1].trim();
		} else { res.to = ''; }
		res.id = res.id[0].trim();
		
		return res;
	};
	
	/**
	 * save the result in the collection
	 * 
	 * @this {Collection Object}
	 * @param {String} to — ID to be stored in the stack
	 * @param {Boolean} set — if true, the collection will be active
	 * @param {mixed} val — value for the save
	 * @param {Boolean} [active=false] — use the active context
	 * @return {Collection Object}
	 */
	Collection.prototype._saveResult = function (to, set, val, active) {
		to = to.split(this.WITH);
		active = active || false;
		var context;
		
		if (to[1]) {
			to = to[1].split(this.DEF);
			
			context = to[1] ? to[1].trim() : '';
			to = to[0].trim();
			
			if (this._validate('collection', to)) {
				if (active) {
					this.concat(val, to + ':' + context);
				} else {
					this
						.disable('context')
						.concat(val, to + ':' + context)
						.enable('context');
				}
			} else {
				this._push('collection', to, val);
			}
		} else {
			to = to[0].split(this.DEF);
			
			context = to[1] ? to[1].trim() : '';
			to = to[0].trim();
			
			if (this._validate('collection', to) && (context || active)) {
				if (active) {
					this._setOne(context, val, to);
				} else {
					this
						.disable('context')
						._setOne(context, val, to)
						.enable('context');
				}
			} else {
				this._push('collection', to, val);
			}
		}
		
		if (set === true) { return this._set('collection', to); }
		
		return this;
	};
	
	/**
	 * enable flag
	 * 
	 * @this {Collection Object}
	 * @param {String} [objectN] — flag name
	 * @return {Collection Object}
	 */
	Collection.prototype.enable = function () {
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
	 */
	Collection.prototype.disable = function () {
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
	 */
	Collection.prototype.toggle = function () {
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
	 * @param {String|String Expression|Collection} [objId=this.ACTIVE] — collection ID, string expression string expression (collection ID + : + context, example: my:eq(-1)) or collection
	 * @param {Function|Array} [replacer] — an paramional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space] — indentation of nested structures
	 * @return {String}
	 */
	Collection.prototype.toString = function (objId, replacer, space) {
		if (typeof JSON === 'undefined' || !JSON.stringify) { throw new Error('object JSON is not defined!'); }
		
		objId = objId || '';
		replacer = replacer || '';
		space = space || '';
		var context;
		
		if (C.isCollection(objId)) { return JSON.stringify(objId, replacer, space); }
		
		objId = objId.split(this.DEF);
		context = objId.length === 2 ? objId[1].trim() : '';
		objId = objId[0].trim();
		
		return JSON.stringify(this._getOne(context, objId), replacer, space);
	};
	/**
	 * return collection length (only active)
	 * 
	 * @this {Colletion Object}
	 * @return {Number}
	 */
	Collection.prototype.valueOf = function () {
		if (arguments[0] === 'object') { return this; }
		return this.length(this.ACTIVE);
	};