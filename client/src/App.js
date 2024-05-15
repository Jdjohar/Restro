  
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
import ResetPassword from './screens/ResetPassword.js';
import Retailerdashboard from './screens/Retailerpanel/Retailerdashboard.js';
import Products from './screens/Retailerpanel/Products.js';
import Addproduct from './screens/Retailerpanel/Addproduct.js';
import Editproduct from './screens/Retailerpanel/Editproduct.js';
import Store from './screens/Retailerpanel/Store.js';
import Addstore from './screens/Retailerpanel/Addstore.js';
import Editstore from './screens/Retailerpanel/Editstore.js';
import RetailOffers from './screens/Retailerpanel/RetailOffers.js';
import RetailOfferProducts from './screens/Retailerpanel/RetailOfferProducts.js';
import RetailWeeklyOffer from './screens/Retailerpanel/RetailWeeklyOffer.js';
import RetailWeeklyProducts from './screens/Retailerpanel/RetailWeeklyProducts.js';
import Businessdashboard from './screens/Businesspanel/Businessdashboard.js';
import Business from './screens/Businesspanel/Business.js';
import Addbusiness from './screens/Businesspanel/Addbusiness.js';
import Editbusiness from './screens/Businesspanel/Editbusiness.js';
import Storedetail from './screens/Retailerpanel/Storedetail.js';
import Servicepage from './screens/Businesspanel/Servicepage.js';
import Addservice from './screens/Businesspanel/Addservice.js';
import Editservice from './screens/Businesspanel/Editservice.js';
import Businessdetail from './screens/Businesspanel/Businessdetail.js';
import BusinessOffer from './screens/Businesspanel/BusinessOffer.js';
import BusinessOfferService from './screens/Businesspanel/BusinessOfferService.js';
import BusinessWeeklyOffer from './screens/Businesspanel/BusinessWeeklyOffer.js';
import BusinessWeeklyServices from './screens/Businesspanel/BusinessWeeklyServices.js';
import Adminimagedetail from './screens/Adminpanel/Adminimagedetail.js';
import UploadImage from './screens/Adminpanel/UploadImage.js';
import Team from './screens/Restaurantpanel/Team.js';
import Addteam from './screens/Restaurantpanel/Addteam.js';
import Editteam from './screens/Restaurantpanel/Editteam.js';
import RetailerTeam from './screens/Retailerpanel/RetailerTeam.js';
import AddRetailerteam from './screens/Retailerpanel/AddRetailerteam.js';
import EditRetailerteam from './screens/Retailerpanel/EditRetailerteam.js';
import Serviceteam from './screens/Businesspanel/Serviceteam.js';
import AddServiceteam from './screens/Businesspanel/AddServiceteam.js';
import EditServiceteam from './screens/Businesspanel/EditServiceteam.js';
import Testmenupage from './screens/Restaurantpanel/Testmenupage.js';
import Retailermenupage from './screens/Retailerpanel/Retailermenupage.js';
import Businessmenudetail from './screens/Businesspanel/Businessmenudetail.js';
import Template from './screens/Adminpanel/Template.js';

function App() {
  return (
    <RestaurantProvider>

    <Router>
      <div>
        <Routes>
            <Route exact path='/' element={<Home/>} />
            <Route exact path='/login' element={<Login/>} />
            <Route exact path='/signup' element={<Signup/>} />
            <Route exact path='/reset-password/:token' element={<ResetPassword/>} />
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
            <Route exact path='/Restaurantpanel/Team' element={<Team/>} />
            <Route exact path='/Restaurantpanel/Addteam' element={<Addteam/>} />
            <Route exact path='/Restaurantpanel/Editteam' element={<Editteam/>} />
            <Route exact path='/Restaurantpanel/Testmenupage/:id' element={<Testmenupage/>} />
            <Route exact path='/Retailerpanel/Retailerdashboard' element={<Retailerdashboard/>} />
            <Route exact path='/Retailerpanel/Store' element={<Store/>} />
            <Route exact path='/Retailerpanel/Addstore' element={<Addstore/>} />
            <Route exact path='/Retailerpanel/Editstore' element={<Editstore/>} />
            <Route exact path='/Retailerpanel/Products' element={<Products/>} />
            <Route exact path='/Retailerpanel/Addproduct' element={<Addproduct/>} />
            <Route exact path='/Retailerpanel/Editproduct' element={<Editproduct/>} />
            <Route exact path='/Retailerpanel/Storedetail' element={<Storedetail/>} />
            <Route exact path='/Retailerpanel/RetailOffers' element={<RetailOffers/>} />
            <Route exact path='/Retailerpanel/RetailOfferProducts' element={<RetailOfferProducts/>} />
            <Route exact path='/Retailerpanel/RetailWeeklyOffer' element={<RetailWeeklyOffer/>} />
            <Route exact path='/Retailerpanel/RetailWeeklyProducts' element={<RetailWeeklyProducts/>} />
            <Route exact path='/Retailerpanel/Team' element={<RetailerTeam/>} />
            <Route exact path='/Retailerpanel/Addteam' element={<AddRetailerteam/>} />
            <Route exact path='/Retailerpanel/Editteam' element={<EditRetailerteam/>} />
            <Route exact path='/Retailerpanel/Retailermenupage/:id' element={<Retailermenupage/>} />
            <Route exact path='/Businesspanel/Businessdashboard' element={<Businessdashboard/>} />
            <Route exact path='/Businesspanel/Business' element={<Business/>} />
            <Route exact path='/Businesspanel/Addbusiness' element={<Addbusiness/>} />
            <Route exact path='/Businesspanel/Editbusiness' element={<Editbusiness/>} />
            <Route exact path='/Businesspanel/Services' element={<Servicepage/>} />
            <Route exact path='/Businesspanel/Addservice' element={<Addservice/>} />
            <Route exact path='/Businesspanel/Editservice' element={<Editservice/>} />
            <Route exact path='/Businesspanel/Businessdetail' element={<Businessdetail/>} />
            <Route exact path='/Businesspanel/BusinessOffer' element={<BusinessOffer/>} />
            <Route exact path='/Businesspanel/BusinessOfferService' element={<BusinessOfferService/>} />
            <Route exact path='/Businesspanel/BusinessWeeklyOffer' element={<BusinessWeeklyOffer/>} />
            <Route exact path='/Businesspanel/BusinessWeeklyServices' element={<BusinessWeeklyServices/>} />
            <Route exact path='/Businesspanel/Team' element={<Serviceteam/>} />
            <Route exact path='/Businesspanel/Addteam' element={<AddServiceteam/>} />
            <Route exact path='/Businesspanel/Editteam' element={<EditServiceteam/>} />
            <Route exact path='/Businesspanel/Businessmenudetail/:id' element={<Businessmenudetail/>} />
            <Route exact path='/Adminpanel/Adminimagedetail' element={<Adminimagedetail/>} />
            <Route exact path='/Adminpanel/Template' element={<Template/>} />
            <Route exact path='/Adminpanel/UploadImage' element={<UploadImage/>} />
            {/* <Route exact path='/cart' element={<Cart/>} /> */}
        </Routes>
      </div>
    </Router>
    </RestaurantProvider>
    
      
  );
}

export default App;
