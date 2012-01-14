	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * reverse collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.reverse = function (id) {
		id = id || "";
		//
		var
			cObj,
			reverseObject = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					key;
				//
				for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
				sortedKeys.reverse();
				//
				for (key in sortedKeys) {
					if (sortedKeys.hasOwnProperty(key)) { sortedObj[sortedKeys[key]] = obj[sortedKeys[key]]; }
				}
	
				return sortedObj;
			};
		//
		cObj = nimble.byLink(this._get("collection", id), this._getActiveParam("context"));
		if (typeof cObj === "object") {
			if ($.isArray(cObj)) {
				cObj.reverse();
			} else { this._setOne("", reverseObject(cObj), id); }
		} else { throw new Error("incorrect data type!"); }
		
		return this;
	};