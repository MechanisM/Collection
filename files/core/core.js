	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	C = function (collection, prop) {
		collection = collection || null;
		prop = prop || '';
		
		// create factory function if need
		if (!this || (this.fn && (!this.fn.name || this.fn.name !== 'Collection'))) { return new C(collection, prop); }
		
		// mixin public fields
		C.extend(true, this, C.fields);
		var active = this.dObj.active;
		
		// extend public fields by additional properties if need
		if (prop) { C.extend(true, active, prop); }
		
		// compile (if need)
		if (this._exprTest(active.filter)) { active.filter = this._compileFilter(active.filter); }
		if (this._exprTest(active.parser)) { active.parser = this._compileParser(active.parser); }
		
		active.collection = collection;
	};