import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';

export default function WeeklyOfferitems() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Fetch offers from the backend when the component mounts
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/weeklyofferitemsall');
      const data = await response.json();

      if (data.success) {
        // Set the fetched offers in state
        setOffers(data.offers);
      } else {
        // Handle error
        console.error('Failed to fetch offers.');
      }
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
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-2 vh-100 p-0' style={{ backgroundColor: '#fff' }}>
            <Usernavbar />
          </div>

          <div className='col-10'>
            <div className='bg-white mt-5 p-3 box mb-5'>
              <div className='row'>
                <div className='col-4 me-auto'>
                  <p className='h2'>Weekly Offer Items</p>
                </div>
              </div>
              <hr />

              {/* Display fetched offers */}
              <div className="row offerlist">
                {offers.map((offer) => (
                    <div key={offer._id} className='col-6'>
                        <div className="boxitem my-3 p-3">
                    <h2 className='text-center'>{offer.offerName}</h2>
                    <div className="d-flex">
                        <div className="col-6 me-auto">
                            <p className='fs-4'>Start Time: {convertTo12HourFormat(offer.startTime)}</p>
                        </div>
                        <div className="col-6">
                            <p className='fs-4 text-end'>End Time: {convertTo12HourFormat(offer.endTime)}</p>
                        </div>
                    </div>
                    <p className='fs-5 ps-3'>Days: {offer.selectedDays.join(', ')}</p>
                    <ul className='itemlist'>
                    <span className='fs-5 ps-3'>Items: </span>
                        {offer.searchResults.map((result,index) => (
                        <li key={result.value} className='fs-5'>{result.label}
                        {index < offer.searchResults.length - 1 && ', '}</li>
                        ))}
                    </ul>
                    <p className='text-right h3'>{offer.price} RS/-</p>
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
    </div>
  );
}

