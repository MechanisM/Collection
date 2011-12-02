	
	// global
	var
		collection = $["Collection"],
		cName = "CUI",
		sizzleExt = {};
	
	/**
	 * set widget to the DOM element
	 *
	 * @this {jQuery Object}
	 * @param {String} name - widget name
	 * @param {Object} obj - API
	 * @param {Object} param - advanced option
	 * @return {jQuery Object}
	 */
	$.fn["set" + cName] = function (name, obj, param) {
		this.each(function () {
			var $this = $(this), key;
			//
			if ($this.data(cName)) {
				if (!$this.data(cName)[name]) { $this.data(cName)[name] = {obj: obj}; }
			} else { $this.data(cName, {}).data(cName)[name] = {obj: obj}; }
			
			if (param) {
				for (key in param) {
					if (param.hasOwnProperty(key)) { $this.data(cName)[name][key] = param[key]; }
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
	$.fn["get" + cName] = function (name) {
		var $this = $(this);
		//
		if (name) {
			if ($this.data(cName) && $this.data(cName)[name]) { return $this.data(cName)[name]; }
		} else {
			if ($this.data(cName)) { return $this.data(cName); }
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
	$.fn["remove" + cName] = function (name) {
		this.each(function () {
			var $this = $(this);
			if (name) {
				if ($this.data(cName) && $this.data(cName)[name]) { delete $this.data(cName)[name]; }
			} else if ($this.data(cName)) {
				$this.removeData(cName);
			}
		});
		
		return this;
	};
	/**
	 * check widget to exist
	 *
	 * @this {jQuery Object}
	 * @param {String} name - widget name
	 * @param {Array|Plain Object} data - array of parameters
	 * @return {jQuery Object}
	 */
	$.fn["extend" + cName] = function (name, data) {
		var
			cui = this["get" + cName](name),
			i = 1, j, key,
			
			aLength = arguments.length - 1,
			obj;
		
		if (cui) {
			for (; i++ < aLength;) {
				for (key in data) {
					if (data.hasOwnProperty(key)) {
						if ($.isArray(data[key])) {
							for (j = data[key].length; j--;) {
								if (arguments[i][data[key][j]]) {
									obj = collection.obj.getByLink(cui, key);
									//
									if ($.isPlainObject(obj[data[key][j]])) {
										$.extend(obj[data[key][j]], arguments[i][data[key][j]]);
									} else {
										collection.obj.setByLink(obj, data[key][j], arguments[i][data[key][j]]);
									}
								}
							}
						} else {
							if (arguments[i][data[key]]) {
								if (isNaN(key)) {
									obj = collection.obj.getByLink(cui, key);
								} else { obj = cui; }
								//
								if ($.isPlainObject(obj[data[key]])) {
									$.extend(true, obj[data[key]], arguments[i][data[key]]);
								} else {
									collection.obj.setByLink(obj, data[key], arguments[i][data[key]]);
								}
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
	$.fn["is" + cName] = function (name) {
		var cui = this["get" + cName](name);
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
	$.fn["new" + cName + "Data"] = function (data, def) {
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
	$.fn["add" + cName + "Event"] = function (name, events) {
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
	sizzleExt[cName] = function (elem, n, name) {
		var i, elem;
		name = name[name.length - 1];
			
		if (name) {
			name = name.split(",");
			for (i = name.length; i--;) {
				if (!$(elem).data(cName) || !$(elem).data(cName)[name[i]]) { return false; }
			}
					
			return true;
		} else if ($(elem).data(cName)) {
			return true;
		} else { return false; }
	};
	$.extend($.expr[':'], sizzleExt);