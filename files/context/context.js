	
	/////////////////////////////////
	// context methods
	/////////////////////////////////
	
	/**
	 * <i lang="en">calculate parent context</i>
	 * <i lang="ru">вернуть контекст родительского элемента</i>
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] — <i lang="en">level</i><i lang="ru">уровень</i>
	 * @param {String} [id=this.ACTIVE] — <i lang="en>collection ID</i><i lang="ru">ИД коллекции</i>
	 * @return {String}
	 */
	$.Collection.prototype.parentContext = function (n, id) {
		var
			context = this._get("context", id || "").split(nimble.CHILDREN),
			i = n || 1;
		//
		while ((i -= 1) > -1) { context.splice(-1, 1); }
		//
		return context.join(nimble.CHILDREN);
	};
	/**
	 * <i lang="en">change the context (the parent element)</i>
	 * <i lang="ru">изменить контекст на родительский</i>
	 * 
	 * @this {Colletion Object}
	 * @param {Number} [n=1] — <i lang="en">level</i><i lang="ru">уровень</i>
	 * @param {String} [id=this.ACTIVE] — <i lang="en>collection ID</i><i lang="ru">ИД коллекции</i>
	 * @return {Colletion Object}
	 */
	$.Collection.prototype.parent = function (n, id) {
		if (!id) { return this._update("context", this.parentContext(n)); }
		//
		return this._push("context", id, this.parentContext(n, id));
	};