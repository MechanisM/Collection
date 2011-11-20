	
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
		version: "4.0",
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
		"Collection",
		"Filter",
		"Context",
		"Cache",
		"Index",
		"Map",
		"Var",
		"Defer",
		
		"Page",
		"Parser",
		"AppendType",
		"Target",
		"SelectorOut",
		"Pager",
		"Template",
		"TemplateModel",
		"NumberBreak",
		"PageBreak",
		"ResultNull"
		],
		
		//////
		
		/**
		 * return active context
		 * 
		 * @this {Collection Object}
		 * @return {String}
		 */
		getActiveContext: function () {
			return this.config.flags.use.ac === true ? this.dObj.prop.context.toString() : "";
		},
		/**
		 * return links to callback function
		 * 
		 * @this {Collection Object}
		 * @param {String} [type='filter']
		 * @return {Link}
		 */
		callee: function (type) {
			type = type || "filter";
			
			return this.dObj.sys.callee[type];
		},
		
		apExtend: function (param, active) {
			var key, newKey;
			
			for (key in active) {
				if (active.hasOwnProperty(key)) {
					newKey = key.substring(7);
					console.log(newKey);
				}
			}
		}
	};