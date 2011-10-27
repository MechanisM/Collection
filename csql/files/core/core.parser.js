CSQL.prototype.query = function (queryStr) {
	var
		// Анализ запроса
		queryArray = queryStr
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
				
			.split(" "),
				
		qALength = queryArray.length - 1,
		// Limit
		limitFrom = null,
		limitCount = null,
		mult = true,
		// Анализ выборки
		action,
		actionStr = "",
		// Анализ объединения
		qCheck = queryStr.search("JOIN"),
		join,
		// Тип приставки
		type,
		
		// Контроллер запроса типа UPDATE
		update,
		// Контроллер запроса типа DELETE
		del,
		// Контроллер запроса типа SELECT
		select,
		
		// Поля выборки
		fields = [],
		fieldsName = [],
		
		// Таблица выборки
		from = "",
		tmpTable,
		tablesName = {},
		
		// Анализ условия
		whereStr = "return ",
		where = false,
		
		// Анализ группировки
		group = null,
		groupObj,
		
		// Анализ сортировки
		order = "",
		rev = false,
			
		i = -1,
			
		replacer = function (str) {
			if (str.search("`active`") !== -1) {
				str = str.replace(/`.*`/, "$obj.dObj.prop.activeCollection");
			} else {
				str = str.replace(/`(.*)`/, function (str, $1) {
					return "$obj.dObj.sys.tmpCollection['" + tablesName[$1] + "']";
				});
			}
				
			return str.replace(".*", "");
		},
			
		result;
		
	for (; i++ < qALength;) {
		switch (queryArray[i]) {
			case "SELECT" : 
			case "FROM" : 
			case "UPDATE" : 
			case "SET" : 
			case "LEFT" : 
			case "WHERE" : 
			case "GROUP" : 
			case "ORDER" : 
			case "ASC" : 
			case "LIMIT" : {
				type = queryArray[i];
			} break;
			//
			case "TOP" : {
				type = queryArray[i];
			} break;
			//
			case "BY" : {
				type += " BY";
			} break;
			//
			case "JOIN" : {
				if (type === "LEFT") {
					type += " JOIN";
				} else { type = "JOIN"; }
			} break;
			//
			case "ON" : {
				type += " ON";
			} break;
			//
			case "AS" : {
				type += " AS";
			} break;
			//
			case "DESC" : {
				rev = true;
			} break;
			//
			case "DELETE" : {
				del = true;
			} break;
			
			// Анализ
			default : {
				// Анализ выбора
				if (type === "SELECT") {
					fields.push(queryArray[i]);
					if (queryArray[(i + 1)] !== "AS") {
						fieldsName.push(queryArray[i].replace(/.*?(?:\[|)([\w'"]+)(?:\]|)$/, "$1").split(/'|"/).join(""));
					}
					select = true;	
				// Псевдонимы полей выбора	
				} else if (type === "SELECT AS") {
					fieldsName.push(queryArray[i]);
					type = "SELECT";
						
				// Источник данных	
				} else if (type === "FROM") {
					from = queryArray[i].split("`").join("");
					tablesName[from] = from;
				// Псевдонимы источника
				} else if (type === "FROM AS" || type === "UPDATE AS") {
					tablesName[queryArray[i]] = from;
						
				// Анализ обновления
				} else if (type === "UPDATE") {
					from = queryArray[i].split("`").join("");
					tablesName[from] = from;
					update = true;
				// Параметры обновления
				} else if (type === "SET") {
					fieldsName.push(queryArray[i]);
					console.log(queryArray[(i + 2)]);
					fields.push(replacer(queryArray[(i + 2)]));
					i += 2;
						
				// Объединения
				} else if (type === "JOIN" || type === "LEFT JOIN") {
					if (whereStr !== "return ") { whereStr += "&&"; }
					tmpTable = queryArray[i].split("`").join("");
					tablesName[tmpTable] = tmpTable;
						
					if (queryArray[(i + 1)] !== "AS") {
						tmpTable = null;
						type += " AS";
					}
				// Псевдонимы
				} else if (type === "JOIN AS" || type === "LEFT JOIN AS") {
					if (tmpTable) { tablesName[queryArray[i]] = tmpTable; }
				} else if (type === "JOIN AS ON" || type === "LEFT JOIN AS ON") {
					whereStr += "(" + replacer(queryArray[i]);
					type += " CONCAT";
				} else if (type === "JOIN AS ON CONCAT" || type === "LEFT JOIN AS ON CONCAT") {
					whereStr += queryArray[i];
					type += " FINISH";
				} else if (type === "JOIN AS ON CONCAT FINISH") {
					whereStr += replacer(queryArray[i]) + ")";
				} else if (type === "LEFT AS JOIN ON CONCAT FINISH") {
					whereStr += replacer(queryArray[i]) + "||1)";
					
				// Условия
				} else if (type === "WHERE") {
					if (qCheck !== -1) { whereStr += "&&"; }
					qCheck = -1;
						
					whereStr += replacer(queryArray[i]);
						
				// Группировка
				} else if (type === "GROUP BY") {
					group = replacer(queryArray[i]);
				
				// Сортировка
				} else if (type === "ORDER BY") {
					order = queryArray[i];
					
				// Лимиты
				} else if (type === "LIMIT") {
					if (limitFrom === null) {
						limitFrom = queryArray[i] - 1;
					} else {
						limitCount = queryArray[i] - 1;
					}
				} else if (type === "TOP") {
					limitCount = queryArray[i] - 1;
					if (limitCount === 0) { mult = false; }
					type = "SELECT";
				}
			}
		}
	}
	if (whereStr !== "return ") { where = new Function("$this", "i", "aLength", "$obj", "id", whereStr); }
		
	if (group !== null) {
		actionStr = "\
			var custObj = {};\
			if (!CSQL.tmp.result[" + group + "]) {\
				CSQL.tmp.result[" + group + "] = [];\
			}\
		";
		//
		for (i = fields.length; i--;) { actionStr += "$.extend(custObj," + replacer(fields[i]) + ");"; }
		actionStr += "CSQL.tmp.result[" + group + "].push(custObj);";
		actionStr += "return true;";
		action = new Function ("$this", "i", "aLength", "$obj", "id", actionStr);
			
		this.each(action, where, from, mult, limitCount, limitFrom);
		groupObj = CSQL.tmp.result;
	}
		
	if (select === true) {
		if (group !== null) {
			from = "tmp_table_" + Math.random() + "_group";
			this.push(from, groupObj);
		}
			
		result = {};
		actionStr = "\
			var custObj = {}, fn = $obj;\
			if (!CSQL.tmp.result[id]) {\
				CSQL.tmp.result[id] = [];\
			}\
			if ('" + fields[0].replace(/'/g, "\\'") + "' === '*') {\
				CSQL.tmp.result[id].push($this[i]);\
			}\
		";
		//
		if (fields[0] !== "*") {
			actionStr += "else {";
			for (i = fields.length; i--;) {
				if (fieldsName[i].search("\\*") === -1) {
					actionStr += "custObj['" + fieldsName[i] + "']=" + replacer(fields[i]) + ";";
				} else {
					actionStr += "$.extend(custObj," + replacer(fields[i]) + ");";
				}
			}
			actionStr += "} CSQL.tmp.result[id].push(custObj);";
		}
		actionStr += "return true;";
		action = new Function ("$this", "i", "aLength", "$obj", "id", actionStr);

		this.each(action, group !== null ? where : false, from, mult, limitCount, limitFrom);
			
		result = mult === true ? CSQL.tmp.result[from] || [] : CSQL.tmp.result[from][0];
		CSQL.tmp.result = {};
			
		if (order) { result.sort($.collection.cache.sort.sortBy(order, rev, null)); }
		
		if (group !== null) { this.delete(from); }
			
		return result;
	} else if (update === true) {
		actionStr = "var fn = $obj;";
		for (i = fields.length; i--;) {
			actionStr += replacer(fieldsName[i]) + "=" + fields[i] + ";";
		}
		actionStr += "return true;";
		action = new Function ("$this", "i", "aLength", "$obj", "id", actionStr);

		this.each(action, where, from, mult, limitCount, limitFrom);
			
		result = CSQL.tmp.result[from] || [];
		CSQL.tmp.result = {};
			
		if (order) { this.OrderBy(order, rev, false, from); }
	} else if (del === true) {
		this.deleteElements(where, from, mult, limitCount, limitFrom);
	}
		
	return this;
};