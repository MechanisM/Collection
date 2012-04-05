	
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
	Collection._sortObject = function (obj, field, sort) {
		var sortedValues = [],
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
	Collection._sortObjectByKey = function (obj, sort) {
		var sortedKeys = [],
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
	 * @param {Context|Function|String Expression} [field] — field name or callback function (can be used string expression, the record is equivalent to: return + string expression)
	 * @param {Boolean} [rev=false] — reverce (contstants: 'shuffle' — random order)
	 * @param {Function|Boolean} [fn=toUpperCase] — callback function (false if disabled, can be used string expression, the record is equivalent to: return + string expression)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([
	 *	{name: 'Andrey', age: 22},
	 *	{name: 'John', age: 19},
	 *	{name: 'Bon', age: 25},
	 *	{name: 'Bill', age: 15}
	 * ]).sort('name').getCollection();
	 * @example
	 * $C([
	 *	{name: 'Andrey', age: 22, lvl: 80},
	 *	{name: 'John', age: 19, lvl: 95},
	 *	{name: 'Bon', age: 25, lvl: 85},
	 *	{name: 'Bill', age: 15, lvl: 80}
	 * ]).sort(':el.age + el.lvl').getCollection();
	 */
	Collection.prototype.sort = function (field, rev, fn, id) {
		field = (field = field || '') && this._isStringExpression(field) ? this._compileFilter(field) : field;
		rev = rev || false;
		fn = fn && fn !== true ? fn === false ? '' : fn : function (a) {
			if (C.isString(a)) { return a.toUpperCase(); }
			
			return a;
		};
		fn = this._isStringExpression(fn) ? this._compileFilter(fn) : fn;
		id = id || '';
		
		var self = this,
			data,
			
			/** @private */
			sort = function (a, b) {
				var r = rev ? -1 : 1;
				
				// sort by field
				if (field) {
					if (!C.isFunction(field)) {
						a = C.byLink(a, field);
						b = C.byLink(b, field);
					} else {
						a = field(a, id);
						b = field(b, id);
					}
				}
				// callback function
				if (fn) {
					a = fn(a, id);
					b = fn(b, id);
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
		data = C.byLink(this._get('collection', id), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object') { throw new Error('incorrect data type!'); }

		if (Collection.isArray(data)) {
			data.sort(sort);
		} else {
			if (field) {
				// change the field to sort the object
				field = field === true ? 'value' : 'value' + C.CHILDREN + field;
				data = C._sortObject(data, field, sort);
			} else { data = C._sortObjectByKey(data, sort); }
			
			this._setOne('', data, id);
		}
		
		return this;
	};