import React from 'react'
import './Userstyle.css'
import {useNavigate} from 'react-router-dom'

export default function Usernavbar() {
    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem('authToken');
        navigate("/login")
      }
  return (
    <div>
        <div className=" sidebar-offcanvas pl-0" id="sidebar" role="navigation" style={{backgroundColor:"#fff"}}>
            <header className="header d-xl-block menu" id="menu">
                    <div className="d-flex flex-column ">
                        <div className="text-center pt-5 pb-3">
                            <p>RESTRO</p>
                        </div>

                        <nav className="sb-sidenav accordion sb-sidenav-dark text-black" id="sidenavAccordion">
                            <div className="sb-sidenav-menu">
                                <div className="nav">
                                    <ul>
                                        <li>
                                            <a href="/Userpanel/Userdashboard" className="nav-link scrollto active icones text-black pt-3">
                                            <i class="fa-solid fa-house"></i> <span>Dashboard</span>
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/Userpanel/Restaurents" className="nav-link scrollto icones text-black">
                                            <i class="fa-solid fa-store"></i> <span>Restaurants</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/Userpanel/Offers" className="nav-link scrollto icones text-black">
                                            <i class="fa-solid fa-percent"></i><span>Offers Add</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/Userpanel/Offeritems" className="nav-link scrollto icones text-black">
                                            <i class="fa-solid fa-percent"></i><span>Offers</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/Userpanel/WeeklyOffers" className="nav-link scrollto icones text-black">
                                            <i class="fa-solid fa-percent"></i><span>Weekly Offer Add</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/Userpanel/WeeklyOfferitems" className="nav-link scrollto icones text-black">
                                            <i class="fa-solid fa-percent"></i><span>Weekly Offers</span>
                                            </a>
                                        </li>
                                        {
                                        (localStorage.getItem("authToken"))?
                                        <li>
                                        <a onClick={handleLogout} className=" pointer nav-link scrollto icones text-black">
                                        <i class="fa-solid fa-percent"></i><span>Logout</span>
                                        </a>
                                    </li>: ""}
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
            </header>
        </div>
    </div>
  )
}
