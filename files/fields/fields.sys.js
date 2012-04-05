	
	/////////////////////////////////
	//// public fields (system)
	/////////////////////////////////
	
	Collection.fields.dObj.sys = {
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
	Collection.prototype.stack.forEach(function (el) {
		var key, upperCase;
		for (key in el) {
			if (!el.hasOwnProperty(key)) { continue; }
			
			upperCase = C.toUpperCase(key, 1);
			
			// default value
			el[key] = active[key];
			
			// system
			sys["active" + upperCase + "ID"] = null;
			sys["tmp" + upperCase] = {};
			sys[key + "ChangeControl"] = null;
			sys[key + "Back"] = [];
		}
	});