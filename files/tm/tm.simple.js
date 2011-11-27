	
	/////////////////////////////////
	//// template model (simple)
	/////////////////////////////////
	
	/**
	 * simple model
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @return {Boolean}
	 */
	$.Collection.templateModels.simple = function (param) {		
		var
			dObj = this.dObj,
			vv = dObj.viewVal,
			css = dObj.css;
		
		// next
		if (param.finNumber === param.nmbOfEntries) {
			$("." + css.next, param.pager).addClass(css.disabled);
		} else {
			$("." + css.next + "." + css.disabled, param.pager).removeClass(css.disabled);
		}
		// prev
		if (param.page === 1) {
			$("." + css.prev, param.pager).addClass(css.disabled);
		} else {
			$("." + css.prev + "." + css.disabled, param.pager).removeClass(css.disabled);
		}	
		// info
		if (param.nmbOfEntriesInPage === 0) {
			$("." + css.info, param.pager).empty();
		} else {
			$("." + css.info, param.pager).text(((param.page - 1) * param.numberBreak + 1) + "-" + param.finNumber + ' ' + vv.from + ' ' + param.nmbOfEntries);
		}
							
		return true;
	};