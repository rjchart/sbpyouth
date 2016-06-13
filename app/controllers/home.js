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


router.get('/', function (req, res, next) {
    
    var tableService = azure.createTableService(storageAccount, accessKey);
    sbp_member.GetCurrentMemberWithGroup('교회', function (error, result) {
        if (!error) {
            var chargeOrder = ['청년부 목사', '청년부 전도사'];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            
            res.render('churchLeader', {
                title: '신반포 중앙교회 청년부',
                // articles: articles,
                order: chargeOrder,
                datas: inputData
            });
        }
    });
});

router.get('/deacons', function (req, res, next) {
    
    var tableService = azure.createTableService(storageAccount, accessKey);
    sbp_member.GetCurrentMemberWithGroup('부장 집사', function (error, result) {
        if (!error) {
            var chargeOrder = ['청2 부장 집사', '청1 부장 집사'];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            
            res.render('deacons', {
                title: '신반포 중앙교회 청년부',
                // articles: articles,
                order: chargeOrder,
                datas: inputData
            });
        }
    });
});

router.get('/executives', function (req, res, next) {
    
    // console.log("is Session: " + req.session.id);
    // var session_name;
    // if (req.user) {
    //     session_name = req.user.displayName;
    // }
    // console.log(req.user);
    
    var tableService = azure.createTableService(storageAccount, accessKey);
    sbp_member.GetCurrentMemberWithGroup('임원', function (error, result) {
        if (!error) {
            var chargeOrder = ['청년부 회장', '청년2부 총무', '청년1부 총무', '청년2부 부총무', '청년1부 부총무', '청년2부 회계', '청년1부 회계', '청년부 서기'];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            
            res.render('excutives', {
                title: '신반포 중앙교회 청년부',
                // articles: articles,
                order: chargeOrder,
                datas: inputData
            });
        }
    });
});

router.get('/teamleader', function (req, res, next) {
    
    var tableService = azure.createTableService(storageAccount, accessKey);
    sbp_member.GetCurrentMemberWithGroup('팀장', function (error, result) {
        if (!error) {
            var chargeOrder = ['찬양 팀장', '사역 팀장', '새가족 팀장', '다과 팀장'];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            
            res.render('teamLeaders', {
                title: '신반포 중앙교회 청년부',
                // articles: articles,
                order: chargeOrder,
                datas: inputData
            });
        }
    });
});

router.get('/branchleader', function (req, res, next) {
    
    var tableService = azure.createTableService(storageAccount, accessKey);
    sbp_member.GetCurrentMemberWithGroup('BS', function (error, result) {
        if (!error) {
            var chargeOrder = [];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
                if (chargeOrder.indexOf(value.branch) < 0) 
                    chargeOrder.push(value.branch);
            }
            
            res.render('branchLeaders', {
                title: '신반포 중앙교회 청년부',
                // articles: articles,
                order: chargeOrder,
                datas: inputData
            });
        }
    });
});

router.get('/branch', function (req, res, next) {
    var year = req.query.year;
	var attendSet = req.query['attendValue'];
	if (!attendSet)
		attendSet = 0;  
    
    var getTable = sbp_member.GetBranchMembers(year, function (error, result) {
        if (!error) {
            var branchs = [];
            result.bsList.forEach (function (item) {
                branchs.push(item.branch);
            });
            result.branchTag = JSON.stringify(branchs);
            res.render('branchTotal', result);
        }
        else 
            console.log(error);
    }, attendSet);
  
});

router.get('/branch_segment/:id', function (req, res, next) {
    var getID = req.params.id;
    var year = req.query.year;
    var branchTag = req.query.tag;
    var branchs = JSON.parse(branchTag);
    if (year == null || year == '')
        year = sbp_time.getYear();  
    
    var getTable = sbp_member.GetBranchMembersWithBranch(year, getID, function (error, result) {
        if (!error) {
            var input = {
                datas: result,
                year: year,
                branchs: branchs,
                branchTag: branchTag,
                branch: getID
            }
            res.render('branchSeperate', input);        
        }
        else 
            console.log(error);
    });
  
});

router.post('/branch_profile', function (req, res, next) {
    req.on('data', function(chunk) {
        var getget = req;
        var inputData = JSON.parse(chunk);
        
        sbp_member.GetMemberWithName(inputData.name, function (error, getData) {
            if (!error) {
                getData.name = inputData.name;
                getData.branch = inputData.branch; // req.body.branch
                getData.attend = inputData.attend; // req.body.attend
                getData.attendString = sbp_member.AttendToString(getData.attend);
                getData.year = req.body.year;
                res.render('profile_template', getData);
            }
        });  
    });
});

router.post('/friend_profile', function (req, res, next) {
    // var getData = {};
    // var getget = req;
    // var inputData = JSON.parse(chunk);
    
    sbp_member.GetMemberWithName(req.body.name, function (error, getData) {
        if (!error) {
            getData.name = req.body.name;
            getData.branch = req.body.branch; // req.body.branch
            getData.attend = req.body.attend; // req.body.attend
            getData.attendString = sbp_member.AttendToString(req.body.attend);
            getData.haters = getData.haters ? JSON.parse(getData.haters) : [];
            getData.hopers = getData.hopers ? JSON.parse(getData.hopers) : [];
            getData.friends = getData.friends ? JSON.parse(getData.friends) : [];
            getData.families = getData.families ? JSON.parse(getData.families) : [];
            getData.year = req.body.year;
            res.send(getData);
        }
    });  
});

router.get('/friends', function (req, res, next) {
    // var year = req.query.year;
    var year = sbp_time.getYear();
	var attendSet = req.query.attendValue;
    if (!attendSet)
        attendSet = 0;
    
    sbp_member.GetMembersAndLogWithYear(year, function (error, memberList) {
        if (!error) {
            var memberList2 = [];
            memberList.forEach(function (item, index) {
                if (item.attend >= attendSet)
                    memberList2.push(item);
            });
            
            // 정리된 정보를 건내고 ejs 랜더링 하여 보여줌.
            res.render('friends', 
                {	
                    memberList: memberList2,
                    year: year
                }
            );
        }
        else 
            res.send('error: cannot find friends list: ' + error);
    });
});

router.post('/profile_edit/:id', function (req, res, next) {
	var id = req.params.id;

	var tableService = azure.createTableService(storageAccount, accessKey);
	var blobService = azure.createBlobService(storageAccount, accessKey);
	var form = new multiparty.Form();
	var checkMax = 1;
	var checkCount = 0;

	var fields = [];
	fields['res'] = res;
	fields['table'] = tableService;
    
    form.on('part', function(part) {
	    if (!part.filename) {
	    	// console.log("not file:" + JSON.stringify(part));
			console.log('none');
	    }
	    else {
			var filename = id + new Date().toISOString() + ".jpg";
			var size = part.byteCount;
	    	// console.log("file:" + JSON.stringify(part));
			var size2 = part.byteCount - part.byteOffset;
			var name = filename;
			var container = 'imgcontainer';

	    	console.log("part:" + filename + ", size:" + size + ", size2:" + size2);
			var urlString = "https://sbpccyouth.blob.core.windows.net/" + container + "/" + filename;
			fields['urlString'] = urlString;
			checkMax++;

			blobService.createBlockBlobFromStream(container, filename, part, size, function(error) {
				if (!error) {
					console.log("photo upload ok");
					// res.send({result:true})
				}
				else 
					console.log(error);

				checkCount++;
				if (checkCount >= checkMax)
					sbp_member.MemberSave(fields);
			});
			return;
	    }
	});

	// Close emitted after form parsed 
	form.on('close', function() {
		console.log('Upload completed!');

		checkCount++;
		if (checkCount >= checkMax)
			sbp_member.MemberSave(fields);
	});

    form.on('field', function (field, value) {
        console.log(field);
        console.log(value);
        fields[field] = value;
    });

	form.parse(req);

});

router.post('/addCharge', function (req, res, next) {
    var add_name = req.body.add_name;
    var add_chargeName = req.body.add_chargeName;
    var add_chargeGroup = req.body.add_chargeGroup;
    var add_chargeYear = req.body.add_chargeYear;
    
    var addData = [];
    for (i = 0; i < add_name.length; i++) {
        var tmp = {};
        if (add_name[i] == null || add_name[i] == '')
            continue;
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
                result:true
            }
            res.send(data);
        }
    });
    
});

router.post('/makeBranch', function (req, res, next) {
    var bsList = req.body['make_nameBS'];
    sbp_member.GetMembersAndLogWithYear(null, function (error, members) {
        if (!error) {
            // index: 1 -- 간단히 브랜치원이 원하는 BS 싫어하지 않는 BS 정도를 결정하고 나머지 랜덤. 
            // index: 2 -- 브랜치의 밸런스를 맞추고 팀원들의 행복도를 통해 최적의 브랜치 편성
            var newList = sbp_branch.MakeNewBranch(members, bsList, 2);
            // newList.year = '2016';
            newList.year = pkginfo['sbp-data'].year;
            console.log("done");
            res.render('branchTemp', newList);
        }    
    });
    
    
    // for (i = 0; i < bsList.length; i++) {
    //     if (body['add_name'][i] == null || body['add_name'][i] == '')
    //         continue;
            
    //     keys.forEach (function(key, index) {
    //         if (key != 'year' && key != 'name') {
    //             var addkey = "add_" + key;
    //             tmp[key] = body[addkey][i];   
    //         }
    //     }, this);
    //     tmp.PartitionKey = body.add_year[i];
    //     tmp.RowKey = body.add_name[i];
    //     tmp.branchYear = body.add_year[i].toString().replace('-2','.5');
        
    //     addData.push(tmp);
    // }
    
    // sbp_member.AddBranch(addData, function (error, result) {
    //     if (!error) {
    //         var data = {
    //             result:true
    //         }
    //         res.send(data);
    //     }
    // });
    
});
