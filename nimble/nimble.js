
var nimble = (function () {
	// try to use ECMAScript 5 "strict mode"
	"use strict";
	
	return {
		/**
		 * <i lang="en">framework name</i>
		 * <i lang="ru">название фреймворка</i>
		 * 
		 * @constant
		 * @type String
		 */
		name: "nimble",
		/**
		 * <i lang="en">framework version</i>
		 * <i lang="ru">версия фреймворка</i>
		 * 
		 * @constant
		 * @type String
		 */
		version: "1.0.2",
		/**
		 * <i lang="en">return string: framework name + framework version</i>
		 * <i lang="ru">вернуть строку: название фреймворка + версия</i>
		 *
		 * @this {nimble}
		 * @return {String}
		 */
		nimble: function () { return this.name + " " + this.version; },
		
		// constants
		CONTEXT_SEPARATOR: " ",
		QUERY_SEPARATOR: "/",
		SUBQUERY_SEPARATOR: "{",
		METHOD_SEPARATOR: "->",
		
		CHILDREN: ">",
		ORDER: ["eq(", ")"],
		//
		
		/**
		 * <i lang="en">removes all leading and trailing whitespace characters</i>
		 * <i lang="ru">удалить крайние пробелы у строки</i>
		 *
		 * @param {String} str — <i lang="en">some string</i><i lang="ru">исходная строка</i>
		 * @return {String}
		 */
		trim: function (str) {
			var
				str = str.replace(/^\s\s*/, ''),
				ws = /\s/,
				i = str.length;
			//
			while (ws.test(str.charAt((i -= 1)))){};
			return str.substring(0, i + 1);
		},
		/**
		 * <i lang="en">returns a Boolean indicating whether the object is a string</i>
		 * <i lang="ru">проверить, является ли объект строкой</i>
		 *
		 * @param {mixed} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
		 * @return {Boolean}
		 */
		isString: function (obj) { return Object.prototype.toString.call(obj) === "[object String]"; },
		/**
		 * <i lang="en">returns a Boolean indicating whether the object is a number</i>
		 * <i lang="ru">проверить, является ли объект числом</i>
		 *
		 * @param {mixed} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
		 * @return {Boolean}
		 */
		isNumber: function (obj) { return Object.prototype.toString.call(obj) === "[object Number]"; },
		/**
		 * <i lang="en">returns a Boolean indicating whether the object is a array (not an array-like object)</i>
		 * <i lang="ru">проверить, является ли объект хеш–таблицей</i>
		 *
		 * @param {mixed} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
		 * @return {Boolean}
		 */
		isArray: function (obj) { return Object.prototype.toString.call(obj) === "[object Array]"; },
		/**
		 * <i lang="en">returns a Boolean value indicating that the object is not equal to: undefined, null, or "" (empty string)</i>
		 * <i lang="ru">проверить, существует ли объект (проверка типов undefined, null, "")</i>
		 *
		 * @param {mixed} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
		 * @return {Boolean}
		 */
		isExists: function (obj) { return obj !== undefined && obj !== "undefined" && obj !== null && obj !== ""; },
		
		/**
		 * <i lang="en">calculate math expression for string</i>
		 * <i lang="ru">рассчитать выражение для строки</i>
		 * 
		 * @param {mixed} val — <i lang="en">new value</i><i lang="ru">новое значение</i>
		 * @param {mixed} old — <i lang="en">old value</i><i lang="ru">старое значение</i>
		 * @return {mixed}
		 */
		expr: function (val, old) {
			old = old !== undefined || old !== null ? old : "";
			if (this.isString(val) && val.search(/^[+-\\*\/]{1}=/) !== -1) {
				//
				val = val.split("=");
				if (!isNaN(val[1])) { val[1] = +val[1]; }
				// simple math
				switch (val[0]) {
					case "+": { val = old + val[1]; } break;
					case "-": { val = old - val[1]; } break;
					case "*": { val = old * val[1]; } break;
					case "/": { val = old / val[1]; } break;
				}
			}
		
			return val;
		},
		
		/**
		 * <i lang="en">set new value to object by link, remove element by link or get element by link</i>
		 * <i lang="ru">установить/получить значение объекта по ссылке или удалить элемент по ссылке</i>
		 * 
		 * @this {nimble}
		 * @param {Object|Number|Boolean} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
		 * @param {Context} context — <i lang="en">link</i><i lang="ru">контекст</i>
		 * @param {mixed} [value] — <i lang="en">some value</i><i lang="ru">новое значение</i>
		 * @param {Boolean} [del=false] — <i lang="en">if "true", remove source element</i><i lang="ru">если "true", то удалить элемент</i>
		 * @return {nimble|mixed}
		 */
		byLink: function (obj, context, value, del) {
			context = context
						.toString()
						.replace(new RegExp("\\s*" + this.CHILDREN + "\\s*", "g"), " " + this.CHILDREN + " ")
						.split(this.CONTEXT_SEPARATOR);
			del = del || false;
			
			//
			var
				type = this.CHILDREN,
				last = 0, total = 0,
				
				key, i = context.length,
				pos, n,
		
				objLength, cLength;
		
			// remove "dead" elements
			while ((i -= 1) > -1) {
				context[i] = this.trim(context[i]);
				if (context[i] === "") {
					context.splice(i, 1);
					last -= 1;
				} else if (context[i] !== this.CHILDREN) {
					if (i > last) { last = i; }
					total += 1;
				}
			}
			// recalculate length
			cLength = context.length;
			
			// overload
			if (obj === false) {
				return context.join("");
			} else if (this.isNumber(obj)) {
				if ((obj = +obj) < 0) { obj += total; }
				if (value === undefined) { 
					for (i = -1, n = 0; (i += 1) < cLength;) {
						if (context[i] !== this.CHILDREN) {
							if ((n += 1) === obj) {
								context.splice(i + 1, cLength);
								return context.join("");
							}
						}
					}
				} else {
					for (i = cLength, n = 0; (i -= 1) > -1;) {
						if (context[i] !== this.CHILDREN) {
							if ((n += 1) === obj) {
								context.splice(0, i);
								return context.join("");
							}
						}
					}
				}
			}
			//
			for (i = -1; (i += 1) < cLength;) {
				switch (context[i]) {
					case this.CHILDREN : { type = context[i]; } break;
					default : {
						if (type === this.CHILDREN && context[i].substring(0, this.ORDER[0].length) !== this.ORDER[0]) {
							if (i === last && value !== undefined) {
								if (del === false) {
									obj[context[i]] = this.expr(value, obj[context[i]]);
								} else {
									if (nimble.isArray(obj)) {
										obj.splice(context[i], 1);
									} else { delete obj[context[i]]; }
								}
							} else { obj = obj[context[i]]; }
						} else {
							pos = context[i].substring(this.ORDER[0].length);
							pos = pos.substring(0, (pos.length - 1));
							pos = +pos;
							//
							if (this.isArray(obj)) {
								if (i === last && value !== undefined) {
									if (pos >= 0) {
										if (del === false) {
											obj[pos] = this.expr(value, obj[pos]);
										} else { obj.splice(pos, 1); }
									} else {
										if (del === false) {
											obj[obj.length + pos] = this.expr(value, obj[obj.length + pos]);
										} else { obj.splice(obj.length + pos, 1); }
									}
								} else {
									if (pos >= 0) {
										obj = obj[pos];
									} else { obj = obj[obj.length + pos]; }
								}
							} else {
								if (pos < 0) {
									objLength = 0;
									for (key in obj) {
										if (obj.hasOwnProperty(key)) { objLength += 1; }
									}
									//
									pos += objLength;
								}
				
								n = 0;
								for (key in obj) {
									if (obj.hasOwnProperty(key)) {
										if (pos === n) {
											if (i === last && value !== undefined) {
												if (del === false) {
													obj[key] = this.expr(value, obj[key]);
												} else { delete obj[key]; }
											} else { obj = obj[key]; }
											break;
										}
										n += 1;
									}
								}
							}
						}
					}
				}
			}
			
			if (value !== undefined) { return this; }
			return obj;
		},
		
		/**
		 * <i lang="en">execute event</i>
		 * <i lang="ru">инициализировать событие</i>
		 * 
		 * @this {nimble}
		 * @param {String} query — <i lang="en">query string</i><i lang="ru">строка запроса</i>
		 * @param {Object} event — <i lang="en">event object</i><i lang="ru">объект запроса</i>
		 * @param {mixed} [param] — <i lang="en">input parameters</i><i lang="ru">входные параметр</i>
		 * @param {mixed} [_this=event] — <i lang="en">this object</i><i lang="ru">this для функции обратного вызова</i>
		 * @return {mixed}
		 */
		execEvent: function (query, event, param, _this) {
			query = query.split(this.QUERY_SEPARATOR);
			param = this.isExists(param) ? param : [];
			param = this.isArray(param) ? param : [param];
			//
			var 
				i = -1,
				qLength = query.length - 1,
				spliter;
		
			while ((i += 1) < qLength) { event = event[query[i]]; }
			//
			if (query[i].search(this.SUBQUERY_SEPARATOR) !== -1) {
				spliter = query[i].split(this.SUBQUERY_SEPARATOR);
				event = event[spliter[0]];
				spliter.splice(0, 1);
				param = param.concat(spliter);
				return event.apply(_this || event, param);
			} else { return event[query[i]].apply(_this || event, param); }
		},
		
		/**
		 * <i lang="en">add new element to object</i>
		 * <i lang="ru">добавить новое значение объекту</i>
		 *
		 * @this {nimble}
		 * @param {Plain Object} obj — <i lang="en">some object</i><i lang="ru">исходный объект</i>
		 * @param {String} active — <i lang="en">property name (can use "->unshift" — the result will be similar to work for an array "unshift")</i><i lang="ru">имя нового свойства (можно использовать константу "->unshift" — результат будет идентичен работе метода массива "unshift")</i>
		 * @param {mixed} value — <i lang="en">some value</i><i lang="ru">значение свойства</i>
		 * @return {Plain Object|Boolean}
		 */
		addElementToObject: function (obj, active, value) {
			active = active.split(this.METHOD_SEPARATOR);
			var key, newObj = {};
		
			if (active[1] && active[1] == "unshift") {
				newObj[!isNaN(Number(active[0])) ? 0 : active[0]] = value;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) { newObj[!isNaN(Number(key)) ? +key + 1 : key] = obj[key]; }
				}
				obj = newObj;
		
				return obj;
			} else if (!active[1] || active[1] == "push") { obj[active[0]] = value; }
		
			return true;
		}
	};
})();