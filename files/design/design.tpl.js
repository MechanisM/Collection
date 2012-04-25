	
	/////////////////////////////////
	//// design methods (template model)
	/////////////////////////////////	
	
	/**
	 * wrap in a specific tag
	 * 
	 * @this {Colletion Object}
	 * @param {String|Number} val — some value
	 * @param {String} tag — the specified tag
	 * @return {String}
	 */
	Collection.prototype._wrap = function (val, tag) {
		if (tag === 'select') {
			return '<option value="' + val + '">' + val + '</option>';
		}
		
		return val.toString();
	};
	
	/**
	 * generate navigation pages
	 * 
	 * @this {Colletion Object}
	 * @param {Plain Object} data — data attribute of the element
	 * @param {Number} i — iteration
	 * @param {Plain Object} [classes] — information about the classes
	 * @param {Boolean} nSwitch — for numberSwitch
	 * @return {String}
	 */
	Collection.prototype._genPage = function (data, i, classes, nSwitch) {
		nSwitch = nSwitch || false;
		var str = '<' + (data.tag || this.SIMPLE_TAG) + ' ' + (!nSwitch ? 'data-page="' : 'data-breaker="') + i + '"',
			attr = data.attr, key;
		
		if (attr) {
			for (key in attr) {
				if (!attr.hasOwnProperty(key)) { continue; }
				str += ' ' + key + '="' + attr[key] + '"';
			}
		}
		
		if ((!nSwitch && i === param.page) || (nSwitch && i === param.breaker)) {
			str += ' class="' + (classes && classes.active || this.ACTIVE) + '"';
		}
		
		return str += '>' + i + '</' + (data.tag || this.SIMPLE_TAG) + '>';
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
		if (param.navBreaker <= 2) { throw new Error('parameter "navBreaker" must be more than 2'); }
		
		var self = this,
			
			// number of pages
			nmbOfPages = param.nmbOfPages
				|| (param.nmbOfEntries % param.breaker !== 0
					? ~~(param.nmbOfEntries / param.breaker) + 1
						: param.nmbOfEntries / param.breaker);
		
		Array.prototype.forEach.call(param.pager, function (el) {
			Array.prototype.forEach.call(dom.find('.' + self.CTM, el), function (node) {
				var	// data attribute
					data = dom.data(node),
					// ctm info
					ctm = data[self.CTM],
					
					info = {
						param: param,
						nmbOfPages: nmbOfPages,
						
						el: node,
						tag: node.tagName.toLowerCase(),
						
						data: data,
						ctm: ctm
					},
					
					key, type;
				
				for (key in ctm) {
					if (!ctm.hasOwnProperty(key) || !C.tpl[key]) { continue; }
					
					// tpl type
					type = C.tpl[key];
					info.key = ctm[key];
					
					// attach events
					if (type.event) {
						type.event.forEach(function (el) {
							if ((typeof el.val === 'undefined' || el.val === ctm[key] || el.val.indexOf(ctm[key])) !== -1 && !data['ctm-event']) {
								el.func.call(self, info);
							}
						});
					}
					
					// execute callbacks
					if (type.action) {
						type.action.forEach(function (el) {
							if (typeof el.val === 'undefined' || el.val === ctm[key] || el.val.indexOf(ctm[key]) !== -1) {
								el.func.call(self, info);
							}
						});
					}
				}
			});
		});
		
		return this;
	};