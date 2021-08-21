const express = require('express');
const router =express.Router({mergeParams: true});
const CoronaBlog =require('../models/coronaBlog');
const Comment = require('../models/comment')
const middleware=require('../middleware')

//COMMENTS NEW
router.get("/new",middleware.isloggedIn,(req,res) =>{
//find CoronaBlog by id
CoronaBlog.findById(req.params.id)
.then((coronaBlog) =>{
res.render("comments/new",{coronaBlog:coronaBlog});
})
.catch((err) =>{
console.log(err);
})
})

//COMMENTS CREATE
router.post("/",middleware.isloggedIn,(req,res) =>{
    const comment={
        text:req.body.text
    }
   
    //lookup CoronaBlog usingID
    CoronaBlog.findById(req.params.id)
    .then((coronaBlog) =>{
           Comment.create(comment)
           .then((comment) =>{
               //add 
               comment.author.id =req.user._id;
               comment.author.username=req.user.username;
               comment.save();
               
              coronaBlog.comments.push(comment);
              coronaBlog.save();
              req.flash("success","successfully created comment")
              res.redirect('/coronaBlogs/'+ coronaBlog._id);
           })
           .catch((err) =>{
               req.flash("error","CoronaBlog not found");
               console.log(err);
           })
    })
    .catch((err) =>{
        console.log(err);
        res.redirect("/coronaBlogs");
    })
})
//Edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res) =>{
CoronaBlog.findById((req.params.id),(err,CoronaBlog)=>{
if(err){
    res.redirect("/coronaBlogs");
}
else{
    Comment.findById(req.params.comment_id,(err,foundComment) =>{
         if(err){
             res.redirect("back");
         }
         else{
             res.render("comments/edit",{coronaBlog:CoronaBlog,comment:foundComment})
         }
    })
}
})
})
//Comment Update
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res) =>{
   const comment={
        text:req.body.text
    }
    Comment.findByIdAndUpdate(req.params.comment_id,comment,(err,updatedComment)=>{
         if(err){
             res.redirect("back");
         }
         else{
             req.flash("success","successfully edited comment");
             res.redirect("/coronaBlogs/"+ req.params.id);
         }
    })
})

//COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res) =>{
    //findbyiDandremove
    Comment.findByIdAndRemove(req.params.comment_id)
    .then((deletecomment) =>{
        req.flash("success","comment deleted")
        res.redirect('back');
    })
    .catch((err)=>{
        res.redirect('back');
    })
})

module.exports = router;

