const mongoose = require("mongoose");
const { Schema } = mongoose;

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

const Notes = mongoose.model("note" , notesSchema);
Notes.createIndexes;

module.exports = Notes;