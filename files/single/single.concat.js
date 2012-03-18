	
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
	 * $C([1, 2, 3]).concat([4, 5, 6]).getCollection();
	 */
	Collection.prototype.concat = function (obj, context, id) {
		context = Collection.isExists(context) ? context.toString() : '';
		id = id || '';
		
		var cObj, e;	
		
		// events
		this.onConcat && (e = this.onConcat.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		cObj = Collection.byLink(this._get('collection', id), this._getActiveParam('context') + Collection.CHILDREN + context);
		
		// throw an exception if the element is not an object
		if (typeof cObj !== 'object') { throw new Error('incorrect data type!') }
		
		if (Collection.isPlainObject(cObj)) {
			Collection.extend(true, cObj, obj)
		} else if (Collection.isArray(cObj)) {
			if (Collection.isArray(obj)) {
				cObj = Array.prototype.concat(cObj, obj);
				this._setOne(context, cObj, id);
			} else { this.add(obj, 'push', id); }
		}
	
		return this;
	};