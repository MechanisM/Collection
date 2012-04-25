	
	/////////////////////////////////
	//// stack methods
	/////////////////////////////////
	
	/**
	 * set new value of the parameter on the stack (no impact on the history of the stack) (has aliases, format: new + StackName)<br/>
	 * events: onNew + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {mixed} newVal — new value
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5]).newCollection([1, 2]).getCollection();
	 */
	Collection.prototype._new = function (stackName, newVal) {
		// events
		var e;
		this['onNew' + upperCase] && (e = this['onNew' + upperCase](newVal));
		if (e === false) { return this; }
		
		var active = this.dObj.active,
			upperCase = C.toUpperCase(stackName, 1),
			dom = C.drivers.dom;
		
		// compile string if need
		if (['filter', 'parser'].indexOf(stackName) !== -1 && this._isStringExpression(newVal)) {
			active[stackName] = this['_compile' + C.toUpperCase(stackName, 1)](newVal);
		
		// search the DOM (can take a string selector or an array of nodes)
		} else if (['target', 'pager'].indexOf(stackName) !== -1 && C.isString(newVal)) {
			active[stackName] = dom.find.apply(dom, C.isArray(newVal) ? newVal : [newVal]);
		} else { active[stackName] = C.expr(newVal, active[stackName] || ''); }
		
		// break the link with a stack
		this.dObj.sys['active' + upperCase + 'Id'] = null;
		
		return this;
	};
	/**
	 * update the active parameter (if the parameter is in the stack, it will be updated too) (has aliases, format: update + StackName)<br/>
	 * events: onUpdate + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {mixed} newVal — new value
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5]).updateCollection([1, 2]).getCollection();
	 * @example
	 * $C()
	 *	.pushSetCollection('test', [1, 2, 3, 4, 5])
	 *	.updateCollection([1, 2])
	 *	.getCollection('test');
	 */
	Collection.prototype._update = function (stackName, newVal) {
		// events
		var e;
		this['onUpdate' + upperCase] && (e = this['onUpdate' + upperCase](newVal));
		if (e === false) { return this; }
		
		var active = this.dObj.active,
			upperCase = C.toUpperCase(stackName, 1),
			activeId = this._getActiveId(stackName),
			dom = C.drivers.dom;
		
		// compile string if need
		if (['filter', 'parser'].indexOf(stackName) !== -1 && this._isStringExpression(newVal)) {
			active[stackName] = this['_compile' + upperCase](newVal);
		
		// search the DOM (can take a string selector or an array of nodes)
		} else if (['target', 'pager'].indexOf(stackName) !== -1 && C.isString(newVal)) {
			active[stackName] = dom.find.apply(dom, C.isArray(newVal) ? newVal : [newVal]);
		} else { active[stackName] = C.expr(newVal, active[stackName] || ''); }
		
		// update the parameter stack
		if (activeId) { this.dObj.sys['tmp' + upperCase][activeId] = active[stackName]; }

		return this;
	};
	/**
	 * get the parameter from the stack (if you specify a constant to 'active ', then returns the active parameter) (has aliases, format: get + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} [id=this.ACTIVE] — stack Id
	 * @throw {Error}
	 * @return {mixed}
	 *
	 * @example
	 * $C([1, 2, 3, 4, 5]).getCollection();
	 * @example
	 * $C().pushCollection('test', [1, 2]).getCollection('test');
	 */
	Collection.prototype._get = function (stackName, id) {
		if (id && id !== this.ACTIVE) {
			// throw an exception if the requested parameter does not exist
			if (!this._exists(stackName, id)) { throw new Error('the object "' + id + '" -> "' + stackName + '" doesn\'t exist in the stack!'); }
			
			return this.dObj.sys['tmp' + C.toUpperCase(stackName, 1)][id];
		}
		
		return this.dObj.active[stackName];
	};
	
	/**
	 * add one or more new parameters in the stack (if you specify as a parameter Id constant 'active ', it will apply the update method) (if the parameter already exists in the stack, it will be updated) (has aliases, format: push + StackName)<br/>
	 * events: onPush + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Plain Object} objId — stack Id or object (Id: value)
	 * @param {mixed} [newVal] — value (overload)
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C().pushCollection('test', [1, 2, 3]).getCollection('test');
	 * @example
	 * $C().pushCollection({
	 *	test1: [1, 2],
	 *	test2: [1, 2, 3, 4]
	 * }).getCollection('test2');
	 */
	Collection.prototype._push = function (stackName, objId, newVal) {
		// events
		var e;
		this['onPush' + upperCase] && (e = this['onPush' + upperCase](objId, newVal || ''));
		if (e === false) { return this; }
		
		var upperCase = C.toUpperCase(stackName, 1),
			tmp = this.dObj.sys['tmp' + upperCase],
			activeId = this._getActiveId(stackName),

			key, dom = C.drivers.dom;
		
		if (C.isPlainObject(objId)) {
			for (key in objId) {
				if (objId.hasOwnProperty(key)) {
					// update, if the Id is active
					if (key === this.ACTIVE) {
						this._update(stackName, objId[key]);
					} else {
						
						// update the stack
						if (tmp[key] && activeId && activeId === key) {
							this._update(stackName, objId[key]);
						} else {
							
							// compile string if need
							if (['filter', 'parser'].indexOf(stackName) !== -1 && this._isStringExpression(objId[key])) {
								tmp[key] = this['_compile' + upperCase](objId[key]);
							
							// search the DOM (can take a string selector or an array of nodes)
							} else if (['target', 'pager'].indexOf(stackName) !== -1 && C.isString(objId[key])) {
								tmp[key] = dom.find.apply(dom, C.isArray(objId[key]) ? objId[key] : [objId[key]]);
							} else { tmp[key] = objId[key]; }
						}
						
					}
				}
			}
		} else {
			// update, if the Id is active
			if (objId === this.ACTIVE) {
				this._update(stackName, newVal);
			} else {
				
				// update the stack
				if (tmp[objId] && activeId && activeId === objId) {
					this._update(stackName, newVal);
				} else {
					
					// compile string if need
					if (['filter', 'parser'].indexOf(stackName) !== -1 && this._isStringExpression(newVal)) {
						tmp[objId] = this['_compile' + upperCase](newVal);
					
					// search the DOM (can take a string selector or an array of nodes)
					} else if (['target', 'pager'].indexOf(stackName) !== -1 && C.isString(newVal)) {
						tmp[objId] = dom.find.apply(dom, C.isArray(newVal) ? newVal : [newVal]);
					} else { tmp[objId] = newVal; }
				}
			}
		}
		
		return this;
	};
	/**
	 * set the parameter stack active (affect the story) (has aliases, format: set + StackName)<br/>
	 * events: onSet + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} id — stack Id
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection('test', [1, 2, 3])
	 *	.setCollection('test')
	 *	.getCollection();
	 */
	Collection.prototype._set = function (stackName, id) {
		if (!id || id === this.ACTIVE) { return this; }
		
		// events
		var e;
		this['onSet' + upperCase] && (e = this['onSet' + upperCase](id));
		if (e === false) { return this; }
		
		var sys = this.dObj.sys,
			
			upperCase = C.toUpperCase(stackName, 1),
			tmpChangeControlStr = stackName + 'ChangeControl',
			tmpActiveIdStr = 'active' + upperCase + 'Id';
		
		// throw an exception if the requested parameter does not exist
		if (!this._exists(stackName, id)) { throw new Error('the object "' + id + '" -> "' + stackName + '" doesn\'t exist in the stack!'); }
		
		// change the story, if there were changes
		if (sys[tmpActiveIdStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIdStr] = id;
			
			sys[stackName + 'Back'].push(id);
			this.dObj.active[stackName] = sys['tmp' + upperCase][id];
		} else { sys[tmpChangeControlStr] = false; }
		
		return this;
	};
	/**
	 * back on the history of the stack (has aliases, format: back + StackName)<br/>
	 * events: onBack + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {Number} [nmb=1] — number of steps
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.setCollection('test')
	 *	.setCollection('test2')
	 *	.setCollection('test')
	 *	.backCollection(2)
	 *	.activeCollection();
	 */
	Collection.prototype._back = function (stackName, nmb) {
		// events
		var e;
		this['onBack' + upperCase] && (e = this['onBack' + upperCase](nmb));
		if (e === false) { return this; }
		
		nmb = nmb || 1;
		var sys = this.dObj.sys,
			
			upperCase = C.toUpperCase(stackName, 1),
			propBack = sys[stackName + 'Back'],
			
			pos = propBack.length - (nmb) - 1;
		
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
	 * back on the history of the stack, if there were changes (changes are set methods and pushSet) (has aliases, format: back + StackName + If)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {Number} [nmb=1] — number of steps
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.setCollection('test')
	 *	.setCollection('test2')
	 *	.setCollection('test')
	 *	.backCollectionIf()
	 *	.backCollectionIf()
	 *	.activeCollection();
	 * // 'test2' is active, because the method of 'back' does not affect the story //
	 */
	Collection.prototype._backIf = function (stackName, nmb) {
		if (this.dObj.sys[stackName + 'ChangeControl'] === true) { return this._back.apply(this, arguments); }
		
		return this;
	};
	/**
	 * remove the parameter from the stack (can use a constant 'active') (if the parameter is active, then it would still be removed) (has aliases, format: drop + StackName)<br/>
	 * events: onDrop + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array|Plain Object} [objId=active] — stack Id or array of Ids
	 * @param {mixed} [deleteVal=false] — default value (for active properties)
	 * @param {mixed} [resetVal] — reset value (overload)
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection('test', [1, 2, 3])
	 *	.pushSetCollection('test2', [1, 2, 3])
	 *	.dropCollection('test', 'active')
	 *	.existsCollection('test2'); // removed the 'test' and' test2' //
	 */
	Collection.prototype._drop = function (stackName, objId, deleteVal, resetVal) {
		deleteVal = typeof deleteVal === 'undefined' ? false : deleteVal;
		
		// events
		var e;
		if (typeof resetVal === 'undefined') {
			this['onDrop' + upperCase] && (e = this['onDrop' + upperCase](objId, deleteVal));
			if (e === false) { return this; }
		} else {
			this['onReset' + upperCase] && (e = this['onReset' + upperCase](objId, resetVal));
			if (e === false) { return this; }
		}
		
		var active = this.dObj.active,
			sys = this.dObj.sys,
			
			upperCase = C.toUpperCase(stackName, 1),
			tmpActiveIdStr = 'active' + upperCase + 'Id',
			tmpTmpStr = 'tmp' + upperCase,
			
			activeId = this._getActiveId(stackName),
			tmpArray = !objId ? activeId ? [activeId] : [] : C.isArray(objId) || C.isPlainObject(objId) ? objId : [objId],
			
			key;
		
		if (tmpArray[0] && tmpArray[0] !== this.ACTIVE) {
			for (key in tmpArray) {
				if (tmpArray.hasOwnProperty(key)) {
					if (!tmpArray[key] || tmpArray[key] === this.ACTIVE) {
						if (typeof resetVal === 'undefined') {
							// if the parameter is on the stack, then remove it too
							if (activeId) { delete sys[tmpTmpStr][activeId]; }
							
							// active parameters are set to null
							sys[tmpActiveIdStr] = null;
							active[stackName] = deleteVal;
						
						// reset (overload)
						} else {
							if (activeId) { sys[tmpTmpStr][activeId] = resetVal; }
							active[stackName] = resetVal;
						}
					} else {
						if (typeof resetVal === 'undefined') {
							delete sys[tmpTmpStr][tmpArray[key]];
							
							// if the parameter stack is active, it will still be removed
							if (activeId && tmpArray[key] === activeId) {
								sys[tmpActiveIdStr] = null;
								active[stackName] = deleteVal;
							}
						
						// reset (overload)
						} else {
							sys[tmpTmpStr][tmpArray[key]] = resetVal;
							if (activeId && tmpArray[key] === activeId) { active[stackName] = resetVal; }
						}
					}
				}
			}
		} else {
			if (typeof resetVal === 'undefined') {
				// if the parameter is on the stack, then remove it too
				if (activeId) { delete sys[tmpTmpStr][activeId]; }
				
				// active parameters are set to null
				sys[tmpActiveIdStr] = null;
				active[stackName] = deleteVal;
			
			// reset (overload)
			} else {
				if (activeId) { sys[tmpTmpStr][activeId] = resetVal; }
				active[stackName] = resetVal;
			}
		}
		
		return this;
	};
	/**
	 * reset the parameter stack (can use a constant 'active') (has aliases, format: reset + StackName, only for: filter, parser and context)<br/>
	 * events: onReset + stackName
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array|Plain Object} [objId=active] — stack Id or array of Ids
	 * @param {mixed} [resetVal=false] — reset value
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C().newContext('a > 2').resetContext().getContext();
	 */
	Collection.prototype._reset = function (stackName, objId, resetVal) {
		resetVal = typeof resetVal === 'undefined' ? false : resetVal;
		
		return this._drop(stackName, objId || '', '', resetVal);
	};
	/**
	 * reset the value of the parameter stack to another (can use a constant 'active') (has aliases, format: reset + StackName + To)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String|Array} [objId=active] — stack Id or array of Ids
	 * @param {String} [id=this.ACTIVE] — source stack Id (for merge)
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection({test: [1, 2], test2: [1, 2, 3, 4]})
	 *	.resetCollectionTo('test', 'test2')
	 *	.getCollection('test');
	 */
	Collection.prototype._resetTo = function (stackName, objId, id) {
		var mergeVal = !id || id === this.ACTIVE ? this.dObj.active[stackName] : this.dObj.sys['tmp' + C.toUpperCase(stackName, 1)][id];
		
		return this._reset(stackName, objId || '', mergeVal);
	};
	
	/**
	 * verify the existence of a parameter on the stack (has aliases, format: exists + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} [id=this.ACTIVE] — stack Id
	 * @return {Boolean}
	 *
	 * @example
	 * $C().existsCollection('test');
	 */
	Collection.prototype._exists = function (stackName, id) {
		var upperCase = C.toUpperCase(stackName, 1);
		
		if ((!id || id === this.ACTIVE) && this._getActiveId(stackName)) { return true; }
		if (typeof this.dObj.sys['tmp' + upperCase][id] !== 'undefined') { return true; }
		
		return false;
	};
	/**
	 * check for the existence (has aliases, format: validate + StackName)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} [id=this.ACTIVE] — stack Id
	 * @return {Boolean}
	 *
	 * @example
	 * $C().validateCollection('test');
	 */
	Collection.prototype._validate = function (stackName, id) {
		return !id || id === this.ACTIVE || this._exists(stackName, id);
	};
	/**
	 * return the Id of the active parameter (has aliases, format: get + StackName + ActiveId)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @return {String|Null}
	 *
	 * @example
	 * $C().getCollectionActiveId();
	 */
	Collection.prototype._getActiveId = function (stackName) {
		return this.dObj.sys['active' + C.toUpperCase(stackName, 1) + 'Id'];
	};
	/**
	 * check the parameter on the activity (has aliases, format: active + StackName) or return the Id of the active parameter (if don't specify input parameters)
	 * 
	 * @public
	 * @this {Colletion Object}
	 * @param {String} stackName — the name of the parameter stack (for example: 'collection', 'parser', 'filter', etc.)
	 * @param {String} id — stack Id
	 * @return {Boolean}
	 *
	 * @example
	 * $C().activeCollection('test');
	 * @example
	 * $C().pushSetCollection('test', [1, 2]).activeCollection();
	 */
	Collection.prototype._active = function (stackName, id) {
		// overload, returns active Id
		if (!id) { return this._getActiveId(stackName); }
		if (id === this._getActiveId(stackName)) { return true; }
		
		return false;
	};
	
	/////////////////////////////////
	//// assembly
	/////////////////////////////////
			
	/**
	 * use the assembly (makes active the stacking options, if such exist (supports namespaces))
	 * 
	 * @this {Colletion Object}
	 * @param {String} stack Id
	 * @return {Colletion Object}
	 *
	 * @example
	 * $C()
	 *	.pushCollection({
	 *		'test': [1, 2],
	 *		'test.a': [1, 2, 3]
	 *	})
	 *	 .pushContext({
	 *		'test': '',
	 *		'test.a.b': 'eq(-1)'
	 *	})
	 *	.use('test.a.b').getCollection();
	 */
	Collection.prototype.use = function (id) {
		this.stack.forEach(function (el) {
			var nm, tmpNm, i;
			
			if (this._exists(el, id)) {
				this._set(el, id);
			} else {
				nm = id.split(this.NAMESPACE);
				
				for (i = nm.length; (i -= 1) > -1;) {
					nm.splice(i, 1);
					tmpNm = nm.join(this.NAMESPACE);
					
					if (this._exists(el, tmpNm)) {
						this._set(el, tmpNm);
						break;
					}
				}
				
			}
		}, this);
				
		return this;
	};