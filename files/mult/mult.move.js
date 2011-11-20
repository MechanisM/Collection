
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of transfers (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, deleteType) {
		moveFilter = moveFilter || false;
		deleteType = deleteType === false ? false : true;
		context = $.isExist(context) ? context.toString() : "";
		
		sourceID = sourceID || "";
		activeID = activeID || "";
		
		addType = addType || "push";
	
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			statObj = $.Collection.stat.obj,
	
			deleteList = [],
			aCheckType = $.isArray(statObj.getByLink(this._get("Collection", activeID), this.getActiveContext())),
	
			elements, eLength, i = -1;
	
		// search elements
		this.config.flags.use.ac = false;
		elements = this.searchElements(moveFilter, sourceID, mult, count, from, indexOf);
		this.config.flags.use.ac = true;
	
		// move
		if (mult === true) {
			eLength = elements.length - 1;
			for (; i++ < eLength;) {
				this.addElement(context + this.config.constants.contextSeparator + elements[i], aCheckType === true ? addType : elements[i] + statObj.methodSeparator + addType, activeID, sourceID);
				deleteType === true && deleteList.push(elements[i]);
			}
		} else {
			this.addElement(context + this.config.constants.contextSeparator + elements, aCheckType === true ? addType : elements + statObj.methodSeparator + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
	
		// delete element
		if (deleteType === true) {
			this.config.flags.use.ac = false;
			this.deleteElementsByLink(deleteList, sourceID);
			this.config.flags.use.ac = true;
		}
	
		return this;
	},
	/**
	 * move element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false);
	};
	/**
	 * copy elements (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of copies (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf) {
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "push", mult, count, from, indexOf, false);
	};
	/**
	 * copy element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false, "", "", "", false);
	};