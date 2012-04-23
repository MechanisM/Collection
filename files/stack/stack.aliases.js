	
	/////////////////////////////////
	//// stack methods (aliases)
	/////////////////////////////////
		
	// generate aliases
	Collection.prototype.stack.forEach(function (el) {
		var key, nm;
		
		for (key in el) {
			if (!el.hasOwnProperty(key)) { continue; }
			nm = C.toUpperCase(key, 1);
			
			fn['new' + nm] = function (nm) {
				return function (newParam) { return this._new(nm, newParam); };
			}(key);
			
			fn['update' + nm] = function (nm) {
				return function (newParam) { return this._update(nm, newParam); };
			}(key);
			
			fn['reset' + nm] = function (nm, resetVal) {
				return function () { return this._reset(nm, arguments, resetVal); };
			}(key, el[key]);
			fn['reset' + nm + 'To'] = function (nm) {
				return function (objId, id) { return this._resetTo(nm, objId, id); };
			}(key);
			
			fn['push' + nm] = function (nm) {
				return function (objId, newParam) { return this._push.apply(this, C.unshift(arguments, nm)); }
			}(key);
			
			fn['set' + nm] = function (nm) {
				return function (id) { return this._set(nm, id); };
			}(key);
			
			fn['pushSet' + nm] = function (nm) {
				return function (id, newParam) { return this._push(nm, id, newParam)._set(nm, id); };
			}(key);
			
			fn['back' + nm] = function (nm) {
				return function (nmb) { return this._back(nm, nmb || ''); };
			}(key);
			
			fn['back' + nm + 'If'] = function (nm) {
				return function (nmb) { return this._backIf(nm, nmb || ''); };
			}(key);
			
			if (key === 'filter' || key === 'parser') {
				fn['drop' + nm] = function (nm) {
					return function () { return this._drop(nm, arguments); };
				}(key);
			} else {
				fn['drop' + nm] = function (nm) {
					return function () { return this._drop(nm, arguments, null); };
				}(key);
			}
			
			fn['active' + nm] = function (nm) {
				return function (id) { return this._active(nm, id); };
			}(key);
			
			fn['exists' + nm] = function (nm) {
				return function (id) { return this._exists(nm, id || ''); };
			}(key);
			
			fn['validate' + nm] = function (nm) {
				return function (id) { return this._validate(nm, id || ''); };
			}(key);
			
			fn['get' + nm + 'ActiveId'] = function (nm) {
				return function (id) { return this._getActiveId(nm); };
			}(key);
			
			fn['get' + nm] = function (nm) {
				return function (id) { return this._get(nm, id || ''); };
			}(key);
		}
	});