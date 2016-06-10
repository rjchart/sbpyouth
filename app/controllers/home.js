var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');
var sbp_time = require('../models/sbp-time');
var sbp_branch = require('../models/sbp-branch');
var sbp_member = require('../models/sbp-member');
var sbp_data = require('../models/sbp-data');
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
jsFunctionString += "\n" + jsFunctionString2 + "\n" + jsFunctionString3 + "\n" + jsFunctionString4;
fs.writeFileSync("javascript/templates.js", jsFunctionString);

module.exports = function (app) {
  app.use('/', router);
};


router.get('/', function (req, res, next) {
    
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
    var tableService = azure.createTableService(storageAccount, accessKey);
    
    var year = req.query.year;
	var attendSet = req.query['attendValue'];
    if (year==null)
        year = sbp_time.getYear();
	if (!attendSet)
		attendSet = 0;  
    
    var getTable = sbp_member.GetBranchMembers(year, function (error, result) {
        if (!error) {
            result.year = year;
            res.render('branch', result);        
        }
        else 
            console.log(error);
    }, attendSet);
  
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

router.get('/friends', function (req, res, next) {
    // var year = req.query.year;
    var year = sbp_time.getYear();
	var attendSet = req.query.attendValue;
    if (!attendSet)
        attendSet = 0;
    
    sbp_member.GetMembersWithYear(year, function (error, memberList) {
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

