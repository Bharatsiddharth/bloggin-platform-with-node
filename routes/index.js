var express = require('express');
var router = express.Router();

const User = require("../models/user")

const upload = require("../utils/multer").single("profilepic")
const path = require("path");
const fs = require("fs")

const passport = require("passport");
const localStrategy = require("passport-local")
passport.use(new localStrategy(User.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user: req.user});
});

router.post('/register-user',async function(req, res, next) {
  const {username, email, password} = req.body;
  await User.register({username,email}, password);
  // res.send("user register")
  res.redirect("/login")
});


router.get('/login', function(req, res, next) {
  res.render('login', {user: req.user});
});

router.get('/profile', isloggedIn,  function(req, res, next) {
  res.render('profile', {user: req.user});
});


router.post("/login-user", passport.authenticate("local", {
  successRedirect: "./profile",
  failureRedirect: "./login"
}),
function (req, res, next) {}
);

router.get('/edit-profile', isloggedIn,  function(req, res, next) {
  res.render('editprofile', {user: req.user});
});



router.post('/image/:id', isloggedIn, upload, async  function(req, res, next) {
  try {
    if(req.user.profilepic !== "default.png"){
      fs.unlinkSync(
        path.join(
            __dirname,
            "..",
            "public",
            "images",
            req.user.profilepic
        )
    );
      req.user.profilepic = req.file.filename;
      await req.user.save();
      res.redirect("/edit-profile")
    }
  } catch (error) {
    res.send(error)
  }
});



router.get('/delete/:id', isloggedIn, async  function(req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("./login")
  } catch (error) {
    
  }
});


router.get('/update/:id', isloggedIn, async  function(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.params.id, ...req.body, )
    res.redirect("/profile")
  } catch (error) {
      res.send(error)
  }
});



router.get('/logout', function(req, res, next) {
  req.logOut(()=> {
    res.redirect('/login')
  })
});

function isloggedIn(req,res,next){
  if(req.isAuthenticated()){
    next();
  }else{
    res.redirect("/login")
  }
}

module.exports = router;
