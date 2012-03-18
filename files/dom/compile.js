
	/////////////////////////////////
	//// DOM methods (compiler templates)
	/////////////////////////////////
	
	/**
	 * compile the template
	 * 
	 * @this {Collection}
	 * @param {String|DOM nodes} selector — CSS selector or DOM nodes
	 * @throw {Error}
	 * @return {Function}
	 */
	Collection.ctplCompile = function (selector) {
		Collection.isString(selector) && (selector = Collection.drivers.dom.find(selector));
		if (selector.length === 0) { throw new Error('DOM element does\'t exist!'); }
		
		var html = selector[0] ? selector[0][0] ? selector[0][0].innerHTML : selector[0].innerHTML : selector.innerHTML,
			elem = html
				.replace(/\/\*.*?\*\//g, '')
				.split('?>')
				.join('<?js')
				.replace(/[\r\t\n]/g, ' ')
				.split('<?js'),
			
			resStr = 'var result = ""; ';
		
		elem.forEach(function (el, i) {
			if (i === 0 || i % 2 === 0) {
				resStr += 'result +="' + el.split('"').join('\\"') + '";';
			} else { resStr += el.split('echo').join('result +='); }
		});
		
		return new Function('el', 'key', 'data', 'i', 'length', 'cObj', 'id', resStr + ' return result;');
	};
	
	/**
	 * make templates
	 * 
	 * @this {Collection Object}
	 * @param {String|DOM nodes} selector — CSS selector or DOM nodes
	 * @return {Collection Object}
	 */
	Collection.prototype.ctplMake = function (selector) {	
		var dom = Collection.drivers.dom;
		Collection.isString(selector) && (selector = dom.find(selector));
		
		Array.prototype.forEach.call(selector, function (el) {
			var data = dom.data(el, 'ctpl'), key,
				prefix = data.prefix ? data.prefix + '_' : '';
			
			// compile template
			this._push('template', prefix + data.name, Collection.ctplCompile(el));
			if (data.set && data.set === true) { this._set('template', prefix + data.name); }
			
			// compile
			for (key in data) {
				if (!data.hasOwnProperty(key)){ continue; }
				
				if (Collection.find(key, ['prefix', 'set', 'print', 'name', 'collection'])) { continue; }
				if (Collection.find(key, ['target', 'pager'])) { data[key] = dom.find(data[key]); }
				
				this._push(key, prefix + data.name, data[key]);
				if (data.set && data.set === true) { this._set(key, prefix + data.name); }
				
				if (Collection.find(key, ['filter', 'parser'])) { data[key] = prefix + data.name; }
			}
			
			// print template (if need)
			if (data.print && data.print === true) {
				data.template = data.name;
				if (!data.target) {
					this._push('target', prefix + data.name, [el.parentNode]);
					if (data.set && data.set === true) { this._set('target', prefix + data.name); }
				}
				
				this.print(data);
			}
		}, this);
		
		return this;
	};