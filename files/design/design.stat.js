	
	/////////////////////////////////
	//// design methods (static models)
	/////////////////////////////////
	
	Collection.tpl = {
		// navigation
		nav: {
			event: [
				{
					val: ['first', 'prev', 'next', 'last'],
					func: function (info) {
						var	self = this,
							param = info.param,
							disabled = info.ctm.classes && info.ctm.classes.disabled || this.DISABLED
						
						dom.bind(info.el, 'click', function () {
							if (!dom.hasClass(this, disabled)) {
								info.key === 'first' && (param.page = 1);
								info.key === 'prev' && (param.page = '-=1');
								info.key === 'next' && (param.page = '+=1');
								info.key === 'last' && (param.page = info.nmbOfPages);
								
								self.print(param);
							}
						});
						
						info.el.setAttribute('data-' + this.CTM + '-event', true);
					}
				},
				
				{
					val: ['numberSwitch', 'pageList'],
					func: function (info) {
						var self = this,
							param = info.param;
						
						if (!info.data[this.CTM + '-event']) {
							if (info.tag !== 'select') {
								dom.bind(info.el, 'click', function (e) {
									e = e || window.event;
									var target = e.target || e.srcElement,
										data = dom.data(target);
									
									if (target.parentNode !== el) { return false; }
									
									if (info.key === 'pageList') {
										param.page = +data.page;
									} else {
										self._push('breaker', param.name || '', +data['breaker']);
										delete param.breaker;
									}
									
									self.print(param);
								});
							
							// if select
							} else {
								dom.bind(info.el, 'change', function () {
									var option = dom.children(this, 'selected')[0];
									
									if (param.page !== option.value) {
										if (info.key === 'pageList') {
											param.page = +option.value;
										} else {
											self._push('breaker', param.name || '', +option.value);
											delete param.breaker;
										}
										
										self.print(param);
									}
								});
							}
							
							info.el.setAttribute('data-' + this.CTM + '-event', true);
						}
					}
				}
			],
			
			action: [
				{
					val: ['first', 'prev', 'next', 'last'],
					func: function (info) {
						var	param = info.param,
							disabled = info.ctm.classes && info.ctm.classes.disabled || this.DISABLED;
						
						if ((['first', 'prev'].indexOf(info.key) !== -1 && param.page === 1)
							|| (['next', 'last'].indexOf(info.key) !== -1 && param.finNumber === param.nmbOfEntries)) {
								dom.addClass(info.el, disabled);
						} else { dom.removeClass(info.el, disabled); }
					}
				},
				{
					val: 'numberSwitch',
					func: function (info) {
						var	str = '';
						
						info.ctm.val.forEach(function (el) {
							if (info.tag === 'select') {
								str += '<option value="' + el + '" ' + (el === info.param.breaker ? 'selected="selected"' : '') + '>' + el + '</option>';
							} else { str += this._genPage(ctm, el, info.ctm.classes || '', true); }
						}, this);
						
						info.el.innerHTML = str;
					}
				},
				
				{
					val: 'pageList',
					func: function (info) {
						var	param = info.param,
							classes = info.ctm.classes,
							
							str = '',
							from, to,
							i, j = 0;
						
						if (info.tag === 'select') {
							for (i = 0; (i += 1) <= info.nmbOfPages;) {
								str += '<option vale="' + i + '" ' + (i === param.page ? 'selected="selected"' : '') + '>' + i + '</option>';
							} 
						} else {
							if (info.nmbOfPages > param.pageBreak) {
								j = param.pageBreak % 2 !== 0 ? 1 : 0;
								from = (param.pageBreak - j) / 2;
								to = from;
								
								if (param.page - j < from) {
									from = 0;
								} else {
									from = param.page - from - j;
									if (param.page + to > info.nmbOfPages) {
										from -= param.page + to - info.nmbOfPages;
									}
								}
								
								for (i = from, j = -1; (i += 1) <= info.nmbOfPages && (j += 1) !== null;) {
									if (j === param.pageBreak && i !== param.page) { break; }
									str += this._genPage(ctm, i, classes || '');
								}
							} else { for (i = 0; (i += 1) <= info.nmbOfPages;) { str += this._genPage(ctm, i, classes || ''); } }
						}
					}
				}
			]
		},
		
		// information
		info: {
			action: [
				{
					func: function (info) {
						var noData = info.ctm.classes && info.ctm.classes.noData || this.NO_DATA
						
						if (info.param.nmbOfEntriesInPage === 0) {
							dom.addClass(info.el, noData);
						} else {
							dom.removeClass(info.el, noData);
						}
					}
				},
				{
					func: function (info) {
						var res = this._wrap(info.param.page, info.tag);
						
						if (info.tag === 'input') {
							info.el.value = res;
						} else { info.el.innerHTML = res; }
					}
				},
				{
					val: 'page',
					func: function (info) {
						var res = this._wrap(info.param.page, info.tag);
						
						if (info.tag === 'input') {
							info.el.value = res;
						} else { info.el.innerHTML = res; }
					}
				},
				{
					val: 'total',
					func: function (info) {
						var res = this._wrap(info.param.nmbOfEntries, info.tag);
						
						if (info.tag === 'input') {
							info.el.value = res;
						} else { info.el.innerHTML = res; }
					}
				},
				{
					val: 'from',
					func: function (info) {
						var res = this._wrap((info.param.page - 1) * info.param.breaker + 1, info.tag);
						
						if (info.tag === 'input') {
							info.el.value = res;
						} else { info.el.innerHTML = res; }
					}
				},
				{
					val: 'to',
					func: function (info) {
						var res = this._wrap(info.param.finNumber, info.tag);
						
						if (info.tag === 'input') {
							info.el.value = res;
						} else { info.el.innerHTML = res; }
					}
				},
				{
					val: 'inPage',
					func: function (info) {
						var res = this._wrap(info.param.nmbOfEntriesInPage, info.tag);
						
						if (info.tag === 'input') {
							info.el.value = res;
						} else { info.el.innerHTML = res; }
					}
				},
				{
					val: 'nmbOfPages',
					func: function (info) {
						var res = this._wrap(info.nmbOfPages, info.tag);
						
						if (info.tag === 'input') {
							info.el.value = res;
						} else { info.el.innerHTML = res; }
					}
				}
			]
		}
	};