	
	/**
	 * Назначить новое свойство взамен старому активному (при этом, если старое свойство было в стеке, оно не удаляется)
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {mixed} newProp - новое свойство
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
	 * Обновить активное свойство (если активное свойство есть в стеке, то оно обновится тоже)
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {mixed} newProp - новое свойство
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
	 * Вернуть свойство
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {String} [id=this.active] - ИД свойства
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