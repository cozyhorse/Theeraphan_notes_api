const express = require("express");
const note = express.Router();
const Ajv = require("ajv");
const ajv = new Ajv();
const momentjs = require("moment");
const { noteCollection } = require("../mongodb");
const { noteSchema } = require("../Model/NoteSchema");
const { verifyToken } = require("../Model/jwt");
const { ObjectId } = require("mongodb");

const moment = momentjs();
note.use(express.json());
//verify token before accessing the endpoints
note.use(verifyToken);
const validate = ajv.compile(noteSchema);
//get notes
note
  .get("/notes", async (req, res) => {
    const userId = req.user.id;
    //get notes based on users id
    try {
      const notes = await noteCollection.find({ userid: userId }).toArray();
      if (notes.length === 0) {
        return res.status(404).json({ message: "No notes could be found" });
      }
      return res.status(200).json(notes);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  })

  .get("/notes/search", async (req, res) => {
    //Search for a post based on title and belongs to the useId
    const userId = req.user.id;
    //console.log("userID", userId)
    const { title } = req.query;
    //console.log("search", title)
    const notes = await noteCollection.find({ userid: userId }).toArray();
    const foundNote = notes.filter((note) => note.title.includes(title));
    if (foundNote.length === 0)
      return res.status(404).json({ message: "No notes found!" });

    //console.log("foundNote", foundNote);
    res.status(200).json(foundNote);
  })

  //Create notes
  .post("/notes", async (req, res) => {
    //Create post and add "createdAt:date"
    const userId = req.user.id;
    //console.log(userId);
    let { title, text } = req.body;

    const newNote = { title, text };

    //validation checks with NoteSchema
    const valid = validate(newNote);

    try {
      if (!valid) {
        if (validate.errors[0].dataPath === ".text") {
          return res
            .status(400)
            .json({ errors: `Text ${validate.errors[0].message}` });
        }
        return res
          .status(400)
          .json({ errors: `Title ${validate.errors[0].message}` });
      }

      await noteCollection.insertOne({
        userid: await userId,
        ...newNote,
        createdAt: moment.format("L: LT"),
      });
      return res.status(201).json({ message: "Note added!" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  })

  //Edit notes
  .put("/notes/:id", async (req, res) => {
    //Find note by id... add "modifiedAt:date"
    const noteId = req.params.id;
    let newText = req.body.text;
    //console.log("noteId", noteId);
    //checks if noteId is valid or if noteId exists
    try {
      const foundNote = await noteCollection.findOne({
        _id: new ObjectId(noteId),
      });
      //console.log("foundNote", foundNote);
      if (!foundNote) {
        return res.status(404).json({ message: "Note not found" });
      }
    } catch (error) {
      return res.status(404).json({ message: "ID invalid" });
    }

    //Modify the document and add "modiefiedAt: date"
    try {
      await noteCollection.updateOne(
        { _id: new ObjectId(noteId) },
        { $set: { text: newText, modifiedAt: moment.format("L: LT") } }
      );
      res.status(200).json({ message: "Document edited" });
    } catch (error) {
      res.status(400).json(error);
    }
  })

  //Delete note
  .delete("/notes/:id", async (req, res) => {
    const noteId = req.params.id;
    //console.log("noteId", noteId);
    //checks if noteId is valid or if noteId exists
    try {
      const foundNote = await noteCollection.findOne({
        _id: new ObjectId(noteId),
      });
      //console.log("foundNote", foundNote);
      if (!foundNote) {
        return res.status(409).json({ message: "Note not found" });
      }
    } catch (error) {
      return res.status(404).json({ message: "ID invalid" });
    }

    //Delete the document"
    try {
      await noteCollection.deleteOne({ _id: new ObjectId(noteId) });
      res.status(200).json({ message: "Document deleted" });
    } catch (error) {
      res.status(400).json(error);
    }
  });

module.exports = { note };
