	
	/////////////////////////////////
	//// statistic methods (group)
	/////////////////////////////////
	
	/**
	 * get statistic information for group
	 * <i class="stat"></i>
	 *  
	 * @this {Colletion Object}
	 * @param {String|Function} [oper="count"] - operation type ("count", "avg", "summ", "max", "min", "first", "last") or callback function
	 * @param {Context} [field] - field name
	 * @param {Filter|Boolean} [filter=this.ACTIVE] - filter function, string expression or true (if disabled)
	 * @param {String} [id=this.ACTIVE] - collection ID
	 * @param {Number|Boolean} [count=false] - maximum number of substitutions (by default: all object)
	 * @param {Number|Boolean} [from=false] - skip a number of elements (by default: -1)
	 * @param {Number|Boolean} [indexOf=false] - starting point (by default: -1)
	 * @return {Colletion}
	 */
	C.prototype.groupStat = function (oper, field, filter, id, count, from, indexOf) {
		oper = oper || "count";
		id = id || "";

		// values by default
		count = parseInt(count) >= 0 ? parseInt(count) : false;
		from = parseInt(from) || false;
		indexOf = parseInt(indexOf) || false;
		
		//
		var
			operType = C.isString(oper),
			result = {}, tmp = {}, key,
			
			/** @private */
			deepAction = function (el, i, data, aLength, self, id) {
				var param = C.byLink(el, field || "");
				//
				switch (oper) {
					case "count" : {
						result[this.i] += 1;
					} break;
					case "summ" : {
						result[this.i] += param;
					} break;
					case "avg" : {
						tmp[this.i] += 1;
						result[this.i] += param;
					} break;
					case "max" : {
						if (param > result[this.i]) { result[this.i] = param; }
					} break;
					case "min" : {
						if (tmp[this.i] === 0) {
							result[this.i] = param;
							tmp[this.i] = 1;
						} else if (param < result[this.i]) { result[this.i] = param; }
					} break;
					default : {
						if (!operType) {
							result[this.i] = oper(param, result[this.i]);
						} else {
							if (tmp[this.i] === 0) {
								result[this.i] = param;
								tmp[this.i] = 1;
							} else { result[this.i] = C.expr(oper + "=" + param, result[this.i]); }
						}
					}
				}
					
				return true;
			},
			/** @private */
			action = function (el, i, data, aLength, self, id) {
				if (!result[i]) { result[i] = tmp[i] = 0; };
				//
				if (oper !== "first" && oper !== "last") {
					self
						._update("context", "+=" + C.CHILDREN + (deepAction.i = i))
						.forEach(deepAction, filter || "", id, "", count, from, indexOf)
						.parent();
				} else if (oper === "first") {
					result[i] = C.byLink(el, C.ORDER[0] + "0" + C.ORDER[1]);
				} else { result[i] = C.byLink(el, C.ORDER[0] + "-1" + C.ORDER[1]); }
					
				return true;
			};
		//
		this.forEach(action, "", id);
		//
		if (oper === "avg") {
			for (key in result) {
				if (!result.hasOwnProperty(key)) { continue; }
				result[key] /= tmp[key];
			}
		}
	
		return result;
	};	