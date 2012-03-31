	
	/////////////////////////////////
	//// compile (filter)
	/////////////////////////////////
	
	/**
	 * calculate custom filter
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Boolean} [filter=this.ACTIVE] — filter function, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {mixed} el — current element
	 * @param {Number|String} key — key
	 * @param {Collection} data — link to collection
	 * @param {Number|String} i — iteration
	 * @param {Function} length — collection length
	 * @param {Collection Object} cObj — link to collection object
	 * @param {String} id — collection ID
	 * @return {Boolean}
	 */
	Collection.prototype._customFilter = function (filter, el, key, data, i, length, cObj, id, _tmpFilter) {
		var fLength,
			calFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			j;
		
		// if filter is undefined
		if (!filter || filter === true) {
			if (!this._getActiveParam('filter')) { return true; }
			
			if (this._get('filter')) {
				return this._customFilter(this._get('filter'), el, key, data, i, length, cObj, id, _tmpFilter);
			}
			
			return true;
		}

		// if filter is function
		if (Collection.isFunction(filter)) {
			if (!this._getActiveParam('filter') || !_tmpFilter) {
				return filter.call(filter, el, key, data, i, length, cObj, id);
			} else {
				if (!_tmpFilter.name) {
					while (this._exists('filter', '__tmp:' + (_tmpFilter.name = Collection.getRandomInt(0, 10000)))) {
						_tmpFilter.name = Collection.getRandomInt(0, 10000);
					}
					this._push('filter', '__tmp:' + _tmpFilter.name, filter);
				}
				
				return this._customFilter(this.ACTIVE + ' && ' + '__tmp:' + _tmpFilter.name, el, key, data, i, length, cObj, id, _tmpFilter);
			}
		}
		
		// if filter is string
		if (!Collection.isArray(filter)) {
			if (this._getActiveParam('filter') && _tmpFilter) {
				filter = this.ACTIVE + ' && (' + filter + ')';
			}
			
			// if need to compile filter
			if (this._isStringExpression(filter = Collection.trim(filter))) {
				if (!this._exists('filter', '__tmp:' + filter)) {
					this._push('filter', '__tmp:' + filter, this._compileFilter(filter));
				}

				return (filter = this._get('filter', '__tmp:' + filter)).call(filter, el, key, data, i, length, cObj, id);
			}
			
			// prepare string
			filter = Collection.trim(
						filter
							.toString()
							.replace(/\s*(\(|\))\s*/g, ' $1 ')
							.replace(/\s*(\|\||&&)\s*/g, ' $1 ')
							.replace(/(!)\s*/g, '$1')
					).split(' ');
			
			// remove 'dead' elements		
			for (j = filter.length; (j -= 1) > -1;) {
				if (filter[j] === '') { filter.splice(j, 1); }
			}
		}
		
		// calculate deep filter
		/** @private */
		calFilter = function (array, iter) {
			var i = -1,
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
		for (j = -1; (j += 1) < fLength;) {
			// calculate atoms
			if (filter[j] === '(' || filter[j] === '!(') {
				if (filter[j].substring(0, 1) === '!') {
					inverse = true;
					filter[j] = filter[j].substring(1);
				} else { inverse = false; }
				
				j = (tmpResult = calFilter(filter.slice((j + 1)), j)).iter;
				tmpResult = tmpResult.result.join(' ');
				tmpResult = this._customFilter(tmpResult, el, key, data, i, length, cObj, id);
				
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// calculate outer filter
			} else if (filter[j] !== ')' && filter[j] !== '||' && filter[j] !== '&&') {
				if (filter[j].substring(0, 1) === '!') {
					inverse = true;
					filter[j] = filter[j].substring(1);
				} else { inverse = false; }
				
				tmpResult = this._customFilter(this._get('filter', filter[j]), el, key, data, i, length, cObj, id);
				
				if (!and && !or) {
					result = inverse === true ? !tmpResult : tmpResult;
				} else if (and) {
					result = inverse === true ? !tmpResult : tmpResult && result;
				} else { result = inverse === true ? !tmpResult : tmpResult || result; }
			
			// 'and' or 'or'
			} else if (filter[j] === '||') {
				and = false;
				or = true;
			} else if (filter[j] === '&&') {
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
	Collection.prototype._compileFilter = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split('<:').join('cObj.getVariable("').split(':>').join('")');
		
		return new Function('el', 'key', 'data', 'i', 'length', 'cObj', 'id', 'return ' + str.replace(/^\s*:/, '') + ';');
	};