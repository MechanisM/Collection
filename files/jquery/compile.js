
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
		if (this.length === 0) { throw new Error("DOM element isn't exist!"); }
		
		var
			html = this.html(),
			elem = html
				.replace(/\/\*.*?\*\//g, "")
				.split("?>")
				.join("<?js")
				.replace(/[\r\t\n]/g, " ")
				.split("<?js"),
			
			eLength = elem.length,
			resStr = "var key = i, result = ''; ", i = -1;
		
		for (; (i += 1) < eLength;) {
			if (i === 0 || i % 2 === 0) {
				resStr += "result +='" + elem[i] + "';";
			} else { resStr += elem[i].split("echo").join("result +="); }
		}
		
		return new Function("el", "data", "i", "cOLength", "self", "id", resStr + " return result;");
	};
	
	/**
	 * make template
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
				data = $this.data(),
				
				prefix = data.prefix ? data.prefix + "_" : "";
			//
			cObj.pushTemplate(prefix + data.name, $this.ctplCompile());
			if (data.set && data.set === true) { cObj.setTemplate(prefix + data.name); }
		});
	};