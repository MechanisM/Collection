	
	/////////////////////////////////
	//// stack methods (aliases)
	/////////////////////////////////
		
	// generate aliases
	(function (data) {
		var
			i, fn = $.Collection.fn,
			nm, upperCase;
	
		for (i = data.length; i--;) {
			nm = data[i] !== "collection" ? data[i] : "";
			upperCase = $.toUpperCase(data[i], 1);
			
			fn["$" + upperCase] = function (nm) {
				return function (newParam) { return this._$(nm, newParam); };
			}(data[i]);
			//
			if (data[i] === "context") {
				fn["mod" + upperCase] = function (nm) {
					return function (newParam, id) { return this._mod.apply(this, $.unshiftArguments(arguments, nm)); };
				}(data[i]);
			}
			//
			fn["update" + upperCase] = function (nm) {
				return function (newParam) { return this._update(nm, newParam); };
			}(data[i]);
			//
			fn["reset" + upperCase + "To"] = function (nm) {
				return function (objID, id) { return this._resetTo(nm, objID, id); };
			}(data[i]);	
			//
			fn["push" + upperCase] = function (nm) {
				return function (objID, newParam) { return this._push.apply(this, $.unshiftArguments(arguments, nm)); }
			}(data[i]);
			//
			fn["set" + upperCase] = function (nm) {
				return function (id) { return this._set(nm, id); };
			}(data[i]);
			//
			fn["pushSet" + upperCase] = function (nm) {
				return function (id, newParam) { return this._push(nm, id, newParam)._set(nm, id); };
			}(data[i]);
			//
			fn["back" + upperCase] = function (nm) {
				return function (nmb) { return this._back(nm, nmb || ""); };
			}(data[i]);	
			//
			fn["back" + upperCase + "If"] = function (nm) {
				return function (nmb) { return this._backIf(nm, nmb || ""); };
			}(data[i]);	
			//
			if (data[i] === "filter" || data[i] === "parser") {
				fn["drop" + upperCase] = function (nm) {
					return function () { return this._drop(nm, arguments); };
				}(data[i]);	
			} else {
				fn["drop" + upperCase] = function (nm) {
					return function () { return this._drop(nm, arguments, null); };
				}(data[i]);	
			}
			//
			if (data[i] === "filter" || data[i] === "parser") {
				fn["reset" + upperCase] = function (nm) {
					return function () { return this._reset(nm, arguments); };
				}(data[i]);	
			} else if (data[i] === "page") {
				fn["reset" + upperCase] = function (nm) {
					return function () { return this._reset(nm, arguments, 1); };
				}(data[i]);	
			} else if (data[i] === "context") {
				fn["reset" + upperCase] = function (nm) {
					return function () { return this._reset(nm, arguments, ""); };
				}(data[i]);	
			}
			//
			fn["is" + upperCase] = function (nm) {
				return function (id) { return this._is(nm, id); };
			}(data[i]);	
			//
			fn["exist" + upperCase] = function (nm) {
				return function (id) { return this._exist(nm, id || ""); };
			}(data[i]);
			//
			fn["get" + upperCase] = function (nm) {
				return function (id) { return this._get(nm, id || ""); };
			}(data[i]);
		}
	})($.Collection.fn.stack);