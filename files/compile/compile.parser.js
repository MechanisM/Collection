	
	/////////////////////////////////
	//// compile (parser)
	/////////////////////////////////
	
	/**
	 * calculate custom parser
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|String|Boolean} parser - parser function or string expressions or "false"
	 * @param {String} str - source string
	 * @return {String}
	 */
	$.Collection.prototype._customParser = function (parser, str, _tmpParser) {
		if (!parser || ($.isString(parser) && (parser = $.trim(parser)) === this.ACTIVE)) {
			if (!this._getActiveParam("parser") && parser !== this.ACTIVE) { return true; }
			//
			if (this._get("parser")) {
				if ($.isFunction(this._get("parser"))) {
					return this._get("parser").call(this._get("parser"), str, this);
				}
				//
				return this._customParser(this._get("parser"), str, _tmpParser);
			}
			
			return true;
		}
		
		// if parser is function
		if ($.isFunction(parser)) {
			if (!this._getActiveParam("parser") || !_tmpParser) {
				return parser.call(parser, str, this);
			} else {
				if (!_tmpParser.name) {
					while (this._exists("parser", "__tmp:" + (_tmpParser.name = $.getRandomInt(0, 10000)))) {
						_tmpParser.name = $.getRandomInt(0, 10000);
					}
					this._push("parser", "__tmp:" + _tmpParser.name, parser);
				}
				//
				return this._customParser(this.ACTIVE + " && " + "__tmp:" + _tmpParser.name, str, _tmpParser);
			}
		}
		
		//
		if ($.isString(parser)) {
			parser = $.trim(parser);
			// if simple parser
			if (parser.search("&&") === -1) {
				return this._customParser(this._get("parser", parser), str);
			}
			parser = parser.split("&&");
		}
		//
		if (this._getActiveParam("parser")) { str = this._get("parser").call(this._get("parser"), str, this); }
		
		
		parser.forEach(function (el) {
			el = $.trim(el);
			if ($.isString(el)) {
				str = this._customParser(el, str);
			} else {
				str = this._get("parser", el).call(this._get("parser", el), str, this);
			}
			
		}, this);

		return str;
	};
	/**
	 * compile parser
	 * 
	 * @param {String} str - some string
	 * @return {Function}
	 */
	$.Collection.prototype._compileParser = function (str) {
		var res = /^\s*\(*\s*/.exec(str);
		
		console.log(res)
		
		if (res.length !== 0) {
			str = str.substring(res[0].length + 1, str.length - res[0].length);
		}
		str = str.split("<:").join('self.getVariable("').split(":>").join('")');
		//
		return new Function("str", "cObj", "return " + str.replace(/^\s*:/, "") + ";");
	};