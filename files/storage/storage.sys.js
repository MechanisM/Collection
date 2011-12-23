	
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
				ac: true
			}
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