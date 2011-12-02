/**
 * CUI core - extensions for JavaScript framework jQuery for create widgets
 *
 * addition:
 * the code is documented in accordance with the standard jsDoc
 * specific data types:
 * 1) [jQuery Object] is a reduced form of the [Object] and means an instance of jQuery;
 * --
 * the record type: [active=undefined] means that this parameter is optional , and if not specified explicitly, it is not defined (has no default value)
 * 
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @date: 02.12.2011 15:18:22
 * @version 1.3.1
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
	 * check widget to exist
	 *
	 * @this {jQuery Object}
	 * @param {String} name - widget name
	 * @param {Array} data - array of parameters
	 * @return {jQuery Object}
	 */
	$.fn.extendCUI = function (name, data) {
		var
			cui = this.getCUI(name),
			i = 1, j, aLength = arguments.length - 1;
		
		if (cui) {
			for (; i++ < aLength;) {
				for (j = data.length; j--;) {
					if (arguments[i][data[j]]) {
						if ($.isPlainObject(cui[data[j]])) {
							$.extend(true, cui[data[j]], arguments[i][data[j]]);
						} else {
							cui[data[j]] = arguments[i][data[j]];
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
	 * @return {Object}
	 */
	$.fn.addCUIEvent = function (name, events) {
		events = events || this[name].events || {};
		for (var key in events) {
			if (events.hasOwnProperty(key)) {
				events[key].call(this, this.getCUI(name).obj);
			}
		}
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
})(jQuery); //