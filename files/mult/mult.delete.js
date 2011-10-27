	
	/**
	 * Удалить элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественное удаление
	 * @param {Number|Boolean} [count=false] - максимальное количество удалений (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.active;
	
		// Если id имеет логическое значение
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.active;
		}
	
		// Значения по умолчанию
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var elements = this.searchElements(filter, id, mult, count, from, indexOf), i;

		if (mult === false) {
			this.deleteElementByLink(elements, id);
		} else {
			for (i = elements.length; i--;) {
				this.deleteElementByLink(elements[i], id);
			}
		}
	
		return this;
	};
	/**
	 * Удалить элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElement = function (filter, id) {
		return this.deleteElements(filter || "", id || "", false);
	};