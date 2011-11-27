	
	/////////////////////////////////
	//// template model (advansed)
	/////////////////////////////////
	
	/**
	 * advansed model
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @return {Boolean}
	 */
	$.Collection.templateModels.control = function (param) {
		var
			dObj = this.dObj,
			vv = dObj.viewVal,
			css = dObj.css,
			
			nmbOfPages = param.nmbOfEntries % param.numberBreak !== 0 ? ~~(param.nmbOfEntries / param.numberBreak) + 1 : param.nmbOfEntries / param.numberBreak,
			str = "",
			
			i, j = 0, z;
		
		if (nmbOfPages > param.pageBreak) {	
			if (param.page !== 1) {
				str += '<a href="javascript:;" class="' + css.prev + '" data-page="1">' + vv.prev + '</a>';
			} else {
				str += '<a href="javascript:;" class="' + css.prev + ' ' + css.disabled + '" data-page="1">' + vv.prev + '</a>';
			}
			//
			for (i = (param.page - 1); i++ < nmbOfPages;) { j++; }
			if (j < param.pageBreak) { z = param.pageBreak - j + 1; } else { z = 1; }
			//
			for (j = 0, i = (param.page - z); i++ < nmbOfPages; j++) {
				if (j === (param.pageBreak - 1) && i !== param.page) { break; }
				//
				if (i === param.page) {
					if (j === 0 && param.page !== 1) {
						str += '<a href="javascript:;" data-page="' + (i - 1) + '">' + (i - 1) + '</a>';
					} else { j--; }
					
					str += '<a href="javascript:;" class="' + css.active + '" data-page="' + i + '">' + i + '</a>';
				} else { str += '<a href="javascript:;" data-page="' + i + '">' + i + '</a>'; }
			}
			if (i !== (nmbOfPages + 1)) {
				str += '<a href="javascript:;" data-page="' + nmbOfPages + '">' + vv.next + '</a>';
			} else { str += '<a href="javascript:;" class="' + css.next + ' ' + css.disabled + '" data-page="' + nmbOfPages + '">' + vv.next + '</a>'; }
		} else {
			for (i = 0; i++ < nmbOfPages;) {
				if (i === param.page) {
					str += '<a href="javascript:;" class="' + css.active + '" data-page="' + i + '">' + i + '</a>';
				} else {
					str += '<a href="javascript:;" data-page="' + i + '">' + i + '</a>';
				}
			}
		}
		// show results
		if (param.nmbOfEntries === 0) {
			$("." + css.nav + "," + "." + css.info, param.pager).empty();
		} else {
			$("." + css.nav, param.pager).html(str);
			$("." + css.info, param.pager).text(vv.total + ": " + param.nmbOfEntries + ". " + vv.show + ": " + ((param.page - 1) * param.numberBreak + 1) + "-" + param.finNumber);
		}
							
		return true;
	};