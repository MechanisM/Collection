	
	/**
	 * Простая шаблонизация коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param param - объект настроек
	 * @param {Template} [param.template=this.dObj.prop.activeTemplate] - шаблон
	 * @param {jQuery Object|Boolean} [param.target=this.dObj.prop.activeTarget] - контейнер вывода результата (false - если выводить в переменную)
	 * @param {String} [param.variable=this.dObj.sys.activeVarID] - ИД переменной (если param.target === false)
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.prop.activeParser] - парсер, ИД парсера, строковое условие или false
	 * @param {Selector} [param.pager=this.dObj.prop.activePager] - селектор к пагинатору
	 * @param {String} [param.appendType=this.dObj.prop.activeAppendType] - режим добавления в DOM
	 * @param {String} [param.resultNull=this.dObj.prop.activeResultNull] - текст, выводимый в случае если результатов нету
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный поиск
	 * @param {Number|Boolean} [count=false] - максимальное количество записей (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.print = function (param, mult, count, from, indexOf) {
		param = param || {};
		
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			$this = this,
			dObj = $this.dObj,
			prop = dObj.prop,
	
			activeParser = param.parser || prop.activeParser,
			activeTemplate = param.template || prop.activeTemplate,
	
			activeTarget = param.target || param.target === false ? param.target : prop.activeTarget,
			activeResultNull = param.resultNull !== undefined ? param.resultNull : prop.activeResultNull,
	
			result = "",
			action = function (data, i, aLength, $this, objID) {
				result += activeTemplate(data, i, aLength, $this, objID);
				
				if (mult !== true) { return false; }
	
				return true;
			};
		
		// Ставим ссылку на шаблон
		dObj.sys.templateCallee = activeTemplate;
		
		this.each(action, (param.filter || prop.activeFilter), "active", mult, count, from, indexOf);
		
		result = !result ? activeResultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResultInSearch + '</div>' : activeResultNull : result;
		result = activeParser !== false ? $this.customParser((activeParser), result) : result;
		
		if (activeTarget === false) {
			if (!param.variable) {
				$this.$Var(result);
			} else {
				$this.PushSetVar(param.variable, result);
			}
		} else { activeTarget[(param.appendType || prop.activeAppendType)](result); }
	
		return $this;
	};