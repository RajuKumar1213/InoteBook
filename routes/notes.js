const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchUser = require("../middleware/fetchUser");

// ROUTE :1  Fetch all the notes using : api/notes/fetchallnotes - Login required
router.get("/fetchallnotes", fetchUser ,async (req, res)=>{
    const userId = req.user.id;
    const notes = await Notes.find({userId});
    res.json(notes);
})

//ROUTER : 2 add notes in to the database using the post: api/notes/createNotes : Login required

router.post("/createNotes", fetchUser, async (req, res) => {
    const userId = req.user.id;
    try {
        const notes = await Notes.find({userId});
        if(!notes){
            return res.status(400).json({ error: "No any note found !" });
        }
        // destructuring from the req.body
        const {title , description , tag} = req.body;

        const createdNotes = await Notes.create({
            title : title,
            description : description,
            tag: tag,
            user : userId,
          })
        res.json(createdNotes);
        
        // if any occor occured send the error and message
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
      }
})


module.exports = router


