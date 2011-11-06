
	/**
	 * Установить значение элементу коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - дополнительный контекст (знак # указывает порядок)
	 * @param {mixed} value - значение
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.setElement = function (context, value, id) {
		context = $.isExist(context) ? context.toString() : "";
	
		var
			staticObj = $.Collection.static.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			
			activeContext = this.getActiveContext();
		
		if (!context && !activeContext) {
			if (id && id !== this.active) {
				return this._push("Collection", id, value);
			} else {
				return this._update("Collection", value);
			}
		}
		
		staticObj.setByLink(id && id !== this.active ? dObj.sys.tmpCollection[id] : prop.activeCollection, activeContext + staticObj.contextSeparator + context, value);
	
		return this;
	};
	/**
	 * Получить элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - дополнительный контекст (знак # указывает порядок)
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {mixed}
	 */
	$.Collection.fn.getElement = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			staticObj = $.Collection.static.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			
			activeContext = this.getActiveContext();
	
		return staticObj.getByLink(id && id !== this.active ? dObj.sys.tmpCollection[id] : prop.activeCollection, activeContext + staticObj.contextSeparator + context);
	};