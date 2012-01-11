goto start
--------------------------------------
Сборка файлов
--------------------------------------
:start

copy	^
        ..\nimble\txt\head.txt ^
        + ..\nimble\nimble.js ^
        ^
		+ txt\head.txt ^
		+ txt\closure.start.txt ^
		^
		+ core\core.js ^
		+ core\core.prototype.js ^
		+ core\core.sort.js ^
		^
		+ jquery\collection.js ^
		+ jquery\compile.js ^
		+ jquery\other.js ^
		^
		+ storage\storage.js ^
		+ storage\storage.sys.js ^
		^
		+ stack\stack.js ^
		+ stack\stack.prop.js ^
		+ stack\stack.aliases.js ^
		^
		+ single\single.js ^
		+ single\single.add.js ^
		+ single\single.remove.js ^
		+ single\single.concat.js ^
		^
		+ mult\mult.js ^
		+ mult\mult.search.js ^
		+ mult\mult.get.js ^
		+ mult\mult.set.js ^
		+ mult\mult.move.js ^
		+ mult\mult.remove.js ^
		^
		+ local\local.js ^
		^
		+ other\other.js ^
		+ other\order.js ^
		+ other\native.js ^
		+ other\then.js ^
		^
		+ design\design.print.js ^
		+ design\design.table.js ^
		^
		+ txt\closure.end.txt ^
		^
		..\jquery.collection.js

goto start
--------------------------------------
Минификация 
--------------------------------------
:start

java -jar compiler.jar --js ..\jquery.collection.js --js_output_file ..\jquery.collection.gcc.js
copy txt\head.compile.txt + ..\jquery.collection.gcc.js + txt\end.txt ..\jquery.collection.min.js
del ..\jquery.collection.gcc.js