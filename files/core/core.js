	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	/**
	 * @constructor
	 * @this {Colletion Object}
	 * @param {Collection|Selector} [collection=null] - collection or selector for field "target"
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.active] - additional properties
	 */
	$.Collection = function (collection, prop) {
		collection = collection || null;
		prop = prop || null;
		
		// create "factory" function if need
		if (this.fn && (!this.fn.name || this.fn.name !== "$.Collection")) { return new $.Collection(collection, prop); }
		
		// mixin public fields
		$.extend(true, this, $.Collection.storage);
		var active = this.dObj.active;
		
		// extend public fields by additional properties if need
		if (prop) { $.extend(true, active, prop); }
		
		// if "collection" is string
		if ($.isString(collection)) {
			active.target = $(collection);
			active.collection = null;
		} else { active.collection = collection; }
	};