	
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
	};