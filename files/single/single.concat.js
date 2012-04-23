	
	/////////////////////////////////
	//// single methods (concatenation)
	/////////////////////////////////
	
	/**
	 * concatenation of collections (in context)<br/>
	 * events: onConcat
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj — collection
	 * @param {String|String Expression} [id=this.ACTIVE] — collection ID, which is the concatenation or string expression (collection ID + : + context, example: my:eq(-1))
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3]).concat([4, 5, 6]).getCollection();
	 */
	Collection.prototype.concat = function (obj, id) {
		var data, context,
			e;
		
		// events
		this.onConcat && (e = this.onConcat.apply(this, arguments));
		if (e === false) { return this; }
		
		id = (id = id || '').split(this.DEF);
		context = id[1] ? id[1].trim() : '';
		id = id[0].trim();
		
		// get by link
		data = this._getOne(context, id);
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object') { throw new Error('incorrect data type!') }
		
		if (C.isPlainObject(data)) {
			C.extend(true, data, obj)
		} else if (C.isArray(data)) {
			if (C.isArray(obj)) {
				data = Array.prototype.concat(data, obj);
				this._setOne(context, data, id);
			} else { this.add(obj, 'push', id); }
		}
	
		return this;
	};