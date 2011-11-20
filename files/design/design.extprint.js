	
	/////////////////////////////////
	//// design methods (extended print)
	/////////////////////////////////
		
	/**
	 * extended templating (in context) (with pager)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Number} [param.page=this.dObj.prop.param.page] - page number
	 * @param {Template} [param.template=this.dObj.prop.template] - template
	 * @param {Number|Boolean} [param.numberBreak=this.dObj.prop.param.numberBreak] - number of entries on 1 page (if "false", returns all records)
	 * @param {Number} [param.pageBreak=this.dObj.prop.param.pageBreak] - number of displayed pages (navigation)
	 * @param {jQuery Object} [param.target=this.dObj.prop.target] - element to output the result
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.prop.parser] - parser function, string expressions or "false"
	 * @param {Boolean} [param.cacheIteration=this.dObj.cache.iteration] - if "true", the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.dObj.prop.calculator] - selector, on which is the number of records per page
	 * @param {Selector} [param.pager=this.dObj.prop.param.pager] - selector to pager
	 * @param {String} [param.appendType=this.dObj.prop.appendType] - type additions to the DOM
	 * @param {String} [param.resultNull=this.dObj.prop.resultNull] - text displayed if no results
	 * @return {Colletion Object}
	 */
	$.Collection.fn.extPrint = function (param) {
		param = param || {};
		
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			cObj, cOLength,
			start, inc = 0,
			
			checkPage,
			cache,
			result = "", action;
			
		param.filter = param.filter || prop.filter;
		param.parser = param.parser || prop.parser;
		
		param.page = param.page || prop.page;
		checkPage = param.page === (param.page + 1);
			
		param.template = param.template || prop.template;
		param.target = param.target || prop.target;
		
		param.numberBreak = +param.numberBreak || +prop.param.numberBreak;
		param.pageBreak = +param.pageBreak || +prop.param.pagerBreak;
		
		cache = prop.cache;
		param.cacheIteration = $.isBoolean(param.cacheIteration) ? param.cacheIteration : cache.iteration;
			
		param.resultNull = param.resultNull !== undefined ? param.resultNull : prop.resultNull;
	
		result = "";
		action = function (data, i, aLength, $this, objID) {
			result += template(data, i, aLength, $this, objID);
			inc = i;
				
			return true;
		};
			
		// get collection
		cObj = $.Collection.stat.obj.getByLink(prop.collection, (param.context || this.getActiveContext()));
		cOLength = this.length();
		
		// number of records per page
		param.numberBreak = param.numberBreak === false ? cOLength : param.numberBreak;
		// "callee" link
		sys.callee.template = param.template;
		
		if ($.isPlainObject(cObj) || param.cacheIteration === false) {
			start = param.page === 1 ? param.numberBreak : (param.page - 1) * param.numberBreak;
			//
			this.each(action, param.filter, this.config.constants.active, true, param.numberBreak, start);
		} else if ($.isArray(cObj) && cacheIteration === true) {
			// calculate the starting position
			start = param.filter === false ?
						param.page === 1 ? -1 : (param.page - 1) * param.numberBreak - 1 : cacheIteration === true ?
							checkPage === true ? cache.firstIteration : cache.lastIteration : i;
			
			// rewind cached step back
			if (checkPage === true && param.filter !== false) {
				for (; start--;) {
					if (this.customFilter(param.filter, cObj, start, cOLength, $this, this.config.constants.active) === true) {
						if (inc === param.numberBreak) {
							break;
						} else { inc++; }
					}
				}
				start = start === -1 ? start : start + 1;
				cache.lastIteration = start;
			}
			
			this.each(action, param.filter, this.config.constants.active, true, param.numberBreak, null, start);
			//
			cache.firstIteration = cache.lastIteration;
			cache.lastIteration = inc - 1;
			if (cache.autoIteration === true) {
				cache.iteration = true;
			}
		}
		
		result = !result ? resultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResultInSearch + '</div>' : resultNull : result;
		result = parser !== false ? this.customParser(parser, result) : result;
		// append to DOM
		target[(param.appendType || prop.appendType)](result);
	
		$.extend(param, {
			countRecords: this.length(param.filter),
			countRecordsInPage: $((param.calculator || prop.calculator), target).length,
			countTotal: param.numberBreak * param.page - (param.numberBreak - sys.countRecordsInPage)
		});
		
		/*
		// generate navigation bar
		if (param.page !== 1 && sys.countRecordsInPage === 0) {
			prop.param.page--;
			this.extPrint.apply(this, arguments);
		} else { this.easyPage(param, prop); }*/
	
		return this;
	};
	/**
	 * activation of the model template
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param=undefined] - object settings (depends on the model template)
	 * @param {Object} [prop=undefined] - collection properties
	 * @return {Colletion Object}
	 */
	$.Collection.fn.easyPage = function (param, prop) {
		// "callee" link
		this.dObj.sys.callee.templateModel = this.dObj.prop.templateModel;
		this.dObj.prop.templateModel.apply(this, arguments);
		
		return this;
	};