if (!Worker) {
	var Worker = function (src) {
		$.getScript(src);
	};
}