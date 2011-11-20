	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to object (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} cValue - new element или context for sourceID (sharp (#) char indicates the order)
	 * @param {String} [propType="push"] - add type (constants: "push", "unshift") or property name (can use "::unshift" - the result will be similar to work for an array "unshift")
	 * @param {String} [activeID=this.dObj.prop.collectionID] - collection ID
	 * @param {String} [sourceID=undefined] - source ID (if move)
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.addElement = function (cValue, propType, activeID, sourceID, deleteType) {
		cValue = cValue !== undefined ? cValue : "";
		propType = propType || "push";
		deleteType = deleteType === true ? true : false;
	
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
	
			cObj, sObj,
	
			collectionID = sys.collectionID,
	
			oCheck, lCheck;
		
		cObj = statObj.getByLink(activeID && activeID !== this.config.constants.active ? sys.tmpCollection[activeID] : prop.collection, this.getActiveContext());
		
		if (typeof cObj === "object") {
			oCheck = $.isPlainObject(cObj);
	
			// simple add
			if (!sourceID) {
				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + statObj.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), cValue);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(cValue);
					} else if (propType === "unshift") {
						cObj.unshift(cValue);
					}
				}
			// move
			} else {
				cValue = $.isExist(cValue) ? cValue.toString() : "";
				sObj = statObj.getByLink(sourceID === this.config.constants.active ? prop.collection : sys.tmpCollection[sourceID], cValue);

				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + statObj.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), sObj);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(sObj);
					} else if (propType === "unshift") {
						cObj.unshift(sObj);
					}
				}
				
				// delete element
				if (deleteType === true) {
					this.config.flags.use.ac = false;
					this.deleteElementByLink(cValue, sourceID);
					this.config.flags.use.ac = true;
				}
			}
	
			// rewrites links (if used for an object "unshift")
			if (lCheck !== true) { this.setElement("", lCheck, activeID || ""); }
		} else { throw new Error("unable to set property!"); }
	
		return this;
	};