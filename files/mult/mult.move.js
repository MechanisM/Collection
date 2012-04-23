
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String Expression|Context|Boolean} [filter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {String Expression} [id=this.ACTIVE] — string expression (ID + >> + [+] (optional, if the collection already exists, the data will be modified) + ID (to be stored in the stack (if >>> ID will become active)) + :context (optional), example: test>>>+test2:a>eq(-1))
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
		deleteType = deleteType === false ? false : true;
		
		// events
		var e;
		deleteType && this.onMove && (e = this.onMove.apply(this, arguments));
		!deleteType  && this.onCopy && (e = this.onCopy.apply(this, arguments));
		if (e === false) { return this; }
		
		filter = filter || '';
		id = this._splitId(id);
		
		addType = addType || 'push';
		
		var	deleteList = [],
			elements,
			to = id.to,
			set = id.set,
			
			arg = C.toArray(arguments),
			/** @private */
			action = function (el, key) {
				deleteList.push(key);
				elements.push(el);
			};
		
		id = arg[1] = id.id;
		arg.splice(2, 1);
		arg.unshift(action);
		
		// search elements
		if (C.isNumber(filter) || (C.isString(filter) && !this._isFilter(filter)) || arguments.length === 0 || filter === false) {
			elements = this._getOne(filter, id);
			deleteList.push(filter);
		} else {
			elements = [];
			this.forEach.apply(this, arg);
		}
		
		// move
		this._saveResult(to, set, elements);
		
		// delete element
		if (deleteType === true) {
			if (rev === true) {
				deleteList.forEach(function (el) {
					this._removeOne(el, id);
				}, this);
			} else { this._remove(deleteList, id); }
		}
	
		return this;
	},
	/**
	 * move one element from one collection to another (in context)<br />
	 * events: onMove
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String Expression|Context|Boolean} [filter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {String Expression} [id=this.ACTIVE] — string expression (ID + >> + [+] (optional, if the collection already exists, the data will be modified) + ID (to be stored in the stack (if >>> ID will become active)) + :context (optional), example: test>>>+test2:a>eq(-1))
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
	Collection.prototype.moveOne = function (filter, id, addType, from, indexOf, lastIndexOf, rev) {
		return this.move(filter || '', id || '', addType || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};
	/**
	 * copy elements from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String Expression|Context|Boolean} [filter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {String Expression} [id=this.ACTIVE] — string expression (ID + >> + [+] (optional, if the collection already exists, the data will be modified) + ID (to be stored in the stack (if >>> ID will become active)) + :context (optional), example: test>>>+test2:a>eq(-1))
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
	Collection.prototype.copy = function (filter, id, addType, mult, count, from, indexOf, lastIndexOf, rev) {
		mult = mult === false ? false : true;
		return this.move(filter || '', id || '', addType || 'push', mult, count || '', from || '', indexOf || '', false);
	};
	/**
	 * copy one element from one collection to another (in context)<br />
	 * events: onCopy
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String Expression|Context|Boolean} [filter] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload) or true (if disabled)
	 * @param {String Expression} [id=this.ACTIVE] — string expression (ID + >> + [+] (optional, if the collection already exists, the data will be modified) + ID (to be stored in the stack (if >>> ID will become active)) + :context (optional), example: test>>>+test2:a>eq(-1))
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
	Collection.prototype.copyOne = function (filter, id, addType, from, indexOf, lastIndexOf, rev) {
		return this.move(filter || '', id || '', addType || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '', false);
	};