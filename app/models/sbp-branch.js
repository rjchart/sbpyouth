
module.exports.getOldBM = function(branchData, members, attendValue) {
	var branchArray = [];
	members.forEach (function (item, index) {
		var attendOk = false;
		if (item.hasOwnProperty("attend")) {
			if (item.attend._ >= attendValue)
				attendOk = true;
		}
		else if (attendValue == 0)
			attendOk = true;

		if (attendOk && item.hasOwnProperty('branch') && item.branch._ == branchData.branch._ && item.RowKey._ != branchData.RowKey._ && item.part._ == "청2부") {
				branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.getYoungBM = function(branchData, members, attendValue) {
	var branchArray = [];
	members.forEach (function (item, index) {
		var attendOk = false;
		if (item.hasOwnProperty("attend")) {
			if (item.attend._ >= attendValue)
				attendOk = true;
		}
		else if (attendValue == 0)
			attendOk = true;

		if (attendOk && item.hasOwnProperty('branch') && item.branch._ == branchData.branch._ && item.RowKey._ != branchData.RowKey._ && item.part._ == "청1부") {
				branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.makeOldBranchMember = function(branchData, members, attendValue) {
	var branchArray = [];
	members.forEach (function (item, index) {
		var attendOk = false;
		if (item.hasOwnProperty("attend")) {
			if (item.attend._ >= attendValue)
				attendOk = true;
		}
		else if (attendValue == 0)
			attendOk = true;

		if (attendOk && item.branch._ == branchData.branch._ && item.RowKey._ != branchData.RowKey._ && item.age._ > 26) {
			if (item.hasOwnProperty("attendDesc") && item.attendDesc._ != '유학' && item.attendDesc._ != '직장' && item.attendDesc._ != '군대')
				branchArray.push(item);
			if (!item.hasOwnProperty("attendDesc"))
				branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.makeYoungBranchMember = function(branchData, members, attendValue) {
	var branchArray = [];
	members.forEach (function (item, index) {
		var attendOk = false;
		if (item.hasOwnProperty("attend")) {
			if (item.attend._ >= attendValue)
				attendOk = true;
		}
		else if (attendValue == 0)
			attendOk = true;

		if (attendOk && item.branch._ == branchData.branch._ && item.RowKey._ != branchData.RowKey._ && item.age._ <= 26) {
			if (item.hasOwnProperty("attendDesc") && item.attendDesc._ != '유학' && item.attendDesc._ != '직장' && item.attendDesc._ != '군대')
				branchArray.push(item);
			if (!item.hasOwnProperty("attendDesc"))
				branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.makeAllBranchMember = function(branchData, members, attendValue) {
	var branchArray = [];
	members.forEach (function (item, index) {
		var attendOk = false;
		if (item.hasOwnProperty("attend")) {
			if (item.attend._ >= attendValue)
				attendOk = true;
		}
		else if (attendValue == 0)
			attendOk = true;

		if (attendOk && item.branch._ == branchData.branch._) {
				branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.getEtcOldMember = function(members, attendValue) {
	var branchArray = [];
	members.forEach (function (item, index) {
		var attendOk = false;
		if (item.hasOwnProperty("attend")) {
			if (item.attend._ >= attendValue)
				attendOk = true;
		}
		else if (attendValue == 0)
			attendOk = true;

		if (attendOk && item.hasOwnProperty('branch') && item.branch._ == '기타' && item.age._ > 26) {
			branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.getEtcYoungMember = function(members, attendValue) {
	var branchArray = [];
	members.forEach (function (item, index) {
		var attendOk = false;
		if (item.hasOwnProperty("attend")) {
			if (item.attend._ >= attendValue)
				attendOk = true;
		}
		else if (attendValue == 0)
			attendOk = true;

		if (attendOk && item.hasOwnProperty('branch') && item.branch._ == '기타' && item.age._ <= 26) {
			branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.getArmyBM = function(branchData, members) {
	var branchArray = [];
	members.forEach (function (item, index) {
		// if (item.keys().indexof('attend') <= -1)
		// 	continue;
		if (item.hasOwnProperty('branch') && item.branch._ == branchData.branch._ && item.RowKey._ != branchData.RowKey._ && item.part._ == "군대") {
				branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.getOtherBM = function(branchData, members) {
	var branchArray = [];
	members.forEach (function (item, index) {
		// if (item.keys().indexof('attend') <= -1)
		// 	continue;
		if (item.hasOwnProperty('branch') && item.branch._ == branchData.branch._ && item.RowKey._ != branchData.RowKey._ && item.part._ == "유학") {
				branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.makeArmyMember = function(branchData, members) {
	var branchArray = [];
	members.forEach (function (item, index) {
		if (item.hasOwnProperty("attendDesc") && item.branch._ == branchData.branch._ && item.RowKey._ != branchData.RowKey._ && item.attendDesc._ == '군대') {
			branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.makeOtherMember = function(branchData, members) {
	var branchArray = [];
	members.forEach (function (item, index) {
		// if (item.keys().indexof('attend') <= -1)
		// 	continue;
		if (item.hasOwnProperty("attendDesc") && item.branch._ == branchData.branch._ && item.RowKey._ != branchData.RowKey._ && (item.attendDesc._ == '유학' || item.attendDesc._ == '직장')) {
			branchArray.push(item);
		}
	});
	return branchArray;
}

module.exports.GetTable = function (branchLogs, attendValue) {
	var getBSList = [];
	branchLogs.forEach (function (item, index) {
		if (item.charge == "bs")
			getBSList.push(item);
	});
	
	var maxLength = {one: 0, two: 0, arm: 0, out: 0};
	getBSList.forEach (function (item, index) {
		var getTable = exports.GetBranchTable(item, branchLogs, attendValue);
		item.one = getTable.one;
		item.two = getTable.two;
		item.arm = getTable.arm;
		item.out = getTable.out;
		if (maxLength.one < getTable.one.length) maxLength.one = getTable.one.length;
		if (maxLength.two < getTable.two.length) maxLength.two = getTable.two.length;
		if (maxLength.arm < getTable.arm.length) maxLength.arm = getTable.arm.length;
		if (maxLength.out < getTable.out.length) maxLength.out = getTable.out.length;
	});
	var returnValue = { 
			bsList: getBSList,
			maxLength: maxLength
		} 
	return returnValue;
}

module.exports.GetBranchTable = function(bsMember, members, attendValue) {
	if (!attendValue) attendValue = 0;
	var oneList = [];
	var twoList = [];
	var armList = [];
	var outList = [];
	var removeList = [];
	var branchTable = {
		one: oneList,
		two: twoList,
		arm: armList,
		out: outList
	};
	members.forEach (function (item, index) {
		var attendOk = false;
		if (attendValue == 0 || (item.attend && item.attend >= attendValue)) {
			attendOk = true;
		}

		if (attendOk && item.branch == bsMember.branch && item.RowKey != bsMember.RowKey) {
			if (item.part == "청2부")
				twoList.push(item);
			else if (item.part == "청1부")
				oneList.push(item);
			else if (item.part == "군대")
				armList.push(item);
			else
				outList.push(item);
			removeList.push(item);
		}
	});
	
	removeList.forEach(function (item, index) {
		var getID = members.indexOf(item);
		if (getID >= 0)
			members.splice(getID,1);
	});
	return branchTable;
}

