	
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
			prop = dObj.prop,

			tmpActiveStr = "active" + propName;

		prop[tmpActiveStr] = newProp;
		dObj.sys[tmpActiveStr + "ID"] = null;

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

			tmpActiveStr = "active" + propName,
			tmpActiveIDStr = tmpActiveStr + "ID",
			activeID = sys[tmpActiveIDStr];

		prop[tmpActiveStr] = newProp;
		if (activeID) {
			sys["tmp" + propName][activeID] = prop[tmpActiveStr];
		}

		return this;
	};
	/**
	 * return property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.active] - stack ID
	 * @return {mixed}
	 */
	$.Collection.fn._get = function (propName, id) {
		var 
			dObj = this.dObj,
			prop = dObj.prop;
		
		if (id && id !== this.active) {
			return dObj.sys["tmp" + propName][id];
		}

		return prop["active" + propName];
	};