	
	/**
	 * @constructor
	 * @this {Colletion Object}
	 * @param {Collection|Selector} [collection=null] - исходная коллекция или строка селектор для поля activeTarget
	 * @param {Plain Object} [uProp=$.Collection.storage.dObj.prop] - пользовательские настройки
	 */
	$.Collection = function (collection, uProp) {
		collection = collection || null;
		uProp = uProp || null;
		
		// Создание "фабричного" объекта
		if (this.fn && this.fn.jquery) { return new $.Collection(collection, uProp); }
		
		// Расширяем публичные поля
		$.extend(true, this, $.Collection.storage);
			
		var
			dObj = this.dObj,
			prop = dObj.prop;
				
		// Расширяем публичные поля из настроек указанных в конструкторе (если указанны)
		if (uProp) { $.extend(true, prop, uProp); }
				
		// Если array является строкой
		if ($.isString(collection)) {
			prop.activeTarget = $(collection);
			prop.activeCollection = null;
		} else { prop.activeCollection = collection; }
	};