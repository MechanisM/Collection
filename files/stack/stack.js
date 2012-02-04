	
	/////////////////////////////////
	//// stack methods
	/////////////////////////////////
	
	/**
	 * new property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {mixed} newProp - new property
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._new = function (propName, newProp) {
		var
			active = this.dObj.active,
			upperCase = $.toUpperCase(propName, 1);
		//
		if (propName === "filter" && $.isString(newProp)) {
			active[propName] = this._compileFilter(newProp);
		} else { active[propName] = nimble.expr(newProp, active[propName] || ""); }
		this.dObj.sys["active" + upperCase + "ID"] = null;
		//
		return this;
	};
	/**
	 * update active property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {mixed} newProp - new value
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._update = function (propName, newProp) {
		var
			active = this.dObj.active,
			sys = this.dObj.sys,
			
			activeID = this._getActiveID(propName);
		
		if (propName === "filter" && $.isString(newProp)) {
			active[propName] = this._compileFilter(newProp);
		} else { active[propName] = nimble.expr(newProp, active[propName] || ""); }
		if (activeID) { sys["tmp" + $.toUpperCase(propName, 1)][activeID] = active[propName]; }

		return this;
	};
	/**
	 * get property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.ACTIVE] - stack ID
	 * @throw {Error}
	 * @return {mixed}
	 */
	$.Collection.prototype._get = function (propName, id) {
		if (id && id !== this.ACTIVE) {
			if (!this._exists(propName, id)) { throw new Error('the object "' + id + '" -> "' + propName + '" doesn\'t exist in the stack!'); }
			//
			return this.dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		}

		return this.dObj.active[propName];
	};
	
	/**
	 * add new value to stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Plain Object} objID - stack ID or object (ID: value)
	 * @param {mixed} [newProp] - value (overload)
	 * @throw {Error} 
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._push = function (propName, objID, newProp) {
		var
			tmp = this.dObj.sys["tmp" + $.toUpperCase(propName, 1)],
			activeID = this._getActiveID(propName),

			key;
			
		if ($.isPlainObject(objID)) {
			for (key in objID) {
				if (objID.hasOwnProperty(key)) {
					if (key === this.ACTIVE) {
						throw new Error("invalid property name!");
					} else {
						if (tmp[key] && activeID && activeID === key) {
							this._update(propName, objID[key]);
						} else {
							if (propName === "filter" && $.isString(objID[key])) {
								tmp[key] = this._compileFilter(objID[key]);
							} else { tmp[key] = objID[key]; }
						}
						
					}
				}
			}
		} else {
			if (objID === this.ACTIVE) {
				throw new Error("invalid property name!");
			} else {
				if (tmp[objID] && activeID && activeID === objID) {
					this._update(propName, newProp);
				} else {
					if (propName === "filter" && $.isString(newProp)) {
						tmp[objID] = this._compileFilter(newProp);
					} else { tmp[objID] = newProp; }
				}
			}
		}

		return this;
	};
	/**
	 * set new active property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} id - stack ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._set = function (propName, id) {
		var
			sys = this.dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			tmpChangeControlStr = propName + "ChangeControl",
			tmpActiveIDStr = "active" + upperCase + "ID";
		
		if (!this._exists(propName, id)) { throw new Error('the object "' + id + '" -> "' + propName + '" doesn\'t exist in the stack!'); }
		//
		if (sys[tmpActiveIDStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIDStr] = id;
		} else { sys[tmpChangeControlStr] = false; }

		sys[propName + "Back"].push(id);
		this.dObj.active[propName] = sys["tmp" + upperCase][id];

		return this;
	};
	/**
	 * history back
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {Number} [nmb=1] - number of steps
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._back = function (propName, nmb) {
		var
			sys = this.dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			propBack = sys[propName + "Back"],

			pos = propBack.length - (nmb || 1) - 1;
		//
		if (pos >= 0 && propBack[pos]) {
			if (sys["tmp" + upperCase][propBack[pos]]) {
				this._set(propName, propBack[pos]);
				sys[propName + "ChangeControl"] = false;
				propBack.splice(pos + 1, propBack.length);
			}
		}

		return this;
	};
	/**
	 * history back (if history changed)
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {Number} [nmb=1] - number of steps
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._backIf = function (propName, nmb) {
		if (this.dObj.sys[propName + "ChangeControl"] === true) { return this._back.apply(this, arguments); }

		return this;
	};
	/**
	 * remove property from stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array|Plain Object} [objID=active] - stack ID or array of IDs
	 * @param {mixed} [deleteVal=false] - default value (for active properties)
	 * @param {mixed} [resetVal] - reset value (overload)
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._drop = function (propName, objID, deleteVal, resetVal) {
		deleteVal = deleteVal === undefined ? false : deleteVal;
		//
		var
			active = this.dObj.active,
			sys = this.dObj.sys,
			
			upperCase = $.toUpperCase(propName, 1),
			tmpActiveIDStr = "active" + upperCase + "ID",
			tmpTmpStr = "tmp" + upperCase,

			activeID = this._getActiveID(propName),
			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],
			
			key;

		if (tmpArray[0] && tmpArray[0] !== this.ACTIVE) {
			for (key in tmpArray) {
				if (tmpArray.hasOwnProperty(key)) {
					if (!tmpArray[key] || tmpArray[key] === this.ACTIVE) {
						if (resetVal === undefined) {
							if (activeID) { delete sys[tmpTmpStr][activeID]; }
							sys[tmpActiveIDStr] = null;
							active[propName] = deleteVal;
						} else {
							if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
							active[propName] = resetVal;
						}
					} else {
						if (resetVal === undefined) {
							delete sys[tmpTmpStr][tmpArray[key]];
							if (activeID && tmpArray[key] === activeID) {
								sys[tmpActiveIDStr] = null;
								active[propName] = deleteVal;
							}
						} else {
							sys[tmpTmpStr][tmpArray[key]] = resetVal;
							if (activeID && tmpArray[key] === activeID) { active[propName] = resetVal; }
						}
					}
				}
			}
		} else {
			if (resetVal === undefined) {
				if (activeID) { delete sys[tmpTmpStr][activeID]; }
				sys[tmpActiveIDStr] = null;
				active[propName] = deleteVal;
			} else {
				if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
				active[propName] = resetVal;
			}
		}

		return this;
	};
	/**
	 * reset property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array|Plain Object} [objID=active] - stack ID or array of IDs
	 * @param {mixed} [resetVal=false] - reset value
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._reset = function (propName, objID, resetVal) {
		resetVal = resetVal === undefined ? false : resetVal;

		return this._drop(propName, objID || "", "", resetVal);
	};
	/**
	 * reset property to another value
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array} [objID=active] - stack ID or array of IDs
	 * @param {String} [id=this.ACTIVE] - source ID (for merge)
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._resetTo = function (propName, objID, id) {
		var mergeVal = !id || id === this.ACTIVE ? this.dObj.active[propName] : this.dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		
		return this._reset(propName, objID || "", mergeVal);
	};

	/**
	 * check the existence of property in the stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.ACTIVE] - stack ID
	 * @return {Boolean}
	 */
	$.Collection.prototype._exists = function (propName, id) {
		var upperCase = $.toUpperCase(propName, 1);
		
		if ((!id || id === this.ACTIVE) && this._getActiveID(propName)) { return true; }
		if (this.dObj.sys["tmp" + upperCase][id] !== undefined) { return true; }

		return false;
	};
	/**
	 * get active ID
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @return {String|Null}
	 */
	$.Collection.prototype._getActiveID = function (propName) {
		return this.dObj.sys["active" + $.toUpperCase(propName, 1) + "ID"];
	};
	/**
	 * check the property on the activity
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} id - stack ID
	 * @return {Boolean}
	 */
	$.Collection.prototype._isActive = function (propName, id) {
		if (id === this._getActiveID(propName)) { return true; }

		return false;
	};
	
	/////////////////////////////////
	//// assembly
	/////////////////////////////////
			
	/**
	 * use the assembly
	 * 
	 * @this {Colletion Object}
	 * @param {String} stack ID
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.use = function (id) {
		for (var i = this.stack.length; (i -= 1) > -1;) { if (this._exists(this.stack[i], id)) { this._set(this.stack[i], id); } }
				
		return this;
	};