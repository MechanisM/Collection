	
	/////////////////////////////////
	//// prototype
	/////////////////////////////////
	
	Collection.prototype = {
		/**
		 * framework name
		 * 
		 * @constant
		 * @type String
		 */
		name: 'Collection',
		/**
		 * framework version
		 * 
		 * @constant
		 * @type String
		 */
		version: '3.7',
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Object}
		 * @return {String}
		 */
		collection: function () { return this.name + ' ' + this.version; },
		
		// const
		ACTIVE: 'active',
		SHUFFLE: 'shuffle',
		NAMESPACE_SEPARATOR: '.',
		SPLITTER: '>>>',
		SHORT_SPLITTER: '>>',
		PLUS: '+',
		
		/**
		 * stack parameters
		 * 
		 * @private
		 * @field
		 * @type Array
		*/
		stack: [
			'namespace',
			
			'collection',
			'filter',
			'context',
			'cache',
			'variable',
			'defer',
	
			'page',
			'parser',
			
			'toHTML',
			
			'target',
			'calculator',
			'pager',
			
			'template',
			
			'breaker',
			'navBreaker',
			
			'resultNull'
		]
	};