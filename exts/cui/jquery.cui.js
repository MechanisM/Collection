/**
 * CUI core - extensions for JavaScript framework jQuery for create widgets
 *
 * addition:
 * the code is documented in accordance with the standard jsDoc
 * specific data types:
 * 1) [jQuery Object] is a reduced form of the [Object] and means an instance of jQuery;
 * --
 * the record type: [some parameter] means that this parameter is optional, and if not specified explicitly, it is not defined (has no default value)
 * 
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @date: 05.01.2012 12:25:24
 * @version 1.4
 */
(function ($) {
	// try to use ECMAScript 5 "strict mode"
	"use strict";	
	/**
	 * set widget to the DOM element
	 *
	 * @this {jQuery Object}
	 * @param {String} name - widget name
	 * @param {Object} obj - API
	 * @param {Object} param - advanced option
	 * @return {jQuery Object}
	 */
	$.fn.cuiSet = function (name, obj, param) {
		this.each(function () {
			var $this = $(this), key;
			//
			if ($this.data("cui")) {
				if (!$this.data("cui")[name]) { $this.data("cui")[name] = {obj: obj}; }
			} else { $this.data("cui", {}).data("cui")[name] = {obj: obj}; }
			
			if (param) {
				for (key in param) {
					if (param.hasOwnProperty(key)) { $this.data("cui")[name][key] = param[key]; }
				}
			}
		});

		return this;
	};
	/**
	 * get widget for the elements
	 *
	 * @this {jQuery Object}
	 * @param {String} [name] - widget name
	 * @return {Array}
	 */
	$.fn.cuiGet = function (name) {
		var $this = $(this);
		//
		if (name) {
			if ($this.data("cui") && $this.data("cui")[name]) { return $this.data("cui")[name]; }
		} else { if ($this.data("cui")) { return $this.data("cui"); } }
		
		return false;
	};
	/**
	 * remove widget from the elements
	 *
	 * @this {jQuery Object}
	 * @param {String} [name] - widget name
	 * @return {jQuery Object}
	 */
	$.fn.cuiRemove = function (name) {
		this.each(function () {
			var $this = $(this);
			if (name) {
				if ($this.data("cui") && $this.data("cui")[name]) { delete $this.data("cui")[name]; }
			} else if ($this.data("cui")) { $this.removeData("cui"); }
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
	$.fn.cuiExtend = function (name, data) {
		var
			cui = this.cuiGet(name),
			i = 1, j, n, key, inKey, splitKey,
			
			aLength = arguments.length,
			obj;
		
		if (cui) {
			for (; ++i < aLength;) {
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
					if (data.hasOwnProperty(key)) {
						if ($.isArray(data[key])) {
							for (j = data[key].length; j--;) {
								if (arguments[i][data[key][j]]) {
									obj = nimble.byLink(cui, key);
									//
									if ($.isPlainObject(obj[data[key][j]])) {
										$.extend(obj[data[key][j]], arguments[i][data[key][j]]);
									} else { nimble.byLink(obj, data[key][j], arguments[i][data[key][j]]); }
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
								} else { nimble.byLink(obj, data[key], arguments[i][data[key]]); }
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
	$.fn.cuiIs = function (name) {
		var cui = this.cuiGet(name);
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
	$.fn.cuiNewCollection = function (data, def) {
		def = def || "";
		var obj;
	
		if (data && data.name && data.name === "$.Collection") {
			obj = data;
		} else { obj = data && data !== false ? new $.Collection(data, def) : data && data === false ? new $.Collection("", def) : this.collection(def); }
		
		return obj;
	};
	/**
	 * add event handlers
	 *
	 * @this {jQuery Object}
	 * @param {String} name - widget name
	 * @return {jQuery Object}
	 */
	$.fn.cuiAddEvents = function (name, events) {
		events = events || this[name].events || {};
		var obj = this.cuiIs(name), key;
		
		if (obj !== false) {
			for (key in events) {
				if (events.hasOwnProperty(key)) { events[key].call(this, obj); }
			}
		}
		
		return this;
	};
	// filter for the Sizzle
	$.extend($.expr[':'], {
		cui: function (elem, n, name) {
			var i, elem;
			name = name[name.length - 1];
				
			if (name) {
				name = name.split(",");
				for (i = name.length; i--;) {
					if (!$(elem).data("cui") || !$(elem).data("cui")[name[i]]) { return false; }
				}
						
				return true;
			} else if ($(elem).data("cui")) {
				return true;
			} else { return false; }
		}
	});
})(jQuery); //