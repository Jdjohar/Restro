// import React,{useState} from 'react';
// import {Link, useNavigate} from 'react-router-dom'
// import './Login.css'

// export default function Login() {
//   const [credentails, setcredentails] = useState({email:"",password:""})
//   const [message, setmessage] = useState(false);
//   const [alertshow, setalertshow] = useState('');


//   let navigate = useNavigate();
//     const handleSubmit = async(e) => {
//         e.preventDefault();
    
//         const response = await fetch("http://localhost:3001/api/login",{
//             method:'POST',
//             headers: {
//                 'Content-Type':'application/json'
//             },
//             body:JSON.stringify({email:credentails.email,password:credentails.password})
//         });

//         const json = await response.json();

//         console.log(json, 'sd');

//         if(!json.Success){
//             // alert('Enter vaild  Credentails');
//             setmessage(true);
//             setalertshow(json.errors)

//         }
//         if(json.Success){
//           localStorage.setItem("authToken", json.authToken)
//           localStorage.setItem("userid", json.userid)
//           localStorage.setItem("userEmail", credentails.email)
//           console.log(localStorage.getItem("authToken"), "Data")
//             navigate("/");
//         }
//     }

//     const onchange = (event) => {
//         setcredentails({...credentails, [event.target.name]:event.target.value})
//     }
//   return (
//     <>

// <section class="ftco-section">
// 		<div class="container">
// 			<div class="row justify-content-center">
// 				<div class="col-md-6 text-center mb-5">
// 					<h2 class="heading-section">Login</h2>
//           <img src='' />
// 				</div>
// 			</div>
// 			<div class="row justify-content-center">
// 				<div class="col-md-12 col-lg-10">
// 					<div class="wrap d-md-flex">
// 						<div class="img" style={{backgroundImage: `url("../bg-1.jpg")`}}>
// 			      </div>
// 						<div class="login-wrap p-4 p-md-5">
// 			      	<div class="d-flex">
// 			      		<div class="w-100">
// 			      			<h3 class="mb-4">Sign In</h3>
// 			      		</div>
// 								<div class="w-100">
// 									<p class="social-media d-flex justify-content-end">
// 										<a href="#" class="social-icon d-flex align-items-center justify-content-center"><span class="fa fa-facebook"></span></a>
// 										<a href="#" class="social-icon d-flex align-items-center justify-content-center"><span class="fa fa-twitter"></span></a>
// 									</p>
// 								</div>
// 			      	</div>
// 							<form onSubmit={handleSubmit} class="signin-form">
// 			      		<div class="form-group mb-3">
// 			      			<label class="label" for="name">Username</label>
// 			      			<input type="text" class="form-control" name="email" value={credentails.email}  onChange={onchange} placeholder="Username" required />
// 			      		</div>
// 		            <div class="form-group mb-3">
// 		            	<label class="label" for="password">Password</label>
// 		              <input type="password" class="form-control" name="password" value={credentails.password}  onChange={onchange} placeholder="Password" required />
// 		            </div>
// 		            <div class="form-group">
// 		            	<button type="submit" class="form-control btn btn-primary rounded submit px-3">Sign In</button>
// 		            </div>
// 		            <div class="form-group">

//                 {message == true 
//                 ? 
//                 <div class="alert alert-warning alert-dismissible fade show" role="alert">
//                 <strong>{alertshow}</strong> 
//                   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              
//               </div>
//                 : 
                
//                 ""}


      
		            
// 		            </div>
// 		            <div class="form-group d-md-flex">
// 		            	<div class="w-50 text-left">
// 			            	<label class="checkbox-wrap checkbox-primary mb-0">Remember Me
// 									  <input type="checkbox" checked />
// 									  <span class="checkmark"></span>
// 										</label>
// 									</div>
// 									<div class="w-50 text-md-right">
// 										<a href="#">Forgot Password</a>
// 									</div>
// 		            </div>
// 		          </form>
// 		          <p class="text-center">Not a member? <Link data-toggle="tab" to="/signup">Sign Up</Link></p>
// 		        </div>
// 		      </div>
// 				</div>
// 			</div>
// 		</div>
// 	</section>
//     {/* <div className='container'>
//     <form onSubmit={handleSubmit}>
 
//   <div className="mb-3">
//     <label htmlFor="email" className="form-label">Email address</label>
//     <input type="email" className="form-control" name="email" value={credentails.email}  onChange={onchange} id="exampleInputEmail1" aria-describedby="emailHelp" />
//     <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//   </div>
//   <div className="mb-3">
//     <label htmlFor="password" className="form-label">Password</label>
//     <input type="password" className="form-control" name="password" value={credentails.password}  onChange={onchange} id="exampleInputPassword1" />
//   </div>


//   <button type="submit" className="btn btn-primary">Submit</button>
//   <Link to="/signup" className='m-3 btn btn-danger'>I'm a new user</Link>
// </form>
// </div> */}
//     </>
//   )
// }


import React,{useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import './Login.css'

export default function Login() {
  const [credentials, setCredentials] = useState({email:"",password:""})
  const [message, setmessage] = useState(false);
  const [alertShow, setAlertShow] = useState("");


  let navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();
    
        const response = await fetch("http://localhost:3001/api/login",{
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email:credentials.email,password:credentials.password})
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
          console.log(localStorage.getItem("authToken"), "Data")
            navigate("/");
        }
    }

    const onchange = (event) => {
      setCredentials({...credentials, [event.target.name]:event.target.value})
    }
  return (
    <>

<section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-6 text-center mb-5">
					<h2 class="heading-section">Login</h2>
          <img src='' />
				</div>
			</div>
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
		            	<button type="submit" class="form-control btn btn-primary rounded submit px-3">Sign In</button>
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
		            <div class="form-group d-md-flex">
		            	<div class="w-50 text-left">
			            	<label class="checkbox-wrap checkbox-primary mb-0">Remember Me
									  <input type="checkbox" checked />
									  <span class="checkmark"></span>
										</label>
									</div>
									<div class="w-50 text-md-right">
										<a href="#">Forgot Password</a>
									</div>
		            </div>
		          </form>
		          <p class="text-center">Not a member? <Link data-toggle="tab" to="/signup">Sign Up</Link></p>
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
    </>
  )
}
