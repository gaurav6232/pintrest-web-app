var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const localStrategy = require('passport-local')
const upload = require('./multer');


passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index',{nav: false});
});


router.get('/relogin', function(req, res, next) {
  res.render('relogin',{nav: false});
});


router.get('/register', function(req, res, next) {
  res.render('register', {nav: false});
});



router.get('/home', async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})

  res.render('home',{user, nav: true});
});

router.get('/profile', isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  .populate("posts")
  res.render('profile',{user, nav: true});
});


router.get('/show/posts', isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  .populate("posts")
  res.render('show',{user, nav: true});
});

router.get('/feed', isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  const posts = await postModel.find()
  .populate("user")

  res.render("feed",{user, posts, nav: true});

});





router.get('/add', isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('add',{user, nav: true});
});


router.post('/createpost', isLoggedIn, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async function(req, res, next) {
  try {
    const user = await userModel.findOne({username: req.session.passport.user});
    if (!user) {
      throw new Error('User not found');
    }

    let videofilename = '';
    if (req.files['video'] && req.files['video'][0]) {
      videofilename = req.files['video'][0].filename;
    }

    if (!req.files['image'] || !req.files['image'][0] || !req.files['video'] || !req.files['video'][0] || !req.body.title || !req.body.description) {
      throw new Error('Required fields missing or file not uploaded');
    }

    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.files['image'][0].filename,
      video: videofilename
    });

    if (!post) {
      throw new Error('Failed to create post');
    }

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message); // Sending error message to client
  }
});









router.post('/fileupload', isLoggedIn, upload.single("image"),async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile")

});

router.post('/register', function(req, res, next) {
  const data = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    contect: req.body.contect
  })

  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/feed")
    })
  })
 
});



router.post('/login', passport.authenticate("local",{
  failureRedirect: "",
  successRedirect: "/feed",
}), function(req,res, next){

})
 
router.get("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/")
}
module.exports = router;
