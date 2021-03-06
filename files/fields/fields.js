	
	/////////////////////////////////
	//// public fields (active)
	/////////////////////////////////
	
	Collection.fields = {
		// root
		dObj: {
			/**
			 * active properties
			 * 
			 * @namespace
			 */
			active: {
				/////////////////////////////////
				//// data
				/////////////////////////////////
				
				/**
				 * namespace
				 * 
				 * @field
				 * @type String
				 */
				namespace: 'nm',
				
				/**
				 * collection
				 * 
				 * @field
				 * @type collection|Null
				 */
				collection: null,
				/**
				 * filter (false if disabled)
				 * 
				 * @field
				 * @type Filter|Boolean
				 */
				filter: false,
				/**
				 * context
				 * 
				 * @field
				 * @type Context
				 */
				context: '',
				
				/**
				 * cache object
				 * 
				 * @field
				 * @type Plain Object
				 */
				cache: {
					/**
					 * auto cache
					 * 
					 * @field
					 * @type Boolean
					 */
					autoIteration: true,
					/**
					 * use cache
					 * 
					 * @field
					 * @type Boolean
					 */
					iteration: true,
					/**
					 * first iteration
					 * 
					 * @field
					 * @type Number
					 */
					firstIteration: false,
					/**
					 * last iteration
					 * 
					 * @field
					 * @type Number
					 */
					lastIteration: false
				},
				
				/**
				 * temporary variables
				 * 
				 * @field
				 * @type mixed
				 */
				variable: null,
				
				/**
				 * deferred object
				 * 
				 * @field
				 * @type Deferred Object
				 */
				defer: '',
				
				/////////////////////////////////
				//// templating
				/////////////////////////////////
				
				/**
				 * active page
				 * 
				 * @field
				 * @type Number
				 */
				page: 1,
				/**
				 * parser (false if disabled)
				 * 
				 * @field
				 * @type Parser|Boolean
				 */
				parser: false,
				/**
				 * DOM insert mode ('replace', 'append', 'prepend', false (return string))
				 * 
				 * @field
				 * @param String|Boolean
				 */
				toHTML: 'replace',
				/**
				 * target (target to insert the result templating)
				 * 
				 * @field
				 * @type Selector|DOM nodes
				 */
				target: null,
				/**
				 * selector (used to calculate the number of records per page, by default, are all the children of the element)
				 * 
				 * @field
				 * @type Selector
				 */
				calculator: null,
				/**
				 * pager (an interface element to display the navigation through the pages of)
				 * 
				 * @field
				 * @type Selector|DOM nodes
				 */
				pager: null,
				/**
				 * template
				 * 
				 * @field
				 * @type Function
				 */
				template: null,
				/**
				 * the number of entries on one page
				 * 
				 * @field
				 * @type Number
				 */
				breaker: null,
				/**
				 * the number of pages in the navigation menu
				 * 
				 * @field
				 * @type Number
				 */
				navBreaker: 5,
				/**
				 * empty result (in case if the search nothing is returned)
				 * 
				 * @field
				 * @type String
				 */
				resultNull: ''
			}
		}
	};
	
	var active = C.fields.dObj.active;