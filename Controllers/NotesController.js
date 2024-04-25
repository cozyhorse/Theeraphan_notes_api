const express = require("express");
const note = express.Router()

note.use(express.json());

//get notes
note.get("/notes", (req, res) => {
//fetch all notes by userid
})

//Create notes
.post("/notes", (req, res) => {
//Create post and add "createdAt:date"
})

//Edit notes
.put("/notes", (req, res) => {
//Find note by id... add "modifiedAt:date"
})

.delete("/notes", (req, res) => {
    //Delete note
})


module.exports = {note}