	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
		
	/**
	 * templating (in context)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Collection|String} [param.collection=this.dObj.active.collection] - collection or collection ID
	 * @param {String} [param.context] - additional context
	 * @param {Number} [param.page=this.dObj.active.page] - page number
	 * @param {Template} [param.template=this.dObj.active.template] - template
	 * @param {Number|Boolean} [param.numberBreak=this.dObj.active.numberBreak] - number of entries on 1 page (if "false", returns all records)
	 * @param {Number} [param.pageBreak=this.dObj.active.pageBreak] - number of displayed pages (navigation, > 2)
	 * @param {jQuery Object|Boolean} [param.target=this.dObj.active.target] - element to output the result ("false" - if you print a variable)
	 * @param {String} [param.variable=this.dObj.sys.variableID] - variable ID (if param.target === false)
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.active.parser] - parser function, string expressions or "false"
	 * @param {Boolean} [param.cacheIteration=this.dObj.cache.iteration] - if "true", the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.dObj.active.calculator] - selector, on which is the number of records per page
	 * @param {Selector} [param.pager=this.dObj.active.pager] - selector to pager
	 * @param {String} [param.appendType=this.dObj.active.appendType] - type additions to the DOM
	 * @param {String} [param.resultNull=this.dObj.active.resultNull] - text displayed if no results
	 * @param {Boolean} [page=false] - break on page
	 * @return {Colletion Object}
	 */
	$.Collection.fn.print = function (param, page) {
		page = page || false;
		var
			dObj = this.dObj,
			active = dObj.active,
			opt = {},
			
			cObj, cOLength,
			start, inc = 0, checkPage, from = null,
			
			result = "", action;
			
		// easy implementation
		if ($.isString(param) || $.isNumeric(param)) {
			param = {page: param};
		} else if ($.isBoolean(param)) { page = param; }
		//
		$.extend(true, opt, active, param);
		if (param) { opt.page = nimble.expr(opt.page, active.page || ""); }
		if (opt.page < 1) { opt.page = 1; }
		//
		opt.collection = $.isString(opt.collection) ? this._get("collection", opt.collection) : opt.collection;
		opt.template = $.isString(opt.template) ? this._get("template", opt.template) : opt.template;
		//
		opt.filter = $.isExist(param.filter) ? param.filter : this.getActiveParam("filter");
		opt.parser = $.isExist(param.parser) ? param.parser : this.getActiveParam("parser");
		//
		checkPage = active.page - opt.page;
		active.page = opt.page;
		//
		action = function (data, i, cOLength, self, id) {
			// callback
			opt.callback && opt.callback.apply(this, arguments);
			//
			result += opt.template.call(opt.template, data, i, cOLength, self, id);
			inc = i;
				
			return true;
		};
		// get collection
		cObj = nimble.byLink(opt.collection, this.getActiveParam("context").toString() + nimble.CHILDREN + ((param && param.context) || ""));
		cOLength = this.length();
		
		// number of records per page
		opt.numberBreak = !page || opt.numberBreak === false ? cOLength : opt.numberBreak;
		//
		if ($.isPlainObject(cObj) || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = !page || opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak;
			//
			this.each(action, opt.filter, this.ACTIVE, true, opt.numberBreak, start);
		} else if ($.isArray(cObj) && opt.cache.iteration === true) {
			// calculate the starting position
			start = !page || opt.filter === false ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak : opt.cache.iteration === true ?
							checkPage > 0 ? opt.cache.firstIteration : opt.cache.lastIteration : i;
			
			// rewind cached step back
			if (checkPage > 0 && (page === true && opt.filter !== false)) {
				checkPage = opt.numberBreak * checkPage;
				for (; (start -= 1) > -1;) {
					if (this.customFilter(opt.filter, cObj[start], cObj, start, cOLength, this, this.ACTIVE) === true) {
						if (inc === checkPage) {
							break;
						} else { inc += 1; }
					}
				}
				opt.cache.lastIteration = (start += 1);
				from = null;
			} else if (checkPage < 0 && (page === true && opt.filter !== false)) { from = Math.abs(checkPage) * opt.numberBreak - opt.numberBreak || null; }
			//
			this.each(action, opt.filter, this.ACTIVE, true, opt.numberBreak, from, start);
		}
		// cache
		active.cache.firstIteration = opt.cache.lastIteration;
		active.cache.lastIteration = inc + 1;
		if (opt.cache.autoIteration === true) { active.cache.iteration = true; }
		//
		result = !result ? opt.resultNull : this.customParser(opt.parser, result);
		// append to DOM
		if (opt.target === false) {
			if (!opt.variable) {
				this._$("variable", result);
			} else { this._push("variable", opt.variable, result); }
			
			return this;
		} else { opt.target[opt.appendType](result); }
		//
		if (!page) { return this; }
		//
		opt.nmbOfEntries = opt.filter !== false ? this.length(opt.filter) : cOLength;
		opt.nmbOfEntriesInPage = opt.target.find(opt.calculator).length;
		opt.finNumber = opt.numberBreak * opt.page - (opt.numberBreak - opt.nmbOfEntriesInPage);
		// generate navigation bar
		if (opt.page !== 1 && opt.nmbOfEntriesInPage === 0) {
			opt.page = "-=1";
			this.print(opt, true);
		} else { this.easyPage(opt); }
	
		return this;
	};
	
	/**
	 * activation of the model template
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param] - object settings (depends on the model template)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.easyPage = function (param) {
		var
			str = "",
			//
			nmbOfPages = param.nmbOfEntries % param.numberBreak !== 0 ? ~~(param.nmbOfEntries / param.numberBreak) + 1 : param.nmbOfEntries / param.numberBreak,
			genPage = function (data, classes, i) {
				var key, str = "<" + (data.tag || "span") + ' data-page="' + i + '"';
				if (data.attr) {
					for (key in data.attr) {
						if (data.attr.hasOwnProperty(key)) {
							str += ' ' + key + '="' + data.attr[key] + '"';
						}
					}
				}
				//
				if (i === param.page) { str += ' class="' + (classes && classes.active || "active") + '"'; }
				return str += ">" + i + "</" + (data.tag || "span") + ">";
			},
			//
			i, j = 0, from, to;
		//
		param.pager.find("[data-ctm]").each(function () {
			if (param.pageBreak <= 2) { throw new Error('parameter "pageBreak" must be more than 2'); }
			
			var
				$this = $(this),
				data = $this.data("ctm"),
				classes = data.classes;

			if (data.nav) {
				if ((data.nav === "prev" && param.page === 1) || (data.nav === "next" && param.finNumber === param.nmbOfEntries)) {
					$this.addClass(classes && classes.disabled || "disabled");
				} else if (data.nav === "prev" || data.nav === "next") { $this.removeClass(classes && classes.disabled || "disabled"); }
				//
				if (data.nav === "pageList") {
					if (nmbOfPages > param.pageBreak) {	
						j = param.pageBreak % 2 !== 0 ? 1 : 0;
						from = (param.pageBreak - j) / 2;
						to = from;
						if (param.page - j < from) {
							from = 0;
						} else {
							from = param.page - from - j;
							if (param.page + to > nmbOfPages) {
								from -= param.page + to - nmbOfPages;
							}
						}
						
						for (i = from, j = -1; (i += 1) <= nmbOfPages && (j += 1) !== null;) {
							if (j === param.pageBreak && i !== param.page) { break; }
							str += genPage(data, classes || "", i);
						}
					} else { for (i = 0; (i += 1) <= nmbOfPages;) { str += genPage(data, classes || "", i); } }
					$this.html(str);
				}
			} else if (data.info) {
				if (param.nmbOfEntriesInPage === 0) {
					$this.addClass(classes && classes.noData || "noData");
				} else { $this.removeClass(classes && classes.noData || "noData"); }
				//
				switch (data.info) {
					case "page" : { $this.html(param.page); } break;
					case "total" : { $this.html(param.nmbOfEntries); } break;
					case "from" : { $this.html((param.page - 1) * param.numberBreak + 1); } break;
					case "to" : { $this.html(param.finNumber); } break;
					case "inPage" : { $this.html(param.nmbOfEntriesInPage); } break;
					case "nmbOfPages" : { $this.html(param.nmbOfPages); } break;
				}
			}
		});
		
		return this;
	};