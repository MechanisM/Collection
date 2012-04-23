	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * reverse object
	 * 
	 * @this {Collection}
	 * @param {Object} obj — some object
	 * @return {Object}
	 */
	Collection._reverseObject = function (obj) {
		var sortedKeys = [],
			sortedObj = {},
			key;
		
		for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
		sortedKeys.reverse();
		
		for (key in sortedKeys) {
			if (sortedKeys.hasOwnProperty(key)) { sortedObj[sortedKeys[key]] = obj[sortedKeys[key]]; }
		}

		return sortedObj;
	};
	
	/**
	 * reverse collection (in context)<br />
	 * events: onReverse
	 * 
	 * @this {Colletion Object}
	 * @param {String|String Expression} [id=this.ACTIVE] — collection ID or string expression (collection ID + : + context, example: my:eq(-1))
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.reverse().getCollection();
	 */
	Collection.prototype.reverse = function (id) {
		var data, e, context;
		
		// events
		this.onReverse && (e = this.onReverse.apply(this, arguments));
		if (e === false) { return this; }
		
		// overload the ID of the additional context
		id = (id = id || '').split(this.DEF);
		context = id[1] ? id[1].trim() : '';
		id = id[0].trim();
		
		// get by link
		data = this._getOne(context, id);
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object') { throw new Error('incorrect data type!'); }
		
		if (C.isArray(data)) {
			data.reverse();
		} else { this._setOne('', C._reverseObject(data), id); }
		
		return this;
	};