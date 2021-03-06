	
	/////////////////////////////////
	//// DOM methods (core)
	/////////////////////////////////
	
	/**
	 * converts nodes in the collection
	 * 
	 * @this {Collection}
	 * @param {DOM Nodes} el — DOM nodes
	 * @return {Array}
	 */
	Collection.parseNode = function (el) {
		var array = [];
		
		// each node
		Array.prototype.forEach.call(el, function (el) {
			// not for text nodes
			if (el.nodeType === 1) {
				var data = dom.data(el),
					classes = el.hasAttribute('class') ? el.getAttribute('class').split(' ') : '',
					
					txt = dom.text(el),
					key,
					
					i = array.length;
				
				// data
				array.push({});
				for (key in data) { if (data.hasOwnProperty(key)) { array[i][key] = data[key]; } }
				
				// classes
				if (classes) {
					array[i][C.CLASSES] = {};
					classes.forEach(function (el) {
						array[i][C.CLASSES][el] = el;
					});
				}
				
				if (el.childNodes.length !== 0) { array[i][C.CHILD_NODES] = C.parseNode(el.childNodes); }
				if (txt !== false) { array[i][C.VAL] = txt.replace(/[\r\t\n]/g, ' '); }
			}
		});
		
		return array;
	};
	
	/**
	 * create an instance of the Collection on the basis of the DOM node
	 * 
	 * @this {Collection}
	 * @param {String} selector — CSS selector
	 * @param {Object} prop — user's preferences
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	Collection.fromNode = function (selector, prop) {
		if (typeof JSON === 'undefined' || !JSON.parse) { throw new Error('object JSON is not defined!'); }
		
		var data = C.parseNode(dom.find(selector));
		
		if (prop) { return new C(data, prop); }
		return new C(data);
	};