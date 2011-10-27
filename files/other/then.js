	
	/**
	 * Функция для работы в цепочке с deferred
	 * 
	 * @this {Colletion Object}
	 * @param {Function} done - callback в случае успеха
	 * @param {Function} [fail=done] - callback в случае провала
	 * @return {Colletion Object}
	 */
	$.Collection.fn.then = function (done, fail) {
		var $this = this;
		
		if (arguments.length === 1) {
			$.when(this.prop("activeDefer")).always(function () { done.apply($this, arguments); });
		} else {
			$.when(this.prop("activeDefer")).then(
				function () { done().apply($this, arguments); },
				function () { fail().apply($this, arguments); }
			);
		}
			
		return this;
	};