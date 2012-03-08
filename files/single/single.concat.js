	
	/////////////////////////////////
	//// single methods (concatenation)
	/////////////////////////////////
	
	/**
	 * concatenation of collections (in context)<br/>
	 * events: onConcat
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj — collection
	 * @param {Context} [context] — additional context
	 * @param {String} [id=this.ACTIVE] — collection ID, which is the concatenation
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3]).pushCollection('test', {a: 1, b: 2});
	 * db.concat([4, 5, 6]); // [1, 2, 3, 4, 5, 6]
	 * db.concat({c: 3, d: 4}, '', 'test'); // {a: b, b: 2, c: 3, d: 4}
	 */
	C.prototype.concat = function (obj, context, id) {
		context = C.isExists(context) ? context.toString() : '';
		id = id || '';
		
		var cObj, e;	
		
		// events
		this.onConcat && (e = this.onConcat.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		cObj = C.byLink(this._get('collection', id), this._getActiveParam('context') + C.CHILDREN + context);
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!') }
		
		if (C.isPlainObject(cObj)) {
			C.extend(true, cObj, obj)
		} else if (C.isArray(cObj)) {
			if (C.isArray(obj)) {
				cObj = Array.prototype.concat(cObj, obj);
				this._setOne(context, cObj, id);
			} else { this.add(obj, 'push', id); }
		}
	
		return this;
	};