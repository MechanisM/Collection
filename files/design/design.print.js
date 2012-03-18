	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
		
	/**
	 * templating (in context)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Collection|String} [param.collection=this.ACTIVE] — collection or collection ID
	 * @param {String} [param.context] — additional context
	 * @param {Number} [param.page=this.ACTIVE] — page number
	 * @param {Template} [param.template=this.ACTIVE] — template
	 * @param {Number|Boolean} [param.numberBreak=this.ACTIVE] — number of entries on per page (if false, returns all records)
	 * @param {Number} [param.pageBreak=this.ACTIVE] — number of displayed pages (navigation, > 2)
	 * @param {Selector|Boolean} [param.target=this.ACTIVE] — selector to element to output the result (false — if you print a variable)
	 * @param {String} [param.variable=this.ACTIVE] — variable ID (if param.target === false)
	 * @param {Filter|Boolean} [param.filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {Parser} [param.parser=this.ACTIVE] — parser function or string expression
	 * @param {Boolean} [param.cacheIteration=this.ACTIVE] — if true, the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.ACTIVE] — the selector for the calculation of the number of records
	 * @param {Selector} [param.pager=this.ACTIVE] — selector to pager (navigation)
	 * @param {String} [param.appendType=this.ACTIVE] — type additions to the DOM
	 * @param {String} [param.resultNull=this.ACTIVE] — text displayed if no results
	 * @param {Boolean} [clear=false] — clear the cache
	 * @return {Colletion Object}
	 */
	Collection.prototype.print = function (param, clear) {
		clear = clear || false;
		
		var tmpParser = {}, tmpFilter = {},
			opt = {},
			
			data, length,
			start, inc = 0, checkPage, from = null,
			first = false,
			
			numberBreak,
			
			result = '', action, e,
			
			dom = this.drivers.dom;
			
		// easy implementation
		if (Collection.isExists(param) && (Collection.isString(param) || Collection.isNumber(param))) {
			param = {page: param};
		} else if (!Collection.isExists(param)) { param = {page: this._get('page')}; }
		
		// the expansion of input parameters
		Collection.extend(true, opt, this.dObj.active, param);
		if (param) { opt.page = Collection.expr(opt.page, this._get('page')); }
		if (opt.page < 1) { opt.page = 1; }
		
		opt.collection = Collection.isString(opt.collection) ? this._get('collection', opt.collection) : opt.collection;
		opt.template = Collection.isString(opt.template) ? this._get('template', opt.template) : opt.template;
		opt.cache = Collection.isExists(param.cache) ? param.cache : this._getActiveParam('cache');
		
		opt.target = Collection.isString(opt.target) ? dom.find(opt.target) : opt.target;
		opt.pager = Collection.isString(opt.pager) ? dom.find(opt.pager) : opt.pager;
		
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
		data = Collection.byLink(opt.collection, this._getActiveParam('context') + Collection.CHILDREN + ((param && param.context) || ''));
		length = this.length();
		
		// number of records per page
		numberBreak = Boolean(opt.numberBreak && (opt.filter || this._getActiveParam('filter')));
		opt.numberBreak = opt.numberBreak || length;
		
		// without cache
		if (Collection.isPlainObject(data) || !opt.cache || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = !opt.numberBreak || opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak;
			
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.numberBreak, start);
			if (opt.cache && opt.cache.iteration === false) { opt.cache.lastIteration = false; }
		
		// with cache
		} else if (Collection.isArray(data) && opt.cache.iteration === true) {
			// calculate the starting position
			start = !numberBreak ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak :
							checkPage >= 0 ? opt.cache.firstIteration : opt.cache.lastIteration;
			
			if (numberBreak) {
				// rewind cached step back
				if (checkPage > 0) {
					checkPage = opt.numberBreak * checkPage;
					while ((start -= 1) > -1) {
						if (this._customFilter(opt.filter, data[start], data, start, length, this, this.ACTIVE, tmpFilter) === true) {
							if (inc === checkPage) {
								break;
							} else { inc += 1; }
						}
					}
					opt.cache.lastIteration = (start += 1);
					from = null;
				} else if (checkPage < 0) { from = -checkPage * opt.numberBreak - opt.numberBreak; }
			}
			
			tmpFilter.name && this._drop('filter', '__tmp:' + tmpFilter.name);
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.numberBreak, from, start);
		}
		
		if (opt.cache) {
			if (checkPage !== 0 && opt.cache.iteration !== false) {
				// cache
				this._get('cache').firstIteration = first;
				this._get('cache').lastIteration = inc + 1;
			}
			if (opt.cache.autoIteration === true) { this._get('cache').iteration = true; }
		}
		
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
				if (opt.appendType === 'html') {
					el.innerHTML = result;
				
				// append
				} else if (opt.appendType === 'append') {
					el.innerHTML = el.innerHTML + result;
				
				// prepend
				} else { el.innerHTML = result + el.innerHTML; }
			}, this);
		}
		
		if (!opt.pager) { return this; }
		
		// navigation
		opt.nmbOfEntries = opt.filter !== false ? this.length(opt.filter) : length;
		opt.nmbOfEntriesInPage = opt.calculator ? dom.find(opt.calculator, opt.target[0]).length : dom.children(opt.target[0]).length;
		opt.finNumber = opt.numberBreak * opt.page - (opt.numberBreak - opt.nmbOfEntriesInPage);

		// generate navigation bar
		if (opt.page !== 1 && opt.nmbOfEntriesInPage === 0) {
			// events
			this.onIPage && (e = this.onIPage.apply(this, arguments));
			if (e === false) { return this; }
			
			this._update('page', (opt.page -= 1)).print(opt, true, true);
		} else { this.easyPage(opt); }
		
		return this;
	};
	
	/**
	 * activation of the navigation<br />
	 * info: page, total, from, to, inPage, nmbOfPages<br />
	 * nav: first, prev, next, last, numberSwitch, pageList
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param] — object settings
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	Collection.prototype.easyPage = function (param) {
		var self = this,
			str = '',
			
			// number of pages
			nmbOfPages = param.nmbOfPages || (param.nmbOfEntries % param.numberBreak !== 0 ? ~~(param.nmbOfEntries / param.numberBreak) + 1 : param.nmbOfEntries / param.numberBreak),
			
			/** @private */
			genPage = function (data, classes, i, nSwitch) {
				nSwitch = nSwitch || false;
				var key, str = '<' + (data.tag || 'span') + ' ' + (!nSwitch ? 'data-page="' : 'data-number-break="') + i + '"';
				
				if (data.attr) {
					for (key in data.attr) {
						if (!data.attr.hasOwnProperty(key)) { continue; }
						str += ' ' + key + '="' + data.attr[key] + '"';
					}
				}
				
				if ((!nSwitch && i === param.page) || (nSwitch && i === param.numberBreak)) { str += ' class="' + (classes && classes.active || 'active') + '"'; }
				return str += '>' + i + '</' + (data.tag || 'span') + '>';
			},
			
			/** @private */
			wrap = function (val, tag) {
				if (tag === 'select') {
					return '<option value="' + val + '">' + val + '</option>';
				}
				
				return val;
			},
			
			
			i, j = 0, from, to, dom = this.drivers.dom;
		
		// for each node
		Array.prototype.forEach.call(param.pager, function (el) {
			Array.prototype.forEach.call(dom.find('.ctm', el), function (el) {
				if (param.pageBreak <= 2) { throw new Error('parameter "pageBreak" must be more than 2'); }
				str = '';
				
				var tag = el.tagName.toLowerCase(),
					
					data = dom.data(el),
					ctm = data.ctm,
					classes = ctm.classes;
				
				if (ctm.nav) {
					// attach event
					if (Collection.find(ctm.nav, ['first', 'prev', 'next', 'last']) && !data['ctm-delegated']) {
						dom.bind(el, 'click', function () {
							if (!dom.hasClass(this, ctm.classes && ctm.classes.disabled || 'disabled')) {
								ctm.nav === 'first' && (param.page = 1);
								ctm.nav === 'prev' && (param.page = '-=1');
								ctm.nav === 'next' && (param.page = '+=1');
								ctm.nav === 'last' && (param.page = nmbOfPages);
								
								self.print(param);
							}
						});
						el.setAttribute('data-ctm-delegated', true);
					}
					
					// adding classes status
					if ((Collection.find(ctm.nav, ['first', 'prev']) && param.page === 1) || (Collection.find(ctm.nav, ['next', 'last']) && param.finNumber === param.nmbOfEntries)) {
						dom.addClass(el, classes && classes.disabled || 'disabled');
					} else if (Collection.find(ctm.nav, ['first', 'prev', 'next', 'last'])) {
						dom.removeClass(el, classes && classes.disabled || 'disabled');
					}
					
					// numberBreak switch
					if (ctm.nav === 'numberSwitch') {
						ctm.val.forEach(function (el) {
							if (tag === 'select') {
								str += '<option vale="' + el + '" ' + (el === param.numberBreak ? 'selected="selected"' : '') + '>' + el + '</option>';
							} else { str += genPage(ctm, classes || '', el, true); }
						});
					}
					
					// page navigation
					if (ctm.nav === 'pageList') {
						if (tag === 'select') {
							for (i = 0; (i += 1) <= nmbOfPages;) {
								str += '<option vale="' + i + '" ' + (i === param.page ? 'selected="selected"' : '') + '>' + i + '</option>';
							} 
						} else {
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
									str += genPage(ctm, classes || '', i);
								}
							} else { for (i = 0; (i += 1) <= nmbOfPages;) { str += genPage(ctm, classes || '', i); } }
						}
					}
					
					if (ctm.nav === 'numberSwitch' || ctm.nav === 'pageList') {	
						// to html
						el.innerHTML = str;
						
						// delegate event
						if (!data['ctm-delegated']) {
							if (tag !== 'select') {
								dom.bind(el, 'click', function (e) {
									e = e || window.event;
									var target = e.target || e.srcElement, data = dom.data(target);
									if (target.parentNode !== el) { return false; }
									
									if (ctm.nav === 'pageList') {
										param.page = +data.page;
									} else {
										self._push('numberBreak', param.name || '', +data['number-break']);
										delete param.numberBreak;
									}
	
									self.print(param);
								});
							
							// if select
							} else {
								dom.bind(el, 'change', function () {
									var option = dom.children(this, 'selected')[0];
									
									if (param.page !== option.value) {
										if (data.nav === 'pageList') {
											param.page = +option.value;
										} else {
											self._push('numberBreak', param.name || '', +option.value);
											delete param.numberBreak;
										}
										
										self.print(param);
									}
								});
							}
							
							el.setAttribute('data-ctm-delegated', true);
						}
					}
				
				// info
				} else if (ctm.info) {
					if (param.nmbOfEntriesInPage === 0) {
						dom.addClass(el, classes && classes.noData || 'no-data');
					} else { dom.removeClass(el, classes && classes.noData || 'no-data'); }
					
					switch (ctm.info) {
						case 'page' : {
							if (tag === 'input') {
								el.value = wrap(param.page, tag);
							} else { el.innerHTML = wrap(param.page, tag); }
						} break;
						case 'total' : {
							if (tag === 'input') {
								el.value = wrap(param.nmbOfEntries, tag);
							} else { el.innerHTML = wrap(param.nmbOfEntries, tag); }
						} break;
						case 'from' : {
							if (tag === 'input') {
								el.value = wrap((param.page - 1) * param.numberBreak + 1, tag);
							} else { el.innerHTML = wrap((param.page - 1) * param.numberBreak + 1, tag); }
						} break;
						case 'to' : {
							if (tag === 'input') {
								el.value = wrap(param.finNumber, tag);
							} else { el.innerHTML = wrap(param.finNumber, tag); }
						} break;
						case 'inPage' : {
							if (tag === 'input') {
								el.value = wrap(param.nmbOfEntriesInPage, tag);
							} else { el.innerHTML = wrap(param.nmbOfEntriesInPage, tag); }
						} break;
						case 'nmbOfPages' : {
							if (tag === 'input') {
								el.value = wrap(nmbOfPages, tag);
							} else { el.innerHTML = wrap(nmbOfPages, tag); }
						} break;
					}
				}
			});
		});
		
		return this;
	};