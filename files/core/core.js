	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	/**
	 * @constructor
	 * @this {Colletion Object}
	 * @param {Collection|Selector} [collection=null] - collection or selector for field: activeTarget
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.prop] - user's preferences
	 */
	$.Collection = function (collection, uProp) {
		collection = collection || null;
		uProp = uProp || null;
		
		// create "factory" function if need
		if (this.fn && this.fn.name && this.fn.name !== "$.Collection") { return new $.Collection(collection, uProp); }
		
		// mixin public fields
		$.extend(true, this, $.Collection.storage);
			
		var prop = this.dObj.prop;
				
		// extend public fields by user's preferences if need
		if (uProp) { $.extend(true, prop, uProp); }
				
		// if "collection" is string
		if ($.isString(collection)) {
			prop.activeTarget = $(collection);
			prop.activeCollection = null;
		} else { prop.activeCollection = collection; }
	};