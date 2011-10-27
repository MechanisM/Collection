// cSelect v. 1.0
// Kobezzza (C) 2011
// kobezzza@mail.ru | kobezzza@gmail.com
// http://kobezzza.com
// Входные параметры конструктора:
// prop - объект настроек
// array - массив с данными (константы: exist - не делать парсинг DOMа) :: массив или строка
(function($){$.fn.cSelect = function(prop, array){
	prop = prop || {};
	if (this.data("CUI") && this.data("CUI").cSelect) return this.data("CUI").cSelect;
	
	var parent = array ? $.collection(array) : array && array == "exist" ? $.collection() : this.collection();
	
	for (var key in prop){
		parent["cSelect_" + key] = prop[key];
	}
		
	parent.Prop("activeTarget", this).SetTemplate("cSelect_StandartTpl");
	if (!array || array != "exist") parent.EasyParseJSON();
	this.setCUI("cSelect", parent);
	for (key in parent.cSelect_Events){
		parent.cSelect_Events[key](this, parent);
	}
	
	return parent;
};
// Стандартный шаблон
$.collection.storage.dObj.sys.tmpTemplate["cSelect_StandartTpl"] = function($this, i, aLength, obj){
	var str = "", last = aLength - 1, context = obj.ReturnContext(), count = obj.Prop("activeTarget").children("select").length;
	
	if (i === 0) str = '<select class="cSelect_Container cSelect_Rang_' + count + '" data-rang="' + count + '">';							
	str += '<option data-pos="' + i + '" data-context="' + context + '">' + $this[i].val + '</option>';			
	if (i === last) str += '</select>';
							
	return str;
};
// Событие по клику
// Входные параметры:
// e - объект event
// context - контекст :: строка
// pos - позиция элемента :: число
// parent - элемент li на котором произошло событие :: объект jQuery
// Возвращает объект $.collection
$.collection.fn.cSelect_Change = function(e, context, pos, target){
	var
		conTarget = this.GenElemPos(context, pos) + ".childNodes",
		parent = target.parent(),	
		rang = +parent.data("rang") + 1,
		superParent = parent.parent()
		str = "";
		
	for (var i = (rang - 1); i >= 0; i--){
		str += ".cSelect_Rang_" + i + ",";
	}
	str = "*:not(" + str.replace(/,$/, "") + ")";
	
	if (this.GetElement(conTarget)){
		if (superParent.children(".cSelect_Rang_" + rang).length !== 0) superParent.children(str).remove();
		this.NewContext(conTarget).EasyParseJSON({appendType: 1}).ResetContext();
	}else superParent.children(str).remove();
	
	return this;
};
// Массив событий
$.collection.fn.cSelect_Events = {};
// Стандартное событие
$.collection.fn.cSelect_Events["Standart"] = function(target, $this){
	target.delegate("option", "click", function(e){
		var $target = $(e.target), context = $target.data("context"), pos = $target.data("pos");
			
		$this.cSelect_Change.call($this, e, context, pos, $target);
	});
	
	return this;
}})(jQuery);