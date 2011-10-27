	
	/**
	 * Генерация в таблицу (если шаблон состоял из td)
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [count=4] - количество td на строку
	 * @return {Colletion Object}
	 */
	$.Collection.fn.genTable = function (count) {
		count = count || 4;
	
		var
			i = 1,
			j,
	
			activeTarget = this.dObj.prop.activeTarget,
			tdLength = activeTarget.children("td").length - 1,
	
			countDec = count - 1,
			queryString = "";
	
		activeTarget.children("td").each(function (n) {
			if (i === count) {
				queryString = "";
	
				for (j = -1; j++ < countDec;) {
					queryString += "td:eq(" + (n - j) + ")";
					if (j !== countDec) {
						queryString += ",";
					}
				}
	
				$(queryString, activeTarget).wrapAll("<tr></tr>");
				i = 0;
			} else if (n === tdLength && i !== count) {
				queryString = "";
	
				for (j = 0, i; j < i; j++) {
					queryString += "td:eq(" + j + ")";
					if (j !== (i - 1)) {
						queryString += ",";
					}
				}
	
				activeTarget.children(queryString).wrapAll("<tr></tr>");
	
				queryString = "";
	
				for (; i < count; i++) {
					queryString += "<td></td>";
				}
	
				activeTarget.children("tr:last").append(queryString);
			}
			i++;
		});
	
		activeTarget.children("tr").wrapAll("<table></table>");
	
		return this;
	};