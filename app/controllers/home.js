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
  
    flowpipe.init( function(next) {
        var page = 1;
        next(null, page);
    })
    .pipe('getBranchMembers', function (next, page) {

        /*****
            Branch의 개수 만큼 데이터를 가져오기 위해서 임원 중 BS 데이터를 가져온다.
        *****/
        // 브랜치에서 BS의 데이터를 가져오는 쿼리 생성.
        var branchQuery = new azure.TableQuery()
        .where('PartitionKey eq ?', year.toString());

        // 데이터베이스 쿼리를 실행.
        tableService.queryEntities('branchlog', branchQuery, null, function entitiesQueried(error, result) {
            if (!error) {
                next(null, result.entries, page);
            }
            else {
                console.log("err: " + error);
                next(error);   
            }
        });
        console.log("done!!");
    })
    .pipe('makeBranchTables', function (next, entries, page) {
        // 가져온 데이터를 읽어들일 수 있도록 수정한다.
        var blTestString = JSON.stringify(entries);
        var blList = JSON.parse(blTestString);
        var bsList = [];
        
        blList.forEach (function (item, index) {
            if (item.charge._ == 'bs')
                bsList.push(item);
        });

        var branchTable = [];
        var maxLength = 0;
        var maxYoungLength = 0, maxArmy = 0, maxOther = 0;
        var branchYoungTable = [];
        var armyTable = [], otherTable = [];

        /***
            청년부 정보를 브랜치별로 정리한다.
        ***/
        bsList.forEach (function (item, index) {
            var branchName = item.branch._;
            var getList = sbp_branch.getOldBM(item, blList, attendSet);
            var getYoungList = sbp_branch.getYoungBM(item, blList, attendSet);
            var armyList = sbp_branch.getArmyBM(item, blList);
            var otherList = sbp_branch.getOtherBM(item, blList);

            if (maxLength < getList.length) maxLength = getList.length;
            if (maxYoungLength < getYoungList.length) maxYoungLength = getYoungList.length;
            if (maxArmy < armyList.length) maxArmy = armyList.length;
            if (maxOther < otherList.length) maxOther = otherList.length;

            branchTable.push(getList);
            branchYoungTable.push(getYoungList);
            armyTable.push(armyList);
            otherTable.push(otherList);
        });

        var etcList = sbp_branch.getEtcOldMember(blList,attendSet);
        branchTable.push(etcList);

        var etcList2 = sbp_branch.getEtcYoungMember(blList,attendSet);
        branchYoungTable.push(etcList2);

        res.render('branch', {
            bsList: bsList,
            blList: blList,
            maxNumber: maxLength,
            maxYoungNumber: maxYoungLength,
            branchTable: branchTable,
            branchYoungTable: branchYoungTable,
            armyTable: armyTable,
            otherTable: otherTable,
            maxArmy: maxArmy,
            maxOther: maxOther,
            year: year
        });        

    })
    .end ();

});

router.post('/branch_profile', function (req, res, next) {
    req.on('data', function(chunk) {
        var getget = req;
        var inputData = JSON.parse(chunk);
        
        sbp_member.GetMemberWithName(inputData.name, function (error, getData) {
            if (!error) {
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
    
    sbp_member.getMembersWithYear(year, function (memberList) {
        var memberList2 = [];
        memberList.forEach(function (item, index) {
            if (item.attend._ >= attendSet)
                memberList2.push(item);
        });
        
        // 정리된 정보를 건내고 ejs 랜더링 하여 보여줌.
        res.render('friends', 
            {	
                memberList: memberList2,
                year: year
            }
        );
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

router.get('/addCharge', function (req, res, next) {
    var add_name = req.body.add_name;
    var add_chargeName = req.body.add_chargeName;
    var add_chargeGroup = req.body.add_chargeGroup;
    var add_chargeYear = req.body.add_chargeYear;
    // var year = req.query.year;
    var year = sbp_time.getYear();
	var attendSet = req.query.attendValue;
    // if (!attendSet)
    //     attendSet = 0;
    
    // sbp_member.getMembersWithYear(year, function (memberList) {
    //     var memberList2 = [];
    //     memberList.forEach(function (item, index) {
    //         if (item.attend._ >= attendSet)
    //             memberList2.push(item);
    //     });
        
    //     // 정리된 정보를 건내고 ejs 랜더링 하여 보여줌.
    //     res.render('friends', 
    //         {	
    //             memberList: memberList2,
    //             year: year
    //         }
    //     );
    // });
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

