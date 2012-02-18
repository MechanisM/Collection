	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	$.Collection = function (collection, prop) {
		collection = collection || "";
		prop = prop || "";
		
		// create "factory" function if need
		if (this.fn && (!this.fn.name || this.fn.name !== "$.Collection")) { return new $.Collection(collection, prop); }
		
		// mixin public fields
		$.extend(true, this, $.Collection.storage);
		var active = this.dObj.active;
		
		// extend public fields by additional properties if need
		if (prop) { $.extend(true, active, prop); }
		
		// compile (if need)
		if ($.isString(active.filter) && active.filter.search(/^:/)) {
			active.filter = this._compileFilter(active.filter);
		}
		if ($.isString(active.parser) && active.parser.search(/^:/)) {
			active.parser = this._compileParser(active.parser);
		}
		
		// if "collection" is string
		if ($.isString(collection)) {
			active.target = $(collection);
			active.collection = null;
		} else { active.collection = collection; }
	};