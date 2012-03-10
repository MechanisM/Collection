	
	/////////////////////////////////
	//// design methods (table)
	/////////////////////////////////
		
	/**
	 * generating the table
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [count=4] — td number to a string
	 * @param {String} [selector='div'] — CSS selector
	 * @param {Boolean} [empty=true] — display empty cells
	 * @return {Colletion Object}
	 */
	C.prototype.genTable = function (target, count, selector, empty) {
		// overload
		if (C.isNumber(target)) {
			empty = selector;
			selector = count;
			count = target;
			target = '';
		}
		
		count = count || 4;
		selector = selector || 'div';
		empty = empty === false ? false : true;
		
		target = target || this._get('target');
		selector = qsa.querySelectorAll(selector, target);
		
		var
			i = 0,
			table = document.createElement('table'), tr, td;
			
		selector.forEach(function (el) {
			if (i === 0) {
				tr = document.createElement('tr');
				table.appendChild(tr);
			}
			td = document.createElement('td');
			td.appendChild(el);
			tr.appendChild(td);
			
			i += 1;
			if (i === count) { i = 0; }
		});
		
		if (empty === true) {
			i = count - tr.childNodes.length;
			while ((i -= 1) > -1) {
				tr.appendChild(document.createElement('td'));
			}
		}
		
		if (target[0] && target.length) {
			Array.prototype.forEach.call(target, function (el) {
				el.appendChild(table);
			});
		} else { target.appendChild(table); }
		
		return this;
	};