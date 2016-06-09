var azure = require('azure-storage');
var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth';
var util = require('util');
var sbp_time = require('../models/sbp-time');

var tableService = azure.createTableService(storageAccount, accessKey);
var entGen = azure.TableUtilities.entityGenerator;

function RemoveEntityGen (entity) {
    for (var key in entity) {
        var valueOfKey = entity[key];
        if (typeof valueOfKey == "object")
            entity[key] = valueOfKey._;
    }
    
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

module.exports.GetMemberWithName = function (name, next) {
    var query = new azure.TableQuery()
    .top(1)
    .where('RowKey eq ?', name.toString());

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('members', query, null, function entitiesQueried(error, result) {
        if (!error) {
            var testString = JSON.stringify(result.entries);
            var entries = JSON.parse(testString);
            // response.send(entries[0].RowKey._);
            var year = parseInt((entries[0].birthYear != null) ? entries[0].birthYear._ : 0);
            year += 1900; 
            var month = FormatNumberLength((entries[0].birthMonth != null) ? entries[0].birthMonth._ : 0, 2);
            var day = FormatNumberLength((entries[0].birthDay != null) ? entries[0].birthDay._ : 0, 2);
            
            var getData = {};
            getData.birthYear = year;
            getData.birthMonth = month;
            getData.birthDay = day
            getData.name = (entries[0].RowKey != null) ? entries[0].RowKey._ : null;
            getData.gender = (entries[0].gender != null) ? entries[0].gender._ : null;
            getData.phone = (entries[0].phone != null) ? entries[0].phone._ : null;
            getData.attendDesc = (entries[0].attendDesc != null) ? entries[0].attendDesc._ : null;
            getData.tension = (entries[0].tension != null) ? entries[0].tension._ : null;
            getData.tensionString = TensionToString(getData.tension); 
            getData.year = (entries[0].PartitionKey != null) ? entries[0].PartitionKey._ : null;
            getData.part = (entries[0].part != null) ? entries[0].part._ : null;
            getData.photo = (entries[0].photo != null) ? entries[0].photo._ : null;
            return next(null, getData);
        }    
    });
}

module.exports.GetMemberAndLogWithName = function (name, next) {
    var query = new azure.TableQuery()
    .top(1)
    .where('RowKey eq ?', name.toString());

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('members', query, null, function entitiesQueried(error, result) {
        if (!error) {
            
            var testString = JSON.stringify(result.entries);
            var entries = JSON.parse(testString);
            // response.send(entries[0].RowKey._);
            var year = parseInt((entries[0].birthYear != null) ? entries[0].birthYear._ : 0);
            year += 1900; 
            var month = FormatNumberLength((entries[0].birthMonth != null) ? entries[0].birthMonth._ : 0, 2);
            var day = FormatNumberLength((entries[0].birthDay != null) ? entries[0].birthDay._ : 0, 2);
            
            var getData = {};
            getData.birthYear = year;
            getData.birthMonth = month;
            getData.birthDay = day
            getData.name = (entries[0].RowKey != null) ? entries[0].RowKey._ : null;
            getData.gender = (entries[0].gender != null) ? entries[0].gender._ : null;
            getData.phone = (entries[0].phone != null) ? entries[0].phone._ : null;
            getData.attendDesc = (entries[0].attendDesc != null) ? entries[0].attendDesc._ : null;
            getData.tension = (entries[0].tension != null) ? entries[0].tension._ : null;
            getData.tensionString = TensionToString(getData.tension); 
            getData.year = (entries[0].PartitionKey != null) ? entries[0].PartitionKey._ : null;
            getData.part = (entries[0].part != null) ? entries[0].part._ : null;
            getData.photo = (entries[0].photo != null) ? entries[0].photo._ : null;
            
            var getYear = sbp_time.getYear();
            var logQeury = new azure.TableQuery()
            .top(10)
            .where('RowKey eq ?', name.toString());
            tableService.queryEntities('branchlog', logQeury, null, function (error, log) {
                if (!error) {
                    // var logString = JSON.stringify(log.entries);
                    // var logResult = JSON.parse(logString);
                    for (var logKey in log.entries) {
                        var entry = log.entries[logKey];
                        RemoveEntityGen(entry);
                        if (entry.PartitionKey == getYear) {
                            for (var key in entry) {
                                if (key == 'PartitionKey' || key == 'RowKey' || key == 'birthYear' || key == 'attendDesc')
                                    continue;
                                getData[key] = entry[key];   
                            }
                        }
                    }
                    getData.log = log.entries
                    return next(null, getData);        
                }
            });
            
        }    
    });
}

module.exports.getMembersWithYear = function (year, next) {
    if (!year || year == 0 || year == "")
        year = sbp_time.getYear();
    // 브랜치에서 BS의 데이터를 가져오는 쿼리 생성.
    var memberQuery = new azure.TableQuery();

    // 데이터베이스 쿼리를 실행.
    tableService.queryEntities('members', memberQuery, null, function entitiesQueried(error, result) {
        if (!error) {
            // 가져온 데이터를 읽어들일 수 있도록 수정한다.
            var memberListString = JSON.stringify(result.entries);
            var memberList = JSON.parse(memberListString);

			var yearValue = parseFloat(year.toString().replace('-2','.5'));
            // 브랜치에서 BS의 데이터를 가져오는 쿼리 생성.
            var branchQuery = new azure.TableQuery()
            .where('PartitionKey eq ?', yearValue.toString());

            // 데이터베이스 쿼리를 실행.
            tableService.queryEntities('branchlog', branchQuery, null, function entitiesQueried(error, result) {
                if (!error) {
                    // 가져온 데이터를 읽어들일 수 있도록 수정한다.
                    var blTestString = JSON.stringify(result.entries);
                    var blList = JSON.parse(blTestString);
                    memberList.forEach(function (item, index) {
                        if (item.birthYear._ == "87")
                            console.log(item.RowKey._);
                        item.branch = {"_": "없음"};
                        item.attend = {"_": 0};
                    });

                    memberList = CombineList(blList, memberList)[1];
                    memberList.forEach(function (item, index) {
                        item.birthMonth = {"_": FormatNumberLength((item.birthMonth != null) ? item.birthMonth._ : 0, 2)};
                        item.birthDay = {"_": FormatNumberLength((item.birthDay != null) ? item.birthDay._ : 0, 2)};
                        var getTension = (item.tension != null) ? item.tension._ : null;
                        item.tensionString = {"_": TensionToString(getTension)};
                        var getAttend = (item.attend != null) ? item.attend._ : null;
                        item.attendString = {"_": exports.AttendToString(getAttend)};
                    });
                    return next(memberList);
                }
            });
        }
    });
}

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

