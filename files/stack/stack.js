	
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
	$.Collection.fn._$ = function (propName, newProp) {
		var
			dObj = this.dObj,
			upperCase = $.toUpperCase(propName, 1);

		dObj.prop[propName] = newProp;
		dObj.sys["active" + upperCase + "ID"] = null;

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
	$.Collection.fn._update = function (propName, newProp) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
			
			upperCase = $.toUpperCase(propName, 1),
			tmpActiveIDStr = "active" + upperCase + "ID",
			activeID = sys[tmpActiveIDStr];

		prop[propName] = newProp;
		if (activeID) { sys["tmp" + upperCase][activeID] = prop[propName]; }

		return this;
	};
	/**
	 * return property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.config.constants.active] - stack ID
	 * @return {mixed}
	 */
	$.Collection.fn._get = function (propName, id) {
		var dObj = this.dObj;
		
		if (id && id !== this.config.constants.active) {
			return dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		}

		return dObj.prop[propName];
	};
	
	/**
	 * extend property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {mixed} modProp - value
	 * @param {String} [id=this.config.constants.active] - stack ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn._mod = function (propName, modProp, id) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
			
			upperCase = $.toUpperCase(propName, 1),
			tmp = sys["tmp" + upperCase],
			activeID = sys["active" + upperCase + "ID"],

			// extend function
			typeMod = function (target, mod) {
				if ($.isNumeric(target) || $.isString(target)) {
					target += mod;
				} else if ($.isArray(target)) {
					target.push(mod);
				} else if ($.isBoolean(target)) {
					if (mod === true && target === true) {
						target = false;
					} else {
						target = true;
					}
				}

				return target;
			};
		
		if (id && id !== this.config.constants.active) {
			tmp[id] = typeMod(tmp[id], modProp);
			if (activeID && id === activeID) { prop[propName] = tmp[id]; }
		} else {
			prop[propName] = typeMod(prop[propName], modProp);
			if (activeID) { tmp[activeID] = prop[propName]; }
		}

		return this;
	};
	
	/**
	 * add new value to stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Plain Object} objID - stack ID or object (ID: value)
	 * @param {mixed} [newProp=undefined] - value (overload)
	 * @throw {Error} 
	 * @return {Colletion Object}
	 */
	$.Collection.fn._push = function (propName, objID, newProp) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,

			upperCase = $.toUpperCase(propName, 1),
			tmp = sys["tmp" + upperCase],
			activeID = sys["active" + upperCase + "ID"],

			key;
			
		if ($.isPlainObject(objID)) {
			for (key in objID) {
				if (objID.hasOwnProperty(key)) {
					if (key === this.config.constants.active) {
						throw new Error("invalid property name!");
					} else {
						if (tmp[key] && activeID && activeID === key) {
							this._update(propName, objID[key]);
						} else { tmp[key] = objID[key]; }
						
					}
				}
			}
		} else {
			if (objID === this.config.constants.active) {
				throw new Error("invalid property name!");
			} else {
				if (tmp[objID] && activeID && activeID === objID) {
					this._update(propName, newProp);
				} else { tmp[objID] = newProp; }
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
	 * @return {Colletion Object}
	 */
	$.Collection.fn._set = function (propName, id) {
		var
			dObj = this.dObj,
			sys = dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			tmpChangeControlStr = propName + "ChangeControl",
			tmpActiveIDStr = "active" + upperCase + "ID";

		if (sys[tmpActiveIDStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIDStr] = id;
		} else { sys[tmpChangeControlStr] = false; }

		sys[propName + "Back"].push(id);
		dObj.prop[propName] = sys["tmp" + upperCase][id];

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
	$.Collection.fn._back = function (propName, nmb) {
		var
			dObj = this.dObj,
			sys = dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			tmpActiveStr = "active" + upperCase,
			propBack = sys[propName + "Back"],

			pos;

		sys[propName + "ChangeControl"] = false;
		pos = propBack.length - (nmb || 1) - 1;

		if (pos >= 0 && propBack[pos]) {
			if (sys["tmp" + upperCase][propBack[pos]]) {
				sys[tmpActiveStr + "ID"] = propBack[pos];
				dObj.prop[propName] = sys["tmp" + upperCase][propBack[pos]];

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
	$.Collection.fn._backIf = function (propName, nmb) {
		if (this.dObj.sys[propName + "ChangeControl"] === true) {
			return this._back.apply(this, arguments);
		}

		return this;
	};
	/**
	 * remove property from stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array|Plain Object} [objID=active] - stack ID or array of IDs
	 * @param {mixed} [deleteVal=false] - default value (for active properties)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._drop = function (propName, objID, deleteVal) {
		deleteVal = deleteVal === undefined ? false : deleteVal;

		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
			
			upperCase = $.toUpperCase(propName, 1),
			tmpActiveIDStr = "active" + upperCase + "ID",
			tmpTmpStr = "tmp" + upperCase,

			activeID = sys[tmpActiveIDStr],
			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],
			i;

		if (tmpArray[0] && tmpArray[0] !== this.config.constants.active) {
			for (i in tmpArray) {
				if (tmpArray.hasOwnProperty(i)) {
					if (!tmpArray[i] || tmpArray[i] === this.config.constants.active) {
						if (activeID) { delete sys[tmpTmpStr][activeID]; }
						sys[tmpActiveIDStr] = null;
						prop[propName] = deleteVal;
					} else {
						delete sys[tmpTmpStr][tmpArray[i]];
						if (activeID && tmpArray[i] === activeID) {
							sys[tmpActiveIDStr] = null;
							prop[propName] = deleteVal;
						}
					}
				}
			}
		} else {
			if (activeID) { delete sys[tmpTmpStr][activeID]; }
			sys[tmpActiveIDStr] = null;
			prop[propName] = deleteVal;
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
	$.Collection.fn._reset = function (propName, objID, resetVal) {
		resetVal = resetVal === undefined ? false : resetVal;

		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			tmpActiveIDStr = "active" + upperCase + "ID",
			tmpTmpStr = "tmp" + upperCase,

			activeID = sys[tmpActiveIDStr],
			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],
			i;

		if (tmpArray[0] && tmpArray[0] !== this.config.constants.active) {
			for (i in tmpArray) {
				if (tmpArray.hasOwnProperty(i)) {
					if (!tmpArray[i] || tmpArray[i] === this.config.constants.active) {
						if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
						prop[propName] = resetVal;
					} else {
						sys[tmpTmpStr][tmpArray[i]] = resetVal;
						if (activeID && tmpArray[i] === activeID) { prop[propName] = resetVal; }
					}
				}
			}
		} else {
			if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
			prop[propName] = resetVal;
		}

		return this;
	};
	/**
	 * reset property to another value
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array} [objID=active] - stack ID or array of IDs
	 * @param {String} [id=this.config.constants.active] - source ID (for merge)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._resetTo = function (propName, objID, id) {
		var
			dObj = this.dObj,
			mergeVal = !id || id === this.config.constants.active ? dObj.prop[propName] : dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		
		return this._reset(propName, objID || "", mergeVal);
	};

	/**
	 * check the existence of property in the stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.config.constants.active] - stack ID
	 * @return {Boolean}
	 */
	$.Collection.fn._exist = function (propName, id) {
		var 
			dObj = this.dObj,
			upperCase = $.toUpperCase(propName, 1);
		
		if ((!id || id === this.config.constants.active) && dObj.sys["active" + upperCase + "ID"]) {
			return true;
		}
		if (dObj.sys["tmp" + upperCase][id] !== undefined) {
			return true;
		}

		return false;
	};
	/**
	 * check the property on the activity
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} id - stack ID
	 * @return {Boolean}
	 */
	$.Collection.fn._is = function (propName, id) {
		if (id === this.dObj.sys["active" + $.toUpperCase(propName, 1) + "ID"]) {
			return true;
		}

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
	$.Collection.fn.use = function (id) {
		if (this._exist("collection", id)) { this._set("collection", id); }
		//
		if (this._exist("filter", id)) { this._set("filter", id); }
		//
		if (this._exist("context", id)) { this._set("context", id);  }
		//
		if (this._exist("cache", id)) { this._set("cache", id); }
		//
		if (this._exist("index", id)) { this._set("index", id); }
		//
		if (this._exist("map", id)) { this._set("map", id); }
		//
		if (this._exist("var", id)) { this._set("var", id); }
		//
		if (this._exist("defer", id)) { this._set("defer", id); }
		
		
		///////////
		
		
		if (this._exist("page", id)) { this._set("page", id); }
		//
		if (this._exist("parser", id)) { this._set("parser", id); }
		//
		if (this._exist("appendType", id)) { this._set("appendType", id); }
		//
		if (this._exist("target", id)) { this._set("target", id); }
		//
		if (this._exist("calculator", id)) { this._set("calculator", id); }
		//
		if (this._exist("pager", id)) { this._set("pager", id); }
		//
		if (this._exist("template", id)) { this._set("template", id); }
		//
		if (this._exist("templateModel", id)) { this._set("templateModel", id); }
		//
		if (this._exist("numberBreak", id)) { this._set("numberBreak", id); }
		//
		if (this._exist("pageBreak", id)) { this._set("pageBreak", id); }
		//
		if (this._exist("resultNull", id)) { this._set("resultNull", id); }
				
		return this;
	};