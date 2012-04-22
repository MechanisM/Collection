	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to the collection (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} [cValue] — new element or context for sourceId
	 * @param {String} [propType='push'] — add type (constants: 'push', 'unshift') or property name (can use '->unshift' - the result will be similar to work for an array unshift)
	 * @param {String} [activeId=this.ACTIVE] — collection ID
	 * @param {String} [sourceId] — source Id (if move)
	 * @param {Boolean} [del=false] — if true, remove source element
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = $C([]);
	 * // add a new element to the active collection //
	 * db.add(1);
	 * // unshift //
	 * db.add(2, 'unshift');
	 *
	 * console.log(db.getCollection());
	 * @example
	 * var db = $C().pushSetCollection('test', []);
	 * // add a new element to the 'test' //
	 * db.add(1, 'b', 'test');
	 * // unshift //
	 * db.add(2, 'a->unshift', 'test');
	 * // without specifying the key name //
	 * db.add(3, '', 'test');
	 * db.add(4, 'unshift', 'test');
	 *
	 * console.log(db.getCollection());
	 */
	Collection.prototype.add = function (cValue, propType, activeId, sourceId, del) {
		cValue = typeof cValue !== 'undefined' ? cValue : '';
		propType = propType || 'push';
		activeId = activeId || '';
		sourceId = sourceId || '';
		del = del || false;
		
		var data, sData, lCheck, e;
		
		// events
		this.onAdd && (e = this.onAdd.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		data = this._geOne('', activeId);
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object')  { throw new Error('unable to set property!'); }
		
		// simple add
		if (!sourceId) {
			// add type
			if (C.isPlainObject(data)) {
				propType = propType === 'push' ? this.length(data) : propType === 'unshift' ? this.length(data) + C.METHOD_SEPARATOR + 'unshift' : propType;
				lCheck = C.addElementToObject(data, propType.toString(), cValue);
			} else {
				lCheck = true;
				data[propType](cValue);
			}
		
		// move
		} else {
			cValue = C.isExists(cValue) ? cValue.toString() : '';
			sData = this._geOne(cValue, sourceId);
			
			// add type
			if (C.isPlainObject(data)) {
				propType = propType === 'push' ? this.length(data) : propType === 'unshift' ? this.length(data) + C.METHOD_SEPARATOR + 'unshift' : propType;
				lCheck = C.addElementToObject(data, propType.toString(), sData);
			} else {
				lCheck = true;
				data[propType](sData);
			}
			
			// delete element
			if (del === true) { this.disable('context')._removeOne(cValue, sourceId).enable('context'); }
		}
		
		// rewrites links (if used for an object 'unshift')
		if (lCheck !== true) { this._setOne('', lCheck, activeId); }
	
		return this;
	};
	
	/**
	 * add new element to the collection (push) (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj — new element
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([12]).push(1).getCollection();
	 */
	Collection.prototype.push = function (obj, id) {
		return this.add(obj, '', id || '');
	};
	/**
	 * add new element to the collection (unshift) (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj — new element
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1]).unshift(2).getCollection();
	 */
	Collection.prototype.unshift = function (obj, id) {
		return this.add(obj, 'unshift', id || '');
	};