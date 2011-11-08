	
	/////////////////////////////////
	//// static methods (sort)
	/////////////////////////////////
	
	$.Collection.stat.sort = {
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
		 * @param {Boolean} [rev=false] - reverce (contstants: shuffle - random order)
		 * @param {Function} [fn=null] - callback
		 * @return {Function}
		 */
		sortBy: function (field, rev, fn) {
			this.field = field || null;
			this.rev = rev ? rev !== "shuffle" ? rev : false : false;
			this.shuffle = rev ? rev === "shuffle" ? rev : false : false;
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
				stat = $.Collection.stat,	
				$this = stat.sort,
				rev = $this.shuffle ? Math.round(Math.random() * 2  - 1) : $this.rev ? $this.rev === true ? -1 : 1 : 1;
			
			if ($this.field) {
				a = stat.obj.getByLink(a, $this.field);
				b = stat.obj.getByLink(b, $this.field);
			}
					
			if ($this.fn) {
				a = $this.fn(a);
				b = $this.fn(b);
			}
			
			if (!$this.shuffle) {	
				if (a < b) { return rev * -1; }
				if (a > b) { return rev; }
				
				return 0;
			} else { return rev; }
		}
	};