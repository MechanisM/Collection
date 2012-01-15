
	/////////////////////////////////
	//// jQuery methods (compiler templates)
	/////////////////////////////////
	
	/**
	 * compiler templates
	 * 
	 * @this {jQuery Object}
	 * @throw {Error}
	 * @return {Function}
	 */
	$.fn.ctplCompile = function () {
		if (this.length === 0) { throw new Error("DOM element does't exist!"); }
		
		var
			html = this.html(),
			elem = html
				.replace(/\/\*.*?\*\//g, "")
				.split("?>")
				.join("<?js")
				.replace(/[\r\t\n]/g, " ")
				.split("<?js"),
			
			eLength = elem.length,
			resStr = "var key = i, result = ''; ";
		
		elem.forEach(function (el, i) {
			if (i === 0 || i % 2 === 0) {
				resStr += "result +='" + el + "';";
			} else { resStr += el.split("echo").join("result +="); }
		});
		
		return new Function("el", "i", "data", "cOLength", "cObj", "id", resStr + " return result;");
	};
	
	/**
	 * make templates
	 * 
	 * @this {jQuery Object}
	 * @param {Collection Object} cObj - an instance of $.Collection
	 * @throw {Error}
	 * @return {Function}
	 */
	$.fn.ctplMake = function (cObj) {
		this.find("[type='text/ctpl']").each(function () {
			var
				$this = $(this),
				data = $this.data("ctpl"),
				
				prefix = data.prefix ? data.prefix + "_" : "";
			//
			cObj.pushTemplate(prefix + data.name, $this.ctplCompile());
			if (data.set && data.set === true) { cObj.setTemplate(prefix + data.name); }
		});
	};