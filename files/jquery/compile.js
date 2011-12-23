
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
	$.fn.tplCompile = function () {
		if (this.length === 0) { throw new Error("DOM element isn't exist!"); }
		
		var
			html = this.eq(0).html(),
			elem = html
                .replace(/\/\*.*?\*\//g, "")
				.split("?>")
				.join("<?js")
				.replace(/[\r\t\n]/g, " ")
				.split("<?js"),
			
			eLength = elem.length - 1,
			resStr = "var key = i, result = ''; ", i = -1;
		
		for (; i++ < eLength;) {
			if (i === 0 || i % 2 === 0) {
				resStr += "result +='" + elem[i] + "';";
			} else { resStr += elem[i].split("echo").join("result +="); }
		}
		
		return new Function("data", "i", "cOLength", "self", "id", resStr + " return result;");
	};