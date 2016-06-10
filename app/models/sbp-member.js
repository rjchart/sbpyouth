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

function SetBirthFormat (data) {
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

/*-------------------------------Just Member -----------------------------------
-------------------------------------------------------------------------------*/

module.exports.GetMemberWithName = function (name, next) {
    var query = new azure.TableQuery()
    .top(1)
    .where('RowKey eq ?', name.toString());

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('members', query, null, function entitiesQueried(error, result) {
        if (!error) {
            var testString = JSON.stringify(result.entries);
            var entries = JSON.parse(testString);
            
            var getData = result.entries[0];
            RemoveEntityGen(getData);
            SetBirthFormat(getData);
            getData.tensionString = TensionToString(getData.tension); 
            
            return next(null, getData);
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
    var memberString = names.join(" or ");
    exports.GetMembersAndLogWithQueryAndYear(memberString, null, next);
}

module.exports.GetMembersWithYear = function (year, next) {
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
	var age = 2016 - fields['PartitionKey'];
	console.log("member save: " + urlString);
	var maxCount = 2;
	var count = 0;
    var year = parseInt(fields['PartitionKey']) - 1900;
    var ttore = year;
    if (parseInt(fields['birthMonth']) < 3)
        ttore--;
	var entity = {
		PartitionKey: entGen.String(ttore.toString()),
		RowKey: entGen.String(fields['RowKey']),
		gender: entGen.String(fields['gender']),
		phone: entGen.String(fields['phone']),
		birthYear: entGen.Int32(year),
		birthMonth: entGen.Int32(fields['birthMonth']),
		birthDay: entGen.Int32(fields['birthDay']),
		attendDesc: entGen.String(fields['attendDesc']),
		tension: entGen.Int32(fields['tension'])
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
		branchYear: entGen.String(yearData)
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
    if (fields["photo"] != null)
        saved["photo"] = entGen.String(fields["photo"]);
    else
        saved["photo"] = entGen.String("");

	// 데이터베이스에 entity를 추가합니다.
	tableService.mergeEntity('branchlog', entity2, function(error, result, res) {
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
                members.push("RowKey eq '" + data.data + "'");
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

/***                                                                         ****
****                            Just Branch Log                              ****
****                                                                         ***/

module.exports.GetBranchMembers = function (year, next, attendValue, branchName) {
    if (year == null || year == '' || year == 0)
        year = sbp_time.getYear();
    var query = new azure.TableQuery()
        .where("PartitionKey eq ?", year.toString());
    
    tableService.queryEntities('branchlog', query, null, function (error, log) {
        if (!error) {
            RemoveEntityGenList(log.entries);
            var getTable = sbp_branch.GetTable(log.entries, attendValue);
            // getData.log = log.entries
            return next(null, getTable);
        }
        else {
            return next(error);
        }
    });
}