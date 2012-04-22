	
	/////////////////////////////////
	//// array prototype
	/////////////////////////////////
	
	if (!Array.prototype.forEach || debug) {
		/**
		 * calls a function for each element in the array
		 *
		 * @this {Array}
		 * @param {Function} callback — function to test each element of the array
		 * @param {mixed} [thisObject] — object to use as this when executing callback
		 * @return {undefined}
		 */
		Array.prototype.forEach = function (callback, thisObject) {
			var i = -1, aLength = this.length;
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					callback(this[i], i, this);
				} else { callback.call(thisObject, this[i], i, this); }
			}
		}
	}
	
	if (!Array.prototype.some || debug) {
		/**
		 * tests whether some element in the array passes the test implemented by the provided function
		 *
		 * @this {Array}
		 * @param {Function} callback — function to test each element of the array
		 * @param {mixed} [thisObject] — object to use as this when executing callback
		 * @return {Boolean}
		 */
		Array.prototype.some = function (callback, thisObject) {
			var i = -1, aLength = this.length, res;
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					res = callback(this[i], i, this);
				} else { res = callback.call(thisObject, this[i], i, this); }
				if (res) { return true; }
			}
			
			return false;
		}
	}
	
	if (!Array.prototype.every || debug) {
		/**
		 * returns true if every element in this array satisfies the provided testing function
		 *
		 * @this {Array}
		 * @param {Function} callback — function to test each element of the array
		 * @param {mixed} [thisObject] — object to use as this when executing callback
		 * @return {Boolean}
		 */
		Array.prototype.every = function (callback, thisObject) {
			var i = -1, aLength = this.length,
				res, fRes = true;
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					res = callback(this[i], i, this);
				} else { res = callback.call(thisObject, this[i], i, this); }
				
				if (fRes === true && !res) {
					fRes = false;
					
					break;
				}
			}
			
			return fRes;
		};
	}
	
	if (!Array.prototype.filter || debug) {
		/**
		 * creates a new array with all elements that pass the test implemented by the provided function
		 *
		 * @this {Array}
		 * @param {Function} callback — function to test each element of the array
		 * @param {mixed} [thisObject] — object to use as this when executing callback
		 * @return {Array}
		 */
		Array.prototype.filter = function (callback, thisObject) {
			var i = -1, aLength = this.length, res = [];
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					if (callback(this[i], i, this)) {
						res.push(this[i]);
					}
				} else {
					if (callback.call(thisObject, this[i], i, this)) {
						res.push(this[i]);
					}
				}
			}
			
			return res;
		};
	}
	
	if (!Array.prototype.map || debug) {
		/**
		 * creates a new array with the results of calling a provided function on every element in this array
		 *
		 * @this {Array}
		 * @param {Function} callback — function that produces an element of the new Array from an element of the current one
		 * @param {mixed} [thisObject] — object to use as this when executing callback
		 * @return {Array}
		 */
		Array.prototype.map = function (callback, thisObject) {
			var i = -1, aLength = this.length, res = [];
			
			while ((i += 1) < aLength) {
				if (!thisObject) {
					res.push(callback(this[i], i, this));
				} else {
					res.push(callback.call(thisObject, this[i], i, this));
				}
			}
			
			return res;
		};
	}
	
	if (!Array.prototype.indexOf || debug) {
		/**
		 * returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found
		 *
		 * @this {Array}
		 * @param {Function} searchElement — element to locate in the array
		 * @param {Number} [fromIndex=0] — the index at which to begin the search. If the index is greater than or equal to the length of the array, -1 is returned
		 * @return {Number}
		 */
		Array.prototype.indexOf = function (searchElement, fromIndex) {
			var i = (fromIndex || 0) - 1,
				aLength = this.length;
			
			while ((i += 1) < aLength) {
				if (this[i] === searchElement) {
					return i;
				}
			}
			
			return -1;
		};
	}
	
	if (!Array.prototype.lastIndexOf || debug) {
		/**
		 * returns the last (greatest) index of an element within the array equal to the specified value, or -1 if none is found
		 *
		 * @this {Array}
		 * @param {Function} searchElement — element to locate in the array
		 * @param {Number} [fromIndex=Array.length] — the index at which to start searching backwards. If the index is greater than or equal to the length of the array, the whole array will be searched. If negative, it is taken as the offset from the end of the array.
		 * @return {Number}
		 */
		Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
			var i = fromIndex || this.length;
			if (i < 0) { i = this.length + i; }
			
			while ((i -= 1) > -1) {
				if (this[i] === searchElement) {
					return i;
				}
			}
			
			return -1;
		};
	}
	
	if (!Array.prototype.reduce || debug) {
		/**
		 * apply a function simultaneously against two values of the array (from left-to-right) as to reduce it to a single value
		 *
		 * @this {Array}
		 * @param {Function} callback — function to execute on each value in the array
		 * @param {mixed} [initialValue=Array[0]] — object to use as the first argument to the first call of the callback
		 * @return {mixed}
		 */
		Array.prototype.reduce = function (callback, initialValue) {
			var i = 0, aLength = this.length, res;
			
			if (aLength === 1) { return this[0]; } 
			
			if (initialValue) {
				res = initialValue;
			} else { res = this[0]; }
			
			while ((i += 1) < aLength) {
				res = callback(res, this[i], i, this);
			}
			
			return res;
		};
	}
	
	if (!Array.prototype.reduceRight || debug) {
		/**
		 * apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value
		 *
		 * @this {Array}
		 * @param {Function} callback — function to execute on each value in the array
		 * @param {mixed} [initialValue=Array[Array.length - 1]] — object to use as the first argument to the first call of the callback.
		 * @return {mixed}
		 */
		Array.prototype.reduceRight = function (callback, initialValue) {
			var i = this.length - 1, res;
			
			if (this.length === 1) { return this[0]; } 
			
			if (initialValue) {
				res = initialValue;
			} else { res = this[i]; }
			
			while ((i -= 1) > -1) {
				res = callback(res, this[i], i, this);
			}
			
			return res;
		};
	}