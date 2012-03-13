	
	/////////////////////////////////
	//// DOM methods (core)
	/////////////////////////////////
	
	/**
	 * converts one level nodes in the collection
	 * 
	 * @this {Collection}
	 * @param {DOM Nodes} el — DOM node
	 * @return {Array}
	 */
	C._inObj = function (el) {
		var array = [],
			stat = C.fromNodes.stat,
			
			dom = C.drivers.dom;
				
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
					array[i][stat.classes] = {};
					classes.forEach(function (el) {
						array[i][stat.classes][el] = el;
					});
				}
				
				if (el.childNodes.length !== 0) { array[i][stat.childNodes] = C._inObj(el.childNodes); }
				if (txt !== false) { array[i][stat.val] = txt.replace(/[\r\t\n]/g, ' '); }
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
	C.fromNodes = function (selector, prop) {
		if (!JSON || !JSON.parse) { throw new Error('object JSON is not defined!'); }
		
		var data = C._inObj(C.drivers.dom.find(selector));
		
		if (prop) { return new C(data, prop); }
		return new C(data);
	};
	
	// values by default
	if (!C.fromNodes.stat) {
		C.fromNodes.stat = {
			val: 'val',
			childNodes: 'childNodes',
			classes: 'classes'
		};
	};