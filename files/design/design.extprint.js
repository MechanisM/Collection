	
	/////////////////////////////////
	//// design methods (extended print)
	/////////////////////////////////
		
	/**
	 * extended templating (in context) (with pager)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Number} [param.page=this.dObj.active.param.page] - page number
	 * @param {Template} [param.template=this.dObj.active.template] - template
	 * @param {Number|Boolean} [param.numberBreak=this.dObj.active.param.numberBreak] - number of entries on 1 page (if "false", returns all records)
	 * @param {Number} [param.pageBreak=this.dObj.active.param.pageBreak] - number of displayed pages (navigation)
	 * @param {jQuery Object} [param.target=this.dObj.active.target] - element to output the result
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.active.parser] - parser function, string expressions or "false"
	 * @param {Boolean} [param.cacheIteration=this.dObj.cache.iteration] - if "true", the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.dObj.active.calculator] - selector, on which is the number of records per page
	 * @param {Selector} [param.pager=this.dObj.active.param.pager] - selector to pager
	 * @param {String} [param.appendType=this.dObj.active.appendType] - type additions to the DOM
	 * @param {String} [param.resultNull=this.dObj.active.resultNull] - text displayed if no results
	 * @return {Colletion Object}
	 */
	$.Collection.fn.extPrint = function (param) {
		var
			dObj = this.dObj,
			active = dObj.active,
			opt = {},
			
			cObj, cOLength,
			start, inc = 0, checkPage, from = null,
			
			result = "", action;
			
		// easy implementation
		if ($.isString(param) || $.isNumeric(param)) { param = {page: param}; }
		//
		$.extend(true, opt, active, param);
		if (param) { opt.page = $.Collection.obj.expr(opt.page, active.page || ""); }
		//
		checkPage = active.page - opt.page;
		active.page = opt.page;
		action = function (data, i, aLength, $this, objID) {
			result += opt.template(data, i, aLength, $this, objID);
			inc = i;
				
			return true;
		};
		// get collection
		cObj = $.Collection.obj.getByLink(opt.collection, this.getActiveContext());
		cOLength = this.length();
		
		// number of records per page
		opt.numberBreak = opt.numberBreak === false ? cOLength : opt.numberBreak;
		// "callee" link
		dObj.sys.callee.template = opt.template;
		
		if ($.isPlainObject(cObj) || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak;
			//
			this.each(action, opt.filter, this.config.constants.active, true, opt.numberBreak, start);
			//
			active.cache.firstIteration = opt.cache.lastIteration;
			active.cache.lastIteration = inc + 1;
		} else if ($.isArray(cObj) && opt.cache.iteration === true) {
			// calculate the starting position
			start = opt.filter === false ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak : opt.cache.iteration === true ?
							checkPage >= 0 ? opt.cache.firstIteration : opt.cache.lastIteration : i;
			console.log(start);
			
			// rewind cached step back
			if (checkPage > 0 && opt.filter !== false) {
				checkPage = opt.numberBreak * checkPage;
				for (; start--;) {
					if (this.customFilter(opt.filter, cObj, start, cOLength, this, this.config.constants.active) === true) {
						if (inc === checkPage) {
							break;
						} else { inc++; }
					}
				}
				start++;
				opt.cache.lastIteration = start;
				from = null;
			} else if (checkPage < 0 && opt.filter !== false) {
				from = Math.abs(checkPage) * opt.numberBreak - opt.numberBreak || null;
			}
			//
			this.each(action, opt.filter, this.config.constants.active, true, opt.numberBreak, from, start);
			// cache
			if (checkPage !== 0) {
				active.cache.firstIteration = opt.cache.lastIteration;
				active.cache.lastIteration = inc + 1;
			}
		}
		if (opt.cache.autoIteration === true) { active.cache.iteration = true; }
		//
		result = !result ? opt.resultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResult + '</div>' : opt.resultNull : result;
		result = opt.parser !== false ? this.customParser(opt.parser, result) : result;
		// append to DOM
		opt.target[opt.appendType](result);
		//
		$.extend(true, opt, {
			nmbOfEntries: this.length(opt.filter),
			nmbOfEntriesInPage: $(opt.calculator, opt.target).length
		});
		opt.finNumber = opt.numberBreak * opt.page - (opt.numberBreak - opt.nmbOfEntriesInPage);
		// generate navigation bar
		if (opt.page !== 1 && opt.nmbOfEntriesInPage === 0) {
			opt.page = "-=1";
			this.extPrint(opt);
		} else { this.easyPage(opt); }
	
		return this;
	};
	/**
	 * activation of the model template
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param=undefined] - object settings (depends on the model template)
	 * @param {Object} [active=undefined] - collection properties
	 * @return {Colletion Object}
	 */
	$.Collection.fn.easyPage = function (param) {
		// "callee" link
		this.dObj.sys.callee.templateModel = this.dObj.active.templateModel;
		this.dObj.active.templateModel.call(this, param);
		
		return this;
	};