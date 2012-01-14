	
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
					eLength = elem.length,
					i = -1,
					str = "";
				//
				while ((i += 1) < eLength) {
					if (elem[i].nodeType === 3 && $.trim(elem[i].textContent)) { str += elem[i].textContent; }
				}
				//
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
	
						txt = text(this),
						key;
	
					array.push({});
					for (key in data) { if (data.hasOwnProperty(key)) { array[n][key] = data[key]; } }
					//
					if (classes) {
						array[n][stat.classes] = {};
						classes.forEach(function (el) {
							array[n][stat.classes][el] = el;
						});
					}
					//
					if ($this.children().length !== 0) { array[n][stat.childNodes] = inObj($this.children()); }
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