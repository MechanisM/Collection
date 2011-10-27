	
	// Кеш
	$.Collection.storage.dObj.cache = {
		/**
		 * Автокеширование итераций (необходимо включить для кеширования итераций)
		 * 
		 * @field
		 * @type Boolean
		 */
		autoIteration: false,
		/**
		 * Кеширование итераций (необходимо включить для кеширования итераций)
		 * 
		 * @field
		 * @type Boolean
		 */
		iteration: false,
		/**
		 * Первая итерация
		 * 
		 * @field
		 * @type Number
		 */
		firstIteration: -1,
		/**
		 * Последня итерация
		 * 
		 * @field
		 * @type Number
		 */
		lastIteration: -1
	};