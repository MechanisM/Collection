	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to object (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} [cValue] - new element or context for sourceID
	 * @param {String} [propType="push"] - add type (constants: "push", "unshift") or property name (can use "->unshift" - the result will be similar to work for an array "unshift")
	 * @param {String} [activeID=this.dObj.active.collectionID] - collection ID
	 * @param {String} [sourceID] - source ID (if move)
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.add = function (cValue, propType, activeID, sourceID, deleteType) {
		cValue = cValue !== undefined ? cValue : "";
		propType = propType || "push";
		deleteType = deleteType || false;
		//
		var
			dObj = this.dObj,
			active = dObj.active,
			sys = dObj.sys,
	
			cObj, sObj,
	
			collectionID = sys.collectionID,
			oCheck, lCheck;
		//
		cObj = nimble.byLink(this._get("collection", activeID || ""), this.getActiveParam("context").toString());
		//
		if (typeof cObj === "object") {
			oCheck = $.isPlainObject(cObj);
			
			// simple add
			if (!sourceID) {
				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + nimble.METHOD_SEPARATOR + "unshift" : propType;
					lCheck = nimble.addElementToObject(cObj, propType.toString(), cValue);
				} else {
					lCheck = true;
					cObj[propType](cValue);
				}
			
			// move
			} else {
				cValue = $.isExist(cValue) ? cValue.toString() : "";
				sObj = nimble.byLink(this._get("collection", sourceID || ""), cValue);
				
				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + nimble.METHOD_SEPARATOR + "unshift" : propType;
					lCheck = nimble.addElementToObject(cObj, propType.toString(), sObj);
				} else {
					lCheck = true;
					cObj[propType](sObj);
				}
				
				// delete element
				if (deleteType === true) { this.disable("context").deleteElementByLink(cValue, sourceID).enable("context"); }
			}
			
			// rewrites links (if used for an object "unshift")
			if (lCheck !== true) { this.set("", lCheck, activeID || ""); }
		} else { throw new Error("unable to set property!"); }
	
		return this;
	};
	
	/**
	 * push new element
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj - new element
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.push = function (obj, id) {
		return this.add(obj, "", id || "");
	};
	/**
	 * unshift new element
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj - new element
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.unshift = function (obj, id) {
		return this.add(obj, "unshift", id || "");
	};