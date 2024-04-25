const { note } = require("./Controllers/NotesController");
const { user } = require("./Controllers/UserController");
const { client } = require("./mongodb");

const express = require("express");

const server = express()
const URL = process.env.DEV_URL;
const PORT = process.env.DEV_PORT;

app.use("/api/", note)
app.use("/api/user", user)

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
