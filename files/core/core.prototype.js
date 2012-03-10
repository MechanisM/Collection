	
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
		name: 'Collection',
		/**
		 * framework version
		 * 
		 * @constant
		 * @type String
		 */
		version: '3.6',
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
			'appendType',
			'target',
			'calculator',
			'pager',
			'template',
			'numberBreak',
			'pageBreak',
			'resultNull'
		],
		
		// drivers for additional functions
		drivers: {
			dom: {
				/** @private */
				find: function (selector, context) {
					for (var key in this.engines) {
						if (!this.engines.hasOwnProperty(key)) { continue; }
						
						if (this.engines[key].is()) { return this.engines[key].find(selector || '', context || ''); }
					}
					
					// throw an exception, if not found exploratory framework
					throw new Error('is not set exploratory framework for DOM');
				},
				
				// search frameworks
				engines: {
					// qsa css selector engine
					qsa: {
						/** @private */
						is: function () {
							if (typeof qsa !== 'undefined') { return true; }
						},
						/** @private */
						find: function (selector, context) {
							return qsa.querySelectorAll(selector, context);
						}
					},
					// sizzle 
					sizzle: {
						/** @private */
						is: function () {
							if (typeof jQuery !== 'undefined' || typeof Sizzle !== 'undefined') { return true; }
						},
						/** @private */
						find: function (selector, context) {
							return jQuery ? jQuery(selector, context) : Sizzle(selector, context);
						}
					}
				}
			}
		}
	};