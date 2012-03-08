	
	/////////////////////////////////
	//// single methods (remove)
	/////////////////////////////////
		
	/**
	 * remove an element from the collection by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] — link
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 */
	C.prototype._removeOne = function (context, id) {
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
	 * remove an element from the collection by links (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext — link, array of links or object (collection ID: array of links)
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 */
	C.prototype._remove = function (objContext, id) {
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
	
	/**
	 * remove an element from the collection (pop)(in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3]).pushCollection('test', {a: 1, b: 2});
	 * db.pop();
	 * db.pop('test');
	 */
	C.prototype.pop = function (id) { return this._removeOne('eq(-1)', id || ''); };
	/**
	 * remove an element from the collection (shift)(in context)<br/>
	 * events: onRemove
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3]).pushCollection('test', {a: 1, b: 2});
	 * db.concat([4, 5, 6]); // [1, 2, 3, 4, 5, 6]
	 * db.concat({c: 3, d: 4}, '', 'test'); // {a: b, b: 2, c: 3, d: 4}
	 *
	 * @example
	 * var db = new $C([1, 2, 3]).pushCollection('test', {a: 1, b: 2});
	 * db.shift();
	 * db.shift('test');
	 */
	C.prototype.shift = function (id) { return this._removeOne('eq(0)', id || ''); };