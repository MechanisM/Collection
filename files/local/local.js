	
	/////////////////////////////////
	//// local storage
	/////////////////////////////////
	
	/**
	 * save collection in DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.save = function (id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		id = id || this.ACTIVE;
		namespace = namespace || "";
		//
		var
			name = "__" + this.name + "__" + this._get("namespace", namespace),
			//
			active = id === this.ACTIVE ? this._exists("collection") ? this._getActiveID("collection") : "" : this._isActive("collection", id) ? "active" : "",
			storage = local === false ? sessionStorage : localStorage;
		//
		storage.setItem(name + ":" + id, this.toString(id));
		storage.setItem(name + "__date:" + id, new Date().toString());
		storage.setItem(name + "__active:" + id, active);
		//
		storage.setItem(name + "__date", new Date().toString());
		
		return this;
	};
	/**
	 * save all collection in DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.saveAll = function (namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		namespace = namespace || "";
		local = local === false ? local : true;
		//
		var
			key,
			tmp = this.dObj.sys.tmpCollection,
			active = false;
		
		// clear storage
		this.dropAll(namespace, local);
		//
		for (key in tmp) {
			this._isActive("Collection", key) && (active = true);
			//
			if (tmp.hasOwnProperty(key)) { this.save(key, namespace, local); }
		}
		active === false && this.save("", namespace, local);
		
		return this;
	};
	
	/**
	 * load collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local=true] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.load = function (id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		id = id || this.ACTIVE;
		namespace = namespace || "";
		//
		var
			name = "__" + this.name + "__" + this._get("namespace", namespace),
			//
			active,
			storage = local === false ? sessionStorage : localStorage;
		//
		if (id === this.ACTIVE) {
			this._new("collection", $.parseJSON(storage.getItem(name + ":" + id)));
		} else { this._push("collection", id, $.parseJSON(storage.getItem(name + ":" + id))); }
		//
		active = storage.getItem(name + "__active:" + id);
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
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @param {String} [type="load"] - operation type
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.loadAll = function (namespace, local, type) {
		type = type ? "drop" : "load";
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		local = local === false ? local : true;
		namespace = namespace || "";
		//
		var
			name = "__" + this.name + "__" + this._get("namespace", namespace),
			//
			storage = local === false ? sessionStorage : localStorage,
			sLength = storage.length,
			key, id;
		//
		try {
			for (key in storage) {
				if (storage.hasOwnProperty(key)) {
					if ((id = key.split(":"))[0] === name) { this[type](id[1], namespace, local); }
				}
			}
		} catch (e) {
			while ((sLength -= 1) > -1) {
				if ((id = storage[sLength].split(":"))[0] === name) { this[type](id[1], namespace, local); }
			}
		}
		
		return this;
	};
	/**
	 * get the time of the conservation of collections
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Date}
	 */
	$.Collection.prototype.loadDate = function (id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		id = id ? ":" + id : "";
		namespace = namespace || "";
		//
		var storage = local === false ? sessionStorage : localStorage;
		//
		return new Date(storage.getItem("__" + this.name + "__" + this._get("namespace", namespace) + "__date" + id));
	};
	/**
	 * checking the life of the collection
	 * 
	 * @this {Colletion Object}
	 * @param {Number} time - milliseconds
	 * @param {String} [id] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Boolean}
	 */
	$.Collection.prototype.isExpires = function (time, id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		return new Date(new Date() - new Date(this.loadDate(id || "", namespace || "", local || ""))) > time;
	};
	
	/**
	 * remove collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.drop = function (id, namespace, local) {
		if (!localStorage) { throw new Error("your browser doesn't support web storage!"); }
		//
		id = id || this.ACTIVE;
		namespace = namespace || "";
		//
		var
			name = "__" + this.name + "__" + this._get("namespace", namespace),
			storage = local === false ? sessionStorage : localStorage;
		//
		storage.removeItem(name + ":" + id);
		storage.removeItem(name + "__date:" + id);
		storage.removeItem(name + "__active:" + id);
		
		return this;
	};
	/**
	 * remove all collection from DOM storage
	 * 
	 * @this {Colletion Object}
	 * @param {String} [namespace=this.ACTIVE] - namespace
	 * @param {String} [local] - if "false", used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.dropAll = function (namespace, local) {
		namespace = namespace || "";
		(local === false ? sessionStorage : localStorage).removeItem( "__" + this.name + "__" + this._get("namespace", namespace) + "__date");
		//
		return this.loadAll(namespace, local || "", true);
	};