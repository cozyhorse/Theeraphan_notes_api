const express = require("express");
const note = express.Router()
const Ajv = require("ajv");
const ajv = new Ajv()
const momentjs = require("moment");
const { noteCollection } = require("../mongodb");
const { noteSchema } = require("../Model/NoteSchema");
const { verifyToken } = require("../Model/jwt");
const { user } = require("./UserController");

const moment = momentjs()

note.use(express.json());
const validate = ajv.compile(noteSchema)

//get notes
note.get("/notes", (req, res) => {
//fetch all notes by userid
})

//Create notes
.post("/notes", verifyToken, async (req, res) => {
//Create post and add "createdAt:date"
const userId = req.user.id;
console.log(userId);
let {title, text } = req.body

const newNote = {title, text}

await noteCollection.insertOne({id: await userId, ...newNote, createdAt: moment.format("L: LT")})
res.status(200).json({message: "Note added!"})

 
})

//Edit notes
.put("/notes", (req, res) => {
//Find note by id... add "modifiedAt:date"
})

.delete("/notes", (req, res) => {
    //Delete note
})


module.exports = {note}