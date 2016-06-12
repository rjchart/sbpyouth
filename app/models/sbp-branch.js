
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
	
	branchLogs = branchLogs.sort(function(a,b){
		var aa = a.birthYear;
		var bb = b.birthYear;
		if (aa < bb) return -1;
		if (aa > bb) return 1;
		return 0;
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
			if (item.attendDesc == "결혼" || item.attendDesc == "제외")
				;
			else if (item.attendDesc == "유학" || item.attendDesc == "지방")
				outList.push(item);
			else if (item.attendDesc == "군대")
				armList.push(item);
			else if (item.part == "청2부")
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

function GetList (item, key) {
	var list = [];
	var value = item[key];
	if (value && value != '') {
		list = JSON.parse(item[key]);
	}
	return list;
}

function SetBasicComponent(item) {

	item['friends'] = GetList(item,'friends');
	item['haters'] = GetList(item, 'haters');
	item['hopers'] = GetList(item, 'hopers');
	item['families'] = GetList(item, 'families');

	item['happy'] = 100;
	item['order'] = 50;
	item['important'] = 0;
	item.oldbranch = item.branch;

	var powerValue = 0;
	switch (parseInt(item.attend)) {
		case 0:
			item.important = 5;
			break;
		case 1:
			item.important = 10;
			break;
		case 2:
			item.important = 30;
			break;
		case 3:
			item.important = 70;
			break;
		case 4:
			item.important = 100;
			break;
		default:
			item.important = 0;	
			break;
	}

	// item['important'] = importantValue
	switch (parseInt(item.tension)) {
		case 0:
			powerValue = item.important * 0.1;
			break;
		case 1:
			powerValue = item.important * 0.7;
			break;
		case 2:
			powerValue = item.important * 1;
			break;
		case 3:
			powerValue = item.important * 1.5;
			break;
		case 4:
			powerValue = item.important * 2;
			break;
	
		default:
			break;
	}
	item.power = powerValue;

	return powerValue;
}

function SetMemberBS(item, bsList) {
	var isBS = false;
	// BS인 경우 자신의 브랜치로 바로 편성된다.
	bsList.forEach (function (item2, index2) {
		if (item.RowKey == item2) {
			item.branch = item2;
			isBS = true;
			return;
		}
	});
	return isBS;
}

// 브랜치 편성 맴버에 포함되는 지 확인 후 맞는 경우 적용한다.
function SetMemberIsOK(item) {
	// 브랜치 편성 맴버가 아닌 경우 적용하지 않는다.
	if (item.branch != "기타" ) {
		var isOK = false;
		var attendDesc = item.attendDesc; 
		if (attendDesc != '유학' && attendDesc != '직장' && attendDesc != '군대'
		 && attendDesc != '결혼' && attendDesc != '전도사' && attendDesc != '목사' 
		 && attendDesc != '부장 집사' && attendDesc != '제외' && item.attend != 0)
			isOK = true;
		if (item.age > 40)
			isOK = false;
		if (isOK) {
			item.isok = true;
		}
	}
}

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function RemoveOldBranchHateBS(notHateBSList, member) {
	// while (1) {
		// var oldBSIndex = 0;
		// var oldBSExist = false;
		var removeIndexList = [];
		notHateBSList.forEach(function (bsMember, index) {
			if (bsMember.oldbranch == member.oldbranch) {
				// oldBSExist = true;
				// oldBSIndex = index;
				removeIndexList.push(index);
				return;
			}
		});
		
		member.haters.forEach(function (hater, index) {
			notHateBSList.forEach(function (bs, index2) {
				if (hater == bs.RowKey) {
					removeIndexList.push(index);
					return;
				}
			});
		});
		
		removeIndexList = removeIndexList.sort(function (a,b) {
			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		});
		
		removeIndexList.forEach(function(item, index) {
			notHateBSList.splice(item,1);
		});
		
		// if (oldBSExist) {
		// 	notHateBSList.splice(oldBSIndex,1);
		// }
		// else
			// break;
	// }
}

function SetHappinessTwoMember(member, member2, values) {
	var happyValue = values[0];
	var order = values[1];
	var sameOldBranchCount = values[2];
	var sameYearBranchCount = values[3];

	console.log(member.RowKey + ":" + member2.RowKey);

	var isFriend = member.friends.some(function(item, index3, array) {
		if (item == member2.RowKey)
			return true;
	});
	if (isFriend)
		happyValue += 10;

	var isHater = member.haters.some(function(item, index3, array) {
		if (item == member2.RowKey)
			return true;
	});
	
	if (isHater) {
		console.log(member.RowKey + "hates " + member2.RowKey);
		happyValue -= 50;
	}

	var isFamily = member.families.some(function(item, index3, array) {
		if (item == member2.RowKey)
			return true;
	});
	if (isFamily) {
		console.log(member.RowKey + ", " + member2.RowKey + "are families");
		order -=40;
	}

	var isHater2 = member2.haters.some(function(item, index3, array) {
		if (item == member.RowKey) 
			return true;
	});
	if (isHater2) {
		console.log(member.RowKey + "is hater from " + member2.RowKey);
		order -= 20;
	}

	if (member.oldbranch == member2.oldbranch) {
		console.log(member.RowKey + ", " + member2.RowKey + "are same old branch");
		sameOldBranchCount++;
		if (sameOldBranchCount > 1)
			order -= 2.1 * member2.attend;
	}

	if (member.yearbranch && member.yearbranch == member2.yearbranch) {
		console.log(member.RowKey + ", " + member2.RowKey + "are same year branch");
		sameYearBranchCount++;
		if (sameYearBranchCount > 2)
			order -= 1.2 * member2.attend;
	}
	
	values[0] = happyValue;
	values[1] = order;
	values[2] = sameOldBranchCount;
	values[3] = sameYearBranchCount;
}

function CheckBMHappiness(member, bs) {

	var happyValue = 100;
	var order = 50;	
	var sameOldBranchCount = 0;
	var sameYearBranchCount = 0;
	var values = [happyValue, order, sameOldBranchCount, sameYearBranchCount];

	console.log("length:" + bs.one.length + ", " + bs.two.length);
	bs.two.forEach(function (member2, index) {
		SetHappinessTwoMember(member, member2, values);

		// member['happy'] = entGen.Int32(happyValue);
		// if (member.power)
		// 	branchPower += member.power._;
	});

	bs.one.forEach(function (member2, index) {
		SetHappinessTwoMember(member, member2, values);

		// member['happy'] = entGen.Int32(happyValue);
		// if (member.power)
		// 	branchPower += member.power._;
	});

	if (values[0] < 90)
		return false;
	else if (values[1] < 40)
		return false;

	member.happy = values[0];
	member.order = values[1];
	
	return true;
}

function GetIndexOfBM(bsList, member) {

	var selectedIndex = 0;
	var isDecide = false;

	var notHateBSList = bsList.slice(0);

	RemoveOldBranchHateBS(notHateBSList, member);

	member.hopers.forEach(function (hoper, index) {
		notHateBSList.forEach(function (bs, index2) {
			if (hoper == bs.RowKey) {
				i = index2;
				isDecide = true;
			}
		});
	});

	if (isDecide) {
		var selectedBS = notHateBSList[i];
		var isGoodBranch = CheckBMHappiness(member, selectedBS);
		if (!isGoodBranch) {
			console.log("not very good");
			isVeryVeryNotGood = true;
			return -1;
		}
	}
	else {
		var isVeryVeryNotGood = false;
		while (1) {
			var randomNumberFromNotHateList = randomIntInc(0,notHateBSList.length-1);
			// console.log("member check:" + member.RowKey._ + "(" + member.oldbranch._ +")");
			// console.log("index check:" + JSON.stringify(notHateBSList[randomNumberFromNotHateList]));

			// console.log("member check:" + member.RowKey._ + "(" + member.oldbranch._ +")");
			// console.log("member index:" + randomNumberFromNotHateList);
			// console.log("index check:" + JSON.stringify(notHateBSList));
			// console.log("index check2:" + JSON.stringify(notHateBSList[randomNumberFromNotHateList]));
			selectedIndex = randomNumberFromNotHateList;
			var selectedBS = notHateBSList[selectedIndex];
			console.log("branch check1");

			var youthKey = 'one';
			if (member.age > 26)
				youthKey = 'two';

			console.log("branch check2");

			notHateBSList.forEach (function (bs, index) {
				if (selectedBS[youthKey].length > bs[youthKey].length) {
					selectedIndex = index;
					selectedBS = bs;
				}
			});
			console.log("branch check3: " + selectedBS.RowKey);

			var isGoodBranch = CheckBMHappiness(member, selectedBS);
			if (!isGoodBranch) {
				if (notHateBSList.length == 1) {
					console.log("not very good");
					isVeryVeryNotGood = true;
					break;
				}
				else {
					notHateBSList.splice(selectedIndex,1);
				}
			}
			else
				break;
		}
	}
	console.log("branch check last:" + notHateBSList[selectedIndex].RowKey);
	if (isVeryVeryNotGood)
		return -1;

	return notHateBSList[selectedIndex]['index'];
}

function GetIndexOfLessPeople(bsList, member) {

	var selectedBranchIndex = 0;
	var isDecide = false;

	// 만약 맴버가 원하는 BS가 있다면 선택한다.
	member.hopers.forEach(function (hoper, index) {
		bsList.forEach(function (bs, index2) {
			if (hoper == bs.RowKey && bs.oldbranch != member.oldbranch) {
				selectedBranchIndex = index2;
				isDecide = true;
			}
		});
	});

	if (!isDecide) {
		// 맴버가 싫어하지 않고 이전에 같지 않은 BS를 랜덤하게 선택한다.
		while (1) {
			selectedBranchIndex = randomIntInc(0,bsList.length-1);
			var isHate = false;

			member.haters.forEach(function (hater, index) {
				if (bsList[selectedBranchIndex].RowKey == hater) {
					isHate = true;
					return;
				}
			});

			// var selectedBS = bsList[selectedBranchIndex];
			if (bsList[selectedBranchIndex].oldbranch != member.oldbranch && !isHate)
				break;
		}

		var selectedBranch = bsList[selectedBranchIndex];
		
		// 청1부인지 청2부인지 확인한다.
		var youthKey = 'one';
		if (member.age > 26)
			youthKey = 'two';

		// 선택된 브랜치보다 인원이 더 적은 브랜치가 있으면 그쪽으로 우선 배치된다.
		bsList.forEach (function (bs, index) {
			if (member.oldbranch != bs.oldbranch) {
				if (selectedBranch[youthKey].length > bs[youthKey].length) {
					selectedBranchIndex = index;
					selectedBranch = bs;
				}
			}
		});
	}	

	return selectedBranchIndex;
}

function GetAgeFromYear (birthYear) {
	if (birthYear > 1900)
		birthYear -= 1900;
	var getAge = new Date().getYear() - birthYear + 1;
	return getAge;
}

function SetMembersForMakeBranch (newBSList, bsList, members) {
	var powerSum = 0;
	// 각 맴버를 먼저 확인하여 BS의 정보와 맴버들이 브랜치 편성이 될 수 있는가를 확인한다.
	members.forEach (function (member, index) {
		var isBS = false;
		var getAge = GetAgeFromYear(member.birthYear);
		member.age = getAge;	
		// 모든 맴버의 브랜치 파워 합산을 미리 알아둔다.
		SetBasicComponent(member);

		isBS = SetMemberBS(member, bsList);
		member.isok = false;
		if (isBS) {
			newBSList.push(member);
		}
		else {
			SetMemberIsOK(member);
		}
		if (member.isok)
			powerSum += member.power;
	});
	return powerSum;
}

/* 
	브랜치 편성과 BS들의 리스트를 뽑아내는 함수.
	매우 중요!!
	브랜치 편성 알고리즘은 과거 브랜치와 겹치지 않는 것을 우선으로 한다.
	각 맴버는 참석률과 참여율을 통해 브랜치에 어느정도 힘이 되는지를 계산.
	브랜치의 파워는 편성 때는 크게 상관하지 않는다.
*/
module.exports.MakeNewBranch = function (members, bsList, type) {
	var newBSList = [];
	var powerSum = 0;

	var i = 0;

	/***
		청년부 전체 브랜치를 임의로 지정한다.
	***/					
	// if (type == 0) {
	// 	members.forEach (function (item, index) {
	// 		var isBS = false;
	// 		SetBasicComponent(item);

	// 		// BS인 경우 자신의 브랜치로 바로 편성된다.
	// 		bsList.forEach (function (item2, index2) {
	// 			if (item.RowKey._ == item2) {
	// 				item['branch'] = entGen.String(item2);
	// 				isBS = true;
	// 				newBSList.push(item);
	// 				return;
	// 			}
	// 		});
	// 		// BS가 아닌 경우 임의로 처리
	// 		if (!isBS) {
	// 			// 브랜치 편성 맴버가 아닌 경우 적용하지 않는다.
	// 			if (item.branch._ != "기타") {
	// 				var isOK = false;
	// 				if (item.hasOwnProperty("attendDesc") && item.attendDesc._ != '유학' && item.attendDesc._ != '직장' && item.attendDesc._ != '군대')
	// 					isOK = true;
	// 				if (!item.hasOwnProperty("attendDesc"))
	// 					isOK = true;
	// 				if (isOK) {
	// 					item['branch'] = entGen.String(bsList[i]);
	// 					i++;
	// 					if (i >= bsList.length)
	// 						i = 0;
	// 				}
	// 			}
	// 		}
	// 	});

	// }
	if (type == 1) {

		// 각 맴버를 먼저 확인하여 BS의 정보와 맴버들이 브랜치 편성이 될 수 있는가를 확인한다.
		powerSum = SetMembersForMakeBranch(newBSList, bsList, members);
		var powerAver = powerSum / bsList.length;
		
		var newMembers = members.slice(0);
		// var branchList = {}, youngList = {};
		
		// branchList 만들기.
		newBSList.forEach( function (item, index) {
			item.one = [];
			item.two = [];
			// branchList[item.RowKey] = [];
			// youngList[item.RowKey] = [];
		});

		for (var j = 0; j < newMembers.length; j++) {
			var item = newMembers[j];
			// newMembers.splice(randomValue,1);

			// BS가 아닌 경우 임의로 처리
			if (item.isok) {
				
				var selectedIndex = GetIndexOfLessPeople(newBSList, item);
				// var key = newBSList[i].RowKey;
				// item.branch = key;				
				if (item.age > 26)
					newBSList[selectedIndex].two.push(item);
				else
					newBSList[selectedIndex].one.push(item);
			}
		}

	}
	else if (type == 2) {
		powerSum = SetMembersForMakeBranch(newBSList, bsList, members);
		var powerAver = powerSum / bsList.length;

		while (1) {
			console.log("pow:" + powerAver);
			var newMembers = members.slice(0);
			var branchList = {}, youngList = {}, pow = {};
			var isNotGood = false;
			
			// branchList 만들기.
			newBSList.forEach( function (bs, index) {
				bs['index'] = index;
				bs.one = [];
				bs.two = [];
				bs.pow = 0;
				bs.two.push(bs); // ?
				// branchList[bs.RowKey._] = [];
				// youngList[bs.RowKey._] = [];
				// pow[bs.RowKey._] = 0;
				
				// branchList[bs.RowKey._].push(bs);
			});

			
			for (var j = 0; j < members.length; j++) {
				var randomValue = randomIntInc(0, newMembers.length-1);
				var member = newMembers[randomValue];
				newMembers.splice(randomValue,1);
				// console.log("check 2:" + member.RowKey);
				// var member = newMembers[j];

				console.log(member.RowKey + " start!!")
				// BS가 아닌 경우 임의로 처리
				if (member.isok) {
					var selectedIndex = GetIndexOfBM(newBSList, member);
					if (selectedIndex == -1) {
						isNotGood = true;
						break;	
					}
					var selectedBS = newBSList[selectedIndex];
					member['branch'] = selectedBS.RowKey;
					var youthKey = 'one';
					if (member.age > 26)
						youthKey = 'two';
					selectedBS[youthKey].push(member);
					
					selectedBS.pow += member['power'];
				}
			}
			if (isNotGood)
				continue;

			var isPowAverBad = false;
			// branchList 만들기.
			newBSList.forEach( function (bs, index) {
				bs.two.splice(0,1);
				// delete bs.two[0];
				if (bs.pow < powerAver * .6) {
					isPowAverBad = true 
					return true;
				}

				if (bs.pow > powerAver * 1.4) {
					isPowAverBad = true 
					return true;
				}
			});
			if (!isPowAverBad)
				break;
		}
	}
	maxLength = {
		one: 0,
		two: 0
	};
	
	newBSList.forEach(function(bs) {
		if (maxLength.one < bs.one.length)
			maxLength.one = bs.one.length;
		if (maxLength.two < bs.two.length)
			maxLength.two = bs.two.length;
	});
	
	var returnValue = { 
			bsList: newBSList,
			maxLength: maxLength
		} 

	return returnValue;
}

