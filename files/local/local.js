	
	/////////////////////////////////
	//// local storage
	/////////////////////////////////
	
	/**
	 * save collection in the DOM storage<br/>
	 * events: onSave
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 7, 0]);
	 * db.save();
	 */
	C.prototype.save = function (id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id || this.ACTIVE;
		var
			name = '__' + this.name + '__' + this._get('namespace'),
			
			active = id === this.ACTIVE ? this._exists('collection') ? this._getActiveID('collection') : '' : this._active('collection', id) ? 'active' : '',
			storage = local === false ? sessionStorage : localStorage,
			e = null;
		
		// events
		this.onSave && (e = this.onSave.apply(this, arguments));
		if (e === false) { return this; }
		
		storage.setItem(name + ':' + id, this.toString(id));
		storage.setItem(name + '__date:' + id, new Date().toString());
		storage.setItem(name + '__active:' + id, active);
		
		storage.setItem(name + '__date', new Date().toString());
		
		return this;
	};
	/**
	 * save all collections in the DOM storage<br/>
	 * events: onSave
	 * 
	 * @this {Colletion Object}
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C([1, 2, 3, 4, 5, 6, 7, 0]).pushCollection('test', [1, 2, 3]);
	 * db.saveAll();
	 */
	C.prototype.saveAll = function (local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		local = local === false ? local : true;
		var
			key,
			tmp = this.dObj.sys.tmpCollection,
			active = false;
		
		for (key in tmp) {
			this._active('C', key) && (active = true);
			if (tmp.hasOwnProperty(key)) { this.save(key, local); }
		}
		active === false && this.save('', local);
		
		return this;
	};
	
	/**
	 * load collection from the DOM storage<br/>
	 * events: onLoad
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {String} [local=true] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C().load();
	 */
	C.prototype.load = function (id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id || this.ACTIVE;
		var
			name = '__' + this.name + '__' + this._get('namespace'),
			
			active,
			storage = local === false ? sessionStorage : localStorage,
			e = null;
		
		// events
		this.onLoad && (e = this.onLoad.apply(this, arguments));
		if (e === false) { return this; }
		
		if (id === this.ACTIVE) {
			this._new('collection', JSON.parse(storage.getItem(name + ':' + id)));
		} else { this._push('collection', id, JSON.parse(storage.getItem(name + ':' + id))); }
		
		active = storage.getItem(name + '__active:' + id);
		if (active === this.ACTIVE) {
			this._set('collection', id);
		} else if (active) {
			this
				._push('collection', active, this._get('collection'))
				._set('collection', active);
		}
		
		return this;
	};
	/**
	 * load all collections from the DOM storage<br/>
	 * events: onLoad
	 * 
	 * @this {Colletion Object}
	 * @param {String} [local] — if false, used session storage
	 * @param {String} [type='load'] — operation type
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C().loadAll();
	 */
	C.prototype.loadAll = function (local, type) {
		type = type ? 'drop' : 'load';
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		local = local === false ? local : true;
		var
			name = '__' + this.name + '__' + this._get('namespace'),
			
			storage = local === false ? sessionStorage : localStorage,
			sLength = storage.length,
			key, id;
		
		// bug fix
		try {
			for (key in storage) {
				if (storage.hasOwnProperty(key)) {
					if ((id = key.split(':'))[0] === name) { this[type](id[1], local); }
				}
			}
		} catch (e) {
			while ((sLength -= 1) > -1) {
				if ((id = storage[sLength].split(':'))[0] === name) { this[type](id[1], local); }
			}
		}
		
		return this;
	};
	/**
	 * get the time of the conservation of collections
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id] — collection ID
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Date}
	 *
	 * @example
	 * var db = new $C();
	 * db.loadDate();
	 */
	C.prototype.loadDate = function (id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id ? ':' + id : '';
		var storage = local === false ? sessionStorage : localStorage;
		
		return new Date(storage.getItem('__' + this.name + '__' + this._get('namespace') + '__date' + id));
	};
	/**
	 * checking the life of the collection
	 * 
	 * @this {Colletion Object}
	 * @param {Number} time — milliseconds
	 * @param {String} [id] — collection ID
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Boolean}
	 *
	 * @example
	 * var db = new $C();
	 * db.isExpired();
	 */
	C.prototype.isExpired = function (time, id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		return new Date(new Date() - new Date(this.loadDate(id || '', local || ''))) > time;
	};
	
	/**
	 * remove collection from the DOM storage<br/>
	 * events: onDrop
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] — collection ID
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.drop('test');
	 */
	C.prototype.drop = function (id, local) {
		if (!localStorage) { throw new Error('your browser doesn\'t support web storage!'); }
		
		id = id || this.ACTIVE;
		var
			name = '__' + this.name + '__' + this._get('namespace'),
			storage = local === false ? sessionStorage : localStorage,
			e = null;
		
		// events
		this.onDrop && (e = this.onDrop.apply(this, arguments));
		if (e === false) { return this; }
		
		
		storage.removeItem(name + ':' + id);
		storage.removeItem(name + '__date:' + id);
		storage.removeItem(name + '__active:' + id);
		
		return this;
	};
	/**
	 * remove all collections from the DOM storage<br/>
	 * events: onDrop
	 * 
	 * @this {Colletion Object}
	 * @param {String} [local] — if false, used session storage
	 * @throw {Error}
	 * @return {Colletion Object}
	 *
	 * @example
	 * var db = new $C();
	 * db.dropAll();
	 */
	C.prototype.dropAll = function (local) {
		(local === false ? sessionStorage : localStorage).removeItem( '__' + this.name + '__' + this._get('namespace') + '__date');
		return this.loadAll(local || '', true);
	};