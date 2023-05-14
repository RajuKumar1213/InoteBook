const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
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