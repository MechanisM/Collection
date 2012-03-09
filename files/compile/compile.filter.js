	
	/////////////////////////////////
	//// compile (filter)
	/////////////////////////////////
	
	/**
	 * calculate custom filter
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression or true (if disabled)
	 * @param {mixed} el — current element
	 * @param {Number|String} i — iteration (key)
	 * @param {C} data — link to collection
	 * @param {Function} cOLength — collection length
	 * @param {Collection Object} self — link to collection object
	 * @param {String} id — collection ID
	 * @return {Boolean}
	 */
	C.prototype._customFilter = function (filter, el, i, data, cOLength, self, id, _tmpFilter) {
		var
			fLength,
			calFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			i;
		
		// if filter is undefined
		if (!filter || filter === true) {
			if (!this._getActiveParam('filter')) { return true; }
			
			if (this._get('filter')) {
				return this._customFilter(this._get('filter'), el, i, data, cOLength, self, id, _tmpFilter);
			}
			
			return true;
		}

		// if filter is function
		if (C.isFunction(filter)) {
			if (!this._getActiveParam('filter') || !_tmpFilter) {
				return filter.call(filter, el, i, data, cOLength, self, id);
			} else {
				if (!_tmpFilter.name) {
					while (this._exists('filter', '__tmp:' + (_tmpFilter.name = C.getRandomInt(0, 10000)))) {
						_tmpFilter.name = C.getRandomInt(0, 10000);
					}
					this._push('filter', '__tmp:' + _tmpFilter.name, filter);
				}
				
				return this._customFilter(this.ACTIVE + ' && ' + '__tmp:' + _tmpFilter.name, el, i, data, cOLength, self, id, _tmpFilter);
			}
		}
		
		// if filter is string
		if (!C.isArray(filter)) {
			if (this._getActiveParam('filter') && _tmpFilter) {
				filter = this.ACTIVE + ' && (' + filter + ')';
			}
			
			// if simple filter
			if (filter.search(/\|\||&&|!/) === -1) {
				if ((filter = C.trim(filter)).search(/^(?:\(|)*:/) !== -1) {
					if (!this._exists('filter', '__tmp:' + filter)) {
						this._push('filter', '__tmp:' + filter, this._compileFilter(filter));
					}
					
					return (filter = this._get('filter', '__tmp:' + filter)).call(filter, el, i, data, cOLength, self, id);
				}
				
				return this._customFilter(this._get('filter', filter), el, i, data, cOLength, self, id, _tmpFilter);
			}
			
			// prepare string
			filter = C.trim(
						filter
							.toString()
							.replace(/\s*(\(|\))\s*/g, ' $1 ')
							.replace(/\s*(\|\||&&)\s*/g, ' $1 ')
							.replace(/(!)\s*/g, '$1')
					).split(' ');
			
			// remove 'dead' elements		
			for (i = filter.length; (i -= 1) > -1;) {
				if (filter[i] === '') { filter.splice(i, 1); }
			}
		}
		
		// calculate deep filter
		/** @private */
		calFilter = function (array, iter) {
			var
				i = -1,
				aLength = array.length,
				pos = 0,
				result = [];
			
			while ((i += 1) < aLength) {
				iter += 1;
				if (array[i] === '(' || array[i] === '!(') { pos += 1; }
				if (array[i] === ')') {
					if (pos === 0) {
						return {result: result, iter: iter};
					} else { pos -= 1; }
				}
				
				result.push(array[i]);
			}
		};
		
		// calculate filter
		fLength = filter.length;
		for (i = -1; (i += 1) < fLength;) {
			// calculate atoms
			if (filter[i] === '(' || filter[i] === '!(') {
				if (filter[i].substring(0, 1) === '!') {
					inverse = true;
					filter[i] = filter[i].substring(1);
				} else { inverse = false; }
				
				i = (tmpResult = calFilter(filter.slice((i + 1)), i)).iter;
				tmpResult = tmpResult.result.join(' ');
				
				tmpResult = this._customFilter(tmpResult, el, i, data, cOLength, self, id);
				
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// calculate outer filter
			} else if (filter[i] !== ')' && filter[i] !== '||' && filter[i] !== '&&') {
				if (filter[i].substring(0, 1) === '!') {
					inverse = true;
					filter[i] = filter[i].substring(1);
				} else { inverse = false; }
				
				tmpResult = this._customFilter(this._get('filter', filter[i]), el, i, data, cOLength, self, id);
				
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// 'and' or 'or'
			} else if (filter[i] === '||') {
				and = false;
				or = true;
			} else if (filter[i] === '&&') {
				or = false;
				and = true;
			}
		}
		
		return result;
	};
	/**
	 * compile filter
	 * 
	 * @param {String} str — some string
	 * @return {Function}
	 */
	C.prototype._compileFilter = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split('<:').join('self.getVariable("').split(':>').join('")');
		
		return new Function('el', 'i', 'data', 'cOLength', 'cObj', 'id', 'var key = i; return ' + str.replace(/^\s*:/, '') + ';');
	}