/**
 * $.Collection - JavaScript фреймворк для работы с коллекциями данных (использует jQuery)
 *
 * Автор: Кобец Андрей Александрович (kobezzza)
 * Дата: 25.10.2011 16:03:41
 *
 * Глоссарий:
 * 1) Коллекция - объект данных JavaScript (далее JS), может быть реализован, как массив, так и как хеш-таблица (можно совмещать массивы с хешем, например: [{...},{...},...]);
 * 2) Фильтр - специальная функция JS, по которой осуществляется выбор из коллекции по тому или иному условию;
 * 3) Парсер - специальная функция JS, осуществляющая постобработку результирующей строки выбора из коллекции;
 * 4) Контекст - строка, указывающая ссылку к определённому контексту (области) коллекции, например строка "Name~1" указывает на obj.Name[1], где obj - коллекция;
 * 5) Шаблон - специальная функция JS, которая преобразует коллекцию в строчный вид, в соответствии с указанными инструкциями, для вставки в DOM;
 * 6) Модель шаблона - специальная функция JS, которая генерирует панель навигации для шаблона.
 *
 * $.Collection состоит из:
 * 1) Шесть расширений объекта jQuery:
 * 1.1) collection - основной класс;
 * 1.2) tplCompile - функция "компиляции" шаблонов из DOM;
 * 1.3) isString - функция проверки на строку;
 * 1.4) isBoolean - функция проверки на логическое значение;
 * 1.5) isExist - функция проверки существование (отличие от null, undefined и empty string);
 * 1.6) unshiftArguments - функция, для модификации объекта arguments.
 * 2) Одно расширение объекта jQuery.prototype: 
 * 2.1) collection - функция преобразования коллекции jQuery в collection.
 *
 * Дополнение:
 * Код документирован в соответсвии со стандартом jsDoc
 * Специфичные типы данных:
 * 1) Colletion Object является сокращённой формой [Object] и означает экземпляр $.Collection;
 * 2) Collection является сокращённой формой [Array|Object] и означает коллекцию;
 * 3) Selector является сокращённой формой [String] и означает селектор css (Sizzle синтаксис);
 * 4) Context является сокращённой формой [String] и означает контекст коллекции;
 * 5) Template является сокращённой формой [Function] и означает функцию-шаблон;
 * 6) Template Mode является сокращённой формой [Function] и означает функцию-модель (режим);
 * 7) Filter является сокращённой формой [Function] и означает функцию-фильтр;
 * 8) Parser является сокращённой формой [Function] и означает функцию-парсер;
 * 9) Plain Object является сокращённой формой [Object] и означает хеш-таблицу;
 * 10) jQuery Object является сокращённой формой [Object] и означает экземпляр jQuery;
 * 11) jQuery Deferred является сокращённой формой [Object] и означает экземпляр jQuery.Deferred.
 * --
 * Запись, типа: [prop=undefined] означает, что данный параметр не обязательный и если не указан явно, то не определён (не имеет значения по умолчанию)
 * Все перегрузки методов документированны в описании метода, т.к. синтаксис jsDoc не позволяет этого сделать
 * --
 * Создание нового экземпляра $.Collection возможно, как с new, так и без
 * --
 * Для комфортной работы рекомендуется использовать последнюю стабильную версию jQuery
 *
 * Надеюсь данный класс окажеся вам полезным, наслаждайтесь!
 * 
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @version 4.0
 */
(function ($) {
	// Включение ECMAScript 5 "strict mode"
	"use strict";	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	/**
	 * @constructor
	 * @this {Colletion Object}
	 * @param {Collection|Selector} [collection=null] - collection or selector for field: activeTarget
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.prop] - user's preferences
	 */
	$.Collection = function (collection, uProp) {
		collection = collection || null;
		uProp = uProp || null;
		
		// create "factory" function if need
		if (this.fn && this.fn.jquery) { return new $.Collection(collection, uProp); }
		
		// mixin public fields
		$.extend(true, this, $.Collection.storage);
			
		var
			dObj = this.dObj,
			prop = dObj.prop;
				
		// extend public fields by user's preferences if need
		if (uProp) { $.extend(true, prop, uProp); }
				
		// if "collection" is string
		if ($.isString(collection)) {
			prop.activeTarget = $(collection);
			prop.activeCollection = null;
		} else { prop.activeCollection = collection; }
	};	
	/////////////////////////////////
	//// static methods (object && template mode)
	/////////////////////////////////
	
	// object for static methods
	$.Collection.stat = {};
	// static template mode
	$.Collection.stat.templateMode = {};
	
	// static methods for object
	$.Collection.stat.obj = {
		// link to constants
		constants: $.Collection.prototype.config.constants,
		
		/**
		* get object by link
		* 
		* @param {Object} obj - some object
		* @param {Context} context - link (sharp (#) char indicates the order)
		* @return {Object}
		*/
		getByLink: function (obj, context) {
			context = context.toString().split(constants.contextSeparator);
			
			var
				key, i = 0,
				pos, n = 0,
				
				objLength,
				cLength = context.length;
			
			for (; i < cLength; i++) {
				context[i] = $.trim(context[i]);
				//
				if (context[i] && context[i] !== constants.subcontextSeparator) {
					if (context[i].search(constants.subcontextSeparator) === -1) {
						obj = obj[context[i]];
					} else {
						pos = +context[i].replace(constants.subcontextSeparator, "");
						
						if ($.isArray(obj)) {
							if (pos >= 0) {
								obj = obj[pos];
							} else {
								obj = obj[obj.length + pos];
							}
						} else {
							if (pos < 0) { 
								objLength = 0;
								for (key in obj) {
									if (obj.hasOwnProperty(key)) { objLength++; }
								}
								//
								pos += objLength;
							}
							
							n = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) {
									if (pos === n) {
										obj = obj[key];
										break;
									}
									n++;
								}
							}
						}
					}
				}
			}
			
			return obj;
		},
		/**
		* set new value to object by link
		* 
		* @param {Object} obj - some object
		* @param {Context} context - link (sharp (#) char indicates the order)
		* @param {mixed} value - some value
		* @return {Boolean}
		*/
		setByLink: function (obj, context, value) {
			context = context.toString().split(constants.contextSeparator);
			
			var
				key, i = 0,
				pos, n = 0,
				
				objLength,
				cLength = context.length;
			
			// remove "dead" elements
			for (i = cLength; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === constants.subcontextSeparator) { context.splice(i, 1); }
			}
			// recalculate length
			cLength = context.length - 1;
			i = 0;
			
			for (; i <= cLength; i++) {
				if (context[i].search(constants.subcontextSeparator) === -1) {
					if (i === cLength) {
						obj[context[i]] = value;
					} else {
						obj = obj[context[i]];
					}
				} else {
					pos = +context[i].replace(constants.subcontextSeparator, "");
						
					if ($.isArray(obj)) {
						if (i === cLength) {
							if (pos >= 0) {
								obj[pos] = value;
							} else {
								obj[obj.length + pos] = value;
							}
						} else {
							if (pos >= 0) {
								obj = obj[pos];
							} else {
								obj = obj[obj.length + pos];
							}
						}
					} else {
						if (pos < 0) { 
							objLength = 0;
							for (key in obj) {
								if (obj.hasOwnProperty(key)) { objLength++; }
							}
							//
							pos += objLength;
						}
						
						n = 0;
						for (key in obj) {
							if (obj.hasOwnProperty(key)) {
								if (pos === n) {
									if (i === cLength) {
										obj[key] = value;
									} else {
										obj = obj[key];
									}
									break;
								}
								n++;
							}
						}
					}
				}
			}
			
			return true;
		},
		/**
		 * add new element to object
		 * 
		 * @param {Plain Object} obj - some object
		 * @param {String} prop - property name (can use "::unshift" - the result will be similar to work for an array "unshift")
		 * @param {mixed} value - some value
		 * @return {Plain Object|Boolean}
		 */
		addElementToObject: function (obj, prop, value) {
			prop = prop.split(constants.methodSeparator);
			
			var key, newObj = {};
			
			if (prop[1] && prop[1] == "unshift") {
				newObj[prop[0]] = value;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
				obj = newObj;
					
				return obj;
			} else if (!prop[1] || prop[1] == "push") {
				obj[prop[0]] = value;
			}
				
			return true;
		}
	};	
	/////////////////////////////////
	//// static methods (sort)
	/////////////////////////////////
	
	$.Collection.stat.sort = {
		/**
		 * sort field name
		 * 
		 * @field
		 * @type String|Null
		 */
		field: null,
		/**
		 * reverce
		 * 
		 * @field
		 * @type Boolean
		 */
		rev: false,
		/**
		 * shuffle
		 * 
		 * @field
		 * @type Boolean
		 */
		shuffle: false,
		/**
		 * sort callback
		 * 
		 * @field
		 * @type Function|Boolean|Null
		 */
		fn: null,
		
		/**
		 * main sort function
		 * 
		 * @param {String} [field=null] - field name
		 * @param {Boolean} [rev=false] - reverce (contstants: shuffle - random order)
		 * @param {Function} [fn=null] - callback
		 * @return {Function}
		 */
		sortBy: function (field, rev, fn) {
			this.field = field || null;
			this.rev = rev ? rev !== "shuffle" ? rev : false : false;
			this.shuffle = rev ? rev === "shuffle" ? rev : false : false;
			this.fn = fn || null;
				
			return this.sortHelper;
		},
		/**
		 * sort helper
		 * 
		 * @return {Number}
		 */
		sortHelper: function (a, b) {	
			var
				stat = $.Collection.stat,	
				$this = stat.sort,
				rev = $this.shuffle ? Math.round(Math.random() * 2  - 1) : $this.rev ? $this.rev === true ? -1 : 1 : 1;
			
			if ($this.field) {
				a = stat.obj.getByLink(a, $this.field);
				b = stat.obj.getByLink(b, $this.field);
			}
					
			if ($this.fn) {
				a = $this.fn(a);
				b = $this.fn(b);
			}
			
			if (!$this.shuffle) {	
				if (a < b) { return rev * -1; }
				if (a > b) { return rev; }
				
				return 0;
			} else { return rev; }
		}
	};	
	/////////////////////////////////
	//// prototype
	/////////////////////////////////
	
	$.Collection.fn = $.Collection.prototype = {
		/**
		 * framework name
		 * 
		 * @constant
		 * @type String
		 */
		name: "$.Collection",
		/**
		 * framework version
		 * 
		 * @constant
		 * @type String
		 */
		version: "4.0",
		/**
		 * return string: framework name + framework version
		 *
		 * @this {Collection Prototype}
		 * @return {String}
		 */
		collection: function () {
			return this.name + " " + this.version;
		},
		
		// framework config object
		config: {
			constants: {
				/**
				 * default "active" constant
				 * 
				 * @field
				 * @type String
				 */
				active: "active",
				
				/**
				 * default separator: context
				 * 
				 * @field
				 * @type String
				 */
				contextSeparator: "~",
				/**
				 * default separator: subcontext
				 * 
				 * @field
				 * @type String
				 */
				subcontextSeparator: "#",
				
				/**
				 * default separator: method
				 * 
				 * @field
				 * @type String
				 */
				methodSeparator: "::"
			},
			flags: {
				use: {
					/**
					 * use active context in methods
					 * 
					 * @field
					 * @type Boolean
					 */
					ac: true
				}
			}
		},
		
		/**
		 * stack parameters
		 * 
		 * @field
		 * @type Array
		*/
		stack: [
		"Collection",
		"Filter",
		"Context",
		"Cache",
		"Index",
		"Map",
		"Var",
		"Defer",
		
		"Page",
		"Parser",
		"AppendType",
		"Target",
		"SelectorOut",
		"Pager",
		"Template",
		"TemplateMode",
		"CountBreak",
		"PageBreak",
		"ResultNull"
		],
		
		//////
		
		/**
		 * return active context
		 * 
		 * @this {Collection Object}
		 * @return {String}
		 */
		getActiveContext: function () {
			return this.flags.use.ac === true ? this.dObj.prop.activeContext.toString() : "";
		},
		/**
		 * return link to callback function
		 * 
		 * @this {Collection Object}
		 * @param {String} [type='filter']
		 * @return {Link}
		 */
		callee: function (type) {
			type = type || "filter";
			
			return this.dObj.sys.callee[type];
		}
	};
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
	$.Collection.stat.templateMode.simpleMode = function (param) {
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
	/**
	 * Продвинутая модель шаблона
	 * 
	 * @this {Colletion Object}
	 * @param param - объект настроек
	 * @param {Number} [param.page=this.dObj.prop.activePage] - активна страница
	 * @param {Collection} [param.collection=null] - коллекция (если не было пересчета заранее)
	 * @param {Number|Boolean} [param.countBreak=this.dObj.prop.activeCountBreak] - количество записей на 1 страницу (константы: false - выводятся все записи)
	 * @param {Number} [param.pageBreak=this.dObj.prop.activePageBreak] - количество выводимых страниц (навигация)
	 * @param {Selector} [param.selectorOut=this.dObj.prop.activeSelectorOut] -  селектор, по которому cчитается количесво записей на страницу
	 * @param {Selector} [param.pager=this.dObj.prop.activePager] - селектор к пейджеру
	 * @param {Number} [param.countRecords=this.dObj.sys.countRecords] - всего записей в объекте (с учётом фильтра)
	 * @param {Number} [param.countRecordsInPage=this.dObj.sys.countRecordsInPage] - всего записей на странице
	 * @param {Number} [param.countTotal=this.dObj.sys.countTotal] - номер последней записи на странице
	 * @return {Boolean}
	 */
	$.Collection.stat.templateMode.controlMode = function (param) {
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
			pageBreak = param.pageBreak || prop.activePageBreak,
			countTotal = param.countTotal || sys.countTotal || countBreak * page - (countBreak - countRecordsInPage),
			pageCount = countRecords % countBreak !== 0 ? ~~(countRecords / countBreak) + 1 : countRecords / countBreak,
								
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
							
				if (j === (countBreak - 1)) { break; }
							
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
			$("." + pagingLeft, pager).html(total + ": " + countRecords + ". " + show + ": " + ((page - 1) * countBreak + 1) + "-" + countTotal);
		}
							
		return true;
	};	
	/////////////////////////////////
	//// public fields (prop)
	/////////////////////////////////
	
	$.Collection.storage = {
		// root
		dObj: {
			// active fields
			prop: {
				/////////////////////////////////
				//// data
				/////////////////////////////////
				
				/**
				 * active collection
				 * 
				 * @field
				 * @type Collection|Null
				 */
				activeCollection: null,
				/**
				 * active filter ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				activeFilter: false,
				/**
				 * active context
				 * 
				 * @field
				 * @type Context
				 */
				activeContext: "",
				/**
				 * active cache object
				 * 
				 * @field
				 * @type Plain Object
				 */
				activeCache: {
					/**
					 * auto cache
					 * 
					 * @field
					 * @type Boolean
					 */
					autoIteration: false,
					/**
					 * use cache
					 * 
					 * @field
					 * @type Boolean
					 */
					iteration: false,
					/**
					 * first iteration
					 * 
					 * @field
					 * @type Number
					 */
					firstIteration: -1,
					/**
					 * last iteration
					 * 
					 * @field
					 * @type Number
					 */
					lastIteration: -1
				},
				/**
				 * active index
				 * 
				 * @field
				 * @type Plain Object
				 */
				activeIndex: null,
				/**
				 * active map
				 * 
				 * @field
				 * @type Plain Object
				 */
				activeMap: null,
				/**
				 * active var
				 * 
				 * @field
				 * @type mixed
				 */
				activeVar: null,
				/**
				 * active deferred
				 * 
				 * @field
				 * @type jQuery Deferred
				 */
				activeDefer: "",
				
				/////////////////////////////////
				//// templating
				/////////////////////////////////
				
				/**
				 * active page (used in "extPrint")
				 * 
				 * @field
				 * @type Number
				 */
				activePage: 1,
				/**
				 * active parser ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				activeParser: false,
				/**
				 * active DOM insert mode (jQuery methods)
				 * 
				 * @field
				 * @param String
				 */
				activeAppendType: "html",
				/**
				 * active target (target to insert the result templating)
				 * 
				 * @field
				 * @type jQuery Object
				 */
				activeTarget: null,
				/**
				 * active selector (used to calculate the number of records one page)
				 * 
				 * @field
				 * @type Selector
				 */
				activeSelectorOut: ".SelectorOut",
				/**
				 * active pager
				 * 
				 * @field
				 * @type Selector
				 */
				activePager: "#PageControl",
				/**
				 * active template
				 * 
				 * @field
				 * @type Function
				 */
				activeTemplate: null,
				/**
				 * active template mode
				 * 
				 * @field
				 * @type Function
				 */
				activeTemplateMode: $.Collection.stat.templateMode.simpleMode,
				/**
				 * active records in one page
				 * 
				 * @field
				 * @type Number
				 */
				activeCountBreak: 10,
				/**
				 * active page count (used in "controlMode")
				 * 
				 * @field
				 * @type Number
				 */
				activePageBreak: 10,
				/**
				 * active empty result ("false" if disabled)
				 * 
				 * @field
				 * @type String|Boolean
				 */
				activeResultNull: false
			}
		}
	};	
	/////////////////////////////////
	//// public fields (system)
	/////////////////////////////////
	
	$.Collection.storage.dObj.sys = {
		/**
		 * "callee" object
		 * 
		 * @field
		 * @type Object
		 */
		callee: { 
			callback: null,
			filter: null,
			parser: null,
			template: null,
			templateMode: null
		}
	};
	
	// generate system fields
	(function (data) {
		var
			i,
			lowerCase,
			sys = $.Collection.storage.dObj.sys;
	
		for (i = data.length; i--;) {
			lowerCase = data[i].substring(0, 1).toLowerCase() + data[i].substring(1);
			
			sys["active" + data[i] + "ID"] = null;
			sys["tmp" + data[i]] = {};
			sys[lowerCase + "ChangeControl"] = null;
			sys[lowerCase + "Back"] = [];
		}
	})($.Collection.fn.stack);	
	/////////////////////////////////
	//// public fields (view value)
	/////////////////////////////////
	
	$.Collection.storage.dObj.viewVal = {
		aPrev: "&lt;&lt;",
		aNext: "&gt;&gt;",
		total: "total",
		show: "show",
		from: "from",
		noResultInSearch: "nothing was found"
	};	
	/////////////////////////////////
	//// public fields (css)
	/////////////////////////////////
	
	$.Collection.storage.dObj.css = {
		pageNumber: "pageNumber",
		pagePrev: "pagePrev",
		pageDisablePrev: "pageDisablePrev",
		pageNext: "pageNext",
		pageDisableNext: "pageDisableNext",
		pageActive: "pageActive",
		pagingRight: "pagingRight",
		pagingLeft: "pagingLeft",
		noResult: "noResult"
	};	
	/////////////////////////////////
	//// stack methods
	/////////////////////////////////
		
	/**
	 * extend property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {mixed} modProp - value
	 * @param {String} [id=this.active] - stack ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn._mod = function (propName, modProp, id) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			tmpActiveStr = "active" + propName,
			tmp = sys["tmp" + propName],
			activeID = sys[tmpActiveStr + "ID"],

			// extend function
			typeMod = function (target, mod) {
				if ($.isNumeric(target) || $.isString(target)) {
					target += mod;
				} else if ($.isArray(target)) {
					target.push(mod);
				} else if ($.isBoolean(target)) {
					if (mod === true && target === true) {
						target = false;
					} else {
						target = true;
					}
				}

				return target;
			};
		
		if (id && id !== this.active) {
			tmp[id] = typeMod(tmp[id], modProp);
			if (activeID && id === activeID) {
				prop[tmpActiveStr] = tmp[id];
			}
		} else {
			prop[tmpActiveStr] = typeMod(prop[tmpActiveStr], modProp);
			if (activeID) {
				tmp[activeID] = prop[tmpActiveStr];
			}
		}

		return this;
	};
	
	/**
	 * add new value to stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Plain Object} objID - stack ID or object (ID: value)
	 * @param {mixed} [newProp=undefined] - value (overload)
	 * @throw {Error} 
	 * @return {Colletion Object}
	 */
	$.Collection.fn._push = function (propName, objID, newProp) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,

			tmpActiveStr = "active" + propName,
			tmp = sys["tmp" + propName],
			activeID = sys[tmpActiveStr + "ID"],

			key;
			
		if ($.isPlainObject(objID)) {
			for (key in objID) {
				if (objID.hasOwnProperty(key)) {
					if (key === this.active) {
						throw new Error("invalid property name!");
					} else {
						if (tmp[key] && activeID && activeID === key) {
							this._update(propName, objID[key]);
						} else { tmp[key] = objID[key]; }
						
					}
				}
			}
		} else {
			if (key === this.active) {
				throw new Error("invalid property name!");
			} else {
				if (tmp[objID] && activeID && activeID === objID) {
					this._update(propName, newProp);
				} else { tmp[objID] = newProp; }
			}
		}

		return this;
	};
	/**
	 * set new active property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} id - stack ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn._set = function (propName, id) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			lowerCase = propName.substring(0, 1).toLowerCase() + propName.substring(1),

			tmpChangeControlStr = lowerCase + "ChangeControl",
			tmpActiveStr = "active" + propName,
			tmpActiveIDStr = tmpActiveStr + "ID";

		if (sys[tmpActiveIDStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIDStr] = id;
		} else {
			sys[tmpChangeControlStr] = false;
		}

		sys[lowerCase + "Back"].push(id);

		prop[tmpActiveStr] = sys["tmp" + propName][id];

		return this;
	};
	/**
	 * history back
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {Number} [nmb=1] - number of steps
	 * @return {Colletion Object}
	 */
	$.Collection.fn._back = function (propName, nmb) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			lowerCase = propName.substring(0, 1).toLowerCase() + propName.substring(1),
			tmpActiveStr = "active" + propName,
			propBack = sys[lowerCase + "Back"],

			pos;

		sys[lowerCase + "ChangeControl"] = false;

		pos = propBack.length - (nmb || 1) - 1;

		if (pos >= 0 && propBack[pos]) {
			if (sys["tmp" + propName][propBack[pos]]) {
				sys[tmpActiveStr + "ID"] = propBack[pos];
				prop[tmpActiveStr] = sys["tmp" + propName][propBack[pos]];

				propBack.splice(pos + 1, propBack.length);
			}
		}

		return this;
	};
	/**
	 * history back (if history changed)
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {Number} [nmb=1] - number of steps
	 * @return {Colletion Object}
	 */
	$.Collection.fn._backIf = function (propName, nmb) {
		if (this.dObj.sys[(propName.substring(0, 1).toLowerCase() + propName.substring(1)) + "ChangeControl"] === true) {
			return this._back.apply(this, arguments);
		}

		return this;
	};
	/**
	 * remove property from stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array|Plain Object} [objID=active] - stack ID or array of IDs
	 * @param {mixed} [deleteVal=false] - default value (for active properties)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._drop = function (propName, objID, deleteVal) {
		deleteVal = deleteVal === undefined ? false : deleteVal;

		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			tmpActiveStr = "active" + propName,
			tmpActiveIDStr = tmpActiveStr + "ID",
			tmpTmpStr = "tmp" + propName,

			activeID = sys[tmpActiveIDStr],

			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],

			i;

		if (tmpArray[0] && tmpArray[0] !== this.active) {
			for (i in tmpArray) {
				if (tmpArray.hasOwnProperty(i)) {
					if (!tmpArray[i] || tmpArray[i] === this.active) {
						if (activeID) { delete sys[tmpTmpStr][activeID]; }
						sys[tmpActiveIDStr] = null;
						prop[tmpActiveStr] = deleteVal;
					} else {
						delete sys[tmpTmpStr][tmpArray[i]];
						if (activeID && tmpArray[i] === activeID) {
							sys[tmpActiveIDStr] = null;
							prop[tmpActiveStr] = deleteVal;
						}
					}
				}
			}
		} else {
			if (activeID) { delete sys[tmpTmpStr][activeID]; }
			sys[tmpActiveIDStr] = null;
			prop[tmpActiveStr] = deleteVal;
		}

		return this;
	};
	/**
	 * reset property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array|Plain Object} [objID=active] - stack ID or array of IDs
	 * @param {mixed} [resetVal=false] - reset value
	 * @return {Colletion Object}
	 */
	$.Collection.fn._reset = function (propName, objID, resetVal) {
		resetVal = resetVal === undefined ? false : resetVal;

		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			tmpActiveStr = "active" + propName,
			tmpActiveIDStr = tmpActiveStr + "ID",
			tmpTmpStr = "tmp" + propName,

			activeID = sys[tmpActiveIDStr],

			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],

			i;

		if (tmpArray[0] && tmpArray[0] !== this.active) {
			for (i in tmpArray) {
				if (tmpArray.hasOwnProperty(i)) {
					if (!tmpArray[i] || tmpArray[i] === this.active) {
						if (activeID) {
							sys[tmpTmpStr][activeID] = resetVal;
						}
						prop[tmpActiveStr] = resetVal;
					} else {
						sys[tmpTmpStr][tmpArray[i]] = resetVal;
						if (activeID && tmpArray[i] === activeID) {
							prop[tmpActiveStr] = resetVal;
						}
					}
				}
			}
		} else {
			if (activeID) {
				sys[tmpTmpStr][activeID] = resetVal;
			}
			prop[tmpActiveStr] = resetVal;
		}

		return this;
	};
	/**
	 * reset property to another value
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array} [objID=active] - stack ID or array of IDs
	 * @param {String} [id=this.active] - source ID (for merge)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._resetTo = function (propName, objID, id) {
		var
			dObj = this.dObj,
			mergeVal = !id || id === this.active ? dObj.prop["active" + propName] : dObj.sys["tmp" + propName][id];
		
		return this._reset(propName, objID || "", mergeVal);
	};

	/**
	 * check the existence of property in the stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.active] - stack ID
	 * @return {Boolean}
	 */
	$.Collection.fn._exist = function (propName, id) {
		var 
			dObj = this.dObj,
			prop = dObj.prop;
		
		if ((!id || id === this.active) && dObj.sys["active" + propName + "ID"]) {
			return true;
		}
		if (dObj.sys["tmp" + propName][id] !== undefined) {
			return true;
		}

		return false;
	};
	/**
	 * check the property on the activity
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} id - stack ID
	 * @return {Boolean}
	 */
	$.Collection.fn._is = function (propName, id) {
		var 
			dObj = this.dObj,
			prop = dObj.prop;

		if (id === dObj.sys["active" + propName + "ID"]) {
			return true;
		}

		return false;
	};
	
	/////////////////////////////////
	//// assembly
	/////////////////////////////////
			
	/**
	 * use the assembly
	 * 
	 * @this {Colletion Object}
	 * @param {String} stack ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.use = function (id) {
		if (this._exist("Collection", id)) { this._set("Collection", id); }
		//
		if (this._exist("Filter", id)) { this._set("Filter", id); }
		//
		if (this._exist("Context", id)) { this._set("Context", id);  }
		//
		if (this._exist("Cache", id)) { this._set("Cache", id); }
		//
		if (this._exist("Index", id)) { this._set("Index", id); }
		//
		if (this._exist("Map", id)) { this._set("Map", id); }
		//
		if (this._exist("Var", id)) { this._set("Var", id); }
		//
		if (this._exist("Defer", id)) { this._set("Defer", id); }
		
		
		///////////
		
		
		if (this._exist("Page", id)) { this._set("Page", id); }
		//
		if (this._exist("Parser", id)) { this._set("Parser", id); }
		//
		if (this._exist("AppendType", id)) { this._set("AppendType", id); }
		//
		if (this._exist("Target", id)) { this._set("Target", id); }
		//
		if (this._exist("SelectorOut", id)) { this._set("SelectorOut", id); }
		//
		if (this._exist("Pager", id)) { this._set("Pager", id); }
		//
		if (this._exist("Template", id)) { this._set("Template", id); }
		//
		if (this._exist("TemplateMode", id)) { this._set("TemplateMode", id); }
		//
		if (this._exist("CountBreak", id)) { this._set("CountBreak", id); }
		//
		if (this._exist("PageBreak", id)) { this._set("PageBreak", id); }
		//
		if (this._exist("ResultNull", id)) { this._set("ResultNull", id); }
				
		return this;
	};	
	/////////////////////////////////
	//// stack methods
	/////////////////////////////////
	
	/**
	 * new property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {mixed} newProp - new property
	 * @return {Colletion Object}
	 */
	$.Collection.fn._$ = function (propName, newProp) {
		var
			dObj = this.dObj,
			prop = dObj.prop,

			tmpActiveStr = "active" + propName;

		prop[tmpActiveStr] = newProp;
		dObj.sys[tmpActiveStr + "ID"] = null;

		return this;
	};
	/**
	 * update active property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {mixed} newProp - new value
	 * @return {Colletion Object}
	 */
	$.Collection.fn._update = function (propName, newProp) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,

			tmpActiveStr = "active" + propName,
			tmpActiveIDStr = tmpActiveStr + "ID",
			activeID = sys[tmpActiveIDStr];

		prop[tmpActiveStr] = newProp;
		if (activeID) {
			sys["tmp" + propName][activeID] = prop[tmpActiveStr];
		}

		return this;
	};
	/**
	 * return property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.active] - stack ID
	 * @return {mixed}
	 */
	$.Collection.fn._get = function (propName, id) {
		var 
			dObj = this.dObj,
			prop = dObj.prop;
		
		if (id && id !== this.active) {
			return dObj.sys["tmp" + propName][id];
		}

		return prop["active" + propName];
	};	
	/////////////////////////////////
	//// control settings
	/////////////////////////////////
	
	/**
	 * set/get property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Plain Object} objKey - property name or object (name: value)
	 * @param {mixed} [value=undefined] - value (overload)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._prop = function (propName, objKey, value) {
		var
			dObj = this.dObj,
			prop = dObj[propName];
			
		if (arguments.length !== 3) {
			if ($.isPlainObject(objKey)) {
				$.extend(prop, objKey);
			} else { return prop[objKey]; }
		} else { prop[objKey] = value; }
			
		return this;
	};
		
	$.Collection.fn.prop = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "prop"));
	};
	$.Collection.fn.css = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "css"));
	};
	$.Collection.fn.viewVal = function (objKey, value) {
		return this._prop.apply(this, $.unshiftArguments(arguments, "viewVal"));
	};	
	// generate aliases
	(function (data) {
		var
			i,
			fn = $.Collection.fn,
			nm;
	
		for (i = data.length; i--;) {
			
			nm = data[i] !== "Collection" ? data[i] : "";
			
			fn["$" + nm] = function (nm) {
				return function (newParam) { return this._$(nm, newParam); };
			}(data[i]);
			//
			if (data[i] === "Context") {
				fn["mod" + nm] = function (nm) {
					return function (newParam, id) { return this._mod.apply(this, $.unshiftArguments(arguments, nm)); };
				}(data[i]);
			}
			//
			fn["update" + nm] = function (nm) {
				return function (newParam) { return this._update(nm, newParam); };
			}(data[i]);
			//
			fn["reset" + nm + "To"] = function (nm) {
				return function (objID, id) { return this._resetTo(nm, objID, id); };
			}(data[i]);	
			//
			fn["push" + nm] = function (nm) {
				return function (objID, newParam) { return this._push.apply(this, $.unshiftArguments(arguments, nm)); }
			}(data[i]);
			//
			fn["set" + nm] = function (nm) {
				return function (id) { return this._set(nm, id); };
			}(data[i]);
			//
			fn["pushSet" + nm] = function (nm) {
				return function (id, newParam) { return this._push(nm, id, newParam)._set(nm, id); };
			}(data[i]);
			//
			fn["back" + nm] = function (nm) {
				return function (nmb) { return this._back(nm, nmb || ""); };
			}(data[i]);	
			//
			fn["back" + nm + "If"] = function (nm) {
				return function (nmb) { return this._backIf(nm, nmb || ""); };
			}(data[i]);	
			//
			if (data[i] === "Filter" || data[i] === "Parser") {
				fn["drop" + nm] = function (nm) {
					return function () { return this._drop(nm, arguments); };
				}(data[i]);	
			} else {
				fn["drop" + nm] = function (nm) {
					return function () { return this._drop(nm, arguments, null); };
				}(data[i]);	
			}
			//
			if (data[i] === "Filter" || data[i] === "Parser") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments); };
				}(data[i]);	
			} else if (data[i] === "Page") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, 1); };
				}(data[i]);	
			} else if (data[i] === "Context") {
				fn["reset" + nm] = function (nm) {
					return function () { return this._reset(nm, arguments, ""); };
				}(data[i]);	
			}
			//
			fn["is" + nm] = function (nm) {
				return function (id) { return this._is(nm, id); };
			}(data[i]);	
			//
			fn["exist" + nm] = function (nm) {
				return function (id) { return this._exist(nm, id || ""); };
			}(data[i]);
			//
			fn["get" + nm] = function (nm) {
				return function (id) { return this._get(nm, id || ""); };
			}(data[i]);
		}
	})($.Collection.fn.stack);
	/**
	 * Установить значение элементу коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - дополнительный контекст (знак # указывает порядок)
	 * @param {mixed} value - значение
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.setElement = function (context, value, id) {
		context = $.isExist(context) ? context.toString() : "";
	
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			
			activeContext = this.getActiveContext();
		
		if (!context && !activeContext) {
			if (id && id !== this.active) {
				return this._push("Collection", id, value);
			} else {
				return this._update("Collection", value);
			}
		}
		
		statObj.setByLink(id && id !== this.active ? dObj.sys.tmpCollection[id] : prop.activeCollection, activeContext + statObj.contextSeparator + context, value);
	
		return this;
	};
	/**
	 * Получить элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - дополнительный контекст (знак # указывает порядок)
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {mixed}
	 */
	$.Collection.fn.getElement = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			
			activeContext = this.getActiveContext();
	
		return statObj.getByLink(id && id !== this.active ? dObj.sys.tmpCollection[id] : prop.activeCollection, activeContext + statObj.contextSeparator + context);
	};	
	/**
	 * Добавить новый элемент в объект (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} cValue - новый элемент или контекст для sourceID (знак # указывает порядок)
	 * @param {String} [propType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало") или имя добавляемого свойства (в случае если имеем дело с объектом, также для объекта к имени свойсва можно использовать приставку "::unshift" - результат будет аналогичен работе unshift для массива)
	 * @param {String} [activeID=this.dObj.prop.activeCollectionID] - ИД коллекции
	 * @param {String} [sourceID=undefined] - ИД коллекции из которого берётся значение для вставки
	 * @param {Boolean} [deleteType=false] - если установленно true, то удаляет элемент из переносимой коллекции
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.addElement = function (cValue, propType, activeID, sourceID, deleteType) {
		cValue = cValue !== undefined ? cValue : "";
		propType = propType || "push";
		deleteType = deleteType === true ? true : false;
	
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
	
			cObj, sObj,
	
			activeCollectionID = sys.activeCollectionID,
			
			tmpContext, tmpContextCheck,
	
			oCheck, lCheck;
		
		cObj = statObj.getByLink(activeID && activeID !== this.active ? sys.tmpCollection[activeID] : prop.activeCollection, prop.activeContext);
		
		if (typeof cObj === "object") {
			oCheck = $.isPlainObject(cObj);
	
			// Простое добавление
			if (!sourceID) {
				// Определение типа добавления
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + statObj.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), cValue);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(cValue);
					} else if (propType === "unshift") {
						cObj.unshift(cValue);
					}
				}
			// Перенос
			} else {
				cValue = $.isExist(cValue) ? cValue.toString() : "";
				sObj = statObj.getByLink(sourceID === this.active ? prop.activeCollection : sys.tmpCollection[sourceID], cValue);

				// Определение типа добавления
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + statObj.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), sObj);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(sObj);
					} else if (propType === "unshift") {
						cObj.unshift(sObj);
					}
				}
				
				// Удаление элемента
				if (deleteType === true) {
					if (sys.activeContextID) {
						tmpContext = sys.activeContextID;
						tmpContextCheck = true;
					} else {
						tmpContext = this._get("Context");
						tmpContextCheck = false;
					}
					this._$("Context", "");
	
					if (sourceID === this.active) {
						this.deleteElementByLink(cValue);
					} else { this.deleteElementByLink(cValue, sourceID); }
	
					if (tmpContextCheck === true) {
						this._set("Context", tmpContext);
					} else { this._$("Context", tmpContext); }
				}
			}
	
			// Перезаписываем ссылки (если для объекта использовался unshift)
			if (lCheck !== true) { this.setElement("", lCheck, activeID || ""); }
		} else { throw new Error("Unable to set property!"); }
	
		return this;
	};	
	/**
	 * Удалить элемент коллекции по ссылке (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - ссылка (знак # указывает порядок)
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementByLink = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			
			key, i = 0,
			pos, n = 0,
			
			objLength,
			cObj;
		//
		prop.activeContext = prop.activeContext.toString();
		
		if (!context && !prop.activeContext) {
			this.setElement("", null);
		} else {
			// Подготавливаем контекст
			context = (prop.activeContext + statObj.contextSeparator + context).split(statObj.contextSeparator);
			// Удаляем "мёртвые" элементы
			for (i = context.length; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === statObj.subcontextSeparator) { context.splice(i, 1); }
			}
			context = context.join(statObj.contextSeparator);

			// Выбор родительского элемента для проверки типа
			cObj = statObj.getByLink(id && id !== "active" ?
						dObj.sys.tmpCollection[id] : prop.activeCollection,
						context.replace(new RegExp("[^" + statObj.contextSeparator + "]+$"), ""));
			// Выбор ссылки
			context = context.replace(new RegExp(".*?([^" + statObj.contextSeparator + "]+$)"), "$1");

			if ($.isArray(cObj)) {
				context = +context.replace(statObj.subcontextSeparator, "");
				if (context >= 0) {
					cObj.splice(context, 1);
				} else { cObj.splice(cObj.length + context, 1); }
			} else {
				if (context.search(statObj.subcontextSeparator) === -1) {
					delete cObj[context];
				} else {
					pos = +context.replace(statObj.subcontextSeparator, "");
					if (pos < 0) { 
						objLength = 0;
						// Считаем длину объекта
						for (key in cObj) {
							if (cObj.hasOwnProperty(key)) { objLength++; }
						}
						// Если отсчёт идёт с конца
						pos += objLength;
					}

					n = 0;
					for (key in cObj) {
						if (cObj.hasOwnProperty(key)) {
							if (pos === n) {
								delete cObj[key];
								break;
							}
							n++;
						}
					}
				}
			}
		}
	
		return this;
	};
	/**
	 * Удалить элементы коллекции по ссылке (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext - ссылка (знак # указывает порядок), массив ссылок или объект (ИД коллекции: массив ссылок)
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementsByLink = function (objContext, id) {
		var key, i;
	
		if ($.isPlainObject(objContext)) {
			for (key in objContext) {
				if (objContext.hasOwnProperty(key)) {
					if ($.isArray(objContext[key])) {
						for (i = objContext[key].length; i--;) {
							this.deleteElementByLink(objContext[key][i], key);
						}
					} else { this.deleteElementByLink(objContext[key], key); }
				}
			}
		} else if ($.isArray(objContext)) {
			for (i = objContext.length; i--;) {
				this.deleteElementByLink(objContext[i], id || "");
			}
		} else { this.deleteElementByLink(objContext, id || ""); }
	
		return this;
	};	
	/**
	 * Конкатенация коллекций (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj - коллекция
	 * @param {Context} context - дополнительный контекст (знак # указывает порядок)
	 * @param {String} [id=this.active] - ИД коллекции, с которой происходит конкатенация
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.concat = function (obj, context, id) {
		context = $.isExist(context) ? context.toString() : "";
	
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
	
			cObj;
		
		cObj = statObj.getByLink(id && id !== this.active ? dObj.sys.tmpCollection[id] : prop.activeCollection, prop.activeContext + statObj.contextSeparator + context);	
		
		if (typeof cObj === "object") {
			if ($.isPlainObject(cObj)) {
				$.extend(true, cObj, obj)
			} else if ($.isArray(cObj)) {
				if ($.isArray(obj)) {
					cObj = Array.prototype.concat(cObj, obj);
					this.setElement(context, cObj, id || "");
				} else { this.addElement(obj, "push", id || ""); }
			}
		} else { throw new Error("Incorrect data type!"); }
	
		return this;
	};	
	/**
	 * Вернуть количество элементов в коллекции (с учётом контекста)
	 * 
	 * // Перегрузки:
	 * 1) Если нету входных параметров, то ИД равен активной коллекции, а фильтр отключён;
	 * 2) Если один входной параметр (строка), то он равен ИДу, а фильтр отключён;
	 * 3) Если один входной параметр (коллекция), то возвращается её длина (активный контекст не учитывается).
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Collection} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String|Collection} [id=this.active] - ИД коллекции или коллекция
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.fn.length = function (filter, id) {
		filter = $.isExist(filter) ? filter : false;
		
		var
			dObj = this.dObj,
			prop = dObj.prop,
	
			cObj, cOLength, aCheck,
	
			i, countRecords;
	

		if (!$.isFunction(filter)) {
			if (($.isString(filter) && !$.isExist(id)) || $.isArray(filter) || $.isPlainObject(filter)) {
				id = filter;
				filter = false;
			}
		}

		if (!id || id === this.active) {
			cObj = prop.activeCollection;
		} else if ($.isString(id)) {
			cObj = dObj.sys.tmpCollection[id];
		} else {
			aCheck = true;
			cObj = id;
		}
		//
		if (aCheck !== true) {
			cObj = $.Collection.stat.obj.getByLink(cObj, prop.activeContext);
		}
		// Если null
		if (cObj === null) { return 0; }
		
		cOLength = cObj.length;
		if ($.isString(cObj)) { return cOLength; }
		
		if (typeof cObj === "object") {
			if (filter === false && cOLength !== undefined) {
				countRecords = cOLength;
			} else {
				countRecords = 0;
				for (i in cObj) {
					if (cObj.hasOwnProperty(i)
					&& (
						filter === false
						|| this.customFilter(filter, cObj, i, cOLength || null, this, aCheck === true ? "array" : id ? id : this.active)) === true) {
						countRecords++;
					}
				}
			}
		} else { throw new Error("Incorrect data type!"); }
	
		return countRecords;
	};
	/**
	 * Перебрать коллекцию (с учётом контекста)
	 *
	 * // Перегрузки:
	 * 1) Если id имеет логическое значение, то он считается за mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - функция callback
	 * @param {Function} [callback.before=undefined] - функция callback, которая срабаывает перед началом итераций
	 * @param {Function} [callback.after=undefined] - функция callback, которая срабатывает после конца итераций
	 * @param {Function} [callback.beforeFilter=undefined] - функция callback, которая срабаывает перед фильтром
	 * @param {Function} [callback.afterFilter=undefined] - функция callback, которая срабатывает после фильтра
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный поиск
	 * @param {Number|Boolean} [count=false] - максимальное количество результатов (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.each = function (callback, filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.active;
	
		// Если id имеет логическое значение
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.active;
		}
	
		// Значения по умолчанию
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
	
			cObj, cOLength, tmpLength,
	
			i, j = 0;
		
		// Вешаем ссылку
		dObj.sys.callbackCallee = callback;
		// Событие "до" итераций
		if (callback.before) {
			if (callback.before.apply(this, arguments) === false) {
				return this;
			}
		}
		
		cObj = $.Collection.stat.obj.getByLink(id !== this.active ? sys.tmpCollection[id] : prop.activeCollection, prop.activeContext);
		cOLength = this.length(cObj);
		
		if ($.isArray(cObj)) {
			tmpLength = cOLength - 1;
			for (i = indexOf !== false ? indexOf - 1 : -1; i++ < tmpLength;) {
				if (count !== false && j === count) { break; }
				
				// Событие "до" фильтра итераций
				if (callback.beforeFilter) {
					if (callback.beforeFilter(cObj, i, cOLength, this, id) === false) {
						return this;
					}
				}
				
				if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
					if (from !== false && from !== 0) { from--; continue; }
					
					if (callback.call(this, cObj, i, cOLength, this, id) === false) { break; }
					if (mult === false) { break; }
					j++;
				}
				
				// Событие "после" фильтра итераций
				if (callback.afterFilter) {
					if (callback.afterFilter(cObj, i, cOLength, this, id) === false) {
						return this;
					}
				}
			}
		} else {
			for (i in cObj) {
				if (cObj.hasOwnProperty(i)) {
					if (count !== false && j === count) { break; }
					if (indexOf !== false && indexOf !== 0) { indexOf--; continue; }
					
					// Событие "до" фильтра итераций
					if (callback.beforeFilter) {
						if (callback.beforeFilter(cObj, i, cOLength, this, id) === false) {
							return this;
						}
					}
					
					if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
						if (from !== false && from !== 0) { from--; continue; }
							
						if (callback.call(this, cObj, i, cOLength, this, id) === false) { break; }
						if (mult === false) { break; }
						j++;
					}
					
					// Событие "после" фильтра итераций
					if (callback.afterFilter) {
						if (callback.afterFilter(cObj, i, cOLength, this, id) === false) {
							return this;
						}
					}
				}
			}
		}
		
		// Событие "после" итераций
		callback.after && callback.after.apply(this, arguments);
	
		return this;
	};	
	/**
	 * Искать элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный поиск
	 * @param {Number|Boolean} [count=false] - максимальное количество элементов для поиска (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Number|Array}
	 */
	$.Collection.fn.searchElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.active;
	
		// Если id имеет логическое значение
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.active;
		}
	
		// Значения по умолчанию
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			result = [],
			action = function (data, i, aLength, $this, id) {
				if (mult === true) {
					result.push(i);
				} else {
					result = i;
					return false;
				}
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * Искать элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Number|Array}
	 */
	$.Collection.fn.searchElement = function (filter, id) {
		return this.searchElements(filter || "", id || "", false);
	};	
	/**
	 * Вернуть элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный поиск
	 * @param {Number|Boolean} [count=false] - максимальное количество элементов для поиска (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {mixed}
	 */
	$.Collection.fn.returnElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.active;
	
		// Если id имеет логическое значение
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.active;
		}
	
		// Значения по умолчанию
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			result = [],
			action = function (data, i, aLength, $this, id) {
				if (mult === true) {
					result.push(data[i]);
				} else {
					result = data[i];
					return false;
				}
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return result;
	};
	/**
	 * Вернуть элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {mixed}
	 */
	$.Collection.fn.returnElement = function (filter, id) {
		return this.returnElements(filter || "", id || "", false);
	};	
	/**
	 * Заменить элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {mixed} replaceObj - объект замены (если функция, то выполняется, как callback) 
	 * @param {String} [id=this.active] - ИД коллекции
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественная замена
	 * @param {Number|Boolean} [count=false] - максимальное количество замен (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElements = function (filter, replaceObj, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.active;
	
		// Если id имеет логическое значение
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.active;
		}
	
		// Значения по умолчанию
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
	
		var
			replaceCheck = $.isFunction(replaceObj),
			action = function (data, i, aLength, $this, id) {
				if (replaceCheck) {
					replaceObj(data, i, aLength, $this, id);
				} else { data[i] = replaceObj; }
	
				return true;
			};
	
		this.each(action, filter, id, mult, count, from, indexOf);
	
		return this;
	};
	/**
	 * Заменить элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {mixed} replaceObj - объект замены (если функция, то выполняется, как callback) 
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElement = function (filter, replaceObj, id) {
		return this.replaceElements(filter || "", replaceObj, id || "", false);
	};	
	/**
	 * Переместить элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Context} context - контекст для коллекции-источника (знак # указывает порядок)
	 * @param {String|Array} [sourceID=this.active] - ИД коллекции-источника
	 * @param {String|Array} [activeID=this.active] - ИД коллекции (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный перенос
	 * @param {Number|Boolean} [count=false] - максимальное количество переносов (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @param {Boolean} [deleteType=true] - если установленно true, то удаляет элемент из переносимой коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, deleteType) {
		moveFilter = moveFilter || false;
		deleteType = deleteType === false ? false : true;
		context = $.isExist(context) ? context.toString() : "";
		
		sourceID = sourceID || "";
		activeID = activeID || "";
		
		addType = addType || "push";
	
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			sys = dObj.sys,
	
			tmpContext, tmpContextCheck, tmpLength,
	
			deleteList = [],
			aCheckType,
	
			elements, i, j;
	
		aCheckType = $.isArray(statObj.getByLink(this._get("Collection", activeID), dObj.prop.activeContext));
	
		// Поиск элементов для переноса
		if (sys.activeContextID) {
			tmpContext = sys.activeContextID;
			tmpContextCheck = true;
		} else {
			tmpContext = this._get("Context");
			tmpContextCheck = false;
		}
		this._$("Context", context);
		//
		elements = this.searchElements(moveFilter, sourceID, mult, count, from, indexOf);
		//
		if (tmpContextCheck === true) {
			this._set("Context", tmpContext);
		} else {
			this._$("Context", tmpContext);
		}
	
		// Перенос элементов
		if (mult === true) {
			tmpLength = elements.length - 1;
	
			for (i = -1; i++ < tmpLength;) {
				this.addElement(context + statObj.contextSeparator + elements[i], aCheckType === true ? addType : elements[i] + statObj.methodSeparator + addType, activeID, sourceID);

				deleteType === true && deleteList.push(elements[i]);
			}
		} else {
			this.addElement(context + statObj.contextSeparator + elements, aCheckType === true ? addType : elements + statObj.methodSeparator + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
	
		// Удаляем, если нужно, элементы
		if (deleteType === true) {
			this._$("Context", context);
			this.deleteElementsByLink(deleteList, sourceID);
	
			if (tmpContextCheck === true) {
				this._set("Context", tmpContext);
			} else {
				this._$("Context", tmpContext);
			}
		}
	
		return this;
	},
	/**
	 * Переместить элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Context} context - контекст для коллекции-источника (знак # указывает порядок)
	 * @param {String|Array} [sourceID=this.active] - ИД коллекции-источника
	 * @param {String|Array} [activeID=this.active] - ИД коллекции (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false);
	};
	/**
	 * Копировать элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Context} context - контекст для коллекции-источника (знак # указывает порядок)
	 * @param {String|Array} [sourceID=this.active] - ИД коллекции-источника
	 * @param {String|Array} [activeID=this.active] - ИД коллекции (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный перенос
	 * @param {Number|Boolean} [count=false] - максимальное количество переносов (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf) {
		moveFilter = moveFilter || false;
		context = $.isExist(context) ? context.toString() : "";
		
		sourceID = sourceID || "";
		activeID = activeID || "";
		
		addType = addType || "push";
	
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		return this.moveElements(moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf, false);
	};
	/**
	 * Копировать элмент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Context} context - контекст для коллекции-источника (знак # указывает порядок)
	 * @param {String|Array} [sourceID=this.active] - ИД коллекции-источника
	 * @param {String|Array} [activeID=this.active] - ИД коллекции (куда переносится)
	 * @param {String} [addType="push"] - тип добавления (константы: "push" - добавить в конец, "unshift" - добавить в начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false, "", "", "", false);
	};	
	/**
	 * Удалить элементы коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественное удаление
	 * @param {Number|Boolean} [count=false] - максимальное количество удалений (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.active;
	
		// Если id имеет логическое значение
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.active;
		}
	
		// Значения по умолчанию
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var elements = this.searchElements(filter, id, mult, count, from, indexOf), i;

		if (mult === false) {
			this.deleteElementByLink(elements, id);
		} else {
			for (i = elements.length; i--;) {
				this.deleteElementByLink(elements[i], id);
			}
		}
	
		return this;
	};
	/**
	 * Удалить элемент коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElement = function (filter, id) {
		return this.deleteElements(filter || "", id || "", false);
	};	
	/////////////////////////////////
	// Дополнительные методы
	/////////////////////////////////
	
	/**
	 * Расчитать сложный фильтр
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|Array|String} [filter=false] - условие поиска или массив атомов условия или строковое условие
	 * @param {Collection} $this - ссылка на коллекцию
	 * @param {Number|String} i - ключ итерации
	 * @param {Number} cALength - длина коллекции
	 * @param {Collection Object} $obj - ссылка на объект $.Collection
	 * @param {String} id - ИД активной коллекции
	 * @return {Boolean}
	 */
	$.Collection.fn.customFilter = function (filter, $this, i, cALength, $obj, id) {
		var
			tmpFilter,
		
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
			
			fLength,
			calFilter,
			
			result = true, tmpResult,
			and, or, inverse,
			
			j = -1;
	
		if ($.isFunction(filter)) {
			dObj.sys.filterCallee = filter;
			
			return filter($this, i, cALength, $obj, id);
		}
		
		if (!filter || ($.isString(filter) && $.trim(filter) === this.active)) {
			if (prop.activeFilter) {
				dObj.sys.filterCallee = prop.activeFilter;
				
				return prop.activeFilter($this, i, cALength, $obj, id);
			}
	
			return true;
		} else {
			// Если фильр задан строкой, то парсим его
			if (!$.isArray(filter)) {
				// Если простой фильр
				if (filter.search(/\|\||&&|!|\(|\)/) === -1) {
					dObj.sys.filterCallee = sys.tmpFilter[filter];
					
					return sys.tmpFilter[filter]($this, i, cALength, $obj, id);
				}
				
				filter = $.trim(
							filter
								.toString()
								.replace(/\s*(\(|\))\s*/g, " $1 ")
								.replace(/\s*(\|\||&&)\s*/g, " $1 ")
								.replace(/(!)\s*/g, "$1")
							)
						.split(" ");
			}
			// Расчёт вложенных фильтров
			calFilter = function (array, iter) {
				var
					i = -1,
					aLength = array.length - 1,
					pos = 0,
					result = [];
				
				for (; i++ < aLength;) {
					iter++;
					if (array[i] === "(") { pos++; }
					if (array[i] === ")") {
						if (pos === 0) {
							return {result: result, iter: iter};
						} else { pos--; }
					}
					result.push(array[i]);
				}
			};
			// Расчитываем фильтр
			fLength = filter.length - 1;
			
			for (; j++ < fLength;) {
				// Расчёт скобок
				if (filter[j] === "(" || filter[j] === "!(") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = calFilter(filter.slice((j + 1)), j);
					j = tmpFilter.iter;
					//
					tmpResult = this.customFilter(tmpFilter.result, $this, i, cALength, $obj, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else {
						result = inverse === true ? !tmpResult : tmpResult || result;
					}
				// Расчёт внешних фильтров
				} else if (filter[j] !== ")" && filter[j] !== "||" && filter[j] !== "&&") {
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = filter[j] === this.active ? prop.activeFilter : sys.tmpFilter[filter[j]];
					dObj.sys.filterCallee = tmpFilter;
					//
					tmpResult = tmpFilter($this, i, cALength, $obj, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else {
						result = inverse === true ? !tmpResult : tmpResult || result;
					}
				// И и ИЛИ
				} else if (filter[j] === "||") {
					and = false;
					or = true;
				} else if (filter[j] === "&&") {
					or = false;
					and = true;
				}
			}
			
			return result;
		}
	};
	/**
	 * Расчитать сложный парсер
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|Array|String} parser - парсер или массив парсеров или строковое условие
	 * @param {String} str - исходная строка
	 * @return {String}
	 */
	$.Collection.fn.customParser = function (parser, str) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
			
			tmpParser,
			i;
	
		if ($.isFunction(parser)) {
			dObj.sys.parserCallee = parser;
			
			return parser(str, this);
		}
	
		if (!parser || ($.isString(parser) && $.trim(parser) === this.active)) {
			if (prop.activeParser) {
				dObj.sys.parserCallee = prop.activeParser;
				
				return prop.activeParser(str, this);
			}
	
			return str;
		} else {
			if ($.isString(parser)) {
				parser = $.trim(parser);
				if (parser.search("&&") === -1) {
					dObj.sys.parserCallee = sys.tmpParser[parser];
					
					return sys.tmpParser[parser](str, this);
				}
				parser = parser.split("&&");
			}
			
			for (i = parser.length; i--;) {
				parser[i] = $.trim(parser[i]);
				tmpParser = parser[i] === this.active ? prop.activeParser : sys.tmpParser[parser[i]];
				
				dObj.sys.parserCallee = tmpParser;
				str = tmpParser(str, this);
			}
	
			return str;
		}
	};
	
	
	/**
	 * Расчитать контекст на n уровней вверх
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - уровень подъёма
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {String}
	 */
	$.Collection.fn.parentContext = function (n, id) {
		n = n || 1;
	
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			activeContextID = sys.activeContextID,
			context = "",
	
			i;
	
		context = (id && id !== this.active ? sys.tmpContext[id] : prop.activeContext).split($.Collection.stat.obj.contextSeparator);
	
		for (i = n; i--;) { context.splice(-1, 1); }
	
		return context.join($.Collection.stat.obj.contextSeparator);
	};
	/**
	 * Подняться на n уровень контекста
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - уровень подъёма
	 * @param {String} [id=this.active] - ИД коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.parent = function (n, id) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			activeContextID = dObj.sys.activeContextID,
			context = this.parentContext.apply(this, arguments);
	
		if (!id || id === this.active) {
			if (activeContextID) {
				sys.tmpContext[activeContextID] = context;
			}
			prop.activeContext = context;
		} else {
			sys.tmpContext[id] = context;
			if (activeContextID && id === activeContextID) {
				prop.activeContext = context;
			}
		}
	
		return this;
	};	
	/**
	 * Сортировать коллекцию (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [field] - поле сортировки
	 * @param {Boolean} [rev=false] - перевернуть массив (константы: shuffle - случайное перемешивание массива)
	 * @param {Function|Boolean} [fn=toUpperCase] - функция действий над элементами коллекций (false - если ничего не делать)
	 * @param {String} [id=this.active] - ИД коллекции
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.orderBy = function (field, rev, fn, id) {
		field = field || null;
		rev = rev || false;
		fn = fn ? fn === false ? null : fn : function (a) {
			if (isNaN(a)) { return a.toUpperCase(); }
			
			return a;
		};
	
		id = id || "";
	
		var
			statObj = $.Collection.stat,
		
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
	
			activeCollectionID = sys.activeCollectionID,
	
			cObj,
	
			i,
	
			// Сортировка объекта по ключам
			sortObjectByKey = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					i;
	
				for (i in obj) { if (obj.hasOwnProperty(i)) { sortedKeys.push(i); } }
	
				sortedKeys.sort(statObj.sort.sortBy(field, rev, fn));
	
				for (i in sortedKeys) {
					if (sortedKeys.hasOwnProperty(i)) {
						sortedObj[sortedKeys[i]] = obj[sortedKeys[i]];
					}
				}
	
				return sortedObj;
			},
			// Сортировка объекта по значениям
			sortObject = function (obj) {
				var
					sortedValues = [],
					sortedObj = {},
					i;
	
				for (i in obj) {
					if (obj.hasOwnProperty(i)) {
						sortedValues.push({
							key: i,
							value: obj[i]
						});
					}
				}
	
				sortedValues.sort(statObj.sort.sortBy(field === true ? "value" : "value" + statObj.obj.contextSeparator + field, rev, fn));
	
				for (i in sortedValues) {
					if (sortedValues.hasOwnProperty(i)) {
						sortedObj[sortedValues[i].key] = sortedValues[i].value;
					}
				}
	
				return sortedObj;
			};
	
		cObj = statObj.obj.getByLink(id ? sys.tmpCollection[id] : prop.activeCollection, prop.activeContext);
	
		if (typeof cObj === "object") {
			if ($.isArray(cObj)) {
				cObj.sort(statObj.sort.sortBy(field, rev, fn));
			} else {
				if (field) {
					cObj = sortObject.call(this, cObj);
				} else {
					cObj = sortObjectByKey.call(this, cObj);
				}
	
				this.setElement("", cObj, id || "");
			}
		} else { throw new Error("Incorrect data type!"); }
	
		return this;
	};	
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
	
		cObj = vID && $.isString(vID) && vID !== this.active ? dObj.sys.tmpCollection[vID] : typeof vID === "object" ? vID : prop.activeCollection;
		cObj = $.Collection.stat.obj.getByLink(cObj, prop.activeContext);
		
		return JSON.stringify(cObj, replacer || "", space || "");
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
	/**
	 * Функция для работы в цепочке с deferred
	 * 
	 * @this {Colletion Object}
	 * @param {Function} done - callback в случае успеха
	 * @param {Function} [fail=done] - callback в случае провала
	 * @return {Colletion Object}
	 */
	$.Collection.fn.then = function (done, fail) {
		var $this = this;
		
		if (arguments.length === 1) {
			$.when(this.prop("activeDefer")).always(function () { done.apply($this, arguments); });
		} else {
			$.when(this.prop("activeDefer")).then(
				function () { done().apply($this, arguments); },
				function () { fail().apply($this, arguments); }
			);
		}
			
		return this;
	};	
	/**
	 * Простая шаблонизация коллекции (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param param - объект настроек
	 * @param {Template} [param.template=this.dObj.prop.activeTemplate] - шаблон
	 * @param {jQuery Object|Boolean} [param.target=this.dObj.prop.activeTarget] - контейнер вывода результата (false - если выводить в переменную)
	 * @param {String} [param.variable=this.dObj.sys.activeVarID] - ИД переменной (если param.target === false)
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.prop.activeParser] - парсер, ИД парсера, строковое условие или false
	 * @param {Selector} [param.pager=this.dObj.prop.activePager] - селектор к пагинатору
	 * @param {String} [param.appendType=this.dObj.prop.activeAppendType] - режим добавления в DOM
	 * @param {String} [param.resultNull=this.dObj.prop.activeResultNull] - текст, выводимый в случае если результатов нету
	 * @param {Boolean} [mult=true] - если установлено true, то осуществляется множественный поиск
	 * @param {Number|Boolean} [count=false] - максимальное количество записей (по умолчанию: весь объект)
	 * @param {Number|Boolean} [from=false] - количество пропускаемых элементов (по умолчанию: -1 - начало)
	 * @param {Number|Boolean} [indexOf=false] - точка отсчёта (по умолчанию: -1 - начало)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.print = function (param, mult, count, from, indexOf) {
		param = param || {};
		
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			$this = this,
			dObj = $this.dObj,
			prop = dObj.prop,
	
			activeParser = param.parser || prop.activeParser,
			activeTemplate = param.template || prop.activeTemplate,
	
			activeTarget = param.target || param.target === false ? param.target : prop.activeTarget,
			activeResultNull = param.resultNull !== undefined ? param.resultNull : prop.activeResultNull,
	
			result = "",
			action = function (data, i, aLength, $this, objID) {
				result += activeTemplate(data, i, aLength, $this, objID);
				
				if (mult !== true) { return false; }
	
				return true;
			};
		
		// Ставим ссылку на шаблон
		dObj.sys.templateCallee = activeTemplate;
		
		this.each(action, (param.filter || prop.activeFilter), "active", mult, count, from, indexOf);
		
		result = !result ? activeResultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResultInSearch + '</div>' : activeResultNull : result;
		result = activeParser !== false ? $this.customParser((activeParser), result) : result;
		
		if (activeTarget === false) {
			if (!param.variable) {
				$this.$Var(result);
			} else {
				$this.PushSetVar(param.variable, result);
			}
		} else { activeTarget[(param.appendType || prop.activeAppendType)](result); }
	
		return $this;
	};	
	/**
	 * Сложная шаблонизация коллекции (с учётом контекста) (с активацией пагинатора)
	 * 
	 * @this {Colletion Object}
	 * @param param - объект настроек
	 * @param {Number} [param.page=this.dObj.prop.activePage] - номер страницы
	 * @param {Template} [param.template=this.dObj.prop.activeTemplate] - шаблон
	 * @param {Number|Boolean} [param.countBreak=this.dObj.prop.activeCountBreak] - количество записей на 1 страницу (false - выводятся все записи)
	 * @param {Number} [param.pageBreak=this.dObj.prop.activePageBreak] - количество выводимых страниц (навигация)
	 * @param {jQuery Object} [param.target=this.dObj.prop.activeTarget] - контейнер вывода результата
	 * @param {Filter|String|Boolean} [filter=false] - фильтр, ИД фильтра, cтроковое условие или false
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.prop.activeParser] - ИД парсера, строковое условие или false
	 * @param {Boolean} [param.cacheIteration=this.dObj.cache.iteration] - если true, то последняя итерация берется из кеша
	 * @param {Selector} [param.selectorOut=this.dObj.prop.activeSelectorOut] - cелектор, по которому читается количество записей на страницу
	 * @param {Selector} [param.pager=this.dObj.prop.activePager] - селектор к пагинатору
	 * @param {String} [param.appendType=this.dObj.prop.activeAppendType] - режим добавления в DOM
	 * @param {String} [param.resultNull=this.dObj.prop.activeResultNull] - текст, выводимый в случае если результатов нету
	 * @return {Colletion Object}
	 */
	$.Collection.fn.extPrint = function (param) {
		param = param || {};
		
		var
			$this = this,
			dObj = $this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			cObj,
			cOLength,
			start, inc = 0,
	
			activeFilter = param.filter ? param.filter : prop.activeFilter,
			activeParser = param.parser ? param.parser : prop.activeParser,
			//
			activePage = param.page || prop.activePage,
			checkPage = activePage === (param.page + 1),
			//
			activeTemplate = param.template || prop.activeTemplate,
			//
			activeTarget = param.target || prop.activeTarget,
			activeCountBreak = +param.countBreak || +prop.activeCountBreak,
			activePageBreak = +param.countBreak || +prop.activePageBreak,
			//
			cache = prop.activeCache,
			cacheIteration = $.isBoolean(param.cacheIteration) ? param.cacheIteration : cache.iteration,
			//
			activeResultNull = param.resultNull !== undefined ? param.resultNull : prop.activeResultNull,
	
			result = "",
			action = function (data, i, aLength, $this, objID) {
				result += activeTemplate(data, i, aLength, $this, objID);
				inc = i;
				
				return true;
			};
			
		// Получаем коллекцию
		cObj = $.Collection.stat.obj.getByLink(prop.activeCollection, (param.context || prop.activeContext));
		cOLength = $this.length();
		// Количество записей на страницу
		activeCountBreak = activeCountBreak === false ? cOLength : activeCountBreak;
		
		// Ставим ссылку на шаблон
		dObj.sys.templateCallee = activeTemplate;
		
		if ($.isPlainObject(cObj) || cacheIteration === false) {
			start = activePage === 1 ? activeCountBreak : (activePage - 1) * activeCountBreak;
			//
			this.each(action, activeFilter, "active", true, activeCountBreak, start);
		} else if ($.isArray(cObj) && cacheIteration === true) {
			// Вычисляем стартовую позицию
			start = activeFilter === false ?
						activePage === 1 ? -1 : (activePage - 1) * activeCountBreak - 1 : cacheIteration === true ?
							checkPage === true ? cache.firstIteration : cache.lastIteration : i;
			
			// Перематывание кешированного шага назад
			if (checkPage === true && activeFilter !== false) {
				for (; start--;) {
					if ($this.customFilter(activeFilter, cObj, start, cOLength, $this, "active") === true) {
						if (inc === activeCountBreak) {
							break;
						} else { inc++; }
					}
				}
				start = start === -1 ? start : start + 1;
				cache.lastIteration = start;
			}
			
			this.each(action, activeFilter, "active", true, activeCountBreak, null, start);
			//
			cache.firstIteration = cache.lastIteration;
			cache.lastIteration = inc - 1;
			if (cache.autoIteration === true) {
				cache.iteration = true;
			}
		}
		
		result = !result ? activeResultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResultInSearch + '</div>' : activeResultNull : result;
		result = activeParser !== false ? $this.customParser(activeParser, result) : result;
		
		// Вставляем в DOM
		activeTarget[(param.appendType || prop.activeAppendType)](result);
		
		// Подготовка данных для панели навигации
		sys.countRecords = $this.length(activeFilter);
		sys.countRecordsInPage = $((param.selectorOut || prop.activeSelectorOut), activeTarget).length;
		sys.countTotal = activeCountBreak * activePage - (activeCountBreak - sys.countRecordsInPage);
	
		$.extend(param, {
			countRecords: sys.countRecords,
			countRecordsInPage: sys.countRecordsInPage,
			countTotal: sys.countTotal
		});
		// Генерерируем панель навигации
		if (activePage !== 1 && sys.countRecordsInPage === 0) {
			dObj.prop.activePage--;
			$this.extPrint.apply($this, arguments);
		} else { $this.easyPage(param, dObj.prop); }
	
		return $this;
	};
	/**
	 * Активация модели шаблона
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param=undefined] - объект настроект (зависит от модели шаблона)
	 * @param {Object} [prop=undefined] - свойства коллекции
	 * @return {Colletion Object}
	 */
	$.Collection.fn.easyPage = function (param, prop) {
		// Ставим ссылку на модель
		this.dObj.sys.templateModeCallee = this.dObj.prop.activeTemplateMode;
		this.dObj.prop.activeTemplateMode.apply(this, arguments);
		
		return this;
	};	
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
	$.Collection.fn.genIndex = function (indexName, id, fieldObj, filter, count, from, indexOf) {
		id = id || this.active;
		
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
		
			cObj,
			resObj = {};
		
		
		
		console.log(resObj);
	};
	$.Collection.fn.genMap = function (id1, id2, context1, context2) {
		var
			activeCollectionID = this.dObj.sys.activeCollectionID,
		
			cObj1, cObj2,
			resObj = {};
	
		if ((!id1 || id1 === this.active || !id2 || id2 === this.active) && activeCollectionID) {
			id1 = id1 || activeCollectionID;
			id2 = id2 || activeCollectionID;
		} else if (!activeCollectionID) { throw new Error("Invalid ID collection"); }
		
		cObj1 = 
		
		console.log(resObj);
	}	
	/**
	 * Работа с коллекциями jQuery
	 * 
	 * @this {jQuery Object}
	 * @param {Object} prop - объект настроек
	 * @return {Colletion Object}
	 */
	$.fn.collection = function (prop) {
		var
			stat = $.fn.collection.stat,
			text = function (elem) {
				elem = elem.childNodes;
				var
					eLength = elem.length - 1,
					i = -1,
					str = "";
	
				for (; i++ < eLength;) {
					if (elem[i].nodeType === 3 && $.trim(elem[i].textContent)) {
						str += elem[i].textContent;
					}
				}
	
				if (str) { return str; }
	
				return false;
			},
			inObj = function (elem) {
				var array = [];
				elem.each(function (n) {
					var
						$this = $(this),
						data = $this.data(),
	
						classes = $this.attr("class") ? $this.attr("class").split(" ") : "",
						cLength = classes ? classes.length : 0,
	
						txt = text($this[0]),
	
						i;
	
					array.push({});
	
					for (i in data) {
						if (data.hasOwnProperty(i)) {
							array[n][i] = data[i];
						}
					}
	
					if (cLength) {
						array[n][stat.classes] = {};
						for (i = 0; i < cLength; i++) {
							array[n][stat.classes][classes[i]] = classes[i];
						}
					}
	
					if ($this.children().length !== 0) {
						array[n][stat.childNodes] = inObj($this.children());
					}
	
					if (txt !== false) {
						array[n][stat.val] = txt.replace(/[\r\t\n]/g, " ");
					}
				});
	
				return array;
			},
			array = inObj(this);
	
		if (prop) { return new $.Collection(array, prop); }
	
		return new $.Collection(array);
	};
	// Стандартные данные
	if (!$.fn.collection.stat) {
		$.fn.collection.stat = {
			val: "val",
			childNodes: "childNodes",
			classes: "classes"
		};
	};	
	/**
	 * Компиляция шаблона
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
			resStr = "var result = ''",
			jsStr = '',
			
			i = -1, j, jelength;
		
		for (; i++ < eLength;) {
			if (i === 0 || i % 2 === 0) {
				resStr += "+'" + elem[i] +  "'";
			} else {
				j = -1;
				elem[i] = elem[i].split("`");
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
		return new Function("$this", "i", "aLength", "$obj", "id", resStr + jsStr + " return result;");
	};	
	/**
	 * Проверить на строку 
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isString = function (val) {
		return Object.prototype.toString.call(val) === "[object String]";
	};
	/**
	 * Проверить на логическое значение 
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isBoolean = function (val) {
		return Object.prototype.toString.call(val) === "[object Boolean]";
	};
	/**
	 * Проверить на null и undefined
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isExist = function (val) {
		return val !== undefined && val !== "undefined" && val !== null && val !== "";
	};
	/**
	 * Метод unshift для объекта arguments
	 * 
	 * @param {Object} obj - исходный объект
	 * @param {mixed} pushVal - новое свойство
	 * @param {String|Number} [pushName=0] - имя свойства
	 * @return {Object}
	 */
	$.unshiftArguments = function (obj, pushVal) {
		var newObj = [pushVal], i = 0, oLength = obj.length;
		
		for (; i < oLength; i++) {
			newObj.push(obj[i]);
		}
		
		return newObj;
	};
})(jQuery); //

/*
 * http://www.JSON.org/json2.js
 * 2011-10-19
 */
JSON||(JSON={});(function(){function k(a){return a<10?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,j){var c,d,h,m,g=e,f,b=j[a];b&&typeof b==="object"&&typeof b.toJSON==="function"&&(b=b.toJSON(a));typeof i==="function"&&(b=i.call(j,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null"; e+=n;f=[];if(Object.prototype.toString.apply(b)==="[object Array]"){m=b.length;for(c=0;c<m;c+=1)f[c]=l(c,b)||"null";h=f.length===0?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&typeof i==="object"){m=i.length;for(c=0;c<m;c+=1)typeof i[c]==="string"&&(d=i[c],(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h);h=f.length===0?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+ "}";e=g;return h}}if(typeof Date.prototype.toJSON!=="function")Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()};var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,j,c){var d;n=e="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else typeof c==="string"&&(n=c);if((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return l("", {"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),f!==void 0?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),typeof e==="function"?c({"":d},""):d;throw new SyntaxError("JSON.parse");}})(); //