	
	/////////////////////////////////
	//// public fields (system)
	/////////////////////////////////
	
	$.Collection.storage.dObj.sys = {
		flags: {
			use: {
				/**
				 * use active context in methods
				 * 
				 * @field
				 * @type Boolean
				 */
				context: true,
				/**
				 * use active filter in methods
				 * 
				 * @field
				 * @type Boolean
				 */
				filter: true,
				/**
				 * use active parser in methods
				 * 
				 * @field
				 * @type Boolean
				 */
				parser: true
			}
		}
	};
	// generate system fields
	(function (data) {
		var
			upperCase,
			sys = $.Collection.storage.dObj.sys;
		//
		data.forEach(function (el) {
			upperCase = $.toUpperCase(el, 1);
			
			sys["active" + upperCase + "ID"] = null;
			sys["tmp" + upperCase] = {};
			sys[el + "ChangeControl"] = null;
			sys[el + "Back"] = [];
		});
	})($.Collection.prototype.stack);