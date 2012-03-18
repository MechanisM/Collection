
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String} [moveFilter] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {Context} [context] — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of transfers (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @param {Boolean} [deleteType=true] — if true, remove source element
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}]).pushCollection('test', []);
	 * db.move(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.get());
	 */
	Collection.prototype.move = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, deleteType) {
		moveFilter = moveFilter || '';
		deleteType = deleteType === false ? false : true;
		context = Collection.isExists(context) ? context.toString() : '';
		
		sourceID = sourceID || '';
		activeID = activeID || '';
		
		addType = addType || 'push';
		
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var deleteList = [],
			aCheckType = Collection.isArray(Collection.byLink(this._get('collection', activeID), this._getActiveParam('context'))),
	
			elements, e = null;
		
		// events
		deleteType && this.onMove && (e = this.onMove.apply(this, arguments));
		!deleteType  && this.onCopy && (e = this.onCopy.apply(this, arguments));
		if (e === false) { return this; }
		
		// search elements
		this.disable('context');
		
		if (Collection.isNumber(moveFilter) || (Collection.isString(moveFilter) && !this._filterTest(moveFilter))) {
			elements = moveFilter;
		} else { elements = this.search(moveFilter, sourceID, mult, count, from, indexOf); }
		
		this.enable('context');
		
		// move
		if (mult === true && Collection.isArray(elements)) {
			elements.forEach(function (el) {
				this.add(context + Collection.CHILDREN + el, aCheckType === true ? addType : el + Collection.METHOD_SEPARATOR + addType, activeID, sourceID);
				deleteType === true && deleteList.push(el);
			}, this);
		} else {
			this.add(context + Collection.CHILDREN + elements, aCheckType === true ? addType : elements + Collection.METHOD_SEPARATOR + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
		
		// delete element
		if (deleteType === true) { this.disable('context')._remove(deleteList, sourceID).enable('context'); }
	
		return this;
	},
	/**
	 * move one element from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String} [moveFilter] — filter function, string expression, context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}]).pushCollection('test', []);
	 * db.moveOne(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.get());
	 */
	Collection.prototype.moveOne = function (moveFilter, context, sourceID, activeID, addType) {
		return this.move(moveFilter || '', Collection.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || '', false);
	};
	/**
	 * copy elements from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String} [moveFilter] — filter function, string expression or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of copies (by default: all object)
	 * @param {Number|Boolean} [from=false] — skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] — starting point (by default: -1)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}]).pushCollection('test', []);
	 * db.copy(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.get());
	 */
	Collection.prototype.copy = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf) {
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		return this.move(moveFilter || '', Collection.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || 'push', mult, count, from, indexOf, false);
	};
	/**
	 * copy one element from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String} [moveFilter] — filter function, string expression or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}]).pushCollection('test', []);
	 * db.copyOne(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.get());
	 */
	Collection.prototype.copyOne = function (moveFilter, context, sourceID, activeID, addType) {
		return this.move(moveFilter || '', Collection.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || '', false, '', '', '', false);
	};