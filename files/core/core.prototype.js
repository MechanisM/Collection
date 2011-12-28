	
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
		version: "3.2.5",
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Prototype}
		 * @return {String}
		 */
		collection: function () { return this.name + " " + this.version; },
		
		// framework config object
		config: {
			constants: {
				/**
				 * default "active" constant
				 * 
				 * @field
				 * @type String
				 */
				active: "active",
				
				/**
				 * default separator: context
				 * 
				 * @field
				 * @type String
				 */
				contextSeparator: "~",
				/**
				 * default separator: subcontext
				 * 
				 * @field
				 * @type String
				 */
				subcontextSeparator: "#",
				
				/**
				 * default separator: method
				 * 
				 * @field
				 * @type String
				 */
				methodSeparator: "::",
				
				/**
				 * default separator: event request
				 * 
				 * @field
				 * @type String
				 */
				querySeparator: "/",
				/**
				 * default separator: subevent request
				 * 
				 * @field
				 * @type String
				 */
				subquerySeparator: "{"
			}
		},
		
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
		"templateModel",
		"numberBreak",
		"pageBreak",
		"resultNull"
		],
		
		//////
		
		/**
		 * return active context
		 * 
		 * @this {Collection Object}
		 * @return {String}
		 */
		getActiveContext: function () {
			return this.dObj.sys.flags.use.ac === true ? this.dObj.active.context.toString() : "";
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
			if (this.dObj.sys.flags.use[name] === true) {
				return this.disable(name);
			}
			return this.enable(name);
		}
	};