goto start
--------------------------------------
������ ������
--------------------------------------
:start

copy	^
		txt\head.txt ^
		+ txt\closure.start.txt ^
		^
		+ core\core.js ^
		^
		+ txt\closure.end.txt ^
		^
		..\jquery.cui.js

goto start
--------------------------------------
����������� 
--------------------------------------
:start

java -jar compiler.jar --js ..\jquery.cui.js --js_output_file ..\jquery.cui.gcc.js
copy txt\head.compile.txt + ..\jquery.cui.gcc.js + txt\end.txt ..\jquery.cui.min.js
del ..\jquery.cui.gcc.js