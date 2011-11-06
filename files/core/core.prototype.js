	
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
		version: "4.0",
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
		 * @field
		 * @type String
		 */
		active: "active",
		
		
		/**
		 * Использование активного контекста
		 * 
		 * @field
		 * @type Boolean
		 */
		useActiveContext: true,
		/**
		 * Вернуть активный контекст
		 * 
		 * @this {Collection Object}
		 * @return {String}
		 */
		getActiveContext: function () {
			return this.useActiveContext === true ? this.dObj.prop.activeContext.toString() : "";
		},
		
		
		/**
		 * Вернуть ссылку на объект
		 * 
		 * @this {Collection Object}
		 * @param {String} [type='filter']
		 * @return {Link}
		 */
		callee: function (type) {
			type = type || "filter";
			
			return this.dObj.sys[type + "Callee"];
		}
	};