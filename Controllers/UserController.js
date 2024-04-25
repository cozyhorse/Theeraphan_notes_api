const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../mongodb");
const {
  isValidEmail,
  isEmailBody,
  isValidPassword,
} = require("../Util/Validate");
const { hashPassword, compareHash } = require("../Services/bcrypt");
const user = express.Router();

//Get Database
const userDb = client.db("notes_api");
//Get collection "users" in database "notes_api"
const usersCl = userDb.collection("users");

user.use(express.json());

user
  .post("/signup", isEmailBody, async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const newUser = { email, password };

    if (!email) return res.status(400).json({ message: "Email is required" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!password)
      return res.status(400).json({ message: "Password is required" });

    if (!isValidPassword(password))
      return res
        .status(400)
        .json({
          message:
            "Invalid password format, must contain atleast 1 Uppercase and 1 number",
        });

    try {
      const checkExistingUser = await usersCl.findOne({ email: newUser.email });
      if (checkExistingUser)
        return res
          .status(409)
          .json({ success: false, message: "Email already exits" });

//Create new user and insert in collection with hashed password
      await usersCl.insertOne({
        email: email,
        password: await hashPassword(password),
      });
      return res.status(201).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  })

  .post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await usersCl.findOne({ email})

    if(!user)
        return res.status(404).json({ success: false, message: "Email doesn't exists"})

    const isPassword = await compareHash(password, user.password);
    if (!isPassword) {
        return res.status(401).json({
            success: false,
            message: "Invalid password",
        })
    }else{
        res.status(201).json({ success: true,})
    }  

  });

module.exports = { user };
