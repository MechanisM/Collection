	
	/////////////////////////////////
	//// single methods (core)
	/////////////////////////////////
	
	/**
	 * set new value to element by link (in context)<br/>
	 * events: onSet
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] — additional context
	 * @param {mixed} value — new value
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 */
	Collection.prototype._setOne = function (context, value, id) {
		context = Collection.isExists(context) ? context.toString() : '';
		value = typeof value === 'undefined' ? '' : value;
		id = id || '';

		var activeContext = this._getActiveParam('context'), e;
		
		// events
		this.onSet && (e = this.onSet.apply(this, arguments));
		if (e === false) { return this; }
		
		// if no context
		if (!context && !activeContext) {
			if (id && id !== this.ACTIVE) {
				return this._push('collection', id, value);
			} else { return this._update('collection', value); }
		}
		
		Collection.byLink(this._get('collection', id), activeContext + Collection.CHILDREN + context, value);
	
		return this;
	};
	/**
	 * get element by link (in context)<br/>
	 * events: onSet
	 *
	 * @this {Colletion Object}
	 * @param {Context} [context] — additional context
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {mixed}
	 */
	Collection.prototype._getOne = function (context, id) {
		context = Collection.isExists(context) ? context.toString() : '';
		return Collection.byLink(this._get('collection', id || ''), this._getActiveParam('context') + Collection.CHILDREN + context);
	};