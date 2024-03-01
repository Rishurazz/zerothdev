var express = require('express');
var router = express.Router();
require('./auth');
const passport = require('passport');
const userModel = require('../models/users');
const postModel = require('../models/post');
const ideaModel = require('../models/idea');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/profile', isLoggedIn, async function(req, res, next) {
  const googleuser = req.user;
  const user = await userModel.findById(req.session.passport.user._id).populate(["ideas", "posts"]);
  console.log(user);
  // const allIdeas = await postModel.findById(user.ideas).populate('user');
  // console.log(allIdeas);
  // const allPosts = await postModel.find().populate('user');
  // console.log(allPosts);
  res.render('profile', { googleuser, user});
});


router.get('/learn', isLoggedIn, async function(req, res, next) {
  const googleuser = req.user;
  const user = await userModel.findById(req.session.passport.user._id);
  res.render('learn', { googleuser, user });
});

router.get('/idea', isLoggedIn, async function(req, res, next) {
  const googleuser = req.user;
  const user = await userModel.findById(req.session.passport.user._id);
  const allIdeas = await ideaModel.find().populate('user');
  res.render('idea', {googleuser, user, ideas: allIdeas });
});

router.get('/feed', isLoggedIn, async function(req, res, next) {
  const googleuser = req.user;
  const user = await userModel.findById(req.session.passport.user._id);
  const allPosts = await postModel.find().populate('user');
  res.render('feed', {googleuser, user, posts: allPosts });
});

router.get('/group', isLoggedIn, isMember, async function(req, res, next) {
  res.render('group');
});

router.post('/join', async (req, res) => {
  try{
    const idea = await ideaModel.findById(req.body.ideaId);

    const user = await userModel.findById(req.session.passport.user._id);
    console.log("User in join route: ", idea._id);
    
    user.ideasJoined.push(idea._id);
    idea.members.push(user._id);
    
    console.log("User in update route: ", user);
    await user.save();
    await idea.save();

    res.redirect('/group');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/createArticle', (req, res) => {
  res.render('home'); // Assuming you have a template engine (like EJS) for rendering HTML
});

router.post('/createArticle', async (req, res) => {
  try {
      const { articleTitle, articleDescription } = req.body;

      const user = await userModel.findById(req.session.passport.user._id);

      const post = await postModel.create({
          title: articleTitle,
          description: articleDescription,
          user: user._id, // Assuming user._id is the ID of the logged-in user
      });

      // Save the post to the database
      user.posts.push(post._id);
      await user.save();
      await post.save();
      console.log("post successful");

      res.redirect('/auth/protected'); // Redirect to the home page or any other desired page after successful submission
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});



router.get('/createIdea', (req, res) => {
  res.render('home'); // Assuming you have a template engine (like EJS) for rendering HTML
});

router.post('/createIdea', async (req, res) => {
  try {
      const { articleTitle, articleDescription } = req.body;

      const user = await userModel.findById(req.session.passport.user._id);

      const newIdea = await ideaModel.create({
          title: articleTitle,
          description: articleDescription,
          user: user._id, // Assuming user._id is the ID of the logged-in user
      });

      // Save the post to the database
      user.ideas.push(newIdea._id);
      await user.save();
      await newIdea.save();
      console.log("idea successful");

      res.redirect('/auth/protected'); // Redirect to the home page or any other desired page after successful submission
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
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
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function isMember(req,res,next){
  console.log("isMember");
}

module.exports = router;
