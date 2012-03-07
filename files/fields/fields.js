	
	/////////////////////////////////
	//// public fields (active)
	/////////////////////////////////
	
	C.fields = {
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
				namespace: "nm",
				
				/**
				 * collection
				 * 
				 * @field
				 * @type C|Null
				 */
				collection: null,
				/**
				 * filter ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				filter: false,
				/**
				 * context
				 * 
				 * @field
				 * @type Context
				 */
				context: "",
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
				 * @type jQuery Deferred
				 */
				defer: "",
				
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
				 * parser ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				parser: false,
				/**
				 * DOM insert mode (jQuery methods)
				 * 
				 * @field
				 * @param String
				 */
				appendType: "html",
				/**
				 * target (target to insert the result templating)
				 * 
				 * @field
				 * @type jQuery Object
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
				 * @type jQuery Object
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
				numberBreak: null,
				/**
				 * the number of pages in the navigation menu
				 * 
				 * @field
				 * @type Number
				 */
				pageBreak: 10,
				/**
				 * empty result (in case if the search nothing is returned)
				 * 
				 * @field
				 * @type String
				 */
				resultNull: ""
			}
		}
	};