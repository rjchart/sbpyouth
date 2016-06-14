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
        entity.link.userPhoto = entity.photo;
        entity.link.userName = entity.name;
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
    if (req.session.passport) {
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
    // form.on('part', function(part) {
	//     if (!part.filename) {
	// 		console.log('none');
	//     }
	//     else {
    //         var id = '이제희';
	// 		var filename = id + new Date().toISOString() + ".jpg";
	// 		var size = part.byteCount;
	// 		var size2 = part.byteCount - part.byteOffset;
	// 		var name = filename;
	// 		var container = 'imgcontainer';

	//     	console.log("part:" + filename + ", size:" + size + ", size2:" + size2);
	// 		var urlString = "https://sbpccyouth.blob.core.windows.net/" + container + "/" + filename;
	//     }
    // });

    // form.parse(req);
    // form.parse(req, function(err, fields, files) {
    //     var entity = {};
    //     for (var key in fields) {
    //         entity[key] = fields[key][0];
    //     }
    //     if (entity.length != 0) {
    //         sbp_member.SaveMember(entity, function (error, result) {
    //             if(!error) {
    //                 if (link) {
    //                     for (var key in fields) {
    //                         link[key] = fields[key][0];
    //                     }
    //                 }
    //                 // res.send('ok');
    //             }
    //         });
    //     }
    // });

});
