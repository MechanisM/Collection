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
	// try to use ECMAScript 5 "strict mode"
	"use strict";	
	/////////////////////////////////
	//// constructor
	/////////////////////////////////
	
	/**
	 * @constructor
	 * @this {Colletion Object}
	 * @param {Collection|Selector} [collection=null] - collection or selector for field "target"
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.prop] - user's preferences
	 */
	$.Collection = function (collection, uProp) {
		collection = collection || null;
		uProp = uProp || null;
		
		// create "factory" function if need	
		if (this.fn && (!this.fn.name || this.fn.name !== "$.Collection")) { return new $.Collection(collection, uProp); }
		
		// mixin public fields
		$.extend(true, this, $.Collection.storage);
			
		var prop = this.dObj.prop;
				
		// extend public fields by user's preferences if need
		if (uProp) { $.extend(true, prop, uProp); }
				
		// if "collection" is string
		if ($.isString(collection)) {
			prop.target = $(collection);
			prop.collection = null;
		} else { prop.collection = collection; }
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
		"collection",
		"filter",
		"context",
		"cache",
		"index",
		"map",
		"var",
		"defer",
		
		"page",
		"parser",
		"appendType",
		"target",
		"calculator",
		"pager",
		"template",
		"templateModel",
		"numberBreak",
		"pageBreak",
		"resultNull"
		],
		
		//////
		
		/**
		 * return active context
		 * 
		 * @this {Collection Object}
		 * @return {String}
		 */
		getActiveContext: function () {
			return this.config.flags.use.ac === true ? this.dObj.prop.context.toString() : "";
		},
		/**
		 * return links to callback function
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
	/////////////////////////////////
	//// static methods (object && template mode)
	/////////////////////////////////
	
	// object for static methods
	$.Collection.stat = {};
	// static template models
	$.Collection.stat.templateModels = {};
	
	// static methods for object
	$.Collection.stat.obj = {
		// link to constants
		constants: $.Collection.fn.config.constants,
		
		/**
		* get object by link
		* 
		* @param {Object} obj - some object
		* @param {Context} context - link (sharp (#) char indicates the order)
		* @return {Object}
		*/
		getByLink: function (obj, context) {
			context = context.toString().split(this.constants.contextSeparator);
			
			var
				key, i = 0,
				pos, n = 0,
				
				objLength,
				cLength = context.length;
			
			for (; i < cLength; i++) {
				context[i] = $.trim(context[i]);
				//
				if (context[i] && context[i] !== this.constants.subcontextSeparator) {
					if (context[i].search(this.constants.subcontextSeparator) === -1) {
						obj = obj[context[i]];
					} else {
						pos = +context[i].replace(this.constants.subcontextSeparator, "");
						
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
			context = context.toString().split(this.constants.contextSeparator);
			
			var
				key, i = 0,
				pos, n = 0,
				
				objLength,
				cLength = context.length;
			
			// remove "dead" elements
			for (i = cLength; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === this.constants.subcontextSeparator) { context.splice(i, 1); }
			}
			// recalculate length
			cLength = context.length - 1;
			i = 0;
			
			for (; i <= cLength; i++) {
				if (context[i].search(this.constants.subcontextSeparator) === -1) {
					if (i === cLength) {
						obj[context[i]] = value;
					} else {
						obj = obj[context[i]];
					}
				} else {
					pos = +context[i].replace(this.constants.subcontextSeparator, "");
						
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
			prop = prop.split(this.constants.methodSeparator);
			
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
		 * @param {Boolean} [rev=false] - reverce (contstants: "shuffle" - random order)
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
	//// jQuery methods (core)
	/////////////////////////////////
		
	/**
	 * jQuery collection
	 * 
	 * @this {jQuery Object}
	 * @param {Object} prop - user's preferences
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
				//
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
						cLength--;
						array[n][stat.classes] = {};
						for (i = -1; i++ < cLength;) {
							array[n][stat.classes][classes[i]] = classes[i];
						}
					}
	
					if ($this.children().length !== 0) {
						array[n][stat.childNodes] = inObj($this.children());
					}
	
					if (txt !== false) { array[n][stat.val] = txt.replace(/[\r\t\n]/g, " "); }
				});
	
				return array;
			},
			data = inObj(this);
	
		if (prop) { return new $.Collection(data, prop); }
	
		return new $.Collection(data);
	};
	// values by default
	if (!$.fn.collection.stat) {
		$.fn.collection.stat = {
			val: "val",
			childNodes: "childNodes",
			classes: "classes"
		};
	};	
	/////////////////////////////////
	//// jQuery methods (compiler templates)
	/////////////////////////////////
	
	/**
	 * compiler templates
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
	/////////////////////////////////
	//// jQuery methods (other)
	/////////////////////////////////
		
	/**
	 * string test
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isString = function (val) {
		return Object.prototype.toString.call(val) === "[object String]";
	};
	/**
	 * boolean test
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isBoolean = function (val) {
		return Object.prototype.toString.call(val) === "[object Boolean]";
	};
	/**
	 * null && undefined && empty string test
	 * 
	 * @param {mixed} val
	 * @return {Boolean}
	 */
	$.isExist = function (val) {
		return val !== undefined && val !== "undefined" && val !== null && val !== "";
	};
	/**
	 * unshift for arguments (object)
	 * 
	 * @param {Object} obj - some object
	 * @param {mixed} pushVal - new value
	 * @param {String|Number} [pushName=0] - property name
	 * @return {Array}
	 */
	$.unshiftArguments = function (obj, pushVal) {
		var newObj = [pushVal], i = 0, oLength = obj.length;
		
		for (; i < oLength; i++) { newObj.push(obj[i]); }
		
		return newObj;
	};
	/**
	 * toUpperCase function
	 * 
	 * @param {String} str - some str
	 * @param {Number} [to=str.length] - end
	 * @param {Number} [from=0] - start
	 * @return {String}
	 */
	$.toUpperCase = function (str, to, from) {
		from = from || 0;
		
		if (!to) { return str.toUpperCase(); }
		return str.substring(from, to).toUpperCase() + str.substring(to);
	};
	/**
	 * toLowerCase function
	 * 
	 * @param {String} str - some str
	 * @param {Number} [to=str.length] - end
	 * @param {Number} [from=0] - start
	 * @return {String}
	 */
	$.toLowerCase = function (str, to, from) {
		from = from || 0;
		
		if (!to) { return str.toLowerCase(); }
		return str.substring(from, to).toLowerCase() + str.substring(to);
	};	
	/////////////////////////////////
	//// template model (simple)
	/////////////////////////////////
	
	/**
	 * simple model
	 * 
	 * @this {Colletion Object}
	 * @param param - объект настроек
	 * @param {Number} [param.page=this.dObj.prop.page] - активная страница
	 * @param {Collection} [param.collection=null] - коллекция (если не было пересчета заранее)
	 * @param {Number|Boolean} [param.numberBreak=this.dObj.prop.numberBreak] - количество записей на 1 страницу (константы: false - выводятся все записи)
	 * @param {Selector} [param.calculator=this.dObj.prop.calculator] -  селектор, по которому cчитается количесво записей на страницу
	 * @param {Selector} [param.pager=this.dObj.prop.pager] - селектор к пейджеру
	 * @param {Number} [param.countRecords=this.dObj.sys.countRecords] - всего записей в объекте (с учётом фильтра)
	 * @param {Number} [param.countRecordsInPage=this.dObj.sys.countRecordsInPage] - всего записей на странице
	 * @param {Number} [param.countTotal=this.dObj.sys.countTotal] - номер последней записи на странице
	 * @return {Boolean}
	 */
	$.Collection.stat.templateModels.simple = function (param) {
		param = param || {};
							
		var
			tmpCount = param.collection ? param.collection.Count : "",
							
			dObj = this.dObj,
			sys = dObj.sys,
			css = dObj.css,
			viewVal = dObj.viewVal,
			prop = dObj.prop,
			
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
			$("." + pageNumber, pager).html(((page - 1) * numberBreak + 1) + "-" + countTotal + ' ' + from + ' ' + countRecords);
		}
							
		return true;
	};	
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
				collection: null,
				/**
				 * active filter ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				filter: false,
				/**
				 * active context
				 * 
				 * @field
				 * @type Context
				 */
				context: "",
				/**
				 * active cache object
				 * 
				 * @field
				 * @type Plain Object
				 */
				cache: {
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
				index: null,
				/**
				 * active map
				 * 
				 * @field
				 * @type Plain Object
				 */
				map: null,
				/**
				 * active var
				 * 
				 * @field
				 * @type mixed
				 */
				variable: null,
				/**
				 * active deferred
				 * 
				 * @field
				 * @type jQuery Deferred
				 */
				defer: "",
				
				/////////////////////////////////
				//// templating
				/////////////////////////////////
				
				/**
				 * active page (used in "extPrint")
				 * 
				 * @field
				 * @type Number
				 */
				page: 1,
				/**
				 * active parser ("false" if disabled)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				parser: false,
				/**
				 * active DOM insert mode (jQuery methods)
				 * 
				 * @field
				 * @param String
				 */
				appendType: "html",
				/**
				 * active target (target to insert the result templating)
				 * 
				 * @field
				 * @type jQuery Object
				 */
				target: null,
				/**
				 * active selector (used to calculate the number of records one page)
				 * 
				 * @field
				 * @type Selector
				 */
				calculator: ".line",
				/**
				 * active pager
				 * 
				 * @field
				 * @type Selector
				 */
				pager: "#pageControl",
				/**
				 * active template
				 * 
				 * @field
				 * @type Function
				 */
				template: null,
				/**
				 * active template mode
				 * 
				 * @field
				 * @type Function
				 */
				templateModel: $.Collection.stat.templateModels.simple,
				/**
				 * active records in one page
				 * 
				 * @field
				 * @type Number
				 */
				numberBreak: 10,
				/**
				 * active page count (used in "controlMode")
				 * 
				 * @field
				 * @type Number
				 */
				pageBreak: 10,
				/**
				 * active empty result ("false" if disabled)
				 * 
				 * @field
				 * @type String|Boolean
				 */
				resultNull: false
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
			templateModel: null
		}
	};
	
	// generate system fields
	(function (data) {
		var
			i,
			upperCase,
			sys = $.Collection.storage.dObj.sys;
	
		for (i = data.length; i--;) {
			upperCase = $.toUpperCase(data[i], 1);
			
			sys["active" + upperCase + "ID"] = null;
			sys["tmp" + upperCase] = {};
			sys[data[i] + "ChangeControl"] = null;
			sys[data[i] + "Back"] = [];
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
			upperCase = $.toUpperCase(propName, 1);

		dObj.prop[propName] = newProp;
		dObj.sys["active" + upperCase + "ID"] = null;

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
			
			upperCase = $.toUpperCase(propName, 1),
			tmpActiveIDStr = "active" + upperCase + "ID",
			activeID = sys[tmpActiveIDStr];

		prop[propName] = newProp;
		if (activeID) { sys["tmp" + upperCase][activeID] = prop[propName]; }

		return this;
	};
	/**
	 * return property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.config.constants.active] - stack ID
	 * @return {mixed}
	 */
	$.Collection.fn._get = function (propName, id) {
		var dObj = this.dObj;
		
		if (id && id !== this.config.constants.active) {
			return dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		}

		return dObj.prop[propName];
	};
	
	/**
	 * extend property
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {mixed} modProp - value
	 * @param {String} [id=this.config.constants.active] - stack ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn._mod = function (propName, modProp, id) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
			
			upperCase = $.toUpperCase(propName, 1),
			tmp = sys["tmp" + upperCase],
			activeID = sys["active" + upperCase + "ID"],

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
		
		if (id && id !== this.config.constants.active) {
			tmp[id] = typeMod(tmp[id], modProp);
			if (activeID && id === activeID) { prop[propName] = tmp[id]; }
		} else {
			prop[propName] = typeMod(prop[propName], modProp);
			if (activeID) { tmp[activeID] = prop[propName]; }
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

			upperCase = $.toUpperCase(propName, 1),
			tmp = sys["tmp" + upperCase],
			activeID = sys["active" + upperCase + "ID"],

			key;
			
		if ($.isPlainObject(objID)) {
			for (key in objID) {
				if (objID.hasOwnProperty(key)) {
					if (key === this.config.constants.active) {
						throw new Error("invalid property name!");
					} else {
						if (tmp[key] && activeID && activeID === key) {
							this._update(propName, objID[key]);
						} else { tmp[key] = objID[key]; }
						
					}
				}
			}
		} else {
			if (objID === this.config.constants.active) {
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
			sys = dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			tmpChangeControlStr = propName + "ChangeControl",
			tmpActiveIDStr = "active" + upperCase + "ID";

		if (sys[tmpActiveIDStr] !== id) {
			sys[tmpChangeControlStr] = true;
			sys[tmpActiveIDStr] = id;
		} else { sys[tmpChangeControlStr] = false; }

		sys[propName + "Back"].push(id);
		dObj.prop[propName] = sys["tmp" + upperCase][id];

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
			sys = dObj.sys,

			upperCase = $.toUpperCase(propName, 1),
			tmpActiveStr = "active" + upperCase,
			propBack = sys[propName + "Back"],

			pos;

		sys[propName + "ChangeControl"] = false;
		pos = propBack.length - (nmb || 1) - 1;

		if (pos >= 0 && propBack[pos]) {
			if (sys["tmp" + upperCase][propBack[pos]]) {
				sys[tmpActiveStr + "ID"] = propBack[pos];
				dObj.prop[propName] = sys["tmp" + upperCase][propBack[pos]];

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
		if (this.dObj.sys[propName + "ChangeControl"] === true) {
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
			
			upperCase = $.toUpperCase(propName, 1),
			tmpActiveIDStr = "active" + upperCase + "ID",
			tmpTmpStr = "tmp" + upperCase,

			activeID = sys[tmpActiveIDStr],
			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],
			i;

		if (tmpArray[0] && tmpArray[0] !== this.config.constants.active) {
			for (i in tmpArray) {
				if (tmpArray.hasOwnProperty(i)) {
					if (!tmpArray[i] || tmpArray[i] === this.config.constants.active) {
						if (activeID) { delete sys[tmpTmpStr][activeID]; }
						sys[tmpActiveIDStr] = null;
						prop[propName] = deleteVal;
					} else {
						delete sys[tmpTmpStr][tmpArray[i]];
						if (activeID && tmpArray[i] === activeID) {
							sys[tmpActiveIDStr] = null;
							prop[propName] = deleteVal;
						}
					}
				}
			}
		} else {
			if (activeID) { delete sys[tmpTmpStr][activeID]; }
			sys[tmpActiveIDStr] = null;
			prop[propName] = deleteVal;
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

			upperCase = $.toUpperCase(propName, 1),
			tmpActiveIDStr = "active" + upperCase + "ID",
			tmpTmpStr = "tmp" + upperCase,

			activeID = sys[tmpActiveIDStr],
			tmpArray = !objID ? activeID ? [activeID] : [] : $.isArray(objID) || $.isPlainObject(objID) ? objID : [objID],
			i;

		if (tmpArray[0] && tmpArray[0] !== this.config.constants.active) {
			for (i in tmpArray) {
				if (tmpArray.hasOwnProperty(i)) {
					if (!tmpArray[i] || tmpArray[i] === this.config.constants.active) {
						if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
						prop[propName] = resetVal;
					} else {
						sys[tmpTmpStr][tmpArray[i]] = resetVal;
						if (activeID && tmpArray[i] === activeID) { prop[propName] = resetVal; }
					}
				}
			}
		} else {
			if (activeID) { sys[tmpTmpStr][activeID] = resetVal; }
			prop[propName] = resetVal;
		}

		return this;
	};
	/**
	 * reset property to another value
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String|Array} [objID=active] - stack ID or array of IDs
	 * @param {String} [id=this.config.constants.active] - source ID (for merge)
	 * @return {Colletion Object}
	 */
	$.Collection.fn._resetTo = function (propName, objID, id) {
		var
			dObj = this.dObj,
			mergeVal = !id || id === this.config.constants.active ? dObj.prop[propName] : dObj.sys["tmp" + $.toUpperCase(propName, 1)][id];
		
		return this._reset(propName, objID || "", mergeVal);
	};

	/**
	 * check the existence of property in the stack
	 * 
	 * @this {Colletion Object}
	 * @param {String} propName - root property
	 * @param {String} [id=this.config.constants.active] - stack ID
	 * @return {Boolean}
	 */
	$.Collection.fn._exist = function (propName, id) {
		var 
			dObj = this.dObj,
			upperCase = $.toUpperCase(propName, 1);
		
		if ((!id || id === this.config.constants.active) && dObj.sys["active" + upperCase + "ID"]) {
			return true;
		}
		if (dObj.sys["tmp" + upperCase][id] !== undefined) {
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
		if (id === this.dObj.sys["active" + $.toUpperCase(propName, 1) + "ID"]) {
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
		if (this._exist("collection", id)) { this._set("collection", id); }
		//
		if (this._exist("filter", id)) { this._set("filter", id); }
		//
		if (this._exist("context", id)) { this._set("context", id);  }
		//
		if (this._exist("cache", id)) { this._set("cache", id); }
		//
		if (this._exist("index", id)) { this._set("index", id); }
		//
		if (this._exist("map", id)) { this._set("map", id); }
		//
		if (this._exist("var", id)) { this._set("var", id); }
		//
		if (this._exist("defer", id)) { this._set("defer", id); }
		
		
		///////////
		
		
		if (this._exist("page", id)) { this._set("page", id); }
		//
		if (this._exist("parser", id)) { this._set("parser", id); }
		//
		if (this._exist("appendType", id)) { this._set("appendType", id); }
		//
		if (this._exist("target", id)) { this._set("target", id); }
		//
		if (this._exist("calculator", id)) { this._set("calculator", id); }
		//
		if (this._exist("pager", id)) { this._set("pager", id); }
		//
		if (this._exist("template", id)) { this._set("template", id); }
		//
		if (this._exist("templateModel", id)) { this._set("templateModel", id); }
		//
		if (this._exist("numberBreak", id)) { this._set("numberBreak", id); }
		//
		if (this._exist("pageBreak", id)) { this._set("pageBreak", id); }
		//
		if (this._exist("resultNull", id)) { this._set("resultNull", id); }
				
		return this;
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
	/////////////////////////////////
	//// stack methods (aliases)
	/////////////////////////////////
		
	// generate aliases
	(function (data) {
		var
			i, fn = $.Collection.fn,
			nm, upperCase;
	
		for (i = data.length; i--;) {
			nm = data[i] !== "collection" ? data[i] : "";
			upperCase = $.toUpperCase(data[i], 1);
			
			fn["$" + upperCase] = function (nm) {
				return function (newParam) { return this._$(nm, newParam); };
			}(data[i]);
			//
			if (data[i] === "context") {
				fn["mod" + upperCase] = function (nm) {
					return function (newParam, id) { return this._mod.apply(this, $.unshiftArguments(arguments, nm)); };
				}(data[i]);
			}
			//
			fn["update" + upperCase] = function (nm) {
				return function (newParam) { return this._update(nm, newParam); };
			}(data[i]);
			//
			fn["reset" + upperCase + "To"] = function (nm) {
				return function (objID, id) { return this._resetTo(nm, objID, id); };
			}(data[i]);	
			//
			fn["push" + upperCase] = function (nm) {
				return function (objID, newParam) { return this._push.apply(this, $.unshiftArguments(arguments, nm)); }
			}(data[i]);
			//
			fn["set" + upperCase] = function (nm) {
				return function (id) { return this._set(nm, id); };
			}(data[i]);
			//
			fn["pushSet" + upperCase] = function (nm) {
				return function (id, newParam) { return this._push(nm, id, newParam)._set(nm, id); };
			}(data[i]);
			//
			fn["back" + upperCase] = function (nm) {
				return function (nmb) { return this._back(nm, nmb || ""); };
			}(data[i]);	
			//
			fn["back" + upperCase + "If"] = function (nm) {
				return function (nmb) { return this._backIf(nm, nmb || ""); };
			}(data[i]);	
			//
			if (data[i] === "filter" || data[i] === "parser") {
				fn["drop" + upperCase] = function (nm) {
					return function () { return this._drop(nm, arguments); };
				}(data[i]);	
			} else {
				fn["drop" + upperCase] = function (nm) {
					return function () { return this._drop(nm, arguments, null); };
				}(data[i]);	
			}
			//
			if (data[i] === "filter" || data[i] === "parser") {
				fn["reset" + upperCase] = function (nm) {
					return function () { return this._reset(nm, arguments); };
				}(data[i]);	
			} else if (data[i] === "page") {
				fn["reset" + upperCase] = function (nm) {
					return function () { return this._reset(nm, arguments, 1); };
				}(data[i]);	
			} else if (data[i] === "context") {
				fn["reset" + upperCase] = function (nm) {
					return function () { return this._reset(nm, arguments, ""); };
				}(data[i]);	
			}
			//
			fn["is" + upperCase] = function (nm) {
				return function (id) { return this._is(nm, id); };
			}(data[i]);	
			//
			fn["exist" + upperCase] = function (nm) {
				return function (id) { return this._exist(nm, id || ""); };
			}(data[i]);
			//
			fn["get" + upperCase] = function (nm) {
				return function (id) { return this._get(nm, id || ""); };
			}(data[i]);
		}
	})($.Collection.fn.stack);	
	/////////////////////////////////
	//// single methods (core)
	/////////////////////////////////
	
	/**
	 * set new value to element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {mixed} value - new value
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.setElement = function (context, value, id) {
		context = $.isExist(context) ? context.toString() : "";
		value = value === undefined ? "" : value;
	
		var
			constants = this.config.constants,
		
			dObj = this.dObj,	
			activeContext = this.getActiveContext();
		
		if (!context && !activeContext) {
			if (id && id !== constants.active) {
				return this._push("collection", id, value);
			} else {
				return this._update("collection", value);
			}
		}
		
		$.Collection.stat.obj.setByLink(id && id !== constants.active ? dObj.sys.tmpCollection[id] : dObj.prop.collection, activeContext + constants.contextSeparator + context, value);
	
		return this;
	};
	/**
	 * get element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {mixed}
	 */
	$.Collection.fn.getElement = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			constants = this.config.constants,
			dObj = this.dObj;
		
		return $.Collection.stat.obj.getByLink(id && id !== constants.active ? dObj.sys.tmpCollection[id] : dObj.prop.collection, this.getActiveContext() + constants.contextSeparator + context);
	};	
	/////////////////////////////////
	//// single methods (add)
	/////////////////////////////////	
	
	/**
	 * add new element to object (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {mixed|Context} cValue - new element или context for sourceID (sharp (#) char indicates the order)
	 * @param {String} [propType="push"] - add type (constants: "push", "unshift") or property name (can use "::unshift" - the result will be similar to work for an array "unshift")
	 * @param {String} [activeID=this.dObj.prop.collectionID] - collection ID
	 * @param {String} [sourceID=undefined] - source ID (if move)
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.addElement = function (cValue, propType, activeID, sourceID, deleteType) {
		cValue = cValue !== undefined ? cValue : "";
		propType = propType || "push";
		deleteType = deleteType === true ? true : false;
	
		var
			constants = this.config.constants,
			statObj = $.Collection.stat.obj,
		
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
	
			cObj, sObj,
	
			collectionID = sys.collectionID,
	
			oCheck, lCheck;
		
		cObj = statObj.getByLink(activeID && activeID !== constants.active ? sys.tmpCollection[activeID] : prop.collection, this.getActiveContext());
		
		if (typeof cObj === "object") {
			oCheck = $.isPlainObject(cObj);
	
			// simple add
			if (!sourceID) {
				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + constants.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), cValue);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(cValue);
					} else if (propType === "unshift") {
						cObj.unshift(cValue);
					}
				}
			// move
			} else {
				cValue = $.isExist(cValue) ? cValue.toString() : "";
				sObj = statObj.getByLink(sourceID === constants.active ? prop.collection : sys.tmpCollection[sourceID], cValue);

				// add type
				if (oCheck === true) {
					propType = propType === "push" ? this.length(cObj) : propType === "unshift" ? this.length(cObj) + constants.methodSeparator + "unshift" : propType;
					lCheck = statObj.addElementToObject(cObj, propType.toString(), sObj);
				} else {
					lCheck = true;
					if (propType === "push") {
						cObj.push(sObj);
					} else if (propType === "unshift") {
						cObj.unshift(sObj);
					}
				}
				
				// delete element
				if (deleteType === true) {
					this.config.flags.use.ac = false;
					this.deleteElementByLink(cValue, sourceID);
					this.config.flags.use.ac = true;
				}
			}
	
			// rewrites links (if used for an object "unshift")
			if (lCheck !== true) { this.setElement("", lCheck, activeID || ""); }
		} else { throw new Error("unable to set property!"); }
	
		return this;
	};	
	/////////////////////////////////
	//// single methods (delete)
	/////////////////////////////////
		
	/**
	 * delete element by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context} context - link (sharp (#) char indicates the order)
	 * @param {String} [id=constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElementByLink = function (context, id) {
		context = $.isExist(context) ? context.toString() : "";
		
		var
			constants = this.config.constants,
		
			dObj = this.dObj,
			prop = dObj.prop,
			
			key, i = 0,
			pos, n = 0,
			
			objLength,
			cObj,
			
			activeContext = this.getActiveContext();
		
		if (!context && !activeContext) {
			this.setElement("", null);
		} else {
			// prepare context
			context = (activeContext + constants.contextSeparator + context).split(constants.contextSeparator);
			// remove "dead" elements
			for (i = context.length; i--;) {
				context[i] = $.trim(context[i]);
				if (context[i] === "" || context[i] === constants.subcontextSeparator) { context.splice(i, 1); }
			}
			context = context.join(constants.contextSeparator);

			// choice of the parent element to check the type
			cObj = $.Collection.stat.obj.getByLink(id && id !== constants.active ?
						dObj.sys.tmpCollection[id] : prop.collection,
						context.replace(new RegExp("[^" + constants.contextSeparator + "]+$"), ""));
			// choice link
			context = context.replace(new RegExp(".*?([^" + constants.contextSeparator + "]+$)"), "$1");

			if ($.isArray(cObj)) {
				context = +context.replace(constants.subcontextSeparator, "");
				if (context >= 0) {
					cObj.splice(context, 1);
				} else { cObj.splice(cObj.length + context, 1); }
			} else {
				if (context.search(constants.subcontextSeparator) === -1) {
					delete cObj[context];
				} else {
					pos = +context.replace(constants.subcontextSeparator, "");
					if (pos < 0) { 
						objLength = 0;
						// object length
						for (key in cObj) {
							if (cObj.hasOwnProperty(key)) { objLength++; }
						}
						// if reverse
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
	 * delete elements by link (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Context|Array|Plain Object} objContext - link (sharp (#) char indicates the order), array of links or object (collection ID: array of links)
	 * @param {String} [id=constants.active] - collection ID
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
	/////////////////////////////////
	//// single methods (concatenation)
	/////////////////////////////////
	
	/**
	 * concatenation of collections (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Collection} obj - collection
	 * @param {Context} context - additional context (sharp (#) char indicates the order)
	 * @param {String} [id=this.config.constants.active] - collection ID, which is the concatenation
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.concat = function (obj, context, id) {
		context = $.isExist(context) ? context.toString() : "";
	
		var
			constants = this.config.constants,
		
			dObj = this.dObj,
			cObj;
		
		cObj = $.Collection.stat.obj.getByLink(id && id !== constants.active ? dObj.sys.tmpCollection[id] : dObj.prop.collection, this.getActiveContext() + constants.contextSeparator + context);	
		
		if (typeof cObj === "object") {
			if ($.isPlainObject(cObj)) {
				$.extend(true, cObj, obj)
			} else if ($.isArray(cObj)) {
				if ($.isArray(obj)) {
					cObj = Array.prototype.concat(cObj, obj);
					this.setElement(context, cObj, id || "");
				} else { this.addElement(obj, "push", id || ""); }
			}
		} else { throw new Error("incorrect data type!"); }
	
		return this;
	};	
	/////////////////////////////////
	//// mult methods (core)
	/////////////////////////////////
	
	/**
	 * collection length (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean|Collection} [filter=false] - filter function, string expressions or "false"
	 * @param {String|Collection} [id=this.config.constants.active] - collection ID
	 * @throw {Error}
	 * @return {Number}
	 */
	$.Collection.fn.length = function (filter, id) {
		filter = $.isExist(filter) ? filter : false;
		
		var
			dObj = this.dObj,
			cObj, cOLength, aCheck,
			key, countRecords;
		
		if (!$.isFunction(filter)) {
			if (($.isString(filter) && !$.isExist(id)) || $.isArray(filter) || $.isPlainObject(filter)) {
				id = filter;
				filter = false;
			}
		}
		
		if (!id || id === this.config.constants.active) {
			cObj = dObj.prop.collection;
		} else if ($.isString(id)) {
			cObj = dObj.sys.tmpCollection[id];
		} else {
			aCheck = true;
			cObj = id;
		}
		//
		if (aCheck !== true) { cObj = $.Collection.stat.obj.getByLink(cObj, this.getActiveContext()); }
		// if cObj is null
		if (cObj === null) { return 0; }

		cOLength = cObj.length;
		// if cObj is String
		if ($.isString(cObj)) { return cOLength; }
		
		if (typeof cObj === "object") {
			if (filter === false && cOLength !== undefined) {
				countRecords = cOLength;
			} else {
				countRecords = 0;
				for (key in cObj) {
					if (cObj.hasOwnProperty(key)) {
						if (filter === false || this.customFilter(filter, cObj, key, cOLength || null, this, id ? id : this.config.constants.active) === true) {
							countRecords++;
						}
					}
				}
			}
		} else { throw new Error("incorrect data type!"); }
	
		return countRecords;
	};
	/**
	 * forEach method (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Function} callback - callback
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.each = function (callback, filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
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
		
		// "callee" link
		dObj.sys.callee.callback = callback;
		//
		cObj = $.Collection.stat.obj.getByLink(id !== this.config.constants.active ? sys.tmpCollection[id] : prop.collection, this.getActiveContext());
		cOLength = this.length(cObj);
		
		//
		if ($.isArray(cObj)) {
			tmpLength = cOLength - 1;
			for (i = indexOf !== false ? indexOf - 1 : -1; i++ < tmpLength;) {
				if (count !== false && j === count) { break; }
				if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
					if (from !== false && from !== 0) { from--; continue; }
					
					if (callback.call(this, cObj, i, cOLength, this, id) === false) { break; }
					if (mult === false) { break; }
					j++;
				}
			}
		} else {
			for (i in cObj) {
				if (cObj.hasOwnProperty(i)) {
					if (count !== false && j === count) { break; }
					if (indexOf !== false && indexOf !== 0) { indexOf--; continue; }
					
					if (filter === false || this.customFilter(filter, cObj, i, cOLength, this, id) === true) {
						if (from !== false && from !== 0) { from--; continue; }
							
						if (callback.call(this, cObj, i, cOLength, this, id) === false) { break; }
						if (mult === false) { break; }
						j++;
					}
				}
			}
		}
	
		return this;
	};	
	/////////////////////////////////
	//// mult methods (search)
	/////////////////////////////////
	
	/**
	 * search elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Number|Array}
	 */
	$.Collection.fn.searchElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
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
	 * search element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Number|Array}
	 */
	$.Collection.fn.searchElement = function (filter, id) {
		return this.searchElements(filter || "", id || "", false);
	};	
	/////////////////////////////////
	//// mult methods (return)
	/////////////////////////////////
	
	/**
	 * return elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {mixed}
	 */
	$.Collection.fn.returnElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
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
	 * return element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {mixed}
	 */
	$.Collection.fn.returnElement = function (filter, id) {
		return this.returnElements(filter || "", id || "", false);
	};
	/////////////////////////////////
	//// mult methods (replace)
	/////////////////////////////////
	
	/**
	 * replace elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 *  
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback) 
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElements = function (filter, replaceObj, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
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
	 * replace element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {mixed} replaceObj - replace object (if is Function, then executed as a callback)
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.replaceElement = function (filter, replaceObj, id) {
		return this.replaceElements(filter || "", replaceObj, id || "", false);
	};
	/////////////////////////////////
	//// mult methods (move && copy)
	/////////////////////////////////
		
	/**
	 * move elements (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of transfers (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @param {Boolean} [deleteType=false] - if "true", remove source element
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
	
			deleteList = [],
			aCheckType = $.isArray(statObj.getByLink(this._get("Collection", activeID), this.getActiveContext())),
	
			elements, eLength, i = -1;
	
		// search elements
		this.config.flags.use.ac = false;
		elements = this.searchElements(moveFilter, sourceID, mult, count, from, indexOf);
		this.config.flags.use.ac = true;
	
		// move
		if (mult === true) {
			eLength = elements.length - 1;
			for (; i++ < eLength;) {
				this.addElement(context + this.config.constants.contextSeparator + elements[i], aCheckType === true ? addType : elements[i] + statObj.methodSeparator + addType, activeID, sourceID);
				deleteType === true && deleteList.push(elements[i]);
			}
		} else {
			this.addElement(context + this.config.constants.contextSeparator + elements, aCheckType === true ? addType : elements + statObj.methodSeparator + addType, activeID, sourceID);
			deleteType === true && deleteList.push(elements);
		}
	
		// delete element
		if (deleteType === true) {
			this.config.flags.use.ac = false;
			this.deleteElementsByLink(deleteList, sourceID);
			this.config.flags.use.ac = true;
		}
	
		return this;
	},
	/**
	 * move element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @return {Colletion Object}
	 */
	$.Collection.fn.moveElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false);
	};
	/**
	 * copy elements (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of copies (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElements = function (moveFilter, context, sourceID, activeID, addType, mult, count, from, indexOf) {
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "push", mult, count, from, indexOf, false);
	};
	/**
	 * copy element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [moveFilter=false] - filter function, string expressions or "false"
	 * @param {Context} context - source context (sharp (#) char indicates the order)
	 * @param {String} [sourceID=this.config.constants.active] - source ID
	 * @param {String} [activeID=this.config.constants.active] - collection ID (transferred to)
	 * @param {String} [addType="push"] - add type (constants: "push", "unshift")
	 * @return {Colletion Object}
	 */
	$.Collection.fn.copyElement = function (moveFilter, context, sourceID, activeID, addType) {
		return this.moveElements(moveFilter || "", $.isExist(context) ? context.toString() : "", sourceID || "", activeID || "", addType || "", false, "", "", "", false);
	};	
	/////////////////////////////////
	//// mult methods (delete)
	/////////////////////////////////
	
	/**
	 * delete elements (in context)
	 *
	 * // overloads:
	 * 1) if the id is a Boolean, it is considered as mult.
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of deletions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElements = function (filter, id, mult, count, from, indexOf) {
		filter = filter || false;
		id = $.isExist(id) ? id : this.config.constants.active;
	
		// if id is Boolean
		if ($.isBoolean(id)) {
			indexOf = from;
			from = count;
			count = mult;
			mult = id;
			id = this.config.constants.active;
		}
	
		// values by default
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
	 * delete element (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.deleteElement = function (filter, id) {
		return this.deleteElements(filter || "", id || "", false);
	};	
	/////////////////////////////////
	// additional methods
	/////////////////////////////////
	
	/**
	 * calculate multi filter
	 * 
	 * @this {Colletion Object}
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Collection} $this - link to collection
	 * @param {Number|String} i - iteration (key)
	 * @param {Number} cALength - collection length
	 * @param {Collection Object} $obj - link to collection object
	 * @param {String} id - collection ID
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
		
		// if filter is function
		if ($.isFunction(filter)) {
			sys.callee.filter = filter;
			
			return filter($this, i, cALength, $obj, id);
		}
		
		// if filter is not defined or filter is a string constant
		if (!filter || ($.isString(filter) && $.trim(filter) === this.config.constants.active)) {
			if (prop.filter) {
				sys.callee.filter = prop.filter;
				
				return prop.filter($this, i, cALength, $obj, id);
			}
	
			return true;
		} else {
			// if filter is string
			if (!$.isArray(filter)) {
				// if simple filter
				if (filter.search(/\|\||&&|!|\(|\)/) === -1) {
					sys.callee.filter = sys.tmpFilter[filter];
					
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
			// calculate deep filter
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
			// calculate filter
			fLength = filter.length - 1;
			
			for (; j++ < fLength;) {
				// calculate atoms
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
				// calculate outer filter
				} else if (filter[j] !== ")" && filter[j] !== "||" && filter[j] !== "&&") {
					console.log(filter[j]);
					if (filter[j].substring(0, 1) === "!") {
						inverse = true;
						filter[j] = filter[j].substring(1);
					} else { inverse = false; }
					
					tmpFilter = filter[j] === this.config.constants.active ? prop.filter : sys.tmpFilter[filter[j]];
					sys.callee.filter = tmpFilter;
					//
					tmpResult = tmpFilter($this, i, cALength, $obj, id);
					if (!and && !or) {
						result = inverse === true ? !tmpResult : tmpResult;
					} else if (and) {
						result = inverse === true ? !tmpResult : tmpResult && result;
					} else {
						result = inverse === true ? !tmpResult : tmpResult || result;
					}
				// "and" or "or"
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
	 * calculate multi parser
	 * 
	 * @this {Colletion Object}
	 * @param {Parser|String} parser - parser function or string expressions
	 * @param {String} str - source string
	 * @return {String}
	 */
	$.Collection.fn.customParser = function (parser, str) {
		var
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
			
			tmpParser,
			i;
		
		// if parser is function
		if ($.isFunction(parser)) {
			sys.callee.parser = parser;
			
			return parser(str, this);
		}
		
		// if parser is not defined or parser is a string constant
		if (!parser || ($.isString(parser) && $.trim(parser) === this.config.constants.active)) {
			if (prop.parser) {
				sys.callee.parser = prop.parser;
				
				return prop.parser(str, this);
			}
	
			return str;
		} else {
			if ($.isString(parser)) {
				parser = $.trim(parser);
				// if simple parser
				if (parser.search("&&") === -1) {
					sys.callee.parser = sys.tmpParser[parser];
					
					return sys.tmpParser[parser](str, this);
				}
				parser = parser.split("&&");
			}
			
			for (i = parser.length; i--;) {
				parser[i] = $.trim(parser[i]);
				tmpParser = parser[i] === this.config.constants.active ? prop.parser : sys.tmpParser[parser[i]];
				
				sys.callee.parser = tmpParser;
				str = tmpParser(str, this);
			}
	
			return str;
		}
	};
	
	
	/**
	 * calculate parent context
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level up
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {String}
	 */
	$.Collection.fn.parentContext = function (n, id) {
		n = n || 1;
	
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			contextID = sys.contextID,
			context = "",
	
			i;
	
		context = (id && id !== this.config.constants.active ? sys.tmpContext[id] : prop.context).split($.Collection.stat.obj.contextSeparator);
	
		for (i = n; i--;) { context.splice(-1, 1); }
	
		return context.join($.Collection.stat.obj.contextSeparator);
	};
	/**
	 * parent
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] - level up
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Colletion Object}
	 */
	$.Collection.fn.parent = function (n, id) {
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			contextID = sys.contextID,
			context = this.parentContext.apply(this, arguments);
	
		if (!id || id === this.config.constants.active) {
			if (contextID) {
				sys.tmpContext[contextID] = context;
			}
			prop.context = context;
		} else {
			sys.tmpContext[id] = context;
			if (contextID && id === contextID) {
				prop.context = context;
			}
		}
	
		return this;
	};	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * sort collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [field] - field name
	 * @param {Boolean} [rev=false] - reverce (contstants: "shuffle" - random order)
	 * @param {Function|Boolean} [fn=toUpperCase] - callback ("false" if disabled)
	 * @param {String} [id=this.config.constants.active] - collection ID
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
			sys = dObj.sys,
	
			collectionID = sys.collectionID,
			cObj,
	
			// sort object by key
			sortObjectByKey = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					key;
	
				for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
	
				sortedKeys.sort(statObj.sort.sortBy(field, rev, fn));
	
				for (key in sortedKeys) {
					if (sortedKeys.hasOwnProperty(key)) {
						sortedObj[sortedKeys[key]] = obj[sortedKeys[key]];
					}
				}
	
				return sortedObj;
			},
			// sort object by value
			sortObject = function (obj) {
				var
					sortedValues = [],
					sortedObj = {},
					key;
	
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						sortedValues.push({
							key: key,
							value: obj[key]
						});
					}
				}
	
				sortedValues.sort(statObj.sort.sortBy(field === true ? "value" : "value" + statObj.obj.contextSeparator + field, rev, fn));
	
				for (key in sortedValues) {
					if (sortedValues.hasOwnProperty(key)) {
						sortedObj[sortedValues[key].key] = sortedValues[key].value;
					}
				}
	
				return sortedObj;
			};
	
		cObj = statObj.obj.getByLink(id ? sys.tmpCollection[id] : dObj.prop.collection, this.getActiveContext());
	
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
		} else { throw new Error("incorrect data type!"); }
	
		return this;
	};	
	/////////////////////////////////
	// native
	/////////////////////////////////
		
	/**
	 * return JSON string collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String|Object} [id=this.config.constants.active] - collection ID
	 * @param {Function|Array} [replacer=undefined] - an optional parameter that determines how object values are stringified for objects
	 * @param {Number|String} [space=undefined] - indentation of nested structures
	 * @return {String}
	 */
	$.Collection.fn.toString = function (id, replacer, space) {
		var dObj = this.dObj, cObj;
	
		cObj = id && id !== this.config.constants.active ? dObj.sys.tmpCollection[id] : dObj.prop.collection;
		cObj = $.Collection.stat.obj.getByLink(cObj, this.getActiveContext());
		
		if (JSON && JSON.stringify) {
			return JSON.stringify(cObj, replacer || "", space || "");
		}
		throw new Error("object JSON is not defined!");
	};
	/**
	 * return collection length
	 * 
	 * @this {Colletion Object}
	 * @param {String} [id=this.config.constants.active] - collection ID
	 * @return {Number}
	 */
	$.Collection.fn.valueOf = function (id) {
		return this.length($.isExist(id) ? id : this.config.constants.active);
	};	
	/////////////////////////////////
	// other
	/////////////////////////////////
	
	/**
	 * jQuery "then" method
	 * 
	 * @this {Colletion Object}
	 * @param {Function} done - callback (if success)
	 * @param {Function} [fail=done] - callback (if failed)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.then = function (done, fail) {
		var $this = this;
		
		if (arguments.length === 1) {
			$.when($this.prop("defer")).always(function () { done.apply($this, arguments); });
		} else {
			$.when($this.prop("defer")).then(
				function () { done().apply($this, arguments); },
				function () { fail().apply($this, arguments); }
			);
		}
			
		return this;
	};	
	/////////////////////////////////
	//// design methods (print)
	/////////////////////////////////
	
	/**
	 * simple templating (in context)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Template} [param.template=this.dObj.prop.template] - template
	 * @param {jQuery Object|Boolean} [param.target=this.dObj.prop.target] - element to output the result ("false" - if you print a variable)
	 * @param {String} [param.variable=this.dObj.sys.variableID] - variable ID (if param.target === false)
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.prop.parser] - parser function, string expressions or "false"
	 * @param {String} [param.appendType=this.dObj.prop.appendType] - type additions to the DOM
	 * @param {String} [param.resultNull=this.dObj.prop.resultNull] - text displayed if no results
	 * @param {Boolean} [mult=true] - enable mult mode
	 * @param {Number|Boolean} [count=false] - maximum number of results (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.print = function (param, mult, count, from, indexOf) {
		param = param || {};
		
		mult = mult === false ? false : true;
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		var
			dObj = this.dObj,
			prop = dObj.prop,
	
			parser = param.parser || prop.parser,
			template = param.template || prop.template,
	
			target = param.target || param.target === false ? param.target : prop.target,
			resultNull = param.resultNull !== undefined ? param.resultNull : prop.resultNull,
	
			result = "",
			action = function (data, i, aLength, $this, objID) {
				result += template(data, i, aLength, $this, objID);
				
				if (mult !== true) { return false; }
	
				return true;
			};
		
		// "callee" link
		dObj.sys.callee.template = template;		
		this.each(action, (param.filter || prop.filter), this.config.constants.active, mult, count, from, indexOf);
		
		result = !result ? resultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResultInSearch + '</div>' : resultNull : result;
		result = parser !== false ? this.customParser((parser), result) : result;
		
		if (target === false) {
			if (!param.variable) {
				this.$Var(result);
			} else {
				this.PushSetVar(param.variable, result);
			}
		} else { target[(param.appendType || prop.appendType)](result); }
	
		return this;
	};	
	/////////////////////////////////
	//// design methods (extended print)
	/////////////////////////////////
		
	/**
	 * extended templating (in context) (with pager)
	 * 
	 * @this {Colletion Object}
	 * @param param - object settings
	 * @param {Number} [param.page=this.dObj.prop.param.page] - page number
	 * @param {Template} [param.template=this.dObj.prop.template] - template
	 * @param {Number|Boolean} [param.numberBreak=this.dObj.prop.param.numberBreak] - number of entries on 1 page (if "false", returns all records)
	 * @param {Number} [param.pageBreak=this.dObj.prop.param.pageBreak] - number of displayed pages (navigation)
	 * @param {jQuery Object} [param.target=this.dObj.prop.target] - element to output the result
	 * @param {Filter|String|Boolean} [filter=false] - filter function, string expressions or "false"
	 * @param {Parser|String|Boolean} [param.parser=this.dObj.prop.parser] - parser function, string expressions or "false"
	 * @param {Boolean} [param.cacheIteration=this.dObj.cache.iteration] - if "true", the last iteration is taken from cache
	 * @param {Selector} [param.calculator=this.dObj.prop.calculator] - selector, on which is the number of records per page
	 * @param {Selector} [param.pager=this.dObj.prop.param.pager] - selector to pager
	 * @param {String} [param.appendType=this.dObj.prop.appendType] - type additions to the DOM
	 * @param {String} [param.resultNull=this.dObj.prop.resultNull] - text displayed if no results
	 * @return {Colletion Object}
	 */
	$.Collection.fn.extPrint = function (param) {
		param = param || {};
		
		var
			dObj = this.dObj,
			sys = dObj.sys,
			prop = dObj.prop,
	
			cObj, cOLength,
			start, inc = 0,
			
			checkPage,
			cache,
			result = "", action;
			
		param.filter = param.filter || prop.filter;
		param.parser = param.parser || prop.parser;
		
		param.page = param.page || prop.page;
		checkPage = param.page === (param.page + 1);
			
		param.template = param.template || prop.template;
		param.target = param.target || prop.target;
		
		param.numberBreak = +param.numberBreak || +prop.param.numberBreak;
		param.pageBreak = +param.pageBreak || +prop.param.pagerBreak;
		
		cache = prop.cache;
		param.cacheIteration = $.isBoolean(param.cacheIteration) ? param.cacheIteration : cache.iteration;
			
		param.resultNull = param.resultNull !== undefined ? param.resultNull : prop.resultNull;
	
		result = "";
		action = function (data, i, aLength, $this, objID) {
			result += template(data, i, aLength, $this, objID);
			inc = i;
				
			return true;
		};
			
		// get collection
		cObj = $.Collection.stat.obj.getByLink(prop.collection, (param.context || this.getActiveContext()));
		cOLength = this.length();
		
		// number of records per page
		param.numberBreak = param.numberBreak === false ? cOLength : param.numberBreak;
		// "callee" link
		sys.callee.template = param.template;
		
		if ($.isPlainObject(cObj) || param.cacheIteration === false) {
			start = param.page === 1 ? param.numberBreak : (param.page - 1) * param.numberBreak;
			//
			this.each(action, param.filter, this.config.constants.active, true, param.numberBreak, start);
		} else if ($.isArray(cObj) && cacheIteration === true) {
			// calculate the starting position
			start = param.filter === false ?
						param.page === 1 ? -1 : (param.page - 1) * param.numberBreak - 1 : cacheIteration === true ?
							checkPage === true ? cache.firstIteration : cache.lastIteration : i;
			
			// rewind cached step back
			if (checkPage === true && param.filter !== false) {
				for (; start--;) {
					if (this.customFilter(param.filter, cObj, start, cOLength, $this, this.config.constants.active) === true) {
						if (inc === param.numberBreak) {
							break;
						} else { inc++; }
					}
				}
				start = start === -1 ? start : start + 1;
				cache.lastIteration = start;
			}
			
			this.each(action, param.filter, this.config.constants.active, true, param.numberBreak, null, start);
			//
			cache.firstIteration = cache.lastIteration;
			cache.lastIteration = inc - 1;
			if (cache.autoIteration === true) {
				cache.iteration = true;
			}
		}
		
		result = !result ? resultNull === false ? '<div class="' + dObj.css.noResult + '">' + dObj.viewVal.noResultInSearch + '</div>' : resultNull : result;
		result = parser !== false ? this.customParser(parser, result) : result;
		// append to DOM
		target[(param.appendType || prop.appendType)](result);
	
		$.extend(param, {
			countRecords: this.length(param.filter),
			countRecordsInPage: $((param.calculator || prop.calculator), target).length,
			countTotal: param.numberBreak * param.page - (param.numberBreak - sys.countRecordsInPage)
		});
		
		/*
		// generate navigation bar
		if (param.page !== 1 && sys.countRecordsInPage === 0) {
			prop.param.page--;
			this.extPrint.apply(this, arguments);
		} else { this.easyPage(param, prop); }*/
	
		return this;
	};
	/**
	 * activation of the model template
	 * 
	 * @this {Colletion Object}
	 * @param {Object} [param=undefined] - object settings (depends on the model template)
	 * @param {Object} [prop=undefined] - collection properties
	 * @return {Colletion Object}
	 */
	$.Collection.fn.easyPage = function (param, prop) {
		// "callee" link
		this.dObj.sys.callee.templateModel = this.dObj.prop.templateModel;
		this.dObj.prop.templateModel.apply(this, arguments);
		
		return this;
	};	
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
	
			target = this.dObj.prop.target,
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
	$.Collection.fn.genIndex = function (indexName, id, fieldObj, filter, count, from, indexOf) {
		id = id || this.config.constants.active;
		
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
			collectionID = this.dObj.sys.collectionID,
		
			cObj1, cObj2,
			resObj = {};
	
		if ((!id1 || id1 === this.config.constants.active || !id2 || id2 === this.config.constants.active) && collectionID) {
			id1 = id1 || collectionID;
			id2 = id2 || collectionID;
		} else if (!collectionID) { throw new Error("Invalid ID collection"); }
		
		cObj1 = 
		
		console.log(resObj);
	}
})(jQuery); //
/*
 * http://www.JSON.org/json2.js
 * 2011-10-19
 */
JSON||(JSON={});(function(){function k(a){return a<10?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,j){var c,d,h,m,g=e,f,b=j[a];b&&typeof b==="object"&&typeof b.toJSON==="function"&&(b=b.toJSON(a));typeof i==="function"&&(b=i.call(j,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null"; e+=n;f=[];if(Object.prototype.toString.apply(b)==="[object Array]"){m=b.length;for(c=0;c<m;c+=1)f[c]=l(c,b)||"null";h=f.length===0?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&typeof i==="object"){m=i.length;for(c=0;c<m;c+=1)typeof i[c]==="string"&&(d=i[c],(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h);h=f.length===0?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+ "}";e=g;return h}}if(typeof Date.prototype.toJSON!=="function")Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()};var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,j,c){var d;n=e="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else typeof c==="string"&&(n=c);if((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return l("", {"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),f!==void 0?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),typeof e==="function"?c({"":d},""):d;throw new SyntaxError("JSON.parse");}})(); //