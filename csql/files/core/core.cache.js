
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
					if (tablesName[$1]) {
						return "$obj.dObj.sys.tmpCollection['" + tablesName[$1] + "']";
					} else {
						return "console.log($obj.callee().param);";
					}
				});
			}
						
			return str.replace(".*", "");
		}
	};
