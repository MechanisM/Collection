	
	/**
	 * Вернуть валидную JSON строку коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [vID=this.active] - ИД коллекции
	 * @param {Function|Array} [replacer=undefined] - показывает, как элементы коллекции преобразуются в строку
	 * @param {Number|String} [space=undefined] - пробелы
	 * @return {String}
	 */
	$.Collection.fn.toString = function (vID, replacer, space) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
	
			cObj,
			i;
	
		gap = "";
		indent = "";
	
		cObj = vID && $.isString(vID) && vID !== this.active ? dObj.sys.tmpCollection[vID] : typeof vID === "object" ? vID : prop.activeCollection;
		cObj = $.Collection.static.obj.getByLink(cObj, prop.activeContext);
	
		if (typeof space === "number") {
			for (i = space; i--;) {
				indent += ' ';
			}
		} else if (typeof space === "string") {
			indent = space;
		}
	
		rep = replacer;
	
		if (window.JSON !== undefined) {
			return JSON.stringify(cObj, replacer, space);
		}
	
		return str('', {
			'': cObj
		});
	};
	/**
	 * Вернуть длину коллекции
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Number}
	 */
	$.Collection.fn.valueOf = function (id) {
		return this.length($.isExist(id) ? id : this.active);
	};