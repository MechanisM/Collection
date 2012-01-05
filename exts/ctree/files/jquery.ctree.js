/**
 * $.cTree - плагин для JavaScript фреймворка $.Collection для построения деревьев
 *
 * Автор: Кобец Андрей Александрович (kobezzza)
 * Дата: 27.10.2011 14:39:15
 *
 * Дополнение:
 * Код документирован в соответсвии со стандартом jsDoc
 * Специфичные типы данных:
 * 1) Colletion Object является сокращённой формой [Object] и означает экземпляр $.Collection
 * 2) Context является сокращённой формой [String] и контекст коллекции
 * 3) Tree View является сокращённой формой [Array|Object|Collection|Boolean] и означает представление дерева
 * 4) Plain Object является сокращённой формой [Object] и означает хеш-таблицу
 * 5) jQuery Object является сокращённой формой [Object] и означает экземпляр jQuery
 * --
 * Запись, типа: [prop] означает, что данный параметр не обязательный и если не указан явно, то не определён (не имеет значения по умолчанию)
 * 
 * @class
 * @autor kobezzza (kobezzza@gmail.com | http://kobezzza.com)
 * @version 1.6
 */
(function ($) {
	// Включение ECMAScript 5 "strict mode"
	"use strict";
	
	/**
	 * @constructor
	 * @this {jQuery Object}
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.prop] - пользовательские настройки
	 * @param {Tree View} [data] - представление дерева
	 * @return {Colletion Object}
	 */
	$.fn.cTree = function (uProp, data) {
		var key, obj;

		if (this.data("CUI") && this.data("CUI").cTree) {
			obj = this.data("CUI").cTree.obj;
			if (uProp && uProp === true) {
				if (!obj.existTemplate("cTree_standartTpl")) { obj.pushTemplate("cTree_standartTpl", $.fn.cTree.template); }
				obj.prop("activeTarget", this).setTemplate("cTree_standartTpl").print();
			}
			
			return obj;
		}
		
		uProp = uProp && uProp !== true ? uProp : {};
		uProp.def = uProp.def || "";
		
		if (data && data.name && data.name === "$.Collection") {
			obj = data;
		} else {
			obj = data && data !== false ? new $.Collection(data, uProp.def) : data && data === false ? new $.Collection("", uProp.def) : this.collection(uProp.def);
		}
		//
		obj.prop("activeTarget", this).pushSetTemplate("cTree_standartTpl", $.fn.cTree.template);
		if (!data || data !== false) { obj.print(); }
		this.setCUI("cTree", obj);
		
		// События
		for (key in uProp) {
			if (uProp.hasOwnProperty(key) && key !== "def") {
				this.data("CUI").cTree.events[key] = uProp[key];
			}
		}
		// Делегаты
		for (key in $.fn.cTree.events) {
			if ($.fn.cTree.events.hasOwnProperty(key) && key !== "animate") {
				$.fn.cTree.events[key](this, obj);
			}
		}
		
		return obj;
	};
	// Стандартные данные
	if (!$.fn.cTree.stat) {
		$.fn.cTree.stat = {
			val: "val",
			childNodes: "childNodes",
			doctype: "doctype",
			href: "href",
			html: "html",
			ico: "ico",
			alt: "alt",
			eopen: "eopen"
		};
	}
	// Шаблон $.Collection
	$.fn.cTree.template = function ($this, i, aLength, $obj, id, context, pos) {
		var
			stat = $.fn.cTree.stat,
		
			str = "",
			last = aLength - 1,
			
			childLength,
			tmpLength,
			newContext,
			
			aCheck,
			
			j = -1;
		
		if (i === 0) { str = '<ul class="cTree_container">'; }
		
		if (!context && $this[i].context) {
			context = $this[i].context;
			pos = i;
		}
		
		aCheck = $this[i][stat.childNodes] && $.isArray($this[i][stat.childNodes]);
		
		//
		str += '\
		<li'
		+ (context ? ' data-context="' + context + '"' : ' data-context=""')
		+ (context ? ' data-pos="' + pos + '"' : ' data-pos="' + i + '"')
		+ ' class="cTree_node'
		+ (!context ? ' cTree_isRoot' : '')
		+ (aCheck ? $this[i][stat.childNodes].length === 0 ? ' cTree_emptyChildNodes' : '' : ' cTree_expandLeaf')
		+ (i === last ? ' cTree_isLast' : '')
		+ ($this[i][stat.eopen] ? ' cTree_expandOpen' : ' cTree_expandClosed') + '">\
			<div class="cTree_expand"></div>\
			<div class="cTree_content">'
				+ ($this[i][stat.html] ? $this[i][stat.html] : '')
				+ ($this[i][stat.ico] ? '<img src="' + $this[i][stat.ico] + '" alt="' + ($this[i][stat.alt] ? $this[i][stat.alt] : '') + '"' + (!$this[i][stat.doctype] || $this[i][stat.doctype] == "xhtml" ? ' /' : '') + '>' : '')
				+ ($this[i][stat.href] && $this[i][stat.val] ? '<a href="' + $this[i][stat.href] + '">' + $this[i][stat.val] + '</a>' : $this[i][stat.val] ? '<span>' + $this[i][stat.val] + '</span>' : '')
			+ '</div>\
		';

		if (aCheck) {
			childLength = $this[i][stat.childNodes].length;
			tmpLength = childLength - 1;
			
			newContext = context ? context + "~" + i + "~" + stat.childNodes : i + "~" + stat.childNodes;
			
			for (; j++ < tmpLength;) {
				str += $.fn.cTree.template($this[i][stat.childNodes], j, childLength, $obj, id, newContext, j);
			}
		}
								
		str += '</li>';
		if (i === last) { str += '</ul>'; }
								
		return str;
	};
	// Стандартное событие
	$.fn.cTree.events = {};
	$.fn.cTree.events.standart = function (target, $this) {
		target.delegate(".cTree_expand", "click", function (e) {
			var
				$parent = $(e.target).parent(),
				events = target.data("CUI").cTree.events,
				status,
				
				context = $parent.data("context"),
				pos = $parent.data("pos");
			
			if (!$parent.hasClass("cTree_expandLeaf")) {
				if ($parent.hasClass("cTree_expandOpen")) {
					
					if (!events.animate || !events.animate.close) {
						$parent.removeClass("cTree_expandOpen").addClass("cTree_expandClosed");
					} else if (events.animate && events.animate.close) {
						events.animate.close.call($parent).queue(function () {
							$parent.removeClass("cTree_expandOpen").addClass("cTree_expandClosed");
							$(this).removeAttr("style").dequeue();
						});
					}
					events.close && events.close.call($this, e, context, pos, $parent);
					status = "close";
				} else {
					if (!events.animate || !events.animate.open) {
						$parent.removeClass("cTree_expandClosed").addClass("cTree_expandOpen");
					} else if (events.animate && events.animate.open) {
						events.animate.open.call($parent).queue(function () {
							$parent.removeClass("cTree_expandClosed").addClass("cTree_expandOpen");
							$(this).removeAttr("style").dequeue();
						});
					}
					events.open && events.open.call($this, e, context, pos, $parent);
					status = "open";
				}
				events.click && events.click.call($this, e, context, pos, $parent, status);
			}
		});
		
		return this;
	};
})(jQuery);