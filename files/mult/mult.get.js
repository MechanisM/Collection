	
	/////////////////////////////////
	//// mult methods (get)
	/////////////////////////////////
	
	/**
	 * get the elements using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Context|Array|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), context (overload), array of references (for example: ['eq(-1)', '0 > 1', '0 >> :el % 2 === 0']) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID or string expression (ID + >> + [+] (optional, if the collection already exists, the data will be modified) + ID to be stored in the stack (if >>> ID will become active), example: test>>>+test2)
	 * @param {Boolean} [mult=true] — if false, then there will only be one iteration
	 * @param {Number} [count] — maximum number of results (by default: all object)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {Array|mixed|Colletion Object}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get('eq(-1) > c');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get(function (el, key, data, i) { return i % 3 === 0; });
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.get(':i % 3 === 0', '>>>test').get();
	 */
	Collection.prototype.get = function (filter, id, mult, count, from, indexOf, lastIndexOf, rev) {
		id = id || '';
		var res,
			to, set = false,
			arg = C.toArray(arguments),
			action;
		
		// overload ID
		if (id.search(this.SPLITTER) !== -1) {
			id = id.split(this.SPLITTER);
			set = true;
		} else { id = id.split(this.SHORT_SPLITTER); }
		id[1] && (to = id[1].trim());
		id = arg[1] = id[0].trim();
		
		// overload
		if (C.isArray(filter)) {
			res = [];
			filter.forEach(function (el) {
				res = res.concat(this.get(el, id, mult || '', count || '', from || '', indexOf || '', lastIndexOf || '', rev || ''));
			}, this);
		} else {
			// overload
			if (C.isNumber(filter) || (C.isString(filter) && !this._isFilter(filter)) || arguments.length === 0 || filter === false) {
				res = this._getOne(filter, id);
			} else {
				mult = mult === false ? false : true;
				res = mult === true || C.isArray(filter) ? [] : -1;
				
				if (mult === true) {
					/** @private */
					action = function (el, key, data) { res.push(data[key]); };
				} else {
					/** @private */
					action = function (el, key, data) { res = data[key]; };
				}
				
				arg.unshift(action);
				this.forEach.apply(this, arg);
			}
		}
		
		// save result
		if (to) {
			to = to.split(this.PLUS);
			
			if (to[1]) {
				to = to[1].trim();
				if (this._exists('collection', to)) {
					this
						.disable('context')
						.concat(res, '', to)
						.enable('context');
				} else {
					this._push('collection', to, res);
				}
			} else {
				to = to[0];
				this._push('collection', to, res);
			}
			
			if (set == true) { return this._set('collection', to); }
			return this;
		}
		
		return res;
	};
	/**
	 * get the one element using a filter or by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Context} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)), array of references (for example: ['eq(-1)', '0 > 1', '0 >> :el % 2 === 0']) or true (if disabled)
	 * @param {String} [id=this.ACTIVE] — collection ID or string expression (ID + >> + [+] (optional, if the collection already exists, the data will be modified) + ID to be stored in the stack (if >>> ID will become active), example: test>>>+test2)
	 * @param {Number} [from=0] — skip a number of elements
	 * @param {Number} [indexOf=0] — starting point
	 * @param {Number} [lastIndexOf] — ending point
	 * @param {Boolean} [rev=false] — if true, the collection is processed in order of decreasing
	 * @return {mixed}
	 *
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.getOne(':i % 3 === 0');
	 * @example
	 * $C([{a: 1}, {b: 2}, {c: 3}, {a: 1}, {b: 2}, {c: 3}])
	 *	.getOne(function (el, key, data, i) {
	 *		return i % 3 === 0;
	 *	});
	 */
	Collection.prototype.getOne = function (filter, id, from, indexOf, lastIndexOf, rev) {
		return this.get(filter || '', id || '', false, '', from || '', indexOf || '', lastIndexOf || '', rev || '');
	};