onmessage = function (event) {
	for (var i = 10000000; (i -= 1) > -1;) {
		event.data.push(i)
	}
	
	postMessage(event.data);
};