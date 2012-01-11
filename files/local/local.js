
	$.Collection.fn.save = function (id, local) {
		if (!localStorage) { throw new Error("your browser does't support web storage!"); }
		if (!JSON) { throw new Error("object JSON is not defined!"); }
		
		local = local === false ? false : true;
		id = id || this.ACTIVE;
		
		if (local === false) {
			sessionStorage.setItem("__collection" + id, this.toString(id));
		} else { localStorage.setItem("__collection" + id, this.toString(id)); }
		
		return this;
	};
	
	$.Collection.fn.load = function (id, local) {
		if (!localStorage) { throw new Error("your browser does't support web storage!"); }
		
		local = local === false ? false : true;
		id = id || this.ACTIVE;

		if (local === false) {
			if (id === this.ACTIVE) {
				this._new("collection", sessionStorage.getItem("__collection" + id));
			} else { this._push("collection", id, $.parseJSON(sessionStorage.getItem("__collection" + id))); }
		} else {
			if (id === this.ACTIVE) {
				this._new("collection", $.parseJSON(localStorage.getItem("__collection" + id)));
			} else { this._push("collection", id, $.parseJSON(localStorage.getItem("__collection" + id))); }
		}
		
		return this;
	};
	
	$.Collection.fn.drop = function (id, local) {
		if (!localStorage) { throw new Error("your browser does't support web storage!"); }
		
		local = local === false ? false : true;
		id = id || this.ACTIVE;
		
		if (local === false) {
			sessionStorage.removeItem("__collection" + id);
		} else { localStorage.removeItem("__collection" + id); }
		
		return this;
	};