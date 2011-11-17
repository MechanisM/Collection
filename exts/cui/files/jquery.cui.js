/**
 * CUI core - расширения для JavaScript фреймворка jQuery для создания виджетов на $.Collection
 *
 * Автор: Кобец Андрей Александрович (kobezzza)
 * Дата: 13.10.2011 12:23:45
 *
 * CUI core состоит из:
 * 1) Трёх расширений объекта jQuery.prototype:
 * 1.1) setCUI - установка виджета;
 * 1.2) isCUI - проверка виджетана существование;
 * 1.3) newData - создание экземпляра $.Collection на основе выходных данных;
 * 1.4) getCUI - получение виджета;
 * 1.5) removeCUI - удаление виджета.
 * 2) Одно расширение объекта jQuery.expr[':']: 
 * 2.1) CUI - расширение для Sizzle.
 *
 * Дополнение:
 * Код документирован в соответсвии со стандартом jsDoc
 * Специфичные типы данных:
 * 1) jQuery Object является сокращённой формой [Object] и означает экземпляр jQuery
 * --
 * Запись, типа: [prop=undefined] означает, что данный параметр не обязательный и если не указан явно, то не определён (не имеет значения по умолчанию)
 * 
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @version 1.2
 */
(function ($) {
	// Включение ECMAScript 5 "strict mode"
	"use strict";
	
	/**
	 * Задать виджет для элемента DOM
	 *
	 * @this {jQuery Object}
	 * @param {String} name - имя виджета
	 * @param {Object} obj - управляющий объект
	 * @return {jQuery Object}
	 */
	$.fn.setCUI = function (name, obj) {
		this.each(function () {
			var $this = $(this);
			if ($this.data("CUI")) {
				if (!$this.data("CUI")[name]) { $this.data("CUI")[name] = {obj: obj, events: {}}; }
			} else { $this.data("CUI", {}).data("CUI")[name] = {obj: obj, events: {}}; }
		});
		
		return this;
	};
	/**
	 * Проверить виджет на существование (если виджет уже существует, то будет возвращён его управляющий объект)
	 *
	 * @this {jQuery Object}
	 * @param {String} name - имя виджета
	 * @return {Object|Boolean}
	 */
	$.fn.isCUI = function (name) {
		if (this.data("CUI") && this.data("CUI")[name]) {
			var obj = this.data("CUI")[name].obj;
			
			return obj;
		}
		
		return false;
	};
	/**
	 * Создание экземпляров $.Collection на основе входных данных
	 *
	 * @this {jQuery Object}
	 * @param {mixed} data - исходные данные
	 * @param {Plain Object} def - пользовательские настройки
	 * @return {Object}
	 */
	$.fn.newData = function (data, def) {
		var obj;
	
		if (data && data.name && data.name === "$.Collection") {
			obj = data;
		} else {
			obj = data && data !== false ? new $.Collection(data, def) : data && data === false ? new $.Collection("", def) : this.collection(def);
		}
		
		return obj;
	};
	/**
	 * Получить список виджетов для элемента
	 *
	 * @this {jQuery Object}
	 * @param {String} [name=undefined] - имя виджета (если не указан, то удаляются все)
	 * @return {Array}
	 */
	$.fn.getCUI = function (name) {
		var obj = [];
		this.each(function () {
			var $this = $(this);
			if (name) {
				if ($this.data("CUI") && $this.data("CUI")[name]) {
					obj.push({elem: $this, result: $this.data("CUI")[name]});
				} else {
					obj.push({elem: $this, result: false});
				}
			} else {
				if ($this.data("CUI")) {
					obj.push({elem: $this, result: $this.data("CUI")});
				} else {
					obj.push({elem: $this, result: false});
				}
			}
		});
		
		return obj;
	};
	/**
	 * Удалить виджет с элемента
	 *
	 * @this {jQuery Object}
	 * @param {String} [name=undefined] - имя виджета (если не указан, то удаляются все)
	 * @return {jQuery Object}
	 */
	$.fn.removeCUI = function (name) {
		this.each(function () {
			var $this = $(this);
			if (name) {
				if ($this.data("CUI") && $this.data("CUI")[name]) { delete $this.data("CUI")[name]; }
			} else if ($this.data("CUI")) {
				$this.removeData("CUI");
			}
		});
		
		return this;
	};
	// Фильтр для Sizzle
	$.extend($.expr[':'], {
		CUI: function (elem, n, name) {
			var i, elem;
			name = name[name.length - 1];
			
			if (name) {
				name = name.split(",");
				for (i = name.length; i--;) {
					if (!$(elem).data("CUI") || !$(elem).data("CUI")[name[i]]) { return false; }
				}
					
				return true;
			} else if ($(elem).data("CUI")) {
				return true;
			} else { return false; }
		}
	});
})(jQuery);