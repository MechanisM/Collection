	
	/////////////////////////////////
	// context methods
	/////////////////////////////////
	
	/**
	 * calculate parent context
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] — level
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {String}
	 *
	 * @example
	 * $C('', {context: 'a > b > c'}).parentContext();
	 * @example
	 * $C('', {context: 'a > b > c'}).parentContext(2);
	 */
	Collection.prototype.parentContext = function (n, id) {
		var context = this._get('context', id || '').split(C.CHILDREN),
			i = n || 1;
		
		while ((i -= 1) > -1) { context.splice(-1, 1); }
		
		return context.join(C.CHILDREN);
	};
	/**
	 * change the context (the parent element)
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] — level
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C('', {context: 'a > b > c'}).parent().getContext();
	 * @example
	 * $C('', {context: 'a > b > c'}).parent(2).getContext();
	 */
	Collection.prototype.parent = function (n, id) {
		if (!id) { return this._update('context', this.parentContext(n)); }
		return this._push('context', id, this.parentContext(n, id));
	};