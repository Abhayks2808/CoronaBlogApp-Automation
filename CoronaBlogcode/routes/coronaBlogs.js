const express = require('express');
const router = express.Router();
const CoronaBlog=require('../models/coronaBlog');
const middleware=require('../middleware')


//INDEX  :show all CoronaBlogs
router.get("/",(req,res) =>{
    //get CoronaBlog data from database
    CoronaBlog.find()
    .then((coronaBlogs) =>{
        res.render("coronaBlogs/index",{coronaBlogs:coronaBlogs})
    })
    .catch((err) =>{
        console.log('Error:',err)
    })
// res.render("CoronaBlogs",{CoronaBlogs:CoronaBlogs})
})
//create route : add new CoronaBlog to database
router.post("/",middleware.isloggedIn,(req,res) => {

   const title=req.body.title;
    const image=req.body.image;
    const description= req.body.description;
    const author ={
        id:req.user._id,
        username:req.user.username
    }
    const newCoronaBlog={
        title:title,
        image:image,
        description:description,
        author:author
    }
//create a new CoronaBlog
CoronaBlog.create(newCoronaBlog).then(() => {    
//redirect back to

 res.redirect("/coronaBlogs")
})
.catch((err) =>{
    console.log('Error:',err);
})
})
//New:Show form to crete new CoronaBlog
router.get("/new",middleware.isloggedIn,(req,res) => {
    res.render("coronaBlogs/new")
});
router.get("/:id",(req,res) =>{
    //find the CoronaBlog with provided Id
    CoronaBlog.findById(req.params.id).populate("comments")
    .exec((err,FoundCoronaBlog) =>{
        if(err){
            console.log("Error:",err)
        }
        else{

        
        //render show template with that CoronaBlog
        res.render("coronaBlogs/show",{coronaBlog:FoundCoronaBlog})
        }
    })
    
})


//EDIT CoronaBlog ROUTE
router.get("/:id/Edit",middleware.checkCoronaBlogOwnership,(req,res) =>{
    CoronaBlog.findById(req.params.id)
    .then((foundCoronaBlog) =>{
            res.render("coronaBlogs/Edit",{coronaBlog:foundCoronaBlog});
        })
    
     .catch((err) =>{
         res.redirect("/coronaBlogs")
     })

    });
//update campgroung route      
router.put("/:id",middleware.checkCoronaBlogOwnership,(req,res) =>{
      const UpdateCoronaBlog={
        title:req.body.title,
        image:req.body.image,
        description:req.body.description,
    
    }
    CoronaBlog.findByIdAndUpdate(req.params.id,UpdateCoronaBlog)
    .then(() =>{
        res.redirect("/coronaBlogs/"+ req.params.id);
    })
    .catch((err) =>{
        res.redirect("/coronaBlogs")
    })
})
//DELETE CoronaBlog ROUTE
router.delete("/:id",middleware.checkCoronaBlogOwnership,(req,res) =>{
    CoronaBlog.findByIdAndRemove(req.params.id)
    .then(() =>{
        res.redirect("/coronaBlogs");
    })
    .catch((err) =>{
        res.redirect("/coronaBlogs");
    })
})


module.exports = router;
 