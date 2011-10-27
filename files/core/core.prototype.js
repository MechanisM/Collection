	
	$.Collection.fn = $.Collection.prototype = {
		/**
		 * Имя фреймворка
		 * 
		 * @constant
		 * @type String
		 */
		name: "$.Collection",
		/**
		 * Версия фреймворка
		 * 
		 * @constant
		 * @type String
		 */
		version: "3.1",
		/**
		 * Вернуть строку формата: имя фреймворка + версия
		 *
		 * @return {String}
		 */
		collection: function () {
			return this.name + " " + this.version;
		},
		/**
		 * Активная константа
		 * 
		 * @constant
		 * @type String
		 */
		active: "active",
		/**
		 * Вернуть ссылку на объект
		 * 
		 * @this {Collection Object}
		 * @param {String} [type='filter']
		 * @throw {Error}
		 * @return {Function}
		 */
		callee: function (type) {
			type = type || "filter";
			
			return this.dObj.sys[type + "Callee"];
		}
	};