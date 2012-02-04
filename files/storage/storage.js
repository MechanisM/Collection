	
	/////////////////////////////////
	//// public fields (active)
	/////////////////////////////////
	
	$.Collection.storage = {
		// root
		dObj: {
			// active fields
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
				 * active collection
				 * 
				 * @field
				 * @type Collection|Null
				 */
				collection: null,
				/**
				 * active filter ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				filter: false,
				/**
				 * active context
				 * 
				 * @field
				 * @type Context
				 */
				context: "",
				/**
				 * active cache object
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
				 * active var
				 * 
				 * @field
				 * @type mixed
				 */
				variable: null,
				/**
				 * active deferred
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
				 * active parser ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				parser: false,
				/**
				 * active DOM insert mode (jQuery methods)
				 * 
				 * @field
				 * @param String
				 */
				appendType: "html",
				/**
				 * active target (target to insert the result templating)
				 * 
				 * @field
				 * @type jQuery Object
				 */
				target: null,
				/**
				 * active selector (used to calculate the number of records per page)
				 * 
				 * @field
				 * @type Selector
				 */
				calculator: ".line",
				/**
				 * active pager
				 * 
				 * @field
				 * @type Selector
				 */
				pager: "#pageControl",
				/**
				 * active template
				 * 
				 * @field
				 * @type Function
				 */
				template: null,
				/**
				 * active records in one page
				 * 
				 * @field
				 * @type Number
				 */
				numberBreak: 10,
				/**
				 * active page count (used in "controlMode")
				 * 
				 * @field
				 * @type Number
				 */
				pageBreak: 10,
				/**
				 * active empty result
				 * 
				 * @field
				 * @type String
				 */
				resultNull: ""
			}
		}
	};