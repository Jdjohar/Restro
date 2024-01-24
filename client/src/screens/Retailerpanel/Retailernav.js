import React,{useState} from 'react'
import './Retailerstyle.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logoimage from '../images/mmojilogo.png';

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
      if(location.pathname == '/Retailerpanel/RetailOffers' && countrun < 1){
          console.log(location.pathname);
          setIsDropdownOpen2(true);
          setcountrun(1);
      }
      else if(location.pathname == '/Retailerpanel/RetailOfferProducts' && countrun < 1){
          console.log(location.pathname);
          setIsDropdownOpen2(true);
          setcountrun(1);
      }
      else if(location.pathname == '/Retailerpanel/RetailWeeklyOffer' && countrun < 1){
          console.log(location.pathname);
          setIsDropdownOpen1(true);
          setcountrun(1);
      }
      else if(location.pathname == '/Retailerpanel/RetailWeeklyProducts' && countrun < 1){
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
      <nav className="navbar bg-body-tertiary d-block d-lg-none d-md-none">
  <div class="">
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon text-black"></span>
    </button>
    <div class="offcanvas offcanvas-start text-black" tabindex="-1" style={{visibility: "visible"}} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        {/* <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Restro</h5> */}
        <img src={Logoimage} alt="Menu Moji Logo" className='logo img-fluid w-lg-75 w-50 d-block' />
        <button type="button" class="btn-close " data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body nav">
      <ul>
                    <li>
                      <Link to="/Retailerpanel/Retailerdashboard" className={`nav-link scrollto icones text-black ${location.pathname == '/Restaurantpanel/Userdashboard' ? 'active' : ''}`}>
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Dashboard</span>
                      </Link>
                    </li>

                    <li>
                      <Link to="/Retailerpanel/Store" className={`nav-link scrollto icones text-black ${
                                  location.pathname == '/Retailerpanel/Store' || location.pathname == '/Retailerpanel/Addstore' || location.pathname == '/Retailerpanel/Editstore' || 
                                  location.pathname == '/Retailerpanel/Products' || location.pathname == '/Retailerpanel/Addproduct' || location.pathname == '/Retailerpanel/Editproduct' ||
                                  location.pathname == '/Retailerpanel/Storedetail' ? 'active' : ''}`}>
                        <i class="fa-solid fa-store me-2 resclr"></i> <span>Store</span>
                      </Link>
                    </li>

                    <li>
                      <Link to="/Retailerpanel/Team" className={`nav-link scrollto icones text-black ${
                                  location.pathname == '/Retailerpanel/Team' || 
                                  location.pathname == '/Retailerpanel/Addteam' || 
                                  location.pathname == '/Retailerpanel/Editteam' ? 'active' : ''}`} >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Team</span>
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
                                <Link to="/Retailerpanel/RetailOffers" className={`nav-link scrollto icones text-black ${location.pathname == '/Retailerpanel/RetailOffers' ? 'active' : ''}`}>
                                    <i class="fa-solid fa-percent me-3 addoffclr"></i>
                                    <span>Add New Offer</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/Retailerpanel/RetailOfferProducts" className={`nav-link scrollto icones text-black ${location.pathname == '/Retailerpanel/RetailOfferProducts' ? 'active' : ''}`}>
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
                                <Link to="/Retailerpanel/RetailWeeklyOffer" className={`nav-link scrollto icones text-black ${location.pathname == '/Retailerpanel/RetailWeeklyOffer' ? 'active' : ''}`}>
                                    <i class="fa-solid fa-percent me-3 addoffclr"></i>
                                    <span> Add Weekly Offer </span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/Retailerpanel/RetailWeeklyProducts" className={`nav-link scrollto icones text-black ${location.pathname == '/Retailerpanel/RetailWeeklyProducts' ? 'active' : ''}`}>
                                    <i class="fa-solid fa-percent me-3 offlistclr"></i>
                                    <span>Weekly Offer List</span>
                                </Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </li>
                    <li>
                        <a onClick={handleLogout} className=" pointer nav-link scrollto icones text-black">
                          <i class="fa-solid fa-right-from-bracket me-2"></i>
                          <span>Logout</span>
                        </a>
                      </li>
                  </ul>
      </div>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Retailernav

