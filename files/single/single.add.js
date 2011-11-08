	
	/**
	 * Добавить новый элемент в объект (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} cValue - новый элемент или контекст для sourceID (знак # указывает порядок)
	 * @param {String} [propType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало") или имя добавляемого свойства (в случае если имеем дело с объектом, также для объекта к имени свойсва можно использовать приставку "::unshift" - результат будет аналогичен работе unshift для массива)
	 * @param {String} [activeID=this.dObj.prop.activeCollectionID] - ИД коллекции
	 * @param {String} [sourceID=undefined] - ИД коллекции из которого берётся значение для вставки
	 * @param {Boolean} [deleteType=false] - если установленно true, то удаляет элемент из переносимой коллекции
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.addElement = function (cValue, propType, activeID, sourceID, deleteType) {
		cValue = cValue !== undefined ? cValue : "";
		propType = propType || "push";
		deleteType = deleteType === true ? true : false;
	
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
	
			cObj, sObj,
	
			activeCollectionID = sys.activeCollectionID,
			
			tmpContext, tmpContextCheck,
	
			oCheck, lCheck;
		
		cObj = statObj.getByLink(activeID && activeID !== this.active ? sys.tmpCollection[activeID] : prop.activeCollection, prop.activeContext);
		
		if (typeof cObj === "object") {
			oCheck = $.isPlainObject(cObj);
	
			// Простое добавление
			if (!sourceID) {
				// Определение типа добавления
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + statObj.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), cValue);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(cValue);
					} else if (propType === "unshift") {
						cObj.unshift(cValue);
					}
				}
			// Перенос
			} else {
				cValue = $.isExist(cValue) ? cValue.toString() : "";
				sObj = statObj.getByLink(sourceID === this.active ? prop.activeCollection : sys.tmpCollection[sourceID], cValue);

				// Определение типа добавления
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + statObj.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), sObj);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(sObj);
					} else if (propType === "unshift") {
						cObj.unshift(sObj);
					}
				}
				
				// Удаление элемента
				if (deleteType === true) {
					if (sys.activeContextID) {
						tmpContext = sys.activeContextID;
						tmpContextCheck = true;
					} else {
						tmpContext = this._get("Context");
						tmpContextCheck = false;
					}
					this._$("Context", "");
	
					if (sourceID === this.active) {
						this.deleteElementByLink(cValue);
					} else { this.deleteElementByLink(cValue, sourceID); }
	
					if (tmpContextCheck === true) {
						this._set("Context", tmpContext);
					} else { this._$("Context", tmpContext); }
				}
			}
	
			// Перезаписываем ссылки (если для объекта использовался unshift)
			if (lCheck !== true) { this.setElement("", lCheck, activeID || ""); }
		} else { throw new Error("Unable to set property!"); }
	
		return this;
	};