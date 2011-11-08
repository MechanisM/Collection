	
	/////////////////////////////////
	//// public fields (prop)
	/////////////////////////////////
	
	$.Collection.storage = {
		// root
		dObj: {
			// active fields
			prop: {
				/////////////////////////////////
				//// data
				/////////////////////////////////
				
				/**
				 * active collection
				 * 
				 * @field
				 * @type Collection|Null
				 */
				activeCollection: null,
				/**
				 * active filter ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				activeFilter: false,
				/**
				 * active context
				 * 
				 * @field
				 * @type Context
				 */
				activeContext: "",
				/**
				 * active cache object
				 * 
				 * @field
				 * @type Plain Object
				 */
				activeCache: {
					/**
					 * auto cache
					 * 
					 * @field
					 * @type Boolean
					 */
					autoIteration: false,
					/**
					 * use cache
					 * 
					 * @field
					 * @type Boolean
					 */
					iteration: false,
					/**
					 * first iteration
					 * 
					 * @field
					 * @type Number
					 */
					firstIteration: -1,
					/**
					 * last iteration
					 * 
					 * @field
					 * @type Number
					 */
					lastIteration: -1
				},
				/**
				 * active index
				 * 
				 * @field
				 * @type Plain Object
				 */
				activeIndex: null,
				/**
				 * active map
				 * 
				 * @field
				 * @type Plain Object
				 */
				activeMap: null,
				/**
				 * active var
				 * 
				 * @field
				 * @type mixed
				 */
				activeVar: null,
				/**
				 * active deferred
				 * 
				 * @field
				 * @type jQuery Deferred
				 */
				activeDefer: "",
				
				/////////////////////////////////
				//// templating
				/////////////////////////////////
				
				/**
				 * active page (used in "extPrint")
				 * 
				 * @field
				 * @type Number
				 */
				activePage: 1,
				/**
				 * active parser ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				activeParser: false,
				/**
				 * active DOM insert mode (jQuery methods)
				 * 
				 * @field
				 * @param String
				 */
				activeAppendType: "html",
				/**
				 * active target (target to insert the result templating)
				 * 
				 * @field
				 * @type jQuery Object
				 */
				activeTarget: null,
				/**
				 * active selector (used to calculate the number of records one page)
				 * 
				 * @field
				 * @type Selector
				 */
				activeSelectorOut: ".SelectorOut",
				/**
				 * active pager
				 * 
				 * @field
				 * @type Selector
				 */
				activePager: "#PageControl",
				/**
				 * active template
				 * 
				 * @field
				 * @type Function
				 */
				activeTemplate: null,
				/**
				 * active template mode
				 * 
				 * @field
				 * @type Function
				 */
				activeTemplateMode: $.Collection.static.templateMode.simpleMode,
				/**
				 * active records in one page
				 * 
				 * @field
				 * @type Number
				 */
				activeCountBreak: 10,
				/**
				 * active page count (used in "controlMode")
				 * 
				 * @field
				 * @type Number
				 */
				activePageBreak: 10,
				/**
				 * active empty result ("false" if disabled)
				 * 
				 * @field
				 * @type String|Boolean
				 */
				activeResultNull: false
			}
		}
	};