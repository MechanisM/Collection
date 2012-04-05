	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	Collection = function (collection, prop) {
		collection = collection || null;
		prop = prop || '';
		var C = Collection;
		
		// create factory function if need
		if (!this || (!this.name || this.name !== 'Collection')) { return new C(collection, prop); }
		
		// mixin public fields
		C.extend(true, this, C.fields);
		
		var active = this.dObj.active,
			dom = C.drivers.dom;
		
		// extend public fields by additional properties if need
		if (prop) { C.extend(true, active, prop); }
		
		// compile (if need)
		if (this._isStringExpression(active.filter)) { active.filter = this._compileFilter(active.filter); }
		if (this._isStringExpression(active.parser)) { active.parser = this._compileParser(active.parser); }
		
		// search the DOM
		if (C.isString(active.target)) { active.target = dom.find(active.target); }
		if (C.isString(active.pager)) { active.pager = dom.find(active.pager); }
		
		active.collection = collection;
	};
	C = Collection;