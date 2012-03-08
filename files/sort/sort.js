	
	/////////////////////////////////
	//// sort method
	/////////////////////////////////
	
	/**
	 * sort collection (in context)<br />
	 * events: onSort
	 * <i class="sort"></i> 
	 * 
	 * @this {Colletion Object}
	 * @param {Context} [field] - field name
	 * @param {Boolean} [rev=false] - reverce (contstants: "shuffle" - random order)
	 * @param {Function|Boolean} [fn=toUpperCase] - callback function ("false" if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @throw {Error}
	 * @return {Colletion Object}
	 */
	C.prototype.sort = function (field, rev, fn, id) {
		field = field || "";
		rev = rev || false;
		fn = fn && fn !== true ? fn === false ? "" : fn : function (a) {
			if (C.isString(a)) { return a.toUpperCase(); }
			
			return a;
		};
		id = id || "";
		//
		var
			self = this,
			cObj,
			
			/** @private */
			sort = function (a, b) {
				var r = rev ? -1 : 1;
				
				// sort by field
				if (field) {
					a = C.byLink(a, field);
					b = C.byLink(b, field);
				}
				// callback function
				if (fn) {
					a = fn(a);
					b = fn(b);
				}
				
				//
				if (rev !== self.SHUFFLE) {	
					if (a < b) { return r * -1; }
					if (a > b) { return r; }
					
					return 0;
				} else { return Math.round(Math.random() * 2  - 1); }
			},
			
			/** @private */
			sortObjectByKey = function (obj) {
				var
					sortedKeys = [],
					sortedObj = {},
					key;
				//
				for (key in obj) { if (obj.hasOwnProperty(key)) { sortedKeys.push(key); } }
				sortedKeys.sort(sort);
				//
				for (key in sortedKeys) {
					if (sortedKeys.hasOwnProperty(key)) { sortedObj[sortedKeys[key]] = obj[sortedKeys[key]]; }
				}
	
				return sortedObj;
			},
			/** @private */
			sortObject = function (obj) {
				var
					sortedValues = [],
					sortedObj = {},
					key;
				//
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						sortedValues.push({
							key: key,
							value: obj[key]
						});
					}
				}
				field = field === true ? "value" : "value" + C.CHILDREN + field;
				sortedValues.sort(sort);
				//
				for (key in sortedValues) {
					if (sortedValues.hasOwnProperty(key)) { sortedObj[sortedValues[key].key] = sortedValues[key].value; }
				}
	
				return sortedObj;
			}, e = null;
		
		// events
		this.onSort && (e = this.onSort.apply(this, arguments));
		if (e === false) { return this; }
		
		//
		cObj = C.byLink(this._get("collection", id), this._getActiveParam("context"));
		if (typeof cObj === "object") {
			if ($.isArray(cObj)) {
				cObj.sort(sort);
			} else {
				if (field) {
					cObj = sortObject(cObj);
				} else { cObj = sortObjectByKey(cObj); }
				//
				this._setOne("", cObj, id);
			}
		} else { throw new Error("incorrect data type!"); }
		
		return this;
	};