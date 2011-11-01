function CSQL () {}
CSQL.tmp = {result: {}};
CSQL.prototype = new $.Collection();
CSQL.prototype.csqlFn = {};
	// Объект для хранения статичной информации
	CSQL.cache = {};
	// Статичные вспомогательные методы
	CSQL.cache.helper = {
		/**
		* Проверить наличие функции по имени
		* 
		* @param {String} name - исходная строка
		* @return {Boolean}
		*/
		isCSQLFunction: function (name) {
			if ($.isString(name)) {
				if (CSQL.prototype.csqlFn[name]) { return true; } else { return false; }
			} else {
				if (CSQL.prototype.csqlFn[name[name.length - 1]]) { return true; } else { return false; }
			}
		},
		/**
		* Провести модификацию строки таблиц (замена констант)
		* 
		* @param {String} str - исходная строка
		* @param {Plain Object} tablesName - объект псевдонимов таблиц
		* @param {Plain Object} fieldsLink - объект псевдонимов полей
		* @return {String}
		*/
		tableCSQLReplacer: function (str, tablesName, fieldsLink) {
			fieldsLink = fieldsLink || {};
			//
			if (fieldsLink[str]) {
				return this.tableCSQLReplacer(fieldsLink[str], tablesName, fieldsLink);
			}
			
			if (str.search("`active`") !== -1) {
				str = str.replace(/`.*`/, "$obj.dObj.prop.activeCollection");
			} else {
				str = str.replace(/`(.*)`/, function (str, $1) {
					return "$obj.dObj.sys.tmpCollection['" + tablesName[$1] + "']";
				});
			}
						
			return str.replace(".*", "");
		}
	};
	
	// Статичные методы преобразования строки в лексемы
	CSQL.cache.lexeme = {
		/**
		* Подготовить строку к разбиению на лексемы
		* 
		* @param {Query} str - исходная строка запроса
		* @return {CSQL Query}
		*/
		prepareStr: function (str) {
			var
				helper = CSQL.cache.helper,
			
				// Дробление запроса для проверки функций и вложенных запросов
				lexeme = str.split("(").join("({").split("("),
				lexemeLength = lexeme.length - 1,
				// Лексемы функции
				lexemeFn, lexemeFnLast,
				
				i = -1;
			
			// Проверка функций
			for (; i++ < lexemeLength;) {
				lexeme[i] = $.trim(lexeme[i]);
				if (lexeme[i].substring(0, 1) === "{") {
					if (i !== 0) {
						lexemeFn = lexeme[i - 1].split(" ");
						lexemeFnLast = lexemeFn.length - 1;
						
						if (helper.isCSQLFunction(lexemeFn)) {
							lexeme[i] = lexeme[i].split(",").join(";");
							// Ставим идентифкатор функции
							lexemeFn[lexemeFnLast] = "$obj.csqlFn" + lexemeFn[lexemeFnLast];
							lexemeFn = lexemeFn.join(" ");
							lexeme[i - 1] = lexemeFn;
							//
							lexeme[i] = lexeme[i].substring(1);
						} else {
							lexeme[i] = '$obj.runSubQuery("' + lexeme[i].substring(1).replace(/\)$/, "").split(",").join(";") + '", i))';
						}
					}
				}
			}
			
			return lexeme.join("(");
		},
		/**
		* Разбить строку на лексемы
		* 
		* @param {CSQL Query} str - строка запроса
		* @return {CSQL Lexeme}
		*/
		makeLexeme: function (str) {
			str = str
				.replace(/\s*=\s*/g, " === ")
				.replace(/\s*,\s*/g, " ")
							
				.split(" AND ")
				.join(" && ")
							
				.split(" OR ")
				.join(" || ")
							
				.replace(/\s{2,}/g, " ")
				.replace(/\s*;\s*/g, ";")
							
				.split(";")
				.join(",")
							
				.split(" ");
						
			return str;
		},
		/**
		* Составить токены из лексем
		* 
		* @param {CSQL Lexeme} lexeme - лексема
		* @param {CSQL Token} token - токен (предыдущая итерация)
		* @return {CSQL Token|Boolean}
		*/
		makeTokens: function (lexeme, token) {
			token = token || "";
			
			switch (lexeme) {
				case "SELECT" : 
				case "FROM" : 
				case "UPDATE" : 
				case "SET" : 
				case "LEFT" : 
				case "WHERE" : 
				case "GROUP" : 
				case "ORDER" :
				case "ASC" :
				case "DESC" : 
				case "LIMIT" : {
					token = lexeme;
				} break;
				//
				case "BY" : {
					token += " BY";
				} break;
				//
				case "ON" : {
					token += " ON";
				} break;
				//
				case "AS" : {
					token += " AS";
				} break;
				//
				default: { return true; }
			}
						
			return token;
		},
	};// Лексический анализатор
CSQL.prototype.runSubQuery = function (str, j) {
	alert(j)
};
CSQL.prototype.query = function (queryStr, link) {
	var
		cacheObj = CSQL.cache,
		cacheLexeme = cacheObj.lexeme,
		helper = cacheObj.helper,
		
		lexeme,
		lexemeLength,
		
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
		fieldsLink = link && link.fieldsLink ? link.fieldsLink : {},
		
		// Таблица выборки
		from = "",
		tmpTable,
		tablesName = link && link.tablesName ? link.tablesName : {},
		
		// Анализ условия
		whereStr = "return ",
		where = false,
		
		i = -1, key,
		result;
	
	// Преоброзауем строку запроса во множество лексем
	lexeme = cacheLexeme.makeLexeme(cacheLexeme.prepareStr(queryStr));
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
		
		// Анализ WHERE условия
		} else if (token === "WHERE") {
			if (qCheck !== -1) { whereStr += "&&"; }
			qCheck = -1;
			
			whereStr += helper.tableCSQLReplacer(lexeme[i], tablesName, fieldsLink);	
		
		// Анализ ORDER BY условия
		} else if (token === "ORDER BY") {
			order = lexeme[i];
		}
	}
	
	console.log(whereStr);
	// Компиляция условия
	if (whereStr !== "return ") { where = new Function("$this", "i", "aLength", "$obj", "id", whereStr); }
	
	// Компиляция SELECT запроса
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

		this.each(action, where, from, mult, limitCount, limitFrom);
		
		result = mult === true ? CSQL.tmp.result[from] || [] : CSQL.tmp.result[from][0];
		delete CSQL.tmp.result[from];
			
		if (order) {
			result.sort($.Collection.cache.sort.sortBy(order, token === "DESC" ? true : false, null));
		}
		
		return result;
	}
		
	return this;
};// Строковые методы
CSQL.prototype.csqlFn.CONCAT = function () {
	var
		aLength = arguments.length - 1,
		str = "", i = -1;
		
	for (; i++ < aLength;) {
		str += arguments[i];
	}

	return str;
};
CSQL.prototype.csqlFn.CONCAT_WS = function (sep) {
	if (!sep) { return null; }
		
	var
		aLength = arguments.length,
		str = "", i = -1;
		
	for (; i++ < aLength;) {
		if (i !== aLength) {
			str += arguments[i] + sep;
		} else { str += arguments[i]; }
	}

	return str;
};
CSQL.prototype.csqlFn.SUBSTRING = function (str, fromPos, forLen) {
	return str.substring(fromPos || 0, forLen || "");
};
CSQL.prototype.csqlFn.LENGTH = function (str) {
	return str.length;
};
CSQL.prototype.csqlFn.REPLACE = function (str, fromStr, toStr, mod) {
	mod = mod || "g";
	fromStr = new RegExp(fromStr, mod);
		
	return str.replace(fromStr, toStr);
};
CSQL.prototype.csqlFn.REPEAT = function (str, count) {
	if (!str || !count) { return null; }
	for (var i = count - 1; i--;) { str += str; }
		
	return str;
};
CSQL.prototype.csqlFn.SPACE = function (count) {	
	count = count || 1;
	var str = "", i;
	for (i = count; i--;) { str += " "; }
		
	return str;
};
CSQL.prototype.csqlFn.TRIM = function (str) {		
	return $.trim(str);
};
CSQL.prototype.csqlFn.LCASE = function (str) {
	return str.toLowerCase();
};
CSQL.prototype.csqlFn.UCASE = function (str) {
	return str.toUpperCase();
};// Статические
CSQL.prototype.csqlFn.COUNT = function (obj) {
	return obj.length;
};//