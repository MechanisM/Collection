	
	/////////////////////////////////
	//// static methods (sort)
	/////////////////////////////////
	
	$.Collection.sort = {
		// const
		SHUFFLE: "shuffle",
		
		/**
		 * sort field name
		 * 
		 * @field
		 * @type String|Null
		 */
		field: null,
		/**
		 * reverce
		 * 
		 * @field
		 * @type Boolean
		 */
		rev: false,
		/**
		 * shuffle
		 * 
		 * @field
		 * @type Boolean
		 */
		shuffle: false,
		/**
		 * sort callback
		 * 
		 * @field
		 * @type Function|Boolean|Null
		 */
		fn: null,
		
		/**
		 * main sort function
		 * 
		 * @param {String} [field=null] - field name
		 * @param {Boolean} [rev=false] - reverce (contstants: "shuffle" - random order)
		 * @param {Function} [fn=null] - callback
		 * @return {Function}
		 */
		sortBy: function (field, rev, fn) {
			this.field = field || null;
			this.rev = rev ? rev !== this.SHUFFLE ? rev : false : false;
			this.shuffle = rev ? rev === this.SHUFFLE ? rev : false : false;
			this.fn = fn || null;
				
			return this.sortHelper;
		},
		/**
		 * sort helper
		 * 
		 * @return {Number}
		 */
		sortHelper: function (a, b) {	
			var
				stat = $.Collection,	
				self = stat.sort,
				rev = self.shuffle ? Math.round(Math.random() * 2  - 1) : self.rev ? self.rev === true ? -1 : 1 : 1;
			
			if (self.field) {
				a = nimble.byLink(a, self.field);
				b = nimble.byLink(b, self.field);
			}
					
			if (self.fn) {
				a = self.fn(a);
				b = self.fn(b);
			}
			
			if (!self.shuffle) {	
				if (a < b) { return rev * -1; }
				if (a > b) { return rev; }
				
				return 0;
			} else { return rev; }
		}
	};