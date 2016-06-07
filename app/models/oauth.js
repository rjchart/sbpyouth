module.exports = init;
function init(app) {
    var pkginfo = require('../../package.json');
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
};


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

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

  
// var ids = {
//   facebook: {
//     clientID: 'get_your_own',
//     clientSecret: 'get_your_own',
//     callbackURL: 'http://127.0.0.1:1337/auth/facebook/callback'
//   },
//   twitter: {
//     consumerKey: 'j8glYU7cVi7pPTowNXvny2ST0',
//     consumerSecret: 'L4nTKgn46K0yyxAGL6dFKnAusyUK3UiecszLkXOXOGef5Ynx2O',
//     callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
//   },
//   github: {
//     clientID: 'get_your_own',
//     clientSecret: 'get_your_own',
//     callbackURL: "http://127.0.0.1:1337/auth/github/callback"
//   },
//   google: {
//     clientID: 'get_your_own',
//     clientSecret: 'get_your_own',
//     callbackURL: 'http://127.0.0.1:1337/auth/google/callback'
//   },
//   instagram: {
//     clientID: 'get_your_own',
//     clientSecret: 'get_your_own',
//     callbackURL: 'http://127.0.0.1:1337/auth/instagram/callback'
//   }
// };

// module.exports = ids;