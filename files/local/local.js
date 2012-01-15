	
	/////////////////////////////////
	//// local storage
	/////////////////////////////////
	
	/**
	 * save collection in DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.save = function (id, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		local = local === false ? local : true;
		id = id || this.ACTIVE;
		var
			active = id === this.ACTIVE ? this._exist("collection") ? this._getActiveID("collection") : "" : this._isActive("collection", id) ? "active" : "",
			storage = local === false ? sessionStorage : localStorage;
		//
		storage.setItem("__" + this.name + ":" + id, this.toString(id));
		storage.setItem("__" + this.name + "__date:" + id, new Date().toString());
		storage.setItem("__" + this.name + "__active:" + id, active);
		
		return this;
	};
	/**
	 * save all collection in DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.saveAll = function (local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		local = local === false ? local : true;
		//
		var key, tmp = this.dObj.sys.tmpCollection;
		for (key in tmp) {
			if (tmp.hasOwnProperty(key)) { this.save(key, local); }
		}
		this.save("", local);
		
		return this;
	};
	
	/**
	 * load collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [local=true] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.load = function (id, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		local = local === false ? local : true;
		id = id || this.ACTIVE;
		var active, storage = local === false ? sessionStorage : localStorage;
		//
		if (id === this.ACTIVE) {
			this._new("collection", $.parseJSON(storage.getItem("__" + this.name + ":" + id)));
		} else { this._push("collection", id, $.parseJSON(storage.getItem("__" + this.name + ":" + id))); }
		//
		active = storage.getItem("__" + this.name + "__active:" + id);
		if (active === this.ACTIVE) {
			this._set("collection", id);
		} else if (active) {
			this
				._push("collection", active, this._get("collection"))
				._set("collection", active);
		}
		
		return this;
	};
	/**
	 * load all collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.loadAll = function (local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		local = local === false ? local : true;
		var i = localStorage.length, id;
		while ((i -= 1) > -1) {
			if ((id = localStorage[i].split(":"))[0] === "__" + this.name) { this.load(id[1], i); }
		}
		
		return this;
	};
	/**
	 * get the time of the conservation of collections
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Date}
	 */
	$.Collection.prototype.loadDate = function (id, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		local = local === false ? local : true;
		id = id || this.ACTIVE;
		//
		var storage = local === false ? sessionStorage : localStorage;
		//
		return new Date(storage.getItem("__" + this.name + "__date:" + id));
	};
	
	/**
	 * remove collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.drop = function (id, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		local = local === false ? local : true;
		id = id || this.ACTIVE;
		//
		var storage = local === false ? sessionStorage : localStorage;
		//
		storage.removeItem("__" + this.name + ":" + id);
		storage.removeItem("__" + this.name + "__date:" + id);
		storage.removeItem("__" + this.name + "__active:" + id);
		
		return this;
	};