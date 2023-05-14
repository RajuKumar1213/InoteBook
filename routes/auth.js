const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { query, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECTET = "iloveshreemadbhagwatgeetaandupnishad@";

//create a user using port at "/api/auth/createuser" : Not login required
router.post("/createuser", [
  query('name', "Enter a valid name").isLength({ min: 3, max: 20 }),
  query('email', "Enter a valid email").isEmail(),
  query('password', "password at least of 5 characters").isLength({ min: 5 }),
], async (req, res) => {

  // if user is not with the valid data then sends error
  const result = validationResult(req.body);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    //finding the user if already presnet in the data base
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.json({ error: "Sorry the user with emait id is alreay exists" });
    }

    var salt = bcrypt.genSaltSync(10);
    const hashPassword =  bcrypt.hashSync(req.body.password, salt);

    //creating the users
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword
    })

    const userId = {
      user: {
        id : user.id
      }
    }
    const authToken = jwt.sign(userId, JWT_SECTET);
    res.json({authToken})

  } catch (error) {
    console.error(error.message)
    res.status(500).send("some error occured");
  }
})



module.exports = router