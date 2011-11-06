onmessage = function (e) {
	if (e.data === "start") { postMessage(new Error("1")); }
};