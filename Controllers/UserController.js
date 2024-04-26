const express = require("express");
const { client } = require("../mongodb");
const {isRegisterBody} = require("../Util/Validate");
const { hashPassword, compareHash } = require("../Model/bcrypt");
const Ajv = require("ajv");
const { userSchema } = require("../Model/UserSchema");
const jwt = require("jsonwebtoken");
const ajv = new Ajv();
const user = express.Router();

//Get Database
const userDb = client.db("notes_api");
//Get collection "users" in database "notes_api"
const usersCl = userDb.collection("users");

user.use(express.json());

const validate = ajv.compile(userSchema)
user
  .post("/signup", isRegisterBody, async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const newUser = { email, password };

    const valid = validate(newUser);
    if(!valid){
        if(validate.errors[0].dataPath === ".password"){
            return res.status(400).json(
                {
                    message: "Invalid data", 
                    errors: validate.errors[0].message = "Must contain 1 uppercase, 1 number and min 8 character long"
                })
        }else{

            return res.status(400).json(
                {
                    message: "Invalid data", 
                    errors: validate.errors[0].message = "Invalid email format"
                })
        }
    }

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

//Login
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
