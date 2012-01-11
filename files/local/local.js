
	$.Collection.fn.save = function (id, local) {
		if (!localStorage) { throw new Error("your browser does't support web storage!"); }
		if (!JSON) { throw new Error("object JSON is not defined!"); }
		
		local = local === false ? false : true;
		id = id || this.ACTIVE;
		
		if (local === false) {
			sessionStorage.setItem("__" + this.name + id, this.toString(id));
		} else { localStorage.setItem("__" + this.name + id, this.toString(id)); }
		
		return this;
	};
	
	$.Collection.fn.load = function (id, local) {
		if (!localStorage) { throw new Error("your browser does't support web storage!"); }
		
		local = local === false ? false : true;
		id = id || this.ACTIVE;

		if (local === false) {
			if (id === this.ACTIVE) {
				this._new("collection", sessionStorage.getItem("__" + this.name + id));
			} else { this._push("collection", id, $.parseJSON(sessionStorage.getItem("__" + this.name + id))); }
		} else {
			if (id === this.ACTIVE) {
				this._new("collection", $.parseJSON(localStorage.getItem("__" + this.name + id)));
			} else { this._push("collection", id, $.parseJSON(localStorage.getItem("__" + this.name + id))); }
		}
		
		return this;
	};
	
	$.Collection.fn.drop = function (id, local) {
		if (!localStorage) { throw new Error("your browser does't support web storage!"); }
		
		local = local === false ? false : true;
		id = id || this.ACTIVE;
		
		if (local === false) {
			sessionStorage.removeItem("__" + this.name + id);
		} else { localStorage.removeItem("__" + this.name + id); }
		
		return this;
	};