	
	/////////////////////////////////
	//// public fields (system)
	/////////////////////////////////
	
	C.fields.dObj.sys = {
		// the state of the system flags
		flags: {
			// the use of the active system flags
			use: {
				/**
				 * use active context in methods
				 * 
				 * @private
				 * @field
				 * @type Boolean
				 */
				context: true,
				/**
				 * use active filter in methods
				 * 
				 * @private
				 * @field
				 * @type Boolean
				 */
				filter: true,
				/**
				 * use active parser in methods
				 * 
				 * @private
				 * @field
				 * @type Boolean
				 */
				parser: true,
				
				/**
				 * use cache
				 * 
				 * @private
				 * @field
				 * @type Boolean
				 */
				cache: false
			}
		}
	};
	
	// generate system fields
	(function (data) {
		var
			upperCase,
			sys = C.fields.dObj.sys;
		
		data.forEach(function (el) {
			upperCase = C.toUpperCase(el, 1);
			
			sys["active" + upperCase + "ID"] = null;
			sys["tmp" + upperCase] = {};
			sys[el + "ChangeControl"] = null;
			sys[el + "Back"] = [];
		});
	})(C.prototype.stack);