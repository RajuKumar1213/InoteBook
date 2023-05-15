const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, /// here you set the user ID from the user colection, so you can reference it 
        ref : "user"
    }, 

    title : {
        type : String,
        required : true
    } ,
    description : {
        type : String,
        required : true,
    },
    tag : {
        type  :String,
        default : "general"
    }
    ,
    timeStamp : {
        type : Date ,
        default : Date.now
    }
})

module.exports = mongoose.model("note" , notesSchema);