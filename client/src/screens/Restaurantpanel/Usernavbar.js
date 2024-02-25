import React, { useState, useEffect } from 'react';
import './Userstyle.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logoimage from '../images/mmojilogo.png';

export default function Usernavbar() {
  const navigate = useNavigate();
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [countrun, setcountrun] = useState(0);
  const location = useLocation();
  const [isTeammember, setIsTeammember] = useState(false); 
    

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('signuptype');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isTeammember');
    localStorage.removeItem('merchantid');
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

  useEffect(() => {
    // Check if the user is a team member
    const userIsTeammember = localStorage.getItem('isTeammember') === 'true';
    setIsTeammember(userIsTeammember);
  }, []);

  return (
    <div>
      <div className="sidebar-offcanvas pl-0" id="sidebar" role="navigation" style={{ backgroundColor: '#fff' }}>
        <header className="header d-xl-block menu" id="menu">
          <div className="d-flex flex-column ">
            <div className="text-center pt-5 pb-3">
              {/* <p className="font fs-1 fw-bold">RESTRO</p> */}
              <img src={Logoimage} alt="Menu Moji Logo" className='logo img-fluid w-75 d-block' />
            </div>

            <nav className="sb-sidenav accordion sb-sidenav-dark text-black" id="sidenavAccordion">
              <div className="sb-sidenav-menu">
                <div className="nav">
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
                        <i class="fa-solid fa-store me-2 resclr"></i> <span>Restaurants</span>
                      </Link>
                    </li>

                    {!isTeammember && ( // Render only if the user is not a team member
                      <li>
                        <Link
                          to="/Restaurantpanel/Team"
                          className={`nav-link scrollto icones text-black ${
                            location.pathname.includes('/Restaurantpanel/Team') || 
                            location.pathname == '/Restaurantpanel/Addteam' || 
                            location.pathname == '/Restaurantpanel/Editteam' ? 'active' : ''
                          }`}
                        >
                          <i className="fa-solid fa-house me-2 dashclr"></i> <span>Team</span>
                        </Link>
                      </li>
                    )}

                    {/* <li>
                      <Link to="/Restaurantpanel/Team" className={`nav-link scrollto icones text-black ${
                                  location.pathname == '/Restaurantpanel/Team' || 
                                  location.pathname == '/Restaurantpanel/Addteam' || 
                                  location.pathname == '/Restaurantpanel/Editteam' ? 'active' : ''}`} >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Team</span>
                      </Link>
                    </li> */}

                    

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
                                <Link to="/Restaurantpanel/Offers" className={`nav-link scrollto ulpadding icones text-black ${location.pathname == '/Restaurantpanel/Offers' ? 'active' : ''}`}>
                                    <i class="fa-solid fa-percent me-3 addoffclr"></i>
                                    <span>Add New Offer</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/Restaurantpanel/Offeritems" className={`nav-link scrollto ulpadding icones text-black ${location.pathname == '/Restaurantpanel/Offeritems' ? 'active' : ''}`}>
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
                                <Link to="/Restaurantpanel/WeeklyOffers" className={`nav-link scrollto ulpadding icones text-black ${location.pathname == '/Restaurantpanel/WeeklyOffers' ? 'active' : ''}`}>
                                    <i class="fa-solid fa-percent me-3 addoffclr"></i>
                                    <span> Add Weekly Offer </span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/Restaurantpanel/WeeklyOfferitems" className={`nav-link scrollto ulpadding icones text-black ${location.pathname == '/Restaurantpanel/WeeklyOfferitems' ? 'active' : ''}`}>
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
            </nav>
          </div>
        </header>
      </div>

    </div>
  );
}
