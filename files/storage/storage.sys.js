	
	/////////////////////////////////
	//// public fields (system)
	/////////////////////////////////
	
	$.Collection.storage.dObj.sys = {
		/**
		 * "callee" object
		 * 
		 * @field
		 * @type Object
		 */
		callee: { 
			callback: null,
			filter: null,
			parser: null,
			template: null,
			templateModel: null
		}
	};
	
	// generate system fields
	(function (data) {
		var
			i,
			upperCase,
			sys = $.Collection.storage.dObj.sys;
	
		for (i = data.length; i--;) {
			upperCase = $.toUpperCase(data[i], 1);
			
			sys["active" + upperCase + "ID"] = null;
			sys["tmp" + upperCase] = {};
			sys[data[i] + "ChangeControl"] = null;
			sys[data[i] + "Back"] = [];
		}
	})($.Collection.fn.stack);