
	$.Collection.fn.genMap = function (id1, id2, context1, context2) {
		var
			activeCollectionID = this.dObj.sys.activeCollectionID,
		
			cObj1, cObj2,
			resObj = {};
	
		if ((!id1 || id1 === this.active || !id2 || id2 === this.active) && activeCollectionID) {
			id1 = id1 || activeCollectionID;
			id2 = id2 || activeCollectionID;
		} else if (!activeCollectionID) { throw new Error("Invalid ID collection"); }
		
		cObj1 = 
		
		console.log(resObj);
	}