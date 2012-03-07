	
	/////////////////////////////////
	//// stack methods (aliases)
	/////////////////////////////////
		
	// generate aliases
	(function (data) {
		var fn = C.prototype, nm;
		
		data.forEach(function (el) {
			nm = $.toUpperCase(el, 1);
			
			fn["new" + nm] = function (nm) {
				return function (newParam) { return this._new(nm, newParam); };
			}(el);
			//
			fn["update" + nm] = function (nm) {
				return function (newParam) { return this._update(nm, newParam); };
			}(el);
			//
			fn["reset" + nm + "To"] = function (nm) {
				return function (objID, id) { return this._resetTo(nm, objID, id); };
			}(el);	
			//
			fn["push" + nm] = function (nm) {
				return function (objID, newParam) { return this._push.apply(this, $.unshiftArguments(arguments, nm)); }
			}(el);
			//
			fn["set" + nm] = function (nm) {
				return function (id) { return this._set(nm, id); };
			}(el);
			//
			fn["pushSet" + nm] = function (nm) {
				return function (id, newParam) { return this._push(nm, id, newParam)._set(nm, id); };
			}(el);
			//
			fn["back" + nm] = function (nm) {
				return function (nmb) { return this._back(nm, nmb || ""); };
			}(el);	
			//
			fn["back" + nm + "If"] = function (nm) {
				return function (nmb) { return this._backIf(nm, nmb || ""); };
			}(el);	
			//
			if (el === "filter" || el === "parser") {
				fn["drop" + nm] = function (nm) {
					return function () { return this._drop(nm, arguments); };
				}(el);	
			} else {
				fn["drop" + nm] = function (nm) {
					return function () { return this._drop(nm, arguments, null); };
				}(el);	
			}
			//
			if (el === "filter" || el === "parser") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments); };
				}(el);	
			} else if (el === "page") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, 1); };
				}(el);	
			} else if (el === "context") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, ""); };
				}(el);	
			}
			//
			fn["active" + nm] = function (nm) {
				return function (id) { return this._active(nm, id); };
			}(el);	
			//
			fn["exists" + nm] = function (nm) {
				return function (id) { return this._exists(nm, id || ""); };
			}(el);
			//
			fn["get" + nm + "ActiveID"] = function (nm) {
				return function (id) { return this._getActiveID(nm); };
			}(el);
			//
			fn["get" + nm] = function (nm) {
				return function (id) { return this._get(nm, id || ""); };
			}(el);
		});
	})(C.prototype.stack);