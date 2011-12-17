	
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
		version: "3.2",
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Prototype}
		 * @return {String}
		 */
		collection: function () {
			return this.name + " " + this.version;
		},
		
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
				methodSeparator: "::"
			},
			flags: {
				use: {
					/**
					 * use active context in methods
					 * 
					 * @field
					 * @type Boolean
					 */
					ac: true
				}
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
			return this.config.flags.use.ac === true ? this.dObj.active.context.toString() : "";
		},
		
		/**
		 * enable property
		 * 
		 * @this {Collection Object}
		 * @param {String} name - property name
		 * @return {Collection Object}
		 */
		enable: function (name) {
			this.config.flags.use[name] = true;
			
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
			this.config.flags.use[name] = false;
		
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
			if (this.config.flags.use[name] === true) {
				return this.disable(name);
			}
			return this.enable(name);
		},
		
		/**
		 * return links to callback function
		 * 
		 * @this {Collection Object}
		 * @param {String} [type='filter'] - type
		 * @return {Link}
		 */
		callee: function (type) {
			type = type || "filter";
			
			return this.dObj.sys.callee[type];
		}
	};