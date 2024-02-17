var express = require('express');
var router = express.Router();
require('./auth');
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  const user = req.user;
  res.render('profile', {user});
});

router.get('/learn', isLoggedIn, function(req, res, next) {
  const user = req.user;
  res.render('learn', {user});
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
  const user = req.user;
  res.render('home', {user});
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
