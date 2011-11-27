	
	/////////////////////////////////
	//// design methods (table)
	/////////////////////////////////
		
	/**
	 * generating the table (if the template consisted of td)
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [count=4] - td number to a string
	 * @return {Colletion Object}
	 */
	$.Collection.fn.genTable = function (count) {
		count = count || 4;
	
		var
			i = 1,
			j,
	
			target = this.dObj.active.target,
			tdLength = target.children("td").length - 1,
	
			countDec = count - 1,
			queryString = "";
	
		target.children("td").each(function (n) {
			if (i === count) {
				queryString = "";
	
				for (j = -1; j++ < countDec;) {
					queryString += "td:eq(" + (n - j) + ")";
					if (j !== countDec) { queryString += ","; }
				}
	
				$(queryString, target).wrapAll("<tr></tr>");
				i = 0;
			} else if (n === tdLength && i !== count) {
				queryString = "";
	
				for (j = 0, i; j < i; j++) {
					queryString += "td:eq(" + j + ")";
					if (j !== (i - 1)) { queryString += ","; }
				}
	
				target.children(queryString).wrapAll("<tr></tr>");	
				queryString = "";
	
				for (; i < count; i++) { queryString += "<td></td>"; }	
				target.children("tr:last").append(queryString);
			}
			i++;
		});
	
		target.children("tr").wrapAll("<table></table>");
	
		return this;
	};