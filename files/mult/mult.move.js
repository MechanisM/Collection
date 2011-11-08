	
	/**
	 * Переместить элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Context} context - контекст для коллекции-источника (знак # указывает порядок)
	 * @param {String|Array} [sourceID=this.active] - ИД коллекции-источника
	 * @param {String|Array} [activeID=this.active] - ИД коллекции (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный перенос
	 * @param {Number|Boolean} [count=false] - максимальное количество переносов (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @param {Boolean} [deleteType=true] - если установленно true, то удаляет элемент из переносимой коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, deleteType) {
		moveFilter = moveFilter || false;
		deleteType = deleteType === false ? false : true;
		context = $.isExist(context) ? context.toString() : "";
		
		sourceID = sourceID || "";
		activeID = activeID || "";
		
		addType = addType || "push";
	
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			sys = dObj.sys,
	
			tmpContext, tmpContextCheck, tmpLength,
	
			deleteList = [],
			aCheckType,
	
			elements, i, j;
	
		aCheckType = $.isArray(statObj.getByLink(this._get("Collection", activeID), dObj.prop.activeContext));
	
		// Поиск элементов для переноса
		if (sys.activeContextID) {
			tmpContext = sys.activeContextID;
			tmpContextCheck = true;
		} else {
			tmpContext = this._get("Context");
			tmpContextCheck = false;
		}
		this._$("Context", context);
		//
		elements = this.searchElements(moveFilter, sourceID, mult, count, from, indexOf);
		//
		if (tmpContextCheck === true) {
			this._set("Context", tmpContext);
		} else {
			this._$("Context", tmpContext);
		}
	
		// Перенос элементов
		if (mult === true) {
			tmpLength = elements.length - 1;
	
			for (i = -1; i++ < tmpLength;) {
				this.addElement(context + statObj.contextSeparator + elements[i], aCheckType === true ? addType : elements[i] + statObj.methodSeparator + addType, activeID, sourceID);

				deleteType === true && deleteList.push(elements[i]);
			}
		} else {
			this.addElement(context + statObj.contextSeparator + elements, aCheckType === true ? addType : elements + statObj.methodSeparator + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
	
		// Удаляем, если нужно, элементы
		if (deleteType === true) {
			this._$("Context", context);
			this.deleteElementsByLink(deleteList, sourceID);
	
			if (tmpContextCheck === true) {
				this._set("Context", tmpContext);
			} else {
				this._$("Context", tmpContext);
			}
		}
	
		return this;
	},
	/**
	 * Переместить элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Context} context - контекст для коллекции-источника (знак # указывает порядок)
	 * @param {String|Array} [sourceID=this.active] - ИД коллекции-источника
	 * @param {String|Array} [activeID=this.active] - ИД коллекции (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false);
	};
	/**
	 * Копировать элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Context} context - контекст для коллекции-источника (знак # указывает порядок)
	 * @param {String|Array} [sourceID=this.active] - ИД коллекции-источника
	 * @param {String|Array} [activeID=this.active] - ИД коллекции (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный перенос
	 * @param {Number|Boolean} [count=false] - максимальное количество переносов (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf) {
		moveFilter = moveFilter || false;
		context = $.isExist(context) ? context.toString() : "";
		
		sourceID = sourceID || "";
		activeID = activeID || "";
		
		addType = addType || "push";
	
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		return this.moveElements(moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, false);
	};
	/**
	 * Копировать элмент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Context} context - контекст для коллекции-источника (знак # указывает порядок)
	 * @param {String|Array} [sourceID=this.active] - ИД коллекции-источника
	 * @param {String|Array} [activeID=this.active] - ИД коллекции (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false, "", "", "", false);
	};