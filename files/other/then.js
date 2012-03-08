	
	/////////////////////////////////
	// other
	/////////////////////////////////
	
	/**
	 * jQuery 'then' method
	 * 
	 * @this {Colletion Object}
	 * @param {Function} done - callback function (if success)
	 * @param {Function} [fail=done] - callback function (if failed)
	 * @return {Colletion Object}
	 */
	C.prototype.then = function (done, fail) {
		var self = this;
		
		if (arguments.length === 1) {
			$.when(this.active('defer')).always(function () { done.apply(self, arguments); });
		} else {
			$.when(this.active('defer')).then(
				function () { done().apply(self, arguments); },
				function () { fail().apply(self, arguments); }
			);
		}
		
		return this;
	};