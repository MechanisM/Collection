	
	/**
	 * Модифицировать свойство (дозаписать)
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {mixed} modProp - дополняемое свойство
	 * @param {String} [id=this.active] - ИД свойства
	 * @return {Colletion Object}
	 */
	$.Collection.fn._mod = function (propName, modProp, id) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			tmpActiveStr = "active" + propName,
			tmp = sys["tmp" + propName],
			activeID = sys[tmpActiveStr + "ID"],

			// Функция модифицирования
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
		
		if (id && id !== this.active) {
			tmp[id] = typeMod(tmp[id], modProp);
			if (activeID && id === activeID) {
				prop[tmpActiveStr] = tmp[id];
			}
		} else {
			prop[tmpActiveStr] = typeMod(prop[tmpActiveStr], modProp);
			if (activeID) {
				tmp[activeID] = prop[tmpActiveStr];
			}
		}

		return this;
	};
	/**
	 * Добавить новое свойство в стек (если свойство с таким ИД уже есть в стеке, то оно перезаписывается и если оно было активное, то активное перезаписывается тоже)
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {String|Plain Object} objID - ИД свойства или объект (ИД: значение)
	 * @param {mixed} [newProp=undefined] - новое свойство (перегрузка)
	 * @throw {Error} 
	 * @return {Colletion Object}
	 */
	$.Collection.fn._push = function (propName, objID, newProp) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,

			tmpActiveStr = "active" + propName,
			tmp = sys["tmp" + propName],
			activeID = sys[tmpActiveStr + "ID"],

			key;
			
		if ($.isPlainObject(objID)) {
			for (key in objID) {
				if (objID.hasOwnProperty(key)) {
					if (key === this.active) {
						throw new Error("Invalid property name!");
					} else {
						if (tmp[key] && activeID && activeID === key) {
							this._update(propName, objID[key]);
						} else { tmp[key] = objID[key]; }
						
					}
				}
			}
		} else {
			if (key === this.active) {
				throw new Error("Invalid property name!");
			} else {
				if (tmp[objID] && activeID && activeID === objID) {
					this._update(propName, newProp);
				} else { tmp[objID] = newProp; }
			}
		}

		return this;
	};
	/**
	 * Установить новое активное свойство
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {String} id - ИД свойства
	 * @return {Colletion Object}
	 */
	$.Collection.fn._set = function (propName, id) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			lowerCase = propName.substring(0, 1).toLowerCase() + propName.substring(1),

			tmpChangeControlStr = lowerCase + "ChangeControl",
			tmpActiveStr = "active" + propName,
			tmpActiveIDStr = tmpActiveStr + "ID";

		if (sys[tmpActiveIDStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIDStr] = id;
		} else {
			sys[tmpChangeControlStr] = false;
		}

		sys[lowerCase + "Back"].push(id);

		prop[tmpActiveStr] = sys["tmp" + propName][id];

		return this;
	};
	/**
	 * Вернуться на N позиций назад по истории свойств
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {Number} [nmb=1] - количество шагов назад
	 * @return {Colletion Object}
	 */
	$.Collection.fn._back = function (propName, nmb) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			lowerCase = propName.substring(0, 1).toLowerCase() + propName.substring(1),
			tmpActiveStr = "active" + propName,
			propBack = sys[lowerCase + "Back"],

			pos;

		sys[lowerCase + "ChangeControl"] = false;

		pos = propBack.length - (nmb || 1) - 1;

		if (pos >= 0 && propBack[pos]) {
			if (sys["tmp" + propName][propBack[pos]]) {
				sys[tmpActiveStr + "ID"] = propBack[pos];
				prop[tmpActiveStr] = sys["tmp" + propName][propBack[pos]];

				propBack.splice(pos + 1, propBack.length);
			}
		}

		return this;
	};
	/**
	 * Вернуться на N позиций назад по истории свойств, если были изменения
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {Number} [nmb=1] - количество шагов назад
	 * @return {Colletion Object}
	 */
	$.Collection.fn._backIf = function (propName, nmb) {
		if (this.dObj.sys[(propName.substring(0, 1).toLowerCase() + propName.substring(1)) + "ChangeControl"] === true) {
			return this._back.apply(this, arguments);
		}

		return this;
	};
	/**
	 * Удалить свойство из стека (при этом, если свойство является активном, то оно тоже удаляется)
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {String|Array|Plain Object} [objID=active] - ИД свойства или массив ИД-ов
	 * @param {mixed} [deleteVal=false] - значение при удалении
	 * @return {Colletion Object}
	 */
	$.Collection.fn._drop = function (propName, objID, deleteVal) {
		deleteVal = deleteVal === undefined ? false : deleteVal;

		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			tmpActiveStr = "active" + propName,
			tmpActiveIDStr = tmpActiveStr + "ID",
			tmpTmpStr = "tmp" + propName,

			activeID = sys[tmpActiveIDStr],

			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],

			i;

		if (tmpArray[0] && tmpArray[0] !== this.active) {
			for (i in tmpArray) {
				if (tmpArray.hasOwnProperty(i)) {
					if (!tmpArray[i] || tmpArray[i] === this.active) {
						if (activeID) { delete sys[tmpTmpStr][activeID]; }
						sys[tmpActiveIDStr] = null;
						prop[tmpActiveStr] = deleteVal;
					} else {
						delete sys[tmpTmpStr][tmpArray[i]];
						if (activeID && tmpArray[i] === activeID) {
							sys[tmpActiveIDStr] = null;
							prop[tmpActiveStr] = deleteVal;
						}
					}
				}
			}
		} else {
			if (activeID) { delete sys[tmpTmpStr][activeID]; }
			sys[tmpActiveIDStr] = null;
			prop[tmpActiveStr] = deleteVal;
		}

		return this;
	};
	/**
	 * Сбросить активное свойство (при этом, если свойство является активном, то оно тоже сбрасывается)
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {String|Array|Plain Object} [objID=active] - ИД свойства или массив ИД-ов
	 * @param {mixed} [resetVal=false] - значение, на которое сбрасывается
	 * @return {Colletion Object}
	 */
	$.Collection.fn._reset = function (propName, objID, resetVal) {
		resetVal = resetVal === undefined ? false : resetVal;

		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			tmpActiveStr = "active" + propName,
			tmpActiveIDStr = tmpActiveStr + "ID",
			tmpTmpStr = "tmp" + propName,

			activeID = sys[tmpActiveIDStr],

			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],

			i;

		if (tmpArray[0] && tmpArray[0] !== this.active) {
			for (i in tmpArray) {
				if (tmpArray.hasOwnProperty(i)) {
					if (!tmpArray[i] || tmpArray[i] === this.active) {
						if (activeID) {
							sys[tmpTmpStr][activeID] = resetVal;
						}
						prop[tmpActiveStr] = resetVal;
					} else {
						sys[tmpTmpStr][tmpArray[i]] = resetVal;
						if (activeID && tmpArray[i] === activeID) {
							prop[tmpActiveStr] = resetVal;
						}
					}
				}
			}
		} else {
			if (activeID) {
				sys[tmpTmpStr][activeID] = resetVal;
			}
			prop[tmpActiveStr] = resetVal;
		}

		return this;
	};
	/**
	 * Сбросить свойства в другое значение
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {String|Array} [objID=active] - ИД свойства или массив ИД-ов
	 * @param {String} [id=this.active] - ИД со значением для слияния
	 * @return {Colletion Object}
	 */
	$.Collection.fn._resetTo = function (propName, objID, id) {
		var
			dObj = this.dObj,
			mergeVal = !id || id === this.active ? dObj.prop["active" + propName] : dObj.sys["tmp" + propName][id];
		
		return this._reset(propName, objID || "", mergeVal);
	};

	/**
	 * Проверить наличие свойства в стеке
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {String} [id=this.active] - ИД свойства
	 * @return {Boolean}
	 */
	$.Collection.fn._exist = function (propName, id) {
		var 
			dObj = this.dObj,
			prop = dObj.prop;
		
		if ((!id || id === this.active) && dObj.sys["active" + propName + "ID"]) {
			return true;
		}
		if (dObj.sys["tmp" + propName][id] !== undefined) {
			return true;
		}

		return false;
	};
	/**
	 * Проверить на активность свойства по ИДу
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - имя корневого свойства
	 * @param {String} id - ИД свойства
	 * @return {Boolean}
	 */
	$.Collection.fn._is = function (propName, id) {
		var 
			dObj = this.dObj,
			prop = dObj.prop;

		if (id === dObj.sys["active" + propName + "ID"]) {
			return true;
		}

		return false;
	};
	
	/////////////////////////////////
	//// Управление сборками
	/////////////////////////////////
			
	/**
	 * Использовать сборку
	 * 
	 * @this {Colletion Object}
	 * @param {String} id - ИД
	 * @return {Colletion Object}
	 */
	$.Collection.fn.use = function (id) {
		if (this._exist("Collection", id)) { this._set("Collection", id); }
		//
		if (this._exist("Page", id)) { this._set("Page", id); }
		//
		if (this._exist("Target", id)) { this._set("Target", id); }
		//
		if (this._exist("Template", id)) { this._set("Template", id); }
		//
		if (this._exist("TemplateMode", id)) { this._set("TemplateMode", id); }
		//
		if (this._exist("Filter", id)) { this._set("Filter", id); }
		//
		if (this._exist("Parser", id)) { this._set("Parser", id);  }
		//
		if (this._exist("Var", id)) { this._set("Var", id);  }
		//
		if (this._exist("Context", id)) {  this._set("Context", id);  }
		//
		if (this._exist("CountBreak", id)) {  this._set("CountBreak", id);  }
		//
		if (this._exist("PageBreak", id)) {  this._set("PageBreak", id);  }
		//
		if (this._exist("SelectorOut", id)) {  this._set("SelectorOut", id);  }
		//
		if (this._exist("ResultNull", id)) {  this._set("ResultNull", id);  }
		//
		if (this._exist("AppendType", id)) {  this._set("AppendType", id);  }
		//
		if (this._exist("Defer", id)) {  this._set("Defer", id); }
		//
		if (this._exist("Cache", id)) {  this._set("Cache", id); }
				
		return this;
	};