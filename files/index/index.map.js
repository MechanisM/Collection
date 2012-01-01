
	$.Collection.fn.genMap = function (id1, id2, context1, context2) {
		var
			collectionID = this.dObj.sys.collectionID,
		
			cObj1, cObj2,
			resObj = {};
	
		if ((!id1 || id1 === this.ACTIVE || !id2 || id2 === this.ACTIVE) && collectionID) {
			id1 = id1 || collectionID;
			id2 = id2 || collectionID;
		} else if (!collectionID) { throw new Error("Invalid ID collection"); }
		
		cObj1 = 
		
		console.log(resObj);
	}