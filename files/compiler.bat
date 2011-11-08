goto start
--------------------------------------
Сборка файлов
--------------------------------------
:start

copy	^
		txt\head.txt ^
		+ txt\closure.start.txt ^
		^
		+ core\core.js ^
		+ core\core.static.js ^
		+ core\core.static.sort.js ^
		+ core\core.prototype.js ^
		^
		+ tm\tm.simple.js ^
		+ tm\tm.control.js ^
		^
		+ storage\storage.js ^
		+ storage\storage.sys.js ^
		+ storage\storage.view.js ^
		+ storage\storage.css.js ^
		^
		+ stack\stack.js ^
		+ stack\stack.bind.js ^
		+ stack\stack.prop.js ^
		+ stack\stack.alias.js ^
		^
		+ single\single.js ^
		+ single\single.add.js ^
		+ single\single.delete.js ^
		+ single\single.concat.js ^
		^
		+ mult\mult.js ^
		+ mult\mult.search.js ^
		+ mult\mult.return.js ^
		+ mult\mult.replace.js ^
		+ mult\mult.move.js ^
		+ mult\mult.delete.js ^
		^
		+ other\other.js ^
		+ other\order.js ^
		+ other\native.js ^
		+ other\then.js ^
		^
		+ design\design.print.js ^
		+ design\design.extprint.js ^
		+ design\design.table.js ^
		^
		+ index\index.js ^
		+ index\index.map.js ^
		^
		+ jquery\collection.js ^
		+ jquery\compile.js ^
		+ jquery\other.js ^
		^
		+ txt\closure.end.txt ^
		^
		+ lib\json2.js ^
		..\jquery.collection.js

goto start
--------------------------------------
Минификация 
--------------------------------------
:start

java -jar compiler.jar --js ..\jquery.collection.js --js_output_file ..\jquery.collection.gcc.js
copy txt\head.compile.txt + ..\jquery.collection.gcc.js + txt\end.txt ..\jquery.collection.min.js
del ..\jquery.collection.gcc.js