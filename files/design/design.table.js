	
	/////////////////////////////////
	//// design methods (table)
	/////////////////////////////////
		
	/**
	 * generating the table
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [count=4] — td number to a string
	 * @param {String|DOM nodes} [selector='div'] — CSS selector or DOM nodes
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
		
		target = target ? C.isString(target) ? this.drivers.dom.find(target) : target : this._get('target');
		
		var i, nodes, table, tr, td;
		
		// for each node
		Array.prototype.forEach.call(target, function (el) {
			nodes = this.drivers.dom.find(selector, el)
			table = document.createElement('table');
			i = 0;
			
			Array.prototype.forEach.call(nodes, function (el) {
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
			
			// add empty cells
			if (empty === true) {
				i = count - tr.childNodes.length;
				while ((i -= 1) > -1) {
					tr.appendChild(document.createElement('td'));
				}
			}
			
			el.appendChild(table);
		}, this);
		
		return this;
	};