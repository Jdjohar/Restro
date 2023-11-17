  
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import Login from './screens/Login';

import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import Signup from './screens/Signup';
import { CartProvider } from './components/ContextReducer';
import Cart from './components/Cart';
import Userdashboard from './screens/Restaurantpanel/Userdashboard.js';
import Restaurents from './screens/Restaurantpanel/Restaurents.js';
import Addrestaurent from './screens/Restaurantpanel/Addrestaurent.js';
import Category from './screens/Restaurantpanel/Category.js';
import Addcategory from './screens/Restaurantpanel/Addcategory.js';
import { RestaurantProvider } from './components/RestaurantContext';
import EditCategory from './screens/Restaurantpanel/EditCategory.js';
import Items from './screens/Restaurantpanel/Items.js';
import Additems from './screens/Restaurantpanel/Additems.js';
import Subcategory from './screens/Restaurantpanel/Subcategory.js';
import Addsubcategories from './screens/Restaurantpanel/Addsubcategories.js';
import EditSubcategory from './screens/Restaurantpanel/EditSubcategory.js';
import EditItem from './screens/Restaurantpanel/EditItem.js';
import EditRestaurant from './screens/Restaurantpanel/EditRestaurants.js';
import Menu from './screens/Restaurantpanel/Menu.js';
import AddMenuItem from './screens/Restaurantpanel/AddMenuItem.js';
import EditMenuItem from './screens/Restaurantpanel/EditMenuItem.js';
import Viewmenu from './screens/Restaurantpanel/Viewmenu.js';
import ItemDetail from './screens/Restaurantpanel/ItemDetail.js';
import Offers from './screens/Restaurantpanel/Offers.js';
import Offeritems from './screens/Restaurantpanel/Offeritems.js';
import WeeklyOffers from './screens/Restaurantpanel/WeeklyOffers.js';
import WeeklyOfferitems from './screens/Restaurantpanel/WeeklyOfferitems.js';
import ForgotPassword from './screens/Forgotpassword';
import Retailerdashboard from './screens/Retailerpanel/Retailerdashboard.js';
import Products from './screens/Retailerpanel/Products.js';
import Addproduct from './screens/Retailerpanel/Addproduct.js';
import Editproduct from './screens/Retailerpanel/Editproduct.js';
import Store from './screens/Retailerpanel/Store.js';
import Addstore from './screens/Retailerpanel/Addstore.js';
import Editstore from './screens/Retailerpanel/Editstore.js';
import Businessdashboard from './screens/Businesspanel/Businessdashboard.js';
import Business from './screens/Businesspanel/Business.js';
import Addbusiness from './screens/Businesspanel/Addbusiness.js';
import Editbusiness from './screens/Businesspanel/Editbusiness.js';
import Storedetail from './screens/Retailerpanel/Storedetail.js';
import Servicepage from './screens/Businesspanel/Servicepage.js';
import Addservice from './screens/Businesspanel/Addservice.js';
import Editservice from './screens/Businesspanel/Editservice.js';
import Businessdetail from './screens/Businesspanel/Businessdetail.js';

function App() {
  return (
    <RestaurantProvider>

    <Router>
      <div>
        <Routes>
            <Route exact path='/' element={<Home/>} />
            <Route exact path='/login' element={<Login/>} />
            <Route exact path='/signup' element={<Signup/>} />
            <Route exact path='/Restaurantpanel/Userdashboard' element={<Userdashboard/>} />
            <Route exact path='/Restaurantpanel/Restaurents' element={<Restaurents/>} />
            <Route exact path='/Restaurantpanel/Addrestaurent' element={<Addrestaurent/>} />
            <Route exact path='/Restaurantpanel/Category' element={<Category/>} />
            <Route exact path='/Restaurantpanel/Addcategory' element={<Addcategory/>} />
            <Route exact path='/Restaurantpanel/EditCategory' element={<EditCategory/>} />
            <Route exact path='/Restaurantpanel/Items' element={<Items/>} />
            <Route exact path='/Restaurantpanel/Additems' element={<Additems/>} />
            <Route exact path='/Restaurantpanel/Subcategory' element={<Subcategory/>} />
            <Route exact path='/Restaurantpanel/Addsubcategories' element={<Addsubcategories/>} />
            <Route exact path='/Restaurantpanel/EditSubcategory' element={<EditSubcategory/>} />
            <Route exact path='/Restaurantpanel/EditItem' element={<EditItem/>} />
            <Route exact path='/Restaurantpanel/EditRestaurant' element={<EditRestaurant/>} />
            <Route exact path='/Restaurantpanel/Menu' element={<Menu/>} />
            <Route exact path='/Restaurantpanel/AddMenuItem' element={<AddMenuItem/>} />
            <Route exact path='/Restaurantpanel/EditMenuItem' element={<EditMenuItem/>} />
            <Route exact path='/Restaurantpanel/Viewmenu' element={<Viewmenu/>} />
            <Route exact path='/Restaurantpanel/ItemDetail' element={<ItemDetail/>} />
            <Route exact path='/Restaurantpanel/Offers' element={<Offers/>} />
            <Route exact path='/Restaurantpanel/Offeritems' element={<Offeritems/>} />
            <Route exact path='/Restaurantpanel/WeeklyOffers' element={<WeeklyOffers/>} />
            <Route exact path='/Restaurantpanel/WeeklyOfferitems' element={<WeeklyOfferitems/>} />
            <Route exact path='/Restaurantpanel/ForgotPassword' element={<ForgotPassword/>} />
            <Route exact path='/Retailerpanel/Retailerdashboard' element={<Retailerdashboard/>} />
            <Route exact path='/Retailerpanel/Store' element={<Store/>} />
            <Route exact path='/Retailerpanel/Addstore' element={<Addstore/>} />
            <Route exact path='/Retailerpanel/Editstore' element={<Editstore/>} />
            <Route exact path='/Retailerpanel/Products' element={<Products/>} />
            <Route exact path='/Retailerpanel/Addproduct' element={<Addproduct/>} />
            <Route exact path='/Retailerpanel/Editproduct' element={<Editproduct/>} />
            <Route exact path='/Retailerpanel/Storedetail' element={<Storedetail/>} />
            <Route exact path='/Businesspanel/Businessdashboard' element={<Businessdashboard/>} />
            <Route exact path='/Businesspanel/Business' element={<Business/>} />
            <Route exact path='/Businesspanel/Addbusiness' element={<Addbusiness/>} />
            <Route exact path='/Businesspanel/Editbusiness' element={<Editbusiness/>} />
            <Route exact path='/Businesspanel/Services' element={<Servicepage/>} />
            <Route exact path='/Businesspanel/Addservice' element={<Addservice/>} />
            <Route exact path='/Businesspanel/Editservice' element={<Editservice/>} />
            <Route exact path='/Businesspanel/Businessdetail' element={<Businessdetail/>} />
            {/* <Route exact path='/cart' element={<Cart/>} /> */}
        </Routes>
      </div>
    </Router>
    </RestaurantProvider>
    
      
  );
}

export default App;
