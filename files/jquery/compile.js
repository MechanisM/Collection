
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
				.split("?>")
				.join("<?js")
				.replace(/[\r\t\n]/g, " ")
				.split("<?js"),
			
			eLength = elem.length - 1,
			resStr = "result += ''", jsStr = "",
			
			i = -1, j, jelength;
		
		for (; i++ < eLength;) {
			if (i === 0 || i % 2 === 0) {
				resStr += "+'" + elem[i] + "'";
			} else {
				j = -1;
				elem[i] = elem[i].split("<<");
				jelength = elem[i].length;
				
				for (; j++ < jelength;) {
					if (j === 0 || j % 2 === 0) {
						elem[i][j] && (jsStr += elem[i][j]);
					} else {
						elem[i][j] && (resStr += "+" + elem[i][j]);
					}
				}
			}
		}
		resStr += ";";
		
		return new Function("$this", "i", "aLength", "$obj", "id", 'var result = "";' + jsStr + resStr + ' return result;');
	};