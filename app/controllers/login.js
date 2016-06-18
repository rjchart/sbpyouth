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
var title = '신반포 중앙교회 청년부';

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
        var name = profile.displayName ? profile.displayName : profile.username;
        var image = profile.photos[0].value;
        sbp_user.UserDataFunction(profile, name, image, function (error, result) {
            if (!error) {
                done(null, result);
            }
            else 
                done(error);
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
    callbackURL : pkginfo.oauth.kakao.callbackURL,
    profileFields: ['id', 'displayName', 'name', 'profile_image', 'picture.type(large)']
  },
  function(accessToken, refreshToken, profile, done){
        var name = profile.displayName ? profile.displayName : profile.username;
        var image = profile._json.properties.profile_image;
        sbp_user.UserDataFunction(profile, name, image, function (error, result) {
            if (!error) {
                done(null, result);
            }
            else 
                done(error);
        });
  }
));



module.exports = function (app) {
    app.use('/auth', router);
};


router.get('/twitter', passport.authenticate('twitter'));
router.get('/facebook', passport.authenticate('facebook'), 
    function (req, res) {
        // res.redirect(redirectURL);
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
    successRedirect: '/auth/loginSuccess',
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

router.get('/loginSuccess', function (req, res) {
    res.redirect(redirectURL);
});

router.get('/setting', function (req, res) {
    res.redirect('../setting');
})

router.get('/logout', function(req, res){
//
// passport 에서 지원하는 logout 메소드이다.
// req.session.passport 의 정보를 삭제한다.
//
    req.logout();
    res.redirect('back');
});

router.get('/login', function (req, res) {
    var getReturn = req.query.ret;
    if (getReturn) {
        redirectURL = getReturn;
        redirectURL = redirectURL.replace("//","/");
    }
    else 
        redirectURL = '/setting';
    var session_name;
    if (req.session.passport && req.session.passport.user) {
        if (redirectURL != "/auth/login") {
            res.redirect(redirectURL);
            return;
        }
        else
            session_name = req.user.displayName ? req.user.displayName : req.user.username ? req.user.username : "" ;
    }
    res.render('login', {
        title: title,
        user: req.user || {},
        name: session_name || null
    });
});