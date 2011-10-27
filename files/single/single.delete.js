	
	/**
	 * Удалить элемент коллекции по ссылке (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - ссылка (знак # указывает порядок)
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementByLink = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			cacheObj = $.Collection.cache.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			
			key, i = 0,
			pos, n = 0,
			
			objLength,
			cObj;
		//
		prop.activeContext = prop.activeContext.toString();
		
		if (!context && !prop.activeContext) {
			this.setElement("", null);
		} else {
			// Подготавливаем контекст
			context = (prop.activeContext + cacheObj.contextSeparator + context).split(cacheObj.contextSeparator);
			// Удаляем "мёртвые" элементы
			for (i = context.length; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === cacheObj.subcontextSeparator) { context.splice(i, 1); }
			}
			context = context.join(cacheObj.contextSeparator);

			// Выбор родительского элемента для проверки типа
			cObj = cacheObj.getByLink(id && id !== "active" ?
						dObj.sys.tmpCollection[id] : prop.activeCollection,
						context.replace(new RegExp("[^" + cacheObj.contextSeparator + "]+$"), ""));
			// Выбор ссылки
			context = context.replace(new RegExp(".*?([^" + cacheObj.contextSeparator + "]+$)"), "$1");

			if ($.isArray(cObj)) {
				context = +context.replace(cacheObj.subcontextSeparator, "");
				if (context >= 0) {
					cObj.splice(context, 1);
				} else { cObj.splice(cObj.length + context, 1); }
			} else {
				if (context.search(cacheObj.subcontextSeparator) === -1) {
					delete cObj[context];
				} else {
					pos = +context.replace(cacheObj.subcontextSeparator, "");
					if (pos < 0) { 
						objLength = 0;
						// Считаем длину объекта
						for (key in cObj) {
							if (cObj.hasOwnProperty(key)) { objLength++; }
						}
						// Если отсчёт идёт с конца
						pos += objLength;
					}

					n = 0;
					for (key in cObj) {
						if (cObj.hasOwnProperty(key)) {
							if (pos === n) {
								delete cObj[key];
								break;
							}
							n++;
						}
					}
				}
			}
		}
	
		return this;
	};
	/**
	 * Удалить элементы коллекции по ссылке (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext - ссылка (знак # указывает порядок), массив ссылок или объект (ИД коллекции: массив ссылок)
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementsByLink = function (objContext, id) {
		var key, i;
	
		if ($.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if ($.isArray(objContext[key])) {
						for (i = objContext[key].length; i--;) {
							this.deleteElementByLink(objContext[key][i], key);
						}
					} else { this.deleteElementByLink(objContext[key], key); }
				}
			}
		} else if ($.isArray(objContext)) {
			for (i = objContext.length; i--;) {
				this.deleteElementByLink(objContext[i], id || "");
			}
		} else { this.deleteElementByLink(objContext, id || ""); }
	
		return this;
	};