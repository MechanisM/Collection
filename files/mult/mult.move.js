
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - контекст для коллекции-источника (sharp (#) char indicates the order)
	 * @param {String|Array} [sourceID=this.active] - collection ID-источника
	 * @param {String|Array} [activeID=this.active] - collection ID (куда переносится)
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
	
			deleteList = [],
			aCheckType = $.isArray(statObj.getByLink(this._get("Collection", activeID), this.getActiveContext())),
	
			elements, eLength, i = -1;
	
		// search elements
		this.config.flags.use.ac = false;
		elements = this.searchElements(moveFilter, sourceID, mult, count, from, indexOf);
		this.config.flags.use.ac = true;
	
		// move
		if (mult === true) {
			eLength = elements.length - 1;
			for (; i++ < eLength;) {
				this.addElement(context + statObj.contextSeparator + elements[i], aCheckType === true ? addType : elements[i] + statObj.methodSeparator + addType, activeID, sourceID);
				deleteType === true && deleteList.push(elements[i]);
			}
		} else {
			this.addElement(context + statObj.contextSeparator + elements, aCheckType === true ? addType : elements + statObj.methodSeparator + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
	
		// delete element
		if (deleteType === true) {
			this.config.flags.use.ac = false;
			this.deleteElementsByLink(deleteList, sourceID);
			this.config.flags.use.ac = true;
		}
	
		return this;
	},
	/**
	 * Переместить элемент коллекции (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - контекст для коллекции-источника (sharp (#) char indicates the order)
	 * @param {String|Array} [sourceID=this.active] - collection ID-источника
	 * @param {String|Array} [activeID=this.active] - collection ID (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false);
	};
	/**
	 * Копировать элементы коллекции (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - контекст для коллекции-источника (sharp (#) char indicates the order)
	 * @param {String|Array} [sourceID=this.active] - collection ID-источника
	 * @param {String|Array} [activeID=this.active] - collection ID (куда переносится)
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
	 * Копировать элмент коллекции (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - контекст для коллекции-источника (sharp (#) char indicates the order)
	 * @param {String|Array} [sourceID=this.active] - collection ID-источника
	 * @param {String|Array} [activeID=this.active] - collection ID (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false, "", "", "", false);
	};