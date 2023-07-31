const express = require('express');
const router = express.Router()
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwrsecret = "MYNameisJashandeepSInghjoharmukts"
const bcrypt = require("bcryptjs");


router.post("/createuser",
    [
        body('email').isEmail(),
        body('name').isLength({ min: 5 }),
        body('password').isLength({ min: 5 }),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        let secPassword= await bcrypt.hash(req.body.password, salt)

        try {
            User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your account Succefully created! "
            })
        }
        catch (error) {
            console.log(error);
            res.json({ Success: false })
        }
    });



router.post("/login", [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;
    try {
        let userdata = await User.findOne({ email });
        if (!userdata) {
            return res.status(400).json({ errors: "Login with correct details " });
        }

        const pwdCompare = await bcrypt.compare(req.body.password, userdata.password)
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Login with correct details" });
        }


        const data = {
            user:{
                id:userdata.id
            }
        }

        const authToken = jwt.sign(data, jwrsecret)
        res.json({ Success: true,authToken:authToken })
    }
    catch (error) {
        console.log(error);
        res.json({ Success: false })
    }
});

module.exports = router;