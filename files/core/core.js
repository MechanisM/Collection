	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	/**
	 * @constructor
	 * @this {Colletion Object}
	 * @param {Collection|Selector} [collection=null] - collection or selector for field "target"
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.active] - user's preferences
	 */
	$.Collection = function (collection, uProp) {
		collection = collection || null;
		uProp = uProp || null;
		
		// create "factory" function if need	
		if (this.fn && (!this.fn.name || this.fn.name !== "$.Collection")) { return new $.Collection(collection, uProp); }
		
		// mixin public fields
		$.extend(true, this, $.Collection.storage);
			
		var active = this.dObj.active;
				
		// extend public fields by user's preferences if need
		if (uProp) { $.extend(true, active, uProp); }
		
		// if "collection" is string
		if ($.isString(collection)) {
			active.target = $(collection);
			active.collection = null;
		} else { active.collection = collection; }
	};
	
	//
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function (callback, _this) {
			var i = -1, aLength = this.length;
			
			for (; (i += 1) < aLength;) {
				if (!_this) {
					callback(this[i], i, this);
				} else { callback.call(_this, this[i], i, this); }
			}
		}
	}
	if (!Array.prototype.some) {
		Array.prototype.some = function (callback, _this) {
			var i = -1, aLength = this.length, res;
			
			for (; (i += 1) < aLength;) {
				if (!_this) {
					res = callback(this[i], i, this);
				} else { res = callback.call(_this, this[i], i, this); }
				if (res === true) { break; }
			}
		}
	}