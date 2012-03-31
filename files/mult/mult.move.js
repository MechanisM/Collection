
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} [context] — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of transfers (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @param {Boolean} [deleteType=true] — if true, remove source element
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.move(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.get());
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.move('eq(-1)', '', 'active', 'test');
	 * console.log(db.get());
	 */
	Collection.prototype.move = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, lastIndexOf, rev, deleteType) {
		moveFilter = moveFilter || '';
		context = Collection.isExists(context) ? context.toString() : '';
		
		sourceID = sourceID || '';
		activeID = activeID || '';
		
		addType = addType || 'push';
		
		mult = mult === false ? false : true;
		deleteType = deleteType === false ? false : true;
		
		var deleteList = [],
			isArray = Collection.isArray(Collection.byLink(this._get('collection', activeID), this._getActiveParam('context'))),
	
			elements, e = null;
		
		// events
		deleteType && this.onMove && (e = this.onMove.apply(this, arguments));
		!deleteType  && this.onCopy && (e = this.onCopy.apply(this, arguments));
		if (e === false) { return this; }
		
		// search elements
		this.disable('context');
		
		if (Collection.isNumber(moveFilter) || (Collection.isString(moveFilter) && !this._isFilter(moveFilter)) || arguments.length === 0 || moveFilter === false) {
			elements = moveFilter;
		} else { elements = this.search(moveFilter, sourceID, mult, count || '', from || '', indexOf || '', lastIndexOf || '', rev || ''); }
		
		this.enable('context');
		
		console.log(elements);
		
		// move
		if (mult === true && Collection.isArray(elements)) {
			elements.forEach(function (el) {
				this.add(context + Collection.CHILDREN + el, isArray === true ? addType : el + Collection.METHOD_SEPARATOR + addType, activeID, sourceID);
				deleteType === true && deleteList.push(el);
			}, this);
		} else {
			this.add(context + Collection.CHILDREN + elements, isArray === true ? addType : elements + Collection.METHOD_SEPARATOR + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
		
		// delete element
		if (deleteType === true) {
			this.disable('context');
			
			if (rev === true) {
				deleteList.forEach(function (el) {
					this._removeOne(el, sourceID);
				}, this);
			} else { this._remove(deleteList, sourceID); }
			
			this.enable('context');
		}
	
		return this;
	},
	/**
	 * move one element from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.moveOne(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.get());
	 */
	Collection.prototype.moveOne = function (moveFilter, context, sourceID, activeID, addType, from, indexOf, lastIndexOf, rev) {
		return this.move(moveFilter || '', Collection.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};
	/**
	 * copy elements from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number|Boolean} [count=false] — maximum number of copies (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.copy(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.getCollection('test'));
	 */
	Collection.prototype.copy = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, lastIndexOf, rev) {
		mult = mult === false ? false : true;
		return this.move(moveFilter || '', Collection.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || 'push', mult, count || '', from || '', indexOf || '', false);
	};
	/**
	 * copy one element from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceID=this.ACTIVE] — source ID
	 * @param {String} [activeID=this.ACTIVE] — collection ID (transferred to)
	 * @param {String} [addType='push'] — add type (constants: 'push', 'unshift')
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.pushCollection('test', []);
	 * db.copyOne(':i % 2 !== 0', '', 'active', 'test');
	 * console.log(db.getCollection('test'));
	 */
	Collection.prototype.copyOne = function (moveFilter, context, sourceID, activeID, addType, from, indexOf, lastIndexOf, rev) {
		return this.move(moveFilter || '', Collection.isExists(context) ? context.toString() : '', sourceID || '', activeID || '', addType || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '', false);
	};