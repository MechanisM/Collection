	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
	
	/**
	 * templating (in context)<br/>
	 * events: onEmptyPage
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Collection|String} [param.collection=this.ACTIVE] — collection or collection ID
	 * @param {String} [param.context] — additional context
	 * @param {Number} [param.page=this.ACTIVE] — page number
	 * @param {Template} [param.template=this.ACTIVE] — template
	 * @param {Number|Boolean} [param.breaker=this.ACTIVE] — number of entries on per page (if false, returns all records)
	 * @param {Number} [param.navBreaker=this.ACTIVE] — number of displayed pages (navigation, > 2)
	 * @param {Selector|Boolean} [param.target=this.ACTIVE] — selector to element to output the result (false — if you print a variable)
	 * @param {String} [param.variable=this.ACTIVE] — variable ID (if param.target === false)
	 * @param {Filter|String Expression} [param.filter=this.ACTIVE] — filter function, string expression (the record is equivalent to: return + string expression))
	 * @param {Parser|String Expression} [param.parser=this.ACTIVE] — parser function or string expression (the record is equivalent to: return + string expression)
	 * @param {Boolean} [param.cacheIteration=this.ACTIVE] — if true, the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.ACTIVE] — the selector for the calculation of the number of records
	 * @param {Selector} [param.pager=this.ACTIVE] — selector to pager (navigation)
	 * @param {String} [param.toHTML=this.ACTIVE] — type additions to the DOM
	 * @param {String} [param.resultNull=this.ACTIVE] — text displayed if no results
	 * @param {Boolean} [clear=false] — clear the cache
	 * @return {Colletion Object}
	 */
	Collection.prototype.print = function (param, clear) {
		clear = clear || false;
		
		var self = this,
			tmpParser = {}, tmpFilter = {},
			opt = {},
			
			data, length, fLength,
			start, inc = 0, checkPage, from = null,
			first = false,
			
			breaker,
			
			result = '', action, e;
		
		// easy implementation
		if (C.isExists(param) && (C.isString(param) || C.isNumber(param))) {
			param = {page: param};
		} else if (!C.isExists(param)) { param = {page: this._get('page')}; }
		
		// the expansion of input parameters
		C.extend(true, opt, this.dObj.active, param);
		if (param) { opt.page = C.expr(opt.page, this._get('page')); }
		if (opt.page < 1) { opt.page = 1; }
		
		opt.collection = C.isString(opt.collection) ? this._get('collection', opt.collection) : opt.collection;
		opt.template = C.isString(opt.template) ? this._get('template', opt.template) : opt.template;
		opt.cache = C.isExists(param.cache) ? param.cache : this._getActiveParam('cache');
		
		opt.target = C.isString(opt.target) ? dom.find(opt.target) : opt.target;
		opt.pager = C.isString(opt.pager) ? dom.find(opt.pager) : opt.pager;
		
		opt.filter = this._isStringExpression(opt.filter) ? this._compileFilter(opt.filter) : opt.filter;
		opt.parser = this._isStringExpression(opt.parser) ? this._compileParser(opt.parser) : opt.parser;
		opt.callback = opt.callback && this._isStringExpression(opt.callback) ? this._compileFunc(opt.callback) : opt.callback;
		
		if (clear === true) { opt.cache.iteration = false; }
		
		checkPage = this._get('page') - opt.page;
		this._update('page', opt.page);
		
		// template function 
		/** @private */
		action = function (el, key, data, i, length, cObj, id) {
			// callback
			opt.callback && opt.callback.apply(opt.callback, arguments);
			result += opt.template.apply(opt.template, arguments);
			inc = key;
			
			// cache
 			if (first === false) { first = key; }
				
			return true;
		};
		
		// get collection
		data = C.byLink(opt.collection, this._getActiveParam('context') + C.CHILDREN + ((param && param.context) || ''));
		length = this.length(opt.collection);
		
		// filter length
		/** @private */
		fLength = function (filter, id) {
			if (!fLength.val) {
				fLength.val = self.length(filter || '', id || '');
			}
			
			return fLength.val;
		};
		
		// number of records per page
		breaker = Boolean(opt.breaker && (opt.filter || this._getActiveParam('filter')));
		opt.breaker = opt.breaker || length;
		
		// without cache
		if (C.isPlainObject(data) || !opt.cache || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = !opt.breaker || opt.page === 1 ? 0 : (opt.page - 1) * opt.breaker;
			
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.breaker, start);
			if (opt.cache && opt.cache.iteration === false) { opt.cache.lastIteration = false; }
		
		// with cache
		} else if (C.isArray(data) && opt.cache.iteration === true) {
			// calculate the starting position
			start = !breaker ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.breaker :
							checkPage >= 0 ? opt.cache.firstIteration : opt.cache.lastIteration;
			
			if (breaker) {
				// rewind cached step back
				if (checkPage > 0) {
					checkPage = opt.breaker * checkPage;
					while ((start -= 1) > -1) {
						if (this._customFilter(opt.filter, data[start], data, start, fLength, this, this.ACTIVE, tmpFilter) === true) {
							if (inc === checkPage) {
								break;
							} else { inc += 1; }
						}
					}
					opt.cache.lastIteration = (start += 1);
					from = null;
				} else if (checkPage < 0) { from = -checkPage * opt.breaker - opt.breaker; }
			}
			
			tmpFilter.name && this._drop('filter', '__tmp:' + tmpFilter.name);
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.breaker, from, start);
		}
		
		if (opt.cache) {
			if (checkPage !== 0 && opt.cache.iteration !== false) {
				// cache
				this._get('cache').firstIteration = first;
				this._get('cache').lastIteration = inc + 1;
			}
			if (opt.cache.autoIteration === true) { this._get('cache').iteration = true; }
		}
		
		// clear
		fLength = null;
		
		// parser
		result = !result ? opt.resultNull : this._customParser(opt.parser, result, tmpParser);
		tmpParser.name && this._drop('parser', '__tmp:' + tmpParser.name);
		
		// append to DOM
		if (opt.target === false) {
			if (!opt.variable) {
				this._new('variable', result);
			} else { this._push('variable', opt.variable, result); }
			
			return this;
		} else {
			Array.prototype.forEach.call(opt.target, function (el) {
				// innerHTML
				if (opt.toHTML === 'replace') {
					el.innerHTML = result;
				
				// append
				} else if (opt.toHTML === 'append') {
					el.innerHTML = el.innerHTML + result;
				
				// prepend
				} else { el.innerHTML = result + el.innerHTML; }
			}, this);
		}
		
		if (!opt.pager) { return this; }
		
		// navigation
		opt.nmbOfEntries = opt.filter !== false ? this.length(opt.filter, opt.collection) : length;
		opt.nmbOfEntriesInPage = opt.calculator ? dom.find(opt.calculator, opt.target[0]).length : dom.children(opt.target[0]).length;
		opt.finNumber = opt.breaker * opt.page - (opt.breaker - opt.nmbOfEntriesInPage);

		// generate navigation bar
		if (opt.page !== 1 && opt.nmbOfEntriesInPage === 0) {
			// events
			this.onEmptyPage && (e = this.onEmptyPage.apply(this, arguments));
			if (e === false) { return this; }
			
			this._update('page', (opt.page -= 1)).print(opt, true, true);
		} else { this.easyPage(opt); }
		
		return this;
	};