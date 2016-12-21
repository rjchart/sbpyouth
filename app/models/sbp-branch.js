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

module.exports.GetUnionTable = function (branchLogs, attendValue) {
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
		var getTable = exports.GetUnionBranchTable(item, branchLogs, attendValue);
		item.one = getTable.one;
		item.arm = getTable.arm;
		item.out = getTable.out;
		if (maxLength.one < getTable.one.length) maxLength.one = getTable.one.length;
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

module.exports.GetUnionBranchTable = function(bsMember, members, attendValue) {
	if (!attendValue) attendValue = 0;
	var oneList = [];
	var armList = [];
	var outList = [];
	var removeList = [];
	var branchTable = {
		one: oneList,
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
			else if (item.part == "청1부" || item.part == "청2부")
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
	if (value && typeof(value) == "string" && value != '') {
		list = JSON.parse(item[key]);
	}
	return list;
}

function SetMemberPower(item) {
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
			powerValue = item.important * 0.8;
			break;
		case 2:
			powerValue = item.important * 1;
			break;
		case 3:
			powerValue = item.important * 1.2;
			break;
		case 4:
			powerValue = item.important * 1.3;
			break;
	
		default:
			break;
	}
	item.power = powerValue;
}

function SetBasicComponent(item) {

	// item['friends'] = GetList(item,'friends');
	// item['haters'] = GetList(item, 'haters');
	// item['hopers'] = GetList(item, 'hopers');
	// item['families'] = GetList(item, 'families');

	item['happy'] = 0;
	item['order'] = 0;
	item['important'] = 0;
	item.countSameOld = 0;
	item.countSameYear = 0;
	item.oldbranch = item.branch;
	SetMemberPower(item);

	return item.power;
}


function SetBasicComponentNotBranchSetting(item) {

	// item['friends'] = GetList(item,'friends');
	// item['haters'] = GetList(item, 'haters');
	// item['hopers'] = GetList(item, 'hopers');
	// item['families'] = GetList(item, 'families');

	item['happy'] = 0;
	item['order'] = 0;
	item['important'] = 0;
	item.countSameOld = 0;
	item.countSameYear = 0;
	SetMemberPower(item);

	return item.pow;
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
		 && attendDesc != '결혼' && attendDesc != '전도사' && attendDesc != '강도사' && attendDesc != '목사' && attendDesc != '목사님' 
		 && attendDesc != '부장 집사' && attendDesc != '제외' && attendDesc != '장기결석' 
		 && attendDesc != '타교회' && attendDesc != '교회 옮김' && item.age <= 40 && attendDesc != '새신자') // && attendDesc != '목사'
		  
			isOK = true;
		// if (item.age > 40)
		// 	isOK = false;
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
					removeIndexList.push(index2);
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

function RemoveOldBranch(notHateBSList, member) {
		var removeIndexList = [];
		notHateBSList.forEach(function (bsMember, index) {
			if (bsMember.oldbranch == member.oldbranch) {
				removeIndexList.push(index);
				return;
			}
		});

		removeIndexList = removeIndexList.sort(function (a,b) {
			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		});
		
		removeIndexList.forEach(function(item, index) {
			notHateBSList.splice(item,1);
		});
		
}

function SetHappinessTwoMember(member, member2, tmp, hateData, familyData) {
	var tmp2 = {};
	tmp2.happy = member2.happy;
	tmp2.order = member2.order;
	tmp2.countSameOld = member2.countSameOld;
	tmp2.countSameYear = member2.countSameYear;
		
	//console.log(member.RowKey + ":" + member2.RowKey);

	var isFriend = member.friends.some(function(item, index3, array) {
		if (item == member2.RowKey)
			return true;
	});
	if (isFriend) {
		tmp.happy += 10;
		tmp2.happy += 10;
	}

	var isHater = member.haters.some(function(item, index3, array) {
		if (item == member2.RowKey)
			return true;
	});
	
	if (isHater) {
		//console.log(member.RowKey + " hates " + member2.RowKey);
		tmp.happy -= 50;
		tmp2.order -= 20;
	}

	var isFamily = member.families.some(function(item, index3, array) {
		if (item == member2.RowKey)
			return true;
	});
	if (isFamily) {
		//console.log(member.RowKey + ", " + member2.RowKey + " are family");
		tmp.order -= 20;
		tmp2.order -= 20;
	}

	var isHater2 = member2.haters.some(function(item, index3, array) {
		if (item == member.RowKey) 
			return true;
	});
	
	if (isHater2) {
		//console.log(member.RowKey + " is hater from " + member2.RowKey);
		tmp.order -= 20;
		tmp2.happy -= 50;
	}

	if (member != member2 && member.oldbranch == member2.oldbranch) {
		tmp.countSameOld++;
		tmp2.countSameOld++;
		//console.log(member.RowKey + ", " + member2.RowKey + " are same old branch: " + tmp.countSameOld + ", " + tmp2.countSameOld);
		var degree = 3.4 * Math.min(member2.attend, member.attend);
		// if (tmp.countSameOld > 1)
			tmp.order -= degree;
		// if (tmp2.countSameOld > 1)
			tmp2.order -= degree;
	}

	if (member.yearbranch && member.yearbranch == member2.yearbranch) {

		tmp.countSameYear++;
		tmp2.countSameYear++;
		//console.log(member.RowKey + ", " + member2.RowKey + " are same year branch");
		var degree = 1.2 * Math.min(member2.attend, member.attend);
		if (tmp.countSameYear > 2)
			tmp.order -= degree;
		if (tmp2.countSameYear > 2)
			tmp2.order -= degree;
	}
	
	if (tmp2.order <= -10 || tmp2.happy <= -10 || tmp.order <= -10 || tmp.happy <= -10)
		tmp.isOk = false;
		
	if (member2.attend >= 3)
		tmp2.state = 'positive';
	else if (member2.attend <= 1)
		tmp2.state = 'disabled';
	// else if (tmp2.happy > 0)
	// 	tmp2.state = 'positive';
	// else if (tmp2.order < 0)
	// 	tmp2.state = 'warning';
	else
		tmp2.state = '';
		

	return tmp2;
}

function CheckBMHappiness(member, bs, hateData, familyData) {
	var tmp = {}
	tmp.happy = member.happy;
	tmp.order = member.order;
	tmp.countSameOld = member.countSameOld;
	tmp.countSameYear = member.countSameYear;
	tmp.isOk = true;
	
	tmpfriendList = [];
	//console.log("length:" + bs.one.length + ", " + bs.two.length);
	var isOk = true;
	isOk = bs.two.every(function (member2, index) {
		if (member != member2) {
			var tmp2 = SetHappinessTwoMember(member, member2, tmp, tmp2, 0, 0);
			tmp2.youth = 'two';
			tmp2.friendIndex = index;
			tmpfriendList.push(tmp2);
			return tmp.isOk
		}
		else 
			return true; 
	});
	if (!isOk) 
		return false;

	isOk = bs.one.every(function (member2, index) {
		if (member != member2) {
			var tmp2 = SetHappinessTwoMember(member, member2, tmp, tmp2, 0, 0);
			tmp2.youth = 'one';
			tmp2.friendIndex = index;
			tmpfriendList.push(tmp2);
			return tmp.isOk
		}
		else 
			return true;
	});
	if (!isOk) 
		return false;
	
	// if (tmp.happy < -10) 
	// 	return false;
	// else if (tmp.order < -10)
	// 	return false;
	
	for (var key in tmp) {
		member[key] = tmp[key];
	}
	
	tmpfriendList.forEach(function (friend) {
		for (var key in friend) {
			bs[friend.youth][friend.friendIndex][key] = friend[key];
		}
	});
	
	if (member.attend >= 3)
		member.state = 'positive';
	else if (member.attend <= 1)
		member.state = 'disabled';
	// else if (member.happy > 0)
	// 	member.state = 'positive';
	// else if (member.order < 0)
	// 	member.state = 'warning';
	else
		member.state = '';
	
	
	return true;
}

function GetBSOfBM(bsList, member, inputBSName) {
	var selectedIndex = 0;
	var isBSHoper = false;

	var notHateBSList = bsList.slice(0);

	RemoveOldBranchHateBS(notHateBSList, member);

	if (inputBSName) {
		notHateBSList.forEach(function (bs, index2) {
			if (inputBSName == bs.RowKey) {
				selectedIndex = index2;
				isBSHoper = true;
			}
		});
		if (!isBSHoper) {
			isVeryVeryNotGood = true;
			return null;
		} 
	}
	else {
		member.hopers.forEach(function (hoper, index) {
			notHateBSList.forEach(function (bs, index2) {
				if (hoper == bs.RowKey) {
					selectedIndex = index2;
					isBSHoper = true;
				}
			});
		});
	}

	if (isBSHoper) {
		var selectedBS = notHateBSList[selectedIndex];
		var isGoodBranch = CheckBMHappiness(member, selectedBS, 0, 0);
		if (!isGoodBranch) {
			//console.log("not very good");
			isVeryVeryNotGood = true;
			return null;
		}
	}
	else {
		var isVeryVeryNotGood = false;
		var countcount = 0;
		while (countcount < 9) {
			countcount++;
			
			var randomNumberFromNotHateList = randomIntInc(0,notHateBSList.length-1);
			// //console.log("member check:" + member.RowKey._ + "(" + member.oldbranch._ +")");
			// //console.log("index check:" + JSON.stringify(notHateBSList[randomNumberFromNotHateList]));

			// //console.log("member check:" + member.RowKey._ + "(" + member.oldbranch._ +")");
			// //console.log("member index:" + randomNumberFromNotHateList);
			// //console.log("index check:" + JSON.stringify(notHateBSList));
			// //console.log("index check2:" + JSON.stringify(notHateBSList[randomNumberFromNotHateList]));
			selectedIndex = randomNumberFromNotHateList;
			var selectedBS = notHateBSList[selectedIndex];
			//console.log("branch check1");


			var youthKey = 'one';
			if (member.age > 26)
				youthKey = 'two';

			//console.log("branch check2");

			notHateBSList.forEach (function (bs, index) {
				if (selectedBS[youthKey].length > bs[youthKey].length) {
					selectedIndex = index;
					selectedBS = bs;
				}
			});
			//console.log("branch check3: " + selectedBS.RowKey);

			if(member.RowKey == "기동석")
				console.log("ab");
				
			var isGoodBranch = CheckBMHappiness(member, selectedBS, 0, 0);
			if (!isGoodBranch) {
				if (notHateBSList.length == 1) {
					//console.log("not very good");
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
		if (countcount >= 9)
			isVeryVeryNotGood = true;
	}
	//console.log("branch check last:" + notHateBSList[selectedIndex].RowKey);
	if (isVeryVeryNotGood)
		return null;

	return notHateBSList[selectedIndex];
}

function GetBSOfBMWithRandom(bsList, member, inputBSName) {

	var selectedIndex = 0;
	var isBSHoper = false;

	var notHateBSList = bsList.slice(0);

	RemoveOldBranch(notHateBSList, member);

	// if (inputBSName) {
	// 	notHateBSList.forEach(function (bs, index2) {
	// 		if (inputBSName == bs.RowKey) {
	// 			selectedIndex = index2;
	// 			isBSHoper = true;
	// 		}
	// 	});
	// 	if (!isBSHoper) {
	// 		isVeryVeryNotGood = true;
	// 		return null;
	// 	} 
	// }
	// else {
	// 	member.hopers.forEach(function (hoper, index) {
	// 		notHateBSList.forEach(function (bs, index2) {
	// 			if (hoper == bs.RowKey) {
	// 				selectedIndex = index2;
	// 				isBSHoper = true;
	// 			}
	// 		});
	// 	});
	// }

	// if (isBSHoper) {
	// 	var selectedBS = notHateBSList[selectedIndex];
	// 	var isGoodBranch = CheckBMHappiness(member, selectedBS);
	// 	if (!isGoodBranch) {
	// 		//console.log("not very good");
	// 		isVeryVeryNotGood = true;
	// 		return null;
	// 	}
	// }
	// else {
	var isVeryVeryNotGood = false;
	var countcount = 0;
	while (countcount < 9) {
		countcount++;
		var randomNumberFromNotHateList = randomIntInc(0,notHateBSList.length-1);
		selectedIndex = randomNumberFromNotHateList;
		var selectedBS = notHateBSList[selectedIndex];

		var youthKey = 'one';
		if (member.age > 26)
			youthKey = 'two';


		notHateBSList.forEach (function (bs, index) {
			if (selectedBS[youthKey].length > bs[youthKey].length) {
				selectedIndex = index;
				selectedBS = bs;
			}
		});
		//console.log("branch check3: " + selectedBS.RowKey);

		var isGoodBranch = CheckBMHappiness(member, selectedBS, 0, 0);
		if (!isGoodBranch) {
			if (notHateBSList.length == 1) {
				//console.log("not very good");
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
	if (countcount >= 9)
		isVeryVeryNotGood = true;
	// }
	//console.log("branch check last:" + notHateBSList[selectedIndex].RowKey);
	if (isVeryVeryNotGood)
		return null;

	return notHateBSList[selectedIndex];
}


function GetBSWithHoper (doneMembers, member) {
	var selectedBSName;
	var isHoperOK = false;
	var isMoreHoperInOtherBranch = false;
	// 만약 맴버가 원하는 BS가 있다면 선택한다.
	member.hopers.forEach(function (hoper, index) {
		doneMembers.some(function (member2, index2) {
			if (hoper == member2.RowKey && member2.oldbranch != member.oldbranch) {
				if (isHoperOK && selectedBSName != member2.branch)
					isMoreHoperInOtherBranch = true;
				selectedBSName = member2.branch;
				isHoperOK = true;
				return true;
			}
			else
				return false;
		});
	});

	if (isHoperOK)
		return selectedBSName;
}

function GetIndexOfLessPeople(bsList, member) {

	var selectedBranchIndex = 0;
	var isBSHoper = false;

	// 만약 맴버가 원하는 BS가 있다면 선택한다.
	member.hopers.forEach(function (hoper, index) {
		bsList.forEach(function (bs, index2) {
			if (hoper == bs.RowKey && bs.oldbranch != member.oldbranch) {
				selectedBranchIndex = index2;
				isBSHoper = true;
			}
		});
	});

	if (!isBSHoper) {
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
module.exports.MakeNewBranch = function (members, bsList, typeData, likeData, powerData, familyData) {
	var newBSList = [];
	var powerSum = 0;
	var powerRate = .45;
	if (powerData == 0)
		powerRate = .85;
	if (powerData == 1)
		powerRate = .7;
	if (powerData == 2)
		powerRate = .5;
	if (powerData == 3)
		powerRate = -3;
	var isFail = false;

	var i = 0;

	/***
		청년부 전체 브랜치를 임의로 지정한다.
	***/					
	// if (typeData == 0) {
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
	// if (typeData == 1) {

	// 	// 각 맴버를 먼저 확인하여 BS의 정보와 맴버들이 브랜치 편성이 될 수 있는가를 확인한다.
	// 	powerSum = SetMembersForMakeBranch(newBSList, bsList, members);
	// 	var powerAver = powerSum / bsList.length;
		
	// 	var newMembers = members.slice(0);
	// 	// var branchList = {}, youngList = {};
		
	// 	// branchList 만들기.
	// 	newBSList.forEach( function (item, index) {
	// 		item.one = [];
	// 		item.two = [];
	// 		// branchList[item.RowKey] = [];
	// 		// youngList[item.RowKey] = [];
	// 	});

	// 	for (var j = 0; j < newMembers.length; j++) {
	// 		var item = newMembers[j];
	// 		// newMembers.splice(randomValue,1);

	// 		// BS가 아닌 경우 임의로 처리
	// 		if (item.isok) {
				
	// 			var selectedIndex = GetIndexOfLessPeople(newBSList, item);
	// 			// var key = newBSList[i].RowKey;
	// 			// item.branch = key;				
	// 			if (item.age > 26)
	// 				newBSList[selectedIndex].two.push(item);
	// 			else
	// 				newBSList[selectedIndex].one.push(item);
	// 		}
	// 	}

	// }
	// else if (typeData == 2) {
	// 	powerSum = SetMembersForMakeBranch(newBSList, bsList, members);
	// 	var powerAver = powerSum / bsList.length;

	// 	while (1) {
	// 		members.forEach(function(member) {
	// 			member.happy = 0;
	// 			member.order = 0;
	// 			member.countSameOld = 0;
	// 			member.countSameYear = 0;
	// 		});
	// 		//console.log("pow:" + powerAver);
	// 		var newMembers = members.slice(0);
	// 		var branchList = {}, youngList = {}, pow = {};
	// 		var isNotGood = false;
			
	// 		// branchList 만들기.
	// 		newBSList.forEach( function (bs, index) {
	// 			// bs['index'] = index;
	// 			bs.one = [];
	// 			bs.two = [];
	// 			bs.pow = 0;
	// 			bs.two.push(bs); // 리스트에 두어 비교 대상으로 하기
	// 			// branchList[bs.RowKey._] = [];
	// 			// youngList[bs.RowKey._] = [];
	// 			// pow[bs.RowKey._] = 0;
				
	// 			// branchList[bs.RowKey._].push(bs);
	// 		});

			
	// 		for (var j = 0; j < members.length; j++) {
	// 			var randomValue = randomIntInc(0, newMembers.length-1);
	// 			var member = newMembers[randomValue];
	// 			newMembers.splice(randomValue,1);
	// 			// //console.log("check 2:" + member.RowKey);
	// 			// var member = newMembers[j];

	// 			//console.log(member.RowKey + " start!!")
	// 			// BS가 아닌 경우 임의로 처리
	// 			if (member.isok) {
	// 				var selectedBS = GetBSOfBM(newBSList, member);
	// 				if (selectedBS == null) {
	// 					isNotGood = true;
	// 					break;	
	// 				}
	// 				// var selectedBS = newBSList[selectedIndex];
	// 				member['branch'] = selectedBS.RowKey;
	// 				var youthKey = 'one';
	// 				if (member.age > 26)
	// 					youthKey = 'two';
	// 				selectedBS[youthKey].push(member);
					
	// 				selectedBS.pow += member['power'];
	// 			}
	// 		}
	// 		if (isNotGood)
	// 			continue;

	// 		var isPowAverBad = false;
	// 		// branchList 만들기.
	// 		newBSList.forEach( function (bs, index) {
	// 			bs.two.splice(0,1);
	// 			// delete bs.two[0];
	// 			if (bs.pow < powerAver * .85) {
	// 				isPowAverBad = true 
	// 				return true;
	// 			}

	// 			if (bs.pow > powerAver * 1.15) {
	// 				isPowAverBad = true 
	// 				return true;
	// 			}
	// 		});
	// 		if (!isPowAverBad)
	// 			break;
	// 	}
	// }
	if (typeData == 0) {
		powerSum = SetMembersForMakeBranch(newBSList, bsList, members);
		var powerAver = powerSum / bsList.length;
		var countBranchMake = 0;
		while (countBranchMake < 3000) {
			countBranchMake = countBranchMake + 1;

			members.forEach(function(member) {
				member.happy = 0;
				member.order = 0;
				member.countSameOld = 0;
				member.countSameYear = 0;
			});
			//console.log("pow:" + powerAver);
			var newMembers = members.slice(0); // 맴버 복사
			var doneMembers = []; // 이미 배치된 맴버 변수
			var branchList = {}, youngList = {}, pow = {}; 
			var isNotGood = false;
			
			// branchList 만들기.
			newBSList.forEach( function (bs, index) {
				// bs['index'] = index;
				bs.one = [];
				bs.two = [];
				bs.pow = 0;
				doneMembers.push(bs);
				bs.two.push(bs); // 리스트에 두어 비교 대상으로 하기
				// branchList[bs.RowKey._] = [];
				// youngList[bs.RowKey._] = [];
				// pow[bs.RowKey._] = 0;
				
				// branchList[bs.RowKey._].push(bs);
			});

			
			for (var j = 0; j < members.length; j++) {
				var randomValue = randomIntInc(0, newMembers.length-1);
				var member = newMembers[randomValue];
				if (likeData != 0)
					member.hater = [];
				if (familyData != 0)
					member.families = [];
				newMembers.splice(randomValue,1);
				// //console.log("check 2:" + member.RowKey);
				// var member = newMembers[j];

				//console.log(member.RowKey + " start!!")
				// BS가 아닌 경우 임의로 처리
				if (member.isok) {
					var selectedBS;
					var getBSName = GetBSWithHoper(doneMembers, member)
					selectedBS = GetBSOfBM(newBSList, member, getBSName);
					if (selectedBS == null) {
						isNotGood = true;
						break;	
					}
					// var selectedBS = newBSList[selectedIndex];
					member['branch'] = selectedBS.RowKey;
					var youthKey = 'one';
					if (member.age > 26)
						youthKey = 'two';
					selectedBS[youthKey].push(member);
					selectedBS.pow += member['power'];
					doneMembers.push(member);
				}
			}
			if (isNotGood)
				continue;

			var isPowAverBad = false;
			// branchList 만들기.
			powerSum = 0;

			newBSList.forEach( function (bs, index) {
				powerSum += bs.pow; 
			});
			powerAver = powerSum/newBSList.length;

			newBSList.forEach( function (bs, index) {
				bs.two.splice(0,1);
				// delete bs.two[0];

				if (bs.pow < powerAver * powerRate || bs.pow > powerAver * (2 - powerRate)) {
					isPowAverBad = true 
					return true;
				}
			});
			if (!isPowAverBad)
				break;
		}
		if (countBranchMake >= 500) {
			isFail = true;
			return null;
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

module.exports.SetBSListDetail = function(bsList) {
	bsList.forEach (function (item) {
		item.pow = 0;
		item.one.forEach(function (member) {
			SetBasicComponentNotBranchSetting(member);
			item.pow += member.power;
		});

		item.two.forEach(function (member) {
			SetBasicComponentNotBranchSetting(member);
			item.pow += member.power;
		});
	});

	bsList.forEach (function (item) {
		item.one.forEach(function (member) {
			CheckBMHappiness(member, item, 0, 0);
		});

		item.two.forEach(function (member) {
			CheckBMHappiness(member, item, 0, 0);
		});
	});
}
