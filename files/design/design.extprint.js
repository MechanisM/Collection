	
	/**
	 * Сложная шаблонизация коллекции (с учётом контекста) (с активацией пагинатора)
	 * 
	 * @this {Colletion Object}
	 * @param param - объект настроек
	 * @param {Number} [param.page=this.dObj.prop.activePage] - номер страницы
	 * @param {Template} [param.template=this.dObj.prop.activeTemplate] - шаблон
	 * @param {Number|Boolean} [param.countBreak=this.dObj.prop.activeCountBreak] - количество записей на 1 страницу (false - выводятся все записи)
	 * @param {Number} [param.pageBreak=this.dObj.prop.activePageBreak] - количество выводимых страниц (навигация)
	 * @param {jQuery Object} [param.target=this.dObj.prop.activeTarget] - контейнер вывода результата
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.prop.activeParser] - ИД парсера, строковое условие или false
	 * @param {Boolean} [param.cacheIteration=this.dObj.cache.iteration] - если true, то последняя итерация берется из кеша
	 * @param {Selector} [param.selectorOut=this.dObj.prop.activeSelectorOut] - cелектор, по которому читается количество записей на страницу
	 * @param {Selector} [param.pager=this.dObj.prop.activePager] - селектор к пагинатору
	 * @param {String} [param.appendType=this.dObj.prop.activeAppendType] - режим добавления в DOM
	 * @param {String} [param.resultNull=this.dObj.prop.activeResultNull] - текст, выводимый в случае если результатов нету
	 * @return {Colletion Object}
	 */
	$.Collection.fn.extPrint = function (param) {
		param = param || {};
		
		var
			$this = this,
			dObj = $this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			cObj,
			cOLength,
			start, inc = 0,
	
			activeFilter = param.filter ? param.filter : prop.activeFilter,
			activeParser = param.parser ? param.parser : prop.activeParser,
			//
			activePage = param.page || prop.activePage,
			checkPage = activePage === (param.page + 1),
			//
			activeTemplate = param.template || prop.activeTemplate,
			//
			activeTarget = param.target || prop.activeTarget,
			activeCountBreak = +param.countBreak || +prop.activeCountBreak,
			activePageBreak = +param.countBreak || +prop.activePageBreak,
			//
			cache = prop.activeCache,
			cacheIteration = $.isBoolean(param.cacheIteration) ? param.cacheIteration : cache.iteration,
			//
			activeResultNull = param.resultNull !== undefined ? param.resultNull : prop.activeResultNull,
	
			result = "",
			action = function (data, i, aLength, $this, objID) {
				result += activeTemplate(data, i, aLength, $this, objID);
				inc = i;
				
				return true;
			};
			
		// Получаем коллекцию
		cObj = $.Collection.stat.obj.getByLink(prop.activeCollection, (param.context || prop.activeContext));
		cOLength = $this.length();
		// Количество записей на страницу
		activeCountBreak = activeCountBreak === false ? cOLength : activeCountBreak;
		
		// Ставим ссылку на шаблон
		dObj.sys.templateCallee = activeTemplate;
		
		if ($.isPlainObject(cObj) || cacheIteration === false) {
			start = activePage === 1 ? activeCountBreak : (activePage - 1) * activeCountBreak;
			//
			this.each(action, activeFilter, "active", true, activeCountBreak, start);
		} else if ($.isArray(cObj) && cacheIteration === true) {
			// Вычисляем стартовую позицию
			start = activeFilter === false ?
						activePage === 1 ? -1 : (activePage - 1) * activeCountBreak - 1 : cacheIteration === true ?
							checkPage === true ? cache.firstIteration : cache.lastIteration : i;
			
			// Перематывание кешированного шага назад
			if (checkPage === true && activeFilter !== false) {
				for (; start--;) {
					if ($this.customFilter(activeFilter, cObj, start, cOLength, $this, "active") === true) {
						if (inc === activeCountBreak) {
							break;
						} else { inc++; }
					}
				}
				start = start === -1 ? start : start + 1;
				cache.lastIteration = start;
			}
			
			this.each(action, activeFilter, "active", true, activeCountBreak, null, start);
			//
			cache.firstIteration = cache.lastIteration;
			cache.lastIteration = inc - 1;
			if (cache.autoIteration === true) {
				cache.iteration = true;
			}
		}
		
		result = !result ? activeResultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResultInSearch + '</div>' : activeResultNull : result;
		result = activeParser !== false ? $this.customParser(activeParser, result) : result;
		
		// Вставляем в DOM
		activeTarget[(param.appendType || prop.activeAppendType)](result);
		
		// Подготовка данных для панели навигации
		sys.countRecords = $this.length(activeFilter);
		sys.countRecordsInPage = $((param.selectorOut || prop.activeSelectorOut), activeTarget).length;
		sys.countTotal = activeCountBreak * activePage - (activeCountBreak - sys.countRecordsInPage);
	
		$.extend(param, {
			countRecords: sys.countRecords,
			countRecordsInPage: sys.countRecordsInPage,
			countTotal: sys.countTotal
		});
		// Генерерируем панель навигации
		if (activePage !== 1 && sys.countRecordsInPage === 0) {
			dObj.prop.activePage--;
			$this.extPrint.apply($this, arguments);
		} else { $this.easyPage(param, dObj.prop); }
	
		return $this;
	};
	/**
	 * Активация модели шаблона
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param=undefined] - объект настроект (зависит от модели шаблона)
	 * @param {Object} [prop=undefined] - свойства коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.easyPage = function (param, prop) {
		// Ставим ссылку на модель
		this.dObj.sys.templateModeCallee = this.dObj.prop.activeTemplateMode;
		this.dObj.prop.activeTemplateMode.apply(this, arguments);
		
		return this;
	};