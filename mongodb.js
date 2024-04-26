require("dotenv").config()
//Mongodb credentials
const uri = process.env.DEV_CREDS

const { MongoClient, ServerApiVersion } = require('mongodb');
//Mongodb client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db("notes_api")
//Get collection "notes" in database "notes_api"
const noteCollection = database.collection("notes")
//Get collection "users" in database "notes_api"
const usersCollection = database.collection("users");

module.exports = {client, noteCollection, usersCollection};