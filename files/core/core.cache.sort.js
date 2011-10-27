	
	// Статичные методы и свойства для сортировки
	$.Collection.cache.sort = {
		/**
		 * Поле сортировки
		 * 
		 * @field
		 * @type String|Null
		 */
		field: null,
		/**
		 * Реверсия
		 * 
		 * @field
		 * @type Boolean
		 */
		rev: false,
		/**
		 * Перетасовка
		 * 
		 * @field
		 * @type Boolean
		 */
		shuffle: false,
		/**
		 * Функция обработки при сортировки
		 * 
		 * @field
		 * @type Function|Boolean|Null
		 */
		fn: null,
		
		/**
		 * Вспомогательная функция сортировки
		 * 
		 * @param {String} [field=null] - поле сортировки
		 * @param {Boolean} [rev=false] - реверсия массива (константы: shuffle - случайное перемешивание массива)
		 * @param {Function} [fn=null] - функция действий над элементами массива
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
		 * Вспомогательная функция сортировки
		 * 
		 * @return {Number}
		 */
		sortHelper: function (a, b) {	
			var
				$this = $.Collection.cache.sort,
				rev = $this.shuffle ? Math.round(Math.random() * 2  - 1) : $this.rev ? $this.rev === true ? -1 : 1 : 1;
			
			if ($this.field) {
				a = $.Collection.cache.obj.getByLink(a, $this.field);
				b = $.Collection.cache.obj.getByLink(b, $this.field);
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