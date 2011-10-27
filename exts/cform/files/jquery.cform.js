/**
 * $.cForm - плагин для JavaScript фреймворка $.Collection для построения форм
 *
 * Автор: Кобец Андрей Александрович (kobezzza)
 * Дата: 04.09.2011 10:15:16
 *
 * $.cForm состоит из:
 * 1) Одного расширений объекта jQuery:
 * 1.1) cForm - основной плагин;
 * 2) Двух расширений объекта jQuery.prototype:
 * 2.1) cForm - обёртка для jQuery.cForm;
 * 2.2) cFormSerialize - плагин серилизации в валидный $.Collection вид формы.
 *
 * Дополнение:
 * Код документирован в соответсвии со стандартом jsDoc
 * Специфичные типы данных:
 * 1) Form View является сокращённой формой [Array|Object] и означает представление формы;
 * 2) Plain Object является сокращённой формой [Object] и означает хеш-таблицу;
 * 3) jQuery Object является сокращённой формой [Object] и означает экземпляр jQuery.
 * --
 * Запись, типа: [prop=undefined] означает, что данный параметр не обязательный и если не указан явно, то не определён (не имеет значения по умолчанию)
 * 
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @version 1.0
 */
(function ($) {
	// Включение ECMAScript 5 "strict mode"
	"use strict";
	
	/**
	 * Генератор формы (для объекта jQuery)
	 *
	 * @this {jQuery Object}
	 * @param {Form View} data - представление формы
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.prop] - пользовательские настройки
	 * @param {Plain Object} [updData=undefined] - расширяющий объект
	 * @return {jQuery Object|String}
	 */
	$.fn.cForm = function (data, uProp, updData) {
		this.html($.cForm(data, uProp || "", updData || ""));
		
		return this;
	};
	/**
	 * Генератор формы
	 *
	 * @this {jQuery}
	 * @param {Form View} data - представление формы
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.prop] - пользовательские настройки
	 * @param {Plain Object} [updData=undefined] - расширяющий объект
	 * @return {String}
	 */
	$.cForm = function (data, uProp, updData) {
		uProp = uProp ? this.isString(uProp) ? {formID: uProp} : uProp : {};
		
		if (updData) { this.fn.cForm.updData = updData; }
		
		var obj, formID = uProp.formID || "";
		delete uProp.formID;
		
		obj = new this.Collection(data, uProp);
		obj.print({target: false, template: this.fn.cForm.template});
		
		this.fn.cForm.updData = {};
		
		return '<form ' + (formID ? 'id="' + formID + '"' : '') + '>' + obj.getVar() + '</form>';
	};
	/**
	 * Установка атрибутов
	 *
	 * @param {Form View} $this - ссылка на объект
	 * @return {String}
	 */
	$.fn.cForm.setAttr = function ($this) {
		var str = "", n, key;
		
		if ($this.validateForm) {
			for (n = $this.validateForm.length; n--;) {
				str += ' data-' + $this.validateForm[n] + '="true"';
			}
		}
		
		if ($this.data) {
			for (key in $this.data) {
				if ($this.data.hasOwnProperty(key)) {
					str += ' data-' + key + '="' + $this.data[key] + '"';
				}
			}
		}
		
		if ($this.attr) {
			for (key in $this.attr) {
				if ($this.attr.hasOwnProperty(key)) {
					str += ' ' + key + '="' + $this.attr[key] + '"';
				}
			}
		}
		
		return str;
	};
	// Расширяющий объект
	$.fn.cForm.updData = {};
	// Шаблон $.Collection
	$.fn.cForm.template = function ($this, i, aLength, $obj, id) {
		var
			str = "",
			
			childLength,
			tmpLength,
			j = -1, n = -1,
			
			updData = $.fn.cForm.updData;
		
		switch ($this[i].type) {
			case "fieldset" : {
				str += '\
				<fieldset title="' + $this[i].val + '" ' + $.fn.cForm.setAttr($this[i]) + '>'
					+ ($this[i].val ? '<legend>' + $this[i].val + '</legend>' : '') +
					'<table>\
				';
				
				if ($this[i].childNodes) {
					childLength = $this[i].childNodes.length;
					tmpLength = childLength - 1;
					
					for (; j++ < tmpLength;) {
						str += $.fn.cForm.template($this[i].childNodes, j, childLength, $obj, id);
					}
				}
				str += '</table></fieldset>';
			} break;
			case "select" : {
				str += '\
				<tr>\
					<td>'
						 + ($this[i].id ? '<label for="'+ $this[i].name + '">' + $this[i].label + '</label>'
						 : $this[i].label ? $this[i].label : '') + 
					'</td>\
					<td>\
						<select ' + ($this[i].id ? 'id="' + $this[i].id + '"' : '') + ' name="' + $this[i].name + '" ' + $.fn.cForm.setAttr($this[i]) + '>\
				';
				
				if (!updData.options) {
					if ($this[i].childNodes){
						childLength = $this[i].childNodes.length;
						tmpLength = childLength - 1;
						
						for (; j++ < tmpLength;) {
							str += $.fn.cForm.template($this[i].childNodes, j, childLength, $obj, id);
						}
					}
				} else {
					tmpLength = updData.options.length - 1;
					for (; j++ < tmpLength;) {
						str += '<option value="' + updData.options[j] + '" ' + $.fn.cForm.setAttr($this[i]) + '>' + updData.options[j] + '</option>';
					}
				}
				str += '</select></td></tr>';
			} break;
			case "option" : {
				str += '<option value="' + $this[i].val + '" ' + ($this[i].selected ? 'selected' : '') + '>' + $this[i].val + '</option>';
			} break;
			case "text" : {
				str += '\
				<tr>\
					<td>'
						 + ($this[i].id ? '<label for="'+ $this[i].name + '">' + $this[i].label + '</label>'
						 : $this[i].label ? $this[i].label : '') + 
					'</td>\
					<td>\
						<input type="text" value="'
							+ (updData[$this[i].name] || $this[i].val || '')
							+ '" ' + ($this[i].id ? 'id="' + $this[i].id + '"' : '') +
							'name="' + $this[i].name + '" ' + $.fn.cForm.setAttr($this[i]) + '>\
					</td>\
				</tr>';
			} break;
		}
			
		return str;
	};
	// Серилизатор
	$.fn.cFormSerialize = function () {
		var result = {};
		//
		$(this.find("input, select, textarea, button")).each(function () {
			var
				$this = $(this),
				tagName = $this[0].tagName,
				
				name = $this.attr("name"),
				type = $this.attr("type");
				
			if (tagName !== "select" && name) {
				result[name] = $this.val();
			} else {
				result[name] = $this.children(":selected").val();
			}
		});
		
		return result;
	}
})(jQuery);