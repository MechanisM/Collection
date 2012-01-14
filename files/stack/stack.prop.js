	
	/////////////////////////////////
	//// control settings
	/////////////////////////////////
	
	/**
	 * set/get property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Plain Object} objKey - property name or object (name: value)
	 * @param {mixed} [value] - value (overload)
	 * @return {Colletion Object}
	 */
	$.Collection.prototype._prop = function (propName, objKey, value) {
		var prop = this.dObj[propName];
		
		if (arguments.length !== 3) {
			if ($.isPlainObject(objKey)) {
				$.extend(prop, objKey);
			} else { return prop[objKey]; }
		} else { prop[objKey] = value; }
		
		return this;
	};
		
	$.Collection.prototype.active = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "active"));
	};