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
const UserPreference = require('../models/UserPreference');
// const WeeklyOffers require
// const ViewMenu = require('../models/')



const Tesseract = require('tesseract.js');
const multer = require('multer');
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
    const { name, email, password, location, signupMethod } = req.body;

    // Validate input based on the signup method (e.g., for email signup)
    if (signupMethod === "email") {
        // Perform email signup validation here
        // Example: Check if email is valid and password meets the criteria
        if (!isValidEmail(email) || !isValidPassword(password)) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
    } 
        else if (signupMethod === "google") {
        // Handle Google signup
        // You can add custom validation for Google signup here
        let userdata = await User.findOne({ email });
        if (!userdata) {
            try {
                User.create({
                    name,
                    password: secPassword,
                    email,
                    location,
                    signupMethod,
                });
                let userdata = await User.findOne({ email });
                const data = {
                    user:{
                        id:userdata.id
                    }
                }
                const authToken = jwt.sign(data, jwrsecret)
                return res.json({ Success: true,authToken:authToken,userid: userdata.id})
        
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
        return res.json({ Success: true,authToken:authToken,userid: userdata.id})
    }
    }
    } else if (signupMethod === "facebook") {
        
        // Handle Google signup
        // You can add custom validation for Google signup here
        let userdata = await User.findOne({ email });
        if (!userdata) {
            try {
                User.create({
                    name,
                    password: secPassword,
                    email,
                    location,
                    signupMethod,
                });
                let userdata = await User.findOne({ email });
                const data = {
                    user:{
                        id:userdata.id
                    }
                }
                const authToken = jwt.sign(data, jwrsecret)
                return res.json({ Success: true,authToken:authToken,userid: userdata.id})
        
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
        return res.json({ Success: true,authToken:authToken,userid: userdata.id})
    }
    }
}

    // Continue with user creation based on the signup method
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(password, salt);

    try {
        User.create({
            name,
            password: secPassword,
            email,
            location,
            signupMethod,
        });

        res.json({
            Success: true,
            message: "Congratulations! Your account successfully created!",
        });
    } catch (error) {
        console.log(error);
        res.json({ Success: false });
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
        res.json({ Success: true,authToken:authToken,userid: userdata.id})
    }
    catch (error) {
        console.log(error);
        res.json({ Success: false })
    }
});

router.post("/addrestaurant",
    [
        body('email').isEmail(),
        body('name').isLength({ min: 5 }),
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

        router.delete('/restaurants/:restaurantId', async (req, res) => {
            try {
                const restaurantId = req.params.restaurantId;
        
                const result = await Restaurant.findByIdAndDelete(restaurantId);
        
                if (result) {
                    res.json({
                        Success: true,
                        message: "Restaurant deleted successfully"
                    });
                } else {
                    res.status(404).json({
                        Success: false,
                        message: "Restaurant not found"
                    });
                }
            } catch (error) {
                console.error("Error deleting restaurant:", error);
                res.status(500).json({
                    Success: false,
                    message: "Failed to delete restaurant"
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
        router.get('/itemsall', async (req, res) => {
            try {
                const result = await Items.find();
                if (result) {
                    res.json({ success: true, items: result, message: 'Items get successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Items not found' });
                }
            } catch (error) {
                console.error('Error adding item:', error);
                res.status(500).json({ success: false, message: 'Failed to add item' });
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
                // const { searchResults, startTime, endTime, selectedDays } = req.body;
        
                const newWeeklyOffer = new WeeklyOffers(req.body);
        
                await newWeeklyOffer.save();
                res.json({ success: true, message: 'WeeklyOffer added successfully' });
            } catch (error) {
                console.error('Error adding WeeklyOffer:', error);
                res.status(500).json({ success: false, message: 'Failed to add WeeklyOffer' });
            }
        });

        //  get all Offers Items
         router.get('/offeritemsall', async (req, res) => {
            try {
                const result = await Offers.find();
                if (result) {
                    res.json({ success: true, offers: result, message: 'Offers Items get successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Offers Items not found' });
                }
            } catch (error) {
                console.error('Error adding Offers Items:', error);
                res.status(500).json({ success: false, message: 'Failed to add Offers Items' });
            }
        });

        router.get('/weeklyofferitemsall', async (req, res) => {
            try {
              // Fetch all offers from the database
              const offers = await WeeklyOffers.find();
          
              // Send the offers as a JSON response to the frontend
              res.json({ success: true, offers });
            } catch (error) {
              console.error('Error fetching offers:', error);
              // Send an error response to the frontend
              res.status(500).json({ success: false, message: 'Failed to fetch offers' });
            }
          });

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