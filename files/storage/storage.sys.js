	
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
			templateMode: null
		}
	};
	
	// generate system fields
	(function (data) {
		var
			i,
			lowerCase,
			sys = $.Collection.storage.dObj.sys;
	
		for (i = data.length; i--;) {
			lowerCase = data[i].substring(0, 1).toLowerCase() + data[i].substring(1);
			
			sys["active" + data[i] + "ID"] = null;
			sys["tmp" + data[i]] = {};
			sys[lowerCase + "ChangeControl"] = null;
			sys[lowerCase + "Back"] = [];
		}
	})($.Collection.fn.stack);