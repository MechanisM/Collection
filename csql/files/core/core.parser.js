// Лексический анализатор
CSQL.prototype.query = function (queryStr, parent) {
	var
		cacheObj = CSQL.cache,
		cacheLexeme = cacheObj.lexeme,
		helper = cacheObj.helper,
		
		lexeme,
		lexemeLength,
		
		subQuery = [],
		subRes,
		
		// Лимит
		limitFrom = null,
		limitCount = null,
		mult = true,
		
		// Анализ сортировки
		order = "",
	
		// Токены
		token = "",
		tmpToken,
		
		// Анализ выборки
		action,
		actionStr = "",
		prevTable,
		
		// Анализ объединения
		qCheck = queryStr.search("JOIN"),
		join,
		
		// Контроллер запроса типа SELECT
		select,
		
		// Поля выборки
		fields = [],
		fieldsName = [],
		fieldsLink = {},
		
		// Таблица выборки
		from = "",
		tmpTable,
		tablesName = {},
		
		// Анализ условия
		whereStr = "return ",
		where = false,
		
		i = -1, key,
		result;
	
	// Преоброзауем строку запроса во множество лексем
	lexeme = cacheLexeme.makeLexeme(cacheLexeme.prepareStr(queryStr, subQuery));
	lexemeLength = lexeme.length - 1;
	
	// 
	for (; i++ < lexemeLength;) {
		// Разбираем токены
		tmpToken = cacheLexeme.makeTokens(lexeme[i], token);
		if (tmpToken !== true) {
			token = tmpToken;
			continue;
		}
		
		// Анализ SELECT условия
		if (token === "SELECT") {
			fields.push(lexeme[i]);
			if (lexeme[i + 1] !== "AS") {
				fieldsName.push(lexeme[i].replace(/.*?(?:\[|)([\w'"]+)(?:\]|)$/, "$1").split(/'|"/).join(""));
			}
			select = true;	
			// Псевдонимы полей выбора	
		} else if (token === "SELECT AS") {
			fieldsName.push(lexeme[i]);
			fieldsLink[lexeme[i]] = lexeme[i - 2];
			
			token = "SELECT";
						
		// Анализ FROM условия
		} else if (token === "FROM") {
			from = lexeme[i].split("`").join("");
			tablesName[from] = from;
		// Псевдонимы источника
		} else if (token === "FROM AS") {
			tablesName[lexeme[i]] = from;	
			token = "FROM";
		// Условия
		} else if (token === "WHERE") {
			if (qCheck !== -1) { whereStr += "&&"; }
			qCheck = -1;
			
			// Если вложенный запрос
			if (lexeme[i].search("\\(\\(") !== -1) {
				// Высисляем вложенный запрос
				subRes = this.query(subQuery[lexeme[i].replace(/\(\((\d+)\)\)/, "$1")]);
				
				if (subRes.length > 0) {
					if ($.isPlainObject(subRes[0])) {
						for (key in subRes[0]) {
							if (subRes[0].hasOwnProperty(key)) {
								if (!$.isNumber) {
									whereStr += "'" + subRes[0][key]  + "'";
								} else {
									whereStr += subRes[0][key];
								}
							}
						}
					} else {
						if (!$.isNumber) {
							whereStr += "'" + subRes[0]  + "'";
						} else {
							whereStr += subRes[0];
						}
					}
				}
			} else {
				console.log(lexeme[i]);
				whereStr += helper.tableCSQLReplacer(lexeme[i], tablesName, fieldsLink);	
			}	
		// Сортировка
		} else if (token === "ORDER BY") {
			order = lexeme[i];
		}
	}
	//
	if (whereStr !== "return ") { where = new Function("$this", "i", "aLength", "$obj", "id", whereStr); }
	
	if (select === true) {
		result = {};
		
		actionStr = "\
			var custObj = {};\
			if (!CSQL.tmp.result[id]) {\
				CSQL.tmp.result[id] = [];\
			}\
			if ('" + fields[0].replace(/'/g, "\\'") + "' === '*') {\
				$.extend(custObj, $this[0]";		
		//
		for (key in tablesName) {
			if (tablesName.hasOwnProperty(key)) {
				if (tablesName[key] !== from && tablesName[key] !== prevTable) {
					prevTable = tablesName[key];
					actionStr += "," + helper.tableCSQLReplacer("`" + key + "`", tablesName, fieldsLink) + "[i]";
				}
			}
		}
		//
		actionStr += ");CSQL.tmp.result[id].push(custObj);\
			}\
		";
		
		// проверка уникальности ключа результата
		while (CSQL.tmp.result[from]) { from += "_" + Math.random(); }
		
		if (fields[0] !== "*") {
			actionStr += "else {";
			for (i = fields.length; i--;) {
				if (fieldsName[i].search("\\*") === -1) {
					actionStr += "custObj['" + fieldsName[i] + "']=" + helper.tableCSQLReplacer(fields[i], tablesName, fieldsLink) + ";";
				} else {
					actionStr += "$.extend(custObj," + helper.tableCSQLReplacer(fields[i], tablesName, fieldsLink) + ");";
				}
			}
			actionStr += "} CSQL.tmp.result[id].push(custObj);";
		}
		actionStr += "return true;";
		action = new Function ("$this", "i", "aLength", "$obj", "id", actionStr);
		// Передача переменных во вложенный запрос
		if (subQuery.length > 0) {
			action.beforeFilter = function ($this, i, $obj, id) {
				where.param = {$this: $this, i: i, $obj: $obj, id: id};
			};
		}

		this.each(action, where, from, mult, limitCount, limitFrom);
		
		result = mult === true ? CSQL.tmp.result[from] || [] : CSQL.tmp.result[from][0];
		delete CSQL.tmp.result[from];
			
		if (order) {
			result.sort($.Collection.cache.sort.sortBy(order, token === "DESC" ? true : false, null));
		}
		
		return result;
	}
		
	return this;
};