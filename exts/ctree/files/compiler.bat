java -jar compiler.jar --js jquery.ctree.js --js_output_file jquery.ctree.gcc.js
copy txt\head.compile.txt + jquery.ctree.gcc.js + txt\end.txt jquery.ctree.min.js
del jquery.ctree.gcc.js