	
	/////////////////////////////////
	// Дополнительные методы
	/////////////////////////////////
	
	/**
	 * Расчитать сложный фильтр
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Array|String} [filter=false] - условие поиска или массив атомов условия или строковое условие
	 * @param {Collection} $this - ссылка на коллекцию
	 * @param {Number|String} i - ключ итерации
	 * @param {Number} cALength - длина коллекции
	 * @param {Collection Object} $obj - ссылка на объект $.Collection
	 * @param {String} id - ИД активной коллекции
	 * @return {Boolean}
	 */
	$.Collection.fn.customFilter = function (filter, $this, i, cALength, $obj, id) {
		var
			tmpFilter,
		
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
			
			fLength,
			calFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			j = -1;
	
		if ($.isFunction(filter)) {
			dObj.sys.filterCallee = filter;
			
			return filter($this, i, cALength, $obj, id);
		}
		
		if (!filter || ($.isString(filter) && $.trim(filter) === this.active)) {
			if (prop.activeFilter) {
				dObj.sys.filterCallee = prop.activeFilter;
				
				return prop.activeFilter($this, i, cALength, $obj, id);
			}
	
			return true;
		} else {
			// Если фильр задан строкой, то парсим его
			if (!$.isArray(filter)) {
				// Если простой фильр
				if (filter.search(/\|\||&&|!|\(|\)/) === -1) {
					dObj.sys.filterCallee = sys.tmpFilter[filter];
					
					return sys.tmpFilter[filter]($this, i, cALength, $obj, id);
				}
				
				filter = $.trim(
							filter
								.toString()
								.replace(/\s*(\(|\))\s*/g, " $1 ")
								.replace(/\s*(\|\||&&)\s*/g, " $1 ")
								.replace(/(!)\s*/g, "$1")
							)
						.split(" ");
			}
			// Расчёт вложенных фильтров
			calFilter = function (array, iter) {
				var
					i = -1,
					aLength = array.length - 1,
					pos = 0,
					result = [];
				
				for (; i++ < aLength;) {
					iter++;
					if (array[i] === "(") { pos++; }
					if (array[i] === ")") {
						if (pos === 0) {
							return {result: result, iter: iter};
						} else { pos--; }
					}
					result.push(array[i]);
				}
			};
			// Расчитываем фильтр
			fLength = filter.length - 1;
			
			for (; j++ < fLength;) {
				// Расчёт скобок
				if (filter[j] === "(" || filter[j] === "!(") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = calFilter(filter.slice((j + 1)), j);
					j = tmpFilter.iter;
					//
					tmpResult = this.customFilter(tmpFilter.result, $this, i, cALength, $obj, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else {
						result = inverse === true ? !tmpResult : tmpResult || result;
					}
				// Расчёт внешних фильтров
				} else if (filter[j] !== ")" && filter[j] !== "||" && filter[j] !== "&&") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = filter[j] === this.active ? prop.activeFilter : sys.tmpFilter[filter[j]];
					dObj.sys.filterCallee = tmpFilter;
					//
					tmpResult = tmpFilter($this, i, cALength, $obj, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else {
						result = inverse === true ? !tmpResult : tmpResult || result;
					}
				// И и ИЛИ
				} else if (filter[j] === "||") {
					and = false;
					or = true;
				} else if (filter[j] === "&&") {
					or = false;
					and = true;
				}
			}
			
			return result;
		}
	};
	/**
	 * Расчитать сложный парсер
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|Array|String} parser - парсер или массив парсеров или строковое условие
	 * @param {String} str - исходная строка
	 * @return {String}
	 */
	$.Collection.fn.customParser = function (parser, str) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
			
			tmpParser,
			i;
	
		if ($.isFunction(parser)) {
			dObj.sys.parserCallee = parser;
			
			return parser(str, this);
		}
	
		if (!parser || ($.isString(parser) && $.trim(parser) === this.active)) {
			if (prop.activeParser) {
				dObj.sys.parserCallee = prop.activeParser;
				
				return prop.activeParser(str, this);
			}
	
			return str;
		} else {
			if ($.isString(parser)) {
				parser = $.trim(parser);
				if (parser.search("&&") === -1) {
					dObj.sys.parserCallee = sys.tmpParser[parser];
					
					return sys.tmpParser[parser](str, this);
				}
				parser = parser.split("&&");
			}
			
			for (i = parser.length; i--;) {
				parser[i] = $.trim(parser[i]);
				tmpParser = parser[i] === this.active ? prop.activeParser : sys.tmpParser[parser[i]];
				
				dObj.sys.parserCallee = tmpParser;
				str = tmpParser(str, this);
			}
	
			return str;
		}
	};
	
	
	/**
	 * Расчитать контекст на n уровней вверх
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - уровень подъёма
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {String}
	 */
	$.Collection.fn.parentContext = function (n, id) {
		n = n || 1;
	
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			activeContextID = sys.activeContextID,
			context = "",
	
			i;
	
		context = (id && id !== this.active ? sys.tmpContext[id] : prop.activeContext).split($.Collection.static.obj.contextSeparator);
	
		for (i = n; i--;) { context.splice(-1, 1); }
	
		return context.join($.Collection.static.obj.contextSeparator);
	};
	/**
	 * Подняться на n уровень контекста
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - уровень подъёма
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.parent = function (n, id) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			activeContextID = dObj.sys.activeContextID,
			context = this.parentContext.apply(this, arguments);
	
		if (!id || id === this.active) {
			if (activeContextID) {
				sys.tmpContext[activeContextID] = context;
			}
			prop.activeContext = context;
		} else {
			sys.tmpContext[id] = context;
			if (activeContextID && id === activeContextID) {
				prop.activeContext = context;
			}
		}
	
		return this;
	};