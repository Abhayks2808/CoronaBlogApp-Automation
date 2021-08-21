const mongoose = require('mongoose');
//schema setup
const CoronaBlogSchema = new mongoose.Schema({
    title:String,
    image:String,
    description:String,
    author:{
        id:{
           
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
        username:String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("CoronaBlog",CoronaBlogSchema);