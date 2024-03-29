import React, {useState} from 'react'
import {Link,useNavigate } from 'react-router-dom'
import { Badge } from 'react-bootstrap';
import Modal from '../Model';
import Cart from './Cart';
import { useCart } from '../components/ContextReducer';

export default function Navbar() {
  const [cartview, setcartview] = useState(false)
  const navigate = useNavigate();
  let data =useCart()


  const handleLogout = () => {

    localStorage.removeItem('authToken');
    navigate("/login")
  }

  
  const handleSuccessfulSignup = (signuptype) => {
    console.log(signuptype,"sdsd")
    if (signuptype === 'Restaurant') {
      console.log("else part 1");
      navigate('/Restaurantpanel/Userdashboard');
    } 
    else if (signuptype === 'Retailer') {
      console.log("else part 2");
      navigate('/Retailerpanel/Retailerdashboard');
      console.log("else part 222");
    } else if (signuptype === 'Service Provider') {
      console.log("else part 3");
      navigate('/Businesspanel/Businessdashboard');
    } else if (signuptype === 'Admin Panel') {
      console.log("else part 4");
      navigate('/Adminpanel/Adminimagedetail');
    }
    else{
      console.log("else part");
    }
  };


  return (

    <div>
        <nav className="navbar navbar-expand-lg bg-dark">
  <div className="container-fluid">
    <Link className="text-white navbar-brand" to="/">Go<span className='fw-bold'>Food</span></Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto mb-2">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        {localStorage.getItem('authToken') && (
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => handleSuccessfulSignup(localStorage.getItem('signuptype'))}
            >
              Dashboard
            </button>
          </li>
        )}
        
        
      </ul>
{
  (localStorage.getItem("authToken")) 
  ?
  <div className="d-flex">
  <div className="btn bg-white text-success mx-1" onClick={handleLogout}>Logout</div>
  <div className="btn bg-white text-success mx-1" onClick={() => {setcartview(true)}}>Cart {" "}
    <Badge pil bg="danger">{data}</Badge>
  </div>
  {cartview?<Modal onClose={() => {setcartview(false)}}>

<Cart />

  </Modal>:null}
  </div>
  :
  <div className="d-flex">
          <Link className="btn bg-white text-success mx-1" to="/login">Login</Link>
       
          <Link className="btn bg-white text-success mx-1" to="/signup">Signup</Link>
        </div>
}



    
    </div>
  </div>
</nav>
    </div>

  )
}
