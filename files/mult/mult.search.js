	
	/**
	 * Искать элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - collection ID
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный поиск
	 * @param {Number|Boolean} [count=false] - максимальное количество элементов для поиска (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Number|Array}
	 */
	$.Collection.fn.searchElements = function (filter, id, mult, count, from, indexOf) {
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
	
		var
			result = [],
			action = function (data, i, aLength, $this, id) {
				if (mult === true) {
					result.push(i);
				} else {
					result = i;
					return false;
				}
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * Искать элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - collection ID
	 * @return {Number|Array}
	 */
	$.Collection.fn.searchElement = function (filter, id) {
		return this.searchElements(filter || "", id || "", false);
	};