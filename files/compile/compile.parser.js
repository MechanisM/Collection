	
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
	$.Collection.prototype._customParser = function (parser, str) {
		// if parser is disabled
		if (parser === false) { return str; }
		// if parser is function
		if ($.isFunction(parser)) { return parser.call(parser, str, this); }
		
		// if parser is not defined or parser is a string constant
		if (!parser || ($.isString(parser) && $.trim(parser) === this.ACTIVE)) {
			if (this._get("parser")) {
				if ($.isFunction(this._get("parser"))) {
					return this._get("parser").call(this._get("parser"), str, this);
				}
				//
				return this._customParser(this._get("parser"), str);
			}
	
			return str;
		} else {
			if ($.isString(parser)) {
				parser = $.trim(parser);
				// if simple parser
				if (parser.search("&&") === -1) { return this._customParser(this._get("parser", parser), str); }
				parser = parser.split("&&");
			}
			//
			parser.forEach(function (el) {
				el = $.trim(el);
				str = this._get("parser", el).call(this._get("parser", el), str, this);
			}, this);
	
			return str;
		}
	};