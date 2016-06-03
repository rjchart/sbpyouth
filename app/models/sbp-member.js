var azure = require('azure-storage');
var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth';
var util = require('util');
var sbp_time = require('../models/sbp-time');

var tableService = azure.createTableService(storageAccount, accessKey);

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
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

module.exports.getMemberWithName = function (name, next) {
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
            getData.year = (entries[0].PartitionKey != null) ? entries[0].PartitionKey._ : null;
            getData.photo = (entries[0].photo != null) ? entries[0].photo._ : null;
            return next(getData);
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
                        item.branch = {"_": "없음"};
                        item.attend = {"_": 0};
                    });

                    memberList = CombineList(blList, memberList)[1];
                    return next(memberList);
                }
            });
        }
    });
}

