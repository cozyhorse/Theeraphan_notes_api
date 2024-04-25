const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../mongodb");
const user = express.Router()

//Get Database
const userDb = client.db("notes_api")
//Get collection "users" in database "notes_api"
const usersCl = userDb.collection("users")


user.use(express.json());


user.post("signup", (req,res) => {
    //Add user and hash password
})

.post("login", (req,res) => {
    //login and assign JWT_token
})


module.exports = {user}