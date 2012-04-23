	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to the collection (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|String Expression} [val] — new element or string expression (context + >> + new element, example: eq(-1) > a >> [1, 2, 3])
	 * @param {String} [propType='push'] — add type (constants: 'push', 'unshift') or property name (can use '->unshift' - the result will be similar to work for an array unshift, example: myName->unshift)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([]);
	 * // add a new element to the active collection //
	 * db.add(1);
	 * // unshift //
	 * db.add(2, 'unshift');
	 *
	 * console.log(db.getCollection());
	 * @example
	 * var db = $C().pushSetCollection('test', []);
	 * // add a new element to the 'test' //
	 * db.add(1, 'b', 'test');
	 * // unshift //
	 * db.add(2, 'a->unshift', 'test');
	 * // without specifying the key name //
	 * db.add(3, '', 'test');
	 * db.add(4, 'unshift', 'test');
	 *
	 * console.log(db.getCollection());
	 */
	Collection.prototype.add = function (val, propType, id) {
		// events
		var e;
		this.onAdd && (e = this.onAdd.apply(this, arguments));
		if (e === false) { return this; }
		
		// overload the values of the additional context
		var withSplitter;
		val = typeof val !== 'undefined' ? val : '';
		val = C.isString(val) ? (withSplitter = true) && val.split(this.SHORT_SPLITTER) : val;
		
		propType = propType || 'push';
		id = id || '';
		
		var	context = '',
			data, rewrite;
		
		if (withSplitter) {
			if (val[1]) {
				context = val[0].trim();
				
				val = val[1].trim();
				// data conversion
				if (val.search(/^\{|\[/) !== -1 || !isNaN(parseFloat(val))) {
					val = eval(val);
				}
			} else { val = val[0].trim(); }
		}
		
		// get by link
		data = this._getOne(context, id);
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object')  { throw new Error('unable to set property!'); }
		
		// add type
		if (C.isPlainObject(data)) {
			propType = propType === 'push' ? this.length(data) : propType === 'unshift' ? this.length(data) + C.METHOD + 'unshift' : propType;
			rewrite = C.addElementToObject(data, propType.toString(), val);
		} else {
			rewrite = true;
			data[propType](val);
		}
		
		// rewrites links (if used for an object 'unshift')
		if (rewrite !== true) { this._setOne('', rewrite, id); }
	
		return this;
	};
	
	/**
	 * add new element to the collection (push) (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|String Expression} obj — new element or string expression (context + >> + new element, example: eq(-1) > a >> [1, 2, 3])
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([12]).push(1).getCollection();
	 */
	Collection.prototype.push = function (obj, id) {
		return this.add(obj, '', id || '');
	};
	/**
	 * add new element to the collection (unshift) (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|String Expression} obj — new element or string expression (context + >> + new element, example: eq(-1) > a >> [1, 2, 3])
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1]).unshift(2).getCollection();
	 */
	Collection.prototype.unshift = function (obj, id) {
		return this.add(obj, 'unshift', id || '');
	};