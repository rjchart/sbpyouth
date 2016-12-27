var azure = require('azure-storage');
var accessKey = 'Fh/+XVXWJOFP9O7bfN/ucFEK9/jt5nu4fdUYRJGzwMuH4KB8fFaCk/gmer20nZ4vs3AiJdqB3FYgPCZqibK2Bw==';
var storageAccount = 'sbpyouth'; 
var util = require('util');
var sbp_time = require('../models/sbp-time');
var sbp_branch = require('../models/sbp-branch');

var tableService = azure.createTableService(storageAccount, accessKey);
var entGen = azure.TableUtilities.entityGenerator;

function RemoveEntityGenList (list) {
    for (var key in list) {
        var data = list[key];
        RemoveEntityGen(data);
    } 
}

function RemoveEntityGen (entity) {
    for (var key in entity) {
        var valueOfKey = entity[key];
        if (typeof valueOfKey == "object")
            entity[key] = valueOfKey._;
    }
}

function SetEntityGen (entity) {
    for (var key in entity) {
        var value = entity[key];
        var valueType = typeof value;
        if (value == null)
            value = '';
        // console.log(valueType);
        if (key == "PartitionKey" || key == "RowKey")
            entity[key] = entGen.String(value.toString());
        else if (typeof value == "string")
            entity[key] = entGen.String(value);
        else if (typeof value == "number")
            entity[key] = entGen.Int32(value);
    }
}

function SetBirthFormat (data) {
    if (!data)
        return;
    var year = parseInt(data.birthYear);
    if (year > 1900)
        year -= 1900;
    // var yu = false;
    // if (data.RowKey == "유진열")
    //     yu = true;
    var cur_year = new Date().getYear();
    var age = cur_year - year + 1;
    if (data.birthMonth < 3) //Check!!
        age = age + 1; 
    if (data.part != '교회') {
        if (age >= 27)
            data.part = '청2부';
        else 
            data.part = '청1부';
    }
    data.age = age;
    year += 1900; 
    data.birthYear = year.toString();
    data.birthMonth = FormatNumberLength(data.birthMonth, 2);
    data.birthDay = FormatNumberLength(data.birthDay, 2);
}

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function TensionToString(value) {
    if (!value)
        value = 0;
    value = parseInt(value);
    var returnString;
    switch (value) {
        case 0:
            returnString = '과묵함';
            break;
        case 1:
            returnString = '내성적임';
            break;
        case 2:
            returnString = '일반적임';
            break;
        case 3:
            returnString = '사교적임';
            break;
        case 4:
            returnString = '매우 활발함';
            break;
        default:
            returnString = '잘 모름';
            break;
    }
    return returnString;
}

module.exports.AttendToString = function AttendToString(value) {
    if (!value)
        value = 0;
    value = parseInt(value);
    var returnString;
    switch (value) {
        case 0:
            returnString = '안 나옴';
            break;
        case 1:
            returnString = '가끔 나옴';
            break;
        case 2:
            returnString = '종종 나옴';
            break;
        case 3:
            returnString = '잘 나옴';
            break;
        case 4:
            returnString = '매주 나옴';
            break;
        default:
            returnString = '잘 모름';
            break;
    }
    return returnString;
}

function SetTensionAndAttend (data) {
    if (!data.tension) data.tension = -1;
    data.tensionString = TensionToString(data.tension);
    if (!data.attend) data.attend = 0;
    data.attendString = exports.AttendToString(data.attend);
}

function MakeQueryWithList (list, key) {
    var names = [];
    list.forEach (function (item, index) {
        names.push(key + " eq '" + item + "'");
    }) 
    var memberString = names.join(" or ");
    return memberString;
} 

function CombineLogToMember(logList, memberList) {
    for (var memberKey in memberList) {
        var oneMember = memberList[memberKey];
        for (var logKey in logList) {
            var oneLog = logList[logKey];
            if (oneLog.RowKey == oneMember.RowKey) {
                for (var key in oneLog) {
                    if (key == 'PartitionKey' || key == 'RowKey' || key == 'birthYear' || key == 'attendDesc')
                        continue;
                    oneMember[key] = oneLog[key];   
                }
                oneMember.branchYear = oneLog.PartitionKey; 
            }
        }
        SetBirthFormat(oneMember);
        SetTensionAndAttend(oneMember);
    }
}

function CombineList(listA, listB) {
	listA = listA.sort(function(a,b){
	    var aa = a.RowKey._.toLowerCase();
	    var bb = b.RowKey._.toLowerCase();
	    if (aa < bb) return 1;
	    if (aa > bb) return -1;
	    return 0;
	});

	listB = listB.sort(function(a,b){
	    var aa = a.RowKey._.toLowerCase();
	    var bb = b.RowKey._.toLowerCase();
	    if (aa < bb) return 1;
	    if (aa > bb) return -1;
	    return 0;
	});

	for (var i=0; i < listA.length; i++) {
		for (var j = i; j < listB.length; j++) {
			if (listA[i].RowKey._ == listB[j].RowKey._) {
				Object.keys(listA[i]).forEach(function(key) {
					var value = listA[i][key];
					listB[j][key] = value;
				});

				Object.keys(listB[j]).forEach(function(key) {
					var value = listB[j][key];
					listA[i][key] = value;
				});
				continue;
			}
		}
	}

	listB = listB.sort(function(a,b){
	    var aa = a.birthYear._;
	    var bb = b.birthYear._;
	    if (aa < bb) return -1;
	    if (aa > bb) return 1;
	    return 0;
	});

	listA = listA.sort(function(a,b){
	    var aa = a.birthYear._;
	    var bb = b.birthYear._;
	    if (aa < bb) return -1;
	    if (aa > bb) return 1;
	    return 0;
	});

	return [listA, listB];
}

function SetFriendsWithList (memberList) {
    memberList.forEach(function(member) {
        SetFriendsWithObject(member);
    });
};

function SetFriendsWithObject (member) {
    var changeList = ['friends', 'haters', 'hopers', 'families'];
    changeList.forEach(function(key) {
        member[key] = member[key] ? JSON.parse(member[key]) : [];
    });
};

/*-------------------------------Just Member -----------------------------------
-------------------------------------------------------------------------------*/

module.exports.GetMemberWithName = function (name, next) {
    var query = new azure.TableQuery()
    .top(1)
    .where("PartitionKey eq 'Member' and RowKey eq ?", name.toString());

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('sbpcc', query, null, function entitiesQueried(error, result) {
        if (!error) {
            var getData = result.entries[0];
            RemoveEntityGen(getData);
            SetBirthFormat(getData);
            if (getData != null) {
                getData.tensionString = TensionToString(getData.tension);
                SetFriendsWithObject(getData); 
                return next(null, getData);
            }
            else
                return next(0);
        }    
    });
}

module.exports.GetMembersWithNames = function (names, next) {
    var memberString = MakeQueryWithList(names, 'RowKey');
    exports.GetMembersWithQuery(memberString, next);
}

module.exports.GetMembersWithQuery = function (queryString, next, top) {
    var query = new azure.TableQuery();
    if (top != null && top != '' && top != 0)
        query.top(top)
    if (queryString != null && queryString != '')
        query.where(queryString);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('sbpcc', query, null, function entitiesQueried(error, result) {
        if (!error) {
            RemoveEntityGenList(result.entries);     
            return next(null, result.entries);
        }    
    });
}

/***                                                                         ****
****                       Member and Branch Log                             ****
****                                                                         ***/

module.exports.GetMemberAndLogWithName = function (name, next) {
    var query = "RowKey eq '" + name.toString() + "'";
    
    exports.GetMembersAndLogWithQueryAndYear(query, null, next, 1);
}

module.exports.GetMembersAndLogWithNames = function (names, next) {
    var memberString = MakeQueryWithList(names, 'RowKey');
    exports.GetMembersAndLogWithQueryAndYear(memberString, null, next);
}

module.exports.GetMembersAndLogWithYear = function (year, next) {
    var query = MakeQuery("Member", null);
    exports.GetMembersAndLogWithQueryAndYear(query, year, next);
}

module.exports.GetMembersAndLogWithQueryAndYear = function (query, year, next, top) {
    var memberQuery = new azure.TableQuery();
    if (query != null && query != '')
        memberQuery.where(query);
    if (top != null && top == 0)
        memberQuery.top(top);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('sbpcc', memberQuery, null, function (error, member) {
        if (!error) {
            RemoveEntityGenList(member.entries);
            if (year == null || year == '' || year == 0)
                year = sbp_time.getYear();
                
            if (query)
                query = "(" + query + ")" + " and PartitionKey eq " + "'" + year + "'";
            else
                query = "PartitionKey eq " + "'" + year + "'";
            var logQeury = new azure.TableQuery();
            logQeury.where(query);
            
            tableService.queryEntities('branchlog', logQeury, null, function (error, log) {
                if (!error) {
                    RemoveEntityGenList(log.entries);
                    CombineLogToMember(log.entries, member.entries);
                    SetFriendsWithList(member.entries);
                    // getData.log = log.entries
                    return next(null, member.entries);        
                }
                else {
                    console.log("branchlog error: " + error);
                    return next(null, member.entries);
                }
            });     
        }    
        else {
            console.log("member error: " + error);
            return next(error);
        }
    });
}


/***                                                                         ****
****                       Member and Branch save                            ****
****                                                                         ***/

module.exports.GetCurrentMemberWithGroup = function (group, next) {
    var getDate = new Date();
    var year = getDate.getFullYear().toString();
    // var year = sbp_time.getYear();
    
    exports.GetMemberWithGroup(year, group, next);
}

module.exports.GetDetailCurrentMemberWithGroup = function (group, next) {
    var getDate = new Date();
    // var year = getDate.getFullYear().toString();
    var year = sbp_time.getYear();
    
    exports.GetMemberWithGroup(year, group, next);
}

module.exports.GetBankLog = function (year, part, next) {
    
    var query = new azure.TableQuery()
    .where('PartitionKey eq ? and part eq ?', year, part);
    // .where('PartitionKey eq ? and month eq ?', year, group);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('bank', query, null, function (error, result) {
        if (!error) {
            var banklogs = [];
            for (var index in result.entries) {
                var data = result.entries[index];
                RemoveEntityGen(data);
                if (data.section == '예산')
                    data.gain = data.money;
                else
                    data.spend = data.money;
                banklogs.push(data);
            }
            SetBankSort(banklogs);
            next(null, banklogs);
            // module.exports.GetMembersAndLogWithNames(members, function (error2, result2) {
            //     if (!error2) {
            //         for (var index in result2) {
            //             var data = result2[index];
            //             for (var j in result.entries) {
            //                 var data2 = result.entries[j];
            //                 if (data2.data == data.RowKey) {
            //                     for (var key in data2) {
            //                         if (key == "data")
            //                             data['name'] = data2[key];
            //                         else
            //                             data[key] = data2[key];
            //                     }
            //                 }
            //             }
            //         }
            //         next(null, result2);
            //     }
            //     else
            //         next(error);
            // });
        }
        else {
            console.log("error:" + error);
            next(error);
        }
            
    });
}

module.exports.GetBankWithMonthLog = function (year, month, part, next) {
    
    var query = new azure.TableQuery()
    // .where('PartitionKey eq ?', year);
    .where('PartitionKey eq ? and month eq ? and part eq ?', year, month, part);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('bank', query, null, function (error, result) {
        if (!error) {
            var banklogs = [];
            for (var index in result.entries) {
                var data = result.entries[index];
                RemoveEntityGen(data);
                if (data.section == '예산')
                    data.gain = data.money;
                else
                    data.spend = data.money;
                banklogs.push(data);
            }
            SetBankSort(banklogs);
            next(null, banklogs);
        }
        else {
            console.log("error:" + error);
            next(error);
        }
            
    });
}

// module.exports.GetHistoryWithMonth = function (year, month, next) {
    
//     var query = new azure.TableQuery()
//     // .where('PartitionKey eq ?', year);
//     .where('PartitionKey eq ? and month eq ?', year, month);

//     // 데이터베이스 쿼리를 실행합니다.
//     tableService.queryEntities('history', query, null, function (error, result) {
//         if (!error) {
//             var resultDatas = [];
//             for (var index in result.entries) {
//                 var data = result.entries[index];
//                 RemoveEntityGen(data);
//                 resultDatas.push(data);
//             }
//             // SetBankSort(resultDatas);
//             next(null, resultDatas);
//         }
//         else {
//             console.log("error:" + error);
//             next(error);
//         }
            
//     });
// }

module.exports.GetDatas = function (partitionKey, tableName, next) {
    
    var query = new azure.TableQuery()
    .where('PartitionKey eq ?', partitionKey);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities(tableName, query, null, function (error, result) {
        if (!error) {
            var banklogs = [];
            for (var index in result.entries) {
                var data = result.entries[index];
                RemoveEntityGen(data);
                banklogs.push(data);
            }
            if (tableName == "bankList")
                SetBankListSort(banklogs);
            next(null, banklogs);
        }
        else {
            console.log("error:" + error);
            next(error);
        }
            
    });
}

function MakeQuery(partitionKey, other) {
    var queryString = "PartitionKey eq '" + partitionKey + "'";
    var tt = typeof other;
    if (typeof other != undefined) {
        for (var key in other) {
            queryString += " and " + key + " eq '" + other[key] + "'";
        }
    }
    return queryString;
}

module.exports.GetSBPDatas = function (partitionKey, others, next) {
    
    var queryString = MakeQuery(partitionKey, others);

    // queryString1 = "PartitionKey eq 'Event'";
    var query = new azure.TableQuery()
    .where(queryString);
    // .where('PartitionKey eq ?', partitionKey);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('sbpcc', query, null, function (error, result) {
        if (!error) {
            var resultDatas = [];
            for (var index in result.entries) {
                var data = result.entries[index];
                RemoveEntityGen(data);
                resultDatas.push(data);
            }
            next(null, resultDatas);
        }
        else {
            console.log("error:" + error);
            next(error);
        }
            
    });
}


module.exports.GetMemberWithGroup = function (year, group, next) {
    
    var query = new azure.TableQuery()
    .where('PartitionKey eq ? and chargeGroup eq ?', year, group);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('saveData', query, null, function (error, result) {
        if (!error) {
            // var testString = JSON.stringify(result.entries);
            // var entries = JSON.parse(testString);
            var members = [];
            for (var index in result.entries) {
                var data = result.entries[index];
                RemoveEntityGen(data);
                members.push(data.data);
            }
            if (members.length == 0)
                next(null, []);
            else {
                module.exports.GetMembersAndLogWithNames(members, function (error2, result2) {
                    if (!error2) {
                        for (var index in result2) {
                            var data = result2[index];
                            for (var j in result.entries) {
                                var data2 = result.entries[j];
                                if (data2.data == data.RowKey) {
                                    for (var key in data2) {
                                        if (key == "data")
                                            data['name'] = data2[key];
                                        else
                                            data[key] = data2[key];
                                    }
                                }
                            }
                        }
                        next(null, result2);
                    }
                    else
                        next(error);
                });
            }
        }
        else {
            console.log("error:" + error);
            next(error);
        }
            
    });
}

module.exports.SaveMember = function (member, next) {
    if (member.birthYear && member.birthYear >= 1900)
        member.birthYear = member.birthYear - 1900; 
    SetEntityGen(member);

	tableService.insertOrMergeEntity('sbpcc', member, function(error, result) {
		if (!error) {
            next(null, result);
		}
		else {
            next(error);
		}
	});
}

module.exports.SaveDatas = function (tableName, data, next) {
    SetEntityGen(data);

	tableService.insertOrMergeEntity(tableName, data, function(error, result) {
		if (!error) {
            next(null, result);
		}
		else {
            next(error);
		}
	});
}

module.exports.SaveMemberAndLog = function (member, next) {
    var keyList = ['RowKey', 'age', 'attend', 'birthYear', 'branch', 'charge', 'part', 'service'];
    var branchLog = {}; 
    for (var key in member) {
        if (keyList.indexOf(key) >= 0) {
            branchLog[key] = member[key];
        }
    }
    if (member.year) {
        branchLog.PartitionKey = member.year;
        var year = member.year.replace('-2', '');
        branchLog.age = (year - member.birthYear + 1) % 100;
    }
    else {
        var getYear = sbp_time.getYear();
        branchLog.PartitionKey = getYear;
        // var year = member.year.replace('-2', '');
    }
    var maxCount = 2;
    var count = 0;
    exports.SaveMember(member, function(error, result) {
        if (!error) {
            count++;
            if (count >= maxCount) {
                RemoveEntityGen(member);
                SetTensionAndAttend(member);
                next(null, member);
            }
        }
        else 
            next(error);
    });
    exports.SaveBranchLog(branchLog, function(error, result) {
        if (!error) {
            count++;
            if (count >= maxCount) {
                RemoveEntityGen(member);
                SetTensionAndAttend(member);
                next(null, member);
            }
        }
        else 
            next(error);
    });


}

module.exports.SaveBranchLog = function (branchLog, next) {
    if (branchLog.birthYear && branchLog.birthYear > 1900)
        branchLog.birthYear = branchLog.birthYear - 1900;

    SetEntityGen(branchLog);
	tableService.insertOrMergeEntity('branchlog', branchLog, function(error, result) {
		if (!error) {
            next(null, result);
		}
		else {
            next(error);
		}
	});
}

/***                                                                         ****
****                            Just Branch Log                              ****
****                                                                         ***/

module.exports.GetBranchMembers = function (year, next, attendValue) {
    if (year == null || year == '' || year == 0)
        year = sbp_time.getYear();
    var query = new azure.TableQuery()
        .where("PartitionKey eq ?", year.toString());
    
    tableService.queryEntities('branchlog', query, null, function (error, log) {
        if (!error) {
            RemoveEntityGenList(log.entries);
            var getTable = sbp_branch.GetTable(log.entries, attendValue);
            getTable.year = year;
            // getData.log = log.entries
            return next(null, getTable);
        }
        else {
            return next(error);
        }
    });
}

module.exports.GetUnionBranchMembers = function (year, next, attendValue) {
    if (year == null || year == '' || year == 0)
        year = sbp_time.getYear();
    var query = new azure.TableQuery()
        .where("PartitionKey eq ?", year.toString());
    
    tableService.queryEntities('branchlog', query, null, function (error, log) {
        if (!error) {
            RemoveEntityGenList(log.entries);
            var getTable = sbp_branch.GetUnionTable(log.entries, attendValue);
            getTable.year = year;
            // getData.log = log.entries
            return next(null, getTable);
        }
        else {
            return next(error);
        }
    });
}

function SetBranchSort (branch) {
    branch = branch.sort(function(a,b){
        var aa = a.birthYear;
        var bb = b.birthYear;
        
        if (a.charge == 'bs') return -1;
        if (b.charge == 'bs') return 1;
        if (aa < bb) return -1;
        if (aa > bb) return 1;
        return 0;
    });
}

function SetBankSort (data) {
    data = data.sort(function(a,b){
        var ay = parseInt(a.year);
        var by = parseInt(b.year);
        var am = parseInt(a.month);
        var bm = parseInt(b.month);
        var ad = parseInt(a.day);
        var bd = parseInt(b.day);

        if (ay < by) return -1;
        else if (ay > by) return 1;
        else {
            if (am < bm) return -1;
            else if (am > bm) return 1;
            else {
                if (ad < bd) return -1;
                else if (ad > bd) return 1;
                else if (a.section == "예산") return -1;
                else if (b.section == "예산") return 1;
                else return 0;
            }
        }
    });
}

function SetBankListSort (data) {
    data = data.sort(function(a,b){
        if (a.section == "임원" && b.section != "임원") return -1;
        else if (a.section != "임원" && b.section == "임원") return 1;
        else if (a.section == "임원" && b.section == "임원" && a.name < b.name) return -1;
        else if (a.section == "임원" && b.section == "임원" && a.name > b.name) return 1;
        else if (a.section == "임원" && b.section == "임원" && a.name == b.name) return 0;
        else {
            if (a.section == "BS" && b.section != "BS") return -1;
            else if (a.section != "BS" && b.section == "BS") return 1;
            else if (a.section == "BS" && b.section == "BS" && a.name < b.name) return -1;
            else if (a.section == "BS" && b.section == "BS" && a.name > b.name) return 1;
            else if (a.section == "BS" && b.section == "BS" && a.name == b.name) return 0;
            else {
                if (a.section == "팀장" && b.section != "팀장") return -1;
                else if (a.section != "팀장" && b.section == "팀장") return 1;
                else if (a.section == "팀장" && b.section == "팀장" && a.name < b.name) return -1;
                else if (a.section == "팀장" && b.section == "팀장" && a.name > b.name) return 1;
                else if (a.section == "팀장" && b.section == "팀장" && a.name == b.name) return 0;
                else if (a.name < b.name) return -1;
                else if (a.name > b.name) return 1;
                else return 0;
            }
        }
    });
}

module.exports.GetBranchMembersWithBranch = function (year, branch, next) {
    if (year == null || year == '' || year == 0)
        year = sbp_time.getYear();
    var query = new azure.TableQuery()
        .where("PartitionKey eq ? and branch eq ?", year.toString(), branch);
    
    tableService.queryEntities('branchlog', query, null, function (error, log) {
        if (!error) {
            RemoveEntityGenList(log.entries);
            var names = [];
            log.entries.forEach (function (item, index) {
                item.name = item.RowKey;
                names.push(item.RowKey);
            });
            var queryString = MakeQueryWithList(names, 'RowKey');
            exports.GetMembersWithQuery (queryString, function (error2, member) {
                if (!error2) {
                    CombineLogToMember(log.entries, member);
                    SetBranchSort(member);
                    return next(null, member);
                } 
                else {
                    console.log("get member data failed: " + error2);    
                    return next(error);
                }
            });
        }
        else {
            return next(error);
        }
    });
    
}

module.exports.AddMember = function (addData, next) {
    var maxLength = addData.length;
    var count = 0;
    addData.forEach(function(data, index) {
        SetEntityGen(data);
        // 데이터베이스에 entity를 추가합니다.
        tableService.insertOrMergeEntity('sbpcc', data, function(error, result) {
            count++;
            if (!error) {
                if (count >= maxLength)
                    next(null, result);
            }
            else {
                console.log("error in member save:" + error);
                next(error);
                // if (count >= maxCount)
                //     response.send({result:true,
                //         field:saved});
            }
        });

    });
    
}

module.exports.RemoveMember = function (data, next) {
    // if (102 > year && 3 > month)
    //     year--;
    SetEntityGen(data);
    tableService.deleteEntity('sbpcc', data, function(error, result) {
        if (!error) {
            next(null, result);
        }
        else {
            console.log("error in member delete:" + error);
            next(error);
        }
    });
}

var resultTest;
module.exports.AddBranch = function (addData, next) {
    resultTest = "";
    var maxLength = addData.length;
    var count = 0;
    addData.forEach(function(data, index) {
        exports.GetMemberWithName(data.RowKey, function (error, result) {
            if (!error) {
                if (result == null) {
                    count++;
                    console.log("error in branch save:" + data.RowKey);
                    // next(data.RowKey + " 청년이 청년부 목록에 없습니다.");
                    resultTest = " \n - error: " + data.RowKey + " 청년은 청년부 목록에 없습니다."
                }
                else {
                    data.age = data.PartitionKey - result.birthYear + 1;
                    if (isNaN(data.age))
                        data.age = new Date().getFullYear() - result.birthYear + 1;
                    data.attend = result.attend;
                    data.birthYear = result.birthYear - 1900;
                    if (data.attendDesc == "기본" && data.part == null) {
                        if (data.age >= 27)
                            data.part = "청2부";
                        else     
                            data.part = "청1부";
                    }
                    if (data.attendDesc != "기본")
                        data.part = data.attendDesc;
                    
                    if (data.attendDesc == "bs" || data.attendDesc == "BS") {
                        data.charge = 'bs';
                        data.attendDesc = '';
                    }
                    else
                        data.charge = 'bm';
                        
                    SetEntityGen(data);
                    // 데이터베이스에 entity를 추가합니다.
                    tableService.insertOrMergeEntity('branchlog', data, function(error, result) {
                        count++;
                        if (!error) {
                            if (count >= maxLength)
                                next(null, resultTest);
                        }
                        else {
                            console.log("error in member save:" + error);
                            next(error);
                        }
                    }); 
                }
            } 
            else {
                count++;
                console.log("error in branch save:" + error);
                next(error);
            }
        });

    });
    
}


module.exports.SaveBranch = function (addData, next) {
    var maxLength = addData.length;
    var count = 0;
    addData.forEach(function(data, index) {
        SetEntityGen(data);
        // 데이터베이스에 entity를 추가합니다.
        tableService.insertOrMergeEntity('branchlog', data, function(error, result) {
            count++;
            if (!error) {
                if (count >= maxLength)
                    next(null, result);
            }
            else {
                console.log("error in member save:" + error);
                next(error);
            }
        }); 
    });
    
}

/***                                                                         ****
****                            Just Relation                                ****
****                                                                         ***/

module.exports.GetRelations = function (member, relationKey, next) {

    var query = new azure.TableQuery();
    query.where('PartitionKey eq ? and relation eq ?', member, relationKey);
    tableService.queryEntities('friends', query, null, function (error, relations) {
        if (!error) {
            RemoveEntityGenList(relations.entries);
            return next(null, relations.entries);
        }
        else {
            return next(error);
        }
    });
}

module.exports.DeleteRelation = function (name, target, next) {
	var entity = {
		PartitionKey: entGen.String(name),
		RowKey: entGen.String(target)
	};

	// 데이터베이스에 entity를 추가합니다.
	tableService.deleteEntity('friends', entity, function(error, result, res) {
		if (!error) {
            next(null, result);
		}
        else 
            next(error);
	});	
}

module.exports.AddRelations = function (name, target, relation, next) {
    if (target == null || target.length == 0)
        next(null, 'done');

    var batch = new azure.TableBatch();
    target.forEach (function (item) {
        var entity = {
            PartitionKey: entGen.String(name),
            RowKey: entGen.String(item),
            relation: entGen.String(relation)
        };
        batch.insertOrMergeEntity(entity,{echoContent: true});
    });
    tableService.executeBatch('friends', batch, function (error, result, response) {
        if(!error) {
            next(null, result);
        }
        else
            next(error, null);
    });

}

module.exports.UpdateRelation = function (key, name, relation, list, next) {
    var entity = {
        PartitionKey: key,
        RowKey: name
    }
    relation = (relation == 'family') ? 'families' : relation + 's'; 
    entity[relation] = JSON.stringify(list);
    SetEntityGen(entity);

    tableService.insertOrMergeEntity('sbpcc',entity, function(error, result) {
        if (!error) {
            next(null, result);
        }
        else 
            next(error);
    });
}

module.exports.SetRelation = function (key, member, target, relationKey, setting, next) {

    exports.GetRelations(member, relationKey, function(error, relations) {
        if (!error) {
            var maxFunctionCount = 1;
            var count = 0;
            var relList = [];
            var errorCount = 0;
            relations.forEach (function(relItem) {
                relList.push(relItem.RowKey);
            });
            if (setting == "delete") {
                var index = relList.indexOf(target);
                if (index >= 0) {
                    relList.splice(index,1);
                    maxFunctionCount++;
                    exports.DeleteRelation(member, target, function (error, result) {
                        if (!error) {
                            count++;
                            if (count >= maxFunctionCount)
                                next (null, relList);
                        }
                        else {
                            count++;
                            errorCount++;
                            console.log("error:" + error);
                            if (errorCount >= maxFunctionCount)
                                next(error);
                            else if (count >= maxFunctionCount)
                                next (null, relList);
                        }
                    });

                }
            }
            else if (setting == "insert") {
                target.forEach(function (item) {
                    if (relList.indexOf(item) < 0) {
                        relList.push(item);
                    }
                });
                maxFunctionCount++;
                exports.AddRelations(member, target, relationKey, function (error, result) {
                    if (!error) {
                        count++;
                        if (count >= maxFunctionCount)
                            next (null, relList);
                    }
                    else {
                        count++;
                        errorCount++;
                        console.log("error:" + error);
                        if (errorCount >= maxFunctionCount)
                            next(error);
                        else if (count >= maxFunctionCount)
                            next (null, relList);
                    }
                });
            }
            exports.UpdateRelation(key, member, relationKey, relList, function (error, result) {
                if (!error) {
                    count++;
                    if (count >= maxFunctionCount)
                        next (null, relList);
                }
                else  {
                    count++;
                    errorCount++;
                    console.log("error:" + error);
                    if (errorCount >= maxFunctionCount)
                        next(error);
                    else if (count >= maxFunctionCount)
                        next (null, relList);
                }
            });
        }
    });
}


/***                                                                         ****
****                            Just User                                    ****
****                                                                         ***/

module.exports.GetUsersWithQuery = function (queryString, next, top) {

    var query = new azure.TableQuery();
    if (top != null && top != '' && top != 0)
        query.top(1);
    if (queryString != null  && queryString != '')
        query.where(queryString);
    tableService.queryEntities('users', query, null, function (error, result) {
        if (!error) {
            RemoveEntityGenList(result.entries);    
            return next(null, result.entries);
        }
        else 
            return next(error, null);
    });  
}


module.exports.FindUser = function (provider, id, next) {
    var query = new azure.TableQuery()
    .top(1)
    .where('PartitionKey eq ? and RowKey eq ?', provider.toString(), id.toString());
    tableService.queryEntities('users', query, null, function (error, result) {
        if (!error) {
            RemoveEntityGenList(result.entries);
            if (result.entries[0])
                return next(null, result.entries[0]);
            else
                return next("Not found", null);
        }
        else 
            return next(error, null);
    });  
}

module.exports.SaveUser = function (entity, next) {
    SetEntityGen(entity);
    
	// 데이터베이스에 entity를 추가합니다.
	tableService.insertOrMergeEntity('users', entity, function(error, result) {
		if (!error) {
            next (null, result);
		}
		else {
            next (error, null);
		}
	});
    
}

module.exports.SaveUsers = function (entities, next) {
    var maxCount = 0;
    var count = 0;
    entities.forEach(function(item) {
        maxCount++;
        exports.SaveUser(item, function (error, result) {
            if (!error) {
                count++;
                if (count >= maxCount)
                    next(null, "all done");
            }
            else 
                next(item.name + " : " + error);
        });
    });
}

/***                                                                         ****
****                            Just Auth                                    ****
****                                                                         ***/

module.exports.SetAuth = function (targets, relationKey, setting, next) {

    exports.GetMembersWithNames(targets, function(error, members) {
        if (!error) {
            var maxFunctionCount = 0;
            var count = 0;
            var relList = [];
            var errorCount = 0;
            members.forEach (function(member) {
                maxFunctionCount++;
                if (setting == "delete")
                    member.auth = '';
                if (setting == "insert")
                    member.auth = relationKey;
                exports.SaveMember(member, function(error, result) {
                    if (!error) {
                        count++;
                        if (count >= maxFunctionCount)
                            next(null, 'all done');
                    }
                    else 
                        next(error);
                });
            });
        }
        else 
            next(error);
    });
}

