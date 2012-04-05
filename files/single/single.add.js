	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to the collection (in context)<br/>
	 * events: onAdd
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} [cValue] — new element or context for sourceID
	 * @param {String} [propType='push'] — add type (constants: 'push', 'unshift') or property name (can use '->unshift' - the result will be similar to work for an array unshift)
	 * @param {String} [activeID=this.ACTIVE] — collection ID
	 * @param {String} [sourceID] — source ID (if move)
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
	Collection.prototype.add = function (cValue, propType, activeID, sourceID, del) {
		cValue = typeof cValue !== 'undefined' ? cValue : '';
		propType = propType || 'push';
		activeID = activeID || '';
		del = del || false;
		
		var data, sObj, lCheck, e;
		
		// events
		this.onAdd && (e = this.onAdd.apply(this, arguments));
		if (e === false) { return this; }
		
		// get by link
		data = this._geOne(this._get('collection', activeID), this._getActiveParam('context'));
		
		// throw an exception if the element is not an object
		if (typeof data !== 'object')  { throw new Error('unable to set property!'); }
		
		// simple add
		if (!sourceID) {
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
			sObj = C.byLink(this._get('collection', sourceID || ''), cValue);
			
			// add type
			if (C.isPlainObject(data)) {
				propType = propType === 'push' ? this.length(data) : propType === 'unshift' ? this.length(data) + C.METHOD_SEPARATOR + 'unshift' : propType;
				lCheck = C.addElementToObject(data, propType.toString(), sObj);
			} else {
				lCheck = true;
				data[propType](sObj);
			}
			
			// delete element
			if (del === true) { this.disable('context')._removeOne(cValue, sourceID).enable('context'); }
		}
		
		// rewrites links (if used for an object 'unshift')
		if (lCheck !== true) { this._setOne('', lCheck, activeID); }
	
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