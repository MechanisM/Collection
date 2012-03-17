	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	Collection = function (collection, prop) {
		collection = collection || null;
		prop = prop || '';
		
		// create factory function if need
		if (!this || (!this.name || this.name !== 'Collection')) { return new Collection(collection, prop); }
		
		// mixin public fields
		Collection.extend(true, this, Collection.fields);
		
		var active = this.dObj.active;
		
		// extend public fields by additional properties if need
		if (prop) { Collection.extend(true, active, prop); }
		
		// compile (if need)
		if (this._exprTest(active.filter)) { active.filter = this._compileFilter(active.filter); }
		if (this._exprTest(active.parser)) { active.parser = this._compileParser(active.parser); }
		
		// search the DOM
		if (Collection.isString(active.target)) { active.target = this.drivers.dom.find(active.target); }
		if (Collection.isString(active.pager)) { active.pager = this.drivers.dom.find(active.pager); }
		
		active.collection = collection;
	};