	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to the collection (in context)<br/>
	 * events: onAdd
	 * <i class="single"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} [cValue] - new element or context for sourceID
	 * @param {String} [propType="push"] - add type (constants: "push", "unshift") or property name (can use "->unshift" - the result will be similar to work for an array "unshift")
	 * @param {String} [activeID=this.ACTIVE] - collection ID
	 * @param {String} [sourceID] - source ID (if move)
	 * @param {Boolean} [del=false] - if "true", remove source element
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	C.prototype.add = function (cValue, propType, activeID, sourceID, del) {
		cValue = cValue !== undefined ? cValue : "";
		propType = propType || "push";
		activeID = activeID || "";
		del = del || false;
		//
		var cObj, sObj, lCheck, e = null;
		
		// events
		this.onAdd && (e = this.onAdd.apply(this, arguments));
		if (e === false) { return this; }
		
		//
		cObj = nimble.byLink(this._get("collection", activeID), this._getActiveParam("context"));
		
		//
		if (typeof cObj !== "object")  { throw new Error("unable to set property!"); }
		
		// simple add
		if (!sourceID) {
			// add type
			if ($.isPlainObject(cObj)) {
				propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + nimble.METHOD_SEPARATOR + "unshift" : propType;
				lCheck = nimble.addElementToObject(cObj, propType.toString(), cValue);
			} else {
				lCheck = true;
				cObj[propType](cValue);
			}
		
		// move
		} else {
			cValue = $.isExists(cValue) ? cValue.toString() : "";
			sObj = nimble.byLink(this._get("collection", sourceID || ""), cValue);
			
			// add type
			if ($.isPlainObject(cObj)) {
				propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + nimble.METHOD_SEPARATOR + "unshift" : propType;
				lCheck = nimble.addElementToObject(cObj, propType.toString(), sObj);
			} else {
				lCheck = true;
				cObj[propType](sObj);
			}
			
			// delete element
			if (del === true) { this.disable("context")._removeOne(cValue, sourceID).enable("context"); }
		}
		
		// rewrites links (if used for an object "unshift")
		if (lCheck !== true) { this._setOne("", lCheck, activeID); }
	
		return this;
	};
	
	/**
	 * add new element to the collection (push)(in context)<br/>
	 * events: onAdd
	 * <i class="single"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj - new element
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype.push = function (obj, id) {
		return this.add(obj, "", id || "");
	};
	/**
	 * add new element to the collection (unshift)(in context)<br/>
	 * events: onAdd
	 * <i class="single"></i>
	 * 
	 * @this {Colletion Object}
	 * @param {mixed} obj - new element
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @return {Colletion Object}
	 */
	C.prototype.unshift = function (obj, id) {
		return this.add(obj, "unshift", id || "");
	};