/**
 * $.cuiTree - плагин для JavaScript фреймворка $.Collection для построения деревьев
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
	$.fn.cuiTree = function (uProp, data) {
		var obj = this.cuiIs("cuiTree");
		//
		if (obj !== false) {
			if (uProp && uProp === true) {
				if (!obj.existTemplate("cuiTree_standartTpl")) { obj.pushTemplate("cuiTree_standartTpl", $.fn.cuiTree.template); }
				obj.$Target(this).setTemplate("cuiTree_standartTpl").print();
			}
			
			return obj;
		}
		uProp = uProp || {};
		obj = this.cuiNewCollection(data, uProp.def || "");
		//
		this
			.cuiSet("cuiTree", obj, {events: {}})
			.cuiAddEvents("cuiTree")
			.cuiExtend("pathmap", {events: [
				"animate",
				
				"click",
				"open",
				"close"
			 ]}, uProp)
		//
		obj
			.$Target(this)
			.pushSetTemplate("cuiTree_standartTpl", $.fn.cuiTree.template);
		//
		if (!data || data !== false) { obj.print(); }
		
		return obj;
	};
	// Стандартные данные
	if (!$.fn.cuiTree.stat) {
		$.fn.cuiTree.stat = {
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
	$.fn.cuiTree.template = function ($this, i, aLength, $obj, id, context, pos) {
		var
			stat = $.fn.cuiTree.stat,
		
			str = "",
			last = aLength - 1,
			
			childLength,
			tmpLength,
			newContext,
			
			aCheck,
			
			j = -1;
		
		if (i === 0) { str = '<ul class="cuiTree_container">'; }
		
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
		+ ' class="cuiTree_node'
		+ (!context ? ' cuiTree_isRoot' : '')
		+ (aCheck ? $this[i][stat.childNodes].length === 0 ? ' cuiTree_emptyChildNodes' : '' : ' cuiTree_expandLeaf')
		+ (i === last ? ' cuiTree_isLast' : '')
		+ ($this[i][stat.eopen] ? ' cuiTree_expandOpen' : ' cuiTree_expandClosed') + '">\
			<div class="cuiTree_expand"></div>\
			<div class="cuiTree_content">'
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
				str += $.fn.cuiTree.template($this[i][stat.childNodes], j, childLength, $obj, id, newContext, j);
			}
		}
								
		str += '</li>';
		if (i === last) { str += '</ul>'; }
								
		return str;
	};
	// Стандартное событие
	$.fn.cuiTree.events = {};
	$.fn.cuiTree.events.standart = function (obj) {
		this.on(".cuiTree_expand", "click", function (e) {
			var
				$parent = $(e.target).parent(),
				events = target.data("CUI").cuiTree.events,
				status,
				
				context = $parent.data("context"),
				pos = $parent.data("pos");
			
			if (!$parent.hasClass("cuiTree_expandLeaf")) {
				if ($parent.hasClass("cuiTree_expandOpen")) {
					
					if (!events.animate || !events.animate.close) {
						$parent.removeClass("cuiTree_expandOpen").addClass("cuiTree_expandClosed");
					} else if (events.animate && events.animate.close) {
						events.animate.close.call($parent).queue(function () {
							$parent.removeClass("cuiTree_expandOpen").addClass("cuiTree_expandClosed");
							$(this).removeAttr("style").dequeue();
						});
					}
					events.close && events.close.call($this, e, context, pos, $parent);
					status = "close";
				} else {
					if (!events.animate || !events.animate.open) {
						$parent.removeClass("cuiTree_expandClosed").addClass("cuiTree_expandOpen");
					} else if (events.animate && events.animate.open) {
						events.animate.open.call($parent).queue(function () {
							$parent.removeClass("cuiTree_expandClosed").addClass("cuiTree_expandOpen");
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