	
	/**
	 * set widget to the DOM element
	 *
	 * @this {jQuery Object}
	 * @param {String} name - widget name
	 * @param {Object} obj - API
	 * @param {Object} param - advanced option
	 * @return {jQuery Object}
	 */
	$.fn.setCUI = function (name, obj, param) {
		this.each(function () {
			var $this = $(this), key;
			//
			if ($this.data("CUI")) {
				if (!$this.data("CUI")[name]) { $this.data("CUI")[name] = {obj: obj}; }
			} else { $this.data("CUI", {}).data("CUI")[name] = {obj: obj}; }
			
			if (param) {
				for (key in param) {
					if (param.hasOwnProperty(key)) { $this.data("CUI")[name][key] = param[key]; }
				}
			}
		});

		return this;
	};
	/**
	 * get widget for the elements
	 *
	 * @this {jQuery Object}
	 * @param {String} [name=undefined] - widget name
	 * @return {Array}
	 */
	$.fn.getCUI = function (name) {
		var $this = $(this);
		//
		if (name) {
			if ($this.data("CUI") && $this.data("CUI")[name]) { return $this.data("CUI")[name]; }
		} else {
			if ($this.data("CUI")) { return $this.data("CUI"); }
		}
		
		return false;
	};
	/**
	 * remove widget from the element
	 *
	 * @this {jQuery Object}
	 * @param {String} [name=undefined] - widget name
	 * @return {jQuery Object}
	 */
	$.fn.removeCUI = function (name) {
		this.each(function () {
			var $this = $(this);
			if (name) {
				if ($this.data("CUI") && $this.data("CUI")[name]) { delete $this.data("CUI")[name]; }
			} else if ($this.data("CUI")) {
				$this.removeData("CUI");
			}
		});
		
		return this;
	};
	/**
	 * extend widget
	 *
	 * @this {jQuery Object}
	 * @param {String} name - widget name
	 * @param {Array|Plain Object} data - array of parameters
	 * @return {jQuery Object}
	 */
	$.fn.extendCUI = function (name, data) {
		var
			cui = this.getCUI(name),
			i = 1, j, n, key, inKey, splitKey,
			
			aLength = arguments.length - 1,
			obj;
		
		if (cui) {
			for (; i++ < aLength;) {
				//
				for (inKey in arguments[i]) {
					if (arguments[i].hasOwnProperty(inKey)) {
						splitKey = inKey.split(" ");
						n = splitKey.length;
						if (n > 1) {
							for (; n--;) { arguments[i][splitKey[n]] = arguments[i][inKey]; }
							delete arguments[i][inKey];
						}
					}
				}
				//
				for (key in data) {
					//
					if (data.hasOwnProperty(key)) {
						//
						if ($.isArray(data[key])) {
							for (j = data[key].length; j--;) {
								if (arguments[i][data[key][j]]) {
									obj = nimble.byLink(cui, key);
									//
									if ($.isPlainObject(obj[data[key][j]])) {
										$.extend(obj[data[key][j]], arguments[i][data[key][j]]);
									} else { $.Collection.obj.setByLink(obj, data[key][j], arguments[i][data[key][j]]); }
								}
							}
						} else {
							if (arguments[i][data[key]]) {
								if (!$.isNumeric(key)) {
									obj = nimble.byLink(cui, key);
								} else { obj = cui; }
								//
								if ($.isPlainObject(obj[data[key]])) {
									$.extend(true, obj[data[key]], arguments[i][data[key]]);
								} else { $.Collection.obj.setByLink(obj, data[key], arguments[i][data[key]]); }
							}
						}
					}
				}
			}
		}
		
		return this;
	};
	/**
	 * check widget to exist
	 *
	 * @this {jQuery Object}
	 * @param {String} name - widget name
	 * @return {Object|Boolean}
	 */
	$.fn.isCUI = function (name) {
		var cui = this.getCUI(name);
		if (cui) { var obj = cui.obj; return obj; }
		
		return false;
	};
	/**
	 * create instances of the $.Collection on the basis of input data
	 *
	 * @this {jQuery Object}
	 * @param {mixed} data - source data
	 * @param {Plain Object} def - custom settings
	 * @return {Object}
	 */
	$.fn.newCUIData = function (data, def) {
		var obj;
	
		if (data && data.name && data.name === "$.Collection") {
			obj = data;
		} else {
			obj = data && data !== false ? new $.Collection(data, def || "") :
						data && data === false ? new $.Collection("", def || "") :
							this.collection(def || "");
		}
		
		return obj;
	};
	/**
	 * add event handlers
	 *
	 * @this {jQuery Object}
	 * @param {String} name - widget name
	 * @return {jQuery Object}
	 */
	$.fn.addCUIEvents = function (name, events) {
		events = events || this[name].events || {};
		var obj = this.isCUI(name), key;
		
		if (obj !== false) {
			for (key in events) {
				if (events.hasOwnProperty(key)) {
					events[key].call(this, obj);
				}
			}
		}
		
		return this;
	};
	// filter for the Sizzle
	$.extend($.expr[':'], {
		CUI: function (elem, n, name) {
			var i, elem;
			name = name[name.length - 1];
				
			if (name) {
				name = name.split(",");
				for (i = name.length; i--;) {
					if (!$(elem).data("CUI") || !$(elem).data("CUI")[name[i]]) { return false; }
				}
						
				return true;
			} else if ($(elem).data("CUI")) {
				return true;
			} else { return false; }
		}
	});