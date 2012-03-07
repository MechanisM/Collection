goto start
--------------------------------------
compile
--------------------------------------
:start

copy	^
		txt\head.txt ^
		+ txt\closure.start.txt ^
		^
		+ core\core.js ^
		+ core\core.static.js ^
		+ core\core.static.const.js ^
		+ core\core.static.type.js ^
		+ core\core.static.string.js ^
		+ core\core.static.expr.js ^
		+ core\core.static.obj.js ^
		+ mult\core.array.prototype.js ^
		+ core\core.prototype.js ^
		^
		+ jquery\collection.js ^
		+ jquery\compile.js ^
		+ jquery\other.js ^
		^
		+ fields\fields.js ^
		+ fields\fields.sys.js ^
		^
		+ stack\stack.js ^
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
		+ mult\mult.group.js ^
		^
		+ stat\stat.js ^
		+ stat\stat.group.js ^
		^
		+ sort\sort.js ^
		+ sort\sort.reverse.js ^
		^
		+ local\local.js ^
		^
		+ compile\compile.filter.js ^
		+ compile\compile.parser.js ^
		^
		+ context\context.js ^
		^
		+ other\other.js ^
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
compression
--------------------------------------
:start

java -jar compiler.jar --js ..\jquery.collection.js --js_output_file ..\jquery.collection.gcc.js
copy txt\head.compile.txt + ..\jquery.collection.gcc.js + txt\end.txt ..\jquery.collection.min.js
del ..\jquery.collection.gcc.js