	
	/////////////////////////////////
	//// DOM methods (core)
	/////////////////////////////////
	
	/**
	 * returns the data attributes of the node
	 * 
	 * @this {Collection}
	 * @param {DOM Node} el — DOM node
	 * @return {Object}
	 */
	C._dataAttr = function (el) {
		var attr = el.attributes, data = {};
		
		if (attr && attr.length > 0) {
			Array.prototype.forEach.call(attr, function (el) {
				if (el.name.substring(0, 5) === 'data-') {
					data[el.name.replace('data-', '')] = C.isString(el.value) && el.value.search(/^\{|\[/) !== -1 ? JSON.parse(el.value) : el.value;
				}
			});
		}
		
		return data;
	};
	
	/**
	 * returns the text content of the node
	 * 
	 * @this {Collection}
	 * @param {DOM Node} el — DOM node
	 * @return {String|Boolean}
	 */
	C._nodeText = function (el) {
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
	};
	
	/**
	 * converts one level nodes in the collection
	 * 
	 * @this {Collection}
	 * @param {DOM Nodes} el — DOM node
	 * @return {Array}
	 */
	C._inObj = function (el) {
		var array = [], stat = C.fromNodes.stat;
				
		// each node
		Array.prototype.forEach.call(el, function (el) {
			// not for text nodes
			if (el.nodeType === 1) {
				var
					data = C._dataAttr(el),
					classes = el.hasAttribute('class') ? el.getAttribute('class').split(' ') : '',
					
					txt = C._nodeText(el),
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
	 * create an instance of the Collection on the basis of the DOM node (using QSA Selector Engine)
	 * 
	 * @this {Collection}
	 * @param {String} selector — CSS selector
	 * @param {Object} prop — user's preferences
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	C.fromNodes = function (selector, prop) {
		if (!JSON || !JSON.parse) { throw new Error('object JSON is not defined!'); }
		
		var data = C._inObj(C.prototype.drivers.dom.find(selector));
		
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