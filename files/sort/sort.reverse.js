	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
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
	 * var db = new $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}]);
	 * db.reverse();
	 */
	C.prototype.reverse = function (id) {
		id = id || '';
		
		var
			cObj,
			
			/** @private */
			reverseObject = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					key;
				
				for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
				sortedKeys.reverse();
				
				for (key in sortedKeys) {
					if (sortedKeys.hasOwnProperty(key)) { sortedObj[sortedKeys[key]] = obj[sortedKeys[key]]; }
				}
	
				return sortedObj;
			}, e;
		
		// events
		this.onReverse && (e = this.onReverse.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		cObj = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!'); }
		
		if (C.isArray(cObj)) {
			cObj.reverse();
		} else { this._setOne('', reverseObject(cObj), id); }
		
		return this;
	};