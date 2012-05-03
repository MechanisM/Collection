	
	/////////////////////////////////
	//// date
	/////////////////////////////////
	
	/**
	 * convert string to date
	 * 
	 * @param {Object|String} date — date string or object
	 * @return {Object}
	 */
	Collection.date = function (date) {
		return new Date(date);
	};
	
	/**
	 * returns true if the date is in the range
	 * 
	 * @param {Object|String} date — date string or object
	 * @param {Object|String} min — min date
	 * @param {Object|String} max — max date
	 * @param {String|Boolrand} [range] — take into account the interval (constants: 'left', 'right')
	 * @return {Boolean}
	 */
	Collection.between = function (date, min, max, range) {
		date = C.date(date);
		
		if (range === true) {
			C.date(min) <= date && date <= C.date(max);
		} else if (range === 'left') {
			C.date(min) <= date && date < C.date(max);
		} else if (range === 'right') {
			C.date(min) < date && date <= C.date(max);
		}
		
		return C.date(min) < date && date < C.date(max);
	};