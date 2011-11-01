goto start
--------------------------------------
Сборка файлов
--------------------------------------
:start

copy	^
		core\core.js ^
		+ core\core.cache.js ^
		+ core\core.cache.lexeme.js ^
		+ core\core.parser.js ^
		^
		+ fn\string.js ^
		+ fn\stat.js ^
		^
		+ txt\end.txt ^
		..\collection.csql.js

goto start
--------------------------------------
Минификация 
--------------------------------------
:start

java -jar compiler.jar --js ..\collection.csql.js --js_output_file ..\collection.csql.min.js