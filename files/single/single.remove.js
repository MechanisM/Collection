	
	/////////////////////////////////
	//// single methods (remove)
	/////////////////////////////////
		
	/**
	 * remove an one element from the collection by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] — link
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 */
	Collection.prototype._removeOne = function (context, id) {
		context = C.isExists(context) ? context.toString() : '';
		var activeContext = this._getActiveParam('context'), e;
		
		// events
		this.onRemove && (e = this.onRemove.apply(this, arguments));
		if (e === false) { return this; }
		
		// if no context
		if (!context && !activeContext) {
			this._setOne('', null);
		} else { C.byLink(this._get('collection', id || ''), activeContext + C.CHILDREN + context, '', true); }
	
		return this;
	};
	/**
	 * remove an elements from the collection by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext — link, array of links or object (collection ID: array of links)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 */
	Collection.prototype._remove = function (objContext, id) {
		id = id || '';
		var key, i;
		
		if (C.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if (C.isArray(objContext[key])) {
						for (i = objContext[key].length; (i -= 1) > -1;) {
							this._removeOne(objContext[key][i], key);
						}
					} else { this._removeOne(objContext[key], key); }
				}
			}
		} else if (C.isArray(objContext)) {
			for (i = objContext.length; (i -= 1) > -1;) { this._removeOne(objContext[i], id); }
		} else { this._removeOne(objContext, id); }
	
		return this;
	};