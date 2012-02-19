	
	/////////////////////////////////
	//// prototype
	/////////////////////////////////
	
	$.Collection.prototype = {
		/**
		 * <i lang="en">framework name</i>
		 * <i lang="ru">название фреймворка</i>
		 * 
		 * @constant
		 * @type String
		 */
		name: "$.Collection",
		/**
		 * <i lang="en">framework version</i>
		 * <i lang="ru">версия фреймворка</i>
		 * 
		 * @constant
		 * @type String
		 */
		version: "3.5",
		/**
		 * <i lang="en">return string: framework name + framework version</i>
		 * <i lang="ru">вернуть строку: название фреймворка + версия</i>
		 *
		 * @this {Collection Prototype}
		 * @return {String}
		 */
		collection: function () { return this.name + " " + this.version; },
		
		// const
		ACTIVE: "active",
		SHUFFLE: "shuffle",
		NAMESPACE_SEPARATOR: ".",
		
		/**
		 * stack parameters
		 * 
		 * @private
		 * @field
		 * @type Array
		*/
		stack: [
		"namespace",
		
		"collection",
		"filter",
		"context",
		"cache",
		"variable",
		"defer",

		"page",
		"parser",
		"appendType",
		"target",
		"calculator",
		"pager",
		"template",
		"numberBreak",
		"pageBreak",
		"resultNull"
		]
	};