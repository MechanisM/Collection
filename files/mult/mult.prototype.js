	
	/////////////////////////////////
	//// array prototype
	/////////////////////////////////

	if (!Array.prototype.forEach) {
		/**
		 * calls a function for each element in the array
		 *
		 * @this {Array}
		 * @param {Function} callback - callback function
		 * @param {mixed} [_this] - object to use as this when executing callback
		 * @return {undefined}
		 */
		Array.prototype.forEach = function (callback, _this) {
			var i = -1, aLength = this.length;
			//
			while ((i += 1) < aLength) {
				if (!_this) {
					callback(this[i], i, this);
				} else { callback.call(_this, this[i], i, this); }
			}
		}
	}
	//
	if (!Array.prototype.some) {
		/**
		 * tests whether some element in the array passes the test implemented by the provided function
		 *
		 * @this {Array}
		 * @param {Function} callback - callback function
		 * @param {mixed} [_this] - object to use as this when executing callback
		 * @return {undefined}
		 */
		Array.prototype.some = function (callback, _this) {
			var i = -1, aLength = this.length, res;
			//
			while ((i += 1) < aLength) {
				if (!_this) {
					res = callback(this[i], i, this);
				} else { res = callback.call(_this, this[i], i, this); }
				if (res === true) { break; }
			}
		}
	}