	
	/**
	 * Сортировать коллекцию (с учётом контекста)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [field] - поле сортировки
	 * @param {Boolean} [rev=false] - перевернуть массив (константы: shuffle - случайное перемешивание массива)
	 * @param {Function|Boolean} [fn=toUpperCase] - функция действий над элементами коллекций (false - если ничего не делать)
	 * @param {String} [id=this.active] - ИД коллекции
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	$.Collection.fn.orderBy = function (field, rev, fn, id) {
		field = field || null;
		rev = rev || false;
		fn = fn ? fn === false ? null : fn : function (a) {
			if (isNaN(a)) { return a.toUpperCase(); }
			
			return a;
		};
	
		id = id || "";
	
		var
			staticObj = $.Collection.static,
		
			dObj = this.dObj,
			prop = dObj.prop,
			sys = dObj.sys,
	
			activeCollectionID = sys.activeCollectionID,
	
			cObj,
	
			i,
	
			// Сортировка объекта по ключам
			sortObjectByKey = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					i;
	
				for (i in obj) { if (obj.hasOwnProperty(i)) { sortedKeys.push(i); } }
	
				sortedKeys.sort(staticObj.sort.sortBy(field, rev, fn));
	
				for (i in sortedKeys) {
					if (sortedKeys.hasOwnProperty(i)) {
						sortedObj[sortedKeys[i]] = obj[sortedKeys[i]];
					}
				}
	
				return sortedObj;
			},
			// Сортировка объекта по значениям
			sortObject = function (obj) {
				var
					sortedValues = [],
					sortedObj = {},
					i;
	
				for (i in obj) {
					if (obj.hasOwnProperty(i)) {
						sortedValues.push({
							key: i,
							value: obj[i]
						});
					}
				}
	
				sortedValues.sort(staticObj.sort.sortBy(field === true ? "value" : "value" + staticObj.obj.contextSeparator + field, rev, fn));
	
				for (i in sortedValues) {
					if (sortedValues.hasOwnProperty(i)) {
						sortedObj[sortedValues[i].key] = sortedValues[i].value;
					}
				}
	
				return sortedObj;
			};
	
		cObj = staticObj.obj.getByLink(id ? sys.tmpCollection[id] : prop.activeCollection, prop.activeContext);
	
		if (typeof cObj === "object") {
			if ($.isArray(cObj)) {
				cObj.sort(staticObj.sort.sortBy(field, rev, fn));
			} else {
				if (field) {
					cObj = sortObject.call(this, cObj);
				} else {
					cObj = sortObjectByKey.call(this, cObj);
				}
	
				this.setElement("", cObj, id || "");
			}
		} else { throw new Error("Incorrect data type!"); }
	
		return this;
	};