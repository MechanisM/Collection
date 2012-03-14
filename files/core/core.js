	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	/**
	 * Collection
	 * 
	 * @namespace
	 */
	C = function (collection, prop) {
		collection = collection || null;
		prop = prop || '';
		
		// create factory function if need
		if (!this || (!this.name || this.name !== 'Collection')) { return new C(collection, prop); }
		
		// mixin public fields
		C.extend(true, this, C.fields);
		var active = this.dObj.active;
		
		// extend public fields by additional properties if need
		if (prop) { C.extend(true, active, prop); }
		
		// compile (if need)
		if (this._exprTest(active.filter)) { active.filter = this._compileFilter(active.filter); }
		if (this._exprTest(active.parser)) { active.parser = this._compileParser(active.parser); }
		
		// search the DOM
		if (C.isString(active.target)) { active.target = this.drivers.dom.find(active.target); }
		if (C.isString(active.pager)) { active.pager = this.drivers.dom.find(active.pager); }
		
		active.collection = collection;
	};