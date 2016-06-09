var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');
var sbp_time = require('../models/sbp-time');
var sbp_branch = require('../models/sbp-branch');
var sbp_member = require('../models/sbp-member');
var azure = require('azure-storage');
var flowpipe = require('flowpipe');
var jade = require("jade");
var fs = require('fs');
var multiparty = require('multiparty');

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
    var session_name, entity;
    session_name = req.session.passport.user.displayName;
    entity = req.session.passport.user.entity;
    res.render('setting', {
        title: 'Setting',
        name: entity.name,
        photo: entity.photo,
        gender: entity.gender,
        entity: entity || null,
        link: entity.link || null
    });
});
