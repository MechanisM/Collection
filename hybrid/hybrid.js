function Hybrid (obj) {
	obj = obj || {};
	// create "factory" function if need	
	if (this.prototype && (!this.prototype.name || this.prototype.name !== "Hybrid")) { return new Hybrid(obj); }
	
	this.obj = obj;
	this.array = [];
	
	var key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) { this.array.push(key); }
	}
}
Hybrid.prototype = {
	/**
	 * object name
	 * 
	 * @constant
	 * @type String
	 */
	name: "Hybrid",
	/**
	 * object version
	 * 
	 * @constant
	 * @type String
	 */
	version: "1.0",
	/**
	 * return string: object name + object version
	 *
	 * @this {Hybrid Prototype}
	 * @return {String}
	 */
	hybrid: function () { return this.name + " " + this.version; },

	sort: function (sortFunction) {
		this.array.sort(sortFunction || "");
		
		return this;
	},
	reverse: function () {
		this.array.reverse();
		
		return this;
	},
	
	push: function () {
		this.array.push.apply(this.array, arguments);
		this
	},
	push: function () { this.array.push.apply(this.array, arguments); },
	push: function () { this.array.push.apply(this.array, arguments); },
	push: function () { this.array.push.apply(this.array, arguments); },
}