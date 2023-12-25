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
const UserPreference = require('../models/UserPreference');
const Storedatapreference = require('../models/Storedatapreference');
const BusinessPreference = require('../models/Businesspreference')
const Business = require('../models/Business');
const mongoose = require('mongoose');
// const Retailer = require('../models/Retailer')
// const WeeklyOffers require
// const ViewMenu = require('../models/')



const Tesseract = require('tesseract.js');
const multer = require('multer');
const Service = require('../models/Service');
const Restaurent = require('../models/Restaurent');
const storage = multer.memoryStorage();
const upload = multer({ storage })

router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
  
    const imageBuffer = req.file.buffer;
  
    try {
      const { data } = await Tesseract.recognize(imageBuffer, 'eng');
      const text = data.text;
      res.json({ text });
    } catch (error) {
      console.error('Text extraction failed:', error);
      res.status(500).json({ error: 'Text extraction failed' });
    }
  });

router.get('/dashboard/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        const restaurantCount = await Restaurant.countDocuments({userid:userid});
        const categoryCount = await Category.countDocuments({userid:userid});
        const itemCount = await Items.countDocuments({userid:userid});

        res.json({ restaurantCount, categoryCount, itemCount });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

router.get('/retailerdashboard/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        const retailerCount = await Store.countDocuments({userid:userid});
        const productCount = await Product.countDocuments({userid:userid});

        res.json({ retailerCount,productCount});
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

router.get('/businessdashboard/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        const businessCount = await Business.countDocuments({userid:userid});
        const servicesCount = await Service.countDocuments({userid:userid});

        res.json({ businessCount,servicesCount});
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
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

router.post("/createuser", async (req, res) => {
    const { name, email, password, location, signupMethod ,signuptype} = req.body;


    // Continue with user creation based on the signup method
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(password, salt);
    // Validate input based on the signup method (e.g., for email signup)
    if (signupMethod === "email") {
        // Perform email signup validation here
        // Example: Check if email is valid and password meets the criteria
        // if (!isValidEmail(email) || !isValidPassword(password)) {
        //     return res.status(400).json({ message: "Invalid email or password." });
        // }
    try {
        User.create({
            name,
            password: secPassword,
            email,
            location,
            signupMethod,
            signuptype
        });

        res.json({
            Success: true,
            message: "Congratulations! Your account successfully created!",
        });
    } catch (error) {
        console.log(error);
        res.json({ Success: false, message: error});
    }
    } 
        else if (signupMethod === "google") {
        // Handle Google signup
        // You can add custom validation for Google signup here
        let userdata = await User.findOne({ email });
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
                // let userdata = await User.findOne({ email });
                const data = {
                    user:{
                        id:userdata.id
                    }
                }
                const authToken = jwt.sign(data, jwrsecret)
                const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
                return res.json({ Success: true,authToken:authToken,userid: userdata.id, requiresignuptype: signuptypedb, signuptype: userdata.signuptype})
        
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

        const authToken = jwt.sign(data, jwrsecret)
        const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
        return res.json({ Success: true,authToken:authToken,userid: userdata.id, requiresignuptype: signuptypedb, signuptype: userdata.signuptype})
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
                // let userdata = await User.findOne({ email });
                const data = {
                    user:{
                        id:userdata.id
                    }
                }
                const authToken = jwt.sign(data, jwrsecret)
                const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
                return res.json({ Success: true,authToken:authToken,userid: userdata.id, requiresignuptype: signuptypedb, signuptype: userdata.signuptype})
        
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

        const authToken = jwt.sign(data, jwrsecret)
        const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
        return res.json({ Success: true,authToken:authToken,userid: userdata.id, requiresignuptype: signuptypedb, signuptype: userdata.signuptype})
    }
    }
}

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
        if (!userdata) {
            return res.status(400).json({ errors: "Login with correct details " });
        }

        const pwdCompare = await bcrypt.compare(req.body.password, userdata.password)
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Login with correct details" });
        }

        if (userdata.signupMethod != signupMethod) {
            return res.status(400).json({ errors: "You can try with social login" });
        }


        const data = {
            user:{
                id:userdata.id
            }
        }

        const authToken = jwt.sign(data, jwrsecret)
        // const signuptypedb = userdata.signuptype == null || userdata.signuptype == "" || userdata.signuptype == undefined;
        res.json({ Success: true,authToken:authToken,userid: userdata.id, signuptype: userdata.signuptype})
    }
    catch (error) {
        console.log(error);
        res.json({ Success: false })
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
        
        // body('address').isLength(),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
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
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Restaurent has been successfully added! "
            })
        }
        catch (error) {
            console.log(error);
            res.json({ Success: false })
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
        
        // body('address').isLength(),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            Store.create({
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
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Store has been successfully added! "
            })
        }
        catch (error) {
            console.log(error);
            res.json({ Success: false })
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
        
        // body('address').isLength(),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            Business.create({
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
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Business has been successfully added! "
            })
        }
        catch (error) {
            console.log(error);
            res.json({ Success: false })
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
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
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
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Product has been successfully added! "
            })
        }
        catch (error) {
            console.log(error);
            res.json({ Success: false })
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
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            Service.create({
                userid: req.body.userid,
                businessId: req.body.businessId,
                name: req.body.name,
                price: req.body.price,
                time: req.body.time,
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Service has been successfully added! "
            })
        }
        catch (error) {
            console.log(error);
            res.json({ Success: false })
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
            const restaurants = (await Restaurant.find({ userid: userid}));
            res.json(restaurants);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/store/:userid', async (req, res) => {
        try {
            let userid = req.params.userid;
            const store = (await Store.find({ userid: userid}));
            res.json(store);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/business/:userid', async (req, res) => {
        try {
            let userid = req.params.userid;
            const business = (await Business.find({ userid: userid}));
            res.json(business);
        } catch (error) {
            console.error(error);
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
        console.log('Received request to duplicate business:', businessId, userid);

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
        console.error('Error duplicating business:', error);
        res.status(500).json({ success: false, message: 'Error duplicating business' });
    }
});

router.get('/duplicateStore/:storeId/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        let storeId = req.params.storeId;
        console.log('Received request to duplicate store:', storeId, userid);

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
    } catch (error) {
        console.error('Error duplicating store:', error);
        res.status(500).json({ success: false, message: 'Error duplicating store' });
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
        console.log('Received request to duplicate Restaurent:', restaurantId, userid);

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
                _id: newitemsId, // Generate new ID for the duplicated subcategory
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
        res.status(500).json({ success: false, message: 'Error duplicating restaurant' });
    }
});

    router.get('/products/:storeId', async (req, res) => {
        try {
            let storeId = req.params.storeId;
            const products = (await Product.find({ storeId: storeId}));
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/services/:businessId', async (req, res) => {
        try {
            let businessId = req.params.businessId;
            const services = (await Service.find({ businessId: businessId}));
            res.json(services);
        } catch (error) {
            console.error(error);
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
                console.error("Error retrieving restaurant:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to retrieve restaurant"
                });
            }
        });

        router.get('/getstores/:storeId', async (req, res) => {
            try {
                const storeId = req.params.storeId;
                console.log(storeId);
        
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
                console.error("Error retrieving store:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to retrieve store"
                });
            }
        });

        router.get('/getbusinessdata/:businessId', async (req, res) => {
            try {
                const businessId = req.params.businessId;
                console.log(businessId);
        
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
            } catch (error) {
                console.error("Error retrieving Business:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to retrieve Business"
                });
            }
        });

        router.get('/getproducts/:productId', async (req, res) => {
            try {
                const productId = req.params.productId;
                console.log(productId);
        
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
                console.error("Error retrieving product:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to retrieve product"
                });
            }
        });

        router.get('/getservices/:serviceId', async (req, res) => {
            try {
                const serviceId = req.params.serviceId;
                console.log(serviceId);
        
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
                console.error("Error retrieving Service:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to retrieve Service"
                });
            }
        });


        // Update a restaurant using POST
        router.post('/restaurants/:restaurantId', async (req, res) => {
            try {
                const restaurantId = req.params.restaurantId; // Fix here
                const updatedrestaurant = req.body;
            
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
                console.error("Error updating restaurant:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to update restaurant"
                });
            }
        });

        // Update a store using POST
        router.post('/updatestore/:storeId', async (req, res) => {
            try {
                const storeId = req.params.storeId; // Fix here
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
            } catch (error) {
                console.error("Error updating store:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to update store"
                });
            }
        });

        // Update a businessdata using POST
        router.post('/updatebusinessdata/:businessId', async (req, res) => {
            try {
                const businessId = req.params.businessId; // Fix here
                const updatedbusinessdata = req.body;
            
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
                console.error("Error updating Business:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to update Business"
                });
            }
        });

        // Update a product using POST
        router.post('/updateproduct/:productId', async (req, res) => {
            try {
                const productId = req.params.productId; // Fix here
                const updatedProduct = req.body;
            
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
                console.error("Error updating product:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to update product"
                });
            }
        });
        
        // Update a service using POST
        router.post('/updateservice/:serviceId', async (req, res) => {
            try {
                const serviceId = req.params.serviceId; // Fix here
                const updatedService = req.body;
            
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
                console.error("Error updating Service:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to update Service"
                });
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
            } catch (error) {
                console.error("Error deleting Restaurant:", error);
                return res.status(500).json({
                    Success: false,
                    message: "Failed to delete Restaurant"
                });
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
                console.error("Error deleting Business:", error);
                return res.status(500).json({
                    Success: false,
                    message: "Failed to delete Business"
                });
            }
        });

        // delete product

        router.get('/delproduct/:productId', async (req, res) => {
            try {
                const productId = req.params.productId;
        
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
                console.error("Error deleting product:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to delete product"
                });
            }
        });


        // delete store

        router.get('/delstore/:storeId', async (req, res) => {
            try {
                const storeId = req.params.storeId;
        
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
                console.error("Error deleting store:", error);
                return res.status(500).json({
                    Success: false,
                    message: "Failed to delete store"
                });
            }
        });
        

        // delete service

        router.get('/delservice/:serviceId', async (req, res) => {
            try {
                const serviceId = req.params.serviceId;
        
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
                console.error("Error deleting Service:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to delete product"
                });
            }
        });

        // Fetch single category
router.get('/getcategories/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categories = await Category.findById(categoryId);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Fetch categories for a restaurant
router.get('/getrestaurantcategories/:restaurantId', async (req, res) => {
try {
const restaurantId = req.params.restaurantId;
const categories = await Category.find({restaurantId: restaurantId});
res.json(categories);
} catch (error) {
console.error('Error fetching categories:', error);
res.status(500).json({ message: 'Internal server error' });
}
});

// Add a new category
router.post('/categories', async (req, res) => {
    try {
        const newCategory = req.body; // You should validate and sanitize this data
        const category = new Category(newCategory);
        await category.save();
        res.json({ success: true, message: 'Category added successfully' });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ success: false, message: 'Failed to add category' });
    }
});

// Edit a category
router.put('/categories/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const updatedCategory = req.body; // You should validate and sanitize this data
        const result = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true });
        if (result) {
            res.json({ success: true, message: 'Category updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: 'Failed to update category' });
    }
});

// Delete a category
router.delete('/categories/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const result = await Category.findByIdAndDelete(categoryId);
        if (result) {
            res.json({ success: true, message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Failed to delete category' });
    }
});

        // Fetch single subcategory
        router.get('/getsinglesubcategory/:subcategoryId', async (req, res) => {
            try {
                const subcategoryId = req.params.subcategoryId;
                const subcategories = await Subcategory.findById(subcategoryId);
                res.json(subcategories); 
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        // Fetch subcategories for a category
        router.get('/getsubcategories/:categoryId', async (req, res) => {
        try {
        const categoryId = req.params.categoryId;
        const subcategories = await Subcategory.find({category: categoryId});
        res.json(subcategories);
        } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Internal server error' });
        }
        });
        // Fetch items for a subcategory
router.get('/getitems/:subcategoryId', async (req, res) => {
        try {
        const subcategoryId = req.params.subcategoryId;
        const items = await Items.find({subcategoryId: subcategoryId});
        res.json(items);
        } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Internal server error' });
        }
        });

        // Add a new subcategory
router.post('/subcategories', async (req, res) => {
    try {
        const newSubCategory = req.body; // You should validate and sanitize this data
        const Subcategoryd = new Subcategory(newSubCategory);
        await Subcategoryd.save();
        res.json({ success: true, message: 'Subcategory added successfully' });
    } catch (error) {
        console.error('Error adding Subcategory:', error);
        res.status(500).json({ success: false, message: 'Failed to add Subcategory' });
    }
});

// Delete a subcategory
router.delete('/subcategories/:subcategoryId', async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;
        const result = await Subcategory.findByIdAndDelete(subcategoryId);
        if (result) {
            res.json({ success: true, message: 'Subcategory deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Subcategory not found' });
        }
    } catch (error) {
        console.error('Error deleting Subcategory:', error);
        res.status(500).json({ success: false, message: 'Failed to delete Subcategory' });
    }
});

// Edit a subcategory
router.put('/subcategoriesupdate/:subcategoryId', async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;
        const updatedsubCategory = req.body; // You should validate and sanitize this data
        const result = await Subcategory.findByIdAndUpdate(subcategoryId, updatedsubCategory, { new: true });
        if (result) {
            res.json({ success: true, message: 'subCategory updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'subCategory not found' });
        }
    } catch (error) {
        console.error('Error updating subCategory:', error);
        res.status(500).json({ success: false, message: 'Failed to update subCategory' });
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
                const allrestaurants = await Restaurant.find({ userid }); // Filter items based on the userid
        
                if (allrestaurants.length > 0) {
                    res.json({ success: true, restaurants: allrestaurants, message: 'restaurants fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'restaurants for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch restaurants' });
            }
        });

        router.get('/fetchstores', async (req, res) => {
            try {
                const userid = req.query.userid; // Get the userid from the query parameters
                const allstores = await Store.find({ userid }); // Filter items based on the userid
        
                if (allstores.length > 0) {
                    res.json({ success: true, stores: allstores, message: 'stores fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'stores for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching stores:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch stores' });
            }
        });

        router.get('/fetchbusiness', async (req, res) => {
            try {
                const userid = req.query.userid; 
                const allbusiness = await Business.find({ userid }); 
        
                if (allbusiness.length > 0) {
                    res.json({ success: true, business: allbusiness, message: 'business fetched successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'business for this user not found' });
                }
            } catch (error) {
                console.error('Error fetching business:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch business' });
            }
        });

        router.get('/itemsbyrestaurant', async (req, res) => {
            try {
                const restaurantId = req.query.restaurantId; // Get the restaurantId from the query parameters
                const items = await Items.find({ restaurantId:restaurantId }); // Filter items based on the restaurantId
        
                if (items.length > 0) {
                    res.json({ success: true, items:items });
                } else {
                    res.status(404).json({ success: false, message: 'Items for this restaurant not found' });
                }
            } catch (error) {
                console.error('Error fetching items by restaurant:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch items' });
            }
        });

        router.get('/productsbystore', async (req, res) => {
            try {
                const storeId = req.query.storeId; // Get the storeId from the query parameters
                const products = await Product.find({ storeId:storeId }); // Filter products based on the restaurantId
        
                if (products.length > 0) {
                    res.json({ success: true, products:products });
                } else {
                    res.status(404).json({ success: false, message: 'products for this store not found' });
                }
            } catch (error) {
                console.error('Error fetching products by store:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch products' });
            }
        });

        router.get('/servicesbybusiness', async (req, res) => {
            try {
                const businessId = req.query.businessId; // Get the businessId from the query parameters
                const services = await Service.find({ businessId:businessId }); // Filter services based on the businessId
        
                if (services.length > 0) {
                    res.json({ success: true, services:services });
                } else {
                    res.status(404).json({ success: false, message: 'services for this store not found' });
                }
            } catch (error) {
                console.error('Error fetching services by store:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch services' });
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
                const newOffer = new Offers(formData);
                await newOffer.save();
                res.json({ success: true, message: 'Offer added successfully' });
            } catch (error) {
                console.error('Error adding offer:', error);
                res.status(500).json({ success: false, message: 'Failed to add offer' });
            }
        });

        router.post('/WeeklyOffers', async (req, res) => {
            try {
        
                const formData = req.body;
                const newWeeklyOffer = new WeeklyOffers(formData);
                console.log(newWeeklyOffer)
                await newWeeklyOffer.save();
                res.json({ data:newWeeklyOffer, success: true, message: 'WeeklyOffer added successfully' });
            } catch (error) {
                console.error('Error adding WeeklyOffer:', error);
                res.status(500).json({ success: false, message: 'Failed to add WeeklyOffer' });
            }
        });

        //  get all Offers 
        router.get('/offerall', async (req, res) => {
            try {
                const userid = req.query.userid; // Get the userid from the query parameters
                const allOffers = await Offers.find({ userid });
        
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
          
              // Find the offer by ID and update the switch state
              const updatedOffer = await Offers.findByIdAndUpdate(
                offerId,
                { switchState },
                { new: true } // To return the updated offer
              );
          
              res.json({ success: true, offer: updatedOffer });
            } catch (error) {
              console.error('Error updating switch state:', error);
              res.status(500).json({ success: false, message: 'Failed to update switch state' });
            }
        });

        router.put('/updateSwitchStateweekly/:offerId', async (req, res) => {
            try {
              const { offerId } = req.params;
              const { switchState } = req.body;
          
              // Find the offer by ID and update the switch state
              const updatedOffer = await WeeklyOffers.findByIdAndUpdate(
                offerId,
                { switchState },
                { new: true } // To return the updated offer
              );
          
              res.json({ success: true, offer: updatedOffer });
            } catch (error) {
              console.error('Error updating switch state:', error);
              res.status(500).json({ success: false, message: 'Failed to update switch state' });
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
                const newItem = req.body; // You should validate and sanitize this data
                const addedItem = new Items(newItem);
                await addedItem.save();
                res.json({ success: true, message: 'Item added successfully' });
            } catch (error) {
                console.error('Error adding item:', error);
                res.status(500).json({ success: false, message: 'Failed to add item' });
            }
        });

        // Fetch items for a restaurant
router.get('/getrestaurantitems/:restaurantId', async (req, res) => {
    try {
    const restaurantId = req.params.restaurantId;
    const items1 = await Items.find({restaurantId: restaurantId});
    res.json(items1);
    } catch (error) {
    console.error('Error fetching Items:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
    });

    // Delete a item
router.delete('/delitems/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const results = await Items.findByIdAndDelete(itemId);
        if (results) {
            res.json({ success: true, message: 'Items deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Items not found' });
        }
    } catch (error) {
        console.error('Error deleting Subcategory:', error);
        res.status(500).json({ success: false, message: 'Failed to delete Subcategory' });
    }
});


        // Fetch single subcategory
        router.get('/getsingleitem/:itemId', async (req, res) => {
            try {
                const itemId = req.params.itemId;
                const item = await Items.findById(itemId);
                res.json(item);
            } catch (error) {
                console.error('Error fetching single item:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Edit a Items
router.put('/itemsupdate/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const updateditem = req.body; // You should validate and sanitize this data
        const result1 = await Items.findByIdAndUpdate(itemId, updateditem, { new: true });
        if (result1) {
            res.json({ success: true, message: 'Items updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Items not found' });
        }
    } catch (error) {
        console.error('Error updating Items:', error);
        res.status(500).json({ success: false, message: 'Failed to update Items' });
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