	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
	
	/**
	 * simple templating (in context)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Template} [param.template=this.dObj.prop.template] - template
	 * @param {jQuery Object|Boolean} [param.target=this.dObj.prop.target] - element to output the result ("false" - if you print a variable)
	 * @param {String} [param.variable=this.dObj.sys.variableID] - variable ID (if param.target === false)
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.prop.parser] - parser function, string expressions or "false"
	 * @param {String} [param.appendType=this.dObj.prop.appendType] - type additions to the DOM
	 * @param {String} [param.resultNull=this.dObj.prop.resultNull] - text displayed if no results
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.print = function (param, mult, count, from, indexOf) {
		param = param || {};
		
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			dObj = this.dObj,
			prop = dObj.prop,
	
			parser = param.parser || prop.parser,
			template = param.template || prop.template,
	
			target = param.target || param.target === false ? param.target : prop.target,
			resultNull = param.resultNull !== undefined ? param.resultNull : prop.resultNull,
	
			result = "",
			action = function (data, i, aLength, $this, objID) {
				result += template(data, i, aLength, $this, objID);
				
				if (mult !== true) { return false; }
	
				return true;
			};
		
		// "callee" link
		dObj.sys.callee.template = template;		
		this.each(action, (param.filter || prop.filter), this.config.constants.active, mult, count, from, indexOf);
		
		result = !result ? resultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResultInSearch + '</div>' : resultNull : result;
		result = parser !== false ? this.customParser((parser), result) : result;
		
		if (target === false) {
			if (!param.variable) {
				this.$_("variable", result);
			} else {
				this._push("variable", param.variable, result);
			}
		} else { target[(param.appendType || prop.appendType)](result); }
	
		return this;
	};