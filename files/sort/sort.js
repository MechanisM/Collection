	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * sort object
	 * 
	 * @this {Collection}
	 * @param {Object} obj — some object
	 * @param {Context} field — field name
	 * @param {Function} sort — sort function
	 * @return {Object}
	 */
	C._sortObject = function (obj, field, sort) {
		var
			sortedValues = [],
			sortedObj = {},
			key;
		
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				sortedValues.push({
					key: key,
					value: obj[key]
				});
			}
		}
		sortedValues.sort(sort);
		
		for (key in sortedValues) {
			if (sortedValues.hasOwnProperty(key)) { sortedObj[sortedValues[key].key] = sortedValues[key].value; }
		}
		
		return sortedObj;
	};
	
	/**
	 * sort the object by the key
	 * 
	 * @this {Collection}
	 * @param {Object} obj — some object
	 * @param {Function} sort — sort function
	 * @return {Object}
	 */
	C._sortObjectByKey = function (obj, sort) {
		var
			sortedKeys = [],
			sortedObj = {},
			key;
		
		for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
		sortedKeys.sort(sort);
		
		for (key in sortedKeys) {
			if (sortedKeys.hasOwnProperty(key)) { sortedObj[sortedKeys[key]] = obj[sortedKeys[key]]; }
		}

		return sortedObj;
	};
	
	/**
	 * sort collection (in context)<br />
	 * events: onSort
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [field] — field name
	 * @param {Boolean} [rev=false] — reverce (contstants: 'shuffle' — random order)
	 * @param {Function|Boolean} [fn=toUpperCase] — callback function (false if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([
	 *	{name: 'Andrey', age: 22},
	 *	{name: 'John', age: 19},
	 *	{name: 'Bon', age: 25},
	 *	{name: 'Bill', age: 15}
	 * ]);
	 * // sort by name
	 * db.sort('name');
	 * // sort by age (reverse)
	 * db.sort('age', true);
	 */
	C.prototype.sort = function (field, rev, fn, id) {
		field = field || '';
		rev = rev || false;
		fn = fn && fn !== true ? fn === false ? '' : fn : function (a) {
			if (C.isString(a)) { return a.toUpperCase(); }
			
			return a;
		};
		id = id || '';
		
		var
			self = this,
			cObj,
			
			/** @private */
			sort = function (a, b) {
				var r = rev ? -1 : 1;
				
				// sort by field
				if (field) {
					a = C.byLink(a, field);
					b = C.byLink(b, field);
				}
				// callback function
				if (fn) {
					a = fn(a);
					b = fn(b);
				}
				
				if (rev !== self.SHUFFLE) {	
					if (a < b) { return r * -1; }
					if (a > b) { return r; }
					
					return 0;
				
				// random sort
				} else { return Math.round(Math.random() * 2  - 1); }
			}, e;
		
		// events
		this.onSort && (e = this.onSort.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		cObj = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!'); }

		if (C.isArray(cObj)) {
			cObj.sort(sort);
		} else {
			if (field) {
				// change the field to sort the object
				field = field === true ? 'value' : 'value' + C.CHILDREN + field;
				cObj = C._sortObject(cObj, field, sort);
			} else { cObj = C._sortObjectByKey(cObj, sort); }
			
			this._setOne('', cObj, id);
		}
		
		return this;
	};