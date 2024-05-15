import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar';
// import Card from '../components/Card';
// import Carousal from '../components/Carousal';
import './Home.css';
import food1 from '../homeimages/food1.png'
import store1 from '../homeimages/store1.png'
import business1 from '../homeimages/business1.png'

export default function Home() {

  const [search, setsearch] = useState('');
  const [foodcat, setfoodcat] = useState([]);
  const [foodItems, setfoodItems] = useState([]);


  const loadData = async () => {
    let response = await fetch("https://restroproject.onrender.com/api/foodData",{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // .then((response)=>{
    //   response = await response.json();
    //   console.log(response,"foodcat")
    //   setfoodItems(response[0]);
    //   setfoodcat(response[1]);
    // })


    response = await response.json();
    console.log(response,"foodcat")
    setfoodItems(response[0]);
    setfoodcat(response[1]);
  }


  useEffect(()=>{
    loadData();
  },[])


  return (
   
    <div> 
        <div> <Navbar/></div>
        <div>
        <section>
        <div id="carouselExampleIndicators" className="carousel slide bg-black" style={{objectFit:"contain !important"}}>
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner" id='carousel'>
        <div className="carousel-item active bg-black">
          <div className="container" style={{ paddingTop: '40px', paddingBottom: '50px' }}>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <p className="clr-yellow h5 p-top text-warning">About Us</p>
                      <h2 className=" text-al text-left m-text-center letter-h font-weight-bold pt-3 text-white">Restaurant</h2>
                      <p className="text-left text-al  m-text-center fs-4 text-white">Join our community of food enthusiasts! Sign up as a restaurant owner to showcase your menu and attract hungry customers.</p>
                      <a href="#" className="btn btn-b float-left btn-theme d-none d-md-block bg-theme fw-bold">Signup &nbsp; &nbsp;<i className="fas fa-arrow-right"></i></a>
                    </div>
                    <div className="col-lg-6 m-pt-3 col-md-12">
                      <img src={food1} className="img-fluid img-br" alt="Restaurant" />
                    </div>
                  </div>
                </div>
        </div>
        <div className="carousel-item">
          <div className="container pad-t-30" style={{ paddingTop: '40px', paddingBottom: '50px' }}>
                    <div className="row">
                      <div className="col-lg-6 col-md-12">
                        <p className="clr-yellow h5 p-top text-warning">About Us</p>
                        <h2 className=" text-al text-left m-text-center letter-h font-weight-bold pt-3 text-white">Retailers</h2>
                        <p className="text-left text-al  m-text-center fs-4 text-white">Become a part of the retail revolution! Sign up as a retailer to showcase your products and reach more shoppers.</p>
                        <a href="#" className="btn btn-b float-left btn-theme d-none d-md-block bg-theme fw-bold">Signup &nbsp; &nbsp;<i className="fas fa-arrow-right"></i></a>
                      </div>
                      <div className="col-lg-6 m-pt-3 col-md-12 text-center">
                        <img src={store1} className="img-fluid img-br retail-width" alt="Retailers" />
                      </div>
                    </div>
            </div>
        </div>
        <div className="carousel-item">
          <div className="container pad-t-30" style={{ paddingTop: '40px', paddingBottom: '50px' }}>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <p className="clr-yellow h5 p-top text-warning">About Us</p>
                      <h2 className=" text-al text-left m-text-center letter-h font-weight-bold pt-3 text-white">Service Providers</h2>
                      <p className="text-left text-al m-text-center fs-4 text-white">Ready to offer your services to a wider audience? Sign up as a service provider and let users find and book your services easily.</p>
                      <a href="#" className="btn btn-b float-left btn-theme d-none d-md-block bg-theme fw-bold">Signup &nbsp; &nbsp;<i className="fas fa-arrow-right"></i></a>
                    </div>
                    <div className="col-lg-6 m-pt-3 col-md-12">
                      <img src={business1} className="img-fluid img-br retail-width" alt="Service Providers" />
                    </div>
                  </div>
                </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
          {/* <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner bg-black">
              <div className="carousel-item active">
                <div className="container pad-t-30" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <p className="clr-yellow h5 p-top">About Us</p>
                      <h2 className=" text-al text-left m-text-center letter-h font-weight-bold pt-3 text-white">Restaurant</h2>
                      <p className="text-left text-al  m-text-center fs-4 text-white">Join our community of food enthusiasts! Sign up as a restaurant owner to showcase your menu and attract hungry customers.</p>
                      <a href="#" className="btn btn-b float-left btn-theme d-none d-md-block bg-theme fw-bold">Signup &nbsp; &nbsp;<i className="fas fa-arrow-right"></i></a>
                    </div>
                    <div className="col-lg-6 m-pt-3 col-md-12">
                      <img src={food1} className="img-fluid img-br" alt="Restaurant" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="container pad-t-30" style={{ paddingTop: '100px', paddingBottom: '90px' }}>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <p className="clr-yellow h5 p-top">About Us</p>
                      <h2 className=" text-al text-left m-text-center letter-h font-weight-bold pt-3 text-white">Retailers</h2>
                      <p className="text-left text-al  m-text-center fs-4 text-white">Become a part of the retail revolution! Sign up as a retailer to showcase your products and reach more shoppers.</p>
                      <a href="#" className="btn btn-b float-left btn-theme d-none d-md-block bg-theme fw-bold">Signup &nbsp; &nbsp;<i className="fas fa-arrow-right"></i></a>
                    </div>
                    <div className="col-lg-6 m-pt-3 col-md-12 text-center">
                      <img src={store1} className="img-fluid img-br retail-width" alt="Retailers" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="container pad-t-30" style={{ paddingTop: '100px', paddingBottom: '90px' }}>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <p className="clr-yellow h5 p-top">About Us</p>
                      <h2 className=" text-al text-left m-text-center letter-h font-weight-bold pt-3 text-white">Service Providers</h2>
                      <p className="text-left text-al m-text-center fs-4 text-white">Ready to offer your services to a wider audience? Sign up as a service provider and let users find and book your services easily.</p>
                      <a href="#" className="btn btn-b float-left btn-theme d-none d-md-block bg-theme fw-bold">Signup &nbsp; &nbsp;<i className="fas fa-arrow-right"></i></a>
                    </div>
                    <div className="col-lg-6 m-pt-3 col-md-12">
                      <img src={business1} className="img-fluid img-br retail-width" alt="Service Providers" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </section>

        <section className='bg-black'>
        <div className="container pt-3 pb-5 text-center">
          <div className="row">
            <div className="text-center py-4">
              <h1 className="clr-yellow">Our Features</h1>
              <p className="fw-500 text-white">Personalize your platform by adjusting colors, fonts, and layouts to match your brand, ensuring a unique and appealing presence</p>
            </div>

            <div className="col-4">
              <div className="cards">
                <i className="fa-solid fa-wand-magic-sparkles py-4 pb-2 fs-1 clr-yellow"></i>
                <div className="card-body">
                  <h5 className="card-title text-white">Customize Appearance</h5>
                  <p className="card-text fs-15 pt-2 text-white">Adjust colors, fonts, and layout to create a unique and branded visual identity for your business platform.</p>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="cards">
                <i className="fa-solid fa-file-image py-4 pb-2 fs-1 clr-yellow"></i>
                <div className="card-body">
                  <h5 className="card-title text-white">Convert Content to PDF</h5>
                  <p className="card-text fs-15 pt-2 text-white">Effortlessly turn displayed content into shareable PDFs, maintaining layout integrity and ease of distribution.</p>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="cards">
                <i className="fa-solid fa-file-pdf pt-4 pb-2 fs-1 clr-yellow"></i>
                <div className="card-body">
                  <h5 className="card-title text-white">Convert Content to JPG Image</h5>
                  <p className="card-text fs-15 pt-2 text-white">Instantly transform showcased content into high-quality JPG images for enhanced visual appeal and easy online sharing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Merchants Section */}
      <section className='bg-black text-white'>
        <div className="container pt-5 pb-5">
          <div className="text-center py-4">
            <h1 className=" clr-yellow">Merchants</h1>
            <p className="fw-500 px-5">Our platform offers a tailored space to exhibit their products, menus, or services, enabling them to personalize their brand presence, attract customers, and effortlessly share their content in preferred formats for maximum impact.</p>
          </div>

          <div className="row">
            {/* Restaurant */}
            <div className="col-5">
              <img src={food1} alt="" className="img-fluid" />
            </div>
            <div className="col-7">
              <div className="pt-5 ps-5 pb-3">
                <p className="h1 text-white">Restaurant</p>
              </div>
              {/* Restaurant Details */}
              <div className="row ps-3">
                <div className="col-2 text-end">
                  <i className="fa-solid fa-utensils fs-1 pt-2 clr-yellow"></i>
                </div>
                <div className="col-10">
                  <p className="h4 text-white">Add Your Restaurant</p>
                  <p className="text-secondary">Provide details about your establishment.</p>
                </div>
              </div>
              <div className="row ps-3 pt-2">
                <div className="col-2 text-end">
                  <i className="fa-solid fa-utensils fs-1 pt-2 clr-yellow"></i>
                </div>
                <div className="col-10">
                  <p className="h4 text-white">Category & Subcategory</p>
                  <p className="text-secondary">Organize your menu for easy navigation.</p>
                </div>
              </div>
              <div className="row ps-3 pt-2">
                <div className="col-2 text-end">
                  <i className="fa-solid fa-utensils fs-1 pt-2 clr-yellow"></i>
                </div>
                <div className="col-10">
                  <p className="h4 text-white">Menu Items</p>
                  <p className="text-secondary">Display your offerings with descriptions and prices.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row py-2">
            {/* Retailer */}
            <div className="col-7">
              <div className="pt-5 ps-5 pb-3">
                <p className="h1 text-white">Retailer</p>
              </div>
              {/* Retailer Details */}
              <div className="row ps-3 ">
                <div className="col-2 text-end">
                  <i className="fa-solid fa-store fs-1 pt-2 clr-yellow"></i>
                </div>
                <div className="col-10">
                  <p className="h4 text-white">Create Your Store</p>
                  <p className="text-secondary">Showcase your brand and store information.</p>
                </div>
              </div>
              <div className="row ps-3 pt-2">
                <div className="col-2 text-end">
                  <i className="fa-solid fa-store fs-1 pt-2 clr-yellow"></i>
                </div>
                <div className="col-10">
                  <p className="h4 text-white">Product Catalog</p>
                  <p className="text-secondary">Categorize your products with descriptions.</p>
                </div>
              </div>
            </div>
            <div className="col-5">
              <img src={store1} alt="" className="img-fluid" />
            </div>
          </div>

          <div className="row">
            {/* Service Provider */}
            <div className="col-5">
              <img src={business1} alt="" className="img-fluid" />
            </div>
            <div className="col-7">
              <div className="pt-5 ps-5 pb-3">
                <p className="h1 text-white">Service Provider</p>
              </div>
              {/* Service Provider Details */}
              <div className="row ps-3 ">
                <div className="col-2 text-end">
                  <i className="fa-brands fa-servicestack fs-1 pt-2 clr-yellow"></i>
                </div>
                <div className="col-10">
                  <p className="h4 text-white">Business Profile</p>
                  <p className="text-secondary">Share information about your services and expertise.</p>
                </div>
              </div>
              <div className="row ps-3 pt-2">
                <div className="col-2 text-end">
                  <i className="fa-brands fa-servicestack fs-1 pt-2 clr-yellow"></i>
                </div>
                <div className="col-10">
                  <p className="h4 text-white">Service Listings</p>
                  <p className="text-secondary">Display the range of services you offer with details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        </div>
      <div>

        {/* <div id="carouselExampleIndicators" className="carousel slide" style={{objectFit:"contain !important"}}>
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div className="carousel-inner" id='carousel'>

    <div className='carousel-caption' style={{zIndex:"10"}}>
        <div className='d-flex justify-content-center'>
            <input className='form-control me-2' type='search' placeholder='Search' value={search} onChange={(e) => {setsearch(e.target.value)}}/>
            <button className='btn btn-outline-success text-white bg-success' type='submit'>Search</button>

        </div>
    </div>
    <div className="carousel-item active">
      <img src="https://source.unsplash.com/random/900x700/?burger" className="d-block w-100 img-fluid" alt="..." />
    </div>
    <div className="carousel-item">
      <img src="https://source.unsplash.com/random/900x700/?pastry" className="d-block w-100 img-fluid" alt="..." />
    </div>
    <div className="carousel-item">
      <img src="https://source.unsplash.com/random/900x700/?pizza" className="d-block w-100 img-fluid" alt="..." />
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div> */}

    {/* <div id="carouselExampleIndicators" className="carousel slide bg-dark" style={{objectFit:"contain !important"}}>
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner" id='carousel'>
        <div className="carousel-item active bg-dark">
          <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <p className="clr-yellow h5 p-top">About Us</p>
                      <h2 className=" text-al text-left m-text-center letter-h font-weight-bold pt-3 text-white">Restaurant</h2>
                      <p className="text-left text-al  m-text-center fs-4 text-white">Join our community of food enthusiasts! Sign up as a restaurant owner to showcase your menu and attract hungry customers.</p>
                      <a href="#" className="btn btn-b float-left btn-theme d-none d-md-block bg-theme fw-bold">Signup &nbsp; &nbsp;<i className="fas fa-arrow-right"></i></a>
                    </div>
                    <div className="col-lg-6 m-pt-3 col-md-12">
                      <img src={food1} className="img-fluid img-br" alt="Restaurant" />
                    </div>
                  </div>
                </div>
        </div>
        <div className="carousel-item">
          <div className="container pad-t-30" style={{ paddingTop: '100px', paddingBottom: '90px' }}>
                    <div className="row">
                      <div className="col-lg-6 col-md-12">
                        <p className="clr-yellow h5 p-top">About Us</p>
                        <h2 className=" text-al text-left m-text-center letter-h font-weight-bold pt-3 text-white">Retailers</h2>
                        <p className="text-left text-al  m-text-center fs-4 text-white">Become a part of the retail revolution! Sign up as a retailer to showcase your products and reach more shoppers.</p>
                        <a href="#" className="btn btn-b float-left btn-theme d-none d-md-block bg-theme fw-bold">Signup &nbsp; &nbsp;<i className="fas fa-arrow-right"></i></a>
                      </div>
                      <div className="col-lg-6 m-pt-3 col-md-12 text-center">
                        <img src={store1} className="img-fluid img-br retail-width" alt="Retailers" />
                      </div>
                    </div>
            </div>
        </div>
        <div className="carousel-item">
          <div className="container pad-t-30" style={{ paddingTop: '100px', paddingBottom: '90px' }}>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <p className="clr-yellow h5 p-top">About Us</p>
                      <h2 className=" text-al text-left m-text-center letter-h font-weight-bold pt-3 text-white">Service Providers</h2>
                      <p className="text-left text-al m-text-center fs-4 text-white">Ready to offer your services to a wider audience? Sign up as a service provider and let users find and book your services easily.</p>
                      <a href="#" className="btn btn-b float-left btn-theme d-none d-md-block bg-theme fw-bold">Signup &nbsp; &nbsp;<i className="fas fa-arrow-right"></i></a>
                    </div>
                    <div className="col-lg-6 m-pt-3 col-md-12">
                      <img src={business1} className="img-fluid img-br retail-width" alt="Service Providers" />
                    </div>
                  </div>
                </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div> */}
        </div>
        <div> 
          {/* <Footer/> */}
          <footer class="bg-yellow">
            <div class="text-center pt-4 pb-2">
                <p class="fw-bold text-black">© 2023 MENU MOJI. All Rights Reserved.</p>
            </div>
          </footer>
          </div>
     
    </div>
  )
}
