var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');
var sbp_time = require('../models/sbp-time');
var sbp_branch = require('../models/sbp-branch');
var sbp_member = require('../models/sbp-member');
var sbp_user = require('../models/sbp-user');
var azure = require('azure-storage');
var flowpipe = require('flowpipe');
var fs = require('fs');
var multiparty = require('multiparty');

// require('../models/oauth.js')(app);
// var passport = require('passport');
// var config = require('./oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
// var GithubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;

var pkginfo = require('../../package.json');
var passport = require('passport');
router.use(passport.initialize());
router.use(passport.session());


var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth';
var entGen = azure.TableUtilities.entityGenerator;
var redirectURL = "../setting"


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
        clientID: pkginfo.oauth.facebook.FACEBOOK_APP_ID,
        clientSecret: pkginfo.oauth.facebook.FACEBOOK_APP_SECRET,
        callbackURL: pkginfo.oauth.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)']
    },function(accessToken, refreshToken, profile, done) {
        console.log("profile: " + profile.displayName)
        sbp_user.FindUser('facebook', profile.id, function (error, result) {
            if (!error) {
                var entity = result;
                profile.entity = entity;
                if (result.linkP != null && result.linkP != '') {
                    sbp_member.GetMemberAndLogWithName(result.linkR, function (error, final) {
                        var getMember = final[0];
                        if (!error) {
                            entity.link = getMember;
                        }
                        console.log(result);
                        var addPhoto = {
                            PartitionKey: getMember.PartitionKey,
                            RowKey: getMember.RowKey,
                            userPhoto: profile.photos[0].value
                        }
                        sbp_member.SaveMember(addPhoto, function (error, reult) {});

                        return done(null, profile);
                    });
                }
                else
                    return done(null, profile);
            }
            else {
                console.log(error);
                var name = profile.displayName ? profile.displayName : profile.username;
                var entity = {
                    PartitionKey: 'facebook',
                    RowKey: profile.id,
                    name: name,
                    data: profile._raw,
                    photo: profile.photos[0].value,
                    gender: profile.gender,
                    linkP: '',
                    linkR: ''
                }
                profile.entity = entity;    
                
                sbp_user.SaveUser(entity, function (error, result) {
                    if (!error) {
                        return done(null, profile);
                    }
                    else {
                        console.log(error);
                        return done(null, profile);
                    }
                });
                
            }
        });
        
}));

passport.use(new TwitterStrategy({
    consumerKey: pkginfo.oauth.twitter.TWITTER_CONSUMER_KEY,
    consumerSecret: pkginfo.oauth.twitter.TWITTER_CONSUMER_SECRET,
    callbackURL: pkginfo.oauth.twitter.callbackURL
}, function(token, tokenSecret, profile, done) {
    //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // req.session.passport 정보를 저장하는 단계이다.
    // done 메소드에 전달된 정보가 세션에 저장된다.
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //
    return done(null, profile);
}));

passport.use(new InstagramStrategy({
    clientID: pkginfo.oauth.instagram.INSTAGRAM_CLIENT_ID,
    clientSecret: pkginfo.oauth.instagram.INSTAGRAM_CLIENT_SECRET,
    callbackURL: pkginfo.oauth.instagram.callbackURL
},
function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));


passport.use(new GoogleStrategy({
    clientID: pkginfo.oauth.google.GOOGLE_APP_ID,
    clientSecret: pkginfo.oauth.google.GOOGLE_APP_SECRET,
    callbackURL: pkginfo.oauth.google.callbackURL
    },
    function(request, accessToken, refreshToken, profile, done) {
        //
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // req.session.passport 정보를 저장하는 단계이다.
        // done 메소드에 전달된 정보가 세션에 저장된다.
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //
        return done(null, profile);
    }
));


passport.use(new KakaoStrategy({
    clientID : pkginfo.oauth.kakao.KAKAO_CLIENT_ID,
    callbackURL : pkginfo.oauth.kakao.callbackURL
  },
  function(accessToken, refreshToken, profile, done){
    // 사용자의 정보는 profile에 들어있다. 
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
        var name = profile.displayName ? profile.displayName : profile.username;
        var entity = {
            profile_id: profile.id,
            name: name,
            provider: 'kakao',
            data: profile._raw
        }
        profile.entity = entity;
        console.log("kakao: " + profile._raw);
        return done(null, profile);
  }
));



module.exports = function (app) {
    app.use('/auth', router);
};


router.get('/twitter', passport.authenticate('twitter'));
router.get('/facebook', passport.authenticate('facebook'), 
    function (req, res) {
        ;
    }
);
router.get('/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));
router.get('/instagram',passport.authenticate('instagram'),
    function(req, res){}
);

router.get('/kakao', passport.authenticate('kakao',{
    // failureRedirect: '#!/login'
    // failureRedirect: '#!/login'
}), function(req, res){} 
);
 
//
// redirect 실패/성공의 주소를 기입한다.
//
router.get('/twitter/callback', passport.authenticate('twitter', {
    successRedirect: redirectURL,
    failureRedirect: redirectURL
}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: redirectURL,
    failureRedirect: redirectURL
}));

//
// redirect 실패/성공의 주소를 기입한다.
//
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: redirectURL,
    failureRedirect: redirectURL
}));

router.get('/instagram/callback', passport.authenticate('instagram', { 
    failureRedirect: redirectURL }),
    function(req, res) {
        res.redirect(redirectURL);
    }
);
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: redirectURL }), // failureRedirect: '#!/login'
    function(req, res) {
        
        res.redirect(redirectURL);
    }
);

router.get('/setting', function (req, res) {
    res.redirect('../setting');
})

router.get('/logout', function(req, res){
//
// passport 에서 지원하는 logout 메소드이다.
// req.session.passport 의 정보를 삭제한다.
//
req.logout();
    res.redirect(redirectURL);
});

router.get('/login', function (req, res) {
    var getReturn = req.query.ret;
    if (getReturn)
        redirectURL = "../" + getReturn;
    var session_name;
    if (req.session.passport) {
        if (redirectURL != "/auth/login") {
            res.redirect(redirectURL);
            return;
        }
        else
            session_name = req.user.displayName ? req.user.displayName : req.user.username ? req.user.username : "" ;
    }
    res.render('login', {
        session_id: "Jake" || {},
        user: req.user || {},
        name: session_name || null
    });
});