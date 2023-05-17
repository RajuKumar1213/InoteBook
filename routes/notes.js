const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { query, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser");

// ROUTE :1  Fetch all the notes using : api/notes/fetchallnotes - Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
    const userId = req.user.id;
    try {
        const notes = await Notes.find({ user: userId });
        res.json(notes);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})

//ROUTER : 2 add notes in to the database using the post: api/notes/createNotes : Login required

router.post("/createNotes", fetchUser, [

    query('title', "Enter a valid title").isLength({ min: 3 }),
    query('description', "Description must be at least five character ").isLength({ min: 5 })
], async (req, res) => {
    // if user is not with the valid data then sends bad request and  error
    const result = validationResult(req.body);
    if (!result.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    try {
        // destructuring from the req.body
        const { title, description, tag } = req.body;

        const createdNotes = await Notes.create({
            title: title,
            description: description,
            tag: tag,
            user: req.user.id,
        })
        res.json(createdNotes);

        // if any occor occured send the error and message
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})

//ROUTER : 3 -  Update an existing note using PUT: api/notes/updatenote : Login required

router.put("/updatenote/:id", fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;

    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    try {
        // Find the note to be updated and update it
        const note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") };

        // Allow the user to update the note only if the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        const updatedNotes = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }); // {new: true } :-means if new document will come then it will be creared
        res.json(updatedNotes);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})

//ROUTER : 4 :- Delete an existing note using DELETE: api/notes/deletenote : Login required

router.delete("/deletenote/:id", fetchUser, async (req, res) => {

    try {
        // find the note to be deleted and delete it
        const note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") };

        // Allow the user to delete the note only if the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        const deletedNote = await Notes.findByIdAndDelete(req.params.id); // {new: true } :-means if new document will come then it will be creared
        res.json(deletedNote);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})
module.exports = router


