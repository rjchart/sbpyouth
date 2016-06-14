var azure = require('azure-storage');
var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth'; 
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
    var cur_year = new Date().getYear();
    if (cur_year - year >= 26)
        data.part = '청2부';
    else 
        data.part = '청1부';
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
    .where('RowKey eq ?', name.toString());

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('members', query, null, function entitiesQueried(error, result) {
        if (!error) {
            var getData = result.entries[0];
            RemoveEntityGen(getData);
            SetBirthFormat(getData);
            getData.tensionString = TensionToString(getData.tension);
            SetFriendsWithObject(getData); 
            
            return next(null, getData);
        }    
    });
}

module.exports.GetMemberWithQuery = function (queryString, next, top) {
    var query = new azure.TableQuery();
    if (top != null && top != '' && top != 0)
        query.top(top)
    if (queryString != null && queryString != '')
        query.where(queryString);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('members', query, null, function entitiesQueried(error, result) {
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
    exports.GetMembersAndLogWithQueryAndYear(null, year, next);
}

module.exports.GetMembersAndLogWithQueryAndYear = function (query, year, next, top) {
    var memberQuery = new azure.TableQuery();
    if (query != null && query != '')
        memberQuery.where(query);
    if (top != null && top == 0)
        memberQuery.top(top);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('members', memberQuery, null, function (error, member) {
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

module.exports.MemberSave = function(fields) {
	var response = fields['res'];
	var tableService = fields['table'];

	var urlString = fields['urlString'];
	console.log("member save: " + urlString);
	var maxCount = 2;
	var count = 0;
    var year = parseInt(fields['birthYear']);
    if (year > 1900)
        year -= 1900;
    var curYear = new Date().getYear();
	var age = curYear - year + 1;
    var ttore = year;
    var month = parseInt(fields['birthMonth']);
    if (year <= 102 && month < 3 && month != 0)
        ttore--;
	var entity = {
		PartitionKey: entGen.String(fields['PartitionKey']),
		RowKey: entGen.String(fields['RowKey']),
		gender: entGen.String(fields['gender']),
		phone: entGen.String(fields['phone']),
		birthYear: entGen.Int32(year),
		birthMonth: entGen.Int32(fields['birthMonth']),
		birthDay: entGen.Int32(fields['birthDay']),
		attendDesc: entGen.String(fields['attendDesc']),
		tension: entGen.Int32(fields['tension']),
        mail: entGen.String(fields['mail']),
        locate: entGen.String(fields['locate'])
	};
	if (urlString) {
		entity.photo = entGen.String(urlString);
    }
    
    var saved = entity;
    
	// 데이터베이스에 entity를 추가합니다.
	tableService.insertOrMergeEntity('members', entity, function(error, result, res) {
		if (!error) {
			console.log("member done");
			count++;
			if (count >= maxCount)
				response.send({result:true,
                    field:saved});
		}
		else {
			count++;
			console.log("error in member save");
			if (count >= maxCount)
				response.send({result:true,
                    field:saved});
		}
	});

	var yearData = fields['year'].replace('-2','.5');
	var entity2 = {
		PartitionKey: entGen.String(fields['year']),
		RowKey: entGen.String(fields['RowKey']),
		branch: entGen.String(fields['branch']),
		birthYear: entGen.Int32(year),
		age: entGen.Int32(age),
		attend: entGen.Int32(fields['attend']),
		part: entGen.String(fields['part']),
		branchYear: entGen.String(yearData),
        charge: entGen.String(fields['charge']),
		attendDesc: entGen.String(fields['attendDesc']),
        service: entGen.String(fields['service'])
	};
    
    for (var key in entity2) {
        // saved[key] = {"_":, fields[key]};
        if (key == "PartitionKey")
            saved["year"] = entity2[key];
        else
            saved[key] = entity2[key];
    }
    saved["attendString"] = entGen.String(exports.AttendToString(fields['attend']));
    saved["tensionString"] = entGen.String(TensionToString(fields['tension']));
    if (fields["urlString"] != null)
        saved["photo"] = entGen.String(fields["urlString"]);
    else
        saved["photo"] = entGen.String("");
    
    RemoveEntityGen(saved);
	// 데이터베이스에 entity를 추가합니다.
	tableService.insertOrMergeEntity('branchlog', entity2, function(error, result) {
		if (!error) {
			console.log("branch done");
			count++;
			if (count >= maxCount)
				response.send({result:true,
                    field:saved});
		}
		else {
			count++;
			console.log("error in branchlog save");
			if (count >= maxCount)
				response.send({result:true,
                    field:saved});
		}
	});
}

module.exports.GetCurrentMemberWithGroup = function (group, next) {
    var getDate = new Date();
    var year = getDate.getFullYear().toString();
    
    exports.GetMemberWithGroup(year, group, next);
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
        else {
            console.log("error:" + error);
            next(error);
        }
            
    });
}

module.exports.SaveMember = function (member, next) {
    if (member.birthYear && member.birthYear > 1900)
        member.birthYear = member.birthYear - 1900; 
    SetEntityGen(member);

	tableService.insertOrMergeEntity('members', member, function(error, result) {
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
            exports.GetMemberWithQuery (queryString, function (error2, member) {
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
        tableService.insertOrMergeEntity('members', data, function(error, result) {
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
    var year = parseInt(data.PartitionKey);
    // var month = parseInt(data.month);
    if (year > 1900)
        year -= 1900;
    // if (102 > year && 3 > month)
    //     year--;
    data.PartitionKey = year; 
    SetEntityGen(data);
    tableService.deleteEntity('members', data, function(error, result) {
        if (!error) {
            next(null, result);
        }
        else {
            console.log("error in member delete:" + error);
            next(error);
        }
    });
}

module.exports.AddBranch = function (addData, next) {
    var maxLength = addData.length;
    var count = 0;
    addData.forEach(function(data, index) {
        exports.GetMemberWithName(data.RowKey, function (error, result) {
            if (!error) {
                data.age = data.PartitionKey - result.birthYear + 1;
                data.attend = result.attend;
                data.birthYear = result.birthYear - 1900;
                if (data.age >= 27)
                    data.part = "청2부";
                else     
                    data.part = "청1부";
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
                            next(null, result);
                    }
                    else {
                        console.log("error in member save:" + error);
                        next(error);
                    }
                }); 
            } 
            else {
                count++;
                console.log("error in branch save:" + error);
                next(error);
            }
        });

    });
    
}

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

    tableService.insertOrMergeEntity('members',entity, function(error, result) {
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
                                next (null, 'done');
                        }
                        else {
                            count++;
                            errorCount++;
                            console.log("error:" + error);
                            if (errorCount >= maxFunctionCount)
                                next(error);
                            else if (count >= maxFunctionCount)
                                next (null, 'done');
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
                            next (null, 'done');
                    }
                    else {
                        count++;
                        errorCount++;
                        console.log("error:" + error);
                        if (errorCount >= maxFunctionCount)
                            next(error);
                        else if (count >= maxFunctionCount)
                            next (null, 'done');
                    }
                });
            }
            exports.UpdateRelation(key, member, relationKey, relList, function (error, result) {
                if (!error) {
                    count++;
                    if (count >= maxFunctionCount)
                        next (null, 'done');
                }
                else  {
                    count++;
                    errorCount++;
                    console.log("error:" + error);
                    if (errorCount >= maxFunctionCount)
                        next(error);
                    else if (count >= maxFunctionCount)
                        next (null, 'done');
                }
            });
        }
    });
}