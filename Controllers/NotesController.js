const express = require("express");
const note = express.Router();
const Ajv = require("ajv");
const ajv = new Ajv();
const momentjs = require("moment");
const { noteCollection } = require("../mongodb");
const { noteSchema } = require("../Model/NoteSchema");
const { verifyToken } = require("../Model/jwt");

const moment = momentjs();

note.use(express.json());
note.use(verifyToken);
const validate = ajv.compile(noteSchema);
//get notes
note
  .get("/notes", async (req, res) => {
    const userId = req.user.id;
    //get notes based on users id
    try {
      const notes = await noteCollection.find({ id: userId }).toArray();
      if (notes.length === 0) {
          return res.status(404).json({ message: "No notes have been made" });
        }
        return res.status(200).json(notes);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  })

  .get("/notes/search", (req, res) => {
    //Search for a post based on title
  })

  //Create notes
  .post("/notes", async (req, res) => {
    //Create post and add "createdAt:date"
    const userId = req.user.id;
    console.log(userId);
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

      noteCollection.insertOne({
        id: await userId,
        ...newNote,
        createdAt: moment.format("L: LT"),
      });
      return res.status(200).json({ message: "Note added!" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  })

  //Edit notes
  .put("/notes", (req, res) => {
    //Find note by id... add "modifiedAt:date"
  })

  .delete("/notes", (req, res) => {
    //Delete note
  });

module.exports = { note };
