import React,{useState} from 'react'
import './Userstyle.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Retailernav = () => {
    const navigate = useNavigate();
    const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
    const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
    const [countrun, setcountrun] = useState(0);
    const location = useLocation();
      
  
    const handleLogout = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userid');
      localStorage.removeItem('signuptype');
      localStorage.removeItem('userEmail');
      navigate('/login');
    };
    const checkcurrentpage = (pagestr) => {
      // console.log(location.pathname);
      if(location.pathname == '/Restaurantpanel/Offers' && countrun < 1){
          console.log(location.pathname);
          setIsDropdownOpen2(true);
          setcountrun(1);
      }
      else if(location.pathname == '/Restaurantpanel/Offeritems' && countrun < 1){
          console.log(location.pathname);
          setIsDropdownOpen2(true);
          setcountrun(1);
      }
      else if(location.pathname == '/Restaurantpanel/WeeklyOffers' && countrun < 1){
          console.log(location.pathname);
          setIsDropdownOpen1(true);
          setcountrun(1);
      }
      else if(location.pathname == '/Restaurantpanel/WeeklyOfferitems' && countrun < 1){
          console.log(location.pathname);
          setIsDropdownOpen1(true);
          setcountrun(1);
      }
    };
  
    const toggleDropdown1 = () => {
      setIsDropdownOpen1(!isDropdownOpen1);
      setIsDropdownOpen2(false); // Close the other dropdown
    };
  
    const toggleDropdown2 = () => {
      setIsDropdownOpen2(!isDropdownOpen2);
      setIsDropdownOpen1(false); // Close the other dropdown
    };
    checkcurrentpage("");
  return (
    <div>
      <nav class="navbar bg-body-tertiary d-block d-lg-none d-md-none">
  <div class="">
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon text-black"></span>
    </button>
    <div class="offcanvas offcanvas-start text-black" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Restro</h5>
        <button type="button" class="btn-close " data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body nav">
      <ul>
                    <li>
                      <Link to="/Restaurantpanel/Userdashboard" className={`nav-link scrollto icones text-black ${location.pathname == '/Restaurantpanel/Userdashboard' ? 'active' : ''}`}>
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Dashboard</span>
                      </Link>
                    </li>

                    <li>
                      <Link to="/Restaurantpanel/Restaurents" className={`nav-link scrollto icones text-black ${
                                  location.pathname == '/Restaurantpanel/Restaurents' || location.pathname == '/Restaurantpanel/Addrestaurent' || location.pathname == '/Restaurantpanel/EditRestaurant' || 
                                  location.pathname == '/Restaurantpanel/Menu' || location.pathname == '/Restaurantpanel/AddCategory' || location.pathname == '/Restaurantpanel/EditCategory' ||
                                  location.pathname == '/Restaurantpanel/Subcategory' || location.pathname == '/Restaurantpanel/Addsubcategories' || location.pathname == '/Restaurantpanel/EditSubcategory' ||
                                  location.pathname == '/Restaurantpanel/Items' || location.pathname == '/Restaurantpanel/Additems' || location.pathname == '/Restaurantpanel/EditItem' ||
                                  location.pathname == '/Restaurantpanel/ItemDetail' ? 'active' : ''}`}>
                        <i class="fa-solid fa-store me-2 resclr"></i> <span>Merchants</span>
                      </Link>
                    </li>

                    

                    <li className="text-black">
                      <Link className={`nav-link collapsed text-black ${isDropdownOpen2 ? 'activ' : ''}`} onClick={toggleDropdown2} aria-expanded={isDropdownOpen2} >
                        <div className="sb-nav-link-icon">
                        {isDropdownOpen2 ? (
                            <i className="fas fa-angle-up me-3"></i>
                          ) : (
                            <i className="fas fa-angle-down me-3"></i>
                          )}
                          <span>Offer</span>
                        </div>
                      </Link>
                      <div className={`collapse ${isDropdownOpen2 ? 'show' : ''}`} id="collapseLayouts">
                        <nav className="sb-sidenav-menu-nested nav">
                          <ul className="d-flex flex-column ms-3">
                            <li>
                                <Link to="/Restaurantpanel/Offers" className={`nav-link scrollto icones text-black ${location.pathname == '/Restaurantpanel/Offers' ? 'active' : ''}`}>
                                    <i class="fa-solid fa-percent me-3 addoffclr"></i>
                                    <span>Add New Offer</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/Restaurantpanel/Offeritems" className={`nav-link scrollto icones text-black ${location.pathname == '/Restaurantpanel/Offeritems' ? 'active' : ''}`}>
                                    <i class="fa-solid fa-percent me-3 offlistclr"></i>
                                    <span>Offer List</span>
                                </Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </li>

                    <li className="text-black">
                      <Link className={`nav-link collapsed text-black ${isDropdownOpen1 ? 'activ' : ''}`} onClick={toggleDropdown1} aria-expanded={isDropdownOpen1} >
                        <div className="sb-nav-link-icon">
                        {isDropdownOpen1 ? (
                            <i className="fas fa-angle-up me-3"></i>
                          ) : (
                            <i className="fas fa-angle-down me-3"></i>
                          )}
                            <span>Weekly Offer</span>
                        </div>
                      </Link>
                      <div className={`collapse ${isDropdownOpen1 ? 'show' : ''}`} id="collapseExample1">
                        <nav className="sb-sidenav-menu-nested nav ">
                          <ul className="d-flex flex-column ms-3">
                            <li>
                                <Link to="/Restaurantpanel/WeeklyOffers" className={`nav-link scrollto icones text-black ${location.pathname == '/Restaurantpanel/WeeklyOffers' ? 'active' : ''}`}>
                                    <i class="fa-solid fa-percent me-3 addoffclr"></i>
                                    <span> Add Weekly Offer </span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/Restaurantpanel/WeeklyOfferitems" className={`nav-link scrollto icones text-black ${location.pathname == '/Restaurantpanel/WeeklyOfferitems' ? 'active' : ''}`}>
                                    <i class="fa-solid fa-percent me-3 offlistclr"></i>
                                    <span>Weekly Offer List</span>
                                </Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </li>
                    {localStorage.getItem('authToken') ? (
                      <li>
                        <Link onClick={handleLogout} className=" pointer nav-link scrollto icones text-black">
                          <i class="fa-solid fa-right-from-bracket me-2"></i>
                          <span>Logout</span>
                        </Link>
                      </li>
                    ) : (
                      ''
                    )}
                  </ul>
      </div>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Retailernav

