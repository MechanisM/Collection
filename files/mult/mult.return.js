	
	/**
	 * Вернуть элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный поиск
	 * @param {Number|Boolean} [count=false] - максимальное количество элементов для поиска (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {mixed}
	 */
	$.Collection.fn.returnElements = function (filter, id, mult, count, from, indexOf) {
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
					result.push(data[i]);
				} else {
					result = data[i];
					return false;
				}
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * Вернуть элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {mixed}
	 */
	$.Collection.fn.returnElement = function (filter, id) {
		return this.returnElements(filter || "", id || "", false);
	};