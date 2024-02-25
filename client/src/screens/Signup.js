
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate} from 'react-router-dom'

export default function Signup() {

  const [credentails, setcredentails] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    geolocation: "", 
    signuptype: "",
    signupMethod: "email",

  })
  const [message, setmessage] = useState(false);
  const [messageshow, setmessageshow] = useState(false);
  const [alertshow, setalertshow] = useState('');
  const [alertloginshow, setalertloginshow] = useState('');
  let navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://real-estate-1kn6.onrender.com/api/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name: credentails.name, 
        email: credentails.email, 
        password: credentails.password, 
        location: credentails.location,
        signuptype: credentails.signuptype, 
        signupMethod: credentails.signupMethod 
      })
    });

    const json = await response.json();
    console.log(json);

    if (json.Success) {
      setcredentails({ 
        name: "", 
        email: "", 
        password: "", 
        location  : "",
        signuptype: "",  
        signupMethod: "email"  
      })
      setmessage(true)
      setalertshow(json.message)
      alert("You have Successfully created your account");
      navigate('/login')
    }

    else{
      setmessage(true)
      setalertshow(json.message)
      // setmessageshow(true);
      // setalertloginshow("This Email already exists");
    }
  }

  const onchange = (event) => {
    setcredentails({ ...credentails, [event.target.name]: event.target.value })
  }

  const closeAlert = () => {
    setmessageshow(false);
    setalertloginshow('');
  };

  return (
    <>

      <section class="ftco-section">
        <div class="container">
          {/* <div class="row justify-content-center">
            <div class="col-md-6 text-center mb-5">
              <h2 class="heading-section">Signup</h2>
              <img src='' />
            </div>
          </div> */}
          <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
              <div class="wrap d-md-flex">
                <div class="img" style={{ backgroundImage: `url("../bg-1.jpg")` }}>
                </div>
                <div class="login-wrap p-4 p-md-5">
                  <div class="d-flex">
                    <div class="w-100">
                      <h3 class="mb-4">Sign Up</h3>
                    </div>
                    <div class="w-100">
                      <p class="social-media d-flex justify-content-end">
                        <a href="#" class="social-icon d-flex align-items-center justify-content-center"><span class="fa fa-facebook"></span></a>
                        <a href="#" class="social-icon d-flex align-items-center justify-content-center"><span class="fa fa-twitter"></span></a>
                      </p>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label text-dark">Name</label>
                      <input type="text" name="name" value={credentails.name} className="form-control" onChange={onchange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label text-dark">Email address</label>
                      <input type="email" className="form-control" name="email" value={credentails.email} onChange={onchange} id="exampleInputEmail1" aria-describedby="emailHelp" required />
                      <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label text-dark">Password</label>
                      <input type="password" className="form-control" name="password" value={credentails.password} onChange={onchange} id="exampleInputPassword1" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="exampleInputtext3" className="form-label text-dark">
                          Signup Type
                      </label>
                            <select
                              className="form-select"
                              name="signuptype"
                              onChange={onchange}
                              aria-label="Default select example"
                              required
                            >
                              <option value="">Select Signup Type</option>
                              <option value="Admin Panel">Admin Panel</option>
                              <option value="Restaurant">Restaurant </option>
                              <option value="Retailer">Retailer </option>
                              <option value="Service Provider">Service provider</option>
                            </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="location" className="form-label text-dark">GeoLocation</label>
                      <input type="text" className="form-control" name="location" value={credentails.location} onChange={onchange} id="exampleInputPassword1" required />
                    </div>
                    <div class="form-group mb-3 ">

                        {message == true 
                        ? 
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>{alertshow}</strong> 
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

                        </div>
                        : 

                        ""}
                    </div>
                    
                      {messageshow && (
                          <div className="row mt-3">
                            <div className="col-12">
                              <div className="alert alert-danger row" role="alert">
                                <div className='col-11'>
                                  {alertloginshow}
                                </div>
                                <div className='col-1 text-end'>
                                  <button type="button" className="btn-close" aria-label="Close" onClick={closeAlert}></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                    <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                  <p class="text-center text-dark">Already have an account? <Link data-toggle="tab" to="/login">Sign In</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
      )
}
