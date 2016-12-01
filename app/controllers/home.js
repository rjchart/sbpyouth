var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');
var sbp_time = require('../models/sbp-time');
var sbp_branch = require('../models/sbp-branch');
var sbp_member = require('../models/sbp-member');
var sbp_data = require('../models/sbp-data');
var pkginfo = require('../../package.json');
var azure = require('azure-storage');
var flowpipe = require('flowpipe');
var jade = require("jade");
var fs = require('fs');
var multiparty = require('multiparty');
var title = '신반포 중앙교회 청년부';

var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth';
var entGen = azure.TableUtilities.entityGenerator;

// Compile the template to a function string
var jsFunctionString = jade.compileFileClient('app/views/profile_template.jade', {name: "profile_template"});
var jsFunctionString2 = jade.compileFileClient('app/views/profile_edit.jade', {name: "profile_edit"});
var jsFunctionString3 = jade.compileFileClient('app/views/addMember_template.jade', {name: "addMember_template"});
var jsFunctionString4 = jade.compileFileClient('app/views/addMember_second.jade', {name: "addMember_second"});
var jsFunctionString5 = jade.compileFileClient('app/views/addPerson_template.jade', {name: "addPerson_template"});
var jsFunctionString6 = jade.compileFileClient('app/views/addPerson_second.jade', {name: "addPerson_second"});
var jsFunctionString7 = jade.compileFileClient('app/views/addBranch_template.jade', {name: "addBranch_template"});
var jsFunctionString8 = jade.compileFileClient('app/views/addBranch_second.jade', {name: "addBranch_second"});
var jsFunctionString9 = jade.compileFileClient('app/views/addNameBS_template.jade', {name: "addNameBS_template"});
var jsFunctionString10 = jade.compileFileClient('app/views/detailProfile_template.jade', {name: "detailProfile_template"});
jsFunctionString += "\n" + jsFunctionString2 + "\n" + jsFunctionString3 + "\n"
 + jsFunctionString4 + "\n" + jsFunctionString5 + "\n" + jsFunctionString6 + "\n" 
 + jsFunctionString7 + "\n" + jsFunctionString8 + "\n" + jsFunctionString9 + "\n" + jsFunctionString10;
fs.writeFileSync("javascript/templates.js", jsFunctionString);

module.exports = function (app) {
  app.use('/', router);
};

function CombineElements(one, two) {
    for (var key in two) {
        one[key] = two[key];
    }
}

router.get('/', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    sbp_member.GetCurrentMemberWithGroup('교회', function (error, result) {
        if (!error) {
            var chargeOrder = ['청년1부 목사', '청년2부 강도사'];
            var chargeDesc = [
                '청년부의 예배를 맡고 있으며 청1부의 전체적인 지도와 교육을 담당합니다.', 
                '청년부의 예배를 맡고 있으며 청2부의 전체적인 지도와 교육을 담당합니다.'
                ];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            user.order = chargeOrder;
            user.datas = inputData;
            user.chargeDesc = chargeDesc;
                  
            res.render('churchLeader', user);
        }
    });
});

router.get('/test', function (req, res, next) {
    res.render('layouttest', {});
});

router.get('/deacons', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    
    sbp_member.GetCurrentMemberWithGroup('부장 집사', function (error, result) {
        if (!error) {
            var chargeOrder = ['청2 부장 집사', '청1 부장 집사'];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            user.order = chargeOrder;
            user.datas = inputData;
            res.render('deacons', user);
        }
    });
});

router.get('/executives', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    
    sbp_member.GetCurrentMemberWithGroup('임원', function (error, result) {
        if (!error) {
            var chargeOrder = ['청년부 회장', '청년2부 총무', '청년1부 총무', '청년2부 부총무', '청년1부 부총무', '청년2부 회계', '청년1부 회계', '청년부 서기'];
            var chargeDesc = [
                '청년부의 모든 일에 참여하며 지시를 내리고 참여를 북돋우는 역할을 한다. 매주 (혹은 격주) 토요일 회의를 주도하고 청년부의 일에 항상 앞장섭니다.', 
                '청년부 회장의 일을 도우며 매주 토요일 대부분의 청년부 행사를 함께 계획하고 실행하며 청년2부의 행사에 주로 참여합니다.', 
                '청년부 회장의 일을 도우며 매주 토요일 대부분의 청년부 행사를 함께 계획하고 실행하며 청년1부의 행사에 주로 참여합니다.',
                '청년2부 총무의 일을 도우며 청년2부의 행사에 주로 참여합니다.',  
                '청년1부 총무의 일을 도우며 청년1부의 행사에 주로 참여합니다.', 
                '청년2부의 회계를 담당하며 청년2부에서 사용되는 금액의 계산과 영수증 처리를 담당합니다.',
                '청년1부의 회계를 담당하며 청년1부에서 사용되는 금액의 계산과 영수증 처리를 담당합니다.',
                '매주 토요일 청년부 회의의 내용과 그외 중요한 회의 내용을 기록하며 그 내용을 임원끼리 공유합니다.'
                ];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            
            user.order = chargeOrder;
            user.datas = inputData;
            user.chargeDesc = chargeDesc;
            res.render('executives', user);
        }
    });
});

router.get('/teamleader', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    
    sbp_member.GetCurrentMemberWithGroup('팀장', function (error, result) {
        if (!error) {
            var chargeOrder = ['찬양 팀장', '사역 팀장', '새가족 팀장', '다과 팀장'];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            
            user.order = chargeOrder;
            user.datas = inputData;
            res.render('teamLeaders', user);
        }
    });
});

router.get('/branchleader', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    
    sbp_member.GetDetailCurrentMemberWithGroup('BS', function (error, result) {
        if (!error) {
            var chargeOrder = [];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
                if (chargeOrder.indexOf(value.branch) < 0) 
                    chargeOrder.push(value.branch);
            }

            user.order = chargeOrder;
            user.datas = inputData;
            res.render('branchLeaders', user);
        }
    });
});

router.get('/services', function (req, res, next) {
    res.redirect('/services/0');
});

router.get('/services/:id', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    var year = sbp_time.getYear();
    var service = req.params.id;
    if (!service || service == '' || service == 0)
        service = '유치부';

    var queryString = "service eq '" + service + "'";
    var header = '';
    if (service == '영아부')
        header = '신반포 중앙교회 영아부는 0~4세의 아이들을 돌보며 가르치는 부서입니다.';
    else if (service == '유치부')
        header = '신반포 중앙교회 유치부는 0~4세의 아이들을 돌보며 가르치는 부서입니다.';
    else if (service == '유년부')
        header = '신반포 중앙교회 유년부는 초등학교 1학년부터 3학년까지의 아이들과 예배하며 가르치는 부서입니다.';
    else if (service == '초등부')
        header = '신반포 중앙교회 초등부는 초등학교 4학년부터 6학년까지의 아이들과 예배하며 가르치는 부서입니다.';
    else if (service == '중고등부')
        header = '신반포 중앙교회 중고등부는 중학생과 고등학생들과 예배하며 가르치는 부서입니다.';
    else if (service == '글로리아 찬양대')
        header = '글로리아 찬양대는 신반포 중앙교회 2부 예배의 찬양을 맡고 있는 부서입니다.';
    else if (service == '할렐루야 찬양대')
        header = '할렐루야 찬양대는 신반포 중앙교회 3부 예배의 찬양을 맡고 있는 부서입니다.';

    sbp_member.GetMembersAndLogWithQueryAndYear(queryString, year, function (error, result) {
        if (!error) {
            user.datas = result;
            user.service = service;
            user.header = header;
            res.render('homeServices', user);

        }
        else 
            res.status(500).send(service + ' 관련 데이터를 받아오는데 실패하였습니다.');
    });
    
});

router.get('/branch', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var year = req.query.year;
	var attendSet = req.query['attendValue'];
	if (!attendSet)
		attendSet = 0;
          
    var getTable = sbp_member.GetUnionBranchMembers(year, function (error, result) {
        if (!error) {
            var branchs = [];
            result.bsList.forEach (function (item) {
                branchs.push(item.branch);
            });
            result.branchTag = JSON.stringify(branchs);
            result.title = title;
            
            CombineElements(user, result)
            res.render('branchUnionTotal', user);
        }
        else 
            console.log(error);
    }, attendSet);



  
});

router.get('/branch_segment/:id', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    
    var getID = req.params.id;
    var year = req.query.year;
    var branchTag = req.query.tag;
    var branchs = JSON.parse(branchTag);
    if (year == null || year == '')
        year = sbp_time.getYear();  

    var getTable = sbp_member.GetBranchMembersWithBranch(year, getID, function (error, result) {
        if (!error) {
            var input = {
                title: title,
                datas: result,
                year: year,
                branchs: branchs,
                branchTag: branchTag,
                branch: getID
            }

            CombineElements(user, input)
            res.render('branchSeperate', user);        
        }
        else 
            console.log(error);
    });
  
});

router.post('/branch_profile', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    req.on('data', function(chunk) {
        var getget = req;
        var inputData = JSON.parse(chunk);
        
        sbp_member.GetMemberWithName(inputData.name, function (error, getData) {
            if (!error) {
                getData.name = inputData.name;
                getData.branch = inputData.branch; // req.body.branch
                getData.attend = inputData.attend; // req.body.attend
                getData.attendString = sbp_member.AttendToString(getData.attend);
                getData.charge = inputData.charge;
                getData.year = req.body.year;
                getData.title = title;
                if (user.auth && user.auth != '') {
                    if (user.auth == "manager" || user.auth == "executive" || user.auth == "developer" || user.branch == getData.branch)
                        getData.mustShow = true;
                }

                res.render('profile_template', getData);
            }
        });  
    });
});

router.post('/friend_profile', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    // var getData = {};
    // var getget = req;
    // var inputData = JSON.parse(chunk);
    
    sbp_member.GetMemberWithName(req.body.name, function (error, getData) {
        if (!error) {
            getData.name = req.body.name;
            getData.branch = req.body.branch; // req.body.branch
            getData.attend = req.body.attend; // req.body.attend
            getData.attendString = sbp_member.AttendToString(req.body.attend);
            getData.charge = req.body.charge;
            getData.year = req.body.year;
            getData.title = title;
            if (user.auth && user.auth != '') {
                if (user.auth == "manager" || user.auth == "executive" || user.auth == "developer" || user.branch == getData.branch)
                    getData.mustShow = true;
            }
            
            res.send(getData);
        }
    });  
});

router.get('/friends', function (req, res, next) {
    var query;
    query = req.query.query;
    var user = sbp_data.CheckLogin(req);
    // var year = req.query.year;
    var year = sbp_time.getYear();
	var attendSet = req.query.attendValue;
    if (!attendSet)
        attendSet = 0;
    
    sbp_member.GetMembersAndLogWithYear(year, function (error, memberList) {
        if (!error) {
            var memberList2 = [];
            memberList.forEach(function (item, index) {
                var isOut = false;
                if (item.attendDesc == "결혼" || item.attendDesc == "제외" || item.attendDesc == "장기결석")
                    isOut = true;
                if (item.attend >= attendSet && !isOut) {
                    if (query) {
                        if (item.RowKey.includes(query))
                            memberList2.push(item);
                        if (item.PartitionKey == query)
                            memberList2.push(item);
                        if (item.birthYear.includes(query))
                            memberList2.push(item);
                        if (item.birthMonth.toString().includes(query))
                            memberList2.push(item);
                        if (item.birthDay.toString().includes(query))
                            memberList2.push(item);
                        if (item.branch == query)
                            memberList2.push(item);
                        if (item.gender == query)
                            memberList2.push(item);
                        if (item.attendString.includes(query))
                            memberList2.push(item);
                        if (item.part == query)
                            memberList2.push(item);
                    }
                    else 
                        memberList2.push(item);
                }   
            });

            // CombineElements(user, input)
            user.memberList = memberList2;
            user.year = year;
            res.render('friendSearch', user);
            // 정리된 정보를 건내고 ejs 랜더링 하여 보여줌.
            // res.render('friends', 
            //     {	
            //         title: title,
            //         memberList: memberList2,
            //         year: year
            //     }
            // );
        }
        else 
            res.send('error: cannot find friends list: ' + error);
    });
});

// router.post('/profile_edit/:id', function (req, res, next) {
// 	var id = req.params.id;

// 	var tableService = azure.createTableService(storageAccount, accessKey);
// 	var blobService = azure.createBlobService(storageAccount, accessKey);
// 	var form = new multiparty.Form();
// 	var checkMax = 1;
// 	var checkCount = 0;

// 	var fields = [];
// 	fields['res'] = res;
// 	fields['table'] = tableService;
    
//     form.on('part', function(part) {
// 	    if (!part.filename) {
// 	    	// console.log("not file:" + JSON.stringify(part));
// 			console.log('none');
// 	    }
// 	    else {
// 			var filename = id + new Date().toISOString() + ".jpg";
// 			var size = part.byteCount;
// 	    	// console.log("file:" + JSON.stringify(part));
// 			var size2 = part.byteCount - part.byteOffset;
// 			var name = filename;
// 			var container = 'imgcontainer';

// 	    	console.log("part:" + filename + ", size:" + size + ", size2:" + size2);
// 			var urlString = "https://sbpccyouth.blob.core.windows.net/" + container + "/" + filename;
// 			fields['urlString'] = urlString;
// 			checkMax++;

// 			blobService.createBlockBlobFromStream(container, filename, part, size, function(error) {
// 				if (!error) {
// 					console.log("photo upload ok");
// 					// res.send({result:true})
// 				}
// 				else 
// 					console.log(error);

// 				checkCount++;
// 				if (checkCount >= checkMax)
// 					sbp_member.MemberSave(fields);
// 			});
// 			return;
// 	    }
// 	});

// 	// Close emitted after form parsed 
// 	form.on('close', function() {
// 		console.log('Upload completed!');

// 		checkCount++;
// 		if (checkCount >= checkMax)
// 			sbp_member.MemberSave(fields);
// 	});

//     form.on('field', function (field, value) {
//         console.log(field);
//         console.log(value);
//         fields[field] = value;
//     });

// 	form.parse(req);

// });

router.post('/saveProfile/:id', function (req, res, next) {
	var id = req.params.id;
    
    sbp_data.MultipartyFunction(req, id, function (error, result) {
        if (!error) {

            sbp_member.SaveMemberAndLog(result, function (error, result) {
                if (!error) {
                    res.send( {
                        field: result
                    });
                }
                else 
                    next(error);
            });
        }
        else 
            next(error);
    });
});

function ChargeGroupListInput(group, year, item) {
    if (!group[year.toString()])
        group[year.toString()] = [];
    else 
        group[year.toString()].push(item);
}

router.post('/addCharge', function (req, res, next) {
    var add_name = req.body.add_name;
    var add_chargeName = req.body.add_chargeName;
    var add_chargeGroup = req.body.add_chargeGroup;
    var add_chargeYear = req.body.add_chargeYear;

    // var serviceList = {'영아부', '유치부', '유년부', '초등부', '중고등부', '글로리아 찬양대', '할렐루야 찬양대'};
    // var baby = {};
    // var babyhood = {};
    // var childhood = {};
    // var elemtary = {};
    // var middlehight = {};
    // var gloria = {};
    // var halleluja = {};

    var addData = [];
    for (i = 0; i < add_name.length; i++) {
        var tmp = {};
        if (add_name[i] == null || add_name[i] == '')
            continue;
        // var serviceIndex = serviceList.indexOf(add_chargeGroup[i]);
        // if (serviceIndex >= 0 && serviceIndex < serviceList.length) {
        //     switch (serviceIndex) {
        //         case 0:
        //             ChargeGroupListInput(baby,add_chargeYear[i], add_chargeName[i]);
        //             break;
        //         case 1:
        //             ChargeGroupListInput(babyhood,add_chargeYear[i], add_chargeName[i]);
        //             break;
        //         case 2:
        //             ChargeGroupListInput(childhood,add_chargeYear[i], add_chargeName[i]);
        //             break;
        //         case 3:
        //             ChargeGroupListInput(elemtary,add_chargeYear[i], add_chargeName[i]);
        //             break;
        //         case 4:
        //             ChargeGroupListInput(middlehight,add_chargeYear[i], add_chargeName[i]);
        //             break;
        //         case 5:
        //             ChargeGroupListInput(gloria,add_chargeYear[i], add_chargeName[i]);
        //             break;
        //         case 6:
        //             ChargeGroupListInput(halleluja,add_chargeYear[i], add_chargeName[i]);
        //             break;
            
        //         default:
        //             break;
        //     }
        //     continue;
        // }
        tmp.name = add_name[i];
        tmp.chargeName = add_chargeName[i];
        tmp.chargeGroup = add_chargeGroup[i];
        tmp.chargeYear = add_chargeYear[i];
        addData.push(tmp);
    }
    
    sbp_data.AddData(addData, function (error, result) {
        if (!error) {
            res.send("ok");
        }
    });
    
});


router.post('/addMember', function (req, res, next) {
    var keys = ['name', 'gender', 'phone', 'birthYear', 'birthMonth', 'birthDay', 'tension', 'attend'];
    var body = req.body;
    
    var addData = [];
    for (k = 0; k < body['add_name'].length; k++) {
        var tmp = {};
        if (body['add_name'][k] == null || body['add_name'][k] == '')
            continue;
            
        keys.forEach (function(key, index) {
            var addkey = "add_" + key;
            tmp[key] = body[addkey][k];
            var year = parseInt(tmp.birthYear);
            if (year > 1900)
                year -= 1900;
            var partitionKey = year;
            if (parseInt(tmp.birthMonth) < 3)
                partitionKey--;
            tmp.PartitionKey = partitionKey;
            tmp.RowKey = tmp.name; 
        }, this);
        addData.push(tmp);
    }
    
    sbp_member.AddMember(addData, function (error, result) {
        if (!error) {
            res.send("ok");
        }
    });
    
});

router.post('/removeMember', function (req, res) {
    
    sbp_member.RemoveMember(req.body, function (error, result) {
        if (!error) {
            var data = {
                result:true
            }
            res.send(data);
        }
    });
    
});

router.post('/addBranch', function (req, res, next) {
    var keys = ['name', 'year', 'branch', 'attendDesc'];
    var body = req.body;
    
    var addData = [];
    for (k = 0; k < body['add_name'].length; k++) {
        var tmp = {};
        if (body['add_name'][k] == null || body['add_name'][k] == '')
            continue;
            
        keys.forEach (function(key, index) {
            if (key != 'year' && key != 'name') {
                var addkey = "add_" + key;
                tmp[key] = body[addkey][k];   
            }
        }, this);
        tmp.PartitionKey = body.add_year[k];
        tmp.RowKey = body.add_name[k];
        tmp.branchYear = body.add_year[k].toString().replace('-2','.5');
        
        addData.push(tmp);
    }
    
    sbp_member.AddBranch(addData, function (error, result) {
        if (!error) {
            var data = {
                result:result
            }
            res.send(data);
        }
        else 
            res.status(500).send("" + error);
    });
    
});

router.post('/makeBranch', function (req, res, next) {
    var bsList = req.body['make_nameBS'];
    sbp_member.GetMembersAndLogWithYear(null, function (error, members) {
        if (!error) {
            // index: 1 -- 간단히 브랜치원이 원하는 BS 싫어하지 않는 BS 정도를 결정하고 나머지 랜덤. 
            // index: 2 -- 브랜치의 밸런스를 맞추고 팀원들의 행복도를 통해 최적의 브랜치 편성
            var newList = sbp_branch.MakeNewBranch(members, bsList, 3);
            // newList.year = '2016';
            newList.year = 'temp';
            console.log("done");
            res.render('branchTemp', newList);
        }    
    });
});

router.post('/saveTempBranch', function (req, res, next) {
    // var bsList = req.body['make_nameBS'];
    // sbp_member.GetMembersAndLogWithYear(null, function (error, members) {
    //     if (!error) {
    //         // index: 1 -- 간단히 브랜치원이 원하는 BS 싫어하지 않는 BS 정도를 결정하고 나머지 랜덤. 
    //         // index: 2 -- 브랜치의 밸런스를 맞추고 팀원들의 행복도를 통해 최적의 브랜치 편성
    //         var newList = sbp_branch.MakeNewBranch(members, bsList, 2);
    //         // newList.year = '2016';
    //         newList.year = pkginfo['sbp-data'].year;
    //         console.log("done");
    //         res.render('branchTemp', newList);
    //     }    
    // });


    // req.body['m_name'].forEach(function (member, index) {
    //     if (member == "")
            
    // });
    var inputData = [];
    for (var i = 0; i < req.body.m_name.length; i++) {
        if (req.body.m_name[i] == "")
            continue;
        var entity = {
            PartitionKey: 'temp',
            RowKey: req.body.m_name[i],
            branch: req.body.m_branch[i],
            age: req.body.m_age[i],
            charge: req.body.m_charge[i],
            part: req.body.m_part[i],
            before: req.body.m_before[i],
            attend: req.body.m_attend[i]
        }
        inputData.push(entity);
    }
    sbp_member.SaveBranch(inputData, function (error, result) {
        if (!error) {
            res.redirect('branch?year=temp');
        }
        else {
            res.status(500).send("저장에 실패했습니다. Cannot save the branch data: " + error);
        }
    });

});


router.post('/delete/:id', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var id = req.params.id;
    var member = req.body.member;
    var target = req.body.target;
    var key = req.body.key;
    sbp_member.SetRelation(key, member, target, id, 'delete', function (error, result) {
        if (!error) {
            if (user.isLink && user.RowKey == member) {
                if (id == "family") id = families;
                else id += "s";
                user[id] = result;
                req.session.save(function(err) {
                    res.send(req.body);
                });
                // req.session.passport.user.link[id] = result;
            }
            else
                res.send(req.body);
        }
        else 
            console.log('error: ' + error);
    });
});

router.post('/insert/:id', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var id = req.params.id;
    var member = req.body.member;
    var targets = req.body.target;
    var key = req.body.key;
    var target = [];
    targets.forEach(function (item) {
        if (item && item != '')
            target.push(item);
    });
    req.body.target = target;
    if (target.length > 0) {
        sbp_member.SetRelation(key, member, target, id, 'insert', function (error, result) {
            if (!error) {
                if (user.isLink && user.RowKey == member) {
                    if (id == "family") id = families;
                    else id += "s";
                    user[id] = result;
                    req.session.save(function(err) {
                        res.send(req.body);
                    });
                    // req.session.passport.user.link[id] = result;
                }
                else
                    res.send(req.body);
            }
            else 
                console.log('error: ' + error);
        });
    }
});

router.get('/branchDetail', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var year = req.query.year;
	var attendSet = req.query['attendValue'];
	if (!attendSet)
		attendSet = 0;  
    
    var getTable = sbp_member.GetMembersAndLogWithYear(year, function (error, log) {
        if (!error) {
            var result = [];
            log.forEach (function (item) {
                if (item.branchYear == year)
                    result.push(item);
            });

            var getTable = sbp_branch.GetTable(result, attendSet);
            getTable.year = year;

            var branchs = [];
            getTable.bsList.forEach (function (item) {
                branchs.push(item.branch);
            });
            sbp_branch.SetBSListDetail(getTable.bsList);
            getTable.branchTag = JSON.stringify(branchs);
            getTable.title = title;
            
            
            CombineElements(user, getTable);
            res.render('branchTemp', user);
        }
        else 
            console.log(error);
    }, attendSet);
  
});