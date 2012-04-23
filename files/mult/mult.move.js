
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} [context] — source context
	 * @param {String} [sourceId=this.ACTIVE] — source Id
	 * @param {String} [activeId=this.ACTIVE] — collection ID (transferred to)
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
	Collection.prototype.move = function (filter, id, addType, mult, count, from, indexOf, lastIndexOf, rev, deleteType) {
		filter = filter || '';
		id = this._splitId(id);
		addType = addType || 'push';
		
		mult = mult === false ? false : true;
		deleteType = deleteType === false ? false : true;
		
		var deleteList = [],
			elements,
			to = id.to,
			set = id.set,
			
			isArray = C.isArray(this._getOne('', id.id)),
			e = null;
		
		id = id.id;
		
		// events
		deleteType && this.onMove && (e = this.onMove.apply(this, arguments));
		!deleteType  && this.onCopy && (e = this.onCopy.apply(this, arguments));
		if (e === false) { return this; }
		
		// search elements
		this.disable('context');
		
		if (C.isNumber(filter) || (C.isString(filter) && !this._isFilter(filter)) || arguments.length === 0 || filter === false) {
			elements = filter;
		} else { elements = this.search(filter, sourceId, mult, count || '', from || '', indexOf || '', lastIndexOf || '', rev || ''); }
		
		this.enable('context');
		
		console.log(elements);
		
		// move
		/*if (mult === true && C.isArray(elements)) {
			elements.forEach(function (el) {
				this.add(context + C.CHILDREN + el, isArray === true ? addType : el + C.METHOD + addType, activeId, sourceId);
				deleteType === true && deleteList.push(el);
			}, this);
		} else {
			this.add(context + C.CHILDREN + elements, isArray === true ? addType : elements + C.METHOD + addType, activeId, sourceId);
			deleteType === true && deleteList.push(elements);
		}*/
		
		// delete element
		if (deleteType === true) {
			this.disable('context');
			
			if (rev === true) {
				deleteList.forEach(function (el) {
					this._removeOne(el, sourceId);
				}, this);
			} else { this._remove(deleteList, sourceId); }
			
			this.enable('context');
		}
	
		return this;
	},
	/**
	 * move one element from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceId=this.ACTIVE] — source Id
	 * @param {String} [activeId=this.ACTIVE] — collection ID (transferred to)
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
	Collection.prototype.moveOne = function (filter, context, sourceId, activeId, addType, from, indexOf, lastIndexOf, rev) {
		return this.move(filter || '', C.isExists(context) ? context.toString() : '', sourceId || '', activeId || '', addType || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};
	/**
	 * copy elements from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceId=this.ACTIVE] — source Id
	 * @param {String} [activeId=this.ACTIVE] — collection ID (transferred to)
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
	Collection.prototype.copy = function (filter, context, sourceId, activeId, addType, mult, count, from, indexOf, lastIndexOf, rev) {
		mult = mult === false ? false : true;
		return this.move(filter || '', C.isExists(context) ? context.toString() : '', sourceId || '', activeId || '', addType || 'push', mult, count || '', from || '', indexOf || '', false);
	};
	/**
	 * copy one element from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {Context} context — source context
	 * @param {String} [sourceId=this.ACTIVE] — source Id
	 * @param {String} [activeId=this.ACTIVE] — collection ID (transferred to)
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
	Collection.prototype.copyOne = function (filter, context, sourceId, activeId, addType, from, indexOf, lastIndexOf, rev) {
		return this.move(filter || '', C.isExists(context) ? context.toString() : '', sourceId || '', activeId || '', addType || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '', false);
	};