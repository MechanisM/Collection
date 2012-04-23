
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
		C.isString(selector) && (selector = C.drivers.dom.find(selector));
		if (selector.length === 0) { throw new Error('DOM element does\'t exist!'); }
		
		var html = selector[0] ? selector[0][0] ? selector[0][0].innerHTML : selector[0].innerHTML : selector.innerHTML,
			elem = html
				.replace(/\/\*.*?\*\//g, '')
				.split(this.DOM[1])
				.join(this.DOM[0])
				.replace(/[\r\t\n]/g, ' ')
				.split(this.DOM[0]),
			
			resStr = 'var result = ""; ', echo = new RegExp('\\s+' + this.ECHO + '\\s+');
		
		elem.forEach(function (el, i) {
			if (i === 0 || i % 2 === 0) {
				resStr += 'result +="' + el.split('"').join('\\"') + '";';
			} else { resStr += el.split(echo).join('result +='); }
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
		var dom = C.drivers.dom;
		C.isString(selector) && (selector = dom.find(selector));
		
		Array.prototype.forEach.call(selector, function (el) {
			var data = dom.data(el, 'ctpl'), key,
				prefix = data.prefix ? data.prefix + '_' : '';
			
			// compile template
			this._push('template', prefix + data.name, C.ctplCompile(el));
			if (data.set && data.set === true) { this._set('template', prefix + data.name); }
			
			// compile
			for (key in data) {
				if (!data.hasOwnProperty(key)){ continue; }
				
				if (['prefix', 'set', 'print', 'name', 'collection'].indexOf(key) !== -1) { continue; }
				if (['target', 'pager'].indexOf(key) !== -1) { data[key] = dom.find(data[key]); }
				
				this._push(key, prefix + data.name, data[key]);
				if (data.set && data.set === true) { this._set(key, prefix + data.name); }
				
				if (['filter', 'parser'].indexOf(key) !== -1) { data[key] = prefix + data.name; }
			}
			
			// if the target is not defined, then take the parent node
			if (!data.target) {
				this._push('target', prefix + data.name, [el.parentNode]);
				if (data.set && data.set === true) { this._set('target', prefix + data.name); }
			}
			
			// print template (if need)
			if (data.print && data.print === true) {
				data.template = data.name;
				
				this.print(data);
			}
		}, this);
		
		return this;
	};