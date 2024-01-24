import React,{useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {LoginSocialFacebook} from 'reactjs-social-login'
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLoginButton } from "react-social-login-buttons";
import jwt_decode from "jwt-decode";
import './Login.css'

export default function Login() {
  const [credentials, setCredentials] = useState({email:"",password:""})
  const [message, setmessage] = useState(false);
  const [alertShow, setAlertShow] = useState("");
  const [showSignupTypeAlert, setShowSignupTypeAlert] = useState(false);
  const [selectedSignupType, setSelectedSignupType] = useState("");


  let navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();
    
        const response = await fetch("https://real-estate-1kn6.onrender.com/api/login",{
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
              email:credentials.email,
              password:credentials.password, 
              signupMethod: "email"
            })
        });

        const json = await response.json();

        console.log(json, 'sd');

        if(!json.Success){
            // alert('Enter vaild  Credentails');
            setmessage(true);
            setAlertShow(json.errors)

        }
        if(json.Success){
          localStorage.setItem("authToken", json.authToken)
          localStorage.setItem("userid", json.userid)
          localStorage.setItem("userEmail", credentials.email)
          localStorage.setItem("signuptype", json.signuptype);
          localStorage.setItem("isTeammember", json.isTeammember);
          // console.log(localStorage.getItem("userid"), "Data")
            // navigate("/Restaurantpanel/Userdashboard");
            console.log("Received Sign Up Type:", json.signuptype);
            
          if (json.signuptype === "Restaurant") {
            console.log("Redirecting to Restaurant Dashboard");
            navigate("/Restaurantpanel/Userdashboard");
          } else if (json.signuptype === "Retailer") {
            console.log("Redirecting to Retailer Dashboard");
            navigate("/Retailerpanel/Retailerdashboard");
          } else if (json.signuptype === "Service Provider") {
            console.log("Redirecting to Service Provider Dashboard");
            navigate("/Businesspanel/Businessdashboard");
          } else if (json.signuptype === "Admin Panel") {
            console.log("Redirecting to Admin Panel Dashboard");
            navigate("/Adminpanel/Adminimagedetail");
          }
          else{
            console.log("No matching signuptype found");
          }
        }else {
          console.log("Login unsuccessful");
        }
    }
    const socialLogin = async(name,email,signupMethod) => {

      

    
      const response = await fetch("https://real-estate-1kn6.onrender.com/api/createuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: name, 
          email: email,
          password: "12345", 
          location: "india", 
          signupMethod: signupMethod,
          selectedSignupType: selectedSignupType, 
        })
      });

        const json = await response.json();

        console.log(json, 'sd');
        

        if(!json.Success){
            // alert('Enter vaild  Credentails');
            setmessage(true);
            setAlertShow(json.errors)

        }
        if(json.Success){
          localStorage.setItem("authToken", json.authToken)
          localStorage.setItem("userid", json.userid)
          localStorage.setItem("userEmail", credentials.email)
          localStorage.setItem("signuptype", json.signuptype);
          console.log(localStorage.getItem("authToken"), "Data")
          
    if (signupMethod === 'google' || signupMethod === 'facebook') {
      setShowSignupTypeAlert(json.requiresignuptype);
    }
    // if(json.requiresignuptype == false){
    //         navigate("/Restaurantpanel/Userdashboard");
    // }
    
    if (json.signuptype === "Restaurant") {
      navigate("/Restaurantpanel/Userdashboard");
    } else if (json.signuptype === "Retailer") {
      navigate("/Retailerpanel/Retailerdashboard");
    } else if (json.signuptype === "Service Provider") {
      navigate("/Businesspanel/Businessdashboard");
    } else if (json.signuptype === "Admin Panel") {
      navigate("/Adminpanel/Adminimagedetail");
    }
        }
    }

    const handleSignupTypeSelection = async () => {
      const selectedSignupTypeRadio = document.querySelector(
        'input[name="signuptype"]:checked'
      );
    
      if (selectedSignupTypeRadio) {
        const selectedValue = selectedSignupTypeRadio.value;
        setSelectedSignupType(selectedValue);
    
        const userid = localStorage.getItem("userid");    
        const updatedSignuptype = {
          userid,
          signuptype: selectedValue,
        };
    
        try {
          const response = await fetch(`https://real-estate-1kn6.onrender.com/api/updatesignuptype/${userid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSignuptype),
          });
    
          if (response.ok) {
            const json = await response.json();
            if (json.Success) {
            navigate("/Restaurantpanel/Userdashboard");
          } else if (selectedValue === "Retailer") {
            navigate("/Retailerpanel/Retailerdashboard");
          } else if (selectedValue === "Service Provider") {
            navigate("/Businesspanel/Businessdashboard");
          } else if (selectedValue === "Admin Panel") {
            navigate("/Adminpanel/Adminimagedetail");
              console.log(updatedSignuptype);
            } else {
              console.error('Error updating signuptype:', json.message);
            }
          } else {
            console.error('Failed to update signuptype. Server responded with status:', response.status);
          }
        } catch (error) {
          console.error('Error while updating signuptype:', error);
        }
      }
    
      // Close the alert box
      setShowSignupTypeAlert(false);
    };
    
    // const handleSignupTypeSelection = () => {
    //   const selectedSignupTypeRadio = document.querySelector(
    //     'input[name="signuptype"]:checked'
    //   );
  
    //   if (selectedSignupTypeRadio) {
    //     const selectedValue = selectedSignupTypeRadio.value;
    //     setSelectedSignupType(selectedValue); // Store the selected signup type
    //     console.log(`Selected Signup Type: ${selectedValue}`);
    //   } else {
    //     console.log('No signup type selected');
    //   }
    
    //   // Close the alert box
    //   setShowSignupTypeAlert(false);
    // };
    
const getdata=async (data) => {
  try {
    // Verify and decode the token using the secret key
    var decoded = jwt_decode(data.credential);
    // The decoded variable now contains the payload data from the token
    console.log('Decoded JWT:', decoded);
    await socialLogin(decoded.name, decoded.email, "google");
  
    // You can access specific claims from the payload like this:
    // const userId = decoded.userId;
    // const userEmail = decoded.email;
  
    // console.log('User ID:', userId);
    // console.log('User Email:', userEmail);
  } catch (error) {
    // Handle token verification errors (e.g., token is invalid or expired)
    console.error('JWT Verification Error:', error.message);
  }
}
    const onchange = (event) => {
      setCredentials({...credentials, [event.target.name]:event.target.value})
    }
  return (
    <>
 {/* <GoogleOAuthProvider clientId="538055540936-csm74kpksihgemo2gmcl8hnr62dnsvfg.apps.googleusercontent.com"> */}
{/* <GoogleOAuthProvider clientId="836780155754-2bb00gmkocp0tq0ss20h76evjiaqdmh9.apps.googleusercontent.com"> */}
<GoogleOAuthProvider clientId="720816757980-4bhq9da0376p2aqmpf4cij3ss1j7pqkt.apps.googleusercontent.com">
<section class="ftco-section">
		<div class="container">
			{/* <div class="row justify-content-center">
				<div class="col-md-6 text-center mb-5">
					<h2 class="heading-section">Login</h2>
          <img src='' />
				</div>
			</div> */}
			<div class="row justify-content-center">
				<div class="col-md-12 col-lg-10">
					<div class="wrap d-md-flex">
						<div class="img" style={{backgroundImage: `url("../bg-1.jpg")`}}>
			      </div>
						<div class="login-wrap p-4 p-md-5">
			      	<div class="d-flex">
			      		<div class="w-100">
			      			<h3 class="mb-4">Sign In</h3>
			      		</div>
								<div class="w-100">
									<p class="social-media d-flex justify-content-end">
										<a href="#" class="social-icon d-flex align-items-center justify-content-center"><span class="fa fa-facebook"></span></a>
										<a href="#" class="social-icon d-flex align-items-center justify-content-center"><span class="fa fa-twitter"></span></a>
									</p>
								</div>
			      	</div>
							<form onSubmit={handleSubmit} class="signin-form">
			      		<div class="form-group mb-3">
			      			<label class="label" for="name">Username</label>
			      			<input type="text" class="form-control" name="email" value={credentials.email}  onChange={onchange} placeholder="Username" required />
			      		</div>
		            <div class="form-group mb-3">
		            	<label class="label" for="password">Password</label>
		              <input type="password" class="form-control" name="password" value={credentials.password}  onChange={onchange} placeholder="Password" required />
		            </div>
		            <div class="form-group">
		            	<button type="submit" class="form-control btn btn-primary rounded submit px-3 mb-3">Sign In</button>
                  <div className='d-flex justify-content-center'>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                          console.log(credentialResponse);
                          getdata(credentialResponse);
                        }}
                        onError={() => {
                          console.log('Login Failed');
                        }}
                        
                      />

                  </div>
                </div>
		            <div class="form-group">

                {message === true ? (
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>{alertShow}</strong>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          ) : (
            ""
          )}
		            </div>

                

                <div className='d-flex justify-content-center'>
                  <LoginSocialFacebook appId='1011810460159074' 
                  onResolve={async credentialResponse =>{
                    
                  await socialLogin(credentialResponse.data.name, credentialResponse.data.email, "facebook");
                    console.log(credentialResponse);
                  }}
                  onReject={()=>{
                    console.log('Login Failed');
                  }}
                  >
                    {/* <FacebookLoginButton></FacebookLoginButton> */}
                    <button className='btn btnbg text-white py-2 px-5'>
                    <i class="fa-brands fa-facebook me-2"></i>Login With Facebook</button>
                  </LoginSocialFacebook>
                </div>

                {/* <LoginSocialFacebook appId='1011810460159074' 
                onResolve={(res) =>{
                  console.log(res);
                }}
                onReject={(err)=>{
                  console.log(err);
                }}
                >
                  <button>Login With Facebook</button>
                </LoginSocialFacebook> */}


		            <div class="form-group d-md-flex">
		            	<div class="w-50 text-left">
			            	<label class="checkbox-wrap checkbox-primary mb-0">Remember Me
									  <input type="checkbox" checked />
									  <span class="checkmark"></span>
										</label>
									</div>
									<div class="w-50 text-md-right">
										<a href="/Restaurantpanel/ForgotPassword">Forgot Password</a>
									</div>
		            </div>
		          </form>

              {showSignupTypeAlert && (
                    <div className="alert alert-info" role="alert">
                      Please choose your signup type:
                      <div>
                        <label>
                          <input type="radio" name="signuptype" value="Restaurant" /> Restaurant
                        </label>
                      </div>
                      <div>
                        <label>
                          <input type="radio" name="signuptype" value="Retailer" /> Retailer
                        </label>
                      </div>
                      <div>
                        <label>
                          <input type="radio" name="signuptype" value="Service Provider" /> Service Provider
                        </label>
                      </div>
                      <button type="button" 
                        className="btn btn-primary mt-2"
                        onClick={ ()=> handleSignupTypeSelection() }
                      >
                        Confirm
                      </button>
                    </div>
                  )}
		          <p class="text-center text-black">Not a member? <Link data-toggle="tab" to="/signup">Sign Up</Link></p>
		        </div>
		      </div>
				</div>
			</div>
		</div>
	</section>
    {/* <div className='container'>
    <form onSubmit={handleSubmit}>
 
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" name="email" value={credentails.email}  onChange={onchange} id="exampleInputEmail1" aria-describedby="emailHelp" />
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" name="password" value={credentails.password}  onChange={onchange} id="exampleInputPassword1" />
  </div>


  <button type="submit" className="btn btn-primary">Submit</button>
  <Link to="/signup" className='m-3 btn btn-danger'>I'm a new user</Link>
</form>
</div> */}
</GoogleOAuthProvider>
  
    </>
  )
}
