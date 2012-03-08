	
	/////////////////////////////////
	//// stack methods
	/////////////////////////////////
	
	/**
	 * set new value of the parameter on the stack (no impact on the history of the stack)(has aliases, format: new + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {mixed} newVal — new value
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5]);
	 * // new collection
	 * db.newCollection([1, 2]);
	 */
	C.prototype._new = function (stackName, newVal) {
		var
			active = this.dObj.active,
			upperCase = C.toUpperCase(stackName, 1);
		
		// compile string if need
		if (C.find(stackName, ['filter', 'parser']) && this._exprTest(newVal)) {
			active[stackName] = this['_compile' + C.toUpperCase(stackName, 1)](newVal);
		} else { active[stackName] = nimble.expr(newVal, active[stackName] || ''); }
		
		// break the link with a stack
		this.dObj.sys['active' + upperCase + 'ID'] = null;
		
		return this;
	};
	/**
	 * update the active parameter (if the parameter is in the stack, it will be updated too)(has aliases, format: update + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {mixed} newVal — new value
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5]);
	 * // update collection
	 * db.updateCollection([1, 2]);
	 */
	C.prototype._update = function (stackName, newVal) {
		var
			active = this.dObj.active,
			sys = this.dObj.sys,
			
			activeID = this._getActiveID(stackName);
		
		// compile string if need
		if (C.find(stackName, ['filter', 'parser']) && this._exprTest(newVal)) {
			active[stackName] = this['_compile' + C.toUpperCase(stackName, 1)](newVal);
		} else { active[stackName] = nimble.expr(newVal, active[stackName] || ''); }
		
		// update the parameter stack
		if (activeID) { sys['tmp' + C.toUpperCase(stackName, 1)][activeID] = active[stackName]; }

		return this;
	};
	/**
	 * get the parameter from the stack (if you specify a constant to 'active ', then returns the active parameter)(has aliases, format: get + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} [id=this.ACTIVE] — stack ID
	 * @throw {Error}
	 * @return {mixed}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5]);
	 *
	 * // get collection
	 * db.getCollection();
	 *
	 * db.pushCollection('test', [1, 2]);
	 * // get from stack
	 * db.getCollection('test');
	 */
	C.prototype._get = function (stackName, id) {
		if (id && id !== this.ACTIVE) {
			// throw an exception if the requested parameter does not exist
			if (!this._exists(stackName, id)) { throw new Error('the object "' + id + '" -> "' + stackName + '" doesn\'t exist in the stack!'); }
			
			return this.dObj.sys['tmp' + C.toUpperCase(stackName, 1)][id];
		}

		return this.dObj.active[stackName];
	};
	
	/**
	 * add one or more new parameters in the stack (if you specify as a parameter ID constant 'active ', it will apply the update method)(if the parameter already exists in the stack, it will be updated)(has aliases, format: push + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Plain Object} objID — stack ID or object (ID: value)
	 * @param {mixed} [newVal] — value (overload)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * // push collection
	 * db.pushCollection('test', [1, 2, 3]);
	 * db.pushCollection({
	 *	test1: [1, 2],
	 *	test2: [1, 2, 3, 4]
	 * });
	 */
	C.prototype._push = function (stackName, objID, newVal) {
		var
			tmp = this.dObj.sys['tmp' + C.toUpperCase(stackName, 1)],
			activeID = this._getActiveID(stackName),

			key;
		
		if ($.isPlainObject(objID)) {
			for (key in objID) {
				if (objID.hasOwnProperty(key)) {
					// update, if the ID is 'active'
					if (key === this.ACTIVE) {
						this._update(stackName, objID[key]);
					} else {
						
						// update the stack
						if (tmp[key] && activeID && activeID === key) {
							this._update(stackName, objID[key]);
						} else {
							
							// compile string if need
							if (C.find(stackName, ['filter', 'parser']) && this._exprTest(objID[key])) {
								tmp[key] = this['_compile' + C.toUpperCase(stackName, 1)](objID[key]);
							} else { tmp[key] = objID[key]; }
						}
						
					}
				}
			}
		} else {
			// update, if the ID is 'active'
			if (objID === this.ACTIVE) {
				this._update(stackName, newVal);
			} else {
				
				// update the stack
				if (tmp[objID] && activeID && activeID === objID) {
					this._update(stackName, newVal);
				} else {
					
					// compile string if need
					if (C.find(stackName, ['filter', 'parser']) && this._exprTest(newVal)) {
						tmp[objID] = this['_compile' + C.toUpperCase(stackName, 1)](newVal);
					} else { tmp[objID] = newVal; }
				}
			}
		}

		return this;
	};
	/**
	 * set the parameter stack active (affect the story)(has aliases, format: set + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} id — stack ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.pushCollection('test', [1, 2, 3]);
	 *
	 * // set collection
	 * db.setCollection('test');
	 */
	C.prototype._set = function (stackName, id) {
		var
			sys = this.dObj.sys,

			upperCase = C.toUpperCase(stackName, 1),
			tmpChangeControlStr = stackName + 'ChangeControl',
			tmpActiveIDStr = 'active' + upperCase + 'ID';
		
		// throw an exception if the requested parameter does not exist
		if (!this._exists(stackName, id)) { throw new Error('the object "' + id + '" -> "' + stackName + '" doesn\'t exist in the stack!'); }
		
		// change the story, if there were changes
		if (sys[tmpActiveIDStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIDStr] = id;
		} else { sys[tmpChangeControlStr] = false; }
		
		sys[stackName + 'Back'].push(id);
		this.dObj.active[stackName] = sys['tmp' + upperCase][id];

		return this;
	};
	/**
	 * back on the history of the stack (has aliases, format: back + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {Number} [nmb=1] — number of steps
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.setCollection('test')
	 *	.setCollection('test2')
	 *	.setCollection('test');
	 *
	 * db.backCollection(2); // 'test' is active
	 */
	C.prototype._back = function (stackName, nmb) {
		var
			sys = this.dObj.sys,

			upperCase = C.toUpperCase(stackName, 1),
			propBack = sys[stackName + 'Back'],

			pos = propBack.length - (nmb || 1) - 1;
		
		if (pos >= 0 && propBack[pos]) {
			if (sys['tmp' + upperCase][propBack[pos]]) {
				this._set(stackName, propBack[pos]);
				sys[stackName + 'ChangeControl'] = false;
				propBack.splice(pos + 1, propBack.length);
			}
		}

		return this;
	};
	/**
	 * back on the history of the stack, if there were changes (changes are set methods and pushSet)(has aliases, format: back + StackName + If)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {Number} [nmb=1] — number of steps
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.setCollection('test')
	 *	.setCollection('test2')
	 *	.setCollection('test');
	 *
	 * db.backCollectionIf().backCollectionIf(); // 'test2' is active, because the method of 'back' does not affect the story
	 */
	C.prototype._backIf = function (stackName, nmb) {
		if (this.dObj.sys[stackName + 'ChangeControl'] === true) { return this._back.apply(this, arguments); }

		return this;
	};
	/**
	 * remove the parameter from the stack (can use a constant 'active')(if the parameter is active, then it would still be removed)(has aliases, format: drop + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array|Plain Object} [objID=active] — stack ID or array of IDs
	 * @param {mixed} [deleteVal=false] — default value (for active properties)
	 * @param {mixed} [resetVal] — reset value (overload)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3]);
	 *
	 * db.dropCollection('test', 'active'); // removed the 'test' and' test2'
	 */
	C.prototype._drop = function (stackName, objID, deleteVal, resetVal) {
		deleteVal = deleteVal === undefined ? false : deleteVal;
		
		var
			active = this.dObj.active,
			sys = this.dObj.sys,
			
			upperCase = C.toUpperCase(stackName, 1),
			tmpActiveIDStr = 'active' + upperCase + 'ID',
			tmpTmpStr = 'tmp' + upperCase,

			activeID = this._getActiveID(stackName),
			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],
			
			key;
		
		if (tmpArray[0] && tmpArray[0] !== this.ACTIVE) {
			for (key in tmpArray) {
				if (tmpArray.hasOwnProperty(key)) {
					if (!tmpArray[key] || tmpArray[key] === this.ACTIVE) {
						if (resetVal === undefined) {
							// if the parameter is on the stack, then remove it too
							if (activeID) { delete sys[tmpTmpStr][activeID]; }
							
							// active parameters are set to null
							sys[tmpActiveIDStr] = null;
							active[stackName] = deleteVal;
						
						// reset (overload)
						} else {
							if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
							active[stackName] = resetVal;
						}
					} else {
						if (resetVal === undefined) {
							delete sys[tmpTmpStr][tmpArray[key]];
							
							// if the parameter stack is active, it will still be removed
							if (activeID && tmpArray[key] === activeID) {
								sys[tmpActiveIDStr] = null;
								active[stackName] = deleteVal;
							}
						
						// reset (overload)
						} else {
							sys[tmpTmpStr][tmpArray[key]] = resetVal;
							if (activeID && tmpArray[key] === activeID) { active[stackName] = resetVal; }
						}
					}
				}
			}
		} else {
			if (resetVal === undefined) {
				// if the parameter is on the stack, then remove it too
				if (activeID) { delete sys[tmpTmpStr][activeID]; }
				
				// active parameters are set to null
				sys[tmpActiveIDStr] = null;
				active[stackName] = deleteVal;
			
			// reset (overload)
			} else {
				if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
				active[stackName] = resetVal;
			}
		}

		return this;
	};
	/**
	 * reset the parameter stack (can use a constant 'active')(has aliases, format: reset + StackName, only for: filter, parser and context)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array|Plain Object} [objID=active] — stack ID or array of IDs
	 * @param {mixed} [resetVal=false] — reset value
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.newContext('a > 2')
	 *
	 * // reset context
	 * db.resetContext();
	 */
	C.prototype._reset = function (stackName, objID, resetVal) {
		resetVal = resetVal === undefined ? false : resetVal;

		return this._drop(stackName, objID || '', '', resetVal);
	};
	/**
	 * reset the value of the parameter stack to another (can use a constant 'active')(has aliases, format: reset + StackName + To)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array} [objID=active] — stack ID or array of IDs
	 * @param {String} [id=this.ACTIVE] — source stack ID (for merge)
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.pushCollection({test: [1, 2], test2: [1, 2, 3, 4]});
	 *
	 * // reset collection 'test' to 'test2'
	 * db.resetCollectionTo('test', 'test2');
	 */
	C.prototype._resetTo = function (stackName, objID, id) {
		var mergeVal = !id || id === this.ACTIVE ? this.dObj.active[stackName] : this.dObj.sys['tmp' + C.toUpperCase(stackName, 1)][id];
		
		return this._reset(stackName, objID || '', mergeVal);
	};

	/**
	 * verify the existence of a parameter on the stack (has aliases, format: exists + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} [id=this.ACTIVE] — stack ID
	 * @return {Boolean}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * db.existsCollection('test'); // returns false
	 */
	C.prototype._exists = function (stackName, id) {
		var upperCase = C.toUpperCase(stackName, 1);
		
		if ((!id || id === this.ACTIVE) && this._getActiveID(stackName)) { return true; }
		if (this.dObj.sys['tmp' + upperCase][id] !== undefined) { return true; }

		return false;
	};
	/**
	 * return the ID of the active parameter or false (has aliases, format: get + StackName + ActiveID)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @return {String|Null}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * db.getCollectionActiveID(); // returns false
	 */
	C.prototype._getActiveID = function (stackName) {
		return this.dObj.sys['active' + C.toUpperCase(stackName, 1) + 'ID'];
	};
	/**
	 * check the parameter on the activity (has aliases, format: active + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} id — stack ID
	 * @return {Boolean}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * db.activeCollection('test'); // returns false
	 */
	C.prototype._active = function (stackName, id) {
		// overload, returns active ID
		if (!id) { return this._getActiveID(stackName); }
		if (id === this._getActiveID(stackName)) { return true; }

		return false;
	};
	
	/////////////////////////////////
	//// assembly
	/////////////////////////////////
			
	/**
	 * use the assembly (makes active the stacking options, if such exist (supports namespaces))
	 * 
	 * @this {Colletion Object}
	 * @param {String} stack ID
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 *
	 * db.use('test');
	 * db.use('test.a');
	 * db.use('testa.a.b');
	 */
	C.prototype.use = function (id) {
		this.stack.forEach(function (el) {
			var nm, tmpNm, i;
			
			if (this._exists(el, id)) {
				this._set(el, id);
			} else {
				nm = id.split(this.NAMESPACE_SEPARATOR);
				for (i = nm.length; (i -= 1) > -1;) {
					nm.splice(i, 1);
					tmpNm = nm.join(this.NAMESPACE_SEPARATOR);
					//
					if (this._exists(el, tmpNm)) {
						this._set(el, tmpNm);
						break;
					}
				}
				
			}
		}, this);
				
		return this;
	};