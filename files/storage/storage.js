	
	// Публичные поля
	$.Collection.storage = {
		// Корень объекта полей
		dObj: {
			// Активные свойства
			prop: {
				/**
				 * Активная коллекция
				 * 
				 * @field
				 * @type Collection|Null
				 */
				activeCollection: null,
				/**
				 * Активная страница (используется при разбиение на страницы в методе extPrint)
				 * 
				 * @field
				 * @type Number
				 */
				activePage: 1,
				/**
				 * Активная цель (цель для вставки результата шаблонизации)
				 * 
				 * @field
				 * @type jQuery Object
				 */
				activeTarget: null,
				/**
				 * Активный шаблон
				 * 
				 * @field
				 * @type Function
				 */
				activeTemplate: null,
				/**
				 * Активная модель шаблона
				 * 
				 * @field
				 * @type Function
				 */
				activeTemplateMode: $.Collection.cache.templateMode.simpleMode,
				/**
				 * Активное количество записей на одну страницу
				 * 
				 * @field
				 * @type Number
				 */
				activeCountBreak: 10,
				/**
				 * Активное количество показанных страниц (для модели шаблона controlMode)
				 * 
				 * @field
				 * @type Number
				 */
				activePageBreak: 10,
				/**
				 * Активный фильтр (false если отключен)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				activeFilter: false,
				/**
				 * Активный парсер (false если отключен)
				 * 
				 * @field
				 * @type Function|Boolean
				 */
				activeParser: false,
				/**
				 * Активный внешний селектор (используется для подсчета количества записей на странице)
				 * 
				 * @field
				 * @type Selector
				 */
				activeSelectorOut: ".SelectorOut",
				/**
				 * Активный пейджер (селектор к контейнеру для пейджера, CSS3 синтаксис)
				 * 
				 * @field
				 * @type Selector
				 */
				activePager: "#PageControl",
				/**
				 * Активный пустой результат (false - если отключен)
				 * 
				 * @field
				 * @type String|Boolean
				 */
				activeResultNull: false,
				/**
				 * Активная переменная
				 * 
				 * @field
				 * @type mixed
				 */
				activeVar: null,
				/**
				 * Активный контекст
				 * 
				 * @field
				 * @type Context
				 */
				activeContext: "",
				/**
				 * Активный режим добавления (вставка в DOM, константы: методы jQuery для работы с DOM)
				 * 
				 * @field
				 * @param String
				 */
				activeAppendType: "html",
				/**
				 * Активный отложенный объект
				 * 
				 * @field
				 * @type jQuery Deferred
				 */
				activeDefer: "",
				/**
				 * Активный объект кеша
				 * 
				 * @field
				 * @type Plain Object
				 */
				activeCache: {
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
				}
			}
		}
	};