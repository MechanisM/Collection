	
	/////////////////////////////////
	//// compile (parser)
	/////////////////////////////////
	
	/**
	 * calculate custom parser
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|String|Boolean} parser — parser function, string expression (context + >> + filter (the record is equivalent to: return + string expression)) or true (if disabled)
	 * @param {String} str — source string
	 * @return {String}
	 */
	Collection.prototype._customParser = function (parser, str, _tmpParser) {
		// if parser is undefined
		if (!parser || parser === true) {
			if (!this._getActiveParam('parser')) { return str; }
			
			if (this._get('parser')) {
				return this._customParser(this._get('parser'), str, _tmpParser);
			}
			
			return str;
		}
		
		// if parser is function
		if (C.isFunction(parser)) {
			if (!this._getActiveParam('parser') || !_tmpParser) {
				return parser.call(parser, str, this);
			} else {
				if (!_tmpParser.name) {
					while (this._exists('parser', '__tmp:' + (_tmpParser.name = C.getRandomInt(0, 10000)))) {
						_tmpParser.name = C.getRandomInt(0, 10000);
					}
					this._push('parser', '__tmp:' + _tmpParser.name, parser);
				}
				
				return this._customParser(this.ACTIVE + ' && ' + '__tmp:' + _tmpParser.name, str, _tmpParser);
			}
		}
		
		// if parser is string
		if (C.isString(parser)) {
			if (this._getActiveParam('parser') && _tmpParser) {
				parser = this.ACTIVE + ' && ' + parser;
			}
			
			// if need to compile parser
			if (this._isStringExpression(parser = parser.trim())) {
				if (!this._exists('parser', '__tmp:' + parser)) {
					this._push('parser', '__tmp:' + parser, this._compileParser(parser));
				}
				
				return (parser = this._get('parser', '__tmp:' + parser)).call(parser, str, this);
			}
			
			// split parser
			parser = parser.split('&&');
		}
		
		// calculate
		parser.forEach(function (el) {
			str = this._customParser((el = el.trim()), str);
		}, this);

		return str;
	};
	
	/**
	 * compile parser
	 * 
	 * @param {String} str — some string
	 * @return {Function}
	 */
	Collection.prototype._compileParser = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split(this.VARIABLE[0]).join('cObj.getVariable("').split(this.VARIABLE[1]).join('")');
		
		return new Function('str', 'cObj', 'return ' + str.replace(this.DEF_REGEXP, '') + ';');
	};