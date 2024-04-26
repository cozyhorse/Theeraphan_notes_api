const { note } = require("./Controllers/NotesController");
const { user } = require("./Controllers/UserController");
const { client } = require("./mongodb");
// //Get Database
// const database = client.db("notes_api")
// //Get collection "notes" in database "notes_api"
// const noteCollection = database.collection("notes")
// //Get collection "users" in database "notes_api"
// const usersCollection = database.collection("users");

const express = require("express");

const server = express()
const URL = process.env.DEV_URL;
const PORT = process.env.DEV_PORT;

server.use("/api/", note)
server.use("/api/user", user)

//Connect to mongodb atlas and start server
const startServer = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB")

        server.listen(PORT, () => {
            console.log(`Server runs on ${URL}:${PORT}`)
        })

    } catch (error) {
        console.log("Could not connect to MongoDB", error)
        process.exit(1)
        
    }
}

//Start server
startServer();
