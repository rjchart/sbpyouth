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

var accessKey = 'Fh/+XVXWJOFP9O7bfN/ucFEK9/jt5nu4fdUYRJGzwMuH4KB8fFaCk/gmer20nZ4vs3AiJdqB3FYgPCZqibK2Bw==';
var storageAccount = 'sbpyouth';
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
var jsFunctionString11 = jade.compileFileClient('app/views/modalMemberProfile.jade', {name: "modalMemberProfile"});
jsFunctionString += "\n" + jsFunctionString2 + "\n" + jsFunctionString3 + "\n"
 + jsFunctionString4 + "\n" + jsFunctionString5 + "\n" + jsFunctionString6 + "\n" 
 + jsFunctionString7 + "\n" + jsFunctionString8 + "\n" + jsFunctionString9 + "\n"
+ jsFunctionString10 + "\n" + jsFunctionString11;
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
    // var user = sbp_data.CheckLogin(req);

    res.redirect('/leader');
    return;
});

function MakeMoneyData (data) {
    var returnData;
    if (data) {
        data += ".";
        data = data.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        returnData = data.replace('.','');
        return returnData
    }
    return null;
}

router.get('/bank', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var part = req.query.part;
    if (part == null)
        part = "청년2부";
    var year = req.query.year;
    var month = req.query.month;
    var getDate = new Date();
    if (year == null)
        year = getDate.getFullYear().toString();
    if (month == null)
        month = (getDate.getMonth()+1).toString();
    var day = getDate.getDate();
    // user.year = year;
    // res.render('bank', user);
    sbp_member.GetBankWithMonthLog(year, month, part, function (error, result) {
        if (!error) {
            user.data = result;
            user.year = year;
            user.month = month;
            user.day = day;
            user.part = part;

            var curMoney = 0;
            var bankMoney = 0;
            var spendSum = 0;
            result.forEach(function(item) {
                if (item.gain) {
                    curMoney = curMoney + parseInt(item.gain);
                    if (item.paid)
                        bankMoney = bankMoney + parseInt(item.gain);
                }
                if (item.spend) {
                    curMoney = curMoney - parseInt(item.spend);
                    spendSum = spendSum + parseInt(item.spend);
                    if (item.paid)
                        bankMoney = bankMoney - parseInt(item.spend);
                }

                item.curMoney = curMoney;
                item.gain = MakeMoneyData(item.gain);
                item.spend = MakeMoneyData(item.spend);
                item.curMoney = MakeMoneyData(item.curMoney);
                item.shortYear = item.year.substring(2,4);
                if (item.section)
                    item.shortSection = item.section.substring(0,4);
                if (item.content)
                    item.shortContent = item.content.substring(0,4);
            });
            user.spendSum = MakeMoneyData(spendSum);
            user.curMoney = MakeMoneyData(curMoney);
            user.bankMoney = MakeMoneyData(bankMoney);

            sbp_member.GetDatas("은행리스트", 'bankList', function (error, result) {
                if (!error) {
                    user.bankList = result;
                    res.render('bank', user);
                }
                else 
                    res.render('bank',user);
            });
        }
    });
});

router.get('/bankList', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    sbp_member.GetDatas("은행리스트", 'bankList', function (error, result) {
        if (!error) {
            user.data = result;
            res.render('bankList', user);
        }
    });
});

router.get('/leader', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var year = req.query.year;
    var getDate = new Date();
    if (year == null)
        year = sbp_time.getFullYear().toString();

    sbp_member.GetLeadersWithYear(year, function (error, result) {
        if (!error) {
            var result2 = MakeLeaderList(result);

            var chargeOrder = ['교회 지도자', '임원', '팀장', '브랜치 리더(BS)', '부장 집사'];
            var chargeDesc = {
                '교회 지도자': '청년부의 지도를 맡고 계시는 목사님, 강도사님 및 전도사님',
                '임원': '청년부의 전반적인 일을 맡고 있으며, 청년부의 일에 앞장서는 청년들',
                '팀장': '청년부의 사역, 찬양, 다과 대접, 새가족 환영 등의 일을 분담하여 맡아 하는 청년들',
                '브랜치 리더(BS)': '청년부의 브랜치 그룹의 리더로 예배 후, 각자 맡은 브랜치의 교육을 맡으며 브랜치원들을 돕는 청년들',
                '부장 집사': '청년부의 멘토이자 뒤에서 이끌어주시는 집사님들'
            };
            //ㄴ var inputData = {};
            // for (var index in result) {
            //     var value = result[index];
            //     inputData[value.RowKey] = value;
            // }
            user.keys = chargeOrder;
            user.datas = result2.result;
            user.chargeDesc = chargeDesc;
            user.year = year;
                  
            res.render('leaders', user);
        }
    });
});


router.get('/churchLeader', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var year = req.query.year;
    var getDate = new Date();
    if (year == null)
        year = getDate.getFullYear().toString();

    sbp_member.GetMemberWithGroup(year, '교회', function (error, result) {
        if (!error) {
            var chargeOrder = ['청년부 목사', '청년1부 목사', '청년1부 강도사', '청년1부 전도사', '청년2부 목사', '청년2부 강도사', '청년2부 전도사'];
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
            user.year = year;
                  
            res.render('churchLeader', user);
        }
    });
});

function MakeTimePhotos (datas) {
    result = {};
    var keys = [];
    for (var i = 0; i < datas.length; i++) {
        data = datas[i];
        var key = data.event_year + "." + data.event_month + "." + data.event_day + ">> " + data.event_name;
        if (!result[key]) {
            var newArray = [];
            result[key] = newArray;
            keys.push(key);
        }
        result[key].push(data);
    }

    for (var key in result) {
        result[key] = result[key].sort(function(a,b) {
            var aa = 0;
            var bb = 0;
            if (a.priority)
                aa = parseInt(a.priority);
            if (b.priority)
                bb = parseInt(b.priority);

            if (aa > bb) return -1;
            else if (aa < bb) return 1;
            else return 0;
        });
    }

    return {
        result: result,
        keys: keys
    };
}

function MakeYearFriends (datas) {
    result = {};
    var keys = [];
    for (var i = 0; i < datas.length; i++) {
        data = datas[i];
        var year = parseInt(data.birthYear);
        if (parseInt(data.birthMonth) < 3 && parseInt(data.birthMonth) > 0)
            year -= 1;
        var key = year.toString();

        if (!result[key]) {
            var newArray = [];
            result[key] = newArray;
            keys.push(key);
        }
        result[key].push(data);
    }

    for (var key in result) {
        result[key] = result[key].sort(function(a,b) {
            var aa = 0;
            var bb = 0;
            if (a.priority)
                aa = parseInt(a.priority);
            if (b.priority)
                bb = parseInt(b.priority);

            if (aa > bb) return -1;
            else if (aa < bb) return 1;
            else return 0;
        });
    }

    return {
        result: result,
        keys: keys
    };
}

function MakeLeaderList (datas) {
    result = {};
    var keys = [];
    for (var i = 0; i < datas.length; i++) {
        data = datas[i];
        var key = data.chargeGroup;
        if (key == '교회')
            key = '교회 지도자';
        else if (key == 'BS')
            key = '브랜치 리더(BS)';
        if (!result[key]) {
            var newArray = [];
            result[key] = newArray;
            keys.push(key);
        }
        result[key].push(data);
    }

    for (var key in result) {
        result[key] = result[key].sort(function(a,b) {
            var aa = 0;
            var bb = 0;
            var chargeOrder = ['청년2부 목사', '청년1부 목사', '청년2부 강도사', '청년1부 강도사', '청년2부 전도사', '청년1부 전도사', '청년부 회장', '청년2부 총무', '청년1부 총무', '청년2부 부총무', '청년1부 부총무', '청년2부 회계', '청년1부 회계', '청년부 서기'];
            if (chargeOrder.indexOf(a.RowKey) != -1)
                aa = 10 - chargeOrder.indexOf(a.RowKey);
            if (chargeOrder.indexOf(b.RowKey) != -1)
                bb = 10 - chargeOrder.indexOf(b.RowKey);

            if (aa > bb) return -1;
            else if (aa < bb) return 1;
            else return 0;
        });
    }

    return {
        result: result,
        keys: keys
    };
}

function MakeServiceList (datas) {
    result = {};
    var keys = [];
    for (var i = 0; i < datas.length; i++) {
        data = datas[i];
        var key = data.service;
        if (!result[key]) {
            var newArray = [];
            result[key] = newArray;
            keys.push(key);
        }
        result[key].push(data);
    }

    for (var key in result) {
        result[key] = result[key].sort(function(a,b) {
            var aa = 0;
            var bb = 0;

            if (aa > bb) return -1;
            else if (aa < bb) return 1;
            else return 0;
        });
    }

    return {
        result: result,
        keys: keys
    };
}
router.get('/history', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var year = req.query.year;
    var month = req.query.month;
    var getDate = new Date();
    if (year == null)
        year = getDate.getFullYear().toString();
    if (month == null)
        month = (getDate.getMonth()+1).toString();
    var day = getDate.getDate();

    var input = {
        event_year: year
    }
    // ,
    //     event_month: month

    user.year = year;
    user.month = month;
    user.day = day;

    sbp_data.GetSBPDatas('Event', input, function (error, result) {
        if (!error) {

            // for (var value in result) {
            //     var tmp = result[value];
            //     var change = "https://sbpccyouth.blob.core.windows.net/imgcontainer/";
            //     tmp.photoName = tmp.photo.replace(change, "");
            // }

            // sbp_data.AddSBPDatas('sbpcc', result, function (error, resultx) {
            //     if (error) {
            //         ;
            //     }
            //     else {
            //         ;
            //     }
            //     ;
            // });
            
                // var inputData = {};
                // for (var index in result) {
                //     var value = result[index];
                //     inputData[value.RowKey] = value;
                // }
            
            
            result2 = MakeTimePhotos(result);
            user.datas = result2.result;
            result2.keys = result2.keys.sort(function(a,b) {
                if (a > b) return -1;
                else if (a < b) return 1;
                else return 0;
            });
            user.keys = result2.keys;

            // user.year = year;
                  
            res.render('history', user);
        }
    });
});

router.get('/checkMember', function (req, res, next) {
    var checkName = req.query.name;

    sbp_member.GetMemberAndLogWithName(checkName, function (error, getData) {
        if (!error) {
            if (getData.length > 0) {
                res.render('memberProfile', {
                    title: title,
                    data: getData[0]
                }); 
            }
        }
    });  

    // var session_name, entity;
    // session_name = req.session.passport.user.displayName;
    // res.render('settingProfile', {
    //         auth: user.auth,
    //         title: user.title,
    //         isLogin: user.isLogin,
    //         isLink: user.isLink,
    //         data: user
    //     });
        // user.data = null;
});

router.get('/test', function (req, res, next) {
    res.render('layouttest', {});
});

router.get('/deacons', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    
    var year = req.query.year;
    var getDate = new Date();
    if (year == null)
        year = getDate.getFullYear().toString();

    sbp_member.GetMemberWithGroup(year, '부장 집사', function (error, result) {
        if (!error) {
            var chargeOrder = ['청2 부장 집사', '청1 부장 집사'];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            user.order = chargeOrder;
            user.datas = inputData;
            user.year = year;
            res.render('deacons', user);
        }
    });
});

router.get('/executives', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var year = req.query.year;
    var getDate = new Date();
    if (year == null)
        year = getDate.getFullYear().toString();
    
    sbp_member.GetMemberWithGroup(year, '임원', function (error, result) {
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
            user.year = year;
            res.render('executives', user);
        }
    });
});

router.get('/teamleader', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    
    var year = req.query.year;
    var getDate = new Date();
    if (year == null)
        year = getDate.getFullYear().toString();
    
    sbp_member.GetMemberWithGroup(year, '팀장', function (error, result) {
        if (!error) {
            var chargeOrder = ['찬양 팀장', '사역 팀장', '새가족 팀장', '다과 팀장'];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
            }
            
            user.order = chargeOrder;
            user.datas = inputData;
            user.year = year;
            res.render('teamLeaders', user);
        }
    });
});

router.get('/branchleader', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    
    var year = req.query.year;
    // var getDate = new Date();
    if (year == null)
        year = sbp_time.getYear();

    sbp_member.GetMemberWithGroup(year, 'BS', function (error, result) {
        if (!error) {
            var chargeOrder = [];
            var inputData = {};
            for (var index in result) {
                var value = result[index];
                inputData[value.RowKey] = value;
                if (chargeOrder.indexOf(value.RowKey) < 0) 
                chargeOrder.push(value.RowKey);
            }

            user.order = chargeOrder;
            user.datas = inputData;
            user.year = year;
            res.render('branchLeaders', user);
        }
    });
});

router.get('/services', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);
    var year = sbp_time.getYear();
    var service = req.params.id;
    if (!service || service == '' || service == 0)
        service = '유치부';

    // var queryString = "service eq '" + service + "'";
    var serviceOrder = ['영아부', '유치부', '유년부', '초등부', '중고등부', '글로리아 찬양대', '할렐루야 찬양대'];
    var queryArray = [];
    for (var key in serviceOrder) {
        var value = serviceOrder[key];
        var queryString = "service eq '" + value + "'";
        queryArray.push(queryString);
    }
    var querySum = queryArray.join(" or ");
    var headers = '';

    sbp_member.GetMembersAndLogWithQueryAndYear(querySum, year, function (error, result) {
        if (!error) {

            result2 = MakeServiceList(result);
            user.datas = result2.result;
            user.keys = serviceOrder;
            user.year = year;
            // user.header = header;
            res.render('services', user);

        }
        else 
            res.status(500).send(service + ' 관련 데이터를 받아오는데 실패하였습니다.');
    });
    
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
        header = '신반포 중앙교회 유치부는 5~7세의 아이들을 돌보며 가르치는 부서입니다.';
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

router.get('/checkAttendance', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var year = req.query.year;
    var month = req.query.month;
    var date = req.query.date;
    var cur_year = new Date().getFullYear();
    var cur_month = new Date().getMonth() + 1;
    var cur_date = new Date().getDate();
    while (1) {
        var checkTime = new Date(cur_year, cur_month-1, cur_date);
        var week = checkTime.getDay();
        if (week == 0)
            break;
        cur_date--;
    }
    if (!year)
        year = cur_year;
    if (!month)
        month = cur_month;
    if (!date)
        date = cur_date;

	var attendSet = req.query['attendValue'];
	if (!attendSet)
		attendSet = 0;
          
    sbp_data.GetSBPDatas('Attend', null, function (error, attendResult) {
        if (error) {
            attendResult = [];
        }

        attendResult.forEach(function (item, index) {
            item.memberString = item.members;
            item.members = item.members.split(',');
        });

        var getTable = sbp_member.GetUnionBranchMembers(year, function (error, result) {
            if (!error) {
                var branchs = [];
                result.bsList.forEach (function (item) {
                    branchs.push(item.branch);
                });
                result.branchTag = JSON.stringify(branchs);
                result.title = title;
                
                CombineElements(user, result)

                if (!year)
                    year = cur_year;
                if (!month)
                    month = cur_month;
                if (!date)
                    date = cur_date;

                var checkYear, checkMonth, checkDate;
                var curYear = cur_year, curMonth = cur_month;
                var dateDatas = {};
                dateDatas[curYear] = {};
                var weeks = [];
                var checks = [];
                dateDatas[curYear][curMonth] = weeks;
                for (var i=0; i <80; i += 7) {
                    var checkTime = new Date(cur_year, cur_month-1, cur_date-i);
                    checkYear = checkTime.getFullYear();
                    checkMonth = checkTime.getMonth()+1;
                    checkDate = checkTime.getDate();
                    var tmp = {};
                    tmp.year = checkYear;
                    tmp.month = checkMonth;
                    tmp.date = checkDate;
                    tmp.timeString = checkYear + "." + checkMonth + "." + checkDate;
                    if (checkYear != curYear) {
                        curYear = checkYear;
                        curMonth = checkMonth;
                        dateDatas[curYear] = {};
                        weeks = [];
                        dateDatas[curYear][curMonth] = weeks;
                    }
                    else if (checkMonth != curMonth) {
                        curMonth = checkMonth;
                        weeks = [];
                        dateDatas[curYear][curMonth] = weeks;
                    }
                    weeks.push(tmp);
                    checks.push(tmp);
                }

                var attendKey = year + "." + month + "." + date;
                var attendList = [];
                attendResult.forEach(function(item) {
                    if (item.RowKey == attendKey)
                        attendList = item;
                });
                // attendList.forEach(function(item,index) {

                // });

                user.year = year;
                user.month = month;
                user.date = date;
                user.checks = checks;
                user.weeks = weeks;
                user.attendList = attendList.members;
                user.attendResult = attendResult;
                res.render('checkAttendance02', user);
            }
            else 
                console.log(error);
        }, attendSet);
    }); 
  
});

router.get('/checkAttendance2', function (req, res, next) {
    var user = sbp_data.CheckLogin(req);

    var year = req.query.year;
    var month = req.query.month;
    var date = req.query.date;
    var cur_year = new Date().getFullYear();
    var cur_month = new Date().getMonth() + 1;
    var cur_date = new Date().getDate();
    while (1) {
        var checkTime = new Date(cur_year, cur_month-1, cur_date);
        var week = checkTime.getDay();
        if (week == 0)
            break;
        cur_date--;
    }
    if (!year)
        year = cur_year;
    if (!month)
        month = cur_month;
    if (!date)
        date = cur_date;

	var attendSet = req.query['attendValue'];
	if (!attendSet)
		attendSet = 0;
          
    sbp_data.GetSBPDatas('Attend', null, function (error, attendResult) {
        if (error) {
            attendResult = [];
        }

        attendResult.forEach(function (item, index) {
            item.memberString = item.members;
            item.members = item.members.split(',');
        });

        var getTable = sbp_member.GetUnionBranchMembers(year, function (error, result) {
            if (!error) {
                var branchs = [];
                result.bsList.forEach (function (item) {
                    branchs.push(item.branch);
                });
                result.branchTag = JSON.stringify(branchs);
                result.title = title;
                
                CombineElements(user, result)

                if (!year)
                    year = cur_year;
                if (!month)
                    month = cur_month;
                if (!date)
                    date = cur_date;

                var checkYear, checkMonth, checkDate;
                var curYear = cur_year, curMonth = cur_month;
                var dateDatas = {};
                dateDatas[curYear] = {};
                var weeks = [];
                var checks = [];
                dateDatas[curYear][curMonth] = weeks;
                for (var i=0; i <80; i += 7) {
                    var checkTime = new Date(cur_year, cur_month-1, cur_date-i);
                    checkYear = checkTime.getFullYear();
                    checkMonth = checkTime.getMonth()+1;
                    checkDate = checkTime.getDate();
                    var tmp = {};
                    tmp.year = checkYear;
                    tmp.month = checkMonth;
                    tmp.date = checkDate;
                    if (checkYear != curYear) {
                        curYear = checkYear;
                        curMonth = checkMonth;
                        dateDatas[curYear] = {};
                        weeks = [];
                        dateDatas[curYear][curMonth] = weeks;
                    }
                    else if (checkMonth != curMonth) {
                        curMonth = checkMonth;
                        weeks = [];
                        dateDatas[curYear][curMonth] = weeks;
                    }
                    weeks.push(tmp);
                    checks.push(tmp);
                }

                var attendKey = year + "." + month + "." + date;
                var attendList = [];
                attendResult.forEach(function(item) {
                    if (item.RowKey == attendKey)
                        attendList = item;
                });
                // attendList.forEach(function(item,index) {

                // });


                user.year = year;
                user.month = month;
                user.date = date;
                user.checks = checks;
                user.weeks = weeks;
                user.attendList = attendList.members;
                user.attendResult = attendResult;
                res.render('checkAttendance', user);
            }
            else 
                console.log(error);
        }, attendSet);
    }); 
  
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

router.get('/friends/years', function (req, res, next) {
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
                if (item.attendDesc == "결혼" || item.attendDesc == "제외" ||item.attendDesc == "장기결석" || item.attendDesc == "교회 옮김" || item.attendDesc == "교회옮김" || item.attendDesc == "타교회" || item.attendDesc == "목사" || item.attendDesc == "목사님" || item.attendDesc == "전도사" || item.attendDesc == "강도사" || item.part == "교회")
                    isOut = true;
                if (item.attend >= attendSet && !isOut) {
                    memberList2.push(item);
                }   
            });

            result = MakeYearFriends(memberList2);
            result.keys = result.keys.sort(function(a,b) {
                if (a > b) return -1;
                else if (a < b) return 1;
                else return 0;
            });

            user.datas = result.result;
            user.keys = result.keys;
            user.year = year;
            user.sub = 'yearFriends';
            res.render('yearFriends', user);
        }
        else 
            res.send('error: cannot find friends list: ' + error);
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

                // var change = "https://sbpccyouth.blob.core.windows.net/imgcontainer/";
                // if (item.photo)
                //     item.photoName = item.photo.replace(change, "");
                // item.PartitionKey = "Member";
                // item.name = item.RowKey;


                var isOut = false;
                if (item.attendDesc == "결혼" || item.attendDesc == "제외" ||item.attendDesc == "장기결석" || item.attendDesc == "교회 옮김" || item.attendDesc == "교회옮김" || item.attendDesc == "타교회")
                    isOut = true;
                if (item.attend >= attendSet && !isOut) {
                    if (query) {
                        if (item.RowKey.includes(query))
                            memberList2.push(item);
                        if (item.birthYear == query)
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


            // sbp_data.AddSBPDatas('sbpcc', memberList, function (error, resultx) {
            //     if (error) {
            //         ;
            //     }
            //     else {
            //         ;
            //     }
            //     ;
            // });

            // CombineElements(user, input)
            user.memberList = memberList2;
            user.year = year;
            user.sub = 'total';
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

router.get('/hiddenFriends', function (req, res, next) {
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
            user.sub = 'total';
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

router.get('/friends/soccer', function (req, res, next) {
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
                var sports = item.likeSports
                if (!sports || sports.indexOf("축구") == -1)
                    isOut = true;
                if (item.attendDesc == "결혼" || item.attendDesc == "제외" || item.attendDesc == "장기결석" || item.attendDesc == "교회 옮김" || item.attendDesc == "교회옮김" || item.attendDesc == "타교회")
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
            user.sub = 'soccer';
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

router.get('/friends/tablepingpong', function (req, res, next) {
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
                var sports = item.likeSports
                if (!sports || sports.indexOf("탁구") == -1)
                    isOut = true;
                if (item.attendDesc == "결혼" || item.attendDesc == "제외" || item.attendDesc == "장기결석" || item.attendDesc == "교회 옮김" || item.attendDesc == "교회옮김" || item.attendDesc == "타교회")
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
            user.sub = 'tablepingpong';
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

router.post('/addEvent', function (req, res, next) {
    var getTime = new Date().toISOString();
    
	// var id = getTime;
    
    sbp_data.MultipartyFunction(req, 'Event', function (error, result) {
        if (!error) {
            
            var members = "";
            for (var i = 0; i < 16; i++) {
                var key = "members[" + i + "]";
                if (result[key] != undefined  && result[key] != "") {
                    if (i != 0)
                        members += ", ";
                    members += result[key];
                }
            }
            for (var i = 0; i < 16; i++) {
                var key = "members[" + i + "]";
                delete result[key];
            }
            if (members != "")
                result.members = members;
            // if (typeof result.members != 'undefined')
            //     members = result.members.join(", ");
            result.PartitionKey = "Event";
            result.RowKey = getTime + "_" + result.event_name;
            sbp_member.SaveDatas('sbpcc', result, function (error, saveResult) {
                if (!error) {
                    res.send( {
                        field: saveResult
                    });
                }
                else 
                    next(error);
            });
            // sbp_member.SaveDatas(result, function (error, result) {
            //     if (!error) {
            //         res.send( {
            //             field: result
            //         });
            //     }
            //     else 
            //         next(error);
            // });
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

router.post('/addBank', function (req, res, next) {

    var getDate = new Date();
    var year = getDate.getFullYear().toString();
    var month = getDate.getMonth();
    var day = getDate.getDate();


    var add_year = req.body.add_year;
    var add_part = req.body.add_part;
    var add_month = req.body.add_month;
    var add_day = req.body.add_day;
    var add_section = req.body.add_section;
    var add_content = req.body.add_content;
    var add_money = req.body.add_money;
    var add_detail = req.body.add_detail;
    var add_bankName = req.body.add_bankName;
    var add_bankNumber = req.body.add_bankNumber;
    var add_bankReceive = req.body.add_bankReceive;


    sbp_member.GetBankLog(add_year, add_part, function (error, result) {
        if (!error) {
            var receiptNo = 1;
            for (i=0; i < result.length; i++) {
                var tmp = result[i];
                var tmpNo = parseInt(tmp.receiptNo);
                if (tmpNo && receiptNo <= tmpNo)
                    receiptNo = tmpNo + 1;
            }


            var addData = [];
            for (i = 0; i < add_content.length; i++) {
                var tmp = {};
                if (add_content[i] == null || add_content[i] == '')
                    continue;
                var time = new Date().getTime();

                tmp.year = add_year[i];
                tmp.month = add_month[i];
                tmp.day = add_day[i];
                tmp.part = add_part[i];
                tmp.section = add_section[i];
                tmp.content = add_content[i];
                tmp.money = add_money[i];
                if (tmp.section != "예산") {
                    tmp.receiptNo = receiptNo;
                    receiptNo = receiptNo+1;
                }
                if (add_detail && add_detail.length > i)
                    tmp.detail = add_detail[i];
                if (add_bankName && add_bankName.length > i)
                    tmp.bankName = add_bankName[i];
                if (add_bankNumber && add_bankNumber.length > i)
                    tmp.bankNumber = add_bankNumber[i];
                if (add_bankReceive && add_bankReceive.length > i)
                    tmp.bankReceive = add_bankReceive[i];
                tmp.PartitionKey = tmp.year.toString();
                tmp.RowKey = time.toString(); 


                addData.push(tmp);
            }
            
            sbp_data.AddBank(addData, function (error, result) {
                if (!error) {
                    res.send({
                            year: add_year[0],
                            month: add_month[0],
                            part: add_part[0]
                        });
                }
            });

        }
    });


    
});

router.post('/addBankList', function (req, res, next) {

    var add_name = req.body.add_name;
    var add_section = req.body.add_section;
    var add_bankName = req.body.add_bankName;
    var add_bankNumber = req.body.add_bankNumber;

    var time = new Date().getTime();

    var addData = [];
    for (i = 0; i < add_name.length; i++) {
        var tmp = {};
        if (add_name[i] == null || add_name[i] == '')
            continue;

        tmp.name = add_name[i];
        tmp.section = add_section[i];
        if (add_bankName && add_bankName.length > i)
            tmp.bankName = add_bankName[i];
        if (add_bankNumber && add_bankNumber.length > i)
            tmp.bankNumber = add_bankNumber[i];
        tmp.PartitionKey = "은행리스트"
        tmp.RowKey = time.toString(); 

        addData.push(tmp);
    }
    
    sbp_data.AddDatas(addData, 'bankList', function (error, result) {
        if (!error) {
            res.send("ok");
        }
    });


    
});


router.post('/editBank', function (req, res, next) {

    var getDate = new Date();
    var year = getDate.getFullYear().toString();
    var month = getDate.getMonth();
    var day = getDate.getDate();

    var date = req.body.date;
    var section = req.body.section;
    var content = req.body.content;
    var receiptNo = req.body.receiptNo;
    var gain = req.body.gain;
    var spend = req.body.spend;
    var detail = req.body.detail;
    var RowKey = req.body.RowKey;
    var PartitionKey = req.body.PartitionKey;
    var deleteRow = req.body.deleteRow;
    var paidNum = req.body.paid;
    var paid = [];
    if (paidNum)
        paidNum.forEach( function(item) {
            var num = parseInt(item);
            paid[num] = "on"; 
        });

    var addData = [];
    for (i = 0; i < RowKey.length; i++) {
        var tmp = {};
        if (RowKey[i] == null || RowKey[i] == '')
            continue;
        var time = new Date().getTime();


        // tmp.date = date[i];
        tmp.section = section[i];
        tmp.content = content[i];
        tmp.receiptNo = receiptNo[i];
        tmp.gain = gain[i].replace(/,/g,'');
        tmp.spend = spend[i].replace(/,/g,'');
        tmp.detail = detail[i];
        tmp.deleteRow = deleteRow[i];
        if (paid && paid.length > i && paid[i])
            tmp.paid = paid[i];
        else
            tmp.paid = false;

        if (tmp.gain && tmp.gain > 0)
            tmp.money = tmp.gain;
        
        if (tmp.spend && tmp.spend > 0)
            tmp.money = tmp.spend;
        
        var dateStrings = date[i].split('.');
        tmp.year = dateStrings[0];
        tmp.month = dateStrings[1];
        tmp.day = dateStrings[2];
        
        tmp.PartitionKey = PartitionKey[i];
        tmp.RowKey = RowKey[i]; 


        addData.push(tmp);
    }
    
    sbp_data.AddBank(addData, function (error, result) {
        if (!error) {
            res.send("ok");
        }
    });
    
});

router.post('/editBankList', function (req, res, next) {
    var name = req.body.name;
    var section = req.body.section;
    var bankName = req.body.bankName;
    var bankNumber = req.body.bankNumber;
    var RowKey = req.body.RowKey;
    var PartitionKey = req.body.PartitionKey;
    var deleteRow = req.body.deleteRow;

    var addData = [];
    for (i = 0; i < RowKey.length; i++) {
        var tmp = {};
        if (RowKey[i] == null || RowKey[i] == '')
            continue;
        var time = new Date().getTime();

        // tmp.date = date[i];
        tmp.name = name[i];
        tmp.section = section[i];
        tmp.bankName = bankName[i];
        tmp.bankNumber = bankNumber[i];
        tmp.deleteRow = deleteRow[i];
        tmp.PartitionKey = PartitionKey[i];
        tmp.RowKey = RowKey[i]; 

        addData.push(tmp);
    }
    
    sbp_data.AddDatas(addData, 'bankList', function (error, result) {
        if (!error) {
            res.send("ok");
        }
    });
    
});



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

router.post('/saveAttendance', function (req, res, next) {
    var body = req.body;
    var att = body.attendance;
    var keys = Object.keys(att);
    var saveString = keys.join(',');
    
    var addData = {
        PartitionKey: 'Attend',
        RowKey: body.check_time,
        members: saveString
    };
    
    sbp_data.AddSBPData(addData, function (error, result) {
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
            // var year = parseInt(tmp.birthYear);
            // if (year > 1900)
            //     year -= 1900;
            // var partitionKey = year;
            // if (parseInt(tmp.birthMonth) < 3)
            //     partitionKey--;
            tmp.PartitionKey = 'Member';
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
    var seperate = req.body['seperate'];
    var likeData = req.body['likeData'];
    var powerData = req.body['powerData'];
    var tempName = req.body['tempName'];
    var removeName = req.body['remove_name'];
    if (tempName == null)
        tempName = 'temp'
    sbp_member.GetMembersAndLogWithYear(null, function (error, members) {
        if (!error) {
            // index: 1 -- 간단히 브랜치원이 원하는 BS 싫어하지 않는 BS 정도를 결정하고 나머지 랜덤. 
            // index: 2 -- 브랜치의 밸런스를 맞추고 팀원들의 행복도를 통해 최적의 브랜치 편성
            removeList = [];
            members.forEach(function(item) {
                removeName.forEach(function(removeItem) {
                    if(item.RowKey == removeItem)
                        removeList.push(item);
                });
            });
            removeList.forEach(function(item) {
                var getID = members.indexOf(item);
                if (getID >= 0)
                    members.splice(getID,1);
            });

            var newList = sbp_branch.MakeNewBranch(members, bsList, 0, likeData, powerData, 0);
            if (newList == null) {
                res.render('branchFail');
            }
            else {
                // newList.year = '2016';
                newList.year = tempName;
                console.log("done");
                res.render('branchTemp', newList);
            }
        }    
    });
});

router.post('/saveTempBranch', function (req, res, next) {
    var tempName = req.body['tempName'];
    if (!tempName)
        tempName = 'temp';

    var inputData = [];
    for (var i = 0; i < req.body.m_name.length; i++) {
        if (req.body.m_name[i] == "")
            continue;
        var entity = {
            PartitionKey: tempName,
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
            res.redirect('branch?year=' + tempName);
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