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
var StringDecoder = require('string_decoder').StringDecoder;

var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth';
var entGen = azure.TableUtilities.entityGenerator;

module.exports = function (app) {
    app.use('/setting', router);
};

router.get('/', function (req, res, next) {
    if (!req.session.passport) {
        res.redirect('/auth/login?ret=setting');
        return;
    }
    // var session_name, entity;
    // session_name = req.session.passport.user.displayName;
    var entity = req.session.passport.user.entity;
    if (entity.link) {
        // entity.link.title = "Setting";
        entity.link.userPhoto = entity.photo;
        entity.link.userName = entity.name;
        res.render('settingProfile', {
            title: "Setting",
            data:entity.link
        });
    }
});

router.get('/secret', function (req, res, next) {
    if (!req.session.passport) {
        res.redirect('/auth/login?ret=setting/secret');
        return;
    }
    var entity;
    entity = req.session.passport.user.entity;
    if (entity.link) {
        res.render('settingSecret', entity.link);
    }
    else 
        res.send('error');
});

router.get('/amend', function (req, res, next) {
    if (!req.session.passport) {
        res.redirect('/auth/login?ret=setting/amend');
        return;
    }
    var entity;
    entity = req.session.passport.user.entity;
    if (entity.link) {
        entity.link.userPhoto = entity.photo;
        entity.link.userName = entity.name;
        res.render('settingAmend', entity.link);
    }
    else 
        res.send('error');
});


router.post('/saveUserSet', function (req, res, next) {
    var link;
    var id = '';
    if (req.session.passport && req.session.passport.user.entity.link) {
        link = req.session.passport.user.entity.link;
        id = link.RowKey;
    }
    else {
        res.status(500).send('Your Log-in data is expired: Login again.');
        return;
    }
    var decoder = new StringDecoder('utf8');
    var form = new multiparty.Form();
    sbp_data.MultipartyFunction(req, id, function (error, result) {
        if (!error) {
            var phone;
            if (result.phone)
                phone = result.phone;
            if (link) {
                for (var key in result) {
                    link[key] = result[key];
                }
            }
            sbp_member.SaveMember(result, function (error, result) {
                if (!error) {
                    
                    if (phone) {
                        res.send( {
                            phone: phone
                        });
                    }
                    else 
                        res.send({});
                }
                else 
                    next(error);
            });
        }
        else 
            next(error);
    });
});

router.get('/auth', function (req, res, next) {
    // if (!req.session.passport) {
    //     res.redirect('/auth/login?ret=setting/secret');
    //     return;
    // }
    // var entity;
    // entity = req.session.passport.user.entity;
    // if (entity.link) {
        var input = {};
        var maxCount = 2;
        var count = 0;
        sbp_member.GetUsersWithQuery(null,function (error, result) {
            if (!error) {
                var unlinkUsers = [];
                var linkUsers = [];
                result.forEach(function(user) {
                    if (user.linkP && user.linkP != '')
                        linkUsers.push(user);
                    else 
                        unlinkUsers.push(user);
                });
                input.linkUsers = linkUsers;
                input.unlinkUsers = unlinkUsers;
                count++;
                if (count >= maxCount)
                    res.render('settingAuth', input);
            }   
            else {
                res.status(500).send('맴버의 정보를 가져오지 못했습니다. 인터넷 상황을 확인 바랍니다.');
                return;
            } 
        });
        
        sbp_member.GetMembersWithQuery(null,function (error, result) {
            if (!error) {
                var managers = [];
                var executives = [];
                var normals = [];
                result.forEach(function(user) {
                    if (user.auth && user.auth != '') {
                        if (user.auth == 'manager')
                            managers.push(user);
                        else
                            executives.push(user);
                    }
                    else 
                        normals.push(user);
                });
                input.normals = normals;
                input.executives = executives;
                input.managers = managers;
                input.members = result;
                count++;
                if (count >= maxCount)
                    res.render('settingAuth', input);
            }   
            else {
                res.status(500).send('맴버의 정보를 가져오지 못했습니다. 인터넷 상황을 확인 바랍니다.');
                return;
            } 
        });
        // entity.link.userPhoto = entity.photo;
        // entity.link.userName = entity.name;
    // }
    // else {
    //     res.status(500).send('회원 정보가 존재하지 않습니다.');
    //     return;
    // }
});

router.post('/auth', function (req, res, next) {
    var body = req.body;
    var input = [];
    for (var key in req.body) {
        var data = {};
        var value = req.body[key]; 
        if (!value || value == '')
            continue;
        var strList = key.split("&&"); 
        data.PartitionKey = strList[0];
        data.RowKey = strList[1];
        var linkList = value.split("&&");
        data.linkP = linkList[0];
        data.linkR = linkList[1];
        input.push(data);
    }
    if (input.length == 0) {
        // res.status(500).send('등록할 정보가 없습니다.');
        res.redirect('/setting/auth');
        return;
    }
    sbp_member.SaveUsers(input, function (error, result) {
        if (!error) {
            res.redirect('/setting/auth');
        }
        else {
            res.status(500).send(error);
        }
    });

});


router.post('/deleteLink', function (req, res, next) {
    var body = req.body;
    body.linkP = '';
    body.linkR = '';
    sbp_member.SaveUser(body, function (error, result) {
        if (!error) {
            // res.redirect('/setting/auth');
            var data = {
                result:true
            }
            res.send(data);
            return;
        }
        else {
            res.status(500).send(error);
        }
    });
});

router.post('/delete/:id', function (req, res, next) {
    var id = req.params.id;
    var key = req.body.target;
    var target = req.body.target;
    var targets = [];
    targets.push(target);
    sbp_member.SetAuth(targets, id, 'delete', function (error, result) {
        if (!error) {
            res.send(req.body);
        }
        else 
            console.log('error: ' + error);
    });
});

router.post('/insert/:id', function (req, res, next) {
    var id = req.params.id;
    var targets = req.body.target;
    var target = [];
    targets.forEach(function (item) {
        if (item && item != '')
            target.push(item);
    });
    req.body.target = target;
    if (target.length > 0) {
        sbp_member.SetAuth(target, id, 'insert', function (error, result) {
            if (!error) {
                res.send(req.body);
            }
            else 
                console.log('error: ' + error);
        });
    }
    else 
        res.send(req.body);
});
