	
	/////////////////////////////////
	// other
	/////////////////////////////////
	
	/**
	 * jQuery "then" method
	 * 
	 * @this {Colletion Object}
	 * @param {Function} done - callback (if success)
	 * @param {Function} [fail=done] - callback (if failed)
	 * @return {Colletion Object}
	 */
	$.Collection.fn.then = function (done, fail) {
		var $this = this;
		
		if (arguments.length === 1) {
			$.when($this.prop("activeDefer")).always(function () { done.apply($this, arguments); });
		} else {
			$.when($this.prop("activeDefer")).then(
				function () { done().apply($this, arguments); },
				function () { fail().apply($this, arguments); }
			);
		}
			
		return this;
	};