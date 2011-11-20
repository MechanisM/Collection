	
	/////////////////////////////////
	//// template model (advansed)
	/////////////////////////////////
	
	/**
	 * advansed model
	 * 
	 * @this {Colletion Object}
	 * @param param - объект настроек
	 * @param {Number} [param.page=this.dObj.prop.page] - активна страница
	 * @param {Collection} [param.collection=null] - коллекция (если не было пересчета заранее)
	 * @param {Number|Boolean} [param.numberBreak=this.dObj.prop.numberBreak] - количество записей на 1 страницу (константы: false - выводятся все записи)
	 * @param {Number} [param.pageBreak=this.dObj.prop.pageBreak] - количество выводимых страниц (навигация)
	 * @param {Selector} [param.calculator=this.dObj.prop.calculator] -  селектор, по которому cчитается количесво записей на страницу
	 * @param {Selector} [param.pager=this.dObj.prop.pager] - селектор к пейджеру
	 * @param {Number} [param.countRecords=this.dObj.sys.countRecords] - всего записей в объекте (с учётом фильтра)
	 * @param {Number} [param.countRecordsInPage=this.dObj.sys.countRecordsInPage] - всего записей на странице
	 * @param {Number} [param.countTotal=this.dObj.sys.countTotal] - номер последней записи на странице
	 * @return {Boolean}
	 */
	$.Collection.stat.templateModels.control = function (param) {
		param = param || {};
							
		var
			tmpCount = param.collection ? param.collection.Count : "",
								
			dObj = this.dObj,
			sys = dObj.sys,
			css = dObj.css,
			viewVal = dObj.viewVal,
			prop = dObj.prop,
							
			page = param.page || prop.page,
			calculator = param.calculator || prop.calculator,
			pager = $(param.pager || prop.pager),
			countRecords = param.countRecords || sys.countRecords || tmpCount || 0,
			countRecordsInPage = param.countRecordsInPage || sys.countRecordsInPage || $(calculator, prop.target).length,
			numberBreak = param.numberBreak || prop.numberBreak,
			pageBreak = param.pageBreak || prop.pageBreak,
			countTotal = param.countTotal || sys.countTotal || numberBreak * page - (numberBreak - countRecordsInPage),
			pageCount = countRecords % numberBreak !== 0 ? ~~(countRecords / numberBreak) + 1 : countRecords / numberBreak,
								
			str = "",
								
			pageActive = css.pageActive,
			pagingLeft = css.pagingLeft,
			pagingRight = css.pagingRight,
								
			pageDisablePrev = css.pageDisablePrev,
			pageDisableNext = css.pageDisableNext,
							
			aPrev = viewVal.aPrev,
			aNext = viewVal.aNext,
			show = viewVal.show,
			total = viewVal.total,
								
			i, j;
							
		if (pageCount > pageBreak) {
			if (page !== 1) {
				str += '<a href="javascript:;" data-action="set/page[1">' + aPrev + '</a>';
			} else {
				str += '<div class="' + pageDisablePrev + '">' + aPrev + '</div>';
			}
								
			for (j = 0, i = (page - 1); i++ < pageCount; j++) {	
				if (j === 0 && page !== 1) {
					str += '<a href="javascript:;" data-action="set/page[' + (i - 1) + '">' + (i - 1) + '</a>';
				}
							
				if (j === (numberBreak - 1)) { break; }
							
				if (i === page) {
					str += '<a href="javascript:;" class="' + pageActive + '">' + i + '</a>';
				} else {
					str += '<a href="javascript:;" data-action="set/page[' + i + '">' + i + '</a>';
				}
			}
								
			if (i !== (pageCount + 1)) {
				str += '\
					<a href="javascript:;" data-action="set/page[' + (i + 1) + '">' + (i + 1) + '</a>\
					<a href="javascript:;" data-action="set/page[' + pageCount + '">' + aNext + '</a>\
				';
			} else { str += '<div class="' + pageDisableNext + '">' + aNext + '</div>'; }
		} else {
			for (i = 0; i++ < pageCount;) {
				if (i === page) {
					str += '<a href="javascript:;" class="' + pageActive + '">' + i + '</a>';
				} else {
					str += '<a href="javascript:;" data-action="set/page[' + i + '">' + i + '</a>';
				}
			}
		}
							
		if (countRecords === 0) {
			$("." + pagingLeft + "," + "." + pagingRight, pager).empty();
		} else {
			$("." + pagingRight, pager).html(str);
			$("." + pagingLeft, pager).html(total + ": " + countRecords + ". " + show + ": " + ((page - 1) * numberBreak + 1) + "-" + countTotal);
		}
							
		return true;
	};