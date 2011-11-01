	
	/**
	 * Вернуть количество элементов в коллекции (с учётом контекста)
	 * 
	 * // Перегрузки:
	 * 1) Если нету входных параметров, то ИД равен активной коллекции, а фильтр отключён;
	 * 2) Если один входной параметр (строка), то он равен ИДу, а фильтр отключён;
	 * 3) Если один входной параметр (коллекция), то возвращается её длина (активный контекст не учитывается).
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Collection} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String|Collection} [id=this.active] - ИД коллекции или коллекция
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.fn.length = function (filter, id) {
		filter = $.isExist(filter) ? filter : false;
		
		var
			dObj = this.dObj,
			prop = dObj.prop,
	
			cObj, cOLength, aCheck,
	
			i, countRecords;
	

		if (!$.isFunction(filter)) {
			if (($.isString(filter) && !$.isExist(id)) || $.isArray(filter) || $.isPlainObject(filter)) {
				id = filter;
				filter = false;
			}
		}

		if (!id || id === this.active) {
			cObj = prop.activeCollection;
		} else if ($.isString(id)) {
			cObj = dObj.sys.tmpCollection[id];
		} else {
			aCheck = true;
			cObj = id;
		}
		//
		if (aCheck !== true) {
			cObj = $.Collection.cache.obj.getByLink(cObj, prop.activeContext);
		}
		// Если null
		if (cObj === null) { return 0; }
		
		cOLength = cObj.length;
		if ($.isString(cObj)) { return cOLength; }
		
		if (typeof cObj === "object") {
			if (filter === false && cOLength !== undefined) {
				countRecords = cOLength;
			} else {
				countRecords = 0;
				for (i in cObj) {
					if (cObj.hasOwnProperty(i)
					&& (
						filter === false
						|| this.customFilter(filter, cObj, i, cOLength || null, this, aCheck === true ? "array" : id ? id : this.active)) === true) {
						countRecords++;
					}
				}
			}
		} else { throw new Error("Incorrect data type!"); }
	
		return countRecords;
	};
	/**
	 * Перебрать коллекцию (с учётом контекста)
	 *
	 * // Перегрузки:
	 * 1) Если id имеет логическое значение, то он считается за mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - функция callback
	 * @param {Function} [callback.before=undefined] - функция callback, которая срабаывает перед началом итераций
	 * @param {Function} [callback.after=undefined] - функция callback, которая срабатывает после конца итераций
	 * @param {Function} [callback.beforeFilter=undefined] - функция callback, которая срабаывает перед фильтром
	 * @param {Function} [callback.afterFilter=undefined] - функция callback, которая срабатывает после фильтра
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный поиск
	 * @param {Number|Boolean} [count=false] - максимальное количество результатов (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.each = function (callback, filter, id, mult, count, from, indexOf) {
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
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
	
			cObj, cOLength, tmpLength,
	
			i, j = 0;
		
		// Вешаем ссылку
		dObj.sys.callbackCallee = callback;
		// Событие "до" итераций
		if (callback.before) {
			if (callback.before.apply(this, arguments) === false) {
				return this;
			}
		}
		
		cObj = $.Collection.cache.obj.getByLink(id !== this.active ? sys.tmpCollection[id] : prop.activeCollection, prop.activeContext);
		cOLength = this.length(cObj);
		
		if ($.isArray(cObj)) {
			tmpLength = cOLength - 1;
			for (i = indexOf !== false ? indexOf - 1 : -1; i++ < tmpLength;) {
				if (count !== false && j === count) { break; }
				
				// Событие "до" фильтра итераций
				if (callback.beforeFilter) {
					if (callback.beforeFilter(cObj, i, cOLength, this, id) === false) {
						return this;
					}
				}
				
				if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
					if (from !== false && from !== 0) { from--; continue; }
					
					if (callback.call(this, cObj, i, cOLength, this, id) === false) { break; }
					if (mult === false) { break; }
					j++;
				}
				
				// Событие "после" фильтра итераций
				if (callback.afterFilter) {
					if (callback.afterFilter(cObj, i, cOLength, this, id) === false) {
						return this;
					}
				}
			}
		} else {
			for (i in cObj) {
				if (cObj.hasOwnProperty(i)) {
					if (count !== false && j === count) { break; }
					if (indexOf !== false && indexOf !== 0) { indexOf--; continue; }
					
					// Событие "до" фильтра итераций
					if (callback.beforeFilter) {
						if (callback.beforeFilter(cObj, i, cOLength, this, id) === false) {
							return this;
						}
					}
					
					if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
						if (from !== false && from !== 0) { from--; continue; }
							
						if (callback.call(this, cObj, i, cOLength, this, id) === false) { break; }
						if (mult === false) { break; }
						j++;
					}
					
					// Событие "после" фильтра итераций
					if (callback.afterFilter) {
						if (callback.afterFilter(cObj, i, cOLength, this, id) === false) {
							return this;
						}
					}
				}
			}
		}
		
		// Событие "после" итераций
		callback.after && callback.after.apply(this, arguments);
	
		return this;
	};