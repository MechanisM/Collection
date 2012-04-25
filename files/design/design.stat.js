	
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
							param = info.param;
						
						dom.bind(info.el, 'click', function () {
							if (!dom.hasClass(this, classes && classes.disabled || self.DISABLED)) {
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
								dom.bind(info.node, 'click', function (e) {
									e = e || window.event;
									var target = e.target || e.srcElement,
										data = dom.data(target);
									
									if (target.parentNode !== el) { return false; }
									
									if (info.key === 'pageList') {
										info.param.page = +data.page;
									} else {
										self._push('breaker', info.param.name || '', +data['breaker']);
										delete info.param.breaker;
									}
									
									self.print(info.param);
								});
							
							// if select
							} else {
								dom.bind(info.node, 'change', function () {
									var option = dom.children(this, 'selected')[0];
									
									if (info.param.page !== option.value) {
										if (info.key === 'pageList') {
											info.param.page = +option.value;
										} else {
											self._push('breaker', info.param.name || '', +option.value);
											delete info.param.breaker;
										}
										
										self.print(info.param);
									}
								});
							}
							
							info.node.setAttribute('data-ctm-event', true);
						}
					}
				}
			],
			
			action: [
				{
					val: ['first', 'prev', 'next', 'last'],
					func: function (info) {
						var	self = this,
							
							key = info.key,
							param = info.param,
							
							node = info.node,
							
							ctm = info.ctm,
							classes = ctm.classes;
						
						if ((['first', 'prev'].indexOf(key) !== -1 && param.page === 1)
							|| (['next', 'last'].indexOf(key) && param.finNumber === param.nmbOfEntries)) {
								dom.addClass(node, classes && classes.disabled || this.DISABLED);
						} else {
							dom.removeClass(node, classes && classes.disabled || this.DISABLED);
						}
					}
				},
				{
					val: 'numberSwitch',
					func: function (info) {
						var	self = this,
							str = '';
							
						info.ctm.val.forEach(function (el) {
							if (info.tag === 'select') {
								str += '<option value="' + el + '" ' + (el === info.param.numberBreak ? 'selected="selected"' : '') + '>' + el + '</option>';
							} else { str += self._genPage(ctm, classes || '', el, true); }
						});
						
						info.node.innerHTML = str;
					}
				},
				
				{
					val: 'pageList',
					func: function (info) {
						var	self = this,
							str = '',
							
							from, to,
							i, j = 0;
							
						if (info.tag === 'select') {
							for (i = 0; (i += 1) <= info.nmbOfPages;) {
								str += '<option vale="' + i + '" ' + (i === info.param.page ? 'selected="selected"' : '') + '>' + i + '</option>';
							} 
						} else {
							if (info.nmbOfPages > info.param.pageBreak) {	
								j = info.param.pageBreak % 2 !== 0 ? 1 : 0;
								from = (info.param.pageBreak - j) / 2;
								to = from;
								
								if (info.param.page - j < from) {
									from = 0;
								} else {
									from = info.param.page - from - j;
									if (info.param.page + to > info.nmbOfPages) {
										from -= info.param.page + to - info.nmbOfPages;
									}
								}
								
								for (i = from, j = -1; (i += 1) <= info.nmbOfPages && (j += 1) !== null;) {
									if (j === info.param.pageBreak && i !== param.page) { break; }
									str += this._genPage(ctm, classes || '', i);
								}
							} else { for (i = 0; (i += 1) <= info.nmbOfPages;) { str += this._genPage(ctm, classes || '', i); } }
						}
					}
				}
			]
		},
		
		info: {
			action: [
				{
					func: function (info) {
						var className = info.ctm.classes && info.ctm.classes.noData || this.NO_DATA
						
						if (info.param.nmbOfEntriesInPage === 0) {
							dom.addClass(info.node, className);
						} else {
							dom.removeClass(info.node, className);
						}
					}
				},
				{
					func: function (info) {
						var res = this._wrap(info.param.page, info.tag);
						
						if (info.tag === 'input') {
							info.node.value = res;
						} else { info.node.innerHTML = res; }
					}
				},
				{
					val: 'page',
					func: function (info) {
						var res = this._wrap(info.param.page, info.tag);
						
						if (info.tag === 'input') {
							info.node.value = res;
						} else { info.node.innerHTML = res; }
					}
				},
				{
					val: 'total',
					func: function (info) {
						var res = this._wrap(info.param.nmbOfEntries, info.tag);
						
						if (info.tag === 'input') {
							info.node.value = res;
						} else { info.node.innerHTML = res; }
					}
				},
				{
					val: 'from',
					func: function (info) {
						var res = this._wrap((info.param.page - 1) * info.param.breaker + 1, info.tag);
						
						if (info.tag === 'input') {
							info.node.value = res;
						} else { info.node.innerHTML = res; }
					}
				},
				{
					val: 'to',
					func: function (info) {
						var res = this._wrap(info.param.finNumber, info.tag);
						
						if (info.tag === 'input') {
							info.node.value = res;
						} else { info.node.innerHTML = res; }
					}
				},
				{
					val: 'inPage',
					func: function (info) {
						var res = this._wrap(info.param.nmbOfEntriesInPage, info.tag);
						
						if (info.tag === 'input') {
							info.node.value = res;
						} else { info.node.innerHTML = res; }
					}
				},
				{
					val: 'nmbOfPages',
					func: function (info) {
						var res = this._wrap(info.nmbOfPages, info.tag);
						
						if (info.tag === 'input') {
							info.node.value = res;
						} else { info.node.innerHTML = res; }
					}
				}
			]
		}
	};