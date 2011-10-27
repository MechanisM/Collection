	
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