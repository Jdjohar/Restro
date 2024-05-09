const express = require('express');
const router = express.Router();
const momentTimezone = require('moment-timezone');
const User = require('../models/User');
const Restaurant = require('../models/Restaurent')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwrsecret = "MYNameisJashandeepSInghjoharmukts"
const bcrypt = require("bcryptjs");
const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')
const Items = require('../models/Items')
const Menu = require('../models/Menu')
const WeeklyOffers= require('../models/WeeklyOffers')
const Offers= require('../models/Offers');
const Product= require('../models/Product');
const Store= require('../models/Store');
const Team= require('../models/Team')
const UserPreference = require('../models/UserPreference');
const Storedatapreference = require('../models/Storedatapreference');
const BusinessPreference = require('../models/Businesspreference')
const Business = require('../models/Business');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// const Retailer = require('../models/Retailer')
// const WeeklyOffers require
// const ViewMenu = require('../models/')



const Tesseract = require('tesseract.js');
const multer = require('multer');
const Service = require('../models/Service');
const Restaurent = require('../models/Restaurent');
const Imageschema = require('../models/Imageschema')
const storage = multer.memoryStorage();
const upload = multer({ storage })

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dlq5b1jed',
    api_key: '249495292915953',
    api_secret: '7Sqyit1Cc5VeuPfm1OEFWTI5i7I',
  });

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const { imageName, category } = req.body;
      const { file } = req;
  
      if (!file) {
        return res.status(400).json({ error: 'No image file provided' });
      }
  
      const result = await cloudinary.uploader.upload(file.buffer);
      const imageUrl = { name: imageName, category, url: result.secure_url };
  
      // Save imageUrl to the database (e.g., using Mongoose)
      const newImage = new Image({
        imageName,
        imageUrl: result.secure_url,
        category,
      });
      await newImage.save();
  
      res.status(200).json(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
});

router.post('/saveImage', async (req, res) => {
    try {
      const { imageName, imageUrl, category } = req.body;
      // Create a new image instance using your Mongoose model
      const newImage = new Imageschema({
        imageName,
        imageUrl,
        category,
      });
      // Save the image details to MongoDB
      const savedImage = await newImage.save();
      res.json(savedImage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get('/images', async (req, res) => {
    try {
      const images = await Imageschema.find(); // Assuming Image is your Mongoose model
      res.status(200).json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Failed to fetch images' });
    }
});

  router.post("/addteammember", [
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('number').isNumeric(),
    body('password').isLength({ min: 4 }),
], async (req, res) => {
    const errors = validationResult(req);
    let authtoken = req.headers.authorization;
    try {
    // Verify JWT token
    const decodedToken = jwt.verify(authtoken, jwrsecret);
    console.log(decodedToken);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
        const email = req.body.email;
        const existingUser = await User.findOne({ email: email });
        const existingTeamMember = await Team.findOne({ email: email});

        if (existingUser ||existingTeamMember) {
            console.log('Email already registered:', email);
            return res.status(400).json({
                success: false,
                message: "This Email ID is already registered!"
            });
        } else {
            const salt = await bcrypt.genSalt(10);
            const sectmemberPassword = await bcrypt.hash(req.body.password, salt);

            await Team.create({
                merchantid: req.body.userid,
                signuptype: req.body.signuptype,
                name: req.body.name,
                password: sectmemberPassword,
                email: req.body.email,
                number: req.body.number,
                isTeammember: true,
                signupMethod: 'email',
            });

            return res.json({
                success: true,
                message: "Congratulations! Your Team member has been successfully added!"
            });
        }
    }catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});
  
// router.post("/addteammember", [
//     body('email').isEmail(),
//     body('name').isLength({ min: 3 }),
//     body('number').isNumeric(),
//     body('password').isLength({ min: 4 }),
//     body('signuptype').isIn(['Restaurant', 'Retailer', 'Service Provider']),
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const email = req.body.email;
//         const signuptype = req.body.signuptype;
//         const existingTeamMember = await Team.findOne({ email: email, signuptype: signuptype });

//         if (existingTeamMember) {
//             console.log('Email already registered:', email, signuptype);
//             return res.status(400).json({
//                 success: false,
//                 message: "This Email ID is already registered as a team member!"
//             });
//         } else {
//             const salt = await bcrypt.genSalt(10);
//             const sectmemberPassword = await bcrypt.hash(req.body.password, salt);

//             await Team.create({
//                 userid: req.body.userid,
//                 signuptype: signuptype,
//                 name: req.body.name,
//                 password: sectmemberPassword,
//                 email: req.body.email,
//                 number: req.body.number,
//             });

//             return res.json({
//                 success: true,
//                 message: "Congratulations! Your Team member has been successfully added!"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });

router.get('/teammemberdata/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);

        const teammemberdata = (await Team.find({ merchantid: userid}));
        res.json(teammemberdata);
    }  catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getteamdata/:teamid', async (req, res) => {
    try {
        const teamid = req.params.teamid;
        console.log(teamid);
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);

        const result = await Team.findById(teamid);

        if (result) {
            res.json({
                Success: true,
                message: "teamdata retrieved successfully",
                team: result
            });
        } else {
            res.status(404).json({
                Success: false,
                message: "teamdata not found"
            });
        }
    } catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({
            Success: false,
            message: "Failed to retrieve teamdata"
        });
    }
});

// Update a restaurant using POST
router.post('/updateteamdata/:teamid', async (req, res) => {
    try {
        const teamid = req.params.teamid;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);


        const updatedteamdata = req.body;
    
        const result = await Team.findByIdAndUpdate(teamid, updatedteamdata, { new: true });
    
        if (result) {
            res.json({
                Success: true,
                message: "teamdata updated successfully",
                team: result
            });
        } else {
            res.status(404).json({
                Success: false,
                message: "teamdata not found"
            });
        }
    } catch (error) {
    console.error(error);
    // Handle token verification errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    // Handle other errors
    res.status(500).json({
        Success: false,
        message: "Failed to update teamdata"
    });
}
});

router.get('/delteammember/:teamid', async (req, res) => {
    try {
        const teamid = req.params.teamid;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);


        const result = await Team.findByIdAndDelete(teamid);

        if (result) {
            res.json({
                Success: true,
                message: "teammember deleted successfully"
            });
        } else {
            res.status(404).json({
                Success: false,
                message: "teammember not found"
            });
        }
    }  catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});
  

// router.post('/upload', upload.single('image'), async (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No image uploaded' });
//     }
  
//     const imageBuffer = req.file.buffer;
  
//     try {
//       const { data } = await Tesseract.recognize(imageBuffer, 'eng');
//       const text = data.text;
//       res.json({ text });
//     } catch (error) {
//       console.error('Text extraction failed:', error);
//       res.status(500).json({ error: 'Text extraction failed' });
//     }
//   });

router.get('/dashboard/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);

        // Fetch dashboard data
        const restaurantCount = await Restaurant.countDocuments({userid:userid});
        const categoryCount = await Category.countDocuments({userid:userid});
        const itemCount = await Items.countDocuments({userid:userid});

        res.json({ restaurantCount, categoryCount, itemCount });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/retailerdashboard/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);

        // Fetch dashboard data
        const retailerCount = await Store.countDocuments({ userid: userid });
        const productCount = await Product.countDocuments({ userid: userid });

        res.json({ retailerCount, productCount });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

// router.get('/retailerdashboard/:userid', async (req, res) => {
//     try {
//         let userid = req.params.userid;
//         const retailerCount = await Store.countDocuments({userid:userid});
//         const productCount = await Product.countDocuments({userid:userid});

//         res.json({ retailerCount,productCount});
//     } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         res.status(500).json({ message: 'Error fetching dashboard data' });
//     }
// });

router.get('/businessdashboard/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);

        // Fetch dashboard data
        const businessCount = await Business.countDocuments({userid:userid});
        const servicesCount = await Service.countDocuments({userid:userid});

        res.json({ businessCount,servicesCount});
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

// router.post("/createuser",
//     [
//         body('email').isEmail(),
//         body('name').isLength({ min: 4 }),
//         body('password').isLength({ min: 5 }),
//     ]
//     , async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const salt = await bcrypt.genSalt(10);
//         let secPassword= await bcrypt.hash(req.body.password, salt)

//         try {
//             User.create({
//                 name: req.body.name,
//                 password: secPassword,
//                 email: req.body.email,
//                 location: req.body.location
//             })
//             res.json({ 
//                 Success: true,
//                 message: "Congratulations! Your account Succefully created! "
//             })
//         }
//         catch (error) {
//             console.log(error);
//             res.json({ Success: false })
//         }
//     });

// router.post("/login", [
//     body('email').isEmail(),
//     body('password').isLength({ min: 5 }),
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     let signupMethod = req.body.signupMethod;
//     let email = req.body.email;
//     try {
//         let userdata = await User.findOne({ email });
//         let teamMember  = await Team.findOne({ email });
//         if (!userdata && !teamMember) {
//             return res.status(400).json({ errors: "Invalid email or password" });
//         }
//         if(userdata){
//         const pwdCompare = await bcrypt.compare(req.body.password, userdata.password)
//         if (!pwdCompare) {
//             return res.status(400).json({ errors: "Invalid email or password" });
//         }
       
//         if (userdata.signupMethod != signupMethod) {
//             return res.status(400).json({ errors: "You can try with social login" });
//         }


//         const data = {
//             user:{
//                 id:userdata.id
//             }
//         }
//         const authToken = jwt.sign(data, jwrsecret)
//         res.json({ Success: true,
//             authToken:authToken,
//             userid: userdata.id, 
//             merchantid: userdata.id, 
//             signuptype: userdata.signuptype, 
//             isTeammember:userdata.isTeammember
//         })
//     }
//     if(teamMember){
//     const pwdCompare = await bcrypt.compare(req.body.password, teamMember.password)
//     if (!pwdCompare) {
//         return res.status(400).json({ errors: "Invalid email or password" });
//     }

//     if (teamMember.signupMethod != signupMethod) {
//         return res.status(400).json({ errors: "You can try with social login" });
//     }

//     const matchingUser = await User.findOne({ userid: teamMember.merchantid, signuptype: teamMember.signuptype });
//     if (!matchingUser) {
//         return res.status(400).json({ errors: "Invalid team member data" });
//     }
//     else{
//         const data = {
//             user:{
//                 id:teamMember.id
//             }
//         }
        
//         const authToken = jwt.sign(data, jwrsecret)
//         res.json({ Success: true,
//             authToken:authToken,
//             userid: teamMember.id, 
//             merchantid: teamMember.merchantid, 
//             signuptype: teamMember.signuptype, 
//             isTeammember:teamMember.isTeammember,
//             errors: "team member data matched" 
//         })
//         // return res.status(400).json({ errors: "team member data matched" });
//     }

//     // const data = {
//     //     user:{
//     //         id:teamMember.id
//     //     }
//     // }
//     // const authToken = jwt.sign(data, jwrsecret)
//     // res.json({ Success: true,
//     //     authToken:authToken,
//     //     userid: teamMember.id, 
//     //     merchantid: teamMember.merchantid, 
//     //     signuptype: teamMember.signuptype, 
//     //     isTeammember:teamMember.isTeammember
//     // })
// }

        



//         // Send welcome email based on whether it's the first-time login or repeat login
//             // sendWelcomeEmail(userdata.email, userdata.name, false);

//         // const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
//         // res.json({ Success: true,authToken:authToken,userid: userdata.id, signuptype: userdata.signuptype})
//     }
//     catch (error) {
//         console.log(error);
//         res.status(400).json({ Success: false })
//     }
// });

router.post("/login", [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let signupMethod = req.body.signupMethod;
    let email = req.body.email;

    try {
        let userdata = await User.findOne({ email });
        let teamMember = await Team.findOne({ email });

        if (!userdata && !teamMember) {
            return res.status(400).json({ errors: "Invalid email or password" });
        } else if (userdata) {
            const pwdCompare = await bcrypt.compare(req.body.password, userdata.password);
            if (!pwdCompare) {
                return res.status(400).json({ errors: "Invalid email or password" });
            }

            if (userdata.signupMethod != signupMethod) {
                return res.status(400).json({ errors: "You can try with social login" });
            }

            const data = {
                user: {
                    id: userdata.id
                }
            };
            const authToken = jwt.sign(data, jwrsecret);
            return res.json({
                Success: true,
                authToken: authToken,
                userid: userdata.id,
                merchantid: userdata.id,
                signuptype: userdata.signuptype,
                isTeammember: userdata.isTeammember
            });
        } else if (teamMember) {
            const pwdCompare = await bcrypt.compare(req.body.password, teamMember.password);
            if (!pwdCompare) {
                return res.status(400).json({ errors: "Invalid email or password" });
            }

            if (teamMember.signupMethod != signupMethod) {
                return res.status(400).json({ errors: "You can try with social login" });
            }

            const matchingUser = await User.findOne({ userid: teamMember.merchantid, signuptype: teamMember.signuptype });
            if (!matchingUser) {
                return res.status(400).json({ errors: "Invalid team member data" });
            } else {
                const data = {
                    user: {
                        id: teamMember.id
                    }
                };

                const authToken = jwt.sign(data, jwrsecret);
                return res.json({
                    Success: true,
                    authToken: authToken,
                    userid: teamMember.id,
                    merchantid: teamMember.merchantid,
                    signuptype: teamMember.signuptype,
                    isTeammember: teamMember.isTeammember,
                    errors: "team member data matched"
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ Success: false });
    }
});


router.post("/createuser", async (req, res) => {
    const { name, email, password, location, signupMethod ,signuptype} = req.body;


    // Continue with user creation based on the signup method
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(password, salt);
    // Validate input based on the signup method (e.g., for email signup)
    if (signupMethod === "email") {
        try {
            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            const existingTeamMember = await Team.findOne({ email });
            if (existingUser || existingTeamMember) {
                return res.status(400).json({ 
                    Success: false, 
                    message: "User with this email already exists." 
                });
            }

            console.log("Before user creation");
            // Create a new user
            const newUser = await User.create({
                name,
                password: secPassword,
                email,
                location,
                signupMethod,
                signuptype
            });
            console.log("After user creation");
            // Send a welcome email to the user
            // sendWelcomeEmail(email,name);


            // sendWelcomeEmail(email, name, true);

            return res.json({
                Success: true,
                message:"EMail ",
                message: "Congratulations! Your account has been successfully created!",
                userId: newUser.id,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ Success: false, message: "Internal Server Error" });
        }
    } 
        else if (signupMethod === "google") {
        // Handle Google signup
        // You can add custom validation for Google signup here
        let userdata = await User.findOne({ email: email });
        if (!userdata) {
            try {
                // let userdata = await User.findOne({ email });
                let userdata = await User.create({
                    name,
                    signuptype,
                    password: secPassword,
                    email,
                    location,
                    signupMethod,
                });

                // sendWelcomeEmail(email, name, true);
                // let userdata = await User.findOne({ email });
                const data = {
                    user:{
                        id:userdata.id
                    }
                }
                const authToken = jwt.sign(data, jwrsecret)
                const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
                return res.json({ Success: true,
                    authToken:authToken,
                    userid: userdata.id, 
                    merchantid: userdata.id, 
                    requiresignuptype: signuptypedb, 
                    signuptype: userdata.signuptype})
        
            } catch (error) {
                console.log(error);
                res.json({ Success: false, message: 'User with this email already exist' });
            }
        }else{
        if (userdata.signupMethod == signupMethod) {


        const data = {
            user:{
                id:userdata.id
            }
        }
        // sendWelcomeEmail(userdata.email, userdata.name, false);

        const authToken = jwt.sign(data, jwrsecret)
        const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
        return res.json({ 
            Success: true,
            authToken:authToken,
            signup:userdata.signupMethod,
            userid: userdata.id, 
            merchantid: userdata.id, 
            message:"Google ",
            requiresignuptype: signuptypedb, 
            signuptype: userdata.signuptype
        })
    }else{
        res.json({ Success: false, 
            message: 'xyz' , 
            errors: "This google email is already logged in with email"
        });
    }
    }
    } else if (signupMethod === "facebook") {
        
        // Handle Google signup
        // You can add custom validation for Google signup here
        let userdata = await User.findOne({ email });
        if (!userdata) {
            try {
                let userdata = await User.create({
                    name,
                    password: secPassword,
                    email,
                    location,
                    signupMethod,
                    signuptype
                });
            // sendWelcomeEmail(email, name, true);
                // let userdata = await User.findOne({ email });
                const data = {
                    user:{
                        id:userdata.id
                    }
                }
                const authToken = jwt.sign(data, jwrsecret)
                const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
                return res.json({ 
                    Success: true,
                    authToken:authToken,
                    userid: userdata.id, 
                    merchantid: userdata.id, 
                    message:"Google 2 ",
                    requiresignuptype: signuptypedb, 
                    signuptype: userdata.signuptype
                
                })
        
            } catch (error) {
                console.log(error);
                res.json({ Success: false });
            }
        }else{
        if (userdata.signupMethod == signupMethod) {


        const data = {
            user:{
                id:userdata.id
            }
        }
        // sendWelcomeEmail(userdata.email, userdata.name, false);

        const authToken = jwt.sign(data, jwrsecret)
        const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
        return res.json({ 
            Success: true,
            message:"Facebook ",
            authToken:authToken,
            userid: userdata.id, 
            merchantid: userdata.id, 
            requiresignuptype: signuptypedb, 
            signuptype: userdata.signuptype
        })
    }else{
        res.json({ Success: false, 
            message: 'xyz' ,
            errors: "This facebook email is already logged in with email" 
        });
    }
    }
}

});

// Function to send a welcome email
function sendWelcomeEmail(userEmail, name, isFirstTimeLogin) {
    const subject = isFirstTimeLogin ? 'Welcome to Our Platform!' : 'Welcome Back to Menu Moji!';
    const message = isFirstTimeLogin ?
        `<html xmlns:v="urn:schemas-microsoft-com:vml">
        <head></head>
        <body style="background-color:#c5c1c187; margin-top: 40px;">
            <section style="font-family:sans-serif; width: 60%; margin: auto;">
                <header style="background-color: #fff; padding: 20px; border: 1px solid #faf8f8;">
                    <div style="width: 100%; margin: auto; display: flex; align-items: center;">
                        <div style="width: 40%;">
                            <img src="welcome.jpg" alt="welcome image">
                        </div>
                        <div style="width: 60%;">
                            <h2>Menu Moji</h2>
                        </div>
                        <div style="clear:both ;"></div>
                    </div>

                    <div>
                        <h2>🌟 Welcome to Menu Moji</h2>
                        <p>Hi ${name},</p>
                        <p>Thank you for choosing Menu Moji! We're thrilled to have you on board. Get ready to embark on a delightful journey of culinary exploration with us.</p>
                        <p>Savor the experience,</p>
                        <p>The Menu Moji Team</p>
                    </div>
                </header>
                <footer style="background-color:#f5f5f587; border: 1px solid #f5f5f587; padding: 20px; color: #888; text-align: center;">
                    <div>
                        <p>&copy; 2024 Menu Moji. All rights reserved.</p>
                        <p>Contact us: info@menumoji.com | Phone: (555) 123-4567</p>
                        <h4>Available On</h4>
                        <div>
                            <ul style="text-align: center;display: inline-flex;list-style:none;padding-left:0px">
                                <li>
                                    <a href="">
                                        <img src="https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico" alt="facebook icon" style="margin: 0px 5px;">
                                        <!-- <i class="fa-brands fa-square-facebook" style="font-size: 25px; margin: 0px 5px; color: #888;"></i> -->
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <img src="https://static.cdninstagram.com/rsrc.php/y4/r/QaBlI0OZiks.ico" alt="instagram icon" style="margin: 0px 5px;">
                                        <!-- <i class="fa-brands fa-square-facebook" style="font-size: 25px; margin: 0px 5px; color: #888;"></i> -->
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </section>
        </body>
    </html>` :
    `<html xmlns:v="urn:schemas-microsoft-com:vml">
        <head></head>
        <body style="background-color:#c5c1c187; margin-top: 40px;">
            <section style="font-family:sans-serif; width: 60%; margin: auto;">
                <header style="background-color: #fff; padding: 20px; border: 1px solid #faf8f8;">
                    <div style="width: 100%; margin: auto; display: flex; align-items: center;">
                        <div style="width: 40%;">
                            <img src="welcome.jpg" alt="welcome image">
                        </div>
                        <div style="width: 60%;">
                            <h2>Menu Moji</h2>
                        </div>
                        <div style="clear:both ;"></div>
                    </div>

                    <div>
                        <p>Dear ${name},</p>
                        <p>We're thrilled to have you back on Menu Moji! Explore our latest updates and discover exciting culinary experiences. Your next delightful meal is just a click away.</p>
                        <p>Happy exploring,</p>
                        <p>The Menu Moji Team</p>
                    </div>
                </header>
                <footer style="background-color:#f5f5f587; border: 1px solid #f5f5f587; padding: 20px; color: #888; text-align: center;">
                    <div>
                        <p>&copy; 2024 Menu Moji. All rights reserved.</p>
                        <p>Contact us: info@menumoji.com | Phone: (555) 123-4567</p>
                        <h4>Available On</h4>
                        <div>
                            <ul style="text-align: center;display: inline-flex;list-style:none;padding-left:0px">
                                <li>
                                    <a href="">
                                        <img src="https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico" alt="facebook icon" style="margin: 0px 5px;">
                                        <!-- <i class="fa-brands fa-square-facebook" style="font-size: 25px; margin: 0px 5px; color: #888;"></i> -->
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <img src="https://static.cdninstagram.com/rsrc.php/y4/r/QaBlI0OZiks.ico" alt="instagram icon" style="margin: 0px 5px;">
                                        <!-- <i class="fa-brands fa-square-facebook" style="font-size: 25px; margin: 0px 5px; color: #888;"></i> -->
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </section>
        </body>
    </html>`    

    const transporter = nodemailer.createTransport({
        // Configure your email sending service (SMTP, API, etc.)
        // Example for sending through Gmail:
        service: 'gmail',
        auth: {
            user: "jdwebservices1@gmail.com",
            pass: "cwoxnbrrxvsjfbmr"
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: userEmail,
        subject: subject,
        html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Function to send a welcome email
// function sendWelcomeEmail(userEmail,name) {
//     const transporter = nodemailer.createTransport({
//         // Configure your email sending service (SMTP, API, etc.)
//         // Example for sending through Gmail:
//         service: 'gmail',
//         auth: {
//             user: "jdwebservices1@gmail.com",
//             pass: "cwoxnbrrxvsjfbmr"
//         },
//     });

//     const mailOptions = {
//         from: 'your-email@gmail.com',
//         to: userEmail,
//         subject: 'Welcome!',
//         html: `
//         <html xmlns:v="urn:schemas-microsoft-com:vml">
//             <head></head>
//             <body style="background-color:#c5c1c187; margin-top: 40px;">
//                 <section style="font-family:sans-serif; width: 60%; margin: auto;">
//                     <header style="background-color: #fff; padding: 20px; border: 1px solid #faf8f8;">
//                         <div style="width: 100%; margin: auto; display: flex; align-items: center;">
//                             <div style="width: 40%;">
//                                 <img src="welcome.jpg" alt="welcome image">
//                             </div>
//                             <div style="width: 60%;">
//                                 <h2>Menu Moji</h2>
//                             </div>
//                             <div style="clear:both ;"></div>
//                         </div>

//                         <div>
//                             <h2>🌟 Welcome to Menu Moji</h2>
//                             <p>Hi ${name},</p>
//                             <p>Thank you for choosing Menu Moji! We're thrilled to have you on board. Get ready to embark on a delightful journey of culinary exploration with us.</p>
//                             <p>Savor the experience,</p>
//                             <p>The Menu Moji Team</p>
//                         </div>
//                     </header>
//                     <footer style="background-color:#f5f5f587; border: 1px solid #f5f5f587; padding: 20px; color: #888; text-align: center;">
//                         <div>
//                             <p>&copy; 2024 Menu Moji. All rights reserved.</p>
//                             <p>Contact us: info@menumoji.com | Phone: (555) 123-4567</p>
//                             <h4>Available On</h4>
//                             <div>
//                                 <ul style="text-align: center;display: inline-flex;list-style:none;padding-left:0px">
//                                     <li>
//                                         <a href="">
//                                             <img src="https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico" alt="facebook icon" style="margin: 0px 5px;">
//                                             <!-- <i class="fa-brands fa-square-facebook" style="font-size: 25px; margin: 0px 5px; color: #888;"></i> -->
//                                         </a>
//                                     </li>
//                                     <li>
//                                         <a href="">
//                                             <img src="https://static.cdninstagram.com/rsrc.php/y4/r/QaBlI0OZiks.ico" alt="instagram icon" style="margin: 0px 5px;">
//                                             <!-- <i class="fa-brands fa-square-facebook" style="font-size: 25px; margin: 0px 5px; color: #888;"></i> -->
//                                         </a>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </footer>
//                 </section>
//             </body>
//         </html>
//         `,
//         // text: 'We welcome you! 🎉.Thank you for choosing us. We are here to make your experience exceptional, and we cannot wait for you to explore.Have questions or need assistance? Our support team is here to help! Do not hesitate. We are thrilled to have you on board. If there is anything we can do to enhance your experience, please let us know.',
//     };

    
//     // <p>We welcome you! 🎉</p>
//     // <p>Thank you for choosing us. We are here to make your experience exceptional, and we cannot wait for you to explore.</p>
//     // <p>Have questions or need assistance? Our support team is here to help! Do not hesitate. We are thrilled to have you on board.</p>
//     // <p>If there is anything we can do to enhance your experience, please let us know.</p>
//     // <img src="welcome.jpg" alt="Welcome Image" style="max-width: 100%; height: auto;">

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log('Error sending email:', error);
//         } else {
//             console.log('Email sent:', info.response);
//         }
//     });
// }

const textTemplates = [
    { id: 1, title: 'Template 1', content: 'This is template 1 content' },
    { id: 2, title: 'Template 2', content: 'This is template 2 content' },
    { id: 3, title: 'Template 3', content: 'This is template 3 content' },
  ];
  
  // Endpoint to get text templates
  router.get('/get-text-templates', (req, res) => {
    // Simulating a delay for demonstration purposes (you may not need this in production)
    setTimeout(() => {
      res.json(textTemplates);
    }, 1000); // Delay of 1 second
  });
  
  // Endpoint to get text templates
//   router.get('/get-temp-child/:prname', (req, res) => {
//     const prname = req.params.prname;
//     // Simulating a delay for demonstration purposes (you may not need this in production)
//     setTimeout(() => {
//       res.json({ "width": 1080, "height": 1920, "fonts": [ ], "pages": [ { "id": "5lLkFnkbio", "children": [ { "id": "XuRY4xDGlE", "type": "text", "x": 234.49999999999946, "y": 307.0536585365851, "rotation": 0, "opacity": 1, "locked": false, "blurEnabled": false, "blurRadius": 10, "brightnessEnabled": false, "brightness": 0, "sepiaEnabled": false, "grayscaleEnabled": false, "shadowEnabled": false, "shadowBlur": 5, "shadowOffsetX": 0, "shadowOffsetY": 0, "shadowColor": "black", "selectable": true, "alwaysOnTop": false, "showInExport": true, "text": "SALE", "placeholder": "", "fontSize": 108, "fontFamily": "Archivo Black", "fontStyle": "normal", "fontWeight": "normal", "textDecoration": "", "fill": "rgba(246,155,165,1)", "align": "center", "width": 471, "height": 129.6, "strokeWidth": 0, "stroke": "black", "lineHeight": 1.2, "letterSpacing": 0.3 }, { "id": "sYD2eEfY1Q", "type": "text", "x": 234.49999997999998, "y": 166.78048780487805, "rotation": 0, "opacity": 1, "locked": false, "blurEnabled": false, "blurRadius": 10, "brightnessEnabled": false, "brightness": 0, "sepiaEnabled": false, "grayscaleEnabled": false, "shadowEnabled": false, "shadowBlur": 5, "shadowOffsetX": 0, "shadowOffsetY": 0, "shadowColor": "black", "selectable": true, "alwaysOnTop": false, "showInExport": true, "text": "SALE", "placeholder": "", "fontSize": 108, "fontFamily": "Archivo Black", "fontStyle": "normal", "fontWeight": "normal", "textDecoration": "", "fill": "rgba(252,132,113,1)", "align": "center", "width": 471, "height": 129.6, "strokeWidth": 0, "stroke": "black", "lineHeight": 1.2, "letterSpacing": 0.3 }, { "id": "P0zwBJLL_q", "type": "text", "x": 234.4999999800001, "y": 446.18048780487806, "rotation": 0, "opacity": 1, "locked": false, "blurEnabled": false, "blurRadius": 10, "brightnessEnabled": false, "brightness": 0, "sepiaEnabled": false, "grayscaleEnabled": false, "shadowEnabled": false, "shadowBlur": 5, "shadowOffsetX": 0, "shadowOffsetY": 0, "shadowColor": "black", "selectable": true, "alwaysOnTop": false, "showInExport": true, "text": prname, "placeholder": "", "fontSize": 108, "fontFamily": "Archivo Black", "fontStyle": "normal", "fontWeight": "normal", "textDecoration": "", "fill": "rgba(253,132,76,1)", "align": "center", "width": 471, "height": 129.6, "strokeWidth": 0, "stroke": "black", "lineHeight": 1.2, "letterSpacing": 0.3 }, { "id": "ZoyzsNt--X", "type": "text", "x": 309.5000000099996, "y": 619.297560975608, "rotation": 0, "opacity": 1, "locked": false, "blurEnabled": false, "blurRadius": 10, "brightnessEnabled": false, "brightness": 0, "sepiaEnabled": false, "grayscaleEnabled": false, "shadowEnabled": false, "shadowBlur": 5, "shadowOffsetX": 0, "shadowOffsetY": 0, "shadowColor": "black", "selectable": true, "alwaysOnTop": false, "showInExport": true, "text": "20% OFF DRESSES", "placeholder": "", "fontSize": 33, "fontFamily": "Alata", "fontStyle": "normal", "fontWeight": "normal", "textDecoration": "", "fill": "rgba(253,132,76,1)", "align": "center", "width": 321, "height": 39.6, "strokeWidth": 0, "stroke": "black", "lineHeight": 1.2, "letterSpacing": 0 }, { "id": "JJ99hYSmvy", "type": "svg", "x": 665.995121951217, "y": 575.7804878048781, "rotation": 0, "opacity": 1, "locked": false, "blurEnabled": false, "blurRadius": 10, "brightnessEnabled": false, "brightness": 0, "sepiaEnabled": false, "grayscaleEnabled": false, "shadowEnabled": false, "shadowBlur": 5, "shadowOffsetX": 0, "shadowOffsetY": 0, "shadowColor": "black", "selectable": true, "alwaysOnTop": false, "showInExport": true, "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIHN0cm9rZT0icmdiYSg5OCwgMTk3LCAyNTUsIDEpIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIC8+PC9zdmc+", "maskSrc": "", "cropX": 0, "cropY": 0, "cropWidth": 1, "cropHeight": 1, "keepRatio": false, "flipX": false, "flipY": false, "width": 648.3144394334888, "height": 648.314439433489, "borderColor": "black", "borderSize": 0, "colorsReplace": { "rgba(98, 197, 255, 1)": "rgba(246,150,106,1)" } }, { "id": "vLQg5PhfVG", "type": "svg", "x": -244.98048780488094, "y": -496.40712236031993, "rotation": 0, "opacity": 1, "locked": false, "blurEnabled": false, "blurRadius": 10, "brightnessEnabled": false, "brightness": 0, "sepiaEnabled": false, "grayscaleEnabled": false, "shadowEnabled": false, "shadowBlur": 5, "shadowOffsetX": 0, "shadowOffsetY": 0, "shadowColor": "black", "selectable": true, "alwaysOnTop": false, "showInExport": true, "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIHN0cm9rZT0icmdiYSg5OCwgMTk3LCAyNTUsIDEpIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIC8+PC9zdmc+", "maskSrc": "", "cropX": 0, "cropY": 0, "cropWidth": 1, "cropHeight": 1, "keepRatio": false, "flipX": false, "flipY": false, "width": 613.7193174822689, "height": 613.719317482269, "borderColor": "black", "borderSize": 0, "colorsReplace": { "rgba(98, 197, 255, 1)": "rgba(245,161,122,1)" } }, { "id": "JILToBuQH4", "type": "svg", "x": -91.25365853658712, "y": 510.98048780487807, "rotation": 0, "opacity": 1, "locked": false, "blurEnabled": false, "blurRadius": 10, "brightnessEnabled": false, "brightness": 0, "sepiaEnabled": false, "grayscaleEnabled": false, "shadowEnabled": false, "shadowBlur": 5, "shadowOffsetX": 0, "shadowOffsetY": 0, "shadowColor": "black", "selectable": true, "alwaysOnTop": false, "showInExport": true, "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9InJnYigwLCAxNjEsIDI1NSkiIC8+PC9zdmc+", "maskSrc": "", "cropX": 0, "cropY": 0, "cropWidth": 1, "cropHeight": 1, "keepRatio": false, "flipX": false, "flipY": false, "width": 346.91518574935515, "height": 346.9151857493551, "borderColor": "black", "borderSize": 0, "colorsReplace": { "rgb(0, 161, 255)": "rgba(253,132,76,1)" } }, { "id": "bEkov_3Pgz", "type": "svg", "x": 630.5000000099997, "y": -162.64014654601465, "rotation": 0, "opacity": 1, "locked": false, "blurEnabled": false, "blurRadius": 10, "brightnessEnabled": false, "brightness": 0, "sepiaEnabled": false, "grayscaleEnabled": false, "shadowEnabled": false, "shadowBlur": 5, "shadowOffsetX": 0, "shadowOffsetY": 0, "shadowColor": "black", "selectable": true, "alwaysOnTop": false, "showInExport": true, "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9InJnYigwLCAxNjEsIDI1NSkiIC8+PC9zdmc+", "maskSrc": "", "cropX": 0, "cropY": 0, "cropWidth": 1, "cropHeight": 1, "keepRatio": false, "flipX": false, "flipY": false, "width": 346.91518574935515, "height": 346.9151857493551, "borderColor": "black", "borderSize": 0, "colorsReplace": { "rgb(0, 161, 255)": "rgba(246,155,165,1)" } } ], "background": "rgba(252,225,246,1)" } ] });
//     }, 1000); // Delay of 1 second
//   });


//   router.get('/get-temp-child/:storeeid', async (req, res) => {
//     const storeId = req.params.storeeid; 
//     console.log('storeId:->', storeId);
//     const products = await Product.find({ storeId });
//     console.log(products, 'products');
//        setTimeout(() => {
//       res.json({
//         "width":595.2755905511812,"height":841.8897637795276,"fonts":[],"pages":[{"id":"tDi3l61_B9","children":[{"id":"DUx6gtjVOa","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.39468806800201,"y":57.67928085646459,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":`${products[0].name}`,"placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"2pXMkrOGZX","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.0788883391855,"y":60.08142540503907,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"ycH54Bchqv","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":163.95456515719587,"y":57.40369030528343,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":`${products[0].price}`,"placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"2eVkRbKzFP","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":496.63876542837914,"y":59.80583485385792,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"e_hpE2Rbsi","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688038025393,"y":78.97071314777601,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":`${products[0].description}`,"placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"aF6v_WpETc","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.0788883092089,"y":81.37285769635044,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"NWpy5JviOG","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688058002068,"y":118.5083335836006,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"2eh_hd3f7n","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.0788883291855,"y":118.78392413478176,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"ipxfkWgdoh","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":26.158829228877273,"y":181.58025189789322,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"MhJJmiX5hJ","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":358.8430295000607,"y":183.98239644646765,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"B2kSxWNHzN","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":26.158829228877273,"y":248.41765787274068,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"XIKMzwiBx0","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":358.8430295000607,"y":250.8198024213151,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"a1AvhllEMx","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":164.54625061047233,"y":118.23274303241945,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"3tgkkWKo5X","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":497.2304508816559,"y":120.63488758099388,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"IP-QMEUT_t","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":168.3103917813475,"y":181.30466134671204,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"Yo4MXHGmGP","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":500.994592052531,"y":183.70680589528655,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"k55CH_uNNR","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":168.3103917813475,"y":248.14206732155947,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"eDl8_HqyWY","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":500.994592052531,"y":250.5442118701339,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"b8KwsLCOXN","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688028025364,"y":139.79976587491203,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"T_RQNg4ix1","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.07888829920876,"y":142.2019104234865,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"d4S31_nRrM","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688028025392,"y":202.87168418920467,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"w99VxXy3L4","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.07888829920887,"y":205.2738287377792,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"gpTP4V9APM","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688068002004,"y":269.70909016405204,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"OzL2sOxSQK","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.0788883391855,"y":272.1112347126264,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5}],"width":"auto","height":"auto","background":"white","bleed":0,"duration":5000}],"unit":"cm","dpi":72});
//     }, 1000); // Delay of 1 second
//   });

  router.get('/get-temp-child/:storeeid', async (req, res) => {
    const storeId = req.params.storeeid; 
    console.log('storeId:->', storeId);
    const products = await Product.find({ storeId });
    console.log(products, 'products');
    const productsCount = products.length;
    console.log('Number of productsCount:', productsCount);
    const children = [
        {
            "id": "DUx6gtjVOa",
            "type": "text",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 22.39468806800201,
            "y": 57.67928085646459,
            "width": 104,
            "height": 16,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "text": "Shirt",
            "placeholder": "",
            "fontSize": 12,
            "fontFamily": "Roboto",
            "fontStyle": "normal",
            "fontWeight": "bold",
            "textDecoration": "",
            "fill": "black",
            "align": "left",
            "verticalAlign": "top",
            "strokeWidth": 0,
            "stroke": "black",
            "lineHeight": 1.2,
            "letterSpacing": 0,
            "backgroundEnabled": false,
            "backgroundColor": "#7ED321",
            "backgroundOpacity": 1,
            "backgroundCornerRadius": 0.5,
            "backgroundPadding": 0.5
          },
          {
            "id": "2pXMkrOGZX",
            "type": "text",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 355.0788883391855,
            "y": 60.08142540503907,
            "width": 104,
            "height": 16,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "text": "Marketing package",
            "placeholder": "",
            "fontSize": 12,
            "fontFamily": "Roboto",
            "fontStyle": "normal",
            "fontWeight": "bold",
            "textDecoration": "",
            "fill": "black",
            "align": "left",
            "verticalAlign": "top",
            "strokeWidth": 0,
            "stroke": "black",
            "lineHeight": 1.2,
            "letterSpacing": 0,
            "backgroundEnabled": false,
            "backgroundColor": "#7ED321",
            "backgroundOpacity": 1,
            "backgroundCornerRadius": 0.5,
            "backgroundPadding": 0.5
          },
        //   {
        //     "id": "ycH54Bchqv",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 163.95456515719587,
        //     "y": 57.40369030528343,
        //     "width": 40.60932680974247,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "200",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "right",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "2eVkRbKzFP",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 496.63876542837914,
        //     "y": 59.80583485385792,
        //     "width": 40.60932680974247,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "$40",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "right",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "e_hpE2Rbsi",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 22.394688038025393,
        //     "y": 78.97071314777601,
        //     "width": 183,
        //     "height": 13,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5.0000000000216875,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Shirt",
        //     "placeholder": "",
        //     "fontSize": 10,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "aF6v_WpETc",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 355.0788883092089,
        //     "y": 81.37285769635044,
        //     "width": 183,
        //     "height": 25,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5.0000000000216875,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package Marketing packageMarketing package ",
        //     "placeholder": "",
        //     "fontSize": 10,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "NWpy5JviOG",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 22.394688058002068,
        //     "y": 118.5083335836006,
        //     "width": 104,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Roboto",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "2eh_hd3f7n",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 355.0788883291855,
        //     "y": 118.78392413478176,
        //     "width": 104,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Roboto",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "ipxfkWgdoh",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 26.158829228877273,
        //     "y": 181.58025189789322,
        //     "width": 104,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Roboto",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "MhJJmiX5hJ",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 358.8430295000607,
        //     "y": 183.98239644646765,
        //     "width": 104,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Roboto",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        // },
        //   {
        //     "id": "B2kSxWNHzN",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 26.158829228877273,
        //     "y": 248.41765787274068,
        //     "width": 104,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Roboto",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "XIKMzwiBx0",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 358.8430295000607,
        //     "y": 250.8198024213151,
        //     "width": 104,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Roboto",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
          {
            "id": "a1AvhllEMx",
            "type": "text",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 164.54625061047233,
            "y": 118.23274303241945,
            "width": 40.60932680974247,
            "height": 16,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "text": "$40",
            "placeholder": "",
            "fontSize": 12,
            "fontFamily": "Sulphur Point",
            "fontStyle": "normal",
            "fontWeight": "bold",
            "textDecoration": "",
            "fill": "black",
            "align": "right",
            "verticalAlign": "top",
            "strokeWidth": 0,
            "stroke": "black",
            "lineHeight": 1.2,
            "letterSpacing": 0,
            "backgroundEnabled": false,
            "backgroundColor": "#7ED321",
            "backgroundOpacity": 1,
            "backgroundCornerRadius": 0.5,
            "backgroundPadding": 0.5
          },
        //   {
        //     "id": "3tgkkWKo5X",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 497.2304508816559,
        //     "y": 120.63488758099388,
        //     "width": 40.60932680974247,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "$40",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "right",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "IP-QMEUT_t",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 168.3103917813475,
        //     "y": 181.30466134671204,
        //     "width": 40.60932680974247,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "$40",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "right",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "Yo4MXHGmGP",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 500.994592052531,
        //     "y": 183.70680589528655,
        //     "width": 40.60932680974247,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "$40",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "right",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "k55CH_uNNR",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 168.3103917813475,
        //     "y": 248.14206732155947,
        //     "width": 40.60932680974247,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "$40",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "right",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "eDl8_HqyWY",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 500.994592052531,
        //     "y": 250.5442118701339,
        //     "width": 40.60932680974247,
        //     "height": 16,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "$40",
        //     "placeholder": "",
        //     "fontSize": 12,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "bold",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "right",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "b8KwsLCOXN",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 22.394688028025364,
        //     "y": 139.79976587491203,
        //     "width": 183,
        //     "height": 25,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5.0000000000216875,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package Marketing packageMarketing package ",
        //     "placeholder": "",
        //     "fontSize": 10,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "T_RQNg4ix1",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 355.07888829920876,
        //     "y": 142.2019104234865,
        //     "width": 183,
        //     "height": 25,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5.0000000000216875,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package Marketing packageMarketing package ",
        //     "placeholder": "",
        //     "fontSize": 10,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "d4S31_nRrM",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 22.394688028025392,
        //     "y": 202.87168418920467,
        //     "width": 183,
        //     "height": 25,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5.0000000000216875,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package Marketing packageMarketing package ",
        //     "placeholder": "",
        //     "fontSize": 10,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "w99VxXy3L4",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 355.07888829920887,
        //     "y": 205.2738287377792,
        //     "width": 183,
        //     "height": 25,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5.0000000000216875,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package Marketing packageMarketing package ",
        //     "placeholder": "",
        //     "fontSize": 10,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "gpTP4V9APM",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 22.394688068002004,
        //     "y": 269.70909016405204,
        //     "width": 183,
        //     "height": 25,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5.0000000000216875,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package Marketing packageMarketing package ",
        //     "placeholder": "",
        //     "fontSize": 10,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
        //   {
        //     "id": "OzL2sOxSQK",
        //     "type": "text",
        //     "name": "",
        //     "opacity": 1,
        //     "visible": true,
        //     "selectable": true,
        //     "removable": true,
        //     "alwaysOnTop": false,
        //     "showInExport": true,
        //     "x": 355.0788883391855,
        //     "y": 272.1112347126264,
        //     "width": 183,
        //     "height": 25,
        //     "rotation": 0,
        //     "animations": [],
        //     "blurEnabled": false,
        //     "blurRadius": 10,
        //     "brightnessEnabled": false,
        //     "brightness": 0,
        //     "sepiaEnabled": false,
        //     "grayscaleEnabled": false,
        //     "shadowEnabled": false,
        //     "shadowBlur": 5.0000000000216875,
        //     "shadowOffsetX": 0,
        //     "shadowOffsetY": 0,
        //     "shadowColor": "black",
        //     "shadowOpacity": 1,
        //     "draggable": true,
        //     "resizable": true,
        //     "contentEditable": true,
        //     "styleEditable": true,
        //     "text": "Marketing package Marketing packageMarketing package ",
        //     "placeholder": "",
        //     "fontSize": 10,
        //     "fontFamily": "Sulphur Point",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal",
        //     "textDecoration": "",
        //     "fill": "black",
        //     "align": "left",
        //     "verticalAlign": "top",
        //     "strokeWidth": 0,
        //     "stroke": "black",
        //     "lineHeight": 1.2,
        //     "letterSpacing": 0,
        //     "backgroundEnabled": false,
        //     "backgroundColor": "#7ED321",
        //     "backgroundOpacity": 1,
        //     "backgroundCornerRadius": 0.5,
        //     "backgroundPadding": 0.5
        //   },
    ];

    const childrenCount = children.length;
    console.log('Number of children:', childrenCount);
    if (productsCount > childrenCount) {
        const pages = [];
        let pageIndex = 0;
        for (let i = 0; i < productsCount; i += childrenCount) {
            const pageChildren = children.map(child => ({
                ...child,
                text: (products[i + children.indexOf(child)] && products[i + children.indexOf(child)].name) || "", // Assuming 'name' field in products
            }));
            pages.push({
                id: `page_${pageIndex}`,
                children: pageChildren,
                width: 'auto',
                height: 'auto',
                background: 'white',
                bleed: 0,
                duration: 5000
            });
            pageIndex++;
        }
        res.json({
            width: 595.2755905511812,
            height: 841.8897637795276,
            fonts: [],
            pages: pages,
            unit: 'cm',
            dpi: 72
        });
    } else {
        // Show all products on a single page
        const pageChildren = products.map(product => ({
            id: product.id, // Assuming product ID as child ID
            type: 'text',
            name: '',
            opacity: 1,
            visible: true,
            selectable: true,
            // Other child properties...
            text: product.name, // Assuming 'name' field in products
        }));

        res.json({
            width: 595.2755905511812,
            height: 841.8897637795276,
            fonts: [],
            pages: [
                {
                    id: 'single_page',
                    children: pageChildren,
                    width: 'auto',
                    height: 'auto',
                    background: 'white',
                    bleed: 0,
                    duration: 5000
                }
            ],
            unit: 'cm',
            dpi: 72
        });
    }
    // setTimeout(() => {
    //     res.json({
    //         "width": 595.2755905511812,
    //         "height": 841.8897637795276,
    //         "fonts": [],
    //         "pages": [
    //             {
    //                 "id": "tDi3l61_B9",
    //                 "children": children, 
    //                 "width": "auto",
    //                 "height": "auto",
    //                 "background": "white",
    //                 "bleed": 0,
    //                 "duration": 5000
    //             }
    //         ],
    //         "unit": "cm",
    //         "dpi": 72
    //     });
    // }, 1000);
        // "width":595.2755905511812,"height":841.8897637795276,"fonts":[],"pages":[{"id":"tDi3l61_B9","children":[{"id":"DUx6gtjVOa","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.39468806800201,"y":57.67928085646459,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":`${products[0].name}`,"placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"2pXMkrOGZX","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.0788883391855,"y":60.08142540503907,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"ycH54Bchqv","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":163.95456515719587,"y":57.40369030528343,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":`${products[0].price}`,"placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"2eVkRbKzFP","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":496.63876542837914,"y":59.80583485385792,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"e_hpE2Rbsi","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688038025393,"y":78.97071314777601,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":`${products[0].description}`,"placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"aF6v_WpETc","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.0788883092089,"y":81.37285769635044,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"NWpy5JviOG","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688058002068,"y":118.5083335836006,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"2eh_hd3f7n","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.0788883291855,"y":118.78392413478176,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"ipxfkWgdoh","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":26.158829228877273,"y":181.58025189789322,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"MhJJmiX5hJ","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":358.8430295000607,"y":183.98239644646765,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"B2kSxWNHzN","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":26.158829228877273,"y":248.41765787274068,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"XIKMzwiBx0","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":358.8430295000607,"y":250.8198024213151,"width":104,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package","placeholder":"","fontSize":12,"fontFamily":"Roboto","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"a1AvhllEMx","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":164.54625061047233,"y":118.23274303241945,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"3tgkkWKo5X","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":497.2304508816559,"y":120.63488758099388,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"IP-QMEUT_t","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":168.3103917813475,"y":181.30466134671204,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"Yo4MXHGmGP","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":500.994592052531,"y":183.70680589528655,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"k55CH_uNNR","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":168.3103917813475,"y":248.14206732155947,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"eDl8_HqyWY","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":500.994592052531,"y":250.5442118701339,"width":40.60932680974247,"height":16,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"$40","placeholder":"","fontSize":12,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"bold","textDecoration":"","fill":"black","align":"right","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"b8KwsLCOXN","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688028025364,"y":139.79976587491203,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"T_RQNg4ix1","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.07888829920876,"y":142.2019104234865,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"d4S31_nRrM","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688028025392,"y":202.87168418920467,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"w99VxXy3L4","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.07888829920887,"y":205.2738287377792,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"gpTP4V9APM","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":22.394688068002004,"y":269.70909016405204,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5},{"id":"OzL2sOxSQK","type":"text","name":"","opacity":1,"visible":true,"selectable":true,"removable":true,"alwaysOnTop":false,"showInExport":true,"x":355.0788883391855,"y":272.1112347126264,"width":183,"height":25,"rotation":0,"animations":[],"blurEnabled":false,"blurRadius":10,"brightnessEnabled":false,"brightness":0,"sepiaEnabled":false,"grayscaleEnabled":false,"shadowEnabled":false,"shadowBlur":5.0000000000216875,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"black","shadowOpacity":1,"draggable":true,"resizable":true,"contentEditable":true,"styleEditable":true,"text":"Marketing package Marketing packageMarketing package ","placeholder":"","fontSize":10,"fontFamily":"Sulphur Point","fontStyle":"normal","fontWeight":"normal","textDecoration":"","fill":"black","align":"left","verticalAlign":"top","strokeWidth":0,"stroke":"black","lineHeight":1.2,"letterSpacing":0,"backgroundEnabled":false,"backgroundColor":"#7ED321","backgroundOpacity":1,"backgroundCornerRadius":0.5,"backgroundPadding":0.5}],"width":"auto","height":"auto","background":"white","bleed":0,"duration":5000}],"unit":"cm","dpi":72});
     // Delay of 1 second
  });

// router.get('/get-temp-child/:storeeid', async (req, res) => {
//     const storeId = req.params.storeeid; 
//     console.log('storeId:->', storeId);
//     const products = await Product.find({ storeId });
//     console.log(products, 'products');
//     setTimeout(() => {
//         const pages = [];
//         for (let i = 0; i < products.length; i++) {
//             const product = products[i];
//             const page = {
//                 id: `page_${i}`,
//                 children: [
//                     {
//                         id: `name_${i}`,
//                         type: 'text',
//                         text: product.name,
//                         name: "Name",
//                         x: 22.39468806800201,
//                         y: 57.67928085646459 + index * 100,
//                         width: 100,
//                         height: 16,
//                         fontSize: 12,
//                         fontFamily: "Roboto",
//                         fontWeight: "bold",
//                         // Other properties for name text object
//                     },
//                     {
//                         id: `description_${i}`,
//                         type: 'text',
//                         text: product.description,
//                         name: "Description",
//                         x: 22.39468806800201,
//                         y: 77.67928085646459 + index * 100,
//                         width: 200,
//                         height: 16,
//                         fontSize: 10,
//                         fontFamily: "Roboto",
//                         // Other properties for description text object
//                     },
//                     {
//                         id: `price_${i}`,
//                         type: 'text',
//                         text: `$${product.price}`,
//                         name: "Price",
//                         x: 22.39468806800201,
//                         y: 97.67928085646459 + index * 100,
//                         width: 100,
//                         height: 16,
//                         fontSize: 12,
//                         fontFamily: "Roboto",
//                         fontWeight: "bold",
//                         // Other properties for price text object
//                     },
//                 ],
//             };
//             pages.push(page);
//         }
//         const json = {
//             width: 595.2755905511812,
//             height: 841.8897637795276,
//             fonts: [],
//             pages,
//             unit: 'cm',
//             dpi: 72,
//         };
//         res.json(json);
//     }, 1000); // Delay of 1 second
// });


// router.get('/get-temp-child/:storeeid', async (req, res) => {
//     const storeId = req.params.storeeid; 
//     console.log('storeId:->', storeId);
//     const products = await Product.find({ storeId });
//     console.log(products, 'products');

//     setTimeout(() => {
//         const children = products.map((product, index) => ([
//             {
//                 id: `name_${index}`,
//                 type: 'text',
//                 text: product.name,
//                 name: 'Name',
//                 x: 22.39468806800201,
//                 y: 57.67928085646459 + index * 60,
//                 width: 400,
//                 height: 16,
//                 fontSize: 12,
//                 fontFamily: 'Roboto',
//                 fontWeight: 'bold',
//                 fill: 'black',
//                 align: 'left',
//                 verticalAlign: 'top',
//             },
//             {
//                 id: `price_${index}`,
//                 type: 'text',
//                 text: `$${product.price}`,
//                 name: 'Price',
//                 x: 122.39468806800201, // Adjusted x position for the price
//                 y: 57.67928085646459 + index * 60, // Same y position as the name
//                 width: 400,
//                 height: 16,
//                 fontSize: 12,
//                 fontFamily: 'Roboto',
//                 fontWeight: 'bold',
//                 fill: 'black',
//                 align: 'left',
//                 verticalAlign: 'top',
//             },
//             {
//                 id: `description_${index}`,
//                 type: 'text',
//                 text: product.description,
//                 name: 'Description',
//                 x: 22.39468806800201,
//                 y: 77.67928085646459 + index * 60,
//                 width: 400,
//                 height: 16,
//                 fontSize: 10,
//                 fontFamily: 'Roboto',
//                 fill: 'black',
//                 align: 'left',
//                 verticalAlign: 'top',
//             }
//         ]));

//         res.json({
//             width: 595.2755905511812,
//             height: 841.8897637795276,
//             fonts: [],
//             pages: [{
//                 id: 'tDi3l61_B9',
//                 children: children.flat(), // Flatten the array of arrays
//                 width: 'auto',
//                 height: 'auto',
//                 background: 'white',
//                 bleed: 0,
//                 duration: 5000
//             }],
//             unit: 'cm',
//             dpi: 72
//         });
//     }, 1000); // Delay of 1 second
// });

router.get('/get-temp-child-1/:storeeid', async (req, res) => {
    const storeId = req.params.storeeid; 
    console.log('storeId:->', storeId);
    const products = await Product.find({ storeId });
    console.log(products, 'products');

    setTimeout(() => {
        const imageElement = {
            "id": 'zT4dYrEUKP',
            "type": "image",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": -1.1455725257292217e-11,
            "y": 3.197442310920451e-14,
            "width": 382.7302589840341,
            "height": 890.2719357011555,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "src": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTY5OTZ8MHwxfHNlYXJjaHwxMHx8Zm9vZHxlbnwwfHx8fDE2MjQ2MzU4Nzk&ixlib=rb-1.2.1&q=80&w=1080",
            "cropX": 0.25555555555555554,
            "cropY": 0,
            "cropWidth": 0.555688973093578,
            "cropHeight": 1,
            "cornerRadius": 0,
            "flipX": false,
            "flipY": false,
            "clipSrc": "",
            "borderColor": "black",
            "borderSize": 0,
            "keepRatio": false
        };

        const svgElement = {
            "id": "EcI83ejg22",
            "type": "svg",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 297.6377952755905,
            "y": -32.82185160011807,
            "width": 502.09115702315165,
            "height": 874.7116153796454,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 0,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJyZ2IoMCwgMTYxLCAyNTUpIiAvPjwvc3ZnPg==",
            "maskSrc": "",
            "cropX": 0,
            "cropY": 0,
            "cropWidth": 1,
            "cropHeight": 1,
            "keepRatio": false,
            "flipX": false,
            "flipY": false,
            "borderColor": "black",
            "borderSize": 0,
            "cornerRadius": 0,
            "colorsReplace": {
              "rgb(0, 161, 255)": "rgba(235,235,215,1)"
            }
        };
        const menutextElement = {
            "id": "NuiZvgIhc2",
            "type": "text",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 393.75790164404106,
            "y": 54.22677764670432,
            "width": 129.9029177491408,
            "height": 65,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "text": "Menu",
            "placeholder": "",
            "fontSize": 53.33059918412127,
            "fontFamily": "Great Vibes",
            "fontStyle": "normal",
            "fontWeight": "normal",
            "textDecoration": "",
            "fill": "rgba(86,61,41,1)",
            "align": "center",
            "verticalAlign": "top",
            "strokeWidth": 0,
            "stroke": "black",
            "lineHeight": 1.2,
            "letterSpacing": 0,
            "backgroundEnabled": false,
            "backgroundColor": "#7ED321",
            "backgroundOpacity": 1,
            "backgroundCornerRadius": 0.5,
            "backgroundPadding": 0.5
        };
        const lineElement = {
            "id": "pvolAnF2xf",
            "type": "svg",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 292.38032628195265,
            "y": 84.14851592108252,
            "width": 96.22843345817596,
            "height": 2.5782617256218208,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJyZ2IoMCwgMTYxLCAyNTUpIiAvPjwvc3ZnPg==",
            "maskSrc": "",
            "cropX": 0,
            "cropY": 0,
            "cropWidth": 1,
            "cropHeight": 1,
            "keepRatio": false,
            "flipX": false,
            "flipY": false,
            "borderColor": "black",
            "borderSize": 0,
            "cornerRadius": 0,
            "colorsReplace": {
              "rgb(0, 161, 255)": "rgba(86,61,41,1)"
            }
          }
        const children = products.map((product, index) => ([
            
        // {
        //   "id": `image_${index}`,
        //   "type": "image",
        //   "name": "",
        //   "opacity": 1,
        //   "visible": true,
        //   "selectable": true,
        //   "removable": true,
        //   "alwaysOnTop": false,
        //   "showInExport": true,
        //   "x": -1.1455725257292217e-11,
        //   "y": 3.197442310920451e-14,
        //   "width": 382.7302589840341,
        //   "height": 890.2719357011555,
        //   "rotation": 0,
        //   "animations": [],
        //   "blurEnabled": false,
        //   "blurRadius": 10,
        //   "brightnessEnabled": false,
        //   "brightness": 0,
        //   "sepiaEnabled": false,
        //   "grayscaleEnabled": false,
        //   "shadowEnabled": false,
        //   "shadowBlur": 5,
        //   "shadowOffsetX": 0,
        //   "shadowOffsetY": 0,
        //   "shadowColor": "black",
        //   "shadowOpacity": 1,
        //   "draggable": true,
        //   "resizable": true,
        //   "contentEditable": true,
        //   "styleEditable": true,
        //   "src": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTY5OTZ8MHwxfHNlYXJjaHwxMHx8Zm9vZHxlbnwwfHx8fDE2MjQ2MzU4Nzk&ixlib=rb-1.2.1&q=80&w=1080",
        //   "cropX": 0.25555555555555554,
        //   "cropY": 0,
        //   "cropWidth": 0.555688973093578,
        //   "cropHeight": 1,
        //   "cornerRadius": 0,
        //   "flipX": false,
        //   "flipY": false,
        //   "clipSrc": "",
        //   "borderColor": "black",
        //   "borderSize": 0,
        //   "keepRatio": false
        // },
        // {
        //   "id": `svg_${index}`,
        //   "type": "svg",
        //   "name": "",
        //   "opacity": 1,
        //   "visible": true,
        //   "selectable": true,
        //   "removable": true,
        //   "alwaysOnTop": false,
        //   "showInExport": true,
        //   "x": 297.6377952755905,
        //   "y": -32.82185160011807,
        //   "width": 502.09115702315165,
        //   "height": 874.7116153796454,
        //   "rotation": 0,
        //   "animations": [],
        //   "blurEnabled": false,
        //   "blurRadius": 10,
        //   "brightnessEnabled": false,
        //   "brightness": 0,
        //   "sepiaEnabled": false,
        //   "grayscaleEnabled": false,
        //   "shadowEnabled": false,
        //   "shadowBlur": 5,
        //   "shadowOffsetX": 0,
        //   "shadowOffsetY": 0,
        //   "shadowColor": "black",
        //   "shadowOpacity": 0,
        //   "draggable": true,
        //   "resizable": true,
        //   "contentEditable": true,
        //   "styleEditable": true,
        //   "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJyZ2IoMCwgMTYxLCAyNTUpIiAvPjwvc3ZnPg==",
        //   "maskSrc": "",
        //   "cropX": 0,
        //   "cropY": 0,
        //   "cropWidth": 1,
        //   "cropHeight": 1,
        //   "keepRatio": false,
        //   "flipX": false,
        //   "flipY": false,
        //   "borderColor": "black",
        //   "borderSize": 0,
        //   "cornerRadius": 0,
        //   "colorsReplace": {
        //     "rgb(0, 161, 255)": "rgba(235,235,215,1)"
        //   }
        // },
        {
          "id": `name_${index}`,
          "type": "text",
          "name": "",
          "opacity": 1,
          "visible": true,
          "selectable": true,
          "removable": true,
          "alwaysOnTop": false,
          "showInExport": true,
          "x": 334.5410714013714,
          "y": 125.08330994249349 + index * 60,
          "width": 146.31653003901255,
          "height": 17,
          "rotation": 0,
          "animations": [],
          "blurEnabled": false,
          "blurRadius": 10,
          "brightnessEnabled": false,
          "brightness": 0,
          "sepiaEnabled": false,
          "grayscaleEnabled": false,
          "shadowEnabled": false,
          "shadowBlur": 5,
          "shadowOffsetX": 0,
          "shadowOffsetY": 0,
          "shadowColor": "black",
          "shadowOpacity": 1,
          "draggable": true,
          "resizable": true,
          "contentEditable": true,
          "styleEditable": true,
          "text": product.name,
          "placeholder": "",
          "fontSize": 13.055366362885602,
          "fontFamily": "Sulphur Point",
          "fontStyle": "normal",
          "fontWeight": "bold",
          "textDecoration": "",
          "fill": "rgba(148,133,117,1)",
          "align": "left",
          "verticalAlign": "top",
          "strokeWidth": 0,
          "stroke": "black",
          "lineHeight": 1.2,
          "letterSpacing": 0,
          "backgroundEnabled": false,
          "backgroundColor": "#7ED321",
          "backgroundOpacity": 1,
          "backgroundCornerRadius": 0.5,
          "backgroundPadding": 0.5
        },
        {
          "id": `price_${index}`,
          "type": "text",
          "name": "",
          "opacity": 1,
          "visible": true,
          "selectable": true,
          "removable": true,
          "alwaysOnTop": false,
          "showInExport": true,
          "x": 509.69368601034796,
          "y": 125.08330994249349 + index * 60,
          "width": 45.483671770010147,
          "height": 17,
          "rotation": 0,
          "animations": [],
          "blurEnabled": false,
          "blurRadius": 10,
          "brightnessEnabled": false,
          "brightness": 0,
          "sepiaEnabled": false,
          "grayscaleEnabled": false,
          "shadowEnabled": false,
          "shadowBlur": 5,
          "shadowOffsetX": 0,
          "shadowOffsetY": 0,
          "shadowColor": "black",
          "shadowOpacity": 1,
          "draggable": true,
          "resizable": true,
          "contentEditable": true,
          "styleEditable": true,
          "text": `$${product.price}`,
          "placeholder": "",
          "fontSize": 13.055366362885602,
          "fontFamily": "Sulphur Point",
          "fontStyle": "normal",
          "fontWeight": "bold",
          "textDecoration": "",
          "fill": "rgba(148,133,117,1)",
          "align": "right",
          "verticalAlign": "top",
          "strokeWidth": 0,
          "stroke": "black",
          "lineHeight": 1.2,
          "letterSpacing": 0,
          "backgroundEnabled": false,
          "backgroundColor": "#7ED321",
          "backgroundOpacity": 1,
          "backgroundCornerRadius": 0.5,
          "backgroundPadding": 0.5
        },
        {
          "id": `description_${index}`,
          "type": "text",
          "name": "",
          "opacity": 1,
          "visible": true,
          "selectable": true,
          "removable": true,
          "alwaysOnTop": false,
          "showInExport": true,
          "x": 334.5410714013714,
          "y": 145.3563935290793 + index * 60,
          "width": 128.73194431824035,
          "height": 17,
          "rotation": 0,
          "animations": [],
          "blurEnabled": false,
          "blurRadius": 10,
          "brightnessEnabled": false,
          "brightness": 0,
          "sepiaEnabled": false,
          "grayscaleEnabled": false,
          "shadowEnabled": false,
          "shadowBlur": 5,
          "shadowOffsetX": 0,
          "shadowOffsetY": 0,
          "shadowColor": "black",
          "shadowOpacity": 1,
          "draggable": true,
          "resizable": true,
          "contentEditable": true,
          "styleEditable": true,
          "text":  product.description,
          "placeholder": "",
          "fontSize": 13.055366362885602,
          "fontFamily": "Sulphur Point",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "textDecoration": "",
          "fill": "rgba(148,133,117,1)",
          "align": "left",
          "verticalAlign": "top",
          "strokeWidth": 0,
          "stroke": "black",
          "lineHeight": 1.2,
          "letterSpacing": 0,
          "backgroundEnabled": false,
          "backgroundColor": "#7ED321",
          "backgroundOpacity": 1,
          "backgroundCornerRadius": 0.5,
          "backgroundPadding": 0.5
        },
        // {
        //   "id": "NuiZvgIhc2",
        //   "type": "text",
        //   "name": "",
        //   "opacity": 1,
        //   "visible": true,
        //   "selectable": true,
        //   "removable": true,
        //   "alwaysOnTop": false,
        //   "showInExport": true,
        //   "x": 393.75790164404106,
        //   "y": 54.22677764670432,
        //   "width": 129.9029177491408,
        //   "height": 65,
        //   "rotation": 0,
        //   "animations": [],
        //   "blurEnabled": false,
        //   "blurRadius": 10,
        //   "brightnessEnabled": false,
        //   "brightness": 0,
        //   "sepiaEnabled": false,
        //   "grayscaleEnabled": false,
        //   "shadowEnabled": false,
        //   "shadowBlur": 5,
        //   "shadowOffsetX": 0,
        //   "shadowOffsetY": 0,
        //   "shadowColor": "black",
        //   "shadowOpacity": 1,
        //   "draggable": true,
        //   "resizable": true,
        //   "contentEditable": true,
        //   "styleEditable": true,
        //   "text": "Menu",
        //   "placeholder": "",
        //   "fontSize": 53.33059918412127,
        //   "fontFamily": "Great Vibes",
        //   "fontStyle": "normal",
        //   "fontWeight": "normal",
        //   "textDecoration": "",
        //   "fill": "rgba(86,61,41,1)",
        //   "align": "center",
        //   "verticalAlign": "top",
        //   "strokeWidth": 0,
        //   "stroke": "black",
        //   "lineHeight": 1.2,
        //   "letterSpacing": 0,
        //   "backgroundEnabled": false,
        //   "backgroundColor": "#7ED321",
        //   "backgroundOpacity": 1,
        //   "backgroundCornerRadius": 0.5,
        //   "backgroundPadding": 0.5
        // },
        // {
        //   "id": "pvolAnF2xf",
        //   "type": "svg",
        //   "name": "",
        //   "opacity": 1,
        //   "visible": true,
        //   "selectable": true,
        //   "removable": true,
        //   "alwaysOnTop": false,
        //   "showInExport": true,
        //   "x": 292.38032628195265,
        //   "y": 84.14851592108252,
        //   "width": 96.22843345817596,
        //   "height": 2.5782617256218208,
        //   "rotation": 0,
        //   "animations": [],
        //   "blurEnabled": false,
        //   "blurRadius": 10,
        //   "brightnessEnabled": false,
        //   "brightness": 0,
        //   "sepiaEnabled": false,
        //   "grayscaleEnabled": false,
        //   "shadowEnabled": false,
        //   "shadowBlur": 5,
        //   "shadowOffsetX": 0,
        //   "shadowOffsetY": 0,
        //   "shadowColor": "black",
        //   "shadowOpacity": 1,
        //   "draggable": true,
        //   "resizable": true,
        //   "contentEditable": true,
        //   "styleEditable": true,
        //   "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJyZ2IoMCwgMTYxLCAyNTUpIiAvPjwvc3ZnPg==",
        //   "maskSrc": "",
        //   "cropX": 0,
        //   "cropY": 0,
        //   "cropWidth": 1,
        //   "cropHeight": 1,
        //   "keepRatio": false,
        //   "flipX": false,
        //   "flipY": false,
        //   "borderColor": "black",
        //   "borderSize": 0,
        //   "cornerRadius": 0,
        //   "colorsReplace": {
        //     "rgb(0, 161, 255)": "rgba(86,61,41,1)"
        //   }
        // },
      ]));

        res.json({
            width: 595.2755905511812,
            height: 841.8897637795276,
            fonts: [],
            pages: [{
                id: '20xCcNLaRo',
                children: [imageElement, svgElement,menutextElement,lineElement, ...children].flat(), // Flatten the array of arrays
                width: 'auto',
                height: 'auto',
                background: 'white',
                bleed: 0,
                duration: 5000
            }],
            unit: 'cm',
            dpi: 72
        });
    }, 1000); // Delay of 1 second
});

// router.get('/get-temp-child-1/:storeeid', async (req, res) => {
//     const storeId = req.params.storeeid; 
//     console.log('storeId:->', storeId);
//     const products = await Product.find({ storeId });
//     console.log(products, 'products');

//     setTimeout(() => {
//         const children = products.map((product, index) => ([
//             {
//                 "id": "zT4dYrEUKP",
//                 "type": "image",
//                 "x": -1.7371711841210044e-11,
//                 "y": -4.202666666671339,
//                 "rotation": 0,
//                 "opacity": 1,
//                 "locked": false,
//                 "blurEnabled": false,
//                 "blurRadius": 10,
//                 "brightnessEnabled": false,
//                 "brightness": 0,
//                 "sepiaEnabled": false,
//                 "grayscaleEnabled": false,
//                 "shadowEnabled": false,
//                 "shadowBlur": 5,
//                 "shadowOffsetX": 0,
//                 "shadowOffsetY": 0,
//                 "shadowColor": "black",
//                 "width": 604.3695544644708,
//                 "height": 803.0645719538288,
//                 "src": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTY5OTZ8MHwxfHNlYXJjaHwxMHx8Zm9vZHxlbnwwfHx8fDE2MjQ2MzU4Nzk&ixlib=rb-1.2.1&q=80&w=1080",
//                 "cropX": 0.25555555555555559,
//                 "cropY": 0,
//                 "cropWidth": 0.6337877306964581,
//                 "cropHeight": 0.6515234525406292,
//                 "flipX": false,
//                 "flipY": false,
//                 "borderColor": "black",
//                 "borderSize": 0
//             },       
//             {
//                 "id": "EcI83ejg22",
//                 "type": "svg",
//                 "x": 360.0791478415285,
//                 "y": -11.958570017587537,
//                 "rotation": 0,
//                 "opacity": 1,
//                 "locked": false,
//                 "blurEnabled": false,
//                 "blurRadius": 10,
//                 "brightnessEnabled": false,
//                 "brightness": 0,
//                 "sepiaEnabled": false,
//                 "grayscaleEnabled": false,
//                 "shadowEnabled": false,
//                 "shadowBlur": 5,
//                 "shadowOffsetX": 0,
//                 "shadowOffsetY": 0,
//                 "shadowColor": "black", 
//                 "width": 405.3248029562452,
//                 "height": 813.3763992944296,
//                 "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJyZ2IoMCwgMTYxLCAyNTUpIiAvPjwvc3ZnPg==",
//                 "cropX": 0,
//                 "cropY": 0,
//                 "cropWidth": 2,
//                 "cropHeight": 1,
//                 "keepRatio": false,
//                 "flipX": false,
//                 "flipY": false,
//                 "width": 485.3248029562452,
//                 "height": 813.3763992944296,
//                 "borderColor": "black",
//                 "borderSize": 0,
//                 "colorsReplace": {
//                     "rgb(0, 161, 255)": "rgba(235,235,215,1)"
//                 }
             
//             }, 
//             {
//                 "id": "kWCXW_nPr6",
//                 "type": "text",
//                 "x": 370.4676012334884,
//                 "y": 41.63276439992502,
//                 "rotation": 0,
//                 "opacity": 1,
//                 "locked": false,
//                 "blurEnabled": false,
//                 "blurRadius": 10,
//                 "brightnessEnabled": false,
//                 "brightness": 0,
//                 "sepiaEnabled": false,
//                 "grayscaleEnabled": false,
//                 "shadowEnabled": false,
//                 "shadowBlur": 5,
//                 "shadowOffsetX": 0,
//                 "shadowOffsetY": 0,
//                 "shadowColor": "black",
//                 "text": "Menu",
//                 "placeholder": "",
//                 "fontSize": 84.21437738889414,
//                 "fontFamily": "Great Vibes",
//                 "fontStyle": "normal",
//                 "fontWeight": "normal",
//                 "textDecoration": "",
//                 "fill": "rgba(86,61,41,1)",
//                 "align": "center",
//                 "width": 205.12976614937074,
//                 "height": 101.05725286667295,
//                 "strokeWidth": 0,
//                 "stroke": "black",
//                 "lineHeight": 1.2,
//                 "letterSpacing": 0
//             },            
//             {
//                 id: `name_${index}`,
//                 type: 'text',
//                 text: product.name,
//                 name: 'Name',
//                 x: 400.1429701508806,
//                 y: 52.79169007021935 + index * 60,
//                 width: 400,
//                 height: 16,
//                 fontSize: 14,
//                 fontFamily: 'Roboto',
//                 fontWeight: 'bold',
//                 fill: 'black',
//                 align: 'left',
//                 verticalAlign: 'top',
//             },
//             {
//                 id: `price_${index}`,
//                 type: 'text',
//                 text: `$${product.price}`,
//                 name: 'Price',
//                 x: 122.39468806800201, // Adjusted x position for the price
//                 y: 57.67928085646459 + index * 60, // Same y position as the name
//                 width: 400,
//                 height: 16,
//                 fontSize: 12,
//                 fontFamily: 'Roboto',
//                 fontWeight: 'bold',
//                 fill: 'black',
//                 align: 'left',
//                 verticalAlign: 'top',
//             },
//             {
//                 id: `description_${index}`,
//                 type: 'text',
//                 text: product.description,
//                 name: 'Description',
//                 x: 22.39468806800201,
//                 y: 77.67928085646459 + index * 60,
//                 width: 400,
//                 height: 16,
//                 fontSize: 10,
//                 fontFamily: 'Roboto',
//                 fill: 'black',
//                 align: 'left',
//                 verticalAlign: 'top',
//             }
//         ]));

//         res.json({
//             width: 595.2755905511812,
//             height: 841.8897637795276,
//             fonts: [],
//             pages: [{
//                 id: 'aRoky6fHh4',
//                 children: children.flat(), // Flatten the array of arrays
//                 width: 'auto',
//                 height: 'auto',
//                 background: 'white',
//                 bleed: 0,
//                 duration: 5000
//             }],
//             unit: 'cm',
//             dpi: 72
//         });
//     }, 1000); // Delay of 1 second
// });




  // Endpoint to get templates
  router.get('/get-templates/', (req, res) => {
    const storeeid = req.query.storeeid; // Accessing storeeid from the URL query params
    
     console.log(req.query, "sdsd");
     console.log("StoreID Get",storeeid); // 
    // const filePath = path.join(__dirname, '..', 'fooddata.json');
    const filePath = 'D:/react/Restro/fooddata.json';
    // Read the contents of fooddata.json synchronously
    const foodData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const { query, page = 1, sizeQuery } = req.query;
    // Simulating a delay for demonstration purposes (you may not need this in production)
    const temppolotno = {
        "hits": 192,
        "totalPages": 7,
        "items": [
          {
            "json": `http://localhost:3001/api//get-temp-child-1/${storeeid}`,
            "preview": "https://jdwebservices.com/img/ind.webp"
          },
          {
            "json": `http://localhost:3001/api/get-temp-child/${storeeid}`,
            "preview": "https://jdwebservices.com/img/ind.webp"
          },
        
          {
            "json": "https://api.polotno.com/templates/2021-10-25-facebook-post-purple-flowers.json",
            "preview": "https://api.polotno.com/templates/2021-10-25-facebook-post-purple-flowers.jpg"
          },
          {
            "json": "https://api.polotno.com/templates/2021-10-25-facebook-post-news-update.json",
            "preview": "https://api.polotno.com/templates/2021-10-25-facebook-post-news-update.jpg"
          },
        
        ]
      };
    // const combinedData = {
    //     ...temppolotno,
    //     items: [...temppolotno.items, foodData]
    // };
    //   res.json(combinedData);
    // }, 1000); // Delay of 1 second
    res.json(temppolotno);
  });

  router.get('/get-unsplash', (req, res) => {
    
    const photospolotno = {
        "results": [
            {
              "id": "Fob9TUUdzZ0",
              "slug": "a-wicker-basket-filled-with-lilacs-on-a-white-cloth-Fob9TUUdzZ0",
              "alternative_slugs": {
                "en": "a-wicker-basket-filled-with-lilacs-on-a-white-cloth-Fob9TUUdzZ0",
                "es": "una-cesta-de-mimbre-llena-de-lilas-sobre-un-pano-blanco-Fob9TUUdzZ0",
                "ja": "白い布にライラックで満たされた籐のバスケット-Fob9TUUdzZ0",
                "fr": "un-panier-en-osier-rempli-de-lilas-sur-un-tissu-blanc-Fob9TUUdzZ0",
                "it": "un-cesto-di-vimini-pieno-di-lilla-su-un-panno-bianco-Fob9TUUdzZ0",
                "ko": "흰-천에-라일락으로-가득-찬-고리-버들-바구니-Fob9TUUdzZ0",
                "de": "ein-weidenkorb-gefullt-mit-flieder-auf-einem-weissen-tuch-Fob9TUUdzZ0",
                "pt": "uma-cesta-de-vime-cheia-de-lilases-sobre-um-pano-branco-Fob9TUUdzZ0"
              },
              "created_at": "2024-04-27T10:09:38Z",
              "updated_at": "2024-05-06T04:53:28Z",
              "promoted_at": "2024-05-05T09:44:46Z",
              "width": 3834,
              "height": 5743,
              "color": "#a6a6a6",
              "blur_hash": "LTH.ToMxt7a#4mRjofofxvt7WBog",
              "description": null,
              "alt_description": "a wicker basket filled with lilacs on a white cloth",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714212494809-555606435baa?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714212494809-555606435baa?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714212494809-555606435baa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714212494809-555606435baa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714212494809-555606435baa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714212494809-555606435baa"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-wicker-basket-filled-with-lilacs-on-a-white-cloth-Fob9TUUdzZ0",
                "html": "https://unsplash.com/photos/a-wicker-basket-filled-with-lilacs-on-a-white-cloth-Fob9TUUdzZ0",
                "download": "https://unsplash.com/photos/Fob9TUUdzZ0/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxfHx8fHx8Mnx8MTcxNDk3NTEyMnw",
                "download_location": "https://api.unsplash.com/photos/Fob9TUUdzZ0/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxfHx8fHx8Mnx8MTcxNDk3NTEyMnw"
              },
              "likes": 90,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "-CgRCtIYEv4",
                "updated_at": "2024-05-06T05:32:23Z",
                "username": "kate_gliz",
                "name": "Kateryna Hliznitsova",
                "first_name": "Kateryna",
                "last_name": "Hliznitsova",
                "twitter_username": null,
                "portfolio_url": "https://www.instagram.com/kate_gliz/",
                "bio": "I'm from Ukraine \r\nMy mailing address k.gliz0406@gmail.com  ",
                "location": "Ukraine",
                "links": {
                  "self": "https://api.unsplash.com/users/kate_gliz",
                  "html": "https://unsplash.com/@kate_gliz",
                  "photos": "https://api.unsplash.com/users/kate_gliz/photos",
                  "likes": "https://api.unsplash.com/users/kate_gliz/likes",
                  "portfolio": "https://api.unsplash.com/users/kate_gliz/portfolio",
                  "following": "https://api.unsplash.com/users/kate_gliz/following",
                  "followers": "https://api.unsplash.com/users/kate_gliz/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1636120734399-b8d2e59725ff?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1636120734399-b8d2e59725ff?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1636120734399-b8d2e59725ff?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "kate_gliz",
                "total_collections": 0,
                "total_likes": 125,
                "total_photos": 8893,
                "total_promoted_photos": 874,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "kate_gliz",
                  "portfolio_url": "https://www.instagram.com/kate_gliz/",
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "6c8BLmlA8zw",
              "slug": "a-woman-in-a-purple-suit-sitting-in-the-sand-6c8BLmlA8zw",
              "alternative_slugs": {
                "en": "a-woman-in-a-purple-suit-sitting-in-the-sand-6c8BLmlA8zw",
                "es": "una-mujer-con-un-traje-morado-sentada-en-la-arena-6c8BLmlA8zw",
                "ja": "砂浜に座る紫色のスーツを着た女性-6c8BLmlA8zw",
                "fr": "une-femme-en-costume-violet-assise-dans-le-sable-6c8BLmlA8zw",
                "it": "una-donna-in-un-vestito-viola-seduta-sulla-sabbia-6c8BLmlA8zw",
                "ko": "모래-위에-앉아-있는-보라색-양복을-입은-여자-6c8BLmlA8zw",
                "de": "eine-frau-in-einem-lila-anzug-sitzt-im-sand-6c8BLmlA8zw",
                "pt": "uma-mulher-em-um-terno-roxo-sentado-na-areia-6c8BLmlA8zw"
              },
              "created_at": "2024-04-15T18:13:11Z",
              "updated_at": "2024-05-06T04:19:49Z",
              "promoted_at": "2024-05-05T09:44:42Z",
              "width": 3648,
              "height": 5472,
              "color": "#c0c0a6",
              "blur_hash": "LHHB;?NH~p%1Y7WAR*WVI;WC9GRj",
              "description": null,
              "alt_description": "a woman in a purple suit sitting in the sand",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1713204767450-cf0411357b3a?ixid=M3wxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1713204767450-cf0411357b3a?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1713204767450-cf0411357b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1713204767450-cf0411357b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1713204767450-cf0411357b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1713204767450-cf0411357b3a"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-woman-in-a-purple-suit-sitting-in-the-sand-6c8BLmlA8zw",
                "html": "https://unsplash.com/photos/a-woman-in-a-purple-suit-sitting-in-the-sand-6c8BLmlA8zw",
                "download": "https://unsplash.com/photos/6c8BLmlA8zw/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTcxNDk3NTEyMnw",
                "download_location": "https://api.unsplash.com/photos/6c8BLmlA8zw/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTcxNDk3NTEyMnw"
              },
              "likes": 97,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": {
                "fashion-beauty": {
                  "status": "approved",
                  "approved_on": "2024-04-23T11:05:10Z"
                }
              },
              "asset_type": "photo",
              "user": {
                "id": "Ig9b3sE0iBQ",
                "updated_at": "2024-05-05T21:43:31Z",
                "username": "carlyosbornphoto",
                "name": "Carly Osborn",
                "first_name": "Carly",
                "last_name": "Osborn",
                "twitter_username": null,
                "portfolio_url": "http://carlyosborn.com",
                "bio": "Editorial Fashion, Weddings, Travel, Product, Studio, and Portraits",
                "location": "San Antonio, TX",
                "links": {
                  "self": "https://api.unsplash.com/users/carlyosbornphoto",
                  "html": "https://unsplash.com/@carlyosbornphoto",
                  "photos": "https://api.unsplash.com/users/carlyosbornphoto/photos",
                  "likes": "https://api.unsplash.com/users/carlyosbornphoto/likes",
                  "portfolio": "https://api.unsplash.com/users/carlyosbornphoto/portfolio",
                  "following": "https://api.unsplash.com/users/carlyosbornphoto/following",
                  "followers": "https://api.unsplash.com/users/carlyosbornphoto/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1713207669173-a86fb7ca21e4image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1713207669173-a86fb7ca21e4image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1713207669173-a86fb7ca21e4image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "carlycaptures_",
                "total_collections": 0,
                "total_likes": 0,
                "total_photos": 9,
                "total_promoted_photos": 8,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "carlycaptures_",
                  "portfolio_url": "http://carlyosborn.com",
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "jh1b7GCPjtk",
              "slug": "a-small-popcorn-cart-sitting-on-top-of-a-table-jh1b7GCPjtk",
              "alternative_slugs": {
                "en": "a-small-popcorn-cart-sitting-on-top-of-a-table-jh1b7GCPjtk",
                "es": "un-pequeno-carrito-de-palomitas-de-maiz-sentado-encima-de-una-mesa-jh1b7GCPjtk",
                "ja": "テーブルの上に座っている小さなポップコーンカート-jh1b7GCPjtk",
                "fr": "un-petit-chariot-de-mais-souffle-pose-sur-une-table-jh1b7GCPjtk",
                "it": "un-piccolo-carrello-di-popcorn-seduto-sopra-un-tavolo-jh1b7GCPjtk",
                "ko": "테이블-위에-앉아-있는-작은-팝콘-카트-jh1b7GCPjtk",
                "de": "ein-kleiner-popcornwagen-sitzt-auf-einem-tisch-jh1b7GCPjtk",
                "pt": "um-pequeno-carrinho-de-pipoca-sentado-em-cima-de-uma-mesa-jh1b7GCPjtk"
              },
              "created_at": "2022-05-21T03:30:43Z",
              "updated_at": "2024-05-06T05:20:11Z",
              "promoted_at": "2024-05-05T09:44:38Z",
              "width": 4102,
              "height": 6186,
              "color": "#a6c0c0",
              "blur_hash": "LOB{$FRj4.n$IoWAxuf60Lad?HWC",
              "description": null,
              "alt_description": "a small popcorn cart sitting on top of a table",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1653103674098-6ed995323607?ixid=M3wxMTY5OTZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1653103674098-6ed995323607?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1653103674098-6ed995323607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1653103674098-6ed995323607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1653103674098-6ed995323607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1653103674098-6ed995323607"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-small-popcorn-cart-sitting-on-top-of-a-table-jh1b7GCPjtk",
                "html": "https://unsplash.com/photos/a-small-popcorn-cart-sitting-on-top-of-a-table-jh1b7GCPjtk",
                "download": "https://unsplash.com/photos/jh1b7GCPjtk/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTcxNDk3NTEyMnw",
                "download_location": "https://api.unsplash.com/photos/jh1b7GCPjtk/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTcxNDk3NTEyMnw"
              },
              "likes": 62,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "SEoXDdmuNg8",
                "updated_at": "2024-05-05T11:12:34Z",
                "username": "rancidpotatoes",
                "name": "Rahul Pugazhendi",
                "first_name": "Rahul",
                "last_name": "Pugazhendi",
                "twitter_username": null,
                "portfolio_url": null,
                "bio": null,
                "location": null,
                "links": {
                  "self": "https://api.unsplash.com/users/rancidpotatoes",
                  "html": "https://unsplash.com/@rancidpotatoes",
                  "photos": "https://api.unsplash.com/users/rancidpotatoes/photos",
                  "likes": "https://api.unsplash.com/users/rancidpotatoes/likes",
                  "portfolio": "https://api.unsplash.com/users/rancidpotatoes/portfolio",
                  "following": "https://api.unsplash.com/users/rancidpotatoes/following",
                  "followers": "https://api.unsplash.com/users/rancidpotatoes/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1643566731058-7fc421b49848?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1643566731058-7fc421b49848?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1643566731058-7fc421b49848?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "rahulpugazhendi",
                "total_collections": 0,
                "total_likes": 0,
                "total_photos": 28,
                "total_promoted_photos": 2,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": false,
                "social": {
                  "instagram_username": "rahulpugazhendi",
                  "portfolio_url": null,
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "BIZ6oo_8gXg",
              "slug": "a-room-with-a-table-chairs-and-a-counter-BIZ6oo_8gXg",
              "alternative_slugs": {
                "en": "a-room-with-a-table-chairs-and-a-counter-BIZ6oo_8gXg",
                "es": "una-habitacion-con-una-mesa-sillas-y-un-mostrador-BIZ6oo_8gXg",
                "ja": "テーブルと椅子カウンターのあるお部屋-BIZ6oo_8gXg",
                "fr": "une-salle-avec-une-table-des-chaises-et-un-comptoir-BIZ6oo_8gXg",
                "it": "una-stanza-con-tavolo-sedie-e-bancone-BIZ6oo_8gXg",
                "ko": "테이블-의자-카운터가-있는-방-BIZ6oo_8gXg",
                "de": "ein-raum-mit-tisch-stuhlen-und-theke-BIZ6oo_8gXg",
                "pt": "uma-sala-com-mesa-cadeiras-e-um-balcao-BIZ6oo_8gXg"
              },
              "created_at": "2024-05-04T00:34:58Z",
              "updated_at": "2024-05-05T23:48:25Z",
              "promoted_at": "2024-05-05T09:43:08Z",
              "width": 3640,
              "height": 5000,
              "color": "#c0c0c0",
              "blur_hash": "LJI}3EIo?vMx%#njRjo0HXRjV@WV",
              "description": null,
              "alt_description": "a room with a table, chairs, and a counter",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714782648154-ad341ee9bc19?ixid=M3wxMTY5OTZ8MHwxfGFsbHw0fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714782648154-ad341ee9bc19?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw0fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714782648154-ad341ee9bc19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw0fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714782648154-ad341ee9bc19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw0fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714782648154-ad341ee9bc19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw0fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714782648154-ad341ee9bc19"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-room-with-a-table-chairs-and-a-counter-BIZ6oo_8gXg",
                "html": "https://unsplash.com/photos/a-room-with-a-table-chairs-and-a-counter-BIZ6oo_8gXg",
                "download": "https://unsplash.com/photos/BIZ6oo_8gXg/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw0fHx8fHx8Mnx8MTcxNDk3NTEyMnw",
                "download_location": "https://api.unsplash.com/photos/BIZ6oo_8gXg/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw0fHx8fHx8Mnx8MTcxNDk3NTEyMnw"
              },
              "likes": 27,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "D3HwF26_qmE",
                "updated_at": "2024-05-06T02:26:48Z",
                "username": "wstn",
                "name": "Ben Garratt",
                "first_name": "Ben",
                "last_name": "Garratt",
                "twitter_username": "wstn",
                "portfolio_url": "https://www.wstn.co/",
                "bio": "Designer in London, taking photos of things is a hobby. ",
                "location": "London",
                "links": {
                  "self": "https://api.unsplash.com/users/wstn",
                  "html": "https://unsplash.com/@wstn",
                  "photos": "https://api.unsplash.com/users/wstn/photos",
                  "likes": "https://api.unsplash.com/users/wstn/likes",
                  "portfolio": "https://api.unsplash.com/users/wstn/portfolio",
                  "following": "https://api.unsplash.com/users/wstn/following",
                  "followers": "https://api.unsplash.com/users/wstn/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1562497039331-4caec513cc6f?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1562497039331-4caec513cc6f?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1562497039331-4caec513cc6f?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "wstn",
                "total_collections": 0,
                "total_likes": 4,
                "total_photos": 57,
                "total_promoted_photos": 9,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "wstn",
                  "portfolio_url": "https://www.wstn.co/",
                  "twitter_username": "wstn",
                  "paypal_email": null
                }
              }
            },
            {
              "id": "GxJ2vyVZZGI",
              "slug": "a-wooden-shelf-with-a-white-tube-on-top-of-it-GxJ2vyVZZGI",
              "alternative_slugs": {
                "en": "a-wooden-shelf-with-a-white-tube-on-top-of-it-GxJ2vyVZZGI",
                "es": "un-estante-de-madera-con-un-tubo-blanco-encima-GxJ2vyVZZGI",
                "ja": "木製の棚の上に白い筒が乗っている-GxJ2vyVZZGI",
                "fr": "une-etagere-en-bois-surmontee-dun-tube-blanc-GxJ2vyVZZGI",
                "it": "uno-scaffale-di-legno-con-sopra-un-tubo-bianco-GxJ2vyVZZGI",
                "ko": "그-위에-흰색-튜브가-있는-나무-선반-GxJ2vyVZZGI",
                "de": "ein-holzregal-mit-einem-weissen-rohr-darauf-GxJ2vyVZZGI",
                "pt": "uma-prateleira-de-madeira-com-um-tubo-branco-em-cima-dela-GxJ2vyVZZGI"
              },
              "created_at": "2024-04-30T12:13:45Z",
              "updated_at": "2024-05-06T04:26:57Z",
              "promoted_at": "2024-05-05T09:43:04Z",
              "width": 3500,
              "height": 2500,
              "color": "#d9d9d9",
              "blur_hash": "LGO{:a9EM{xu~q?bt7M{9FD%WVtR",
              "description": null,
              "alt_description": "a wooden shelf with a white tube on top of it",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714479140002-62d1824fffb5?ixid=M3wxMTY5OTZ8MHwxfGFsbHw1fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714479140002-62d1824fffb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw1fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714479140002-62d1824fffb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw1fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714479140002-62d1824fffb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw1fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714479140002-62d1824fffb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw1fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714479140002-62d1824fffb5"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-wooden-shelf-with-a-white-tube-on-top-of-it-GxJ2vyVZZGI",
                "html": "https://unsplash.com/photos/a-wooden-shelf-with-a-white-tube-on-top-of-it-GxJ2vyVZZGI",
                "download": "https://unsplash.com/photos/GxJ2vyVZZGI/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw1fHx8fHx8Mnx8MTcxNDk3NTEyMnw",
                "download_location": "https://api.unsplash.com/photos/GxJ2vyVZZGI/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw1fHx8fHx8Mnx8MTcxNDk3NTEyMnw"
              },
              "likes": 8,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "1PYuvrwbDGs",
                "updated_at": "2024-05-05T21:16:38Z",
                "username": "normals",
                "name": "Point Normal",
                "first_name": "Point",
                "last_name": "Normal",
                "twitter_username": null,
                "portfolio_url": null,
                "bio": null,
                "location": "India",
                "links": {
                  "self": "https://api.unsplash.com/users/normals",
                  "html": "https://unsplash.com/@normals",
                  "photos": "https://api.unsplash.com/users/normals/photos",
                  "likes": "https://api.unsplash.com/users/normals/likes",
                  "portfolio": "https://api.unsplash.com/users/normals/portfolio",
                  "following": "https://api.unsplash.com/users/normals/following",
                  "followers": "https://api.unsplash.com/users/normals/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1714043802933-0c7b5ed2f81dimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1714043802933-0c7b5ed2f81dimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1714043802933-0c7b5ed2f81dimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "point_normals",
                "total_collections": 2,
                "total_likes": 24,
                "total_photos": 27,
                "total_promoted_photos": 8,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "point_normals",
                  "portfolio_url": null,
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "e3hmSSrEkiI",
              "slug": "a-woman-holding-a-baby-in-her-arms-e3hmSSrEkiI",
              "alternative_slugs": {
                "en": "a-woman-holding-a-baby-in-her-arms-e3hmSSrEkiI",
                "es": "una-mujer-con-un-bebe-en-brazos-e3hmSSrEkiI",
                "ja": "赤ん坊を腕に抱いた女性-e3hmSSrEkiI",
                "fr": "une-femme-tenant-un-bebe-dans-ses-bras-e3hmSSrEkiI",
                "it": "una-donna-che-tiene-un-bambino-tra-le-braccia-e3hmSSrEkiI",
                "ko": "아기를-품에-안고-있는-여성-e3hmSSrEkiI",
                "de": "eine-frau-die-ein-baby-auf-dem-arm-halt-e3hmSSrEkiI",
                "pt": "uma-mulher-segurando-um-bebe-em-seus-bracos-e3hmSSrEkiI"
              },
              "created_at": "2024-04-30T08:22:20Z",
              "updated_at": "2024-05-06T01:08:21Z",
              "promoted_at": "2024-05-05T09:43:00Z",
              "width": 6176,
              "height": 9504,
              "color": "#d9c0c0",
              "blur_hash": "LQK,~s?JIoi_~CWAxuShD+M{kAoe",
              "description": null,
              "alt_description": "a woman holding a baby in her arms",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714465331894-eba9802a2afb?ixid=M3wxMTY5OTZ8MHwxfGFsbHw2fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714465331894-eba9802a2afb?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw2fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714465331894-eba9802a2afb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw2fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714465331894-eba9802a2afb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw2fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714465331894-eba9802a2afb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw2fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714465331894-eba9802a2afb"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-woman-holding-a-baby-in-her-arms-e3hmSSrEkiI",
                "html": "https://unsplash.com/photos/a-woman-holding-a-baby-in-her-arms-e3hmSSrEkiI",
                "download": "https://unsplash.com/photos/e3hmSSrEkiI/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw2fHx8fHx8Mnx8MTcxNDk3NTEyMnw",
                "download_location": "https://api.unsplash.com/photos/e3hmSSrEkiI/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw2fHx8fHx8Mnx8MTcxNDk3NTEyMnw"
              },
              "likes": 29,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "NP9bymxF7MQ",
                "updated_at": "2024-05-05T20:23:38Z",
                "username": "ori_foto",
                "name": "Ori Song",
                "first_name": "Ori",
                "last_name": "Song",
                "twitter_username": null,
                "portfolio_url": null,
                "bio": "Architect / Photographer currently based in Seoul.\r\nThank you so much for the love and support to my photos ",
                "location": "Seoul, South Korea",
                "links": {
                  "self": "https://api.unsplash.com/users/ori_foto",
                  "html": "https://unsplash.com/@ori_foto",
                  "photos": "https://api.unsplash.com/users/ori_foto/photos",
                  "likes": "https://api.unsplash.com/users/ori_foto/likes",
                  "portfolio": "https://api.unsplash.com/users/ori_foto/portfolio",
                  "following": "https://api.unsplash.com/users/ori_foto/following",
                  "followers": "https://api.unsplash.com/users/ori_foto/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1552569806529-7947f6968913?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1552569806529-7947f6968913?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1552569806529-7947f6968913?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "ori.foto",
                "total_collections": 4,
                "total_likes": 15,
                "total_photos": 87,
                "total_promoted_photos": 33,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "ori.foto",
                  "portfolio_url": null,
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "3_ewbz6Y_lc",
              "slug": "a-pink-cup-with-water-pouring-out-of-it-3_ewbz6Y_lc",
              "alternative_slugs": {
                "en": "a-pink-cup-with-water-pouring-out-of-it-3_ewbz6Y_lc",
                "es": "una-taza-rosada-de-la-que-sale-agua-3_ewbz6Y_lc",
                "ja": "水が注がれたピンクのコップ-3_ewbz6Y_lc",
                "fr": "une-tasse-rose-dou-secoule-de-leau-3_ewbz6Y_lc",
                "it": "una-tazza-rosa-da-cui-fuoriesce-lacqua-3_ewbz6Y_lc",
                "ko": "물이-쏟아지는-분홍색-컵-3_ewbz6Y_lc",
                "de": "ein-rosafarbener-becher-aus-dem-wasser-fliesst-3_ewbz6Y_lc",
                "pt": "um-copo-rosa-com-agua-jorrando-dele-3_ewbz6Y_lc"
              },
              "created_at": "2024-04-29T10:51:05Z",
              "updated_at": "2024-05-05T17:30:41Z",
              "promoted_at": "2024-05-05T09:40:10Z",
              "width": 4000,
              "height": 5328,
              "color": "#d9c0c0",
              "blur_hash": "LLO_pPVYpbkC?^r@rYVtXlaKMdfj",
              "description": null,
              "alt_description": "a pink cup with water pouring out of it",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714387717443-023059298406?ixid=M3wxMTY5OTZ8MHwxfGFsbHw3fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714387717443-023059298406?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw3fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714387717443-023059298406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw3fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714387717443-023059298406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw3fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714387717443-023059298406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw3fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714387717443-023059298406"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-pink-cup-with-water-pouring-out-of-it-3_ewbz6Y_lc",
                "html": "https://unsplash.com/photos/a-pink-cup-with-water-pouring-out-of-it-3_ewbz6Y_lc",
                "download": "https://unsplash.com/photos/3_ewbz6Y_lc/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw3fHx8fHx8Mnx8MTcxNDk3NTEyMnw",
                "download_location": "https://api.unsplash.com/photos/3_ewbz6Y_lc/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw3fHx8fHx8Mnx8MTcxNDk3NTEyMnw"
              },
              "likes": 13,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "S7cWVj4AbCs",
                "updated_at": "2024-05-05T20:31:40Z",
                "username": "sweetlavender",
                "name": "Faezeh Taheri",
                "first_name": "Faezeh",
                "last_name": "Taheri",
                "twitter_username": null,
                "portfolio_url": null,
                "bio": "In the world of photography,I am to share a captured moment with you. ",
                "location": "Italy",
                "links": {
                  "self": "https://api.unsplash.com/users/sweetlavender",
                  "html": "https://unsplash.com/@sweetlavender",
                  "photos": "https://api.unsplash.com/users/sweetlavender/photos",
                  "likes": "https://api.unsplash.com/users/sweetlavender/likes",
                  "portfolio": "https://api.unsplash.com/users/sweetlavender/portfolio",
                  "following": "https://api.unsplash.com/users/sweetlavender/following",
                  "followers": "https://api.unsplash.com/users/sweetlavender/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1714487824147-fd5bd5ef6219image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1714487824147-fd5bd5ef6219image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1714487824147-fd5bd5ef6219image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "sweetlavender.studio",
                "total_collections": 0,
                "total_likes": 0,
                "total_photos": 34,
                "total_promoted_photos": 1,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "sweetlavender.studio",
                  "portfolio_url": null,
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "5CL_vsYJ4uk",
              "slug": "a-couple-of-palm-trees-sitting-next-to-the-ocean-5CL_vsYJ4uk",
              "alternative_slugs": {
                "en": "a-couple-of-palm-trees-sitting-next-to-the-ocean-5CL_vsYJ4uk",
                "es": "un-par-de-palmeras-sentadas-junto-al-oceano-5CL_vsYJ4uk",
                "ja": "海の隣に座っているヤシの木のカップル-5CL_vsYJ4uk",
                "fr": "un-couple-de-palmiers-assis-a-cote-de-locean-5CL_vsYJ4uk",
                "it": "un-paio-di-palme-sedute-vicino-alloceano-5CL_vsYJ4uk",
                "ko": "바다-옆에-앉아있는-두-그루의-야자수-5CL_vsYJ4uk",
                "de": "ein-paar-palmen-die-am-meer-sitzen-5CL_vsYJ4uk",
                "pt": "um-par-de-palmeiras-sentado-ao-lado-do-oceano-5CL_vsYJ4uk"
              },
              "created_at": "2024-04-29T09:52:37Z",
              "updated_at": "2024-05-06T03:50:27Z",
              "promoted_at": "2024-05-05T09:40:06Z",
              "width": 4000,
              "height": 6000,
              "color": "#404040",
              "blur_hash": "LdD+6{NGayfQ~DRkayfQbwayayfQ",
              "description": null,
              "alt_description": "a couple of palm trees sitting next to the ocean",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714383524948-ebc87c14c0f1?ixid=M3wxMTY5OTZ8MHwxfGFsbHw4fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714383524948-ebc87c14c0f1?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw4fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714383524948-ebc87c14c0f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw4fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714383524948-ebc87c14c0f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw4fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714383524948-ebc87c14c0f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw4fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714383524948-ebc87c14c0f1"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-couple-of-palm-trees-sitting-next-to-the-ocean-5CL_vsYJ4uk",
                "html": "https://unsplash.com/photos/a-couple-of-palm-trees-sitting-next-to-the-ocean-5CL_vsYJ4uk",
                "download": "https://unsplash.com/photos/5CL_vsYJ4uk/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw4fHx8fHx8Mnx8MTcxNDk3NTEyMnw",
                "download_location": "https://api.unsplash.com/photos/5CL_vsYJ4uk/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw4fHx8fHx8Mnx8MTcxNDk3NTEyMnw"
              },
              "likes": 87,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "dSRIhMo7oTc",
                "updated_at": "2024-05-06T03:36:49Z",
                "username": "senchannnn",
                "name": "WANG Tianfang",
                "first_name": "WANG",
                "last_name": "Tianfang",
                "twitter_username": null,
                "portfolio_url": null,
                "bio": null,
                "location": "Nagoya, Japan",
                "links": {
                  "self": "https://api.unsplash.com/users/senchannnn",
                  "html": "https://unsplash.com/@senchannnn",
                  "photos": "https://api.unsplash.com/users/senchannnn/photos",
                  "likes": "https://api.unsplash.com/users/senchannnn/likes",
                  "portfolio": "https://api.unsplash.com/users/senchannnn/portfolio",
                  "following": "https://api.unsplash.com/users/senchannnn/following",
                  "followers": "https://api.unsplash.com/users/senchannnn/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1678114786062-d0ee82b6a18cimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1678114786062-d0ee82b6a18cimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1678114786062-d0ee82b6a18cimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "sen_channnnnn",
                "total_collections": 0,
                "total_likes": 0,
                "total_photos": 273,
                "total_promoted_photos": 1,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": false,
                "social": {
                  "instagram_username": "sen_channnnnn",
                  "portfolio_url": null,
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "p5eiH_T0MnE",
              "slug": "a-view-of-a-city-at-dusk-from-above-p5eiH_T0MnE",
              "alternative_slugs": {
                "en": "a-view-of-a-city-at-dusk-from-above-p5eiH_T0MnE",
                "es": "una-vista-de-una-ciudad-al-atardecer-desde-arriba-p5eiH_T0MnE",
                "ja": "夕暮れ時の街を上から眺める-p5eiH_T0MnE",
                "fr": "une-vue-dune-ville-au-crepuscule-den-haut-p5eiH_T0MnE",
                "it": "una-veduta-di-una-citta-al-crepuscolo-dallalto-p5eiH_T0MnE",
                "ko": "해질녘-도시-풍경-p5eiH_T0MnE",
                "de": "blick-auf-eine-stadt-in-der-abenddammerung-von-oben-p5eiH_T0MnE",
                "pt": "uma-vista-de-uma-cidade-ao-entardecer-de-cima-p5eiH_T0MnE"
              },
              "created_at": "2024-05-04T10:26:48Z",
              "updated_at": "2024-05-05T23:41:44Z",
              "promoted_at": "2024-05-05T09:40:02Z",
              "width": 3000,
              "height": 2000,
              "color": "#0c2626",
              "blur_hash": "LlEoP@R-WAay~XNIWUj[%NR+oJj[",
              "description": null,
              "alt_description": "a view of a city at dusk from above",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714818282987-7d61de55302e?ixid=M3wxMTY5OTZ8MHwxfGFsbHw5fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714818282987-7d61de55302e?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw5fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714818282987-7d61de55302e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw5fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714818282987-7d61de55302e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw5fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714818282987-7d61de55302e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw5fHx8fHx8Mnx8MTcxNDk3NTEyMnw&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714818282987-7d61de55302e"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-view-of-a-city-at-dusk-from-above-p5eiH_T0MnE",
                "html": "https://unsplash.com/photos/a-view-of-a-city-at-dusk-from-above-p5eiH_T0MnE",
                "download": "https://unsplash.com/photos/p5eiH_T0MnE/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw5fHx8fHx8Mnx8MTcxNDk3NTEyMnw",
                "download_location": "https://api.unsplash.com/photos/p5eiH_T0MnE/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHw5fHx8fHx8Mnx8MTcxNDk3NTEyMnw"
              },
              "likes": 43,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "ZEncYNLc9bE",
                "updated_at": "2024-05-06T05:11:53Z",
                "username": "5tep5",
                "name": "Aleksandr Popov",
                "first_name": "Aleksandr",
                "last_name": "Popov",
                "twitter_username": "5tep5",
                "portfolio_url": "http://5tep5.com/",
                "bio": "Street Photography (for contact: 5tep5.com/info)",
                "location": "Moscow",
                "links": {
                  "self": "https://api.unsplash.com/users/5tep5",
                  "html": "https://unsplash.com/@5tep5",
                  "photos": "https://api.unsplash.com/users/5tep5/photos",
                  "likes": "https://api.unsplash.com/users/5tep5/likes",
                  "portfolio": "https://api.unsplash.com/users/5tep5/portfolio",
                  "following": "https://api.unsplash.com/users/5tep5/following",
                  "followers": "https://api.unsplash.com/users/5tep5/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-fb-1502611037-1478664905d8.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-fb-1502611037-1478664905d8.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-fb-1502611037-1478664905d8.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "5tep5",
                "total_collections": 1,
                "total_likes": 33,
                "total_photos": 246,
                "total_promoted_photos": 106,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "5tep5",
                  "portfolio_url": "http://5tep5.com/",
                  "twitter_username": "5tep5",
                  "paypal_email": null
                }
              }
            },
            {
              "id": "l2poERksZAs",
              "slug": "a-pink-rose-sitting-on-top-of-a-green-plant-l2poERksZAs",
              "alternative_slugs": {
                "en": "a-pink-rose-sitting-on-top-of-a-green-plant-l2poERksZAs",
                "es": "una-rosa-rosada-sentada-encima-de-una-planta-verde-l2poERksZAs",
                "ja": "緑の植物の上にピンクのバラが乗っています-l2poERksZAs",
                "fr": "une-rose-rose-assise-sur-une-plante-verte-l2poERksZAs",
                "it": "una-rosa-rosa-seduta-in-cima-a-una-pianta-verde-l2poERksZAs",
                "ko": "초록색-식물-위에-앉아있는-분홍색-장미-l2poERksZAs",
                "de": "eine-rosa-rose-die-auf-einer-grunen-pflanze-sitzt-l2poERksZAs",
                "pt": "uma-rosa-rosa-sentada-em-cima-de-uma-planta-verde-l2poERksZAs"
              },
              "created_at": "2024-05-03T17:25:42Z",
              "updated_at": "2024-05-06T04:58:05Z",
              "promoted_at": "2024-05-05T09:29:21Z",
              "width": 3457,
              "height": 4321,
              "color": "#737373",
              "blur_hash": "LbE{%[i^W=R+_4MxRjS4yEM{jFof",
              "description": null,
              "alt_description": "a pink rose sitting on top of a green plant",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714757137945-b40ecc09fd74?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714757137945-b40ecc09fd74?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714757137945-b40ecc09fd74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714757137945-b40ecc09fd74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714757137945-b40ecc09fd74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714757137945-b40ecc09fd74"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-pink-rose-sitting-on-top-of-a-green-plant-l2poERksZAs",
                "html": "https://unsplash.com/photos/a-pink-rose-sitting-on-top-of-a-green-plant-l2poERksZAs",
                "download": "https://unsplash.com/photos/l2poERksZAs/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/l2poERksZAs/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 41,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "y7LfWJF0CcQ",
                "updated_at": "2024-05-05T09:29:21Z",
                "username": "lowmurmer",
                "name": "Parker Coffman",
                "first_name": "Parker",
                "last_name": "Coffman",
                "twitter_username": "ParkerCoffman",
                "portfolio_url": "http://parkercoffman.com",
                "bio": "fine art + editorial\r\nthings that interest me",
                "location": "Los Angeles, CA",
                "links": {
                  "self": "https://api.unsplash.com/users/lowmurmer",
                  "html": "https://unsplash.com/@lowmurmer",
                  "photos": "https://api.unsplash.com/users/lowmurmer/photos",
                  "likes": "https://api.unsplash.com/users/lowmurmer/likes",
                  "portfolio": "https://api.unsplash.com/users/lowmurmer/portfolio",
                  "following": "https://api.unsplash.com/users/lowmurmer/following",
                  "followers": "https://api.unsplash.com/users/lowmurmer/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1600791077428-8dbea50650f0image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1600791077428-8dbea50650f0image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1600791077428-8dbea50650f0image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "parker.coffman",
                "total_collections": 0,
                "total_likes": 2,
                "total_photos": 1099,
                "total_promoted_photos": 260,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "parker.coffman",
                  "portfolio_url": "http://parkercoffman.com",
                  "twitter_username": "ParkerCoffman",
                  "paypal_email": null
                }
              }
            },
            {
              "id": "U0447msH9Rg",
              "slug": "a-person-riding-a-bike-in-a-park-U0447msH9Rg",
              "alternative_slugs": {
                "en": "a-person-riding-a-bike-in-a-park-U0447msH9Rg",
                "es": "una-persona-montando-en-bicicleta-en-un-parque-U0447msH9Rg",
                "ja": "公園で自転車に乗っている人-U0447msH9Rg",
                "fr": "une-personne-qui-fait-du-velo-dans-un-parc-U0447msH9Rg",
                "it": "una-persona-che-va-in-bicicletta-in-un-parco-U0447msH9Rg",
                "ko": "공원에서-자전거를-타는-사람-U0447msH9Rg",
                "de": "eine-person-die-in-einem-park-fahrrad-fahrt-U0447msH9Rg",
                "pt": "uma-pessoa-andando-de-bicicleta-em-um-parque-U0447msH9Rg"
              },
              "created_at": "2024-05-04T01:36:05Z",
              "updated_at": "2024-05-06T02:38:44Z",
              "promoted_at": "2024-05-05T09:29:03Z",
              "width": 6000,
              "height": 4000,
              "color": "#f3f3f3",
              "blur_hash": "LyMH3^%3IVaf_NxuWBfP-;jFt6t7",
              "description": null,
              "alt_description": "a person riding a bike in a park",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714786479680-d0c30f22dd29?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714786479680-d0c30f22dd29?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714786479680-d0c30f22dd29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714786479680-d0c30f22dd29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714786479680-d0c30f22dd29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714786479680-d0c30f22dd29"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-person-riding-a-bike-in-a-park-U0447msH9Rg",
                "html": "https://unsplash.com/photos/a-person-riding-a-bike-in-a-park-U0447msH9Rg",
                "download": "https://unsplash.com/photos/U0447msH9Rg/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/U0447msH9Rg/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 18,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "1KQwNa_GEuY",
                "updated_at": "2024-05-06T05:01:52Z",
                "username": "mak_jp",
                "name": "Mak",
                "first_name": "Mak",
                "last_name": null,
                "twitter_username": null,
                "portfolio_url": "https://makjp.go.studio/",
                "bio": "Ehime Japan | Streetphotography/BnW/FilmLook | FUJIFILM XT20/X100F",
                "location": "Matsuyama",
                "links": {
                  "self": "https://api.unsplash.com/users/mak_jp",
                  "html": "https://unsplash.com/@mak_jp",
                  "photos": "https://api.unsplash.com/users/mak_jp/photos",
                  "likes": "https://api.unsplash.com/users/mak_jp/likes",
                  "portfolio": "https://api.unsplash.com/users/mak_jp/portfolio",
                  "following": "https://api.unsplash.com/users/mak_jp/following",
                  "followers": "https://api.unsplash.com/users/mak_jp/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1550709276110-131b40f03f83?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1550709276110-131b40f03f83?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1550709276110-131b40f03f83?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "3apples_mak",
                "total_collections": 79,
                "total_likes": 5229,
                "total_photos": 12813,
                "total_promoted_photos": 1086,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "3apples_mak",
                  "portfolio_url": "https://makjp.go.studio/",
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "LVNoee3IjvY",
              "slug": "a-picture-of-a-sign-on-the-side-of-a-building-LVNoee3IjvY",
              "alternative_slugs": {
                "en": "a-picture-of-a-sign-on-the-side-of-a-building-LVNoee3IjvY",
                "es": "una-imagen-de-un-letrero-en-el-costado-de-un-edificio-LVNoee3IjvY",
                "ja": "建物の側面にある看板の写真-LVNoee3IjvY",
                "fr": "limage-dune-enseigne-sur-le-cote-dun-batiment-LVNoee3IjvY",
                "it": "limmagine-di-un-cartello-sul-lato-di-un-edificio-LVNoee3IjvY",
                "ko": "건물-측면에-있는-표지판-사진-LVNoee3IjvY",
                "de": "ein-bild-eines-schildes-an-der-seite-eines-gebaudes-LVNoee3IjvY",
                "pt": "uma-imagem-de-uma-placa-na-lateral-de-um-edificio-LVNoee3IjvY"
              },
              "created_at": "2024-05-04T05:56:34Z",
              "updated_at": "2024-05-06T02:30:04Z",
              "promoted_at": "2024-05-05T09:28:59Z",
              "width": 5396,
              "height": 8094,
              "color": "#8c8c73",
              "blur_hash": "L9Gk%Z8wDNaKX9yDozWYM_%Mtmof",
              "description": null,
              "alt_description": "a picture of a sign on the side of a building",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714802145430-3b1f666dca37?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714802145430-3b1f666dca37?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714802145430-3b1f666dca37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714802145430-3b1f666dca37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714802145430-3b1f666dca37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714802145430-3b1f666dca37"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-picture-of-a-sign-on-the-side-of-a-building-LVNoee3IjvY",
                "html": "https://unsplash.com/photos/a-picture-of-a-sign-on-the-side-of-a-building-LVNoee3IjvY",
                "download": "https://unsplash.com/photos/LVNoee3IjvY/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/LVNoee3IjvY/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 37,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "zYMbLv23R6Y",
                "updated_at": "2024-05-06T04:11:49Z",
                "username": "pafuxu",
                "name": "Kouji Tsuru",
                "first_name": "Kouji",
                "last_name": "Tsuru",
                "twitter_username": "pafuxu",
                "portfolio_url": "https://www.pafuxum.com",
                "bio": null,
                "location": "Japan",
                "links": {
                  "self": "https://api.unsplash.com/users/pafuxu",
                  "html": "https://unsplash.com/@pafuxu",
                  "photos": "https://api.unsplash.com/users/pafuxu/photos",
                  "likes": "https://api.unsplash.com/users/pafuxu/likes",
                  "portfolio": "https://api.unsplash.com/users/pafuxu/portfolio",
                  "following": "https://api.unsplash.com/users/pafuxu/following",
                  "followers": "https://api.unsplash.com/users/pafuxu/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1518875533804-91b4c3c8ce67?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1518875533804-91b4c3c8ce67?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1518875533804-91b4c3c8ce67?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "pafuxu",
                "total_collections": 0,
                "total_likes": 1,
                "total_photos": 5438,
                "total_promoted_photos": 63,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": false,
                "social": {
                  "instagram_username": "pafuxu",
                  "portfolio_url": "https://www.pafuxum.com",
                  "twitter_username": "pafuxu",
                  "paypal_email": null
                }
              }
            },
            {
              "id": "Q5tPJcH_vQ0",
              "slug": "a-man-and-a-woman-kissing-in-the-ocean-Q5tPJcH_vQ0",
              "alternative_slugs": {
                "en": "a-man-and-a-woman-kissing-in-the-ocean-Q5tPJcH_vQ0",
                "es": "un-hombre-y-una-mujer-besandose-en-el-oceano-Q5tPJcH_vQ0",
                "ja": "海でキスをする男と女-Q5tPJcH_vQ0",
                "fr": "un-homme-et-une-femme-sembrassent-dans-locean-Q5tPJcH_vQ0",
                "it": "un-uomo-e-una-donna-che-si-baciano-nelloceano-Q5tPJcH_vQ0",
                "ko": "바다에서-키스하는-남자와-여자-Q5tPJcH_vQ0",
                "de": "ein-mann-und-eine-frau-kussen-sich-im-ozean-Q5tPJcH_vQ0",
                "pt": "um-homem-e-uma-mulher-se-beijando-no-oceano-Q5tPJcH_vQ0"
              },
              "created_at": "2024-05-02T21:34:56Z",
              "updated_at": "2024-05-06T05:07:56Z",
              "promoted_at": "2024-05-05T07:18:56Z",
              "width": 5152,
              "height": 7728,
              "color": "#d9d9d9",
              "blur_hash": "LTNTq4?b?bt7~qkDIUj[%hMxM{ax",
              "description": null,
              "alt_description": "a man and a woman kissing in the ocean",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714685502646-6958268dd349?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxM3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714685502646-6958268dd349?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxM3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714685502646-6958268dd349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxM3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714685502646-6958268dd349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxM3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714685502646-6958268dd349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxM3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714685502646-6958268dd349"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-man-and-a-woman-kissing-in-the-ocean-Q5tPJcH_vQ0",
                "html": "https://unsplash.com/photos/a-man-and-a-woman-kissing-in-the-ocean-Q5tPJcH_vQ0",
                "download": "https://unsplash.com/photos/Q5tPJcH_vQ0/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxM3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/Q5tPJcH_vQ0/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxM3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 25,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "NRmIm0Y4fmI",
                "updated_at": "2024-05-05T20:26:56Z",
                "username": "infectedluna",
                "name": "Asdrubal luna",
                "first_name": "Asdrubal",
                "last_name": "luna",
                "twitter_username": null,
                "portfolio_url": "http://legadocreativo.com/weddings",
                "bio": "Digital Artist based in Baja California Sur, México ",
                "location": "Baja california sur, México ",
                "links": {
                  "self": "https://api.unsplash.com/users/infectedluna",
                  "html": "https://unsplash.com/@infectedluna",
                  "photos": "https://api.unsplash.com/users/infectedluna/photos",
                  "likes": "https://api.unsplash.com/users/infectedluna/likes",
                  "portfolio": "https://api.unsplash.com/users/infectedluna/portfolio",
                  "following": "https://api.unsplash.com/users/infectedluna/following",
                  "followers": "https://api.unsplash.com/users/infectedluna/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-fb-1502342945-2f57cdf006f0.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-fb-1502342945-2f57cdf006f0.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-fb-1502342945-2f57cdf006f0.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "legadoweddings",
                "total_collections": 5,
                "total_likes": 905,
                "total_photos": 178,
                "total_promoted_photos": 27,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "legadoweddings",
                  "portfolio_url": "http://legadocreativo.com/weddings",
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "pDPCh2hiGKI",
              "slug": "a-palm-tree-with-a-blue-sky-in-the-background-pDPCh2hiGKI",
              "alternative_slugs": {
                "en": "a-palm-tree-with-a-blue-sky-in-the-background-pDPCh2hiGKI",
                "es": "una-palmera-con-un-cielo-azul-de-fondo-pDPCh2hiGKI",
                "ja": "青空を背景にしたヤシの木-pDPCh2hiGKI",
                "fr": "un-palmier-avec-un-ciel-bleu-en-arriere-plan-pDPCh2hiGKI",
                "it": "una-palma-con-un-cielo-blu-sullo-sfondo-pDPCh2hiGKI",
                "ko": "푸른-하늘을-배경으로-한-야자수-pDPCh2hiGKI",
                "de": "eine-palme-mit-blauem-himmel-im-hintergrund-pDPCh2hiGKI",
                "pt": "uma-palmeira-com-um-ceu-azul-no-fundo-pDPCh2hiGKI"
              },
              "created_at": "2024-05-05T07:12:49Z",
              "updated_at": "2024-05-06T01:12:37Z",
              "promoted_at": "2024-05-05T07:18:53Z",
              "width": 3796,
              "height": 5694,
              "color": "#c0c0d9",
              "blur_hash": "LGJk+ioe.Aj[K8j[t8ayx_ayDhj[",
              "description": null,
              "alt_description": "a palm tree with a blue sky in the background",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714892207846-2d617a1aebe1?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714892207846-2d617a1aebe1?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714892207846-2d617a1aebe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714892207846-2d617a1aebe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714892207846-2d617a1aebe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714892207846-2d617a1aebe1"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-palm-tree-with-a-blue-sky-in-the-background-pDPCh2hiGKI",
                "html": "https://unsplash.com/photos/a-palm-tree-with-a-blue-sky-in-the-background-pDPCh2hiGKI",
                "download": "https://unsplash.com/photos/pDPCh2hiGKI/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/pDPCh2hiGKI/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 40,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": {
                "nature": {
                  "status": "unevaluated"
                },
                "wallpapers": {
                  "status": "unevaluated"
                }
              },
              "asset_type": "photo",
              "user": {
                "id": "IR6cROTdd08",
                "updated_at": "2024-05-06T00:46:44Z",
                "username": "johanmouchet",
                "name": "Johan Mouchet",
                "first_name": "Johan",
                "last_name": "Mouchet",
                "twitter_username": "JohanMouchet",
                "portfolio_url": "https://www.johan-mouchet.com",
                "bio": "Web developer, originally from Marseille, now based in Melbourne",
                "location": "Melbourne",
                "links": {
                  "self": "https://api.unsplash.com/users/johanmouchet",
                  "html": "https://unsplash.com/@johanmouchet",
                  "photos": "https://api.unsplash.com/users/johanmouchet/photos",
                  "likes": "https://api.unsplash.com/users/johanmouchet/likes",
                  "portfolio": "https://api.unsplash.com/users/johanmouchet/portfolio",
                  "following": "https://api.unsplash.com/users/johanmouchet/following",
                  "followers": "https://api.unsplash.com/users/johanmouchet/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1588841269124-b2f41a233220image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1588841269124-b2f41a233220image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1588841269124-b2f41a233220image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "johanmouchet",
                "total_collections": 0,
                "total_likes": 566,
                "total_photos": 245,
                "total_promoted_photos": 28,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "johanmouchet",
                  "portfolio_url": "https://www.johan-mouchet.com",
                  "twitter_username": "JohanMouchet",
                  "paypal_email": null
                }
              }
            },
            {
              "id": "5y71Otj5xek",
              "slug": "a-wooden-table-topped-with-white-plates-and-a-vase-filled-with-flowers-5y71Otj5xek",
              "alternative_slugs": {
                "en": "a-wooden-table-topped-with-white-plates-and-a-vase-filled-with-flowers-5y71Otj5xek",
                "es": "una-mesa-de-madera-cubierta-con-platos-blancos-y-un-jarron-lleno-de-flores-5y71Otj5xek",
                "ja": "白い皿が置かれた木製のテーブルと花が生けられた花瓶-5y71Otj5xek",
                "fr": "une-table-en-bois-surmontee-dassiettes-blanches-et-dun-vase-rempli-de-fleurs-5y71Otj5xek",
                "it": "un-tavolo-di-legno-sormontato-da-piatti-bianchi-e-un-vaso-pieno-di-fiori-5y71Otj5xek",
                "ko": "흰-접시가-놓인-나무-테이블과-꽃이-가득-담긴-꽃병-5y71Otj5xek",
                "de": "ein-holztisch-mit-weissen-tellern-und-einer-vase-voller-blumen-5y71Otj5xek",
                "pt": "uma-mesa-de-madeira-coberta-com-pratos-brancos-e-um-vaso-cheio-de-flores-5y71Otj5xek"
              },
              "created_at": "2024-05-04T15:43:57Z",
              "updated_at": "2024-05-06T05:08:04Z",
              "promoted_at": "2024-05-05T07:18:38Z",
              "width": 2560,
              "height": 3200,
              "color": "#c0c0c0",
              "blur_hash": "LQJH%GjFIAWB~pWFWCbHMvM|jYj]",
              "description": "Outdoor table setting (IG: @clay.banks)",
              "alt_description": "a wooden table topped with white plates and a vase filled with flowers",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714836986273-9a62b37f55fa?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714836986273-9a62b37f55fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714836986273-9a62b37f55fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714836986273-9a62b37f55fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714836986273-9a62b37f55fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714836986273-9a62b37f55fa"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-wooden-table-topped-with-white-plates-and-a-vase-filled-with-flowers-5y71Otj5xek",
                "html": "https://unsplash.com/photos/a-wooden-table-topped-with-white-plates-and-a-vase-filled-with-flowers-5y71Otj5xek",
                "download": "https://unsplash.com/photos/5y71Otj5xek/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/5y71Otj5xek/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 13,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "rUXhgOTUmb0",
                "updated_at": "2024-05-06T02:21:50Z",
                "username": "claybanks",
                "name": "Clay Banks",
                "first_name": "Clay",
                "last_name": "Banks",
                "twitter_username": "ClayBanks",
                "portfolio_url": "http://claybanks.info",
                "bio": "👨🏽‍💻 Software Developer 📷 Freelance Photographer 🚐 Van Lifer // If you use my images and would like to say thanks, feel free to donate via the PayPal link on my profile\r\nPresets & Prints 👉🏽 https://claybanks.info",
                "location": "New York",
                "links": {
                  "self": "https://api.unsplash.com/users/claybanks",
                  "html": "https://unsplash.com/@claybanks",
                  "photos": "https://api.unsplash.com/users/claybanks/photos",
                  "likes": "https://api.unsplash.com/users/claybanks/likes",
                  "portfolio": "https://api.unsplash.com/users/claybanks/portfolio",
                  "following": "https://api.unsplash.com/users/claybanks/following",
                  "followers": "https://api.unsplash.com/users/claybanks/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1670236743900-356b1ee0dc42image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1670236743900-356b1ee0dc42image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1670236743900-356b1ee0dc42image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "clay.banks",
                "total_collections": 38,
                "total_likes": 514,
                "total_photos": 1244,
                "total_promoted_photos": 629,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "clay.banks",
                  "portfolio_url": "http://claybanks.info",
                  "twitter_username": "ClayBanks",
                  "paypal_email": null
                }
              }
            },
            {
              "id": "U1aW5X2Lt8s",
              "slug": "the-tail-lights-of-an-old-camper-in-the-desert-U1aW5X2Lt8s",
              "alternative_slugs": {
                "en": "the-tail-lights-of-an-old-camper-in-the-desert-U1aW5X2Lt8s",
                "es": "las-luces-traseras-de-una-vieja-caravana-en-el-desierto-U1aW5X2Lt8s",
                "ja": "砂漠の古いキャンピングカーのテールライト-U1aW5X2Lt8s",
                "fr": "les-feux-arriere-dun-vieux-camping-car-dans-le-desert-U1aW5X2Lt8s",
                "it": "i-fanali-posteriori-di-un-vecchio-camper-nel-deserto-U1aW5X2Lt8s",
                "ko": "사막에-있는-늙은-캠핑카의-후미등-U1aW5X2Lt8s",
                "de": "die-rucklichter-eines-alten-wohnmobils-in-der-wuste-U1aW5X2Lt8s",
                "pt": "as-luzes-traseiras-de-um-velho-campista-no-deserto-U1aW5X2Lt8s"
              },
              "created_at": "2024-05-03T17:20:27Z",
              "updated_at": "2024-05-05T20:07:01Z",
              "promoted_at": "2024-05-05T07:17:19Z",
              "width": 2669,
              "height": 4000,
              "color": "#a67359",
              "blur_hash": "LPGRn=-7I;RPg%M{t7M{0#fikDRj",
              "description": null,
              "alt_description": "the tail lights of an old camper in the desert",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714756126978-1c835f97ae32?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714756126978-1c835f97ae32?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714756126978-1c835f97ae32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714756126978-1c835f97ae32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714756126978-1c835f97ae32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714756126978-1c835f97ae32"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/the-tail-lights-of-an-old-camper-in-the-desert-U1aW5X2Lt8s",
                "html": "https://unsplash.com/photos/the-tail-lights-of-an-old-camper-in-the-desert-U1aW5X2Lt8s",
                "download": "https://unsplash.com/photos/U1aW5X2Lt8s/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/U1aW5X2Lt8s/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNnx8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 26,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "SnJ15RZ6oiE",
                "updated_at": "2024-05-05T20:01:38Z",
                "username": "aguyonecam",
                "name": "Mario Scheibl",
                "first_name": "Mario",
                "last_name": "Scheibl",
                "twitter_username": null,
                "portfolio_url": "http://www.aguyonecam.de",
                "bio": "Snapshots since 2020",
                "location": "Germany",
                "links": {
                  "self": "https://api.unsplash.com/users/aguyonecam",
                  "html": "https://unsplash.com/@aguyonecam",
                  "photos": "https://api.unsplash.com/users/aguyonecam/photos",
                  "likes": "https://api.unsplash.com/users/aguyonecam/likes",
                  "portfolio": "https://api.unsplash.com/users/aguyonecam/portfolio",
                  "following": "https://api.unsplash.com/users/aguyonecam/following",
                  "followers": "https://api.unsplash.com/users/aguyonecam/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-fb-1607184497-8aaccaf695fe.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-fb-1607184497-8aaccaf695fe.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-fb-1607184497-8aaccaf695fe.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "aguyonecam",
                "total_collections": 12,
                "total_likes": 111,
                "total_photos": 167,
                "total_promoted_photos": 39,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "aguyonecam",
                  "portfolio_url": "http://www.aguyonecam.de",
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "-_424BM_9nY",
              "slug": "a-bed-sitting-in-a-bedroom-next-to-two-windows--_424BM_9nY",
              "alternative_slugs": {
                "en": "a-bed-sitting-in-a-bedroom-next-to-two-windows--_424BM_9nY",
                "es": "una-cama-sentada-en-un-dormitorio-junto-a-dos-ventanas--_424BM_9nY",
                "ja": "2つの窓の隣の寝室に置かれたベッド--_424BM_9nY",
                "fr": "un-lit-assis-dans-une-chambre-a-cote-de-deux-fenetres--_424BM_9nY",
                "it": "un-letto-seduto-in-una-camera-da-letto-accanto-a-due-finestre--_424BM_9nY",
                "ko": "두-개의-창문-옆-침실에-있는-침대--_424BM_9nY",
                "de": "ein-bett-das-in-einem-schlafzimmer-neben-zwei-fenstern-steht--_424BM_9nY",
                "pt": "uma-cama-sentada-em-um-quarto-ao-lado-de-duas-janelas--_424BM_9nY"
              },
              "created_at": "2024-05-04T15:43:57Z",
              "updated_at": "2024-05-06T02:39:30Z",
              "promoted_at": "2024-05-05T07:17:15Z",
              "width": 3200,
              "height": 2133,
              "color": "#a6a6a6",
              "blur_hash": "LLIr7}ITD$Rl~Wt7ozt74.xuaeWA",
              "description": null,
              "alt_description": "a bed sitting in a bedroom next to two windows",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714837265676-c1b46fef5cb8?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxN3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714837265676-c1b46fef5cb8?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxN3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714837265676-c1b46fef5cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxN3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714837265676-c1b46fef5cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxN3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714837265676-c1b46fef5cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxN3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714837265676-c1b46fef5cb8"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-bed-sitting-in-a-bedroom-next-to-two-windows--_424BM_9nY",
                "html": "https://unsplash.com/photos/a-bed-sitting-in-a-bedroom-next-to-two-windows--_424BM_9nY",
                "download": "https://unsplash.com/photos/-_424BM_9nY/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxN3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/-_424BM_9nY/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxN3x8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 10,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "rUXhgOTUmb0",
                "updated_at": "2024-05-06T02:21:50Z",
                "username": "claybanks",
                "name": "Clay Banks",
                "first_name": "Clay",
                "last_name": "Banks",
                "twitter_username": "ClayBanks",
                "portfolio_url": "http://claybanks.info",
                "bio": "👨🏽‍💻 Software Developer 📷 Freelance Photographer 🚐 Van Lifer // If you use my images and would like to say thanks, feel free to donate via the PayPal link on my profile\r\nPresets & Prints 👉🏽 https://claybanks.info",
                "location": "New York",
                "links": {
                  "self": "https://api.unsplash.com/users/claybanks",
                  "html": "https://unsplash.com/@claybanks",
                  "photos": "https://api.unsplash.com/users/claybanks/photos",
                  "likes": "https://api.unsplash.com/users/claybanks/likes",
                  "portfolio": "https://api.unsplash.com/users/claybanks/portfolio",
                  "following": "https://api.unsplash.com/users/claybanks/following",
                  "followers": "https://api.unsplash.com/users/claybanks/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1670236743900-356b1ee0dc42image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1670236743900-356b1ee0dc42image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1670236743900-356b1ee0dc42image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "clay.banks",
                "total_collections": 38,
                "total_likes": 514,
                "total_photos": 1244,
                "total_promoted_photos": 629,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "clay.banks",
                  "portfolio_url": "http://claybanks.info",
                  "twitter_username": "ClayBanks",
                  "paypal_email": null
                }
              }
            },
            {
              "id": "vKUIvTj45nc",
              "slug": "a-couple-of-tall-buildings-next-to-each-other-vKUIvTj45nc",
              "alternative_slugs": {
                "en": "a-couple-of-tall-buildings-next-to-each-other-vKUIvTj45nc",
                "es": "un-par-de-edificios-altos-uno-al-lado-del-otro-vKUIvTj45nc",
                "ja": "隣り合った高層ビルが数棟-vKUIvTj45nc",
                "fr": "quelques-grands-batiments-lun-a-cote-de-lautre-vKUIvTj45nc",
                "it": "un-paio-di-edifici-alti-uno-accanto-allaltro-vKUIvTj45nc",
                "ko": "나란히-있는-두-개의-높은-건물-vKUIvTj45nc",
                "de": "ein-paar-hohe-gebaude-nebeneinander-vKUIvTj45nc",
                "pt": "um-par-de-edificios-altos-um-ao-lado-do-outro-vKUIvTj45nc"
              },
              "created_at": "2024-05-04T07:23:17Z",
              "updated_at": "2024-05-05T23:31:38Z",
              "promoted_at": "2024-05-05T07:17:12Z",
              "width": 4016,
              "height": 6016,
              "color": "#c0f3f3",
              "blur_hash": "LmG]dUX9VsR5.mozsSadtlozjtWW",
              "description": null,
              "alt_description": "a couple of tall buildings next to each other",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714807241573-e843a80d081a?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714807241573-e843a80d081a?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714807241573-e843a80d081a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714807241573-e843a80d081a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714807241573-e843a80d081a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714807241573-e843a80d081a"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-couple-of-tall-buildings-next-to-each-other-vKUIvTj45nc",
                "html": "https://unsplash.com/photos/a-couple-of-tall-buildings-next-to-each-other-vKUIvTj45nc",
                "download": "https://unsplash.com/photos/vKUIvTj45nc/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/vKUIvTj45nc/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 24,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": {
                "architecture-interior": {
                  "status": "unevaluated"
                }
              },
              "asset_type": "photo",
              "user": {
                "id": "wMHkmdw4gq8",
                "updated_at": "2024-05-06T05:46:53Z",
                "username": "jetztabertempo",
                "name": "Pascal Bullan",
                "first_name": "Pascal",
                "last_name": "Bullan",
                "twitter_username": null,
                "portfolio_url": null,
                "bio": "I'm a hobby photographer specializing in landscapes, nature, still life, and interior photography. Thank you for visiting! If you enjoy my work, I would greatly appreciate your support.",
                "location": "Berlin",
                "links": {
                  "self": "https://api.unsplash.com/users/jetztabertempo",
                  "html": "https://unsplash.com/@jetztabertempo",
                  "photos": "https://api.unsplash.com/users/jetztabertempo/photos",
                  "likes": "https://api.unsplash.com/users/jetztabertempo/likes",
                  "portfolio": "https://api.unsplash.com/users/jetztabertempo/portfolio",
                  "following": "https://api.unsplash.com/users/jetztabertempo/following",
                  "followers": "https://api.unsplash.com/users/jetztabertempo/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1688132159028-a405605a029bimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1688132159028-a405605a029bimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1688132159028-a405605a029bimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": null,
                "total_collections": 2,
                "total_likes": 33,
                "total_photos": 288,
                "total_promoted_photos": 22,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": null,
                  "portfolio_url": null,
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "1pcMSzyNPyg",
              "slug": "a-man-holding-a-surfboard-standing-on-top-of-a-beach-1pcMSzyNPyg",
              "alternative_slugs": {
                "en": "a-man-holding-a-surfboard-standing-on-top-of-a-beach-1pcMSzyNPyg",
                "es": "un-hombre-sosteniendo-una-tabla-de-surf-de-pie-en-la-parte-superior-de-una-playa-1pcMSzyNPyg",
                "ja": "ビーチの上に立つサーフボードを持つ男性-1pcMSzyNPyg",
                "fr": "un-homme-tenant-une-planche-de-surf-debout-sur-une-plage-1pcMSzyNPyg",
                "it": "un-uomo-che-tiene-una-tavola-da-surf-in-piedi-in-cima-a-una-spiaggia-1pcMSzyNPyg",
                "ko": "해변-꼭대기에-서-있는-서핑-보드를-들고-있는-남자-1pcMSzyNPyg",
                "de": "ein-mann-mit-einem-surfbrett-der-auf-einem-strand-steht-1pcMSzyNPyg",
                "pt": "um-homem-segurando-uma-prancha-de-surf-em-cima-de-uma-praia-1pcMSzyNPyg"
              },
              "created_at": "2024-04-29T16:21:25Z",
              "updated_at": "2024-05-05T21:00:06Z",
              "promoted_at": "2024-05-05T06:35:59Z",
              "width": 5000,
              "height": 3333,
              "color": "#f3d9a6",
              "blur_hash": "LeO-.jayjFoL~Aj[jZfQtloKWBay",
              "description": "Surfer girl coming out of the water after amazing sunset surf (Playa Maderas, San Juan del Sur, Nicaragua)",
              "alt_description": "a man holding a surfboard standing on top of a beach",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714407625814-84b96fdaeb81?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714407625814-84b96fdaeb81?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714407625814-84b96fdaeb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714407625814-84b96fdaeb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714407625814-84b96fdaeb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714407625814-84b96fdaeb81"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-man-holding-a-surfboard-standing-on-top-of-a-beach-1pcMSzyNPyg",
                "html": "https://unsplash.com/photos/a-man-holding-a-surfboard-standing-on-top-of-a-beach-1pcMSzyNPyg",
                "download": "https://unsplash.com/photos/1pcMSzyNPyg/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/1pcMSzyNPyg/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOXx8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 16,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "1B_kyZUKlwk",
                "updated_at": "2024-05-05T13:53:44Z",
                "username": "mariovr",
                "name": "Mario von Rotz",
                "first_name": "Mario",
                "last_name": "von Rotz",
                "twitter_username": null,
                "portfolio_url": null,
                "bio": "I like to spend time in the nature and take pictures of beautiful landscapes // 23 year old swiss",
                "location": "Switzerland",
                "links": {
                  "self": "https://api.unsplash.com/users/mariovr",
                  "html": "https://unsplash.com/@mariovr",
                  "photos": "https://api.unsplash.com/users/mariovr/photos",
                  "likes": "https://api.unsplash.com/users/mariovr/likes",
                  "portfolio": "https://api.unsplash.com/users/mariovr/portfolio",
                  "following": "https://api.unsplash.com/users/mariovr/following",
                  "followers": "https://api.unsplash.com/users/mariovr/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1678996677037-08385ea11674image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1678996677037-08385ea11674image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1678996677037-08385ea11674image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "vr_mario",
                "total_collections": 0,
                "total_likes": 0,
                "total_photos": 88,
                "total_promoted_photos": 23,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": false,
                "social": {
                  "instagram_username": "vr_mario",
                  "portfolio_url": null,
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            },
            {
              "id": "pL5dNKZbDPM",
              "slug": "a-view-of-the-ocean-from-a-beach-pL5dNKZbDPM",
              "alternative_slugs": {
                "en": "a-view-of-the-ocean-from-a-beach-pL5dNKZbDPM",
                "es": "una-vista-del-oceano-desde-una-playa-pL5dNKZbDPM",
                "ja": "ビーチから海を眺める-pL5dNKZbDPM",
                "fr": "une-vue-sur-locean-depuis-une-plage-pL5dNKZbDPM",
                "it": "una-vista-sulloceano-da-una-spiaggia-pL5dNKZbDPM",
                "ko": "해변에서-바라본-바다-풍경-pL5dNKZbDPM",
                "de": "blick-auf-das-meer-vom-strand-aus-pL5dNKZbDPM",
                "pt": "uma-vista-para-o-oceano-a-partir-de-uma-praia-pL5dNKZbDPM"
              },
              "created_at": "2024-05-01T19:31:58Z",
              "updated_at": "2024-05-06T05:17:18Z",
              "promoted_at": "2024-05-05T06:35:54Z",
              "width": 4606,
              "height": 6910,
              "color": "#c0d9f3",
              "blur_hash": "L^G+wFayRjj[?wWCayfRtRWVofay",
              "description": null,
              "alt_description": "a view of the ocean from a beach",
              "breadcrumbs": [ ],
              "urls": {
                "raw": "https://images.unsplash.com/photo-1714591755376-349fd01b41cb?ixid=M3wxMTY5OTZ8MHwxfGFsbHwyMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3",
                "full": "https://images.unsplash.com/photo-1714591755376-349fd01b41cb?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=85",
                "regular": "https://images.unsplash.com/photo-1714591755376-349fd01b41cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1714591755376-349fd01b41cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1714591755376-349fd01b41cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8&ixlib=rb-4.0.3&q=80&w=200",
                "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1714591755376-349fd01b41cb"
              },
              "links": {
                "self": "https://api.unsplash.com/photos/a-view-of-the-ocean-from-a-beach-pL5dNKZbDPM",
                "html": "https://unsplash.com/photos/a-view-of-the-ocean-from-a-beach-pL5dNKZbDPM",
                "download": "https://unsplash.com/photos/pL5dNKZbDPM/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwyMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8",
                "download_location": "https://api.unsplash.com/photos/pL5dNKZbDPM/download?ixid=M3wxMTY5OTZ8MHwxfGFsbHwyMHx8fHx8fDJ8fDE3MTQ5NzUxMjJ8"
              },
              "likes": 58,
              "liked_by_user": false,
              "current_user_collections": [ ],
              "sponsorship": null,
              "topic_submissions": { },
              "asset_type": "photo",
              "user": {
                "id": "AxLKdsgtBvU",
                "updated_at": "2024-05-06T03:11:50Z",
                "username": "tmokuenko",
                "name": "Thibault Mokuenko",
                "first_name": "Thibault",
                "last_name": "Mokuenko",
                "twitter_username": null,
                "portfolio_url": null,
                "bio": "French photographer, mostly nature, surfing and travel pics.\r\n 📸 : Sony a7IV and 35 mm GM",
                "location": "SGXV",
                "links": {
                  "self": "https://api.unsplash.com/users/tmokuenko",
                  "html": "https://unsplash.com/@tmokuenko",
                  "photos": "https://api.unsplash.com/users/tmokuenko/photos",
                  "likes": "https://api.unsplash.com/users/tmokuenko/likes",
                  "portfolio": "https://api.unsplash.com/users/tmokuenko/portfolio",
                  "following": "https://api.unsplash.com/users/tmokuenko/following",
                  "followers": "https://api.unsplash.com/users/tmokuenko/followers"
                },
                "profile_image": {
                  "small": "https://images.unsplash.com/profile-1678993596605-cbac79b8f296image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
                  "medium": "https://images.unsplash.com/profile-1678993596605-cbac79b8f296image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
                  "large": "https://images.unsplash.com/profile-1678993596605-cbac79b8f296image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
                },
                "instagram_username": "thibault.mokuenko ",
                "total_collections": 1,
                "total_likes": 168,
                "total_photos": 77,
                "total_promoted_photos": 21,
                "total_illustrations": 0,
                "total_promoted_illustrations": 0,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                  "instagram_username": "thibault.mokuenko ",
                  "portfolio_url": null,
                  "twitter_username": null,
                  "paypal_email": null
                }
              }
            }
          ],
          "total": 100,
          "total_pages": 5
    }
      res.json(photospolotno);
    // }, 1000); // Delay of 1 second
  });


router.post('/updatesignuptype/:userid', async (req, res) => {
    const userid = req.params.userid;
    const { signuptype } = req.body;
  
    try {
      const user = await User.findById(userid);
        
      if (!user) {
        return res.status(404).json({ Success: false, message: 'User not found' });
      }
  
      user.signuptype = signuptype;
      await user.save();
  
      res.json({ Success: true, message: 'User signuptype updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ Success: false, message: 'Server error' });
    }
  });
  



// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   console.log('Received email:', email);
//   try {
//     const user = await User.findOne({ email });
//     console.log('Retrieved user:', user);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const resetToken = crypto.randomBytes(20).toString('hex');
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // Token expiry time (e.g., 1 hour)
//     await user.save();

//     // Nodemailer setup
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//     secure: false,
//     auth: {
//         user: "jdwebservices1@gmail.com",
//         pass: "cwoxnbrrxvsjfbmr"
//     },
//     tls:{
//       rejectUnauthorized: false
//     }
//     });

//     const mailOptions = {
//       from: 'your_email@example.com',
//       to: user.email,
//       subject: 'Reset your password',
//       text: `You are receiving this because you (or someone else) have requested to reset your password.\n\n
//             Please click on the following link, or paste this into your browser to complete the process:\n\n
//             ${req.headers.origin}/reset-password/${resetToken}\n\n
//             If you did not request this, please ignore this email and your password will remain unchanged.\n`
//     };

//     await transporter.sendMail(mailOptions);

//     return res.status(200).json({ message: 'Reset password email sent' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error sending email' });
//   }
// });

router.post("/addrestaurant",
    [
        body('email').isEmail(),
        body('name').isLength({min:3}),
        body('type').isLength(),
        body('number').isNumeric(),
        body('city').isLength(),
        body('state').isLength(),
        body('country').isLength(),
        body('zip').isNumeric(),
        body('timezone').isLength(),
        body('nickname').isLength(),
        body('uniquename').isLength(),
        
        // body('address').isLength(),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        let authtoken = req.headers.authorization;
        try {
        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

            Restaurant.create({
                userid: req.body.userid,
                name: req.body.name,
                type: req.body.type,
                email: req.body.email,
                number: req.body.number,
                country: req.body.country,
                countryid: req.body.countryid,
                city: req.body.city,
                cityid: req.body.cityid,
                state: req.body.state,
                stateid: req.body.stateid,
                countrydata: req.body.countrydata,
                statedata: req.body.statedata,
                citydata: req.body.citydata,
                zip: req.body.zip,
                address: req.body.address,
                timezone: req.body.timezone,
                nickname: req.body.nickname,
                uniquename: req.body.uniquename,
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Restaurent has been successfully added! "
            })
        }
        catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/addstore",
    [
        body('email').isEmail(),
        body('name').isLength({min:3}),
        body('type').isLength(),
        body('number').isNumeric(),
        body('city').isLength(),
        body('state').isLength(),
        body('country').isLength(),
        body('zip').isNumeric(),
        body('timezone').isLength(),
        body('nickname').isLength(),
        body('uniquename').isLength(),
        
        // body('address').isLength(),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        let authtoken = req.headers.authorization;
        try {
        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

            Store.create({
                userid: req.body.userid,
                name: req.body.name,
                uniquename: req.body.uniquename,
                type: req.body.type,
                email: req.body.email,
                number: req.body.number,
                country: req.body.country,
                countryid: req.body.countryid,
                city: req.body.city,
                cityid: req.body.cityid,
                state: req.body.state,
                stateid: req.body.stateid,
                countrydata: req.body.countrydata,
                statedata: req.body.statedata,
                citydata: req.body.citydata,
                zip: req.body.zip,
                address: req.body.address,
                timezone: req.body.timezone,
                nickname: req.body.nickname,
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Store has been successfully added! "
            })
        }
        catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/addbusiness",
    [
        body('email').isEmail(),
        body('name').isLength({min:3}),
        body('type').isLength(),
        body('number').isNumeric(),
        body('city').isLength(),
        body('state').isLength(),
        body('country').isLength(),
        body('zip').isNumeric(),
        body('timezone').isLength(),
        body('nickname').isLength(),
        body('uniquename').isLength(),
        
        // body('address').isLength(),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        let authtoken = req.headers.authorization;
        try {
        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
            Business.create({
                userid: req.body.userid,
                name: req.body.name,
                uniquename: req.body.uniquename,
                type: req.body.type,
                email: req.body.email,
                number: req.body.number,
                country: req.body.country,
                countryid: req.body.countryid,
                city: req.body.city,
                cityid: req.body.cityid,
                state: req.body.state,
                stateid: req.body.stateid,
                countrydata: req.body.countrydata,
                statedata: req.body.statedata,
                citydata: req.body.citydata,
                zip: req.body.zip,
                address: req.body.address,
                timezone: req.body.timezone,
                nickname: req.body.nickname,
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Business has been successfully added! "
            })
        }
        catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/addproduct",
    [
        // body('name').isLength({ min: 3 }),
        // body('quantity').isNumeric(),
        // body('description').isLength({ min: 3 }),
        // body('size').isLength(),
        // body('colour').isLength(),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        let authtoken = req.headers.authorization;
        try {
        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
            Product.create({
                userid: req.body.userid,
                storeId: req.body.storeId,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                size: req.body.size,
                colour: req.body.colour,
                quantity: req.body.quantity,
                isAvailable: req.body.isAvailable,
                imageUrl: req.body.imageUrl,
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Product has been successfully added! "
            })
        }
        
        catch (error) {
            console.error(error);
            // Handle token verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    });

router.post("/addservice",
    [
        // body('name').isLength({ min: 3 }),
        // body('price').isNumeric(),
        // body('time').isLength(),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        let authtoken = req.headers.authorization;
        try {
        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
            Service.create({
                userid: req.body.userid,
                businessId: req.body.businessId,
                name: req.body.name,
                price: req.body.price,
                time: req.body.time,
                imageUrl: req.body.imageUrl,
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Service has been successfully added! "
            })
        }
        
        catch (error) {
            console.error(error);
            // Handle token verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/timezones', (req, res) => {
        // Get a list of timezones using moment-timezone
        const timezones = momentTimezone.tz.names();
      
        // Send the list of timezones as a JSON response
        res.json(timezones);
      });

    router.get('/restaurants/:userid', async (req, res) => {
        try {            
            let userid = req.params.userid;
            let authtoken = req.headers.authorization;
    
            // Verify JWT token
            const decodedToken = jwt.verify(authtoken, jwrsecret);
            console.log(decodedToken);
    
            // Find restaurants using userid
            const restaurants = (await Restaurant.find({ userid: userid}));
            res.json(restaurants);
        } catch (error) {
            console.error(error);
            // Handle token verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/store/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);

        // Find store using userid
        const store = await Store.find({ userid: userid });
        res.json(store);
    } catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

    // router.get('/store/:userid', async (req, res) => {
    //     try {
    //         let userid = req.params.userid;
    //         let authtoken = req.headers.authorization;
    //        const jwtg =  jwt.verify(authtoken, jwrsecret);
    //         console.log(jwtg);
    //         // jwt.verify(authtoken, jwrsecret), async (err, decodedToken) => {
    //         //     if (err) {
    //         //         console.error(err);
    //         //         // return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    //         //     } else {
    //         //         // Token is valid, you can access the decoded information
    //         //         console.log(decodedToken, "decodedToken");
    //         const store = (await Store.find({ userid: userid}));
    //         res.json(store);
    //         //     }
    //         // }
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // });

    router.get('/business/:userid', async (req, res) => {
        try {
            let userid = req.params.userid;
            let authtoken = req.headers.authorization;
    
            // Verify JWT token
            const decodedToken = jwt.verify(authtoken, jwrsecret);
            console.log(decodedToken);

            const business = (await Business.find({ userid: userid}));
            res.json(business);
        } catch (error) {
            console.error(error);
            // Handle token verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Define a route to handle duplicating a business
// router.get('/duplicateBusiness/:businessId/:userid', async (req, res) => {
//     try {
//         let userid = req.params.userid;
//         let businessId = req.params.businessId;
//         console.log('Received request to duplicate business:', businessId ,userid);

//         // Fetch the business details from the database using the provided businessId
//         const existingBusiness = await Business.findById(businessId);
//         console.log('Existing Business:', existingBusiness);

//         if (!existingBusiness || existingBusiness.length === 0) {
//             return res.status(404).json({ success: false, message: 'Business not found' });
//         }
        

//         // Create a new business based on the existing business details
//         const newBusiness = new Business({
//             name: existingBusiness.name + '_copy' ,
//             nickname: existingBusiness.nickname,
//             type: existingBusiness.type ,
//             email: existingBusiness.email,
//             number: existingBusiness.number,
//             country: existingBusiness.country,
//             state: existingBusiness.state,
//             city: existingBusiness.city,
//             countryid: existingBusiness.countryid,
//             stateid: existingBusiness.stateid,
//             cityid: existingBusiness.cityid,
//             countrydata: existingBusiness.countrydata,
//             statedata: existingBusiness.statedata,
//             citydata: existingBusiness.citydata,
//             zip: existingBusiness.zip,
//             address: existingBusiness.address,
//             timezone: existingBusiness.timezone,
//             userid: userid,
//         });

//         // Save the duplicated business to the database
//         const savedBusiness = await newBusiness.save();

//         // Respond with success and the duplicated business details
//         res.status(200).json({ success: true, duplicatedBusiness: savedBusiness });
//     } catch (error) {
//         console.error('Error duplicating business:', error);
//         res.status(500).json({ success: false, message: 'Error duplicating business' });
//     }
// });

router.get('/duplicateBusiness/:businessId/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        let businessId = req.params.businessId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);

        // Fetch the business details from the database using the provided businessId
        const existingBusiness = await Business.findById(businessId);
        console.log('Existing Business:', existingBusiness);

        if (!existingBusiness) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }

        // Fetch service data associated with the existing business
        const existingServiceData = await Service.find({ businessId: businessId });

        // Create a new business based on the existing business details
        const newBusiness = new Business({
            name: existingBusiness.name + '_copy',
            uniquename: existingBusiness.name + '_copy',
            nickname: existingBusiness.nickname,
            type: existingBusiness.type ,
            email: existingBusiness.email,
            number: existingBusiness.number,
            country: existingBusiness.country,
            state: existingBusiness.state,
            city: existingBusiness.city,
            countryid: existingBusiness.countryid,
            stateid: existingBusiness.stateid,
            cityid: existingBusiness.cityid,
            countrydata: existingBusiness.countrydata,
            statedata: existingBusiness.statedata,
            citydata: existingBusiness.citydata,
            zip: existingBusiness.zip,
            address: existingBusiness.address,
            timezone: existingBusiness.timezone,
            userid: userid,
        });
        // Save the duplicated business to get the new business _id
        const savedBusiness = await newBusiness.save();

        // Duplicate service data associated with the business
        const duplicatedServiceData = existingServiceData.map(service => ({
            ...service.toObject(),
            _id: mongoose.Types.ObjectId(), // Exclude the _id field to create a new document
            businessId: savedBusiness._id, // Associate with the newly duplicated business _id
        }));
        
        // Save the duplicated service data
        await Service.insertMany(duplicatedServiceData);

        // Respond with success and the duplicated business details
        res.status(200).json({ success: true, duplicatedBusiness: savedBusiness });
    } catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/duplicateStore/:storeId/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        let storeId = req.params.storeId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);

        // Fetch the business details from the database using the provided storeId
        const existingStore = await Store.findById(storeId);
        console.log('Existing Store:', existingStore);

        if (!existingStore) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        // Fetch service data associated with the existing business
        const existingProductData = await Product.find({ storeId: storeId });

        // await Product.deleteMany({ storeId: storeId });

        // Create a new business based on the existing business details
        const newStore = new Store({
            name: existingStore.name + '_copy',
            uniquename: existingStore.name + '_copy',
            nickname: existingStore.nickname,
            type: existingStore.type ,
            email: existingStore.email,
            number: existingStore.number,
            country: existingStore.country,
            state: existingStore.state,
            city: existingStore.city,
            countryid: existingStore.countryid,
            stateid: existingStore.stateid,
            cityid: existingStore.cityid,
            countrydata: existingStore.countrydata,
            statedata: existingStore.statedata,
            citydata: existingStore.citydata,
            zip: existingStore.zip,
            address: existingStore.address,
            timezone: existingStore.timezone,
            userid: userid,
        });
        // Save the duplicated Store to get the new store _id
        const savedStore = await newStore.save();

        // Duplicate product data associated with the store
        const duplicatedProductData = existingProductData.map(product => ({
            ...product.toObject(),
            _id: mongoose.Types.ObjectId(), // Exclude the _id field to create a new document
            storeId: savedStore._id, // Associate with the newly duplicated store _id
        }));
        
        // Save the duplicated Product data
        await Product.insertMany(duplicatedProductData);

        // Respond with success and the duplicated store details
        res.status(200).json({ success: true, duplicatedStore: savedStore });
    }  catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

// router.get('/duplicateRestaurant/:restaurantId/:userid', async (req, res) => {
//     try {
//         let userid = req.params.userid;
//         let restaurantId = req.params.restaurantId;
//         console.log('Received request to duplicate Restaurent:', restaurantId, userid);

//         // Fetch the business details from the database using the provided restaurantId
//         const existingRestaurent = await Restaurent.findById(restaurantId);
//         console.log('Existing Restaurent:', existingRestaurent);

//         if (!existingRestaurent) {
//             return res.status(404).json({ success: false, message: 'Restaurent not found' });
//         }

//         // Fetch service data associated with the existing business

//         // Create a new business based on the existing business details
//         const newRestaurant = new Restaurent({
//             name: existingRestaurent.name + '_copy',
//             nickname: existingRestaurent.nickname,
//             type: existingRestaurent.type ,
//             email: existingRestaurent.email,
//             number: existingRestaurent.number,
//             country: existingRestaurent.country,
//             state: existingRestaurent.state,
//             city: existingRestaurent.city,
//             countryid: existingRestaurent.countryid,
//             stateid: existingRestaurent.stateid,
//             cityid: existingRestaurent.cityid,
//             countrydata: existingRestaurent.countrydata,
//             statedata: existingRestaurent.statedata,
//             citydata: existingRestaurent.citydata,
//             zip: existingRestaurent.zip,
//             address: existingRestaurent.address,
//             timezone: existingRestaurent.timezone,
//             userid: userid,
//         });
//         // Save the duplicated Store to get the new store _id
//         const savedRestaurant = await newRestaurant.save();

//         const existingCategories = await Category.find({ restaurantId: restaurantId });


//         // Duplicate product data associated with the store
//         const duplicatedCategories = existingCategories.map(category => ({
//             ...category.toObject(),
//             _id: mongoose.Types.ObjectId(), // Exclude the _id field to create a new document
//             restaurantId: savedRestaurant._id, // Associate with the newly duplicated restaurant _id
//         }));
        
//         // Save the duplicated Category data
//         await Category.insertMany(duplicatedCategories);

        
//         const existingsubCategories = await Subcategory.find({ categoryId: category.id });
//         // Respond with success and the duplicated restaurant details
//         res.status(200).json({ success: true, duplicatedRestaurant: savedRestaurant  });
//     } catch (error) {
//         console.error('Error duplicating restaurant:', error);
//         res.status(500).json({ success: false, message: 'Error duplicating restaurant' });
//     }
// });

router.get('/duplicateRestaurant/:restaurantId/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        let restaurantId = req.params.restaurantId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);


        // Fetch the business details from the database using the provided restaurantId
        const existingRestaurent = await Restaurent.findById(restaurantId);
        console.log('Existing Restaurent:', existingRestaurent);

        if (!existingRestaurent) {
            return res.status(404).json({ success: false, message: 'Restaurent not found' });
        }

        // Fetch service data associated with the existing business

        // Create a new business based on the existing business details
        const newRestaurant = new Restaurent({
            name: existingRestaurent.name + '_copy',
            uniquename: existingRestaurent.name + '_copy',
            nickname: existingRestaurent.nickname,
            type: existingRestaurent.type ,
            email: existingRestaurent.email,
            number: existingRestaurent.number,
            country: existingRestaurent.country,
            state: existingRestaurent.state,
            city: existingRestaurent.city,
            countryid: existingRestaurent.countryid,
            stateid: existingRestaurent.stateid,
            cityid: existingRestaurent.cityid,
            countrydata: existingRestaurent.countrydata,
            statedata: existingRestaurent.statedata,
            citydata: existingRestaurent.citydata,
            zip: existingRestaurent.zip,
            address: existingRestaurent.address,
            timezone: existingRestaurent.timezone,
            userid: userid,
        });
        // Save the duplicated Store to get the new store _id
        const savedRestaurant = await newRestaurant.save();

        const existingCategories = await Category.find({ restaurantId: restaurantId });

        const duplicatedCategories = [];
        const duplicatedSubcategories = [];
        const duplicateditems = [];

        existingCategories.forEach(async category => {
            const newCategoryId = mongoose.Types.ObjectId(); // Generate new ID for the duplicated category

            // Duplicate the category
            const duplicatedCategory = {
                ...category.toObject(),
                _id: newCategoryId,
                restaurantId: savedRestaurant._id,
            };

            duplicatedCategories.push(duplicatedCategory);

            // Fetch subcategories for the current category
            const existingSubcategories = await Subcategory.find({ category: category._id });

            // Duplicate subcategories and associate them with the new category ID
            // const subcategories = existingSubcategories.map(subcategory => ({
                existingSubcategories.forEach(async subcategory => {
            const newsubCategoryId = mongoose.Types.ObjectId();


                
            // Duplicate the category
            const duplicatedSubCategory = {
                ...subcategory.toObject(),
                _id: newsubCategoryId, // Generate new ID for the duplicated subcategory
                category: newCategoryId,
                restaurantId: savedRestaurant._id,
            }

            // duplicatedCategories.push(duplicatedCategory);
            //     ...subcategory.toObject(),
            //     _id: newsubCategoryId, // Generate new ID for the duplicated subcategory
            //     category: newCategoryId,
            //     restaurantId: savedRestaurant._id,
            // }));

            duplicatedSubcategories.push(duplicatedSubCategory);
        
            // Fetch subcategories for the current category
            const existingitems = await Items.find({ subcategoryId: subcategory._id });
            const newitemsId = mongoose.Types.ObjectId();

            // Duplicate subcategories and associate them with the new category ID
            const items = existingitems.map(item => ({
                ...item.toObject(),
                _id: new mongoose.Types.ObjectId(), // Generate new ID for the duplicated subcategory
                category: newCategoryId,
                subcategoryId:newsubCategoryId,
                restaurantId: savedRestaurant._id,
            }));

            duplicateditems.push(...items);
        });
        });

        // Save the duplicated categories and subcategories
        await Category.insertMany(duplicatedCategories);
        await Subcategory.insertMany(duplicatedSubcategories);
        await Items.insertMany(duplicateditems);

        // Respond with success and the duplicated restaurant details
        res.status(200).json({ success: true, duplicatedRestaurant: savedRestaurant });
    } catch (error) {

        console.error('Error duplicating restaurant:', error);
// res.status(500).json({ success: false, message: 'Error duplicating restaurant' });
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

    router.get('/products/:storeId', async (req, res) => {
        try {
            let storeId = req.params.storeId;
            let authtoken = req.headers.authorization;
    
            // Verify JWT token
            const decodedToken = jwt.verify(authtoken, jwrsecret);
            console.log(decodedToken);
            const products = (await Product.find({ storeId: storeId}));
            res.json(products);
        } catch (error) {
            console.error(error);
            // Handle token verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/getuserdata', async (req, res) => {
        try {
            let authtoken = req.headers.authorization;
    
            // Verify JWT token
            const decodedToken = jwt.verify(authtoken, jwrsecret);
            console.log(decodedToken);
            // {"user":{"id":"654898b61805a602fef09247"},"iat":1714627160}
            const users = (await User.findById(decodedToken.user.id).select('-password'));
            if (!users) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(users);
        } catch (error) {
            console.error(error);
            // Handle token verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/getservicesformenu/:uniquename', async (req, res) => {
        try {
        const uniquename = (req.params.uniquename).toLowerCase();
        const business1 = await Business.find({uniquename: uniquename});
            console.error(business1);
            if(business1.length > 0){    
            const services = (await Service.find({ businessId: business1[0]._id, isAvailable: true}));
            res.json(services);
            }else{
                res.json([]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/getstoreproductsformenu/:uniquename', async (req, res) => {
        try {
        const uniquename = (req.params.uniquename).toLowerCase();
        const store1 = await Store.find({uniquename: uniquename});
            console.error(store1);
            if(store1.length > 0){    
            const products = (await Product.find({ storeId: store1[0]._id, isAvailable: true}));
            res.json(products);
            }else{
                res.json([]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.get('/getproductsformenu/:storeId', async (req, res) => {
        try {
            let storeId = req.params.storeId;
            const products = (await Product.find({ storeId: storeId}));
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/services/:businessId', async (req, res) => {
        try {
            let businessId = req.params.businessId;
            let authtoken = req.headers.authorization;
    
            // Verify JWT token
            const decodedToken = jwt.verify(authtoken, jwrsecret);
            console.log(decodedToken);
            const services = (await Service.find({ businessId: businessId}));
            res.json(services);
        } catch (error) {
            console.error(error);
            // Handle token verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // API endpoint to save user preferences
  router.post('/saveStorePreferences', async (req, res) => {
    try {
      const { userid,storeId, storePreference } = req.body;
  
      // Create a new user preference document
      const newstorePreference = new Storedatapreference({
        userId: userid,
        storeId: storeId,
        backgroundColor: storePreference.backgroundColor,
        textColor: storePreference.textColor,
        headingTextColor: storePreference.headingTextColor,
        storenameColor: storePreference.storenameColor,
        font: storePreference.font,
        fontlink: storePreference.fontlink,
        backgroundImage: storePreference.backgroundImage,
        // Add other preferences here
      });
  
      // Save the user preference to the database
      const savedstorePreference = await newstorePreference.save();
  
      res.json(savedstorePreference);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      res.status(500).json({ error: 'Failed to save user preferences' });
    }
  });

   // In your backend API (e.g., Express.js)
router.get('/getStorePreferences/:storeId', async (req, res) => {
    try {
      const storeId = req.params.storeId;
      // Retrieve user preferences from the database based on the user ID
      const storePreference = await Storedatapreference.find({ storeId: storeId });
      res.json(storePreference);
    } catch (error) {
      console.error('Error retrieving user preferences:', error);
      res.status(500).json({ error: 'Failed to retrieve user preferences' });
    }
  });

    // API endpoint to save user preferences
  router.post('/saveBusinessPreference', async (req, res) => {
    try {
      const { userid,businessId, businessPreference } = req.body;
  
      // Create a new user preference document
      const newBusinessPreference = new BusinessPreference({
        userId: userid,
        businessId: businessId,
        backgroundColor: businessPreference.backgroundColor,
        textColor: businessPreference.textColor,
        headingTextColor: businessPreference.headingTextColor,
        businessnameColor: businessPreference.businessnameColor,
        font: businessPreference.font,
        fontlink: businessPreference.fontlink,
        // Add other preferences here
      });
  
      // Save the user preference to the database
      const savedbusinessPreference = await newBusinessPreference.save();
  
      res.json(savedbusinessPreference);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      res.status(500).json({ error: 'Failed to save user preferences' });
    }
  });

   // In your backend API (e.g., Express.js)
router.get('/getBusinessPreferences/:businessId', async (req, res) => {
    try {
      const businessId = req.params.businessId;
      // Retrieve user preferences from the database based on the user ID
      const businessPreference = await BusinessPreference.find({ businessId: businessId });
      res.json(businessPreference);
    } catch (error) {
      console.error('Error retrieving user preferences:', error);
      res.status(500).json({ error: 'Failed to retrieve user preferences' });
    }
  });

    // router.get('/products/:storeId', async (req, res) => {
    //     console.log("Reached before try block");
    //     try {
    //         const storeId = req.params.storeId;
    //         console.log("Inside try block, storeId:", storeId);
    //         const products = await Retailer.find({ storeId: storeId });
    //         console.log("Products:", products);
    //         res.json(products);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // });
    
    

    

        router.get('/getrestaurants/:restaurantId', async (req, res) => {
            try {
                const restaurantId = req.params.restaurantId;
                console.log(restaurantId);
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                const result = await Restaurant.findById(restaurantId);
        
                if (result) {
                    res.json({
                        Success: true,
                        message: "Restaurant retrieved successfully",
                        restaurant: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "Restaurant not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        router.get('/getstores/:storeId', async (req, res) => {
            try {
                const storeId = req.params.storeId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                const result = await Store.findById(storeId);
        
                if (result) {
                    res.json({
                        Success: true,
                        message: "store retrieved successfully",
                        store: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "store not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        router.get('/getbusinessdata/:businessId', async (req, res) => {
            try {
                const businessId = req.params.businessId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                const result = await Business.findById(businessId);
        
                if (result) {
                    res.json({
                        Success: true,
                        message: "Business retrieved successfully",
                        business: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "Business not found"
                    });
                }
            }  catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        router.get('/getproducts/:productId', async (req, res) => {
            try {
                const productId = req.params.productId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                const result = await Product.findById(productId);
        
                if (result) {
                    res.json({
                        Success: true,
                        message: "product retrieved successfully",
                        product: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "product not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        router.get('/getservices/:serviceId', async (req, res) => {
            try {
                const serviceId = req.params.serviceId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                const result = await Service.findById(serviceId);
        
                if (result) {
                    res.json({
                        Success: true,
                        message: "Service retrieved successfully",
                        service: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "Service not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });


        // Update a restaurant using POST
        router.post('/restaurants/:restaurantId', async (req, res) => {
            try {
                const restaurantId = req.params.restaurantId; // Fix here
                const updatedrestaurant = req.body;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
            
                const result = await Restaurant.findByIdAndUpdate(restaurantId, updatedrestaurant, { new: true });
            
                if (result) {
                    res.json({
                        Success: true,
                        message: "restaurant updated successfully",
                        restaurant: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "restaurant not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Update a store using POST
        router.post('/updatestore/:storeId', async (req, res) => {
            try {
                const storeId = req.params.storeId;
                let authtoken = req.headers.authorization;
    
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
                const updatedstore = req.body;
            
                const result = await Store.findByIdAndUpdate(storeId, updatedstore, { new: true });
            
                if (result) {
                    res.json({
                        Success: true,
                        message: "store updated successfully",
                        store: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "store not found"
                    });
                }
            }  catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Update a businessdata using POST
        router.post('/updatebusinessdata/:businessId', async (req, res) => {
            try {
                const businessId = req.params.businessId; // Fix here
                const updatedbusinessdata = req.body;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
            
                const result = await Business.findByIdAndUpdate(businessId, updatedbusinessdata, { new: true });
            
                if (result) {
                    res.json({
                        Success: true,
                        message: "Business updated successfully",
                        business: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "Business not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Update a product using POST
        router.post('/updateproduct/:productId', async (req, res) => {
            try {
                const productId = req.params.productId; // Fix here
                const updatedProduct = req.body;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
            
                const result = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
            
                if (result) {
                    res.json({
                        Success: true,
                        message: "product updated successfully",
                        Product: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "product not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        
        // Update a service using POST
        router.post('/updateservice/:serviceId', async (req, res) => {
            try {
                const serviceId = req.params.serviceId; // Fix here
                const updatedService = req.body;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
            
                const result = await Service.findByIdAndUpdate(serviceId, updatedService, { new: true });
            
                if (result) {
                    res.json({
                        Success: true,
                        message: "Service updated successfully",
                        Service: result
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "Service not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // router.get('/delrestaurants/:restaurantId', async (req, res) => {
        //     try {
        //         const restaurantId = req.params.restaurantId;
        
        //         // Find the Restaurant by ID
        //         const restaurant = await Restaurant.findById(restaurantId);
        //         if (!restaurant) {
        //             return res.status(404).json({
        //                 Success: false,
        //                 message: "Restaurant not found"
        //             });
        //         }
        
        //         // Find category associated with the store
        //         const category = await Category.find({ restaurantId: restaurantId });
        
        //         // Delete associated category
        //         if (category.length > 0) {
        //             category.forEach(async ctgry => {
        //             await Category.findByIdAndDelete({ _id: ctgry._id });
        //             })
        //         }
        
        //         // Delete the Restaurant
        //         const result = await Restaurant.findByIdAndDelete(restaurantId);
        
        //         if (result) {
        //             return res.json({
        //                 Success: true,
        //                 message: "Restaurant and associated category deleted successfully"
        //             });
        //         } else {
        //             return res.status(404).json({
        //                 Success: false,
        //                 message: "Failed to delete Restaurant"
        //             });
        //         }
        //     } catch (error) {
        //         console.error("Error deleting Restaurant:", error);
        //         return res.status(500).json({
        //             Success: false,
        //             message: "Failed to delete Restaurant"
        //         });
        //     }
        // });

        router.get('/delrestaurants/:restaurantId', async (req, res) => {
            try {
                const restaurantId = req.params.restaurantId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                // Find the Restaurant by ID
                const restaurant = await Restaurant.findById(restaurantId);
                if (!restaurant) {
                    return res.status(404).json({
                        Success: false,
                        message: "Restaurant not found"
                    });
                }
        
                // Delete categories associated with the restaurant
                const categories = await Category.find({ restaurantId });
        
                for (const category of categories) {
                    // Delete category
                    await Category.findByIdAndDelete(category._id);
        
                    // Delete subcategories associated with the category
                    const subcategories = await Subcategory.find({ category: category._id });
        
                    
                    for (const subcategory of subcategories) {
                        // Delete subcategory
                        await Subcategory.findByIdAndDelete(subcategory._id);

                        // Delete items associated with the subcategory
                        const items = await Items.find({ subcategoryId: subcategory._id });

                        for (const item of items) {
                            // Delete item
                            await Items.findByIdAndDelete(item._id);
                        }
                    }
                }
        
                // Finally, delete the Restaurant
                const result = await Restaurant.findByIdAndDelete(restaurantId);
        
                if (result) {
                    return res.json({
                        Success: true,
                        message: "Restaurant and associated data deleted successfully"
                    });
                } else {
                    return res.status(404).json({
                        Success: false,
                        message: "Failed to delete Restaurant"
                    });
                }
            }catch (error) {
                console.error("Error deleting Restaurant:", error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

//         router.get('/delrestaurants/:restaurantId', async (req, res) => {
//     try {
//         const restaurantId = req.params.restaurantId;

//         // Find the Restaurant by ID
//         const restaurant = await Restaurant.findById(restaurantId);
//         if (!restaurant) {
//             return res.status(404).json({
//                 Success: false,
//                 message: "Restaurant not found"
//             });
//         }

//         // Find categories associated with the restaurant
//         const categories = await Category.find({ restaurantId: restaurantId });

//         // Delete associated subcategories and categories
//         if (categories.length > 0) {
//             for (const category of categories) {
//                 const subcategories = await Subcategory.find({ category: category._id });
//                 if (subcategories.length > 0) {
//                     // Delete subcategories
//                     await Subcategory.findByIdAndDelete({ category: category._id });
//                 }
//                 // Delete category
//                 await Category.findByIdAndDelete(category._id);
//             }
//         }

//         // Delete the Restaurant
//         const result = await Restaurant.findByIdAndDelete(restaurantId);

//         if (result) {
//             return res.json({
//                 Success: true,
//                 message: "Restaurant, categories, and associated subcategories deleted successfully"
//             });
//         } else {
//             return res.status(404).json({
//                 Success: false,
//                 message: "Failed to delete Restaurant"
//             });
//         }
//     } catch (error) {
//         console.error("Error deleting Restaurant:", error);
//         return res.status(500).json({
//             Success: false,
//             message: "Failed to delete Restaurant"
//         });
//     }
// });

        router.get('/delbusinessdata/:businessId', async (req, res) => {
            try {
                const businessId = req.params.businessId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                // Find the store by ID
                const business = await Business.findById(businessId);
                if (!business) {
                    return res.status(404).json({
                        Success: false,
                        message: "business not found"
                    });
                }
        
                // Find services associated with the business
                const services = await Service.find({ businessId: businessId });
        
                // Delete associated services
                if (services.length > 0) {
                    services.forEach(async srvc => {
                    await Service.findByIdAndDelete({ _id: srvc._id });
                    })
                }
        
                // Delete the store
                const result = await Business.findByIdAndDelete(businessId);
        
                if (result) {
                    return res.json({
                        Success: true,
                        message: "Business and associated services deleted successfully"
                    });
                } else {
                    return res.status(404).json({
                        Success: false,
                        message: "Failed to delete Business"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // delete product

        router.get('/delproduct/:productId', async (req, res) => {
            try {
                const productId = req.params.productId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                const result = await Product.findByIdAndDelete(productId);
        
                if (result) {
                    res.json({
                        Success: true,
                        message: "product deleted successfully"
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "product not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });


        // delete store

        router.get('/delstore/:storeId', async (req, res) => {
            try {
                const storeId = req.params.storeId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                // Find the store by ID
                const store = await Store.findById(storeId);
                if (!store) {
                    return res.status(404).json({
                        Success: false,
                        message: "Store not found"
                    });
                }
        
                // Find products associated with the store
                const products = await Product.find({ storeId: storeId });
        
                // Delete associated products
                if (products.length > 0) {
                    products.forEach(async prd => {
                    await Product.findByIdAndDelete({ _id: prd._id });
                    })
                }
        
                // Delete the store
                const result = await Store.findByIdAndDelete(storeId);
        
                if (result) {
                    return res.json({
                        Success: true,
                        message: "Store and associated products deleted successfully"
                    });
                } else {
                    return res.status(404).json({
                        Success: false,
                        message: "Failed to delete store"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        

        // delete service

        router.get('/delservice/:serviceId', async (req, res) => {
            try {
                const serviceId = req.params.serviceId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                const result = await Service.findByIdAndDelete(serviceId);
        
                if (result) {
                    res.json({
                        Success: true,
                        message: "Service deleted successfully"
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "Service not found"
                    });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Fetch single category
router.get('/getcategories/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const categories = await Category.findById(categoryId);
        res.json(categories);
    } catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Fetch categories for a restaurant
router.get('/getrestaurantcategories/:restaurantId', async (req, res) => {
try {
const restaurantId = req.params.restaurantId;
let authtoken = req.headers.authorization;

// Verify JWT token
const decodedToken = jwt.verify(authtoken, jwrsecret);
console.log(decodedToken);
const categories = await Category.find({restaurantId: restaurantId});
res.json(categories);
} catch (error) {
    console.error(error);
    // Handle token verification errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    // Handle other errors
    res.status(500).json({ message: 'Internal server error' });
}
});

// Add a new category
router.post('/categories', async (req, res) => {
    try {
        const newCategory = req.body;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const category = new Category(newCategory);
        await category.save();
        res.json({ success: true, message: 'Category added successfully' });
    }catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Edit a category
router.put('/categories/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const updatedCategory = req.body; // You should validate and sanitize this data
        const result = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true });
        if (result) {
            res.json({ success: true, message: 'Category updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a category
router.delete('/categories/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const result = await Category.findByIdAndDelete(categoryId);
        if (result) {
            res.json({ success: true, message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

        // Fetch single subcategory
        router.get('/getsinglesubcategory/:subcategoryId', async (req, res) => {
            try {
                const subcategoryId = req.params.subcategoryId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
                const subcategories = await Subcategory.findById(subcategoryId);
                res.json(subcategories); 
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Fetch subcategories for a category
        router.get('/getsubcategories/:categoryId', async (req, res) => {
        try {
        const categoryId = req.params.categoryId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const subcategories = await Subcategory.find({category: categoryId});
        res.json(subcategories);
        }catch (error) {
            console.error(error);
            // Handle token verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    });
        // Fetch items for a subcategory
router.get('/getitems/:subcategoryId', async (req, res) => {
        try {
        const subcategoryId = req.params.subcategoryId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const items = await Items.find({subcategoryId: subcategoryId});
        res.json(items);
        }  catch (error) {
            console.error(error);
            // Handle token verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
});
router.get('/getitemsformenu/:subcategoryId', async (req, res) => {
        try {
        const subcategoryId = req.params.subcategoryId;
        const items = await Items.find({subcategoryId: subcategoryId});
        res.json(items);
        }  catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
});

        // Add a new subcategory
router.post('/subcategories', async (req, res) => {
    try {
        const newSubCategory = req.body;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const Subcategoryd = new Subcategory(newSubCategory);
        await Subcategoryd.save();
        res.json({ success: true, message: 'Subcategory added successfully' });
    }catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a subcategory
router.delete('/subcategories/:subcategoryId', async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const result = await Subcategory.findByIdAndDelete(subcategoryId);
        if (result) {
            res.json({ success: true, message: 'Subcategory deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Subcategory not found' });
        }
    }catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Edit a subcategory
router.put('/subcategoriesupdate/:subcategoryId', async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;
        const updatedsubCategory = req.body;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const result = await Subcategory.findByIdAndUpdate(subcategoryId, updatedsubCategory, { new: true });
        if (result) {
            res.json({ success: true, message: 'subCategory updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'subCategory not found' });
        }
    }catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

        // get all item
        // router.get('/itemsall', async (req, res) => {
        //     try {
        //         const result = await Items.find();
        //         if (result) {
        //             res.json({ success: true, items: result, message: 'Items get successfully' });
        //         } else {
        //             res.status(404).json({ success: false, message: 'Items not found' });
        //         }
        //     } catch (error) {
        //         console.error('Error adding item:', error);
        //         res.status(500).json({ success: false, message: 'Failed to add item' });
        //     }
        // });

        router.get('/fetchrestaurants', async (req, res) => {
            try {
                const userid = req.query.userid; // Get the userid from the query parameters
                const allrestaurants = await Restaurant.find({ userid });
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
        
                if (allrestaurants.length > 0) {
                    res.json({ success: true, restaurants: allrestaurants, message: 'restaurants fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'restaurants for this user not found' });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        router.get('/fetchstores', async (req, res) => {
            try {
                const userid = req.query.userid; // Get the userid from the query parameters
                const allstores = await Store.find({ userid });
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                if (allstores.length > 0) {
                    res.json({ success: true, stores: allstores, message: 'stores fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'stores for this user not found' });
                }
            }  catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Failed to fetch items' });
            }
        });

        router.get('/fetchbusiness', async (req, res) => {
            try {
                const userid = req.query.userid; 
                let authtoken = req.headers.authorization;
    
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
                const allbusiness = await Business.find({ userid }); 
        
                if (allbusiness.length > 0) {
                    res.json({ success: true, business: allbusiness, message: 'business fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'business for this user not found' });
                }
            }  catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Failed to fetch items' });
            }
        });

        router.get('/itemsbyrestaurant', async (req, res) => {
            try {
                const restaurantId = req.query.restaurantId; // Get the restaurantId from the query parameters
                const items = await Items.find({ restaurantId:restaurantId });
                let authtoken = req.headers.authorization;
    
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
    
        
                if (items.length > 0) {
                    res.json({ success: true, items:items });
                } else {
                    res.status(404).json({ success: false, message: 'Items for this restaurant not found' });
                }
            }  catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Failed to fetch items' });
            }
        });

        router.get('/productsbystore', async (req, res) => {
            try {
                const storeId = req.query.storeId; // Get the storeId from the query parameters
                const products = await Product.find({ storeId:storeId });
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                if (products.length > 0) {
                    res.json({ success: true, products:products });
                } else {
                    res.status(404).json({ success: false, message: 'products for this store not found' });
                }
            }  catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Failed to fetch items' });
            }
        });

        router.get('/servicesbybusiness', async (req, res) => {
            try {
                const businessId = req.query.businessId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
                const services = await Service.find({ businessId:businessId });
        
                if (services.length > 0) {
                    res.json({ success: true, services:services });
                } else {
                    res.status(404).json({ success: false, message: 'services for this store not found' });
                }
            }  catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Failed to fetch items' });
            }
        });
        
          
        router.get('/itemsall', async (req, res) => {
            try {
                const userid = req.query.userid; // Get the userid from the query parameters
                const allItems = await Items.find({ userid }); // Filter items based on the userid
        
                if (allItems.length > 0) {
                    res.json({ success: true, items: allItems, message: 'Items fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Items for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching items:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch items' });
            }
        });

        router.get('/productsall', async (req, res) => {
            try {
                const userid = req.query.userid; // Get the userid from the query parameters
                const allProducts = await Product.find({ userid }); // Filter items based on the userid
        
                if (allProducts.length > 0) {
                    res.json({ success: true, products: allProducts, message: 'Products fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Products for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching Products:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch Products' });
            }
        });

        router.get('/servicesall', async (req, res) => {
            try {
                const userid = req.query.userid; // Get the userid from the query parameters
                const allServices = await Service.find({ userid }); // Filter items based on the userid
        
                if (allServices.length > 0) {
                    res.json({ success: true, services: allServices, message: 'Services fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Services for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching Services:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch Services' });
            }
        });

        // add offers
        router.post('/offers', async (req, res) => {
            try {
                const formData = req.body;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
                const newOffer = new Offers(formData);
                await newOffer.save();
                res.json({ success: true, message: 'Offer added successfully' });
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        router.post('/WeeklyOffers', async (req, res) => {
            try {
        
                const formData = req.body;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
                const newWeeklyOffer = new WeeklyOffers(formData);
                console.log(newWeeklyOffer)
                await newWeeklyOffer.save();
                res.json({ data:newWeeklyOffer, success: true, message: 'WeeklyOffer added successfully' });
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        //  get all Offers 
        router.get('/offerall', async (req, res) => {
            try {
                const userid = req.query.userid; // Get the userid from the query parameters
                const allOffers = await Offers.find({ userid });
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                if (allOffers.length > 0) {
                    res.json({ success: true, offers: allOffers, message: 'Offers fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Offers for this user not found' });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        router.get('/offerbtrestaurantid', async (req, res) => {
            try {
                const restaurantId = req.query.restaurantId; // Get the userid from the query parameters
                const allOffers = await Offers.find({ restaurantId });
        
                if (allOffers.length > 0) {
                    res.json({ success: true, offers: allOffers, message: 'Offers fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Offers for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching Offers:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch Offers' });
            }
        });

        router.get('/offerbystoreid', async (req, res) => {
            try {
                const storeId = req.query.storeId; // Get the userid from the query parameters
                const allOffers = await Offers.find({ storeId });
        
                if (allOffers.length > 0) {
                    res.json({ success: true, offers: allOffers, message: 'Offers fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Offers for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching Offers:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch Offers' });
            }
        });

        router.get('/offerbybusinessid', async (req, res) => {
            try {
                const businessId = req.query.businessId; // Get the userid from the query parameters
                const allOffers = await Offers.find({ businessId });
        
                if (allOffers.length > 0) {
                    res.json({ success: true, offers: allOffers, message: 'Offers fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Offers for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching Offers:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch Offers' });
            }
        });

        //  get all Weekly Offers 
        router.get('/weeklyofferall', async (req, res) => {
            try {
                const userid = req.query.userid; // Get the userid from the query parameters
                const allWeeklyOffers = await WeeklyOffers.find({ userid });
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
        
                if (allWeeklyOffers.length > 0) {
                    res.json({ success: true, weeklyoffers: allWeeklyOffers, message: 'WeeklyOffers fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'WeeklyOffers for this user not found' });
                }
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        router.get('/weeklyofferbyrestaurant', async (req, res) => {
            try {
                const restaurantId = req.query.restaurantId; // Get the userid from the query parameters
                const allWeeklyOffers = await WeeklyOffers.find({ restaurantId });
        
                if (allWeeklyOffers.length > 0) {
                    res.json({ success: true, weeklyoffers: allWeeklyOffers, message: 'WeeklyOffers fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'WeeklyOffers for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching WeeklyOffers:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch WeeklyOffers' });
            }
        });

        router.get('/weeklyofferbystore', async (req, res) => {
            try {
                const storeId = req.query.storeId;
                const allWeeklyOffers = await WeeklyOffers.find({ storeId });
        
                if (allWeeklyOffers.length > 0) {
                    res.json({ success: true, weeklyoffers: allWeeklyOffers, message: 'WeeklyOffers fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'WeeklyOffers for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching WeeklyOffers:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch WeeklyOffers' });
            }
        });

        router.get('/weeklyofferbybusiness', async (req, res) => {
            try {
                const businessId = req.query.businessId;
                const allWeeklyOffers = await WeeklyOffers.find({ businessId });
        
                if (allWeeklyOffers.length > 0) {
                    res.json({ success: true, weeklyoffers: allWeeklyOffers, message: 'WeeklyOffers fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'WeeklyOffers for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching WeeklyOffers:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch WeeklyOffers' });
            }
        });

        router.put('/updateSwitchState/:offerId', async (req, res) => {
            try {
              const { offerId } = req.params;
              const { switchState } = req.body;
              let authtoken = req.headers.authorization;
      
              // Verify JWT token
              const decodedToken = jwt.verify(authtoken, jwrsecret);
              console.log(decodedToken);
      
          
              // Find the offer by ID and update the switch state
              const updatedOffer = await Offers.findByIdAndUpdate(
                offerId,
                { switchState },
                { new: true } // To return the updated offer
              );
          
              res.json({ success: true, offer: updatedOffer });
            }  catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        router.put('/updateSwitchStateweekly/:offerId', async (req, res) => {
            try {
              const { offerId } = req.params;
              const { switchState } = req.body;
              let authtoken = req.headers.authorization;
      
              // Verify JWT token
              const decodedToken = jwt.verify(authtoken, jwrsecret);
              console.log(decodedToken);
          
              // Find the offer by ID and update the switch state
              const updatedOffer = await WeeklyOffers.findByIdAndUpdate(
                offerId,
                { switchState },
                { new: true } // To return the updated offer
              );
          
              res.json({ success: true, offer: updatedOffer });
            }catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        //  router.get('/offeritemsall', async (req, res) => {
        //     try {
        //         const result = await Offers.find();
        //         if (result) {
        //             res.json({ success: true, offers: result, message: 'Offers Items get successfully' });
        //         } else {
        //             res.status(404).json({ success: false, message: 'Offers Items not found' });
        //         }
        //     } catch (error) {
        //         console.error('Error adding Offers Items:', error);
        //         res.status(500).json({ success: false, message: 'Failed to add Offers Items' });
        //     }
        // });

        // router.get('/weeklyofferitemsall', async (req, res) => {
        //     try {
        //       // Fetch all offers from the database
        //       const offers = await WeeklyOffers.find();
          
        //       // Send the offers as a JSON response to the frontend
        //       res.json({ success: true, offers });
        //     } catch (error) {
        //       console.error('Error fetching offers:', error);
        //       // Send an error response to the frontend
        //       res.status(500).json({ success: false, message: 'Failed to fetch offers' });
        //     }
        //   });

        // Add a new item
        router.post('/items', async (req, res) => {
            try {
                const newItem = req.body;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
                const addedItem = new Items(newItem);
                await addedItem.save();
                res.json({ success: true, message: 'Item added successfully' });
            } catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Fetch items for a restaurant
router.get('/getrestaurantitems/:restaurantId', async (req, res) => {
    try {
    const restaurantId = req.params.restaurantId;
    let authtoken = req.headers.authorization;

    // Verify JWT token
    const decodedToken = jwt.verify(authtoken, jwrsecret);
    console.log(decodedToken);
    const items1 = await Items.find({restaurantId: restaurantId});
    res.json(items1);
    } catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/getrestaurantuniquename/:restaurantid', async (req, res) => {
    try {
    const restaurantid = req.params.restaurantid;
    const restaurant1 = await Restaurant.findById(restaurantid);         
    res.json(restaurant1.uniquename);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/getbusinessuniquename/:businessId', async (req, res) => {
    try {
    const businessId = req.params.businessId;
    const business1 = await Business.findById(businessId);         
    res.json(business1.uniquename);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/getstoreuniquename/:storeId', async (req, res) => {
    try {
    const storeId = req.params.storeId;
    const store1 = await Store.findById(storeId);         
    res.json(store1.uniquename);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/getrestaurantitemsformenu/:uniquename', async (req, res) => {
    try {
    const uniquename = (req.params.uniquename).toLowerCase();
    const restaurant1 = await Restaurant.find({uniquename: uniquename});
        console.error(restaurant1);
        if(restaurant1.length > 0){            
    const items1 = await Items.find({restaurantId: restaurant1[0]._id, isAvailable: true});
    res.json(items1);
        }else{
            res.json([]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

    // Delete a item
router.delete('/delitems/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        const results = await Items.findByIdAndDelete(itemId);
        if (results) {
            res.json({ success: true, message: 'Items deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Items not found' });
        }
    }catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});


        // Fetch single subcategory
        router.get('/getsingleitem/:itemId', async (req, res) => {
            try {
                const itemId = req.params.itemId;
                let authtoken = req.headers.authorization;
        
                // Verify JWT token
                const decodedToken = jwt.verify(authtoken, jwrsecret);
                console.log(decodedToken);
                const item = await Items.findById(itemId);
                res.json(item);
            }catch (error) {
                console.error(error);
                // Handle token verification errors
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
                // Handle other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Edit a Items
router.put('/itemsupdate/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const updateditem = req.body;
        let authtoken = req.headers.authorization;

        // Verify JWT token
        const decodedToken = jwt.verify(authtoken, jwrsecret);
        console.log(decodedToken);
        // Check if an image URL is provided in the request body
        if (updateditem.imageUrl) {
            // Upload the new image to Cloudinary
            const cloudinaryResponse = await cloudinary.uploader.upload(updateditem.imageUrl, {
                upload_preset: 'restrocloudnary', // Your Cloudinary upload preset
                folder: 'item_images', // Folder where images will be stored in Cloudinary
            });

            // Update the image URL in the updatedItem object with the Cloudinary URL
            updateditem.imageUrl = cloudinaryResponse.secure_url;
        }
        const result1 = await Items.findByIdAndUpdate(itemId, updateditem, { new: true });
        if (result1) {
            res.json({ success: true, message: 'Items updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Items not found' });
        }
    } catch (error) {
        console.error(error);
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/menu', async (req, res) => {
    try {
        const { itemId, sectionName,restaurantId } = req.body;

        const newMenu = new Menu({
            items: itemId,
            name: sectionName,
            restaurantId: restaurantId
        });

        await newMenu.save();
        res.json({ Success: true, message: 'Menu created successfully' });
    } catch (error) {
        console.error("Error creating Menu:", error);
        res.status(500).json({ Success: false, message: 'Failed to create Menu', error: error.message });
    }
});



router.get('/menu/:restaurantId', async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const menuItems = await Menu.find({ restaurantId });
        res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getmenu/:menuItemId', async (req, res) => {
    try {
        const menuItemId = req.params.menuItemId;
        const result = await Menu.findById(menuItemId);

        if (result) {
            res.json({
                Success: true,
                message: "Menu retrieved successfully",
                menu: result
            });
        } else {
            res.status(404).json({
                Success: false,
                message: "Menu not found"
            });
        }
    } catch (error) {
        console.error("Error fetching Menu:", error);
        res.status(500).json({
            Success: false,
            message: "Failed to fetch Menu"
        });
    }
});


router.post('/menu/:menuItemId', async (req, res) => {
    try {
      const menuItemId = req.params.menuItemId;
      const updatedmenu = req.body;
  
      const result = await Menu.findByIdAndUpdate(menuItemId, updatedmenu, { new: true });
  
      if (result) {
        res.json({
          Success: true,
          message: "Menu updated successfully",
          menu: result
        });
      } else {
        res.status(404).json({
          Success: false,
          message: "Menu not found"
        });
      }
    } catch (error) {
      console.error("Error updating Menu:", error);
      res.status(500).json({
        Success: false,
        message: "Failed to update Menu"
      });
    }
  });

router.delete('/menu/:id', async (req, res) => {
    try {
        const deletedMenu = await Menu.findByIdAndDelete(req.params.id);

        if (deletedMenu) {
            res.json({ Success: true, message: 'Menu deleted successfully' });
        } else {
            res.json({ Success: false, message: 'Menu not found' });
        }
    } catch (error) {
        res.json({ Success: false, message: 'Failed to delete Menu' });
    }
});

router.get('/menu/:restaurantId', async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const menuItems = await Menu.find({ restaurantId: restaurantId });
        res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/foodData',(req,res)=>{
    try{
        res.send([global.food_items,global.foodCategory])
    }
    catch(error){
        console.error(error.message);
        res.send("Server Error")
    }
})


  // API endpoint to save user preferences
  router.post('/saveColorPreferences', async (req, res) => {
    try {
      const { userid,restaurantId, userPreference } = req.body;
  
      // Create a new user preference document
      const newPreference = new UserPreference({
        userId: userid,
        restaurantId: restaurantId,
        backgroundColor: userPreference.backgroundColor,
        textColor: userPreference.textColor,
        headingTextColor: userPreference.headingTextColor,
        categoryColor: userPreference.categoryColor,
        font: userPreference.font,
        fontlink: userPreference.fontlink,
        backgroundImage: userPreference.backgroundImage,
        // Add other preferences here
      });
  
      // Save the user preference to the database
      const savedPreference = await newPreference.save();
  
      res.json(savedPreference);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      res.status(500).json({ error: 'Failed to save user preferences' });
    }
  });


  // In your backend API (e.g., Express.js)
router.get('/getUserPreferences/:restaurantId', async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      // Retrieve user preferences from the database based on the user ID
      const userPreferences = await UserPreference.find({ restaurantId: restaurantId });
      res.json(userPreferences);
    } catch (error) {
      console.error('Error retrieving user preferences:', error);
      res.status(500).json({ error: 'Failed to retrieve user preferences' });
    }
  });
  

module.exports = router;