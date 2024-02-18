var express = require('express');
var router = express.Router();
require('./auth');
const passport = require('passport');
const userModel = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

// router.get('/profile', isLoggedIn, async function(req, res, next) {
//   const googleuser = req.user;
//   const user = await userModel.findOne({googleId : req.session.passport.user});
//   console.log(user);
//   console.log(req.session.passport.user);
//   console.log(user._id);
//   console.log(user.googleId);
//   console.log(user.displayName);
//   console.log(user.email);
//   res.render('profile', {googleuser, user});
// });

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const googleuser = req.user;
  const user = await userModel.findById(req.session.passport.user._id);
  console.log(user._id);
  console.log(user.googleId);
  console.log(user.displayName);
  console.log(user.email);

  res.render('profile', { googleuser, user });
});


router.get('/learn', isLoggedIn, function(req, res, next) {
  const googleuser = req.user;
  res.render('learn', {googleuser});
});

router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
}));

router.get('/auth/protected', isLoggedIn, function(req, res, next){
  const googleuser = req.user;
  res.render('home', {googleuser});
})

router.get('/auth/google/failure', isLoggedIn, function(req, res, next){
  res.send("nahi hua na");
})

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  })
});

function isLoggedIn(req, res, next) {
  // req.user ?  next() : res.redirect("/");
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
