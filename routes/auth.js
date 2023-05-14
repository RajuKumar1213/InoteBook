const express = require("express");
const router = express.Router();
const User = require("../models/Users");

//create a user using port at "/api/auth" : Not login required
router.post("/" , (req, res)=>{
    res.send(req.body);
    console.log(req.body)

    User.create(req.body);
})

router.get("/login" , (req, res)=>{
    res.send("Hello ogin");
})

module.exports  = router