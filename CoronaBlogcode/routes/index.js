const express = require('express');
const router =express.Router();
const passport = require("passport");
const User = require('../models/user')


//ROUTE ROUTE
router.get("/",(req,res) =>{
    res.render("landing")
})

//show register form
router.get("/register",(req,res) =>{
    res.render("register")
})
//handle signup logic
router.post("/register",(req,res) =>{
    
    User.register(({username: req.body.username}),req.body.password)
    .then((user) =>{
        passport.authenticate("local")(req,res,() =>{
            req.flash("success","Welcome to BLOGDUDE "+ user.username)
            res.redirect("/coronaBlogs");
        })})
        .catch((err) =>{
            req.flash("error",err.message);
            return res.render("register")
        })
})
//SHOW LOGIN FORM
router.get("/login",(req,res) =>{
    res.render("login");
})
router.post("/login",passport.authenticate("local",
{
    successRedirect:"/coronaBlogs",
    failureRedirect:"/login"
}),
    (req,res) =>{
     
})
//logout route
router.get("/logout",(req,res) =>{
    req.logout();
    req.flash("success","Logged you out!!!")
    res.redirect("/coronaBlogs")
})

//About route
router.get("/about", function(req, res) {
    res.render("about");
  });

module.exports = router;