	
	/////////////////////////////////
	//// DOM methods
	/////////////////////////////////
	
	// drivers for additional functions
	C.drivers.dom = {
		/** @private */
		find: function (selector, context) {
			return this.engines[this.lib].find(selector || '', context || '');
		},
		
		/**
		 * returns the data attributes of the node
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} [name] — data name
		 * @return {Collection DOM Driver}
		 */
		data: function (el, name) {
			var attr = el.attributes, data = {};
	
			if (attr && attr.length > 0) {
				Array.prototype.forEach.call(attr, function (el) {
					if (el.name.substring(0, 5) === 'data-') {
						data[el.name.replace('data-', '')] = C.isString(el.value) && el.value.search(/^\{|\[/) !== -1 ? JSON.parse(el.value) : el.value;
					}
				});
			}
			
			if (name) { return data[name]; }
			return data;
		},
		
		/**
		 * returns the text content of the node
		 * 
		 * @this {Collection}
		 * @param {DOM Node} el — DOM node
		 * @return {String|Boolean}
		 */
		text: function (el) {
			el = el.childNodes;		
			
			var
				eLength = el.length,
				i = -1,
				str = '';
			
			while ((i += 1) < eLength) {
				if (el[i].nodeType === 3 && C.trim(el[i].textContent)) { str += el[i].textContent; }
			}
			
			if (str) { return str; }
			
			return false;
		},
		
		/**
		 * attach onclick event
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} [name] — data name
		 * @return {Collection DOM Driver}
		 */
		click: function (el, callback) {
			if (this.engines[this.lib].click) {
				this.engines[this.lib].click(el, callback);
				
				return this;
			}
			
			// if old IE
			if (document.attachEvent) {
				el.attachEvent('onclick', callback);
			} else { el.addEventListener('click', callback); }
			
			return this;
		},
		
		/**
		 * attach onclick event
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} [name] — data name
		 * @return {Collection DOM Driver}
		 */
		addClass: function (el, callback) {
			for (var key in this.engines) {
				if (!this.engines.hasOwnProperty(key)) { continue; }
				
				if (this.engines[key].is() && this.engines[key].click) {
					this.engines[key].click(el, callback);
					
					return this;
				}
			}
			
			// if old IE
			if (document.attachEvent) {
				el.attachEvent('onclick', callback);
			} else { el.addEventListener('click', callback); }
			
			return this;
		},
		
		// search frameworks
		engines: {
			// qsa css selector engine
			qsa: {
				/** @private */
				is: function () {
					if (typeof qsa !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					return qsa.querySelectorAll(selector, context);
				}
			},
			// sizzle 
			sizzle: {
				/** @private */
				is: function () {
					if (typeof Sizzle !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					return Sizzle(selector, context);
				}
			},
			// jQuery 
			jQuery: {
				/** @private */
				is: function () {
					if (typeof jQuery !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					return jQuery(selector, context);
				},
				/** @private */
				click: function (el, callback) { $(el).click(callback); }
			},
			// dojo 
			dojo: {
				/** @private */
				is: function () {
					if (typeof dojo !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					return dojo.query(selector, context);
				},
				/** @private */
				click: function (el, callback) { dojo.connect(el, 'onclick', callback); }
			},
			// mootools 
			mootools: {
				/** @private */
				is: function () {
					if (typeof Element.getElements !== 'undefined') { return true; }
				},
				/** @private */
				find: function (selector, context) {
					var res;
					
					if (context) {
						res = [];
						
						$$(context).getElements(selector).forEach(function (el) {
							el.forEach(function (el) { res.push(el); });
						});
					} else { res = $$(selector); }
					
					return res;
				}
			}
		}
	};
	
	(function () {
		var key, engines = C.drivers.dom.engines;
		
		for (key in engines) {
			if (!engines.hasOwnProperty(key)) { continue; }
					
			if (engines[key].is()) {
				C.drivers.dom.lib = key;
				
				return true;
			}
		}
	})();