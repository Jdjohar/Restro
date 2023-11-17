import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { ColorRing } from  'react-loader-spinner'

export default function WeeklyOfferitems() {
  const [ loading, setloading ] = useState(true);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();
  
useEffect(() => {
  const authToken = localStorage.getItem('authToken');
  const signUpType = localStorage.getItem('signuptype');

  if (!authToken || signUpType !== 'Restaurant') {
    navigate('/login');
  }
      fetchOffers();
}, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('https://restroproject.onrender.com/api/weeklyofferitemsall');
      const data = await response.json();

      if (data.success) {
        // Set the fetched offers in state
        setOffers(data.offers);
      } else {
        // Handle error
        console.error('Failed to fetch offers.');
      }
      setloading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };
  function convertTo12HourFormat(time24) {
    // Split the time into hours and minutes
    const [hours, minutes] = time24.split(':');
    
    // Parse the hours and minutes as integers
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    
    // Determine whether it's AM or PM
    const period = hour >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    // Create the formatted time string
    const time12 = `${hour12}:${(minute < 10 ? '0' : '') + minute} ${period}`;
    
    return time12;
  }

  return (
    <div className='bg'>
    {
    loading?
    <div className='row'>
      <ColorRing
    // width={200}
    loading={loading}
    // size={500}
    display="flex"
    justify-content= "center"
    align-items="center"
    aria-label="Loading Spinner"
    data-testid="loader"        
  />
    </div>:
      <div className='container-fluid'>
        <div className='row'>
            <div className='col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none'>
              <div  >
                <Usernavbar/>
              </div>
            </div>

          <div className='col-lg-10 col-md-9 col-12 mx-auto'>
            <div className='d-lg-none d-md-none d-block mt-2'>
                <Nav/>
            </div>

            <div className='bg-white my-5 p-4 box mx-4'>
              <div className='row'>
                <div className=''>
                  <p className='h3 fw-bold'>Weekly Offer Items</p>
                </div>
              </div>
              <hr />

              {/* Display fetched offers */}
              <div className="row offerlist">
                {offers.map((offer) => (
                    <div key={offer._id} className='col-lg-4 col-md-6 col-sm-12 col-12'>
                        <div className="boxitem my-3 py-5 px-4">
                    <p className='fw-bold h4 mb-3'>{offer.offerName}</p>
                    <div className="b-bottom1 mb-3">
                      <div className="d-flex">
                        <i class="fa-solid fa-calendar-days mt-1 me-2 clryllow"></i>
                        <p className='fs-6 fw-bold'> {new Date(offer.startDate).toLocaleDateString()} -</p>
                        <p className='fs-6 fw-bold'>{new Date(offer.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="d-flex">
                        <i class="fa-solid fa-clock mt-1 me-2 clryllow"></i>
                        <p className='fs-6 fw-bold'>{convertTo12HourFormat(offer.startTime)} - </p>
                        <p className='fs-6 fw-bold'> {convertTo12HourFormat(offer.endTime)}</p>
                      </div>
                    </div>
                    <div className='b-bottom1 mb-3'>
                      <p className='fs-5 fw-normal mb-0'>Days</p>
                        <ul>
                              {offer.selectedDays.map((result, index) => (
                                <li key={result.value} className=' badge btn btn-primary me-2 my-2 fs-6'>{result}
                                  {index < offer.selectedDays.length - 1}</li>
                              ))}
                        </ul>
                    </div>

                    <div>
                      <p className='fs-5 fw-normal mb-0'>Items</p>
                        <ul className='itemlist'>
                            {offer.searchResults.map((result,index) => (
                            <li key={result.value} className=' badge btn btn-primary me-2 my-2 fs-6'>{result.label}
                            {index < offer.searchResults.length - 1}</li>
                            ))}
                        </ul>
                    
                      <p className='h4 fw-bold pt-3'>RS. {offer.price} /-</p>
                    </div>
                  </div>

                        </div>
                ))}
              </div>
              {/* {offers.map((offer) => (
                <div key={offer._id} className='col-6'>
                  <h3>Offer Details</h3>
                  <p>Start Time: {offer.startTime}</p>
                  <p>End Time: {offer.endTime}</p>
                  <p>Selected Days: {offer.selectedDays.join(', ')}</p>
                  <p>Search Results:</p>
                  <ul>
                    {offer.searchResults.map((result) => (
                      <li key={result.value}>{result.label}</li>
                    ))}
                  </ul>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
}
    </div>
  );
}

