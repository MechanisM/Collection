	
	/////////////////////////////////
	//// design methods (table)
	/////////////////////////////////
		
	/**
	 * <i lang="en">generating the table</i>
	 * <i lang="ru">генерировать таблицу</i>
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [count=4] — <i lang="en">td number to a string</i><i lang="ru">количество ячеек в строке</i>
	 * @param {String} [tag="div"] — <i lang="en">tag name</i><i lang="ru">тег, по которому идёт генерация</i>
	 * @param {Boolean} [empty=true] — <i lang="en">display empty cells</i><i lang="ru">отображать пустые ячейки</i>
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.genTable = function (count, tag, empty) {
		count = count || 4;
		tag = tag || "div";
		empty = empty === false ? false : true;
		//
		var
			i = 1, j,
	
			target = this._get("target"),
			tagLength = target.find(tag).length,
	
			queryString = "";
		
		target.find(tag).each(function (n) {
			if (this.tagName !== "td") { $(this).wrap("<td></td>"); }
			//
			if (i === count) {
				queryString = "";
				//
				for (j = -1; (j += 1) < count;) {
					queryString += "td:eq(" + (n - j) + ")";
					if (j !== (count - 1)) { queryString += ","; }
				}
				//
				target.find(queryString).wrapAll("<tr></tr>");
				i = 0;
			} else if (n === (tagLength - 1) && i !== count) {
				queryString = "";
				//
				for (j = -1, i; (j += 1) < i;) {
					queryString += "td:eq(" + (n - j) + ")";
					if (j !== (i - 1)) { queryString += ","; }
				}
				i -= 1;
				target.find(queryString).wrapAll("<tr></tr>");	
				//
				if (empty === true) {
					queryString = "";
					for (; (i += 1) < count;) { queryString += "<td></td>"; }
					target.find("tr:last").append(queryString);
				}
			}
			i += 1;
		});
		if (target[0].tagName !== "table") { target.children("tr").wrapAll("<table></table>"); }
	
		return this;
	};