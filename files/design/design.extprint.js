	
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
		var
			dObj = this.dObj,
			opt = {},
			
			cObj, cOLength,
			start, inc = 0,
			
			result = "", action;
		//
		$.extend(true, opt, dObj.prop, param);
		action = function (data, i, aLength, $this, objID) {
			result += opt.template(data, i, aLength, $this, objID);
			inc = i;
				
			return true;
		};
		// get collection
		cObj = $.Collection.obj.getByLink(prop.collection, this.getActiveContext());
		cOLength = this.length();
		
		// number of records per page
		opt.numberBreak = opt.numberBreak === false ? cOLength : opt.numberBreak;
		// "callee" link
		dObj.sys.callee.template = opt.template;
		
		if ($.isPlainObject(cObj) || opt.cacheIteration === false) {
			start = opt.page === 1 ? opt.numberBreak : (opt.page - 1) * opt.numberBreak;
			//
			this.each(action, opt.filter, this.config.constants.active, true, opt.numberBreak, start);
		} else if ($.isArray(cObj) && opt.cacheIteration === true) {
			// calculate the starting position
			start = opt.filter === false ?
						opt.page === 1 ? -1 : (opt.page - 1) * opt.numberBreak - 1 : cacheIteration === true ?
							checkPage === true ? cache.firstIteration : cache.lastIteration : i;
			
			// rewind cached step back
			if (checkPage === true && opt.filter !== false) {
				for (; start--;) {
					if (this.customFilter(opt.filter, cObj, start, cOLength, $this, this.config.constants.active) === true) {
						if (inc === opt.numberBreak) {
							break;
						} else { inc++; }
					}
				}
				start = start === -1 ? start : start + 1;
				cache.lastIteration = start;
			}
			
			this.each(action, opt.filter, this.config.constants.active, true, opt.numberBreak, null, start);
			//
			cache.firstIteration = cache.lastIteration;
			cache.lastIteration = inc - 1;
			if (cache.autoIteration === true) {
				cache.iteration = true;
			}
		}
		
		result = !result ? resultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResultInSearch + '</div>' : resultNull : result;
		result = opt.parser !== false ? this.customParser(opt.parser, result) : result;
		// append to DOM
		opt.target[opt.appendType](result);
	
		/*$.extend(opt, {
			countRecords: this.length(opt.filter),
			countRecordsInPage: $((opt.calculator || prop.calculator), target).length,
			countTotal: opt.numberBreak * opt.page - (opt.numberBreak - sys.countRecordsInPage)
		});*/
		
		/*
		// generate navigation bar
		if (opt.page !== 1 && sys.countRecordsInPage === 0) {
			prop.opt.page--;
			this.extPrint.apply(this, arguments);
		} else { this.easyPage(opt, prop); }*/
	
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