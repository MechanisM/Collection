	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * sort collection (in context)
	 * 
	 * @this {Colletion Object}
	 * @param {String} [field] - field name
	 * @param {Boolean} [rev=false] - reverce (contstants: "shuffle" - random order)
	 * @param {Function|Boolean} [fn=toUpperCase] - callback ("false" if disabled)
	 * @param {String} [id=this.config.constants.active] - collection ID
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
			statObj = $.Collection.stat,
		
			dObj = this.dObj,
			sys = dObj.sys,
	
			collectionID = sys.collectionID,
			cObj,
	
			// sort object by key
			sortObjectByKey = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					key;
	
				for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
	
				sortedKeys.sort(statObj.sort.sortBy(field, rev, fn));
	
				for (key in sortedKeys) {
					if (sortedKeys.hasOwnProperty(key)) {
						sortedObj[sortedKeys[key]] = obj[sortedKeys[key]];
					}
				}
	
				return sortedObj;
			},
			// sort object by value
			sortObject = function (obj) {
				var
					sortedValues = [],
					sortedObj = {},
					key;
	
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						sortedValues.push({
							key: key,
							value: obj[key]
						});
					}
				}
	
				sortedValues.sort(statObj.sort.sortBy(field === true ? "value" : "value" + statObj.obj.contextSeparator + field, rev, fn));
	
				for (key in sortedValues) {
					if (sortedValues.hasOwnProperty(key)) {
						sortedObj[sortedValues[key].key] = sortedValues[key].value;
					}
				}
	
				return sortedObj;
			};
	
		cObj = statObj.obj.getByLink(id ? sys.tmpCollection[id] : dObj.prop.collection, this.getActiveContext());
	
		if (typeof cObj === "object") {
			if ($.isArray(cObj)) {
				cObj.sort(statObj.sort.sortBy(field, rev, fn));
			} else {
				if (field) {
					cObj = sortObject.call(this, cObj);
				} else {
					cObj = sortObjectByKey.call(this, cObj);
				}
	
				this.setElement("", cObj, id || "");
			}
		} else { throw new Error("incorrect data type!"); }
	
		return this;
	};