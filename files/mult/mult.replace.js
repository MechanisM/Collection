	
	/**
	 * Заменить элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {mixed} replaceObj - объект замены (если функция, то выполняется, как callback) 
	 * @param {String} [id=this.active] - collection ID
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественная замена
	 * @param {Number|Boolean} [count=false] - максимальное количество замен (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElements = function (filter, replaceObj, id, mult, count, from, indexOf) {
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
			replaceCheck = $.isFunction(replaceObj),
			action = function (data, i, aLength, $this, id) {
				if (replaceCheck) {
					replaceObj(data, i, aLength, $this, id);
				} else { data[i] = replaceObj; }
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return this;
	};
	/**
	 * Заменить элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {mixed} replaceObj - объект замены (если функция, то выполняется, как callback) 
	 * @param {String} [id=this.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElement = function (filter, replaceObj, id) {
		return this.replaceElements(filter || "", replaceObj, id || "", false);
	};