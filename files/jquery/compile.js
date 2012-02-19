
	/////////////////////////////////
	//// jQuery methods (compiler templates)
	/////////////////////////////////
	
	/**
	 * <i lang="en">compile the template</i>
	 * <i lang="ru">компилировать шаблон</i>
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
		//
		elem.forEach(function (el, i) {
			if (i === 0 || i % 2 === 0) {
				resStr += "result +='" + el + "';";
			} else { resStr += el.split("echo").join("result +="); }
		});
		
		return new Function("el", "i", "data", "cOLength", "cObj", "id", resStr + " return result;");
	};
	
	/**
	 * <i lang="en">make templates</i>
	 * <i lang="ru">собрать шаблоны</i>
	 * 
	 * @this {jQuery Object}
	 * @param {Collection Object} cObj — <i lang="en">an instance of $.Collection</i><i lang="ru">экземпляр $.Collection</i>
	 * @return {Collection Object}
	 */
	$.fn.ctplMake = function (cObj) {
		this.each(function () {
			var
				$this = $(this),
				data = $this.data("ctpl"), key,
				
				prefix = data.prefix ? data.prefix + "_" : "";
			//
			if ($.isString(data)) { data = $.parseJSON(data); }
			//
			cObj._push("template", prefix + data.name, $this.ctplCompile());
			if (data.set && data.set === true) { cObj._set("template", prefix + data.name); }
			
			//
			for (key in data) {
				if (!data.hasOwnProperty(key)){ continue; }
				if (key === "prefix" || key === "set" || key === "print" || key === "name") { continue; }
				//
				if (key === "target" || key === "pager") { data[key] = $(data[key]); }
				
				cObj._push(key, prefix + data.name, data[key]);
				if (data.set && data.set === true) { cObj._set(key, prefix + data.name); }
				//
				if (key === "filter" || key === "parser" ) { data[key] = prefix + data.name; }
			}
			//
			if (data.print && data.print === true) {
				data.template = data.name;
				cObj.print(data);
			}
		});
		
		return this;
	};