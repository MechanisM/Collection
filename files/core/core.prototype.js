	
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
		version: '3.7.1',
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Object}
		 * @return {String}
		 */
		collection: function () { return this.name + ' ' + this.version; },
		
		// const
		ACTIVE: 'active',
		DISABLED: 'disabled',
		NO_DATA: 'no-data',
		CTM_SIMPLE_TAG: 'span',
		CTM: 'ctm',
		TABLE_SIMPLE_TAG: 'div',
		TABLE_DEF_COUNT: 4,
		SHUFFLE: 'shuffle',
		NAMESPACE: '.',
		SPLITTER: '>>>',
		SHORT_SPLITTER: '>>',
		VARIABLE: ['<:', ':>'],
		WITH: '+',
		DEF: ':',
		DEF_REGEXP: /^\s*:/,
		FILTER_REGEXP: /&&|\|\||:|!/,
		
		/**
		 * stack parameters
		 * 
		 * @private
		 * @field
		 * @type Array
		*/
		stack: [
			{namespace: ''},
			
			{collection: ''},
			{filter: ''},
			{context: ''},
			{cache: ''},
			{variable: ''},
			{defer: ''},
			
			{page: ''},
			{parser: ''},
			
			{toHTML: ''},
			
			{target: ''},
			{calculator: ''},
			{pager: ''},
			
			{template: ''},
			
			{breaker: ''},
			{navBreaker: ''},
			
			{resultNull: ''}
		]
	};
	
	// private variables
	var fn = Collection.prototype;