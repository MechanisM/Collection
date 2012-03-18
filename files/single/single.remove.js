	
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
		context = Collection.isExists(context) ? context.toString() : '';
		var activeContext = this._getActiveParam('context'), e;
		
		// events
		this.onRemove && (e = this.onRemove.apply(this, arguments));
		if (e === false) { return this; }
		
		// if no context
		if (!context && !activeContext) {
			this._setOne('', null);
		} else { Collection.byLink(this._get('collection', id || ''), activeContext + Collection.CHILDREN + context, '', true); }
	
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
		
		if (Collection.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if (Collection.isArray(objContext[key])) {
						for (i = objContext[key].length; (i -= 1) > -1;) {
							this._removeOne(objContext[key][i], key);
						}
					} else { this._removeOne(objContext[key], key); }
				}
			}
		} else if (Collection.isArray(objContext)) {
			for (i = objContext.length; (i -= 1) > -1;) { this._removeOne(objContext[i], id); }
		} else { this._removeOne(objContext, id); }
	
		return this;
	};
	
	/**
	 * remove an element from the collection (pop) (in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3]).pop().getCollection();
	 */
	Collection.prototype.pop = function (id) { return this._removeOne('eq(-1)', id || ''); };
	/**
	 * remove an element from the collection (shift) (in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3]).shift().getCollection();
	 */
	Collection.prototype.shift = function (id) { return this._removeOne('eq(0)', id || ''); };