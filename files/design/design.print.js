	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
		
	/**
	 * templating (in context)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {C|String} [param.collection=this.ACTIVE] — collection or collection ID
	 * @param {String} [param.context] — additional context
	 * @param {Number} [param.page=this.ACTIVE] — page number
	 * @param {Template} [param.template=this.ACTIVE] — template
	 * @param {Number|Boolean} [param.numberBreak=this.ACTIVE] — number of entries on per page (if 'false', returns all records)
	 * @param {Number} [param.pageBreak=this.ACTIVE] — number of displayed pages (navigation, > 2)
	 * @param {jQuery Object|Boolean} [param.target=this.ACTIVE] — element to output the result ('false' - if you print a variable)
	 * @param {String} [param.variable=this.ACTIVE] — variable ID (if param.target === false)
	 * @param {Filter|Boolean} [param.filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {Parser} [param.parser=this.ACTIVE] — parser function or string expression
	 * @param {Boolean} [param.cacheIteration=this.ACTIVE] — if 'true', the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.ACTIVE] — the selector for the calculation of the number of records
	 * @param {Selector} [param.pager=this.ACTIVE] — selector to pager (navigation)
	 * @param {String} [param.appendType=this.ACTIVE] — type additions to the DOM
	 * @param {String} [param.resultNull=this.ACTIVE] — text displayed if no results
	 * @param {Boolean} [clear=false] — clear the cache
	 * @return {Colletion Object}
	 */
	C.prototype.print = function (param, clear) {
		clear = clear || false;
		
		var
			tmpParser = {}, tmpFilter = {},
			opt = {},
			
			cObj, cOLength,
			start, inc = 0, checkPage, from = null,
			first = false,
			
			numberBreak,
			
			result = '', action, e,
			
			dom = this.drivers.dom;
			
		// easy implementation
		if (C.isExists(param) && (C.isString(param) || C.isNumber(param))) {
			param = {page: param};
		} else if (!C.isExists(param)) { param = {page: this._get('page')}; }
		
		C.extend(true, opt, this.dObj.active, param);
		if (param) { opt.page = C.expr(opt.page, this._get('page')); }
		if (opt.page < 1) { opt.page = 1; }
		
		opt.collection = C.isString(opt.collection) ? this._get('collection', opt.collection) : opt.collection;
		opt.template = C.isString(opt.template) ? this._get('template', opt.template) : opt.template;
		opt.cache = C.isExists(param.cache) ? param.cache : this._getActiveParam('cache');
		
		opt.target = C.isString(opt.target) ? dom.find(opt.target) : opt.target;
		opt.pager = C.isExists(opt.pager) ? dom.find(opt.pager) : opt.pager;
		
		if (clear === true) { opt.cache.iteration = false; }
		
		checkPage = this._get('page') - opt.page;
		this._update('page', opt.page);
		
		// template function 
		/** @private */
		action = function (el, i, data, cOLength, self, id) {
			// callback
			opt.callback && opt.callback.apply(opt.callback, arguments);
			result += opt.template.apply(opt.template, arguments);
			inc = i;
			
			// cache
 			if (first === false) { first = i; }
				
			return true;
		};
		
		// get collection
		cObj = C.byLink(opt.collection, this._getActiveParam('context') + C.CHILDREN + ((param && param.context) || ''));
		cOLength = this.length();
		
		// number of records per page
		numberBreak = Boolean(opt.numberBreak && (opt.filter || this._getActiveParam('filter')));
		opt.numberBreak = opt.numberBreak || cOLength;
		
		// without cache
		if (C.isPlainObject(cObj) || !opt.cache || opt.cache.iteration === false || opt.cache.firstIteration === false || opt.cache.lastIteration === false) {
			start = !opt.numberBreak || opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak;
			
			this.forEach(action, opt.filter, this.ACTIVE, true, opt.numberBreak, start);
			if (opt.cache && opt.cache.iteration === false) { opt.cache.lastIteration = false; }
		
		// with cache
		} else if (C.isArray(cObj) && opt.cache.iteration === true) {
			// calculate the starting position
			start = !numberBreak ?
						opt.page === 1 ? 0 : (opt.page - 1) * opt.numberBreak :
							checkPage >= 0 ? opt.cache.firstIteration : opt.cache.lastIteration;
			
			if (numberBreak) {
				// rewind cached step back
				if (checkPage > 0) {
					checkPage = opt.numberBreak * checkPage;
					while ((start -= 1) > -1) {
						if (this._customFilter(opt.filter, cObj[start], cObj, start, cOLength, this, this.ACTIVE, tmpFilter) === true) {
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
		
		opt.nmbOfEntries = opt.filter !== false ? this.length(opt.filter) : cOLength;
		opt.nmbOfEntriesInPage = opt.calculator ? dom.find(opt.calculator, opt.target[0]).length : opt.target[0].childNodes.length;
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
	C.prototype.easyPage = function (param) {
		var
			self = this,
			str = '',
			
			// number of pages
			nmbOfPages = param.nmbOfPages || (param.nmbOfEntries % param.numberBreak !== 0 ? ~~(param.nmbOfEntries / param.numberBreak) + 1 : param.nmbOfEntries / param.numberBreak),
			
			/** @private */
			genPage = function (data, classes, i, nSwitch) {
				nSwitch = nSwitch || false;
				var key, str = '<' + (data.tag || 'span') + ' ' + (!nSwitch ? 'data-page="' : 'data-number-break="') + i + '"';
				
				if (data.attr) {
					for (key in data.attr) {
						if (data.attr.hasOwnProperty(key)) {
							str += ' ' + key + '="' + data.attr[key] + '"';
						}
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
		Array.prototype.forEach.call(dom.find('.ctm', param.pager), function (el) {
			if (param.pageBreak <= 2) { throw new Error('parameter "pageBreak" must be more than 2'); }
			str = '';
			
			var
				tag = el.tagName.toLowerCase(),
				type = tag === 'input' ? 'val' : 'html',
				
				data = dom.data(el),
				
				ctm = data.ctm,
				classes = ctm.classes;
			
			if (ctm.nav) {
				// attach event
				if (C.find(data.nav, ['first', 'prev', 'next', 'last']) && data['ctm-delegated']) {
					dom.click(el, function () {
						var $this = $(this);
						
						if (!$this.hasClass(data.classes && data.classes.disabled || 'disabled')) {
							data.nav === 'first' && (param.page = 1);
							data.nav === 'prev' && (param.page = '-=1');
							data.nav === 'next' && (param.page = '+=1');
							data.nav === 'last' && (param.page = nmbOfPages);
							
							self.print(param);
						}
					});
					el.setAttribute('data-ctm-delegated', true);
				}
				
				if ((C.find(data.nav, ['first', 'prev']) && param.page === 1) || (C.find(data.nav, ['next', 'last']) && param.finNumber === param.nmbOfEntries)) {
					$this.addClass(classes && classes.disabled || 'disabled');
				} else if (C.find(data.nav, ['first', 'prev', 'next', 'last'])) { $this.removeClass(classes && classes.disabled || 'disabled'); }
				
				// numberBreak switch
				if (data.nav === 'numberSwitch') {
					data.val.forEach(function (el) {
						if (tag === 'select') {
							str += '<option vale="' + el + '" ' + (el === param.numberBreak ? 'selected="selected"' : '') + '>' + el + '</option>';
						} else {
							str += genPage(data, classes || '', el, true);
						}
					});
				}
				
				// page
				if (data.nav === 'pageList') {
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
								str += genPage(data, classes || '', i);
							}
						} else { for (i = 0; (i += 1) <= nmbOfPages;) { str += genPage(data, classes || '', i); } }
					}
				}
				
				if (data.nav === 'numberSwitch' || data.nav === 'pageList') {	
					// to html
					$this.html(str);
					
					// delegate event
					if (!$this.data('ctm-delegated')) {
						if (tag !== 'select') {
							$this.on('click', data.tag || 'span', function () {
								var $this = $(this);
								
								if (param.page !== $this.data('page')) {
									if (data.nav === 'pageList') {
										param.page = +$this.data('page');
									} else {
										self._push('numberBreak', param.name || '', +$this.data('number-break'));
										delete param.numberBreak;
									}

									self.print(param);
								}
							});
						
						// if select
						} else {
							$this.on('change', function () {
								var $this = $(this).children(':selected');
								
								if (param.page !== $this.val()) {
									if (data.nav === 'pageList') {
										param.page = +$this.val();
									} else {
										self._push('numberBreak', param.name || '', +$this.val());
										delete param.numberBreak;
									}
									
									self.print(param);
								}
							});
						}
						
						$this.data('ctm-delegated', true);
					}
				}
			
			// info
			} else if (data.info) {
				if (param.nmbOfEntriesInPage === 0) {
					$this.addClass(classes && classes.noData || 'no-data');
				} else { $this.removeClass(classes && classes.noData || 'no-data'); }
				
				switch (data.info) {
					case 'page' : { $this[type](wrap(param.page, tag)); } break;
					case 'total' : { $this[type](wrap(param.nmbOfEntries, tag)); } break;
					case 'from' : { $this[type](wrap((param.page - 1) * param.numberBreak + 1, tag)); } break;
					case 'to' : { $this[type](wrap(param.finNumber, tag)); } break;
					case 'inPage' : { $this[type](wrap(param.nmbOfEntriesInPage, tag)); } break;
					case 'nmbOfPages' : { $this[type](wrap(nmbOfPages, tag)); } break;
				}
			}
		});
		
		return this;
	};