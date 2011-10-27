	
	/**
	 * Установить/вернуть свойство
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {String|Plain Object} objKey - имя свойства или объект (имя: значение)
	 * @param {mixed} [value=undefined] - значение (перегрузка)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._prop = function (propName, objKey, value) {
		var
			dObj = this.dObj,
			prop = dObj[propName];
			
		if (arguments.length !== 3) {
			if ($.isPlainObject(objKey)) {
				$.extend(prop, objKey);
			} else { return prop[objKey]; }
		} else { prop[objKey] = value; }
			
		return this;
	};
	
	/////////////////////////////////
	//// Управление настройками
	/////////////////////////////////	
	$.Collection.fn.prop = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "prop"));
	};
	$.Collection.fn.css = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "css"));
	};
	$.Collection.fn.viewVal = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "viewVal"));
	};