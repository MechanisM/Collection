	
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
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.reverse().getCollection();
	 */
	Collection.prototype.reverse = function (id) {
		id = id || '';
		var cObj, e;
		
		// events
		this.onReverse && (e = this.onReverse.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		cObj = Collection.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!'); }
		
		if (Collection.isArray(cObj)) {
			cObj.reverse();
		} else { this._setOne('', Collection._reverseObject(cObj), id); }
		
		return this;
	};