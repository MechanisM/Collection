	
	/////////////////////////////////
	//// public fields (active)
	/////////////////////////////////
	
	$.Collection.storage = {
		// root
		dObj: {
			/**
			 * <i lang="en">active properties</i>
			 * <i lang="ru">активные свойства</i>
			 * 
			 * @namespace
			 */
			active: {
				/////////////////////////////////
				//// data
				/////////////////////////////////
				
				/**
				 * <i lang="en">namespace</i>
			 	 * <i lang="ru">пространство имён</i>
				 * 
				 * @field
				 * @type String
				 */
				namespace: "nm",
				
				/**
				 * <i lang="en">collection</i>
			 	 * <i lang="ru">коллекция</i>
				 * 
				 * @field
				 * @type Collection|Null
				 */
				collection: null,
				/**
				 * <i lang="en">filter ("false" if disabled)</i>
			 	 * <i lang="ru">фильтр ("false" если отключён)</i>
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				filter: false,
				/**
				 * <i lang="en">context</i>
			 	 * <i lang="ru">контекст</i>
				 * 
				 * @field
				 * @type Context
				 */
				context: "",
				/**
				 * <i lang="en">cache object</i>
			 	 * <i lang="ru">кеш</i>
				 * 
				 * @field
				 * @type Plain Object
				 */
				cache: {
					/**
					 * auto cache
					 * 
					 * @field
					 * @type Boolean
					 */
					autoIteration: true,
					/**
					 * use cache
					 * 
					 * @field
					 * @type Boolean
					 */
					iteration: true,
					/**
					 * first iteration
					 * 
					 * @field
					 * @type Number
					 */
					firstIteration: false,
					/**
					 * last iteration
					 * 
					 * @field
					 * @type Number
					 */
					lastIteration: false
				},
				/**
				 * <i lang="en">temporary variables</i>
			 	 * <i lang="ru">временная переменная</i>
				 * 
				 * @field
				 * @type mixed
				 */
				variable: null,
				/**
				 * <i lang="en">deferred object</i>
			 	 * <i lang="ru">отложенный объект</i>
				 * 
				 * @field
				 * @type jQuery Deferred
				 */
				defer: "",
				
				/////////////////////////////////
				//// templating
				/////////////////////////////////
				
				/**
				 * <i lang="en">active page</i>
			 	 * <i lang="ru">активная страница</i>
				 * 
				 * @field
				 * @type Number
				 */
				page: 1,
				/**
				 * <i lang="en">parser ("false" if disabled)</i>
			 	 * <i lang="ru">парсер ("false" если отключён)</i>
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				parser: false,
				/**
				 * <i lang="en">DOM insert mode (jQuery methods)</i>
			 	 * <i lang="ru">режим добавления в DOM (методы jQuery)</i>
				 * 
				 * @field
				 * @param String
				 */
				appendType: "html",
				/**
				 * <i lang="en">target (target to insert the result templating)</i>
			 	 * <i lang="ru">цель (узел для вставки результата шаблонизации)</i>
				 * 
				 * @field
				 * @type jQuery Object
				 */
				target: null,
				/**
				 * <i lang="en">selector (used to calculate the number of records per page, by default, are all the children of the element)</i>
			 	 * <i lang="ru">селектор (используется для подсчёта количества записей на странице)</i>
				 * 
				 * @field
				 * @type Selector
				 */
				calculator: null,
				/**
				 * <i lang="en">pager (an interface element to display the navigation through the pages of)</i>
			 	 * <i lang="ru">пейджер (интерфейс навигации)</i>
				 * 
				 * @field
				 * @type jQuery Object
				 */
				pager: null,
				/**
				 * <i lang="en">template</i>
			 	 * <i lang="ru">шаблон</i>
				 * 
				 * @field
				 * @type Function
				 */
				template: null,
				/**
				 * <i lang="en">the number of entries on one page</i>
			 	 * <i lang="ru">количество записей на одной странице</i>
				 * 
				 * @field
				 * @type Number
				 */
				numberBreak: 10,
				/**
				 * <i lang="en">the number of pages in the navigation menu</i>
			 	 * <i lang="ru">количество ссылок на страницы в панеле навигации</i>
				 * 
				 * @field
				 * @type Number
				 */
				pageBreak: 10,
				/**
				 * <i lang="en">empty result (in case if the search nothing is returned)</i>
			 	 * <i lang="ru">выводится, когда запрос возвращает пустой ответ</i>
				 * 
				 * @field
				 * @type String
				 */
				resultNull: ""
			}
		}
	};