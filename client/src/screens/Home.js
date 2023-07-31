import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Carousal from '../components/Carousal';

export default function Home() {

  const [search, setsearch] = useState('');
  const [foodcat, setfoodcat] = useState([]);
  const [foodItems, setfoodItems] = useState([]);


  const loadData = async () => {
    let response = await fetch("http://localhost:3001/api/foodData",{
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

        <div id="carouselExampleIndicators" className="carousel slide" style={{objectFit:"contain !important"}}>
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
</div>
        </div>
        <div className='container'>

         
          

        </div>
        <div> <Footer/></div>
     
    </div>
  )
}
