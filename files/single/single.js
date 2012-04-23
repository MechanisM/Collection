	
	/////////////////////////////////
	//// single methods (core)
	/////////////////////////////////
	
	/**
	 * set new val to element by link (in context)<br/>
	 * events: onSet
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [context] — additional context
	 * @param {mixed} val — new val
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 */
	Collection.prototype._setOne = function (context, val, id) {
		context = C.isExists(context) ? context.toString() : '';
		val = typeof val === 'undefined' ? '' : val;
		id = id || '';

		var activeContext = this._getActiveParam('context'), e;
		
		// events
		this.onSet && (e = this.onSet.apply(this, arguments));
		if (e === false) { return this; }
		
		// if no context
		if (!context && !activeContext) {
			if (id && id !== this.ACTIVE) {
				return this._push('collection', id, val);
			} else { return this._update('collection', val); }
		}
		
		C.byLink(this._get('collection', id), activeContext + C.CHILDREN + context, val);
	
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
		context = C.isExists(context) ? context.toString() : '';
		return C.byLink(this._get('collection', id || ''), this._getActiveParam('context') + C.CHILDREN + context);
	};