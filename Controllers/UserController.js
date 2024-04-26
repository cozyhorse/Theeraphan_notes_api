const express = require("express");
const { client, usersCollection } = require("../mongodb");
const { isRegisterBody } = require("../Util/Validate");
const { hashPassword, compareHash } = require("../Model/bcrypt");
const Ajv = require("ajv");
const { userSchema } = require("../Model/UserSchema");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../Model/jwt");
const ajv = new Ajv();
const user = express.Router();



user.use(express.json());
//compile userSchema
const validate = ajv.compile(userSchema);

//Signup post
user
  .post("/signup", isRegisterBody, async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const newUser = { email, password };

    const valid = validate(newUser);
    if (!valid) {
      if (validate.errors[0].dataPath === ".password") {
        return res.status(400).json({
          message: "Invalid data",
          errors: (validate.errors[0].message =
            "Must contain 1 uppercase, 1 number and min 8 character long"),
        });
      } else {
        return res.status(400).json({
          message: "Invalid data",
          errors: (validate.errors[0].message = "Invalid email format"),
        });
      }
    }

    try {
      const checkExistingUser = await usersCollection.findOne({
        email: newUser.email,
      });
      if (checkExistingUser)
        return res
          .status(409)
          .json({ success: false, message: "Email already exits" });

      //Create new user and insert in collection with hashed password
      await usersCollection.insertOne({
        email: email,
        password: await hashPassword(password),
      });
      return res.status(201).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  })

  //Login post
  .post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Email doesn't exists" });

    //check password
    const isPassword = await compareHash(password, user.password);
    if (!isPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    } else {
      //assign token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(201).json({ success: true, token: token });
    }
  })

  .get("/all", verifyToken, async (req, res) => {
    const userId = req.user.id;
    console.log("userId", userId);
    const allusers = await usersCollection.find({}).toArray();
    return res.status(200).json(allusers);
  })

module.exports = { user };
