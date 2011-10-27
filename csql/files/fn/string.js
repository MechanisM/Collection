// Строковые методы
CSQL.prototype.CONCAT = function () {
	var
		aLength = arguments.length - 1,
		str = "", i = -1;
		
	for (; i++ < aLength;) {
		str += arguments[i];
	}

	return str;
};
CSQL.prototype.CONCAT_WS = function (sep) {
	if (!sep) { return null; }
		
	var
		aLength = arguments.length,
		str = "", i = -1;
		
	for (; i++ < aLength;) {
		if (i !== aLength) {
			str += arguments[i] + sep;
		} else { str += arguments[i]; }
	}

	return str;
};
CSQL.prototype.SUBSTRING = function (str, fromPos, forLen) {
	return str.substring(fromPos || 0, forLen || "");
};
CSQL.prototype.LENGTH = function (str) {
	return str.length;
};
CSQL.prototype.REPLACE = function (str, fromStr, toStr, mod) {
	mod = mod || "g";
	fromStr = new RegExp(fromStr, mod);
		
	return str.replace(fromStr, toStr);
};
CSQL.prototype.REPEAT = function (str, count) {
	if (!str || !count) { return null; }
	for (var i = count - 1; i--;) { str += str; }
		
	return str;
};
CSQL.prototype.SPACE = function (count) {	
	count = count || 1;
	var str = "", i;
	for (i = count; i--;) { str += " "; }
		
	return str;
};
CSQL.prototype.TRIM = function (str) {		
	return $.trim(str);
};
CSQL.prototype.LCASE = function (str) {
	return str.toLowerCase();
};
CSQL.prototype.UCASE = function (str) {
	return str.toUpperCase();
};