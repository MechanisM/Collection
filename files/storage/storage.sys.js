	
	// Системные настройки
	$.Collection.storage.dObj.sys = {
		/**
		 * Ссылка на вызываемую функцию-callback (метод each)
		 * 
		 * @field
		 * @type Function
		 */
		callbackCallee: null,
		/**
		 * Ссылка на вызываемую функцию-фильтр
		 * 
		 * @field
		 * @type Function
		 */
		filterCallee: null,
		/**
		 * Ссылка на вызываемую функцию-шаблон
		 * 
		 * @field
		 * @type Function
		 */
		templateCallee: null,
		/**
		 * Ссылка на вызываемую функцию-модель
		 * 
		 * @field
		 * @type Function
		 */
		templateModeCallee: null,
		/**
		 * Ссылка на вызываемую функцию-парсер
		 * 
		 * @field
		 * @type Function
		 */
		parserCallee: null
	};
	
	// Генерация полей
	(function (data) {
		var
			i,
			lowerCase,
			sys = $.Collection.storage.dObj.sys;
	
		for (i = data.length; i--;) {
			lowerCase = data[i].substring(0, 1).toLowerCase() + data[i].substring(1);
			
			sys["active" + data[i] + "ID"] = null;
			sys["tmp" + data[i]] = {};
			sys[lowerCase + "ChangeControl"] = null;
			sys[lowerCase + "Back"] = [];
		}
	})([
		"Collection",
		"Page",
		"Target",
		"Filter",
		"Parser",
		"Var",
		"Template",
		"TemplateMode",
		"Context",
		"CountBreak",
		"PageBreak",
		"Pager",
		"SelectorOut",
		"ResultNull",
		"AppendType",
		"Defer",
		"Cache",
		"Index",
		"Map"
		]);