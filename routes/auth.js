const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');


const JWT_SECTET = "iloveshreemadbhagwatgeetaandupnishad@";

//ROUTE1 :create a user using port at "/api/auth/createuser" : Not login required
router.post("/createuser", [
  body('name').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req)


  try {

    if (!errors.isEmpty() && errors.errors[0].param === 'email') {
      return res.status(400).send(success,'Invalid email address. Please try again.')
    }
    if (!errors.isEmpty() && errors.errors[0].param === 'name') {
      return res.status(400).send(success,'Enter a valid name.')
    }
    if (!errors.isEmpty() && errors.errors[0].param === 'password') {
      return res
        .status(400)
        .send(success,'Password must be longer than 6 characters.')
    }

    //finding the user if already presnet in the data base
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.json({ success,error: "Sorry the user with email id is alreay exists" });
    }

    var salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    //creating the users
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword
    })

    const userId = {
      user: {
        id: user.id
      }
    }
    // creating the jwt token using the user id and secret code 
    const authToken = jwt.sign(userId, JWT_SECTET);
    success = true;
    res.json({success, authToken })

  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
  }
})

// ROUTE2 :Authenticate a user using port at "/api/auth/login" : Not login required

router.post("/login", [
  body('email', "Enter a valid email").isEmail(),
  body('password', "Password cannot be black").exists()
], async (req, res) => {

  let success = false;
  // if user is not with the valid data then sends bad request and  error
  const result = validationResult(req.body);
  if (!result.isEmpty()) {
    return res.status(400).json({ success, error: error.array() });
  }

  //destructuring from the req.body
  const { email, password } = req.body;

  //find the user form date base 
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ success, error: "Login with correct credendials" });

    }
    bcrypt.compare(password, user.password, function (err, comparePassword) {
      if (!comparePassword) {
        return res.status(400).json({ success, error: "Login with correct credendials" });
      }
      const userId = {
        user: {
          id: user.id
        }
      }
      // creating the jwt token using the user id and secret code 
      const authToken = jwt.sign(userId, JWT_SECTET);
      success = true;
      res.json({ success, authToken })

    });


  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
  }
})

// ROUTE3 :get logged in a user using port at "/api/auth/getuser" :  Login required

router.post("/getuser", fetchUser, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select("-password"); //  this will find user except password
    res.send(user);

  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
  }

})

module.exports = router