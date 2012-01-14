	
	/////////////////////////////////
	//// local storage
	/////////////////////////////////
	
	/**
	 * collection length (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Collection} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {String|Collection} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.prototype.save = function (id, local) {
		if (!localStorage) { throw new Error("your browser does't support web storage!"); }
		//
		local = local === false ? local : true;
		id = id || this.ACTIVE;
		//
		if (local === false) {
			sessionStorage.setItem("__" + this.name + ":" + id, this.toString(id));
		} else { localStorage.setItem("__" + this.name + ":" + id, this.toString(id)); }
		
		return this;
	};
	/**
	 * collection length (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Collection} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {String|Collection} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.prototype.load = function (id, local) {
		if (!localStorage) { throw new Error("your browser does't support web storage!"); }
		//
		local = local === false ? local : true;
		id = id || this.ACTIVE;
		//
		if (local === false) {
			if (id === this.ACTIVE) {
				this._new("collection", sessionStorage.getItem("__" + this.name + ":" + id));
			} else { this._push("collection", id, $.parseJSON(sessionStorage.getItem("__" + this.name + ":" + id))); }
		} else {
			if (id === this.ACTIVE) {
				this._new("collection", $.parseJSON(localStorage.getItem("__" + this.name + ":" + id)));
			} else { this._push("collection", id, $.parseJSON(localStorage.getItem("__" + this.name + ":" + id))); }
		}
		
		return this;
	};
	/**
	 * collection length (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Collection} [filter=this.ACTIVE] - filter function, string expressions or "false"
	 * @param {String|Collection} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.prototype.drop = function (id, local) {
		if (!localStorage) { throw new Error("your browser does't support web storage!"); }
		//
		local = local === false ? local : true;
		id = id || this.ACTIVE;
		//
		if (local === false) {
			sessionStorage.removeItem("__" + this.name + ":" + id);
		} else { localStorage.removeItem("__" + this.name + ":" + id); }
		
		return this;
	};