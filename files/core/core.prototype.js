	
	/////////////////////////////////
	//// prototype
	/////////////////////////////////
	
	$.Collection.fn = $.Collection.prototype = {
		/**
		 * framework name
		 * 
		 * @constant
		 * @type String
		 */
		name: "$.Collection",
		/**
		 * framework version
		 * 
		 * @constant
		 * @type String
		 */
		version: "3.3.2",
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Prototype}
		 * @return {String}
		 */
		collection: function () { return this.name + " " + this.version; },
		
		// const
		ACTIVE: "active",
		
		/**
		 * stack parameters
		 * 
		 * @field
		 * @type Array
		*/
		stack: [
		"collection",
		"filter",
		"context",
		"cache",
		"index",
		"map",
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
		],
		
		//////
		
		/**
		 * return active property
		 * 
		 * @this {Collection Object}
		 * @return {String}
		 */
		getActiveParam: function (name) {
			return this.dObj.sys.flags.use[name] === undefined || this.dObj.sys.flags.use[name] === true? this.dObj.active[name] : "";
		},
		
		/**
		 * enable property
		 * 
		 * @this {Collection Object}
		 * @param {String} name - property name
		 * @return {Collection Object}
		 */
		enable: function (name) {
			this.dObj.sys.flags.use[name] = true;
			
			return this;
		},
		/**
		 * disable property
		 * 
		 * @this {Collection Object}
		 * @param {String} name - property name
		 * @return {Collection Object}
		 */
		disable: function (name) {
			this.dObj.sys.flags.use[name] = false;
		
			return this;
		},
		/**
		 * toggle property
		 * 
		 * @this {Collection Object}
		 * @param {String} name - property name
		 * @return {Collection Object}
		 */
		toggle: function (name) {
			if (this.dObj.sys.flags.use[name] === true) { return this.disable(name); }
			
			return this.enable(name);
		}
	};