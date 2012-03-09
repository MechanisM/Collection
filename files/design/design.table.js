	
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
			i = 0, j,
			selectorLength = selector.length,
			queryString = '', td,
			docEl,
			
			/** @private */
			wrapTR = function (td) {
				var docEl = document.createElement('tr');
				
				td.forEach(function (el) { docEl.appendChild(el.cloneNode(true)); });
				td[0].parentNode.insertBefore(docEl, td[0]);
				
				td.forEach(function (el) { el.parentNode.removeChild(el); });
			};
		
		selector.forEach(function (el, n) {
			if (el.selectorName !== 'td') {
				docEl = document.createElement('td');
				docEl.appendChild(el.cloneNode(true));
				
				el.parentNode.insertBefore(docEl, el);
				el.parentNode.removeChild(el);
			}
			
			if (i === count) {
				queryString = '';
				
				for (j = -1; (j += 1) < count;) {
					queryString += 'td:nth-child(' + (n - j) + ')';
					if (j !== (count - 1)) { queryString += ','; }
				}
				td = qsa.querySelectorAll(queryString, target);
				wrapTR(td);
				i = 0;
			} else if (n === (selectorLength - 1) && i !== count) {
				queryString = '';
				
				for (j = -1, i; (j += 1) < i;) {
					queryString += '> td:nth-child(' + (n - j) + ')';
					if (j !== (i - 1)) { queryString += ','; }
				}
				i -= 1;
				
				td = qsa.querySelectorAll(queryString, target);
				wrapTR(td);
				
				if (empty === true) {
					docEl = document.createDocumentFragment();
					for (; (i += 1) < count;) { docEl.appendChild(document.createElement('td')); }
					
					qsa.querySelectorAll('tr:last-child', target)[0].appendChild(docEl);
				}
			}
			i += 1;
		});
		//if (target[0].selectorName !== 'table') { target.children('tr').wrapAll('<table></table>'); }
		
		return this;
	};