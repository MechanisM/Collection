	
	// Объект для хранения статичной информации
	$.Collection.cache = {};
	// Объект для хранения статичных моделей шаблона
	$.Collection.cache.templateMode = {};
	// Статичные методы для работы с объектами
	$.Collection.cache.obj = {
		/**
		 * Разделитель контекста
		 * 
		 * @field
		 * @type String
		 */
		contextSeparator: "~",
		/**
		 * Разделитель контекста (указатель порядка)
		 * 
		 * @field
		 * @type String
		 */
		subcontextSeparator: "#",
		/**
		 * Разделитель методов
		 * 
		 * @field
		 * @type String
		 */
		methodSeparator: "::",
		/**
		* Получить элемент по указанному контексту
		* 
		* @param {Object} obj - объект
		* @param {Context} context - ссылка (знак # указывает порядок)
		* @return {Object}
		*/
		getByLink: function (obj, context) {
			context = context.toString().split(this.contextSeparator);
			
			var
				key, i = 0,
				pos, n = 0,
				
				objLength,
				cLength = context.length;
			
			for (; i < cLength; i++) {
				context[i] = $.trim(context[i]);
				//
				if (context[i] && context[i] !== this.subcontextSeparator) {
					if (context[i].search(this.subcontextSeparator) === -1) {
						obj = obj[context[i]];
					} else {
						pos = +context[i].replace(this.subcontextSeparator, "");
						
						if ($.isArray(obj)) {
							if (pos >= 0) {
								obj = obj[pos];
							} else {
								obj = obj[obj.length + pos];
							}
						} else {
							if (pos < 0) { 
								objLength = 0;
								for (key in obj) {
									if (obj.hasOwnProperty(key)) { objLength++; }
								}
								//
								pos += objLength;
							}
							
							n = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) {
									if (pos === n) {
										obj = obj[key];
										break;
									}
									n++;
								}
							}
						}
					}
				}
			}
			
			return obj;
		},
		/**
		* Задать значение по указанному контексту
		* 
		* @param {Object} obj - объект
		* @param {Context} context - ссылка (знак # указывает порядок)
		* @param {mixed} value - значение
		* @return {Boolean}
		*/
		setByLink: function (obj, context, value) {
			context = context.toString().split(this.contextSeparator);
			
			var
				key, i = 0,
				pos, n = 0,
				
				objLength,
				cLength = context.length;
			
			// Удаляем "мёртвые" элементы
			for (i = cLength; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === this.subcontextSeparator) { context.splice(i, 1); }
			}
			// Заново определяем длину контекста
			cLength = context.length - 1;
			i = 0;
			
			for (; i <= cLength; i++) {
				if (context[i].search(this.subcontextSeparator) === -1) {
					if (i === cLength) {
						obj[context[i]] = value;
					} else {
						obj = obj[context[i]];
					}
				} else {
					pos = +context[i].replace(this.subcontextSeparator, "");
						
					if ($.isArray(obj)) {
						if (i === cLength) {
							if (pos >= 0) {
								obj[pos] = value;
							} else {
								obj[obj.length + pos] = value;
							}
						} else {
							if (pos >= 0) {
								obj = obj[pos];
							} else {
								obj = obj[obj.length + pos];
							}
						}
					} else {
						if (pos < 0) { 
							objLength = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) { objLength++; }
							}
							//
							pos += objLength;
						}
						
						n = 0;
						for (key in obj) {
							if (obj.hasOwnProperty(key)) {
								if (pos === n) {
									if (i === cLength) {
										obj[key] = value;
									} else {
										obj = obj[key];
									}
									break;
								}
								n++;
							}
						}
					}
				}
			}
			
			return true;
		},
		/**
		 * Добавить новый элемент в Plain Object
		 * 
		 * @param {Plain Object} obj - исходный объект
		 * @param {String} prop - имя добавляемого свойства (можно использовать приставку "::unshift" - результат будет аналогичен работе unshift для массива)
		 * @param {mixed} value - новый элемент
		 * @return {Plain Object|Boolean}
		 */
		addElementToObject: function (obj, prop, value) {
			prop = prop.split(this.methodSeparator);
			
			var key, newObj = {};
			
			if (prop[1] && prop[1] === "unshift") {
				newObj[prop[0]] = value;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
				obj = newObj;
					
				return obj;
			} else if (!prop[1] || prop[1] === "push") {
				obj[prop[0]] = value;
			}
				
			return true;
		}
	};