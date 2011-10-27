
	/**
	 * Простая модель шаблона (без указателей на страницы)
	 * 
	 * @this {Colletion Object}
	 * @param param - объект настроек
	 * @param {Number} [param.page=this.dObj.prop.activePage] - активная страница
	 * @param {Collection} [param.collection=null] - коллекция (если не было пересчета заранее)
	 * @param {Number|Boolean} [param.countBreak=this.dObj.prop.activeCountBreak] - количество записей на 1 страницу (константы: false - выводятся все записи)
	 * @param {Selector} [param.selectorOut=this.dObj.prop.activeSelectorOut] -  селектор, по которому cчитается количесво записей на страницу
	 * @param {Selector} [param.pager=this.dObj.prop.activePager] - селектор к пейджеру
	 * @param {Number} [param.countRecords=this.dObj.sys.countRecords] - всего записей в объекте (с учётом фильтра)
	 * @param {Number} [param.countRecordsInPage=this.dObj.sys.countRecordsInPage] - всего записей на странице
	 * @param {Number} [param.countTotal=this.dObj.sys.countTotal] - номер последней записи на странице
	 * @return {Boolean}
	 */
	$.Collection.cache.templateMode.simpleMode = function (param) {
		param = param || {};
							
		var
			tmpCount = param.collection ? param.collection.Count : "",
							
			dObj = this.dObj,
			sys = dObj.sys,
			css = dObj.css,
			viewVal = dObj.viewVal,
			prop = dObj.prop,
							
			page = param.page || prop.activePage,
			selectorOut = param.selectorOut || prop.activeSelectorOut,
			pager = $(param.pager || prop.activePager),
			countRecords = param.countRecords || sys.countRecords || tmpCount || 0,
			countRecordsInPage = param.countRecordsInPage || sys.countRecordsInPage || $(selectorOut, prop.activeTarget).length,
			countBreak = param.countBreak || prop.activeCountBreak,
			countTotal = param.countTotal || sys.countTotal || countBreak * page - (countBreak - countRecordsInPage),
								
			pageNumber = css.pageNumber,
			pagePrev = css.pagePrev,
			pageDisablePrev = css.pageDisablePrev,
			pageNext = css.pageNext,
			pageDisableNext = css.pageDisableNext,
								
			aPrev = viewVal.aPrev,
			aNext = viewVal.aNext,
			from = viewVal.from,
								
			disableNext,
			disablePrev;
			
		if (page === 1 && countRecordsInPage === countRecords) {
			$("." + pagePrev + "," + "." + pageDisablePrev + "," + "." + pageNext + "," + "." + pageDisableNext, pager).addClass(pageDisableNext);
		} else {
			if (countTotal === countRecords) {
				$("." + pageNext, pager).replaceWith('<div class="' + pageDisableNext + '">' + aNext + '</div>'); 
			} else {
				disableNext = $("." + pageDisableNext, pager);
				if (disableNext.length === 1) {
					disableNext.replaceWith('<a href="javascript:;" class="' + pageNext + '" data-action="set/page/next">' + aNext + '</a>'); 
				} else { $("." + pageNext, pager).removeClass(pageDisableNext); }
			}		
			if (page === 1) {
				$("." + pagePrev, pager).replaceWith('<div class="' + pageDisablePrev + '">' + aPrev + '</div>');
			} else {
				disablePrev = $("." + pageDisablePrev, pager);
				if (disablePrev.length === 1) {
					disablePrev.replaceWith('<a href="javascript:;" class="' + pagePrev + '" data-action="set/page/prev">' + aPrev + '</a>');
				} else { $("." + pagePrev, pager).removeClass(pageDisableNext); }
			}	
		}
									
		if (countRecordsInPage === 0) {
			$("." + pageNumber, pager).html(0);
		} else {
			$("." + pageNumber, pager).html(((page - 1) * countBreak + 1) + "-" + countTotal + ' ' + from + ' ' + countRecords);
		}
							
		return true;
	};