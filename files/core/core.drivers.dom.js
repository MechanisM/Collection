	
	/////////////////////////////////
	//// DOM methods
	/////////////////////////////////
	
	/** @private */
	Collection.drivers.dom = {
		/**
		 * returns a list of the elements within the document
		 * 
		 * @this {Collection DOM Driver}
		 * @param {String} selector — is a string containing one or more CSS selectors separated by commas
		 * @param {DOM node} [context] — context
		 * @throw {Error}
		 * @return {mixin}
		 */
		find: function (selector, context) {
			if (!this.lib) { throw new Error('DOM driver is not defined!'); }
			
			return this.engines[this.lib].find(selector || '', context || '');
		},
		
		/**
		 * returns all direct child elements
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} [attr] — the properties of a node
		 * @return {Array}
		 */
		children: function (el, prop) {
			var res = [];
			Array.prototype.forEach.call(el.childNodes, function (el) {
				if (el.nodeType === 1) {
					if (!prop) {
						res.push(el);
					} else if (el[prop]) { res.push(el); }
				}
			});
			
			return res;
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
						// parsing JSON if need
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
			var str = '';
			
			Array.prototype.forEach.call(el, function (el) {
				if (el.nodeType === 3 && el.textContent.trim()) { str += el.textContent; }
			});
			
			if (str) { return str; }
			
			return false;
		},
		
		/**
		 * attach event
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} eventType — event type
		 * @param {Function} callback — callback function
		 * @return {Collection DOM Driver}
		 */
		bind: function (el, eventType, callback) {
			if (this.engines[this.lib][eventType]) {
				this.engines[this.lib][eventType](el, callback);
				
				return this;
			}
			
			// if old IE
			if (document.attachEvent) {
				el.attachEvent('on' + eventType, callback);
			} else { el.addEventListener(eventType, callback); }
			
			return this;
		},
		
		/**
		 * adds the specified class to the element
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} className — class name
		 * @return {Collection DOM Driver}
		 */
		addClass: function (el, className) {
			if (el.className.split(' ').indexOf(className) === -1) { el.className += ' ' + className; }
			
			return this;
		},
		/**
		 * determine whether or not the specified item is needed class
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} className — class name
		 * @return {Boolean}
		 */
		hasClass: function (el, className) {
			return el.className.split(' ').indexOf(className) !== -1;
		},
		/**
		 * remove a single class
		 * 
		 * @this {Collection DOM Driver}
		 * @param {DOM Node} el — DOM node
		 * @param {String} className — class name
		 * @return {Collection DOM Driver}
		 */
		removeClass: function (el, className) {
			var classes = el.className.split(' '),
				newClass = [];
			
			classes.forEach(function (el) {
				if (el !== className) { newClass.push(el); }
			});
			
			el.className = newClass.join(' ');
			
			return this;
		},
		
		// search frameworks
		engines: {
			// qsa css selector engine
			qsa: {
				is: function () {
					if (typeof qsa !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					return qsa.querySelectorAll(selector, context);
				}
			},
			// sizzle 
			sizzle: {
				is: function () {
					if (typeof Sizzle !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					return Sizzle(selector, context);
				}
			},
			// jQuery 
			jQuery: {
				is: function () {
					if (typeof jQuery !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					return jQuery(selector, context);
				},
				click: function (el, callback) { $(el).click(callback); },
				change: function (el, callback) { $(el).change(callback); }
			},
			// dojo 
			dojo: {
				is: function () {
					if (typeof dojo !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					if (context) {
						return dojo.query(selector, context);
					} else { return dojo.query(selector); }
				},
				click: function (el, callback) { dojo.connect(el, 'onclick', callback); }
			},
			// mootools 
			mootools: {
				is: function () {
					if (typeof MooTools !== 'undefined') { return true; }
				},
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
			},
			// prototype 
			prototype: {
				is: function () {
					if (typeof Prototype !== 'undefined') { return true; }
				},
				find: function (selector, context) {
					if (context) {
						return context.getElementsBySelector(selector);
					} else { return $$(selector); }
				}
			}
		}
	};
	
	// definition version of the DOM framework
	var dom = C.drivers.dom;
	for (key in dom.engines) {
		if (!dom.engines.hasOwnProperty(key)) { continue; }
				
		if (dom.engines[key].is()) {
			dom.lib = key;
			
			break;
		}
	}