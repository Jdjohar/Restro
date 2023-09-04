  
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Login from './screens/Login';

import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import Signup from './screens/Signup';
import { CartProvider } from './components/ContextReducer';
import Cart from './components/Cart';
import Userdashboard from './screens/userpanel/Userdashboard';
import Restaurents from './screens/userpanel/Restaurents';
import Addrestaurent from './screens/Addrestaurent';
import Category from './screens/userpanel/Category';
import Addcategory from './screens/Addcategory';
import { RestaurantProvider } from './components/RestaurantContext';
import EditCategory from './screens/userpanel/EditCategory';
import Items from './screens/userpanel/Items';
import Additems from './screens/Additems';
import Subcategory from './screens/userpanel/Subcategory';
import Addsubcategories from './screens/Addsubcategories';
import EditSubcategory from './screens/userpanel/EditSubcategory';
import EditItem from './screens/userpanel/EditItem';
import EditRestaurant from './screens/userpanel/EditRestaurants';
import Menu from './screens/userpanel/Menu';
import AddMenuItem from './screens/AddMenuItem';
import EditMenuItem from './screens/userpanel/EditMenuItem';
import Viewmenu from './screens/userpanel/Viewmenu';
import ItemDetail from './screens/userpanel/ItemDetail';
import Offers from './screens/userpanel/Offers';
import Offeritems from './screens/userpanel/Offeritems';
import WeeklyOffers from './screens/userpanel/WeeklyOffers';
import WeeklyOfferitems from './screens/userpanel/WeeklyOfferitems';

function App() {
  return (
    <RestaurantProvider>

    <Router>
      <div>
        <Routes>
            <Route exact path='/' element={<Home/>} />
            <Route exact path='/login' element={<Login/>} />
            <Route exact path='/signup' element={<Signup/>} />
            <Route exact path='/Userpanel/Userdashboard' element={<Userdashboard/>} />
            <Route exact path='/Userpanel/Restaurents' element={<Restaurents/>} />
            <Route exact path='/Userpanel/Addrestaurent' element={<Addrestaurent/>} />
            <Route exact path='/Userpanel/Category' element={<Category/>} />
            <Route exact path='/Userpanel/Addcategory' element={<Addcategory/>} />
            <Route exact path='/Userpanel/EditCategory' element={<EditCategory/>} />
            <Route exact path='/Userpanel/Items' element={<Items/>} />
            <Route exact path='/Userpanel/Additems' element={<Additems/>} />
            <Route exact path='/Userpanel/Subcategory' element={<Subcategory/>} />
            <Route exact path='/Userpanel/Addsubcategories' element={<Addsubcategories/>} />
            <Route exact path='/Userpanel/EditSubcategory' element={<EditSubcategory/>} />
            <Route exact path='/Userpanel/EditItem' element={<EditItem/>} />
            <Route exact path='/Userpanel/EditRestaurant' element={<EditRestaurant/>} />
            <Route exact path='/Userpanel/Menu' element={<Menu/>} />
            <Route exact path='/Userpanel/AddMenuItem' element={<AddMenuItem/>} />
            <Route exact path='/Userpanel/EditMenuItem' element={<EditMenuItem/>} />
            <Route exact path='/Userpanel/Viewmenu' element={<Viewmenu/>} />
            <Route exact path='/Userpanel/ItemDetail' element={<ItemDetail/>} />
            <Route exact path='/Userpanel/Offers' element={<Offers/>} />
            <Route exact path='/Userpanel/Offeritems' element={<Offeritems/>} />
            <Route exact path='/Userpanel/WeeklyOffers' element={<WeeklyOffers/>} />
            <Route exact path='/Userpanel/WeeklyOfferitems' element={<WeeklyOfferitems/>} />
            {/* <Route exact path='/cart' element={<Cart/>} /> */}
        </Routes>
      </div>
    </Router>
    </RestaurantProvider>
    
      
  );
}

export default App;
