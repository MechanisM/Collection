
	/////////////////////////////////
	//// DOM methods (compiler templates)
	/////////////////////////////////
	
	/**
	 * compile the template
	 * 
	 * @this {Collection}
	 * @param {String} selector — CSS selector
	 * @throw {Error}
	 * @return {Function}
	 */
	C.ctplCompile = function (selector) {
		C.isString(selector) && (selector = qsa.querySelectorAll(selector));
		if (selector.length === 0) { throw new Error('DOM element does\'t exist!'); }
		
		var
			html = C.isArray(selector) ? selector[0].innerHTML : selector.innerHTML,
			elem = html
				.replace(/\/\*.*?\*\//g, '')
				.split('?>')
				.join('<?js')
				.replace(/[\r\t\n]/g, ' ')
				.split('<?js'),
			
			eLength = elem.length,
			resStr = 'var key = i, result = ""; ';
		
		elem.forEach(function (el, i) {
			if (i === 0 || i % 2 === 0) {
				resStr += 'result +="' + el + '";';
			} else { resStr += el.split('echo').join('result +='); }
		});
		
		return new Function('el', 'i', 'data', 'cOLength', 'cObj', 'id', resStr + ' return result;');
	};
	
	/**
	 * make templates
	 * 
	 * @this {Collection Object}
	 * @param {String} selector — CSS selector
	 * @return {Collection Object}
	 */
	C.prototype.ctplMake = function (selector) {
		(selector = qsa.querySelectorAll(selector)).forEach(function (el) {
			var
				data = C._dataAttr(el).ctpl, key,
				prefix = data.prefix ? data.prefix + '_' : '';
			
			// compile template
			cObj._push('template', prefix + data.name, C.ctplCompile(el));
			if (data.set && data.set === true) { cObj._set('template', prefix + data.name); }
			
			// compile
			for (key in data) {
				if (!data.hasOwnProperty(key)){ continue; }
				if (C.find(key, ['prefix', 'set', 'print', 'name', 'collection'])) { continue; }
				if (C.find(key, ['target', 'pager'])) { data[key] = qsa.querySelectorAll(data[key]); }
				
				cObj._push(key, prefix + data.name, data[key]);
				if (data.set && data.set === true) { cObj._set(key, prefix + data.name); }
				
				if (C.find(key, ['filter', 'parser'])) { data[key] = prefix + data.name; }
			}
			
			// print template (if need)
			if (data.print && data.print === true) {
				data.template = data.name;
				if (!data.target) {
					cObj._push('target', prefix + data.name, el.parentNode);
					if (data.set && data.set === true) { cObj._set('target', prefix + data.name); }
				}
				
				cObj.print(data);
			}
		});
		
		return this;
	};