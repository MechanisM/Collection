	
	/////////////////////////////////
	//// prototype
	/////////////////////////////////
	
	C.prototype = {
		/**
		 * framework name
		 * 
		 * @constant
		 * @type String
		 */
		name: "C",
		/**
		 * framework version
		 * 
		 * @constant
		 * @type String
		 */
		version: "3.5.5",
		/**
		 * return string: framework name + framework version
		 *
		 * @this {C Prototype}
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